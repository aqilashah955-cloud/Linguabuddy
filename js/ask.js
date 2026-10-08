// LinguaBuddy — AI Teacher "Ask".
//
// A real-teacher Q&A, not a chatbot: answers are structured mini-lessons
// built from the curated content — a warmup question to think about, the
// key rules, worked examples, a memory tip, and a "your turn" task — plus
// a one-tap practice button that starts 5 questions on the topic.
// Hints-first: while an assessment attempt is active, it refuses direct
// answers and gives only hints (checked via assess.js attemptActive()).
//
// ─── LLM PLUG-IN POINT ─────────────────────────────────────────────
// To connect a real AI tutor later: inside askTeacher(), replace the
// call to answerFromKB(question) with an async call to your LLM API
// (e.g. fetch to your endpoint with the question + learner level as
// context). Keep the assessment-lock check BEFORE the LLM call so the
// tutor can never leak answers during a test. See README “LLM plug-in”.
// ────────────────────────────────────────────────────────────────────

import { SLOS, LESSONS, WORDS, sloById, buildItems } from "./engine.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { attemptActive, runAttempt, showResult } from "./assess.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setAskGo(fn) { go = fn; }

const hist = []; // {q, html} — replayed when the screen re-renders

/* Score how well a knowledge entry matches the question tokens. */
function scoreEntry(tokens, text) {
  const low = String(text || "").toLowerCase();
  let s = 0;
  tokens.forEach(function (t) {
    if (t.length > 2 && low.indexOf(t) >= 0) s++;
  });
  return s;
}
function tokensOf(q) {
  return (String(q || "").toLowerCase().match(/[a-z']+/g) || [])
    .filter(function (w) { return w.length > 2 && ["what","does","mean","how","the","and","for","are","with","this","that","you","your","can","please","tell","about","why","when"].indexOf(w) < 0; });
}
function lessonSearchText(les) {
  return (les.warmup ? les.warmup.q + " " + les.warmup.a + " " : "") +
    (les.keyPoints || []).join(" ") + " " + (les.tip || "") + " " + (les.applyPrompt || "");
}

/* Pure: finds the best knowledge-base match for a question.
   Returns {kind, ...} or null. */
export function answerFromKB(question) {
  const tokens = tokensOf(question);
  if (!tokens.length) return null;
  const qlow = String(question).toLowerCase();

  // 1) vocabulary: direct word match
  for (const w of WORDS) {
    if (qlow.indexOf(w.word.toLowerCase()) >= 0 && tokens.indexOf(w.word.toLowerCase()) >= 0) {
      return { kind: "vocab", word: w };
    }
  }

  // 2) SLO lessons: best overlap with title + lesson content
  let best = null, bestScore = 0;
  SLOS.forEach(function (s) {
    const les = LESSONS[s.id];
    if (!les) return;
    const sc = scoreEntry(tokens, s.title + " " + lessonSearchText(les));
    if (sc > bestScore) { bestScore = sc; best = s; }
  });
  if (best && bestScore >= 2) {
    return { kind: "lesson", sloId: best.id, slo: best, les: LESSONS[best.id] };
  }

  // 3) topic keyword fallback (real SLO ids)
  const topics = [
    { k: ["tense", "past", "present", "future"], s: "tenses" },
    { k: ["subject", "verb", "agreement"], s: "sva" },
    { k: ["article"], s: "articles" },
    { k: ["punctuation", "comma", "full stop", "apostrophe", "capital"], s: "punct" },
    { k: ["sentence", "clause", "predicate", "conjunction", "join"], s: "clauses" },
    { k: ["preposition"], s: "prepositions" },
    { k: ["active", "passive", "voice"], s: "voice" },
    { k: ["speech", "direct", "indirect", "reported"], s: "speech" },
    { k: ["synonym", "antonym"], s: "synant" },
    { k: ["prefix", "suffix", "vocabulary in", "word formation"], s: "vocab" },
    { k: ["reading", "comprehension", "passage"], s: "reading" },
    { k: ["paragraph", "essay", "writing"], s: "writing" },
    { k: ["noun", "pronoun"], s: "nouns" },
    { k: ["modal", "can", "could", "should", "must", "might"], s: "modals" },
    { k: ["question", "interrogative", "wh-"], s: "questions" },
    { k: ["exclamation", "exclamatory", "imperative", "command"], s: "sentence-types" },
    { k: ["gerund", "infinitive", "participle"], s: "verbals" }
  ];
  for (const t of topics) {
    if (t.k.some(function (kw) { return qlow.indexOf(kw) >= 0; })) {
      const les = LESSONS[t.s], slo = sloById(t.s);
      if (les && slo) return { kind: "lesson", sloId: t.s, slo: slo, les: les };
    }
  }
  return null;
}

/* Build a real-teacher mini-lesson as HTML (trusted: all content comes
   from LinguaBuddy's own curated lessons and word lists). */
function teacherHTML(kb) {
  if (kb.kind === "vocab") {
    const w = kb.word;
    return '<div class="tch-block">' +
      '<div class="tch-head">📖 <strong>' + esc(w.word) + '</strong> <span class="fine">(' + esc(w.pos) + ')</span></div>' +
      '<p><strong>Meaning:</strong> ' + esc(w.def) + '</p>' +
      '<p><strong>Similar words:</strong> ' + esc(w.syn.join(", ")) + '</p>' +
      '<p><strong>Example:</strong> <em>“' + esc(w.example) + '”</em></p>' +
      '<p class="tch-try">✏️ <strong>Your turn:</strong> Use “' + esc(w.word) + '” in your own sentence — say it aloud, then write it down.</p>' +
      '</div>';
  }
  const slo = kb.slo, les = kb.les, sid = kb.sloId;
  let h = '<div class="tch-block">' +
    '<div class="tch-head">📚 <strong>' + esc(slo.title) + '</strong></div>';
  if (les.warmup) {
    h += '<p><strong>🤔 First, think:</strong> ' + esc(les.warmup.q) + '<br>' +
      '<span class="tch-ans">→ ' + esc(les.warmup.a) + '</span></p>';
  }
  if (les.keyPoints && les.keyPoints.length) {
    h += '<p><strong>📏 The rules:</strong></p><ul class="tch-list">' +
      les.keyPoints.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join("") + '</ul>';
  }
  if (les.examples && les.examples.length) {
    h += '<p><strong>✏️ See it in action:</strong></p><ul class="tch-list">' +
      les.examples.map(function (e) { return '<li><em>“' + esc(e.en) + '”</em> — ' + esc(e.note) + '</li>'; }).join("") + '</ul>';
  }
  if (les.tip) h += '<p>💡 <strong>Remember:</strong> ' + esc(les.tip) + '</p>';
  if (les.applyPrompt) h += '<p class="tch-try">✏️ <strong>Your turn:</strong> ' + esc(les.applyPrompt) + '</p>';
  h += '<div class="row-btns"><button class="btn-primary btn-sm" data-practice="' + esc(sid) + '">📝 Practice this — 5 questions</button> ' +
    '<button class="btn-ghost btn-sm" data-lesson="' + esc(sid) + '">📖 Open full lesson</button></div>';
  h += '</div>';
  return h;
}

/* One-tap practice: 5 questions on the topic, straight from the teacher. */
function practiceTopic(sloId) {
  const slo = sloById(sloId);
  const title = slo ? slo.title : "Practice";
  const items = buildItems({ kind: "slo", ref: sloId, count: 5, seed: "ask-" + Date.now() + "-" + sloId });
  if (!items.length) return;
  runAttempt({
    title: "📝 " + title + " — practice with your teacher",
    items: items, timePerQ: 0, antiCopy: false, hints: true, lockKey: null,
    onDone: function (out) {
      showResult({
        title: title + " — Practice", scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks",
        results: out.results, perSlo: out.perSlo,
        actions: [{ label: "← Back to AI Teacher", primary: true, fn: function () { renderAsk(); } }]
      });
    }
  });
}

function bindAnswerButtons(el) {
  el.querySelectorAll("[data-practice]").forEach(function (b) {
    b.addEventListener("click", function () { practiceTopic(b.getAttribute("data-practice")); });
  });
  el.querySelectorAll("[data-lesson]").forEach(function (b) {
    b.addEventListener("click", function () { if (go) go("lesson", b.getAttribute("data-lesson")); });
  });
}

/* The single entry point for the AI-teacher Q&A. */
export function askTeacher(question) {
  const q = String(question || "").trim();
  if (!q) return { mode: "empty", html: "" };

  // Assessment lock: hints only, never answers, while a test is running.
  if (attemptActive()) {
    const kb = answerFromKB(q);
    let hint = "Re-read the question slowly and underline the key word that tells you what to do.";
    if (kb && kb.kind === "lesson" && kb.les && kb.les.tip) hint = kb.les.tip;
    else if (kb && kb.kind === "vocab") hint = "Think about the word's part of speech first, then the sentence around it.";
    return {
      mode: "hint",
      html: '<div class="tch-block"><p>🔒 <strong>Test mode:</strong> I can\u2019t give direct answers while your assessment is running — that wouldn\u2019t be fair to your learning.</p>' +
        '<p>💡 <strong>Hint:</strong> ' + esc(hint) + '</p>' +
        '<p class="fine">I\u2019ll explain the full topic after you submit.</p></div>'
    };
  }

  const kb = answerFromKB(q);
  if (kb) return { mode: "answer", html: teacherHTML(kb), sloId: kb.sloId || null };
  const list = SLOS.filter(function (s) { return s.id !== "story" && s.id !== "g0"; })
    .slice(0, 6).map(function (s) { return s.title; }).join(", ");
  return {
    mode: "fallback",
    html: '<div class="tch-block"><p>I don\u2019t have a lesson on that yet. 🤔 Try asking about: ' + esc(list) + '…</p>' +
      '<p>Or ask me the meaning of any English word.</p></div>'
  };
}

function addMsg(log, who, html) {
  const d = document.createElement("div");
  d.className = "cv-msg " + who;
  d.innerHTML = html;
  bindAnswerButtons(d);
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

export function renderAsk() {
  const body = $("askBody");
  body.innerHTML =
    '<div id="askLog" class="cv-log"></div>' +
    '<div class="row-flex"><input id="askInput" type="text" placeholder="e.g. What is past tense?" autocomplete="off" />' +
    '<button class="btn-primary" id="askSend">Ask</button></div>' +
    '<p class="fine">Your teacher answers from LinguaBuddy\u2019s own lessons and word lists.</p>';
  const log = $("askLog");
  addMsg(log, "partner", "🤖 <strong>AI Teacher:</strong> Ask me anything about English — grammar, word meanings, or a lesson topic. I\u2019ll explain it like in class: the rules, examples, and a quick practice.");
  // replay conversation history
  hist.forEach(function (h) {
    addMsg(log, "you", "🧑 <strong>You:</strong> " + esc(h.q));
    addMsg(log, "partner", "🤖 <strong>AI Teacher:</strong> " + h.html);
  });
  function send() {
    const inp = $("askInput");
    const q = inp.value.trim();
    if (!q) return;
    inp.value = "";
    addMsg(log, "you", "🧑 <strong>You:</strong> " + esc(q));
    const res = askTeacher(q);
    hist.push({ q: q, html: res.html });
    addMsg(log, "partner", "🤖 <strong>AI Teacher:</strong> " + res.html);
  }
  $("askSend").addEventListener("click", send);
  $("askInput").addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
  show("screen-ask");
}
