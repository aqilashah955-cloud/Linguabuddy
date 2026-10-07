// LinguaBuddy — 🎓 Test Prep (IELTS + Duolingo English Test + TOEFL/PTE overview).
// Exam-realistic practice: IELTS reading/listening/writing/speaking with band
// estimates, DET read-select/read-complete/listen-type/writing/speaking, and
// format overviews for TOEFL iBT + PTE Academic. All offline; audio comes from
// the device TTS (js/tts.js — the only TTS). Writing feedback reuses
// analyzeWriting() from js/writing.js (never writes the essay for the learner).
// Every score is labeled "practice estimate — not an official score".

import { IELTS_READING, IELTS_LISTENING, IELTS_WRITING, IELTS_SPEAKING, IELTS_TIPS, BAND_LISTENING, BAND_READING } from "../data/ielts.js";
import { DET_READ_SELECT_REAL, DET_READ_SELECT_FAKE, DET_READ_COMPLETE, DET_LISTEN_TYPE, DET_WRITING, DET_SPEAKING, DET_TIPS } from "../data/duolingo.js";
import { S, save, touchStreak, recordAttempt } from "./store.js";
import { awardXP, checkBadges, toast } from "./gamify.js";
import { analyzeWriting } from "./writing.js";
import { printHTML } from "./worksheets.js";
import { speak, stopSpeak, ttsAvailable } from "./tts.js";
import { showScreen as show } from "./ui.js";
import { esc, shuffle, norm } from "./utils.js";

function $(id) { return document.getElementById(id); }
function stage() { return $("screen-testprep"); }

let go = null;
export function setTestprepGo(fn) { go = fn; }

/* ================= pure helpers (node-testable) ================= */

/** Band from a [minRaw, band] threshold table (raw out of 40). */
export function bandFromTable(raw, table) {
  raw = Math.round(raw);
  for (var i = 0; i < table.length; i++) {
    if (raw >= table[i][0]) return table[i][1];
  }
  return 0;
}
export function bandForListening(raw) { return bandFromTable(raw, BAND_LISTENING); }
export function bandForReading(raw) { return bandFromTable(raw, BAND_READING); }

/** Scale a practice raw score (correct out of total) to the 40-scale, then band. */
export function bandForScaled(correct, total, kind) {
  if (!total) return 0;
  var scaled = Math.round(correct / total * 40);
  return kind === "listening" ? bandForListening(scaled) : bandForReading(scaled);
}

/** DET overall-ish score on the 10–160 scale from a proportion. */
export function detScore(correct, total) {
  if (!total) return 10;
  var s = 10 + Math.round(correct / total * 150);
  return Math.max(10, Math.min(160, s));
}

/** Overall IELTS band: mean of section bands, rounded to nearest 0.5. */
export function overallBand(scores) {
  var xs = (scores || []).filter(function (x) { return typeof x === "number" && x > 0; });
  if (!xs.length) return 0;
  var avg = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
  return Math.round(avg * 2) / 2;
}

