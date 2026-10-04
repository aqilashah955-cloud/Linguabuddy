// LinguaBuddy — 🌍 More International Tests (TOEFL iBT, PTE Academic,
// Cambridge B2 First / C1 Advanced, TOEIC, OET starter).
// Practice sections with exam-realistic formats: TTS "audio" for listening
// (the ONLY TTS, from js/tts.js), timers, mic recording, self-rating.
// All scores are PRACTICE ESTIMATES — never official. Pure helpers are
// exported for node tests; everything touching document lives in functions.

import { TOEFL, PTE, CAMBRIDGE, TOEIC, OET } from "../data/moretests.js";
import { S, recordAttempt, touchStreak } from "./store.js";
import { awardXP, checkBadges, toast } from "./gamify.js";
import { showScreen as show } from "./ui.js";
import { esc, shuffle, fmtTime } from "./utils.js";
import { speak, stopSpeak, ttsAvailable } from "./tts.js";
import { analyzeWriting } from "./writing.js";
import { printHTML } from "./worksheets.js";

function $(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }
function stage() { return $("mtStage"); }

let go = null;
export function setMoreTestsGo(fn) { go = fn; }

/* ================= pure score helpers (node-testable) ================= */

export function clampPct(p) { return Math.max(0, Math.min(100, p)); }

/** TOEFL section score 0–30 from raw correct/total. */
export function toeflSectionScore(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 30);
}
export function toeflTotal(s4) {
  return s4.reduce(function (a, b) { return a + b; }, 0);
}

/** PTE overall 10–90 from raw correct/total. */
export function pteScore(correct, total) {
  if (!total) return 10;
  return 10 + Math.round((correct / total) * 80);
}

/** Cambridge B2 First practice grade from percent. */
export function cambridgeB2(pct) {
  pct = clampPct(pct);
  if (pct >= 85) return { grade: "Grade A", note: "Exceptional — C1 level shown" };
  if (pct >= 75) return { grade: "Grade B", note: "Strong B2 pass" };
  if (pct >= 65) return { grade: "Grade C", note: "B2 pass" };
  if (pct >= 55) return { grade: "Level B1", note: "Just below B2 — keep practicing" };
  return { grade: "Below B1", note: "More foundation work needed" };
}

/** Cambridge C1 Advanced practice grade from percent. */
export function cambridgeC1(pct) {
  pct = clampPct(pct);
  if (pct >= 80) return { grade: "Grade A", note: "Exceptional — C2 level shown" };
  if (pct >= 70) return { grade: "Grade B", note: "Strong C1 pass" };
  if (pct >= 60) return { grade: "Grade C", note: "C1 pass" };
  if (pct >= 50) return { grade: "Level B2", note: "Just below C1 — keep practicing" };
  return { grade: "Below B2", note: "More foundation work needed" };
}

/** TOEIC section score 5–495 (approximate) from raw correct/total. */
export function toeicSection(correct, total) {
  if (!total) return 5;
  var raw = 5 + (correct / total) * 490;
  return Math.round(raw / 5) * 5;
}
export function toeicTotal(listening, reading) { return listening + reading; }

/** Grade MCQ items [{a}] against answers [index]. */
export function scoreMCQ(items, answers) {
  var correct = 0;
  items.forEach(function (it, i) {
    if (answers[i] === it.a) correct++;
  });
  return { correct: correct, total: items.length };
}

/** Grade fill items [{a}] against answers [string] (case-insensitive). */
export function scoreFill(items, answers) {
  var correct = 0;
  items.forEach(function (it, i) {
    var got = String(answers[i] == null ? "" : answers[i]).trim().toLowerCase();
    if (got && got === String(it.a).trim().toLowerCase()) correct++;
  });
  return { correct: correct, total: items.length };
}

export function pctOf(correct, total) {
  return total ? Math.round((correct / total) * 100) : 0;
}

/* ================= generic UI helpers ================= */

let timerId = null;
function clearTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

function startTimer(secs, el, onEnd) {
  clearTimer();
  var left = secs;
  function tick() {
    if (el) el.textContent = "⏱ " + fmtTime(Math.max(0, left));
    if (left <= 0) { clearTimer(); if (onEnd) onEnd(); return; }
    left--;
  }
  tick();
  timerId = setInterval(tick, 1000);
}

function hubBar(title, sub) {
  return '<div class="mt-hubbar"><button class="back-btn" data-mtback>← Tests</button>' +
    "<div><h2>" + title + "</h2>" + (sub ? '<p class="fine">' + sub + "</p>" : "") + "</div></div>";
}
function wireBack() {
  var b = stage().querySelector("[data-mtback]");
  if (b) b.addEventListener("click", function () { stopSpeak(); clearTimer(); showMoreTests(); });
}

function estimateNote() {
  return '<p class="fine">⚠️ Practice estimate only — not an official score.</p>';
}

/** TTS play button with replay limit. */
function ttsPlayHTML(id, label) {
  return '<button class="btn-primary" id="' + id + '">' + (label || "▶ Play audio") + '</button> ' +
    '<span class="fine" id="' + id + '-n"></span>';
}
function wireTtsPlay(id, text, maxPlays) {
  var plays = 0;
  var btn = $(id), note = $(id + "-n");
  if (!btn) return;
  if (!ttsAvailable()) { btn.disabled = true; if (note) note.textContent = "Audio not available on this device — read the script instead."; return; }
  btn.addEventListener("click", function () {
    if (plays >= maxPlays) return;
    plays++;
    speak(text);
    if (note) note.textContent = "Played " + plays + "/" + maxPlays;
    btn.disabled = plays >= maxPlays;
  });
}

/** Star rating input (1–5). */
function starsHTML(id, label) {
  var h = '<div class="mt-stars"><span>' + esc(label) + '</span><span class="mt-starwrap" id="' + id + '">';
  for (var i = 1; i <= 5; i++) h += '<button type="button" data-star="' + i + '">☆</button>';
  return h + "</span></div>";
}
function wireStars(id) {
  var wrap = $(id);
  if (!wrap) return;
  wrap.querySelectorAll("[data-star]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = parseInt(b.getAttribute("data-star"), 10);
      wrap.setAttribute("data-val", v);
      wrap.querySelectorAll("[data-star]").forEach(function (x) {
        x.textContent = parseInt(x.getAttribute("data-star"), 10) <= v ? "★" : "☆";
      });
    });
  });
}
function starsVal(id) {
  var wrap = $(id);
  return wrap ? parseInt(wrap.getAttribute("data-val") || "0", 10) : 0;
}

