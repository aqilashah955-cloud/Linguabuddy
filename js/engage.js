// LinguaBuddy — Engagement & Family: daily content, pronunciation practice,
// parent dashboard. Offline-first; Web Speech APIs only (no network).
// Pure helpers (pickDaily, checkIn, scorePronunciation, sayItTargets,
// helpTips, buildReportData, reportHTML, listLearners) are exported for
// node tests; everything touching document lives inside functions.

import { WORD_OF_DAY, PHRASE_OF_DAY, IDIOM_OF_DAY, TONGUE_TWISTERS } from "../data/daily.js";
import { S, save, touchStreak } from "./store.js";
import { awardXP, toast } from "./gamify.js";
import { speak, speakSlow, ttsAvailable } from "./tts.js";
import { calculateSLOMastery } from "./engine.js";
import { mascotSVG, confettiBurst } from "./mascot.js";
import { esc, todayKey } from "./utils.js";
import { openMarksStudent } from "./marks.js";
import { renderTutors } from "./tutors-ui.js";

function $(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }

/* ================= daily picks (pure, deterministic) ================= */

/** djb2 string hash -> non-negative int. */
export function hashStr(s) {
  var h = 5381;
  s = String(s);
  for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Deterministic daily content for a date string like "2026-10-04".
 * Consecutive days get different picks (salted hash per list).
 */
export function pickDaily(dateStr) {
  var d = String(dateStr || "");
  return {
    date: d,
    word: WORD_OF_DAY[hashStr(d + ":word") % WORD_OF_DAY.length],
    phrase: PHRASE_OF_DAY[hashStr(d + ":phrase") % PHRASE_OF_DAY.length],
    idiom: IDIOM_OF_DAY[hashStr(d + ":idiom") % IDIOM_OF_DAY.length],
    twister: TONGUE_TWISTERS[hashStr(d + ":twister") % TONGUE_TWISTERS.length]
  };
}

export function todayContent() { return pickDaily(todayKey()); }

/* ================= daily check-in (pure helper + screen action) ================= */

/**
 * Mark a date as practiced in a plain {dateStr: true} map.
 * Returns true if this is a NEW check-in, false if already checked in.
 */
export function checkIn(state, dateStr) {
  state = state || {};
  var key = String(dateStr);
  if (state[key]) return false;
  state[key] = true;
  return true;
}

/** Screen action: check in today → streak + XP + celebration. */
export function doCheckIn() {
  if (!S.dailyCheck) S.dailyCheck = {};
  var fresh = checkIn(S.dailyCheck, todayKey());
  if (!fresh) { toast("Already checked in today! ✅"); return false; }
  touchStreak();
  awardXP(10, "Daily check-in");
  save();
  confettiBurst();
  return true;
}

/* ================= pronunciation (pure scoring) ================= */

function wordsOf(t) {
  return String(t || "").toLowerCase().replace(/[^a-z\s']/g, " ")
    .split(/\s+/).filter(function (w) { return w.length > 0; });
}

/**
 * Fuzzy word-overlap score 0–100 of what was heard vs the target.
 * Exact match → 100, empty spoken → 0, partial credit by matched words.
 */
export function scorePronunciation(spoken, target) {
  var t = wordsOf(target), s = wordsOf(spoken);
  if (!t.length || !s.length) return 0;
  var counts = {};
  t.forEach(function (w) { counts[w] = (counts[w] || 0) + 1; });
  var hits = 0;
  s.forEach(function (w) { if (counts[w] > 0) { counts[w]--; hits++; } });
  return Math.round(hits / t.length * 100);
}

/** Speech-recognition constructor or null when unsupported. */
export function speechRecCtor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/** Listen once via the Web Speech API; onDone(transcript). Returns {supported}. */
export function startListen(onDone) {
  var Ctor = speechRecCtor();
  if (!Ctor) return { supported: false };
  var rec;
  try { rec = new Ctor(); } catch (e) { return { supported: false }; }
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = function (e) {
    var txt = "";
    try { txt = e.results[0][0].transcript; } catch (err) {}
    onDone(txt);
  };
  rec.onerror = function () { onDone(""); };
  try { rec.start(); } catch (e) { return { supported: false }; }
  return { supported: true, stop: function () { try { rec.stop(); } catch (e) {} } };
}

/** Targets for Say It: today's word + phrase + up to 6 saved vocab words. */
export function sayItTargets(state, daily) {
  state = state || S;
  daily = daily || pickDaily(todayKey());
  var out = [
    { kind: "word", text: daily.word.word, sub: daily.word.meaning },
    { kind: "phrase", text: daily.phrase.phrase, sub: daily.phrase.meaning }
  ];
  (state.vocab || []).slice(-6).forEach(function (v) {
    if (v && v.word) out.push({ kind: "vocab", text: v.word, sub: v.definition || "" });
  });
  return out;
}

/* ================= parent dashboard (pure data + report) ================= */

/** Learners on this device. Parent will wire S.profiles; falls back to current. */
export function listLearners() {
  if (Array.isArray(S.profiles) && S.profiles.length) return S.profiles;
  return [S.profile];
}

/** Aggregate learner stats from a store-like state object (pure). */
export function buildReportData(state) {
  state = state || S;
  var p = state.profile || {};
  var masteryEv = state.masteryEv || {};
  var mastered = 0;
  Object.keys(masteryEv).forEach(function (sloId) {
    try {
      if (calculateSLOMastery(sloId, masteryEv[sloId]).status === "mastered") mastered++;
    } catch (e) { /* ignore malformed evidence */ }
  });
  var attempts = state.attempts || [];
  var stories = 0;
  Object.keys(state.reading || {}).forEach(function (k) {
    if (state.reading[k] && state.reading[k].done) stories++;
  });
  return {
    name: p.name || "Learner",
    level: p.level || "",
    xp: p.xp || 0,
    streak: p.streak || 0,
    slosMastered: mastered,
    wordsLearned: (state.vocab || []).length,
    storiesRead: stories,
    gamesPlayed: attempts.filter(function (a) { return a && a.kind === "game"; }).length,
    assessmentsDone: attempts.filter(function (a) { return a && (a.mode === "assess" || a.mode === "reassess"); }).length,
    badges: (p.badges || []).length
  };
}

/** Printable-friendly report HTML (pure string). */
export function reportHTML(d) {
  function row(label, value) {
    return '<tr><td>' + esc(label) + '</td><td><strong>' + esc(String(value)) + '</strong></td></tr>';
  }
  return '<div class="pr-report">' +
    '<h2>🦉 LinguaBuddy Progress Report</h2>' +
    '<p class="pr-name">' + esc(d.name) + (d.level ? ' · ' + esc(d.level) : '') + '</p>' +
    '<table class="pr-table"><tbody>' +
    row("Total XP", d.xp) +
    row("Day streak", d.streak + (d.streak === 1 ? " day" : " days")) +
    row("SLOs mastered", d.slosMastered) +
    row("Words learned", d.wordsLearned) +
    row("Stories read", d.storiesRead) +
    row("Game rounds played", d.gamesPlayed) +
    row("Assessments completed", d.assessmentsDone) +
    row("Badges earned", d.badges) +
    '</tbody></table>' +
    '<p class="pr-foot">Keep practicing a little every day — consistency wins! 🌟</p>' +
    '</div>';
}

/** Actionable tips for parents by age group (pure). */
export function helpTips(ageGroup) {
  var tips = {
    kids: [
      "Read one story aloud together for 10 minutes a day — take turns with the pages.",
      "Praise effort, not just correct answers: “I love how you tried that hard word!”",
      "Let them teach YOU a new word they learned — teaching locks it in.",
      "Keep sessions short and playful: games and tongue twisters first, worksheets later."
    ],
    juniors: [
      "Ask them to explain one grammar rule in their own words after each lesson.",
      "Watch an English cartoon together and chat about it in English afterwards.",
      "Set a 15-minute daily practice routine at the same time each day.",
      "Celebrate streaks — a 7-day streak matters more than one long session."
    ],
    teens: [
      "Encourage a short English journal: 3–5 sentences about their day.",
      "Discuss news, sports or movies in English — real topics build real fluency.",
      "Let them lead a conversation practice session; you play the partner.",
      "Review this report together weekly and set one small goal for next week."
    ]
  };
  return tips[ageGroup] || tips.juniors;
}

/** Render the report into #print-area and open the print dialog. */
export function printReport() {
  if (typeof document === "undefined") return false;
  var el = document.getElementById("print-area");
  if (!el) return false;
  el.innerHTML = reportHTML(buildReportData(S));
  if (typeof window !== "undefined" && typeof window.print === "function") window.print();
  return true;
}

/* ================= screens ================= */

var currentSayTarget = null;

function playBtn(text, slow) {
  if (!ttsAvailable()) return "";
  return '<button class="btn-sayit-play" data-say="' + esc(text) + '" data-slow="' + (slow ? "1" : "0") + '">' +
    (slow ? "🐢" : "🔊") + '</button>';
}

/** 📅 Daily — word/phrase/idiom/twister of the day + check-in. */
export function renderDaily() {
  var root = $("screen-daily");
  if (!root) return;
  var c = todayContent();
  var checkedIn = !!(S.dailyCheck && S.dailyCheck[todayKey()]);
  root.innerHTML =
    '<div class="dg-wrap">' +
    '<div class="dg-head">' + mascotSVG("wave") +
    '<div><h2>📅 Daily English</h2><p class="fine">A little every day keeps your English growing!</p></div></div>' +
    '<div class="dg-cards">' +
    '<div class="dg-card"><div class="dg-tag">📖 Word of the day</div>' +
      '<div class="dg-big">' + esc(c.word.word) + ' ' + playBtn(c.word.word) + '</div>' +
      '<div class="fine">' + esc(c.word.pos) + ' · ' + esc(c.word.meaning) + '</div>' +
      '<div class="dg-ex">“' + esc(c.word.example) + '”</div></div>' +
    '<div class="dg-card"><div class="dg-tag">💬 Phrase of the day</div>' +
      '<div class="dg-big">' + esc(c.phrase.phrase) + ' ' + playBtn(c.phrase.phrase) + '</div>' +
      '<div class="fine">' + esc(c.phrase.meaning) + '</div>' +
      '<div class="dg-ex">“' + esc(c.phrase.example) + '”</div></div>' +
    '<div class="dg-card"><div class="dg-tag">🌟 Idiom of the day</div>' +
      '<div class="dg-big">' + esc(c.idiom.idiom) + ' ' + playBtn(c.idiom.idiom) + '</div>' +
      '<div class="fine">' + esc(c.idiom.meaning) + '</div>' +
      '<div class="dg-ex">“' + esc(c.idiom.example) + '”</div></div>' +
    '<div class="dg-card"><div class="dg-tag">👅 Tongue twister</div>' +
      '<div class="dg-big dg-tw">' + esc(c.twister) + ' ' + playBtn(c.twister) + ' ' + playBtn(c.twister, true) + '</div>' +
      '<div class="fine">Say it 3 times fast — then try it on the 🗣️ Say It screen!</div></div>' +
    '</div>' +
    '<button id="dgCheckIn" class="btn-primary btn-big" ' + (checkedIn ? "disabled" : "") + '>' +
      (checkedIn ? "✅ Checked in today — great job!" : "✅ I practiced today") + '</button>' +
    '</div>';
  wirePlayButtons(root);
  var btn = $("dgCheckIn");
  if (btn && !checkedIn) btn.addEventListener("click", function () {
    if (doCheckIn()) renderDaily();
  });
}

function wirePlayButtons(root) {
  Array.prototype.forEach.call(root.querySelectorAll("[data-say]"), function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-slow") === "1") speakSlow(b.getAttribute("data-say"));
      else speak(b.getAttribute("data-say"));
    });
  });
}