export function wordCount(text) {
  return (String(text || "").trim().match(/[A-Za-z']+/g) || []).length;
}

/** Read & Select scoring: hits minus false alarms, floored at 0. */
export function detReadSelectScore(picks, deck) {
  var score = 0;
  picks.forEach(function (w) {
    score += deck.real.indexOf(w) >= 0 ? 1 : -1;
  });
  return Math.max(0, score);
}

/** Listen & Type scoring: position-wise word match over the longer token list. */
export function scoreListenType(spoken, typed) {
  var a = norm(spoken).split(/\s+/).filter(Boolean);
  var b = norm(typed).split(/\s+/).filter(Boolean);
  var n = Math.max(a.length, b.length);
  if (!n) return 0;
  var hits = 0;
  for (var i = 0; i < n; i++) if (a[i] && a[i] === b[i]) hits++;
  return Math.round(hits / n * 100);
}

var LINK_WORDS = ["however", "moreover", "furthermore", "in addition", "firstly", "secondly", "finally", "in conclusion", "on the other hand", "nevertheless", "therefore", "as a result", "for instance", "for example", "in contrast", "despite", "although", "because", "while", "whereas"];

/** Map analyzeWriting() output onto the 4 IELTS writing criteria.
 *  Returns { criteria: [{name, notes[]}], band, issues }.
 *  Band is a rough practice estimate — never presented as official. */
export function ieltsWritingFeedback(text, promptDef) {
  var t = String(text || "").trim();
  var words = wordCount(t);
  var res = analyzeWriting(t, { kind: "opinion", minWords: promptDef.minWords });
  var issues = res.issues || [];
  var criteria = [];

  // 1 — Task Achievement
  var ta = [];
  if (words < promptDef.minWords) {
    ta.push("Only " + words + " words — Task " + promptDef.task + " needs at least " + promptDef.minWords + ". Writing too little directly lowers Task Achievement.");
  } else {
    ta.push(words + " words — good, you meet the minimum for Task " + promptDef.task + ".");
  }
  var keys = promptDef.prompt.toLowerCase().match(/[a-z]{5,}/g) || [];
  var stop = { about: 1, which: 1, there: 1, their: 1, these: 1, those: 1, would: 1, should: 1, could: 1, think: 1, people: 1 };
  keys = keys.filter(function (w, i) { return !stop[w] && keys.indexOf(w) === i; }).slice(0, 8);
  var low = t.toLowerCase();
  var hit = keys.filter(function (w) { return low.indexOf(w) >= 0; }).length;
  if (hit >= Math.ceil(keys.length / 2)) ta.push("You address the key ideas of the prompt (" + hit + "/" + keys.length + " key words covered).");
  else ta.push("Only " + hit + "/" + keys.length + " key words from the prompt appear — make sure you answer every part of the question.");
  criteria.push({ name: "Task Achievement", notes: ta });

  // 2 — Coherence & Cohesion
  var cc = [];
  var paras = t.split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
  if (paras.length >= 3) cc.push(paras.length + " paragraphs — good organisation.");
  else cc.push("Only " + paras.length + " paragraph(s) — examiners expect clear paragraphing (aim for 4 in Task 2). Press Enter between paragraphs.");
  var links = LINK_WORDS.filter(function (w) { return low.indexOf(w) >= 0; });
  if (links.length >= 2) cc.push("Good use of linking words: " + links.slice(0, 4).join(", ") + ".");
  else cc.push("Add more linking words (however, furthermore, in conclusion…) to connect your ideas.");
  criteria.push({ name: "Coherence & Cohesion", notes: cc });

  // 3 — Lexical Resource
  var lr = [];
  var voc = issues.filter(function (x) { return x.category === "vocabulary" || x.category === "spelling"; });
  if (!voc.length) lr.push("No major vocabulary problems found — well done.");
  voc.forEach(function (x) { lr.push(x.explain); });
  criteria.push({ name: "Lexical Resource", notes: lr });

  // 4 — Grammatical Range & Accuracy
  var gr = [];
  var gam = issues.filter(function (x) { return x.category === "grammar" || x.category === "punctuation"; });
  if (!gam.length) gr.push("No major grammar problems found — well done.");
  gam.forEach(function (x) { gr.push(x.explain); });
  var sents = (t.match(/[^.!?]+[.!?]/g) || []).length;
  if (sents >= 6) gr.push(sents + " sentences — good range. Vary simple and complex sentences for higher bands.");
  criteria.push({ name: "Grammatical Range & Accuracy", notes: gr });

  // rough band estimate
  var band = 6.5 - Math.min(2, issues.length * 0.5);
  if (words < promptDef.minWords) band -= 1;
  if (paras.length < 3) band -= 0.5;
  band = Math.max(4, Math.min(8.5, Math.round(band * 2) / 2));
  return { criteria: criteria, band: band, issues: issues };
}

/** Speaking self-assessment → band: avg of 4 criteria (1–5 stars) mapped up. */
export function speakingBandFromStars(stars) {
  var xs = ["fluency", "vocab", "grammar", "pron"].map(function (k) { return stars[k] || 0; });
  var avg = xs.reduce(function (a, b) { return a + b; }, 0) / 4;
  return Math.max(4, Math.min(9, Math.round((avg + 3.5) * 2) / 2));
}

/* ================= session state + results ================= */

function tpState() {
  if (!S.testprep) S.testprep = { ielts: { reading: [], listening: [], writing: [], speaking: [] }, det: { readselect: [], readcomplete: [], listentype: [], writing: [], speaking: [] } };
  return S.testprep;
}

function logResult(section, kind, rec) {
  var st = tpState();
  if (!st[section]) st[section] = {};
  if (!st[section][kind]) st[section][kind] = [];
  st[section][kind].push(Object.assign({ date: Date.now() }, rec));
  save();
  recordAttempt({ mode: "practice", kind: "testprep", ref: "testprep:" + section + ":" + kind,
    title: "🎓 " + rec.title, score: rec.score, total: rec.total, pct: rec.pct, secs: rec.secs || 0, perSlo: {} });
  awardXP(30, "test prep practice");
  touchStreak();
  checkBadges();
}

/* ================= timer (single global, always cleared) ================= */

var timerId = null;
function clearTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; }
  stopSpeak();
}
function fmtTime(s) {
  s = Math.max(0, s);
  var m = Math.floor(s / 60), ss = s % 60;
  return (m < 10 ? "0" + m : m) + ":" + (ss < 10 ? "0" + ss : ss);
}
/** Start a countdown into #tpTimer; onEnd fires at zero. Label explains real-test timing. */
function startTimer(secs, onEnd) {
  clearTimer();
  var left = secs;
  var el = $("tpTimer");
  function tick() {
    if (el) {
      el.textContent = "⏱ " + fmtTime(left);
      el.classList.toggle("tp-low", left <= 60);
    }
    if (left <= 0) { clearTimer(); if (onEnd) onEnd(); return; }
    left--;
  }
  tick();
  timerId = setInterval(tick, 1000);
}

/* ================= audio recording (optional, guarded) ================= */

function canRecord() {
  return typeof MediaRecorder !== "undefined" &&
    typeof navigator !== "undefined" && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
var recState = { rec: null, chunks: [], url: null, stream: null };
function stopRecStream() {
  if (recState.stream) { recState.stream.getTracks().forEach(function (t) { t.stop(); }); recState.stream = null; }
}
function renderRecUI(hostId) {
  var host = $(hostId);
  if (!host) return;
  if (!canRecord()) {
    host.innerHTML = '<p class="fine">🎤 Recording is not available in this browser — you can still practise by speaking aloud and timing yourself.</p>';
    return;
  }
  host.innerHTML = '<div class="tp-rec"><button class="btn-ghost" id="tpRecBtn">🔴 Record my answer</button>' +
    '<span id="tpRecMsg" class="fine"></span><div id="tpRecPlay"></div></div>';
  $("tpRecBtn").addEventListener("click", function () {
    if (recState.rec && recState.rec.state === "recording") {
      recState.rec.stop();
      $("tpRecBtn").textContent = "🔴 Record my answer";
      $("tpRecMsg").textContent = "Recorded ✓ — listen back below.";
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      recState.stream = stream;
      recState.chunks = [];
      var rec = new MediaRecorder(stream);
      recState.rec = rec;
      rec.ondataavailable = function (e) { if (e.data.size) recState.chunks.push(e.data); };
      rec.onstop = function () {
        stopRecStream();
        var blob = new Blob(recState.chunks, { type: rec.mimeType || "audio/webm" });
        if (recState.url) URL.revokeObjectURL(recState.url);
        recState.url = URL.createObjectURL(blob);
        $("tpRecPlay").innerHTML = '<audio controls src="' + recState.url + '"></audio>';
      };
      rec.start();
      $("tpRecBtn").textContent = "⏹ Stop recording";
      $("tpRecMsg").textContent = "Recording… speak now.";
    }).catch(function () {
      $("tpRecMsg").textContent = "Microphone blocked — allow access to record.";
    });
  });
}

/* ================= hub ================= */

function hubCard(emoji, title, desc, fn) {
  return '<button class="tp-card" data-tp="' + fn + '"><span class="tp-emoji">' + emoji + "</span>" +
    "<span><strong>" + esc(title) + "</strong><br><span class='fine'>" + esc(desc) + "</span></span>" +
    '<span class="mc-arrow">→</span></button>';
}

export function showTestprep() {
  clearTimer();
  var el = stage();
  if (!el) return;
  el.innerHTML =
    '<div class="tp-wrap"><div class="screen-head"><h2>🎓 Test Prep</h2>' +
    "<p>Exam-realistic practice for IELTS, Duolingo English Test, TOEFL and PTE. " +
    "Scores here are <strong>practice estimates — not official scores</strong>.</p></div>" +
    '<div class="tp-grid">' +
    hubCard("🇬🇧", "IELTS", "Reading · Listening · Writing · Speaking with band estimates", "ielts") +
    hubCard("🟢", "Duolingo English Test", "Read & Select · Read & Complete · Listen & Type · Writing · Speaking", "det") +
    hubCard("🌍", "TOEFL iBT & PTE Academic", "Format overviews, tips, and where to practise each skill", "other") +
    "</div>" +
    '<button class="btn-ghost" data-tp="report">📊 My score report</button></div>';
  el.querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { openSection(b.getAttribute("data-tp")); });
  });
  show("screen-testprep", "testprep");
}

function openSection(id) {
  if (id === "ielts") renderIeltsHub();
  else if (id === "det") renderDetHub();
  else if (id === "other") renderOtherHub();
  else if (id === "report") renderReport();
}

function backBar(label, fn) {
  return '<div class="tp-backbar"><button class="back-btn" id="tpBack">← ' + esc(label) + "</button>" +
    '<span id="tpTimer" class="tp-timer"></span></div>';
}
function wireBack(fn) {
  var b = $("tpBack");
  if (b) b.addEventListener("click", function () { clearTimer(); fn(); });
}

/* ================= IELTS hub ================= */

function renderIeltsHub() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("Test Prep", showTestprep) +
    "<h2>🇬🇧 IELTS Practice</h2><p class='fine'>Academic module. Real test: 2h 45m + speaking.</p>" +
    "<p class='fine'>🆕 <strong>Writing on Paper:</strong> since 26 Sep 2026, IELTS on Computer lets you handwrite " +
    "the Writing section — tasks shown on screen, answers written in pen on an answer sheet. Check your test centre " +
    "when booking.</p>" +
    '<div class="tp-grid">' +
    hubCard("📖", "Reading", "3 passages · 20-min practice timer · band estimate", "r-reading") +
    hubCard("🎧", "Listening", "Play-once audio · 3 scripts · band estimate", "r-listening") +
    hubCard("✍️", "Writing", "Task 1 & 2 · structure guides · criteria feedback", "r-writing") +
    hubCard("🗣️", "Speaking", "Parts 1–3 · cue cards · timers · self-assessment", "r-speaking") +
    hubCard("💡", "Exam tips", "Practical tips for all four sections", "r-tips") +
    "</div></div>";
  wireBack(showTestprep);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { openIelts(b.getAttribute("data-tp")); });
  });
}