/** MediaRecorder helper — fully guarded. */
function recSupported() {
  return typeof window !== "undefined" && typeof window.MediaRecorder !== "undefined" &&
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
function makeRecorder() {
  var rec = null, chunks = [], stream = null, url = null;
  return {
    supported: recSupported(),
    start: async function () {
      if (!recSupported()) return false;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        chunks = [];
        rec = new MediaRecorder(stream);
        rec.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
        rec.start();
        return true;
      } catch (e) { return false; }
    },
    stop: function () {
      return new Promise(function (resolve) {
        if (!rec) { resolve(null); return; }
        rec.onstop = function () {
          try {
            var blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
            url = URL.createObjectURL(blob);
          } catch (e) { url = null; }
          if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
          resolve(url);
        };
        try { rec.stop(); } catch (e) { resolve(null); }
      });
    }
  };
}

/** Generic MCQ runner with timer. items: [{t, o[], a}]. */
function mcqRunner(cfg) {
  // cfg: {title, introHTML, items, secs, timerLabel, onDone({correct,total})}
  var st = stage();
  st.innerHTML = hubBar(cfg.title, cfg.sub || "") +
    '<div class="mt-card">' + (cfg.introHTML || "") +
    '<p class="fine">⏱ ' + (cfg.timerLabel || "Practice timer (shortened)") + ': <strong id="mtTimer"></strong></p>' +
    '<button class="btn-primary btn-big" id="mtStart">Start →</button></div>';
  wireBack();
  $("mtStart").addEventListener("click", function () {
    var h = '<form id="mtQ">';
    cfg.items.forEach(function (it, i) {
      h += '<div class="mt-q"><p><strong>' + (i + 1) + ".</strong> " + esc(it.t) + "</p>";
      it.o.forEach(function (op, j) {
        h += '<label class="mt-opt"><input type="radio" name="q' + i + '" value="' + j + '"> ' + esc(op) + "</label>";
      });
      h += "</div>";
    });
    h += '<button type="submit" class="btn-primary btn-big">Submit answers</button></form>';
    st.innerHTML = hubBar(cfg.title) + '<div class="mt-card"><p class="fine">⏱ <strong id="mtTimer"></strong></p>' + h + "</div>";
    wireBack();
    var done = false;
    function finish() {
      if (done) return; done = true; clearTimer();
      var answers = cfg.items.map(function (_, i) {
        var c = st.querySelector('input[name="q' + i + '"]:checked');
        return c ? parseInt(c.value, 10) : -1;
      });
      cfg.onDone(scoreMCQ(cfg.items, answers), answers);
    }
    startTimer(cfg.secs, $("mtTimer"), finish);
    $("mtQ").addEventListener("submit", function (e) { e.preventDefault(); finish(); });
  });
}

/** Generic fill-in-the-blank runner. items: [{s (with ___), a}]. */
function fillRunner(cfg) {
  var st = stage();
  st.innerHTML = hubBar(cfg.title, cfg.sub || "") +
    '<div class="mt-card">' + (cfg.introHTML || "") +
    '<p class="fine">⏱ ' + (cfg.timerLabel || "Practice timer (shortened)") + ': <strong id="mtTimer"></strong></p>' +
    '<button class="btn-primary btn-big" id="mtStart">Start →</button></div>';
  wireBack();
  $("mtStart").addEventListener("click", function () {
    var h = '<form id="mtQ">';
    cfg.items.forEach(function (it, i) {
      var parts = String(it.s).split("___");
      h += '<div class="mt-q"><p><strong>' + (i + 1) + ".</strong> " + esc(parts[0]) +
        '<input class="mt-blank" name="f' + i + '" autocomplete="off"> ' + esc(parts[1] || "") +
        (it.root ? ' <span class="fine">(' + esc(it.root) + ")</span>" : "") + "</p></div>";
    });
    h += '<button type="submit" class="btn-primary btn-big">Check answers</button></form>';
    st.innerHTML = hubBar(cfg.title) + '<div class="mt-card"><p class="fine">⏱ <strong id="mtTimer"></strong></p>' + h + "</div>";
    wireBack();
    var done = false;
    function finish() {
      if (done) return; done = true; clearTimer();
      var answers = cfg.items.map(function (_, i) {
        var inp = st.querySelector('input[name="f' + i + '"]');
        return inp ? inp.value : "";
      });
      cfg.onDone(scoreFill(cfg.items, answers), answers);
    }
    startTimer(cfg.secs, $("mtTimer"), finish);
    $("mtQ").addEventListener("submit", function (e) { e.preventDefault(); finish(); });
  });
}

/** Results screen: score + estimate + XP + print + back. */
function finishSection(cfg) {
  // cfg: {title, correct, total, estimateHTML, reviewHTML, xp, nextHTML}
  clearTimer(); stopSpeak();
  touchStreak();
  var xp = cfg.xp || Math.max(5, Math.round((cfg.correct / Math.max(1, cfg.total)) * 30));
  awardXP(xp, cfg.title);
  recordAttempt({ kind: "moretest", mode: "practice", title: cfg.title, score: cfg.correct, total: cfg.total, date: Date.now() });
  checkBadges();
  var st = stage();
  st.innerHTML = hubBar(cfg.title) +
    '<div class="mt-card mt-result"><div class="mt-score">' + cfg.correct + "/" + cfg.total +
    ' <span class="fine">(' + pctOf(cfg.correct, cfg.total) + '%)</span></div>' +
    (cfg.estimateHTML || "") + estimateNote() +
    (cfg.reviewHTML || "") +
    '<div class="row-btns"><button class="btn-primary" id="mtPrint">🖨️ Print report</button>' +
    '<button class="btn-ghost" data-mtback2>← Back</button></div>' +
    (cfg.nextHTML || "") + "</div>";
  wireBack();
  st.querySelector("[data-mtback2]").addEventListener("click", function () { showMoreTests(); });
  $("mtPrint").addEventListener("click", function () {
    printHTML('<h2>' + esc(cfg.title) + " — practice report</h2>" +
      "<p>Score: <strong>" + cfg.correct + "/" + cfg.total + " (" + pctOf(cfg.correct, cfg.total) + "%)</strong></p>" +
      (cfg.estimateHTML || "") + "<p><em>Practice estimate only — not an official score.</em></p>" +
      (cfg.nextHTML || ""));
  });
}

/** Review list for MCQ answers. */
function mcqReview(items, answers) {
  var h = '<div class="mt-review"><h3>Review</h3>';
  items.forEach(function (it, i) {
    var ok = answers[i] === it.a;
    h += '<div class="mt-rev ' + (ok ? "ok" : "bad") + '"><p><strong>' + (i + 1) + ".</strong> " + esc(it.t) + "</p>" +
      '<p class="fine">Your answer: ' + esc(answers[i] >= 0 ? it.o[answers[i]] : "—") +
      (ok ? " ✓" : ' ✗ — correct: <strong>' + esc(it.o[it.a]) + "</strong>") + "</p></div>";
  });
  return h + "</div>";
}
function fillReview(items, answers) {
  var h = '<div class="mt-review"><h3>Review</h3>';
  items.forEach(function (it, i) {
    var got = String(answers[i] || "").trim();
    var ok = got.toLowerCase() === String(it.a).trim().toLowerCase();
    h += '<div class="mt-rev ' + (ok ? "ok" : "bad") + '"><p><strong>' + (i + 1) + ".</strong> " + esc(it.s.replace("___", "_____")) + "</p>" +
      '<p class="fine">You wrote: ' + esc(got || "—") + (ok ? " ✓" : ' ✗ — answer: <strong>' + esc(it.a) + "</strong>") + "</p></div>";
  });
  return h + "</div>";
}