/** 🗣️ Say It — pronunciation practice with mic scoring + Listen & Repeat. */
export function renderSayIt() {
  var root = $("screen-sayit");
  if (!root) return;
  var targets = sayItTargets(S, todayContent());
  currentSayTarget = targets[0];
  var micOk = !!speechRecCtor();
  var opts = targets.map(function (t, i) {
    return '<option value="' + i + '">' + esc(t.text) + '</option>';
  }).join("");
  var listenRows = PHRASE_OF_DAY.slice(0, 8).map(function (p) {
    return '<div class="lr-row"><span>' + esc(p.phrase) + '</span><span class="lr-btns">' +
      playBtn(p.phrase) + ' ' + playBtn(p.phrase, true) + '</span></div>';
  }).join("");
  root.innerHTML =
    '<div class="dg-wrap">' +
    '<div class="dg-head">' + mascotSVG("happy") +
    '<div><h2>🗣️ Say It</h2><p class="fine">Listen, then say it out loud. Lingoo will score you!</p></div></div>' +
    '<div class="dg-card"><div class="dg-tag">🎯 Pick what to practice</div>' +
      '<select id="siTarget" class="si-select">' + opts + '</select>' +
      '<div id="siTargetText" class="dg-big"></div>' +
      '<div class="si-btns">' +
      '<button id="siListen" class="btn-primary">🔊 Listen</button>' +
      '<button id="siSlow" class="btn-ghost">🐢 Slow</button>' +
      (micOk
        ? '<button id="siMic" class="btn-primary">🎤 Say it</button>'
        : '<p class="fine">🎤 This browser can\'t listen — keep practicing with Listen &amp; Repeat below!</p>') +
      '</div>' +
      '<div id="siHeard" class="fine"></div>' +
      '<div id="siScore" class="si-score"></div>' +
    '</div>' +
    '<div class="dg-card"><div class="dg-tag">👂 Listen &amp; Repeat</div>' +
      '<div class="fine">Tap 🔊 to hear, 🐢 for slow, then repeat out loud.</div>' +
      listenRows + '</div>' +
    '</div>';
  wirePlayButtons(root);

  function showTarget() {
    var t = targets[parseInt($("siTarget").value, 10)] || targets[0];
    currentSayTarget = t;
    $("siTargetText").textContent = "“" + t.text + "”";
    $("siHeard").textContent = "";
    $("siScore").innerHTML = "";
  }
  $("siTarget").addEventListener("change", showTarget);
  showTarget();

  $("siListen").addEventListener("click", function () { speak(currentSayTarget.text); });
  $("siSlow").addEventListener("click", function () { speakSlow(currentSayTarget.text); });

  var micBtn = $("siMic");
  if (micBtn) micBtn.addEventListener("click", function () {
    micBtn.disabled = true;
    micBtn.textContent = "🎤 Listening…";
    startListen(function (heard) {
      micBtn.disabled = false;
      micBtn.textContent = "🎤 Say it";
      $("siHeard").textContent = heard ? "I heard: “" + heard + "”" : "Hmm, I didn't catch that — try again!";
      var score = scorePronunciation(heard, currentSayTarget.text);
      var stars = score >= 80 ? "⭐⭐⭐" : score >= 50 ? "⭐⭐" : "⭐";
      var msg = score >= 80 ? "Excellent! You said it perfectly!"
        : score >= 50 ? "Good try! Listen again and say it once more."
        : "Nice effort! Listen carefully, then try again.";
      $("siScore").innerHTML = '<div class="si-stars">' + stars + '</div>' +
        '<div class="si-msg">' + esc(msg) + ' <span class="fine">(' + score + '/100)</span></div>';
      speak(msg);
      if (score >= 50) { awardXP(5, "Pronunciation practice"); }
    });
  });
}