function openIelts(id) {
  if (id === "r-reading") pickIeltsReading();
  else if (id === "r-listening") pickIeltsListening();
  else if (id === "r-writing") pickIeltsWriting();
  else if (id === "r-speaking") pickIeltsSpeaking();
  else if (id === "r-tips") renderIeltsTips();
}

/* ================= IELTS READING ================= */

function pickIeltsReading() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("IELTS", renderIeltsHub) +
    "<h2>📖 IELTS Reading</h2><p class='fine'>Pick a passage. Practice timer: <strong>20 minutes</strong> " +
    "(the real test gives 60 minutes for 3 passages).</p>" +
    '<div class="tp-grid">' + IELTS_READING.map(function (p) {
      return hubCard("📄", p.title, p.paras.length + " paragraphs · " + p.questions.length + " questions", "rd:" + p.id);
    }).join("") + "</div></div>";
  wireBack(renderIeltsHub);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { startIeltsReading(b.getAttribute("data-tp").slice(3)); });
  });
}

function renderQuestion(q, i) {
  var h = '<div class="tp-q" id="tpq' + i + '"><p class="tp-qq"><strong>Q' + (i + 1) + ".</strong> " + esc(q.q) + "</p>";
  if (q.t === "mcq" || q.t === "heading") {
    var opts = q.t === "mcq" ? q.o : q.heads;
    h += opts.map(function (o, k) {
      return '<label class="tp-opt"><input type="radio" name="tpq' + i + '" value="' + k + '"> ' + esc(o) + "</label>";
    }).join("");
  } else if (q.t === "tfng") {
    h += ["T|True", "F|False", "NG|Not Given"].map(function (x) {
      var v = x.split("|");
      return '<label class="tp-opt"><input type="radio" name="tpq' + i + '" value="' + v[0] + '"> ' + v[1] + "</label>";
    }).join("");
  } else if (q.t === "fill") {
    h += '<input class="tp-fill" id="tpfill' + i + '" type="text" placeholder="Type the missing word" autocomplete="off">';
  }
  return h + "</div>";
}

function startIeltsReading(pid) {
  var p = IELTS_READING.find(function (x) { return x.id === pid; });
  if (!p) return;
  clearTimer();
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("Reading", pickIeltsReading) +
    "<h2>📖 " + esc(p.title) + "</h2>" +
    '<p class="fine">⏱ 20:00 practice timer (real test: 60 min for 3 passages). Answer all questions, then submit.</p>' +
    '<div class="tp-passage">' + p.paras.map(function (pg) {
      return '<p><strong>' + pg.h + ".</strong> " + esc(pg.text) + "</p>";
    }).join("") + "</div>" +
    '<div class="tp-qs">' + p.questions.map(renderQuestion).join("") + "</div>" +
    '<button class="btn-primary btn-big" id="tpSubmit">Submit answers</button><div id="tpResult"></div></div>';
  wireBack(pickIeltsReading);
  startTimer(20 * 60, function () { toast("⏱ Time's up — submitting what you have."); gradeIeltsReading(p, true); });
  $("tpSubmit").addEventListener("click", function () { gradeIeltsReading(p, false); });
}

function gradeIeltsReading(p, auto) {
  clearTimer();
  var correct = 0, rows = [];
  p.questions.forEach(function (q, i) {
    var ok = false, given = "—";
    if (q.t === "fill") {
      var v = ($("tpfill" + i) || {}).value || "";
      given = v || "—";
      ok = q.a.some(function (a) { return norm(v) === norm(a); });
    } else {
      var sel = document.querySelector('input[name="tpq' + i + '"]:checked');
      given = sel ? sel.value : "—";
      if (q.t === "tfng") ok = given === q.a;
      else ok = sel && parseInt(sel.value, 10) === q.a;
    }
    if (ok) correct++;
    var exp = q.t === "tfng" ? q.a : (q.t === "mcq" ? q.o[q.a] : q.heads[q.a]);
    rows.push('<div class="tp-mark ' + (ok ? "ok" : "bad") + '"><strong>Q' + (i + 1) + ".</strong> " +
      (ok ? "✓" : "✗") + " Your answer: " + esc(String(given)) +
      (ok ? "" : "<br>Correct: <strong>" + esc(String(exp)) + "</strong>") +
      "<br><span class='fine'>📍 Paragraph " + q.ref + " — " + esc(q.why) + "</span></div>");
  });
  var band = bandForScaled(correct, p.questions.length, "reading");
  $("tpResult").innerHTML = '<div class="tp-score">Score: <strong>' + correct + "/" + p.questions.length +
    "</strong> · Estimated band: <strong>" + band.toFixed(1) + "</strong>" +
    '<p class="fine">Practice estimate — not an official IELTS score.</p></div>' + rows.join("");
  $("tpResult").scrollIntoView();
  logResult("ielts", "reading", { title: "IELTS Reading: " + p.title, score: correct, total: p.questions.length,
    pct: Math.round(correct / p.questions.length * 100), band: band, secs: 0 });
  toast("📖 Reading done — band " + band.toFixed(1));
}

/* ================= IELTS LISTENING ================= */

var listenPlays = 0;

function pickIeltsListening() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("IELTS", renderIeltsHub) +
    "<h2>🎧 IELTS Listening</h2><p class='fine'>Each script is read aloud <strong>once</strong> " +
    "(one replay allowed — like the real test's single hearing).</p>" +
    '<div class="tp-grid">' + IELTS_LISTENING.map(function (s) {
      return hubCard(s.kind === "conversation" ? "💬" : s.kind === "monologue" ? "🏛️" : "🎓",
        s.title, s.kind + " · " + s.questions.length + " questions", "ls:" + s.id);
    }).join("") + "</div></div>";
  wireBack(renderIeltsHub);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { startIeltsListening(b.getAttribute("data-tp").slice(3)); });
  });
}

function startIeltsListening(sid) {
  var s = IELTS_LISTENING.find(function (x) { return x.id === sid; });
  if (!s) return;
  clearTimer();
  listenPlays = 0;
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("Listening", pickIeltsListening) +
    "<h2>🎧 " + esc(s.title) + "</h2>" +
    '<div class="tp-audio"><p class="fine">Listen carefully, then answer. In the real test you hear the recording <strong>only once</strong>.</p>' +
    '<button class="btn-primary" id="tpPlay">▶ Play audio</button> ' +
    '<button class="btn-ghost" id="tpReplay" disabled>🔁 Replay (1 left)</button>' +
    '<p class="fine" id="tpAudioMsg"></p></div>' +
    '<div id="tpLQ" class="hidden"><div class="tp-qs">' + s.questions.map(renderQuestion).join("") + "</div>" +
    '<button class="btn-primary btn-big" id="tpSubmit">Submit answers</button><div id="tpResult"></div></div></div>';
  wireBack(pickIeltsListening);

  function play() {
    if (!ttsAvailable()) { $("tpAudioMsg").textContent = "🔊 Audio not available on this device — read the script below instead."; showQs(); return; }
    listenPlays++;
    $("tpAudioMsg").textContent = "🔊 Playing… listen carefully.";
    speak(s.script, { rate: 0.95, onend: function () {
      $("tpAudioMsg").textContent = "Finished. Questions are below — answer from memory!";
      showQs();
    }});
    if (listenPlays >= 2) { $("tpReplay").disabled = true; $("tpReplay").textContent = "🔁 No replays left"; }
    else { $("tpReplay").disabled = false; $("tpReplay").textContent = "🔁 Replay (" + (2 - listenPlays) + " left)"; }
  }
  function showQs() { $("tpLQ").classList.remove("hidden"); }
  $("tpPlay").addEventListener("click", play);
  $("tpReplay").addEventListener("click", play);
  $("tpSubmit").addEventListener("click", function () { gradeIeltsListening(s); });
}