/** Speaking task: staged read/listen → prep timer → talk timer + record → self-rating. */
function speakTask(cfg) {
  // cfg: {title, readHTML, readSecs, listenText, prompt, prepSecs, talkSecs, criteria[], scoreNote, scoreMap(starAvg)->estimateHTML}
  var st = stage();
  var h = hubBar(cfg.title) + '<div class="mt-card">';
  if (cfg.readHTML) h += '<div class="mt-read">' + cfg.readHTML + "</div>";
  if (cfg.listenText) h += '<p>' + ttsPlayHTML("mtListen", "▶ Play lecture (once)") + '</p>';
  h += '<div class="mt-prompt">' + cfg.prompt + "</div>";
  h += '<button class="btn-primary btn-big" id="mtPrep">Start preparation (' + cfg.prepSecs + 's)</button>';
  h += '<div id="mtStage2"></div></div>';
  st.innerHTML = h;
  wireBack();
  wireTtsPlay("mtListen", cfg.listenText, 1);
  $("mtPrep").addEventListener("click", function () {
    $("mtPrep").disabled = true;
    var s2 = $("mtStage2");
    s2.innerHTML = '<p class="fine">Prepare… <strong id="mtTimer"></strong></p>';
    startTimer(cfg.prepSecs, $("mtTimer"), function () {
      var rec = makeRecorder();
      s2.innerHTML = '<p class="fine">🎤 Speak now! <strong id="mtTimer2"></strong></p>' +
        (rec.supported ? '<p class="fine">Recording… <button class="btn-ghost" id="mtRecStop" disabled>Stop & play back</button></p><div id="mtPlay"></div>'
          : '<p class="fine">🎤 Mic recording not supported here — just speak aloud.</p>') +
        '<button class="btn-primary btn-big" id="mtDone">I\'m done speaking</button>';
      var recOk = false;
      rec.start().then(function (ok) { recOk = ok; });
      startTimer(cfg.talkSecs, $("mtTimer2"), function () { $("mtDone").click(); });
      var sb = $("mtRecStop");
      if (sb) sb.disabled = false;
      if (sb) sb.addEventListener("click", async function () {
        var url = await rec.stop();
        if (url) $("mtPlay").innerHTML = '<audio controls src="' + url + '"></audio>';
      });
      $("mtDone").addEventListener("click", async function () {
        clearTimer();
        if (recOk) await rec.stop();
        var rh = '<h3>How did you do? Rate yourself honestly.</h3>';
        cfg.criteria.forEach(function (c, i) { rh += starsHTML("mtStar" + i, c); });
        rh += '<button class="btn-primary btn-big" id="mtFinish">See my estimate</button>';
        s2.innerHTML = rh;
        cfg.criteria.forEach(function (_, i) { wireStars("mtStar" + i); });
        $("mtFinish").addEventListener("click", function () {
          var vals = cfg.criteria.map(function (_, i) { return starsVal("mtStar" + i); });
          var avg = vals.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, vals.length);
          finishSection({
            title: cfg.title, correct: Math.round(avg * 20), total: 100,
            estimateHTML: cfg.scoreMap(avg) + '<p class="fine">' + esc(cfg.scoreNote || "") + "</p>",
            xp: 25,
            nextHTML: "<h3>Tip</h3><p>" + esc(cfg.tip || "Record yourself next time and compare — hearing your own English is the fastest way to improve.") + "</p>"
          });
        });
      });
    });
  });
}

/** Writing task: guide → textarea + timer → analyzeWriting mapped to criteria. */
function writeTask(cfg) {
  // cfg: {title, introHTML, guideHTML, minutes, criteria[], tip}
  var st = stage();
  st.innerHTML = hubBar(cfg.title) + '<div class="mt-card">' + (cfg.introHTML || "") +
    (cfg.guideHTML ? '<details class="mt-guide"><summary>📋 Structure guide</summary>' + cfg.guideHTML + "</details>" : "") +
    '<p class="fine">⏱ <strong id="mtTimer"></strong></p>' +
    '<textarea id="mtText" class="mt-area" placeholder="Write here…"></textarea>' +
    '<button class="btn-primary btn-big" id="mtCheck">Get feedback</button><div id="mtFb"></div></div>';
  wireBack();
  startTimer(cfg.minutes * 60, $("mtTimer"), function () { toast("⏱ Time! Submit when ready."); });
  $("mtCheck").addEventListener("click", function () {
    clearTimer();
    var text = $("mtText").value;
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    var res = analyzeWriting(text, "");
    var h = '<h3>Feedback (' + words + ' words)</h3>';
    if (!res.issues.length) {
      h += '<p>✅ No major issues found — well done! Try a harder prompt next.</p>';
    } else {
      cfg.criteria.forEach(function (c) {
        var rel = res.issues.filter(function (x) { return x.category === c.key; });
        h += '<div class="mt-crit"><strong>' + esc(c.name) + "</strong>";
        if (!rel.length) h += '<p class="fine">Looks good here. ✅</p>';
        rel.forEach(function (x) {
          h += '<p>🔎 <em>' + esc(x.found) + "</em> — " + esc(x.explain) + "<br>💡 " + esc(x.hint) + "</p>";
        });
        h += "</div>";
      });
      var other = res.issues.filter(function (x) { return !cfg.criteria.some(function (c) { return c.key === x.category; }); });
      other.forEach(function (x) {
        h += '<p>🔎 <em>' + esc(x.found) + "</em> — " + esc(x.explain) + "<br>💡 " + esc(x.hint) + "</p>";
      });
    }
    h += '<p class="fine">⚠️ Automated feedback on language only — organization and ideas need a teacher\'s eye.</p>';
    $("mtFb").innerHTML = h;
    awardXP(25, cfg.title);
    recordAttempt({ kind: "moretest", mode: "practice", title: cfg.title, score: words, total: 0, date: Date.now() });
    checkBadges();
    $("mtFb").scrollIntoView();
  });
}

function tipsCard(tips) {
  return '<div class="mt-card"><h3>💡 Exam tips</h3><ul class="mt-tips">' +
    tips.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
}

/* ================= TOEFL iBT ================= */