/** 👨‍👩‍👧 Parents — learner stats, printable report, how-to-help tips. */
export function renderParents() {
  var root = $("screen-parents");
  if (!root) return;
  var learners = listLearners();
  var d = buildReportData(S);
  var tips = helpTips(S.profile.ageGroup).map(function (t) {
    return '<li>' + esc(t) + '</li>';
  }).join("");
  function stat(emoji, label, value) {
    return '<div class="pd-stat"><div class="pd-emoji">' + emoji + '</div>' +
      '<div class="pd-val">' + esc(String(value)) + '</div>' +
      '<div class="pd-label">' + esc(label) + '</div></div>';
  }
  root.innerHTML =
    '<div class="dg-wrap">' +
    '<div class="dg-head">' + mascotSVG("thinking") +
    '<div><h2>👨‍👩‍👧 Parent Dashboard</h2><p class="fine">See how your child is doing — and how to help.</p></div></div>' +
    (learners.length > 1
      ? '<div class="dg-card"><div class="dg-tag">👤 Learner</div><select id="pdLearner" class="si-select">' +
        learners.map(function (l, i) { return '<option value="' + i + '">' + esc(l.name || ("Learner " + (i + 1))) + '</option>'; }).join("") +
        '</select><p class="fine">Stats below are for this device.</p></div>'
      : "") +
    '<div class="pd-grid">' +
      stat("⚡", "Total XP", d.xp) +
      stat("🔥", "Day streak", d.streak) +
      stat("🎯", "SLOs mastered", d.slosMastered) +
      stat("📚", "Words learned", d.wordsLearned) +
      stat("📖", "Stories read", d.storiesRead) +
      stat("🎮", "Game rounds", d.gamesPlayed) +
    '</div>' +
    '<div class="dg-card"><div class="dg-tag">💡 How to help</div><ul class="pd-tips">' + tips + '</ul></div>' +
    '<button id="pdPrint" class="btn-primary btn-big">🖨️ Printable report</button>' +
    '<button id="pdTutors" class="btn-secondary btn-big">🎓 Find a Tutor</button>' +
    '<button id="pdMarks" class="btn-secondary btn-big">📊 Scheme test marks</button>' +
    '<p class="fine">Tip: in the print dialog choose “Save as PDF” to keep a copy.</p>' +
    '</div>';
  $("pdPrint").addEventListener("click", function () {
    if (!printReport()) toast("Printing is not available right now.");
  });
  $("pdMarks").addEventListener("click", function () {
    openMarksStudent(S.profile.name, S.attempts, { dest: "parents" });
  });
  $("pdTutors").addEventListener("click", function () {
    renderTutors({ via: "parents" });
  });
}