function gradeIeltsListening(s) {
  clearTimer();
  var correct = 0, rows = [];
  s.questions.forEach(function (q, i) {
    var ok = false, given = "—";
    if (q.t === "fill") {
      var v = ($("tpfill" + i) || {}).value || "";
      given = v || "—";
      ok = q.a.some(function (a) { return norm(v) === norm(a); });
    } else {
      var sel = document.querySelector('input[name="tpq' + i + '"]:checked');
      given = sel ? sel.value : "—";
      ok = sel && parseInt(sel.value, 10) === q.a;
    }
    if (ok) correct++;
    var exp = q.t === "mcq" ? q.o[q.a] : q.a[0];
    rows.push('<div class="tp-mark ' + (ok ? "ok" : "bad") + '"><strong>Q' + (i + 1) + ".</strong> " +
      (ok ? "✓" : "✗") + " Your answer: " + esc(String(given)) +
      (ok ? "" : "<br>Correct: <strong>" + esc(String(exp)) + "</strong>") +
      "<br><span class='fine'>" + esc(q.why) + "</span></div>");
  });
  var band = bandForScaled(correct, s.questions.length, "listening");
  $("tpResult").innerHTML = '<div class="tp-score">Score: <strong>' + correct + "/" + s.questions.length +
    "</strong> · Estimated band: <strong>" + band.toFixed(1) + "</strong>" +
    '<p class="fine">Practice estimate — not an official IELTS score.</p></div>' + rows.join("");
  $("tpResult").scrollIntoView();
  logResult("ielts", "listening", { title: "IELTS Listening: " + s.title, score: correct, total: s.questions.length,
    pct: Math.round(correct / s.questions.length * 100), band: band, secs: 0 });
  toast("🎧 Listening done — band " + band.toFixed(1));
}

/* ================= IELTS WRITING ================= */

function pickIeltsWriting() {
  clearTimer();
  function card(w) {
    return hubCard(w.task === 1 ? "📊" : "💭", "Task " + w.task + " · " + w.minWords + "+ words",
      w.prompt.slice(0, 90) + "…", "wr:" + w.id);
  }
  stage().innerHTML = '<div class="tp-wrap">' + backBar("IELTS", renderIeltsHub) +
    "<h2>✍️ IELTS Writing</h2><p class='fine'>Read the <strong>structure guide</strong> (not a model answer — " +
    "examiners want <em>your</em> words), plan, then write. Suggested time: Task 1 = 20 min, Task 2 = 40 min.</p>" +
    "<h3 class='sec-title'>Task 1</h3><div class='tp-grid'>" +
    IELTS_WRITING.filter(function (w) { return w.task === 1; }).map(card).join("") + "</div>" +
    "<h3 class='sec-title'>Task 2</h3><div class='tp-grid'>" +
    IELTS_WRITING.filter(function (w) { return w.task === 2; }).map(card).join("") + "</div></div>";
  wireBack(renderIeltsHub);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { startIeltsWriting(b.getAttribute("data-tp").slice(3)); });
  });
}

function startIeltsWriting(wid) {
  var w = IELTS_WRITING.find(function (x) { return x.id === wid; });
  if (!w) return;
  clearTimer();
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("Writing", pickIeltsWriting) +
    "<h2>✍️ IELTS Writing Task " + w.task + "</h2>" +
    '<div class="tp-prompt">' + esc(w.prompt) + "</div>" +
    '<details class="tp-guide"><summary>📋 Structure guide (tap to open)</summary><ol>' +
    w.structure.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
    "<p><strong>Useful language:</strong> " + w.lang.map(esc).join(" · ") + "</p></details>" +
    '<p class="fine">Suggested time: ' + w.timeMin + ' minutes · minimum ' + w.minWords + ' words. ' +
    "Write in paragraphs (press Enter between them).</p>" +
    '<textarea id="tpWrite" class="tp-textarea" rows="12" placeholder="Write your answer here…"></textarea>' +
    '<p class="fine"><span id="tpWc">0</span> / ' + w.minWords + ' words minimum</p>' +
    '<button class="btn-primary btn-big" id="tpGetFb">Get feedback</button><div id="tpResult"></div></div>';
  wireBack(pickIeltsWriting);
  startTimer(w.timeMin * 60, function () { toast("⏱ Suggested time is up — you can keep writing or get feedback."); });
  $("tpWrite").addEventListener("input", function () { $("tpWc").textContent = wordCount($("tpWrite").value); });
  $("tpGetFb").addEventListener("click", function () { gradeIeltsWriting(w); });
}

function gradeIeltsWriting(w) {
  clearTimer();
  var text = $("tpWrite").value;
  if (wordCount(text) < 10) { toast("Write a little more first ✍️"); return; }
  var fb = ieltsWritingFeedback(text, w);
  var html = '<div class="tp-score">Estimated band: <strong>' + fb.band.toFixed(1) + "</strong>" +
    '<p class="fine">Practice estimate from an automated check — not an official IELTS band. A teacher\'s review is the gold standard.</p></div>';
  fb.criteria.forEach(function (c) {
    html += '<div class="tp-crit"><h4>' + esc(c.name) + "</h4><ul>" +
      c.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div>";
  });
  html += '<button class="btn-ghost" id="tpRevise">✏️ Revise & check again</button>';
  $("tpResult").innerHTML = html;
  $("tpResult").scrollIntoView();
  $("tpRevise").addEventListener("click", function () { $("tpResult").innerHTML = ""; $("tpWrite").focus(); });
  logResult("ielts", "writing", { title: "IELTS Writing Task " + w.task, score: Math.round(fb.band * 10), total: 90,
    pct: Math.round(fb.band / 9 * 100), band: fb.band, secs: 0 });
  toast("✍️ Feedback ready — band " + fb.band.toFixed(1));
}

/* ================= IELTS SPEAKING ================= */

function pickIeltsSpeaking() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("IELTS", renderIeltsHub) +
    "<h2>🗣️ IELTS Speaking</h2><p class='fine'>Real format: Part 1 (4–5 min) → Part 2 (3–4 min) → Part 3 (4–5 min). " +
    "Use the timers, record yourself, then self-assess honestly.</p>" +
    '<div class="tp-grid">' +
    hubCard("💬", "Part 1 — Interview", IELTS_SPEAKING.part1.length + " everyday questions", "sp:p1") +
    hubCard("🎴", "Part 2 — Cue card", IELTS_SPEAKING.part2.length + " cue cards · 1 min prep + 2 min talk", "sp:p2") +
    hubCard("🧠", "Part 3 — Discussion", IELTS_SPEAKING.part3.length + " discussion questions", "sp:p3") +
    "</div></div>";
  wireBack(renderIeltsHub);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { startIeltsSpeaking(b.getAttribute("data-tp").slice(3)); });
  });
}

var spIdx = 0;