function toeflHub() {
  var st = stage();
  st.innerHTML = hubBar("🎓 TOEFL iBT", "Reading · Listening · Speaking · Writing — exam-style practice.") +
    '<div class="mt-grid">' +
    [["reading", "📖", "Reading", "2 academic passages × 6 questions"], ["listening", "🎧", "Listening", "2 talks × 5 questions (audio plays once + 1 replay)"], ["speaking", "🗣️", "Speaking", "4 tasks with real timers + recording"], ["writing", "✍️", "Writing", "Integrated + independent essays with feedback"], ["tips", "💡", "Tips", "6 exam tips"]].map(function (x) {
      return '<button class="mt-btn" data-t="' + x[0] + '"><span class="mt-emoji">' + x[1] + '</span><span class="mt-t">' + x[2] + '</span><span class="fine">' + x[3] + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-t");
      if (k === "reading") toeflReadingPick();
      else if (k === "listening") toeflListeningPick();
      else if (k === "speaking") toeflSpeakingPick();
      else if (k === "writing") toeflWritingPick();
      else { stage().innerHTML = hubBar("🎓 TOEFL iBT — Tips") + tipsCard(TOEFL.tips); wireBack(); }
    });
  });
}

function toeflReadingPick() {
  var st = stage();
  st.innerHTML = hubBar("🎓 TOEFL Reading", "Pick a passage.") + '<div class="mt-grid">' +
    TOEFL.reading.map(function (p, i) {
      return '<button class="mt-btn" data-p="' + i + '"><span class="mt-emoji">📖</span><span class="mt-t">' + esc(p.title) + '</span><span class="fine">6 questions</span></button>';
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = TOEFL.reading[parseInt(b.getAttribute("data-p"), 10)];
      mcqRunner({
        title: "TOEFL Reading: " + p.title,
        introHTML: '<div class="mt-passage">' + esc(p.text).replace(/\n\n/g, "</p><p>").replace(/^/, "<p>").replace(/$/, "</p>") + "</div>",
        items: p.questions, secs: 600,
        timerLabel: "Practice timer: 10 min (real test: ~35 min for 2 passages)",
        onDone: function (r, answers) {
          finishSection({
            title: "TOEFL Reading: " + p.title, correct: r.correct, total: r.total,
            estimateHTML: '<p><strong>Section estimate: ' + toeflSectionScore(r.correct, r.total) + '/30</strong></p>',
            reviewHTML: mcqReview(p.questions, answers),
            nextHTML: "<h3>Next step</h3><p>" + (r.correct >= 5 ? "Excellent — try the second passage or move to Listening." : "Re-read the passage slowly and retry — aim for 5+/6.") + "</p>"
          });
        }
      });
    });
  });
}

function toeflListeningPick() {
  var st = stage();
  st.innerHTML = hubBar("🎓 TOEFL Listening", "Audio plays once + 1 replay, like the real test.") + '<div class="mt-grid">' +
    TOEFL.listening.map(function (p, i) {
      return '<button class="mt-btn" data-p="' + i + '"><span class="mt-emoji">🎧</span><span class="mt-t">' + esc(p.title) + '</span><span class="fine">5 questions</span></button>';
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = TOEFL.listening[parseInt(b.getAttribute("data-p"), 10)];
      var s2 = stage();
      s2.innerHTML = hubBar("🎓 TOEFL Listening: " + p.title) +
        '<div class="mt-card"><p>Listen carefully, then answer 5 questions.</p><p>' + ttsPlayHTML("mtAud") + "</p>" +
        '<button class="btn-primary btn-big" id="mtToQ">Continue to questions →</button></div>';
      wireBack();
      wireTtsPlay("mtAud", p.script.replace(/\n/g, " "), 2);
      $("mtToQ").addEventListener("click", function () {
        stopSpeak();
        mcqRunner({
          title: "TOEFL Listening: " + p.title,
          introHTML: '<p class="fine">Answer from what you heard.</p>',
          items: p.questions, secs: 300, timerLabel: "Practice timer: 5 min",
          onDone: function (r, answers) {
            finishSection({
              title: "TOEFL Listening: " + p.title, correct: r.correct, total: r.total,
              estimateHTML: '<p><strong>Section estimate: ' + toeflSectionScore(r.correct, r.total) + '/30</strong></p>',
              reviewHTML: mcqReview(p.questions, answers)
            });
          }
        });
      });
    });
  });
}

function toeflSpeakingPick() {
  var st = stage();
  st.innerHTML = hubBar("🎓 TOEFL Speaking", "Real timers. Recording is optional.") + '<div class="mt-grid">' +
    TOEFL.speaking.map(function (t, i) {
      return '<button class="mt-btn" data-p="' + i + '"><span class="mt-emoji">🗣️</span><span class="mt-t">' + esc(t.title) + '</span><span class="fine">' + (t.kind === "independent" ? "opinion" : "integrated") + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = TOEFL.speaking[parseInt(b.getAttribute("data-p"), 10)];
      speakTask({
        title: "TOEFL Speaking: " + t.title,
        readHTML: t.read ? '<p class="fine">Read (45s in the real test):</p><p>' + esc(t.read) + "</p>" : null,
        listenText: t.listen || null,
        prompt: "<p><strong>Question:</strong> " + esc(t.prompt) + "</p>",
        prepSecs: t.prep, talkSecs: t.talk,
        criteria: ["Delivery (fluency, pronunciation)", "Language use (grammar, vocabulary)", "Topic development"],
        scoreMap: function (avg) {
          return "<p><strong>Speaking estimate: " + Math.round(avg / 5 * 30) + "/30</strong> (from your self-rating)</p>";
        },
        scoreNote: "In the real test, trained raters score delivery, language use, and topic development.",
        tip: "Use all the time — a full answer with a clear beginning, middle, and end scores higher."
      });
    });
  });
}

function toeflWritingPick() {
  var st = stage();
  st.innerHTML = hubBar("🎓 TOEFL Writing") + '<div class="mt-grid">' +
    TOEFL.writing.map(function (t, i) {
      return '<button class="mt-btn" data-p="' + i + '"><span class="mt-emoji">✍️</span><span class="mt-t">' + esc(t.title) + '</span><span class="fine">' + t.minutes + " min</span></button>";
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = TOEFL.writing[parseInt(b.getAttribute("data-p"), 10)];
      var intro = "<p><strong>Task:</strong> " + esc(t.prompt) + "</p>";
      if (t.read) intro += '<div class="mt-read"><p class="fine">Reading passage:</p><p>' + esc(t.read) + "</p></div>";
      if (t.listen) intro += "<p>" + ttsPlayHTML("mtAud", "▶ Play lecture (once)") + "</p>";
      writeTask({
        title: "TOEFL Writing: " + t.title, introHTML: intro, minutes: t.minutes,
        guideHTML: "<ul><li>Paragraph 1: introduce the topic / summarize the key contrast</li><li>Paragraphs 2–3: develop each main point with detail</li><li>Final paragraph: conclude clearly</li></ul>",
        criteria: [{ key: "grammar", name: "Language use" }, { key: "vocabulary", name: "Vocabulary range" }, { key: "organization", name: "Organization" }],
        tip: "Integrated task: show how the lecture CHALLENGES the reading — that contrast is what raters look for."
      });
      if (t.listen) wireTtsPlay("mtAud", t.listen.replace(/\n/g, " "), 1);
    });
  });
}

/* ================= PTE Academic ================= */

function pteHub() {
  var st = stage();
  var secs = [["ra", "🔊", "Read Aloud", "6 texts — record & self-rate"], ["fib", "✏️", "Fill in the Blanks", "8 single-word blanks"], ["rs", "👂", "Repeat Sentence", "8 sentences — listen once, repeat"], ["di", "🖼️", "Describe Image", "4 prompts — 40s to speak"], ["rl", "🎙️", "Retell Lecture", "4 mini-lectures — retell in 40s"], ["we", "✍️", "Write Essay", "4 prompts — 20 min"], ["tips", "💡", "Tips", "6 PTE tips"]];
  st.innerHTML = hubBar("🎤 PTE Academic", "Computer-scored skills — clear, steady English wins.") +
    '<div class="mt-grid">' + secs.map(function (x) {
      return '<button class="mt-btn" data-t="' + x[0] + '"><span class="mt-emoji">' + x[1] + '</span><span class="mt-t">' + x[2] + '</span><span class="fine">' + x[3] + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-t");
      if (k === "ra") pteReadAloud();
      else if (k === "fib") pteFib();
      else if (k === "rs") pteRepeat();
      else if (k === "di") pteDescribe();
      else if (k === "rl") pteRetell();
      else if (k === "we") pteEssay();
      else { stage().innerHTML = hubBar("🎤 PTE Academic — Tips") + tipsCard(PTE.tips); wireBack(); }
    });
  });
}

function pteReadAloud() {
  var i = Math.floor(Math.random() * PTE.readAloud.length);
  var text = PTE.readAloud[i];
  speakTask({
    title: "PTE Read Aloud", prompt: '<p class="fine">Read this text aloud naturally:</p><p class="mt-bigtext">' + esc(text) + "</p>",
    prepSecs: 10, talkSecs: 40,
    criteria: ["Content (all words read)", "Fluency (smooth rhythm)", "Pronunciation (clear sounds)"],
    scoreMap: function (avg) { return "<p><strong>PTE-style estimate: " + Math.round(10 + avg / 5 * 80) + "/90</strong></p>"; },
    scoreNote: "PTE scores content, fluency, and pronunciation separately.",
    tip: "Stress the important words and pause at commas — rhythm matters as much as pronunciation."
  });
}

function pteFib() {
  fillRunner({
    title: "PTE Fill in the Blanks (R&W)",
    introHTML: "<p>Type the missing word in each sentence.</p>",
    items: PTE.fibRW, secs: 300, timerLabel: "Practice timer: 5 min",
    onDone: function (r, answers) {
      finishSection({
        title: "PTE Fill in the Blanks", correct: r.correct, total: r.total,
        estimateHTML: "<p><strong>PTE-style estimate: " + pteScore(r.correct, r.total) + "/90</strong></p>",
        reviewHTML: fillReview(PTE.fibRW, answers),
        nextHTML: "<h3>Next step</h3><p>Think in <strong>collocations</strong> — words that naturally go together.</p>"
      });
    }
  });
}

function pteRepeat() {
  var i = Math.floor(Math.random() * PTE.repeatSentence.length);
  var s = PTE.repeatSentence[i];
  var st = stage();
  st.innerHTML = hubBar("🎤 PTE Repeat Sentence") + '<div class="mt-card">' +
    "<p>You will hear the sentence <strong>once</strong>. Repeat it exactly.</p><p>" + ttsPlayHTML("mtAud") + "</p>" +
    '<button class="btn-primary btn-big" id="mtGo">I\'m ready to repeat →</button><div id="mtS2"></div></div>';
  wireBack();
  wireTtsPlay("mtAud", s, 1);
  $("mtGo").addEventListener("click", function () {
    stopSpeak();
    var rec = makeRecorder();
    var s2 = $("mtS2");
    s2.innerHTML = '<p class="fine">🎤 Repeat now! <strong id="mtTimer"></strong></p>' +
      (rec.supported ? '<p class="fine">Recording…</p>' : '<p class="fine">Mic not supported — say it aloud.</p>') +
      '<button class="btn-primary btn-big" id="mtDone">Done</button><div id="mtPlay"></div>';
    var recOk = false;
    rec.start().then(function (ok) { recOk = ok; });
    startTimer(15, $("mtTimer"), function () { $("mtDone").click(); });
    $("mtDone").addEventListener("click", async function () {
      clearTimer();
      var url = recOk ? await rec.stop() : null;
      var h = '<h3>Target sentence</h3><p class="mt-bigtext">' + esc(s) + "</p>";
      if (url) h += '<p>Your recording:</p><audio controls src="' + url + '"></audio>';
      h += "<p>Did you get every word, in order?</p>" + starsHTML("mtS", "Content accuracy") + starsHTML("mtF", "Fluency") +
        '<button class="btn-primary btn-big" id="mtFin">See my estimate</button>';
      s2.innerHTML = h;
      wireStars("mtS"); wireStars("mtF");
      $("mtFin").addEventListener("click", function () {
        var avg = (starsVal("mtS") + starsVal("mtF")) / 2;
        finishSection({
          title: "PTE Repeat Sentence", correct: Math.round(avg * 20), total: 100,
          estimateHTML: "<p><strong>PTE-style estimate: " + Math.round(10 + avg / 5 * 80) + "/90</strong></p>",
          nextHTML: "<h3>Next step</h3><p>Break long sentences into 3–4 chunks in your head as you listen.</p>"
        });
      });
    });
  });
}

function pteDescribe() {
  var i = Math.floor(Math.random() * PTE.describeImage.length);
  var d = PTE.describeImage[i];
  speakTask({
    title: "PTE Describe Image",
    prompt: '<p class="fine">Study this visual (described):</p><p class="mt-bigtext">' + esc(d.desc) + "</p><p><strong>" + esc(d.prompt) + "</strong></p>",
    prepSecs: 25, talkSecs: 40,
    criteria: ["Content (key features mentioned)", "Fluency", "Pronunciation"],
    scoreMap: function (avg) { return "<p><strong>PTE-style estimate: " + Math.round(10 + avg / 5 * 80) + "/90</strong></p>"; },
    tip: "40 seconds = overview, 2–3 key features, one concluding sentence."
  });
}