function startIeltsSpeaking(part) {
  clearTimer();
  var el = stage();
  if (part === "p1") {
    spIdx = 0;
    el.innerHTML = '<div class="tp-wrap">' + backBar("Speaking", pickIeltsSpeaking) +
      "<h2>💬 Part 1 — Interview</h2><p class='fine'>Answer aloud in 2–3 sentences: answer + reason + example.</p>" +
      '<div class="tp-cue"><p id="tpSpQ"></p></div>' +
      '<div class="row-btns"><button class="btn-primary" id="tpNext">Next question →</button></div>' +
      '<div id="tpRecHost"></div>' + selfAssessHTML() + "</div>";
    wireBack(pickIeltsSpeaking);
    renderSpQ();
    $("tpNext").addEventListener("click", function () {
      spIdx = (spIdx + 1) % IELTS_SPEAKING.part1.length;
      renderSpQ();
    });
    renderRecUI("tpRecHost");
    wireSelfAssess("IELTS Speaking Part 1");
  } else if (part === "p2") {
    spIdx = 0;
    el.innerHTML = '<div class="tp-wrap">' + backBar("Speaking", pickIeltsSpeaking) +
      "<h2>🎴 Part 2 — Cue card</h2><p class='fine'>Pick a card → <strong>1 minute</strong> to prepare → " +
      "talk for <strong>2 minutes</strong> without stopping.</p>" +
      '<div class="tp-grid">' + IELTS_SPEAKING.part2.map(function (c, i) {
        return hubCard("🎴", "Cue card " + (i + 1), c.topic, "spc:" + i);
      }).join("") + "</div><div id='tpRecHost'></div>" + selfAssessHTML() + "</div>";
    wireBack(pickIeltsSpeaking);
    renderRecUI("tpRecHost");
    wireSelfAssess("IELTS Speaking Part 2");
    el.querySelectorAll("[data-tp]").forEach(function (b) {
      b.addEventListener("click", function () { startCueCard(parseInt(b.getAttribute("data-tp").slice(4), 10)); });
    });
  } else {
    spIdx = 0;
    el.innerHTML = '<div class="tp-wrap">' + backBar("Speaking", pickIeltsSpeaking) +
      "<h2>🧠 Part 3 — Discussion</h2><p class='fine'>Discuss ideas generally (not just personal stories). " +
      "Aim for 4–5 sentences per answer.</p>" +
      '<div class="tp-cue"><p id="tpSpQ"></p></div>' +
      '<div class="row-btns"><button class="btn-primary" id="tpNext">Next question →</button></div>' +
      '<div id="tpRecHost"></div>' + selfAssessHTML() + "</div>";
    wireBack(pickIeltsSpeaking);
    renderSpQ3();
    $("tpNext").addEventListener("click", function () {
      spIdx = (spIdx + 1) % IELTS_SPEAKING.part3.length;
      renderSpQ3();
    });
    renderRecUI("tpRecHost");
    wireSelfAssess("IELTS Speaking Part 3");
  }
}

function renderSpQ() { $("tpSpQ").innerHTML = "<strong>Q" + (spIdx + 1) + ".</strong> " + esc(IELTS_SPEAKING.part1[spIdx]); }
function renderSpQ3() { $("tpSpQ").innerHTML = "<strong>Q" + (spIdx + 1) + ".</strong> " + esc(IELTS_SPEAKING.part3[spIdx]); }

function startCueCard(i) {
  var c = IELTS_SPEAKING.part2[i];
  clearTimer();
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("Part 2", function () { startIeltsSpeaking("p2"); }) +
    '<div class="tp-cue"><h3>🎴 ' + esc(c.topic) + "</h3><p class='fine'>You should say:</p><ul>" +
    c.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>" +
    '<div class="tp-prep"><p><strong>Preparation: <span id="tpPrepT">01:00</span></strong> — note 4–5 key words, not sentences.</p>' +
    '<button class="btn-primary" id="tpStartTalk" disabled>Start talking (2:00)</button> ' +
    '<span class="fine" id="tpTalkT"></span></div>' +
    '<div id="tpRecHost"></div>' + selfAssessHTML() + "</div>";
  wireBack(function () { startIeltsSpeaking("p2"); });
  renderRecUI("tpRecHost");
  wireSelfAssess("IELTS Speaking Part 2");
  var left = 60;
  timerId = setInterval(function () {
    left--;
    var t = $("tpPrepT");
    if (t) t.textContent = fmtTime(Math.max(0, left));
    if (left <= 0) {
      clearInterval(timerId); timerId = null;
      var b = $("tpStartTalk");
      if (b) { b.disabled = false; b.textContent = "🎤 Start talking (2:00)"; }
    }
  }, 1000);
  $("tpStartTalk").addEventListener("click", function () {
    $("tpStartTalk").disabled = true;
    startTimer(120, function () { toast("⏱ 2 minutes — well done! Now self-assess below."); });
    $("tpTalkT").textContent = "Talk now — cover all four bullet points!";
  });
}

var SP_CRIT = [["fluency", "Fluency & Coherence"], ["vocab", "Vocabulary"], ["grammar", "Grammar"], ["pron", "Pronunciation"]];

function selfAssessHTML() {
  return '<div class="tp-self"><h3>⭐ Self-assessment</h3><p class="fine">Be honest — rate yourself 1–5 on each. ' +
    "Then get your estimated band.</p>" +
    SP_CRIT.map(function (c) {
      return '<div class="tp-stars" data-crit="' + c[0] + '"><span>' + c[1] + "</span><span class='tp-starbtns'>" +
        [1, 2, 3, 4, 5].map(function (n) {
          return '<button data-star="' + n + '">☆</button>';
        }).join("") + "</span></div>";
    }).join("") +
    '<button class="btn-primary" id="tpBandBtn">Estimate my band</button><div id="tpBandOut"></div></div>';
}

function wireSelfAssess(title) {
  var stars = { fluency: 0, vocab: 0, grammar: 0, pron: 0 };
  document.querySelectorAll(".tp-stars").forEach(function (row) {
    var crit = row.getAttribute("data-crit");
    row.querySelectorAll("[data-star]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = parseInt(b.getAttribute("data-star"), 10);
        stars[crit] = n;
        row.querySelectorAll("[data-star]").forEach(function (x) {
          x.textContent = parseInt(x.getAttribute("data-star"), 10) <= n ? "★" : "☆";
        });
      });
    });
  });
  $("tpBandBtn").addEventListener("click", function () {
    if (Object.keys(stars).some(function (k) { return !stars[k]; })) { toast("Rate all four criteria first ⭐"); return; }
    var band = speakingBandFromStars(stars);
    $("tpBandOut").innerHTML = '<div class="tp-score">Estimated band: <strong>' + band.toFixed(1) + "</strong>" +
      '<p class="fine">Practice estimate from self-assessment — not an official IELTS band.</p></div>';
    logResult("ielts", "speaking", { title: title, score: Math.round(band * 10), total: 90,
      pct: Math.round(band / 9 * 100), band: band, secs: 0 });
    toast("🗣️ Speaking self-assessment — band " + band.toFixed(1));
  });
}

/* ================= IELTS TIPS ================= */

function renderIeltsTips() {
  clearTimer();
  var secs = [["📖 Reading", IELTS_TIPS.reading], ["🎧 Listening", IELTS_TIPS.listening], ["✍️ Writing", IELTS_TIPS.writing], ["🗣️ Speaking", IELTS_TIPS.speaking]];
  stage().innerHTML = '<div class="tp-wrap">' + backBar("IELTS", renderIeltsHub) +
    "<h2>💡 IELTS Exam Tips</h2>" +
    secs.map(function (s) {
      return '<div class="tp-crit"><h4>' + s[0] + "</h4><ul>" +
        s[1].map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div>";
  wireBack(renderIeltsHub);
}

/* ================= DUOLINGO ENGLISH TEST ================= */

function renderDetHub() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("Test Prep", showTestprep) +
    "<h2>🟢 Duolingo English Test</h2><p class='fine'>Adaptive, ~1 hour, scored 10–160. Practice each question type below.</p>" +
    '<div class="tp-grid">' +
    hubCard("✅", "Read & Select", "60 seconds · tap the REAL English words", "d-select") +
    hubCard("✏️", "Read & Complete", "3 minutes · complete the missing word endings", "d-complete") +
    hubCard("👂", "Listen & Type", "Hear a sentence (3 plays) · type exactly what you hear", "d-listen") +
    hubCard("⌨️", "Interactive Writing", "5 minutes · write about the prompt", "d-writing") +
    hubCard("🎤", "Speaking Sample", "30s prep + 90s talk · optional recording", "d-speaking") +
    hubCard("💡", "DET tips", "Timing, adaptive format & test-day rules", "d-tips") +
    "</div></div>";
  wireBack(showTestprep);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { openDet(b.getAttribute("data-tp")); });
  });
}