function pteRetell() {
  var i = Math.floor(Math.random() * PTE.retellLecture.length);
  var s = PTE.retellLecture[i];
  var st = stage();
  st.innerHTML = hubBar("🎤 PTE Retell Lecture") + '<div class="mt-card">' +
    "<p>Listen to the lecture, then retell it in your own words (40s).</p><p>" + ttsPlayHTML("mtAud", "▶ Play lecture (once)") + "</p>" +
    '<button class="btn-primary btn-big" id="mtGo">Start retelling →</button><div id="mtS2"></div></div>';
  wireBack();
  wireTtsPlay("mtAud", s, 1);
  $("mtGo").addEventListener("click", function () {
    stopSpeak();
    speakTask({
      title: "PTE Retell Lecture",
      prompt: "<p><strong>Retell the lecture in your own words.</strong></p>",
      prepSecs: 10, talkSecs: 40,
      criteria: ["Content (main ideas)", "Fluency", "Pronunciation"],
      scoreMap: function (avg) { return "<p><strong>PTE-style estimate: " + Math.round(10 + avg / 5 * 80) + "/90</strong></p>"; },
      tip: "Note 3–4 keywords while listening — then build your retelling around them."
    });
  });
}

function pteEssay() {
  var i = Math.floor(Math.random() * PTE.writeEssay.length);
  writeTask({
    title: "PTE Write Essay", introHTML: "<p><strong>Prompt:</strong> " + esc(PTE.writeEssay[i]) + "</p>",
    minutes: 20,
    guideHTML: "<ul><li>Paragraph 1: introduction + your position</li><li>Paragraphs 2–3: one main idea each, with examples</li><li>Paragraph 4: conclusion restating your view</li></ul>",
    criteria: [{ key: "grammar", name: "Grammar" }, { key: "vocabulary", name: "Vocabulary" }, { key: "organization", name: "Structure" }, { key: "spelling", name: "Spelling" }],
    tip: "200–300 words. One clear idea per paragraph."
  });
}

/* ================= Cambridge ================= */

function camHub() {
  var st = stage();
  st.innerHTML = hubBar("🎓 Cambridge English", "B2 First & C1 Advanced — Use of English.") +
    '<div class="mt-grid">' +
    [["b2", "📘", "B2 First", "Multiple-choice cloze · Open cloze · Word formation"], ["c1", "📕", "C1 Advanced", "Harder level — same three parts"], ["gap", "🧩", "Gapped Text", "Match headings to paragraphs"], ["tips", "💡", "Tips", "5 Cambridge tips"]].map(function (x) {
      return '<button class="mt-btn" data-t="' + x[0] + '"><span class="mt-emoji">' + x[1] + '</span><span class="mt-t">' + x[2] + '</span><span class="fine">' + x[3] + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-t");
      if (k === "b2") camLevel("B2 First", CAMBRIDGE.b2, cambridgeB2);
      else if (k === "c1") camLevel("C1 Advanced", CAMBRIDGE.c1, cambridgeC1);
      else if (k === "gap") camGappedPick();
      else { stage().innerHTML = hubBar("🎓 Cambridge — Tips") + tipsCard(CAMBRIDGE.tips); wireBack(); }
    });
  });
}

function camLevel(name, data, gradeFn) {
  var st = stage();
  st.innerHTML = hubBar("🎓 Cambridge " + name) + '<div class="mt-grid">' +
    [["mc", "🔤", "Part 1: Multiple-choice cloze", "8 questions"], ["oc", "✏️", "Part 2: Open cloze", "8 questions — one word each"], ["wf", "🔁", "Part 3: Word formation", "8 questions — use the root word"]].map(function (x) {
      return '<button class="mt-btn" data-t="' + x[0] + '"><span class="mt-emoji">' + x[1] + '</span><span class="mt-t">' + x[2] + '</span><span class="fine">' + x[3] + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  var all = data.mcCloze.length + data.openCloze.length + data.wordFormation.length;
  st.querySelectorAll("[data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-t");
      if (k === "mc") {
        mcqRunner({
          title: name + " — Multiple-choice cloze", items: data.mcCloze.map(function (x) { return { t: x.s, o: x.o, a: x.a }; }),
          secs: 480, timerLabel: "Practice timer: 8 min",
          onDone: function (r, answers) {
            var g = gradeFn(pctOf(r.correct, r.total));
            finishSection({
              title: name + " — Multiple-choice cloze", correct: r.correct, total: r.total,
              estimateHTML: "<p><strong>" + esc(g.grade) + "</strong> — " + esc(g.note) + "</p>",
              reviewHTML: mcqReview(data.mcCloze.map(function (x) { return { t: x.s, o: x.o, a: x.a }; }), answers)
            });
          }
        });
      } else if (k === "oc") {
        fillRunner({
          title: name + " — Open cloze",
          introHTML: "<p>Write <strong>one word</strong> in each gap.</p>",
          items: data.openCloze, secs: 480, timerLabel: "Practice timer: 8 min",
          onDone: function (r, answers) {
            var g = gradeFn(pctOf(r.correct, r.total));
            finishSection({
              title: name + " — Open cloze", correct: r.correct, total: r.total,
              estimateHTML: "<p><strong>" + esc(g.grade) + "</strong> — " + esc(g.note) + "</p>",
              reviewHTML: fillReview(data.openCloze, answers)
            });
          }
        });
      } else {
        fillRunner({
          title: name + " — Word formation",
          introHTML: "<p>Use the root word to form the missing word.</p>",
          items: data.wordFormation, secs: 480, timerLabel: "Practice timer: 8 min",
          onDone: function (r, answers) {
            var g = gradeFn(pctOf(r.correct, r.total));
            finishSection({
              title: name + " — Word formation", correct: r.correct, total: r.total,
              estimateHTML: "<p><strong>" + esc(g.grade) + "</strong> — " + esc(g.note) + "</p>",
              reviewHTML: fillReview(data.wordFormation, answers),
              nextHTML: "<h3>Next step</h3><p>Decide the word class FIRST (noun? adjective? adverb?), then add the ending.</p>"
            });
          }
        });
      }
    });
  });
}

function camGappedPick() {
  var st = stage();
  st.innerHTML = hubBar("🎓 Cambridge — Gapped Text", "Match each paragraph to a heading. One heading is extra.") +
    '<div class="mt-grid">' + CAMBRIDGE.gappedText.map(function (g, i) {
      return '<button class="mt-btn" data-p="' + i + '"><span class="mt-emoji">🧩</span><span class="mt-t">' + esc(g.title) + '</span><span class="fine">6 paragraphs · 7 headings</span></button>';
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var g = CAMBRIDGE.gappedText[parseInt(b.getAttribute("data-p"), 10)];
      var s2 = stage();
      var h = hubBar("🎓 Gapped Text: " + g.title) + '<div class="mt-card"><p class="fine">Headings:</p><ol class="mt-heads">' +
        g.headings.map(function (hh, i) { return "<li><strong>" + String.fromCharCode(65 + i) + ".</strong> " + esc(hh) + "</li>"; }).join("") + "</ol>";
      g.paragraphs.forEach(function (p, i) {
        h += '<div class="mt-q"><p>' + esc(p) + '</p><label>Heading: <select name="g' + i + '">' +
          g.headings.map(function (_, j) { return '<option value="' + j + '">' + String.fromCharCode(65 + j) + "</option>"; }).join("") +
          "</select></label></div>";
      });
      h += '<button class="btn-primary btn-big" id="mtCheck">Check</button></div>';
      s2.innerHTML = h;
      wireBack();
      $("mtCheck").addEventListener("click", function () {
        var correct = 0, review = '<div class="mt-review"><h3>Review</h3>';
        g.paragraphs.forEach(function (_, i) {
          var sel = s2.querySelector('select[name="g' + i + '"]');
          var v = parseInt(sel.value, 10), ok = v === g.answers[i];
          if (ok) correct++;
          review += '<div class="mt-rev ' + (ok ? "ok" : "bad") + '"><p>Paragraph ' + (i + 1) + ": you chose <strong>" + String.fromCharCode(65 + v) + "</strong>" +
            (ok ? " ✓" : ' ✗ — correct: <strong>' + String.fromCharCode(65 + g.answers[i]) + "</strong>") + "</p></div>";
        });
        finishSection({
          title: "Gapped Text: " + g.title, correct: correct, total: g.paragraphs.length,
          estimateHTML: "<p><strong>" + pctOf(correct, g.paragraphs.length) + "%</strong></p>",
          reviewHTML: review + "</div>",
          nextHTML: "<h3>Next step</h3><p>Match <strong>linking words</strong> (however, for example, this) between paragraphs and headings.</p>"
        });
      });
    });
  });
}

/* ================= TOEIC ================= */

function toeicHub() {
  var st = stage();
  st.innerHTML = hubBar("💼 TOEIC", "Listening & Reading — workplace English.") +
    '<div class="mt-grid">' +
    [["photo", "🖼️", "Listening: Photographs", "10 — pick the true statement"], ["resp", "👂", "Listening: Question–Response", "10 — pick the best response"], ["inc", "✏️", "Reading: Incomplete Sentences", "15 questions"], ["tc", "📄", "Reading: Text Completion", "2 passages × 5 blanks"], ["tips", "💡", "Tips", "5 TOEIC tips"]].map(function (x) {
      return '<button class="mt-btn" data-t="' + x[0] + '"><span class="mt-emoji">' + x[1] + '</span><span class="mt-t">' + x[2] + '</span><span class="fine">' + x[3] + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-t");
      if (k === "photo") toeicPhoto();
      else if (k === "resp") toeicResponse();
      else if (k === "inc") toeicIncomplete();
      else if (k === "tc") toeicTextCompPick();
      else { stage().innerHTML = hubBar("💼 TOEIC — Tips") + tipsCard(TOEIC.tips); wireBack(); }
    });
  });
}

function toeicPhoto() {
  var idx = 0, answers = [];
  var st = stage();
  function show() {
    var p = TOEIC.photo[idx];
    st.innerHTML = hubBar("💼 TOEIC Photographs", "Question " + (idx + 1) + "/" + TOEIC.photo.length) +
      '<div class="mt-card"><p class="fine">Picture (described):</p><p class="mt-bigtext">🖼️ ' + esc(p.photo) + "</p>" +
      "<p>" + ttsPlayHTML("mtAud", "▶ Play the 4 statements") + "</p>" +
      '<div class="mt-opts">' + p.s.map(function (s, i) {
        return '<button class="mt-optbtn" data-i="' + i + '">' + String.fromCharCode(65 + i) + ". " + esc(s) + "</button>";
      }).join("") + "</div></div>";
    wireBack();
    wireTtsPlay("mtAud", p.s.join(". "), 2);
    st.querySelectorAll("[data-i]").forEach(function (b) {
      b.addEventListener("click", function () {
        stopSpeak();
        answers.push(parseInt(b.getAttribute("data-i"), 10));
        idx++;
        if (idx < TOEIC.photo.length) show();
        else {
          var r = scoreMCQ(TOEIC.photo, answers);
          finishSection({
            title: "TOEIC Photographs", correct: r.correct, total: r.total,
            estimateHTML: "<p><strong>Listening estimate: " + toeicSection(r.correct, r.total) + "/495</strong> (approximate)</p>",
            reviewHTML: mcqReview(TOEIC.photo.map(function (x) { return { t: x.photo, o: x.s, a: x.a }; }), answers),
            nextHTML: "<h3>Next step</h3><p>Eliminate the two obviously-wrong statements first.</p>"
          });
        }
      });
    });
  }
  show();
}

function toeicResponse() {
  var idx = 0, answers = [];
  var st = stage();
  function show() {
    var p = TOEIC.response[idx];
    st.innerHTML = hubBar("💼 TOEIC Question–Response", "Question " + (idx + 1) + "/" + TOEIC.response.length) +
      '<div class="mt-card"><p>Listen to the question, then pick the best response.</p><p>' + ttsPlayHTML("mtAud", "▶ Play question") + "</p>" +
      '<div class="mt-opts">' + p.o.map(function (s, i) {
        return '<button class="mt-optbtn" data-i="' + i + '">' + String.fromCharCode(65 + i) + ". " + esc(s) + "</button>";
      }).join("") + "</div></div>";
    wireBack();
    wireTtsPlay("mtAud", p.q, 2);
    st.querySelectorAll("[data-i]").forEach(function (b) {
      b.addEventListener("click", function () {
        stopSpeak();
        answers.push(parseInt(b.getAttribute("data-i"), 10));
        idx++;
        if (idx < TOEIC.response.length) show();
        else {
          var r = scoreMCQ(TOEIC.response, answers);
          finishSection({
            title: "TOEIC Question–Response", correct: r.correct, total: r.total,
            estimateHTML: "<p><strong>Listening estimate: " + toeicSection(r.correct, r.total) + "/495</strong> (approximate)</p>",
            reviewHTML: mcqReview(TOEIC.response.map(function (x) { return { t: x.q, o: x.o, a: x.a }; }), answers)
          });
        }
      });
    });
  }
  show();
}