function openDet(id) {
  if (id === "d-select") startDetSelect();
  else if (id === "d-complete") pickDetComplete();
  else if (id === "d-listen") startDetListen();
  else if (id === "d-writing") pickDetWriting();
  else if (id === "d-speaking") pickDetSpeaking();
  else if (id === "d-tips") renderDetTips();
}

/* ---- Read & Select ---- */
function startDetSelect() {
  clearTimer();
  var deck = {
    real: shuffle(DET_READ_SELECT_REAL.slice(), Math.random).slice(0, 9),
    fake: shuffle(DET_READ_SELECT_FAKE.slice(), Math.random).slice(0, 9)
  };
  var words = shuffle(deck.real.concat(deck.fake), Math.random);
  var picks = [];
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("DET", renderDetHub) +
    "<h2>✅ Read & Select</h2><p class='fine'><strong>60 seconds.</strong> Tap every word that is a <strong>real English word</strong>. " +
    "Wrong taps lose points — when unsure, skip.</p>" +
    '<div class="tp-wordgrid">' + words.map(function (w) {
      return '<button class="tp-word" data-w="' + esc(w) + '">' + esc(w) + "</button>";
    }).join("") + "</div>" +
    '<button class="btn-primary btn-big" id="tpSubmit">Submit</button><div id="tpResult"></div></div>';
  wireBack(renderDetHub);
  el.querySelectorAll("[data-w]").forEach(function (b) {
    b.addEventListener("click", function () {
      var w = b.getAttribute("data-w");
      var i = picks.indexOf(w);
      if (i >= 0) { picks.splice(i, 1); b.classList.remove("sel"); }
      else { picks.push(w); b.classList.add("sel"); }
    });
  });
  function done(auto) {
    clearTimer();
    var score = detReadSelectScore(picks, deck);
    var dScore = detScore(score, 18);
    $("tpResult").innerHTML = '<div class="tp-score">Correct picks minus wrong picks: <strong>' + score +
      "/18</strong> · DET-style score: <strong>" + dScore + "/160</strong>" +
      '<p class="fine">Practice estimate — the real DET is adaptive and scored 10–160.</p></div>';
    $("tpResult").scrollIntoView();
    logResult("det", "readselect", { title: "DET Read & Select", score: score, total: 18,
      pct: Math.round(score / 18 * 100), band: 0, secs: 0 });
    toast("✅ Read & Select — " + dScore + "/160");
  }
  startTimer(60, function () { done(true); });
  $("tpSubmit").addEventListener("click", function () { done(false); });
}

/* ---- Read & Complete ---- */
function pickDetComplete() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("DET", renderDetHub) +
    "<h2>✏️ Read & Complete</h2><p class='fine'><strong>3 minutes.</strong> Type the missing endings. " +
    "Use the first letters and grammar clues.</p>" +
    '<div class="tp-grid">' + DET_READ_COMPLETE.map(function (p) {
      return hubCard("📄", p.title, p.answers.length + " missing word endings", "dc:" + p.id);
    }).join("") + "</div></div>";
  wireBack(renderDetHub);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { startDetComplete(b.getAttribute("data-tp").slice(3)); });
  });
}

function startDetComplete(pid) {
  var p = DET_READ_COMPLETE.find(function (x) { return x.id === pid; });
  if (!p) return;
  clearTimer();
  var parts = p.text.split("___");
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("Read & Complete", pickDetComplete) +
    "<h2>✏️ " + esc(p.title) + "</h2><p class='fine'>⏱ 3:00 — complete each word.</p>" +
    '<div class="tp-passage tp-rc">' + parts.map(function (part, i) {
      return esc(part) + (i < parts.length - 1 ? '<input class="tp-blank" id="tpb' + i + '" type="text" autocomplete="off">' : "");
    }).join("") + "</div>" +
    '<button class="btn-primary btn-big" id="tpSubmit">Check answers</button><div id="tpResult"></div></div>';
  wireBack(pickDetComplete);
  function done() {
    clearTimer();
    var correct = 0, rows = [];
    p.answers.forEach(function (ans, i) {
      var v = (($("tpb" + i) || {}).value || "").trim();
      var ok = norm(v) === norm(ans);
      if (ok) correct++;
      rows.push('<div class="tp-mark ' + (ok ? "ok" : "bad") + '">' + (ok ? "✓" : "✗") +
        " <strong>" + esc(ans) + "</strong>" + (ok ? "" : " — you wrote: " + esc(v || "—")) + "</div>");
    });
    var dScore = detScore(correct, p.answers.length);
    $("tpResult").innerHTML = '<div class="tp-score"><strong>' + correct + "/" + p.answers.length +
      "</strong> correct · DET-style score: <strong>" + dScore + "/160</strong>" +
      '<p class="fine">Practice estimate — not an official DET score.</p></div>' + rows.join("");
    $("tpResult").scrollIntoView();
    logResult("det", "readcomplete", { title: "DET Read & Complete: " + p.title, score: correct, total: p.answers.length,
      pct: Math.round(correct / p.answers.length * 100), band: 0, secs: 0 });
    toast("✏️ Read & Complete — " + dScore + "/160");
  }
  startTimer(180, done);
  $("tpSubmit").addEventListener("click", done);
}

/* ---- Listen & Type ---- */
var detPlays = 0, detSentence = "";

function startDetListen() {
  clearTimer();
  detSentence = DET_LISTEN_TYPE[Math.floor(Math.random() * DET_LISTEN_TYPE.length)];
  detPlays = 0;
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("DET", renderDetHub) +
    "<h2>👂 Listen & Type</h2><p class='fine'>Listen to the sentence (<strong>3 plays</strong>), " +
    "then type <strong>exactly</strong> what you hear — spelling and punctuation count.</p>" +
    '<div class="tp-audio"><button class="btn-primary" id="tpPlay">▶ Play sentence</button> ' +
    '<button class="btn-ghost" id="tpReplay" disabled>🔁 Replay</button>' +
    '<p class="fine" id="tpPlays"></p></div>' +
    '<input class="tp-fill tp-bigfill" id="tpTyped" type="text" placeholder="Type the sentence here…" autocomplete="off">' +
    '<button class="btn-primary btn-big" id="tpSubmit">Check</button><div id="tpResult"></div></div>';
  wireBack(renderDetHub);
  function play() {
    if (!ttsAvailable()) { $("tpPlays").textContent = "🔊 Audio not available on this device."; return; }
    if (detPlays >= 3) return;
    detPlays++;
    speak(detSentence, { rate: 0.95 });
    $("tpPlays").textContent = "Plays used: " + detPlays + "/3";
    if (detPlays >= 3) $("tpReplay").disabled = true;
    else $("tpReplay").disabled = false;
  }
  $("tpPlay").addEventListener("click", play);
  $("tpReplay").addEventListener("click", play);
  $("tpSubmit").addEventListener("click", function () {
    clearTimer();
    var typed = $("tpTyped").value;
    var pct = scoreListenType(detSentence, typed);
    var dScore = detScore(pct, 100);
    $("tpResult").innerHTML = '<div class="tp-score">Word accuracy: <strong>' + pct +
      "%</strong> · DET-style score: <strong>" + dScore + "/160</strong>" +
      '<p class="fine">The sentence was: “' + esc(detSentence) + "”</p>" +
      '<p class="fine">Practice estimate — not an official DET score.</p></div>' +
      '<button class="btn-ghost" id="tpAgain">🔁 Try another sentence</button>';
    $("tpResult").scrollIntoView();
    $("tpAgain").addEventListener("click", startDetListen);
    logResult("det", "listentype", { title: "DET Listen & Type", score: pct, total: 100, pct: pct, band: 0, secs: 0 });
    toast("👂 Listen & Type — " + pct + "%");
  });
}