function toeicIncomplete() {
  mcqRunner({
    title: "TOEIC Incomplete Sentences",
    introHTML: "<p>Choose the word or phrase that best completes each sentence.</p>",
    items: TOEIC.incomplete.map(function (x) { return { t: x.s, o: x.o, a: x.a }; }),
    secs: 600, timerLabel: "Practice timer: 10 min",
    onDone: function (r, answers) {
      finishSection({
        title: "TOEIC Incomplete Sentences", correct: r.correct, total: r.total,
        estimateHTML: "<p><strong>Reading estimate: " + toeicSection(r.correct, r.total) + "/495</strong> (approximate)</p>",
        reviewHTML: mcqReview(TOEIC.incomplete.map(function (x) { return { t: x.s, o: x.o, a: x.a }; }), answers)
      });
    }
  });
}

function toeicTextCompPick() {
  var st = stage();
  st.innerHTML = hubBar("💼 TOEIC Text Completion") + '<div class="mt-grid">' +
    TOEIC.textCompletion.map(function (p, i) {
      return '<button class="mt-btn" data-p="' + i + '"><span class="mt-emoji">📄</span><span class="mt-t">' + esc(p.title) + '</span><span class="fine">5 blanks</span></button>';
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = TOEIC.textCompletion[parseInt(b.getAttribute("data-p"), 10)];
      var s2 = stage();
      var h = hubBar("💼 " + p.title) + '<div class="mt-card"><div class="mt-passage">' +
        esc(p.text).split(/__\d__/).map(function (chunk, i) {
          var sel = i < p.blanks.length
            ? '<select class="mt-blank" name="b' + i + '">' + p.blanks[i].o.map(function (o, j) { return '<option value="' + j + '">' + esc(o) + "</option>"; }).join("") + "</select>"
            : "";
          return "<p>" + chunk + sel + "</p>";
        }).join("") + '</div><button class="btn-primary btn-big" id="mtCheck">Check</button></div>';
      s2.innerHTML = h;
      wireBack();
      $("mtCheck").addEventListener("click", function () {
        var answers = p.blanks.map(function (_, i) {
          return parseInt(s2.querySelector('select[name="b' + i + '"]').value, 10);
        });
        var r = scoreMCQ(p.blanks, answers);
        var review = '<div class="mt-review"><h3>Review</h3>' + p.blanks.map(function (bl, i) {
          var ok = answers[i] === bl.a;
          return '<div class="mt-rev ' + (ok ? "ok" : "bad") + '"><p>Blank ' + (i + 1) + ": you chose <strong>" + esc(bl.o[answers[i]]) + "</strong>" +
            (ok ? " ✓" : ' ✗ — correct: <strong>' + esc(bl.o[bl.a]) + "</strong>") + "</p></div>";
        }).join("") + "</div>";
        finishSection({
          title: "TOEIC: " + p.title, correct: r.correct, total: r.total,
          estimateHTML: "<p><strong>Reading estimate: " + toeicSection(r.correct, r.total) + "/495</strong> (approximate)</p>",
          reviewHTML: review
        });
      });
    });
  });
}

/* ================= OET (starter) ================= */

function oetHub() {
  var st = stage();
  st.innerHTML = hubBar("⚕️ OET", "English for healthcare professionals.") +
    '<div class="mt-card"><p>' + esc(OET.overview.who) + "</p><ul class='mt-tips'>" +
    OET.overview.subtests.map(function (s) { return "<li><strong>" + esc(s.name) + ":</strong> " + esc(s.desc) + "</li>"; }).join("") +
    "</ul></div>" +
    '<div class="mt-grid">' +
    [["letters", "✉️", "Letter Writing", "4 referral/discharge prompts with structure guides"], ["tips", "💡", "Tips", "6 profession-specific tips"]].map(function (x) {
      return '<button class="mt-btn" data-t="' + x[0] + '"><span class="mt-emoji">' + x[1] + '</span><span class="mt-t">' + x[2] + '</span><span class="fine">' + x[3] + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-t") === "letters") oetLetterPick();
      else { stage().innerHTML = hubBar("⚕️ OET — Tips") + tipsCard(OET.tips); wireBack(); }
    });
  });
}

function oetLetterPick() {
  var st = stage();
  st.innerHTML = hubBar("⚕️ OET Letter Writing", "Structure guide provided — the letter itself is yours to write.") +
    '<div class="mt-grid">' + OET.letters.map(function (l, i) {
      return '<button class="mt-btn" data-p="' + i + '"><span class="mt-emoji">✉️</span><span class="mt-t">' + esc(l.title) + '</span></button>';
    }).join("") + "</div>";
  wireBack();
  st.querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = OET.letters[parseInt(b.getAttribute("data-p"), 10)];
      writeTask({
        title: "OET: " + l.title,
        introHTML: "<p><strong>Scenario:</strong> " + esc(l.scenario) + "</p>" +
          '<div class="mt-read"><p class="fine">Case notes (select what matters):</p><ul class="mt-tips">' +
          l.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div>",
        minutes: 20,
        guideHTML: "<ol>" + l.structure.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>",
        criteria: [{ key: "organization", name: "Purpose & structure" }, { key: "vocabulary", name: "Tone & vocabulary" }, { key: "grammar", name: "Language accuracy" }],
        tip: "Select from the case notes — include only what the reader needs for THIS letter's purpose."
      });
    });
  });
}

/* ================= main hub ================= */

const TESTS = [
  { id: "toefl", emoji: "🎓", title: "TOEFL iBT", desc: "Reading · Listening · Speaking · Writing", fn: toeflHub },
  { id: "pte", emoji: "🎤", title: "PTE Academic", desc: "Read aloud · Blanks · Repeat · Describe · Essay", fn: pteHub },
  { id: "cambridge", emoji: "📘", title: "Cambridge B2 / C1", desc: "Use of English: cloze, word formation, gapped text", fn: camHub },
  { id: "toeic", emoji: "💼", title: "TOEIC", desc: "Workplace listening & reading", fn: toeicHub },
  { id: "oet", emoji: "⚕️", title: "OET", desc: "English for healthcare professionals", fn: oetHub }
];

export function testMeta(id) { return TESTS.find(function (t) { return t.id === id; }); }

export function showMoreTests() {
  clearTimer(); stopSpeak();
  var st = stage();
  if (!st) return;
  st.innerHTML = '<div class="mt-hero"><h2>🌍 More International Tests</h2>' +
    '<p class="fine">Exam-style practice for the world\'s English tests. All scores are <strong>practice estimates</strong>.</p></div>' +
    '<div class="mt-grid">' + TESTS.map(function (t) {
      return '<button class="mt-btn" data-test="' + t.id + '"><span class="mt-emoji">' + t.emoji + '</span>' +
        '<span class="mt-t">' + t.title + '</span><span class="fine">' + t.desc + "</span></button>";
    }).join("") + "</div>";
  st.querySelectorAll("[data-test]").forEach(function (b) {
    b.addEventListener("click", function () {
      var m = testMeta(b.getAttribute("data-test"));
      if (m) m.fn();
    });
  });
  show("screen-moretests", "moretests");
}