/* ---- Interactive Writing ---- */
function pickDetWriting() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("DET", renderDetHub) +
    "<h2>⌨️ Interactive Writing</h2><p class='fine'><strong>5 minutes.</strong> Write at least 50 words. " +
    "The real test adapts follow-up questions to your answer.</p>" +
    '<div class="tp-grid">' + DET_WRITING.map(function (w) {
      return hubCard("⌨️", w.prompt.slice(0, 60) + "…", "5 min · 50+ words", "dw:" + w.id);
    }).join("") + "</div></div>";
  wireBack(renderDetHub);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { startDetWriting(b.getAttribute("data-tp").slice(3)); });
  });
}

function startDetWriting(wid) {
  var w = DET_WRITING.find(function (x) { return x.id === wid; });
  if (!w) return;
  clearTimer();
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("Interactive Writing", pickDetWriting) +
    '<div class="tp-prompt">' + esc(w.prompt) + "</div>" +
    '<p class="fine">⏱ 5:00 · aim for 50+ words.</p>' +
    '<textarea id="tpWrite" class="tp-textarea" rows="10" placeholder="Write here…"></textarea>' +
    '<p class="fine"><span id="tpWc">0</span> words (aim 50+)</p>' +
    '<button class="btn-primary btn-big" id="tpGetFb">Get feedback</button><div id="tpResult"></div></div>';
  wireBack(pickDetWriting);
  startTimer(w.timeMin * 60, function () { toast("⏱ Time's up — submit when ready."); });
  $("tpWrite").addEventListener("input", function () { $("tpWc").textContent = wordCount($("tpWrite").value); });
  $("tpGetFb").addEventListener("click", function () {
    clearTimer();
    var text = $("tpWrite").value;
    if (wordCount(text) < 10) { toast("Write a little more first ⌨️"); return; }
    var fb = ieltsWritingFeedback(text, { task: "DET", minWords: w.minWords, prompt: w.prompt });
    var html = '<div class="tp-score">DET-style production score: <strong>' + detScore(Math.round(fb.band / 9 * 100), 100) + "/160</strong>" +
      '<p class="fine">Practice estimate from an automated check — not an official DET score.</p></div>';
    fb.criteria.forEach(function (c) {
      html += '<div class="tp-crit"><h4>' + esc(c.name) + "</h4><ul>" +
        c.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul></div>";
    });
    html += '<button class="btn-ghost" id="tpRevise">✏️ Revise & check again</button>';
    $("tpResult").innerHTML = html;
    $("tpResult").scrollIntoView();
    $("tpRevise").addEventListener("click", function () { $("tpResult").innerHTML = ""; $("tpWrite").focus(); });
    logResult("det", "writing", { title: "DET Interactive Writing", score: Math.round(fb.band * 10), total: 90,
      pct: Math.round(fb.band / 9 * 100), band: 0, secs: 0 });
    toast("⌨️ Feedback ready");
  });
}

/* ---- Speaking Sample ---- */
function pickDetSpeaking() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("DET", renderDetHub) +
    "<h2>🎤 Speaking Sample</h2><p class='fine'><strong>30 seconds</strong> to prepare, then " +
    "<strong>90 seconds</strong> of speaking. This sample is also sent to institutions in the real test!</p>" +
    '<div class="tp-grid">' + DET_SPEAKING.map(function (s) {
      return hubCard("🎤", s.prompt.slice(0, 60) + "…", "30s prep · 90s talk", "ds:" + s.id);
    }).join("") + "</div></div>";
  wireBack(renderDetHub);
  stage().querySelectorAll("[data-tp]").forEach(function (b) {
    b.addEventListener("click", function () { startDetSpeaking(b.getAttribute("data-tp").slice(3)); });
  });
}

function startDetSpeaking(sid) {
  var s = DET_SPEAKING.find(function (x) { return x.id === sid; });
  if (!s) return;
  clearTimer();
  var el = stage();
  el.innerHTML = '<div class="tp-wrap">' + backBar("Speaking Sample", pickDetSpeaking) +
    '<div class="tp-cue"><h3>🎤 ' + esc(s.prompt) + "</h3></div>" +
    '<div class="tp-prep"><p><strong>Preparation: <span id="tpPrepT">00:30</span></strong></p>' +
    '<button class="btn-primary" id="tpStartTalk" disabled>Start talking (1:30)</button> ' +
    '<span class="fine" id="tpTalkT"></span></div>' +
    '<div id="tpRecHost"></div>' + selfAssessHTML().replace("Estimate my band", "Estimate my score") + "</div>";
  wireBack(pickDetSpeaking);
  renderRecUI("tpRecHost");
  var left = 30;
  timerId = setInterval(function () {
    left--;
    var t = $("tpPrepT");
    if (t) t.textContent = fmtTime(Math.max(0, left));
    if (left <= 0) {
      clearInterval(timerId); timerId = null;
      var b = $("tpStartTalk");
      if (b) { b.disabled = false; b.textContent = "🎤 Start talking (1:30)"; }
    }
  }, 1000);
  $("tpStartTalk").addEventListener("click", function () {
    $("tpStartTalk").disabled = true;
    startTimer(90, function () { toast("⏱ 90 seconds — great effort!"); });
    $("tpTalkT").textContent = "Talk now — keep going for the full 90 seconds!";
  });
  // self-assessment → DET-style score
  var stars = { fluency: 0, vocab: 0, grammar: 0, pron: 0 };
  document.querySelectorAll(".tp-stars").forEach(function (row) {
    var crit = row.getAttribute("data-crit");
    row.querySelectorAll("[data-star]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = parseInt(b.getAttribute("data-star"), 10);
        stars[crit] = n;
        row.querySelectorAll("[data-star]").forEach(function (x) {
          x.textContent = parseInt(x.getAttribute("data-star"), 10) <= n ? "★" : "☆";
        });
      });
    });
  });
  $("tpBandBtn").addEventListener("click", function () {
    if (Object.keys(stars).some(function (k) { return !stars[k]; })) { toast("Rate all four criteria first ⭐"); return; }
    var avg = (stars.fluency + stars.vocab + stars.grammar + stars.pron) / 4;
    var dScore = Math.round(10 + (avg / 5) * 150);
    $("tpBandOut").innerHTML = '<div class="tp-score">Estimated DET score: <strong>' + dScore + "/160</strong>" +
      '<p class="fine">Practice estimate from self-assessment — not an official DET score.</p></div>';
    logResult("det", "speaking", { title: "DET Speaking Sample", score: dScore, total: 160,
      pct: Math.round((dScore - 10) / 150 * 100), band: 0, secs: 0 });
    toast("🎤 Self-assessment — " + dScore + "/160");
  });
}

/* ---- DET tips ---- */
function renderDetTips() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("DET", renderDetHub) +
    "<h2>💡 Duolingo English Test Tips</h2>" +
    '<div class="tp-crit"><ul>' + DET_TIPS.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></div>";
  wireBack(renderDetHub);
}

/* ================= TOEFL iBT & PTE ACADEMIC overviews ================= */

var TOEFL_PTE = [
{
  test: "TOEFL iBT", emoji: "🎓",
  blurb: "The classic university-admissions test. ~2 hours, scored 0–120.",
  sections: [
    { name: "Reading", time: "35 min", desc: "2 passages, 20 questions — academic texts like IELTS." },
    { name: "Listening", time: "36 min", desc: "Lectures + conversations, played once — like IELTS Listening." },
    { name: "Speaking", time: "16 min", desc: "4 tasks: 1 independent + 3 integrated (read/listen, then speak)." },
    { name: "Writing", time: "29 min", desc: "1 integrated task (read + listen, then write) + 1 academic discussion post." }
  ],
  tips: [
    "Take notes while listening — you can use them in Speaking and Writing.",
    "Integrated tasks combine skills: practise reading, then summarising aloud.",
    "The discussion-board writing task rewards natural, conversational academic tone.",
    "Time is tight: don't re-read whole passages; scan for answers.",
    "Speak for the full response time — short answers score poorly."
  ],
  practice: [["📖 IELTS Reading", "ielts-reading"], ["🎧 IELTS Listening", "ielts-listening"], ["🗣️ IELTS Speaking", "ielts-speaking"]]
},
{
  test: "PTE Academic", emoji: "💻",
  blurb: "Fully computer-based with AI scoring. ~2 hours, scored 10–90.",
  sections: [
    { name: "Speaking & Writing", time: "54–67 min", desc: "Read aloud, repeat sentence, describe image, essay — microphone fluency matters." },
    { name: "Reading", time: "29–30 min", desc: "Fill in blanks, reorder paragraphs, MCQ." },
    { name: "Listening", time: "30–43 min", desc: "Summarise spoken text, fill blanks, write from dictation." }
  ],
  tips: [
    "Fluency beats perfection: keep talking smoothly, don't stop to fix small errors.",
    "'Write from Dictation' is high-value — practise exact typing from audio.",
    "In 'Describe Image', use a fixed template: overview → details → conclusion.",
    "Reorder-paragraphs: look for pronoun links (this, these, they) between sentences.",
    "The mic scores oral fluency — practise the 🗣️ Say It screen in LinguaBuddy."
  ],
  practice: [["📖 IELTS Reading", "ielts-reading"], ["👂 DET Listen & Type", "det-listen"], ["✍️ IELTS Writing", "ielts-writing"]]
}
];

function renderOtherHub() {
  clearTimer();
  stage().innerHTML = '<div class="tp-wrap">' + backBar("Test Prep", showTestprep) +
    "<h2>🌍 TOEFL iBT & PTE Academic</h2><p class='fine'>Format overviews + tips. " +
    "Your LinguaBuddy IELTS/DET practice builds the same underlying skills.</p>" +
    TOEFL_PTE.map(function (t, ti) {
      return '<div class="tp-other"><h3>' + t.emoji + " " + esc(t.test) + "</h3>" +
        "<p class='fine'>" + esc(t.blurb) + "</p>" +
        t.sections.map(function (s) {
          return '<div class="tp-sec"><strong>' + esc(s.name) + "</strong> <span class='fine'>· " + esc(s.time) + "</span><br>" + esc(s.desc) + "</div>";
        }).join("") +
        "<h4>💡 Tips</h4><ul>" + t.tips.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        "<h4>🏋️ Practise with</h4><div class='row-btns'>" +
        t.practice.map(function (p, pi) {
          return '<button class="btn-ghost" data-px="' + ti + ":" + pi + '">' + esc(p[0]) + "</button>";
        }).join("") + "</div></div>";
    }).join("") + "</div>";
  wireBack(showTestprep);
  stage().querySelectorAll("[data-px]").forEach(function (b) {
    b.addEventListener("click", function () {
      var parts = b.getAttribute("data-px").split(":");
      var dest = TOEFL_PTE[parseInt(parts[0], 10)].practice[parseInt(parts[1], 10)][1];
      if (dest === "ielts-reading") pickIeltsReading();
      else if (dest === "ielts-listening") pickIeltsListening();
      else if (dest === "ielts-speaking") pickIeltsSpeaking();
      else if (dest === "ielts-writing") pickIeltsWriting();
      else if (dest === "det-listen") startDetListen();
    });
  });
}

/* ================= score report ================= */

function bestBand(list) {
  if (!list || !list.length) return 0;
  return Math.max.apply(null, list.map(function (r) { return r.band || 0; }));
}
function bestDet(list) {
  if (!list || !list.length) return 0;
  return Math.max.apply(null, list.map(function (r) { return r.score || 0; }));
}

function renderReport() {
  clearTimer();
  var st = tpState();
  var rBands = [bestBand(st.ielts.reading), bestBand(st.ielts.listening), bestBand(st.ielts.writing), bestBand(st.ielts.speaking)];
  var overall = overallBand(rBands);
  var labels = ["Reading", "Listening", "Writing", "Speaking"];
  var weakest = 0;
  rBands.forEach(function (b, i) { if (b > 0 && (rBands[weakest] === 0 || b < rBands[weakest])) weakest = i; });
  var recs = {
    0: "Do one more Reading passage, and use the 💡 Exam tips — skim questions first.",
    1: "Replay Listening scripts and read the scripts' 'why' explanations for misses.",
    2: "Write another essay and compare feedback — watch paragraphing and linking words.",
    3: "Record yourself on a new cue card and self-assess again."
  };
  var detBest = Math.max(bestDet(st.det.readselect), bestDet(st.det.readcomplete), bestDet(st.det.listentype),
    bestDet(st.det.writing), bestDet(st.det.speaking));

  var rows = labels.map(function (l, i) {
    return "<tr><td>" + l + "</td><td>" + (rBands[i] ? rBands[i].toFixed(1) : "—") + "</td></tr>";
  }).join("");

  stage().innerHTML = '<div class="tp-wrap">' + backBar("Test Prep", showTestprep) +
    "<h2>📊 My Score Report</h2>" +
    '<div class="tp-report"><h3>🇬🇧 IELTS practice</h3><table class="tp-table">' + rows +
    '<tr class="tp-total"><td><strong>Overall band</strong></td><td><strong>' +
    (overall ? overall.toFixed(1) : "—") + "</strong></td></tr></table>" +
    (overall ? "<p><strong>🎯 Next step:</strong> " + esc(recs[weakest]) + "</p>" : "<p class='fine'>Complete a practice section to see your report.</p>") +
    "<h3>🟢 Duolingo English Test practice</h3>" +
    "<p>Best DET-style score so far: <strong>" + (detBest ? detBest + "/160" : "—") + "</strong></p>" +
    '<p class="fine">All scores are practice estimates from LinguaBuddy exercises — not official test scores.</p>' +
    '<button class="btn-primary" id="tpPrint">🖨️ Print report</button></div></div>';
  wireBack(showTestprep);

  $("tpPrint").addEventListener("click", function () {
    var html = '<div class="ws-page"><h2>🎓 LinguaBuddy Test Prep — Score Report</h2>' +
      "<p><strong>Learner:</strong> " + esc(S.profile.name || "Learner") +
      " · <strong>Date:</strong> " + new Date().toLocaleDateString() + "</p>" +
      "<h3>IELTS practice (band estimates)</h3><table border='1' cellpadding='6' cellspacing='0'>" + rows +
      "<tr><td><strong>Overall band</strong></td><td><strong>" + (overall ? overall.toFixed(1) : "—") + "</strong></td></tr></table>" +
      (overall ? "<p><strong>Recommended next step:</strong> " + esc(recs[weakest]) + "</p>" : "") +
      "<h3>DET practice</h3><p>Best DET-style score: <strong>" + (detBest ? detBest + "/160" : "—") + "</strong></p>" +
      "<p><em>Practice estimates from LinguaBuddy exercises — not official test scores.</em></p></div>";
    printHTML(html);
  });
}
