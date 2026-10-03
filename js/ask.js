// LinguaBuddy — AI Teacher "Ask" (Part 2).
//
// askTeacher(question) answers from the curated knowledge base:
// SLO lesson explanations, vocabulary data, and grammar rules in data/.
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

import { SLOS, LESSONS, WORDS, sloById } from "./engine.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { attemptActive } from "./assess.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setAskGo(fn) { go = fn; }

const hist = [];

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

/* Pure: finds the best knowledge-base answer for a question.
   Returns {kind, text} or null. */
export function answerFromKB(question) {
  const tokens = tokensOf(question);
  if (!tokens.length) return null;

  // 1) vocabulary: direct word match
  const qlow = String(question).toLowerCase();
  for (const w of WORDS) {
    if (qlow.indexOf(w.word.toLowerCase()) >= 0 && tokens.indexOf(w.word.toLowerCase()) >= 0) {
      return {
        kind: "vocab",
        text: "📖 “" + w.word + "” (" + w.pos + ") — " + w.def +
          " Synonyms: " + w.syn.join(", ") + ". Example: “" + w.example + "”"
      };
    }
  }

  // 2) SLO lessons: best overlap with title + explanation
  let best = null, bestScore = 0;
  SLOS.forEach(function (s) {
    const les = LESSONS[s.id];
    if (!les) return;
    const sc = scoreEntry(tokens, s.title + " " + les.explain + " " + les.tip + " " + (les.objective || ""));
    if (sc > bestScore) { bestScore = sc; best = s; }
  });
  if (best && bestScore >= 2) {
    const les = LESSONS[best.id];
    return {
      kind: "lesson", sloId: best.id,
      text: "📚 " + best.title + " — " + les.explain +
        (les.tip ? " Remember: " + les.tip : "") +
        ' Open the Grammar Lab → “' + best.title + "” to learn and practice this."
    };
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
    { k: ["paragraph", "essay", "writing"], s: "writing" }
  ];
  for (const t of topics) {
    if (t.k.some(function (kw) { return qlow.indexOf(kw) >= 0; })) {
      const les = LESSONS[t.s], slo = sloById(t.s);
      return { kind: "lesson", sloId: t.s, text: "📚 " + slo.title + " — " + les.explain + " Remember: " + les.tip };
    }
  }
  return null;
}

/* The single entry point for the AI-teacher Q&A. */
export function askTeacher(question) {
  const q = String(question || "").trim();
  if (!q) return { mode: "empty", text: "" };

  // Assessment lock: hints only, never answers, while a test is running.
  if (attemptActive()) {
    const kb = answerFromKB(q);
    const hint = (kb && kb.kind === "lesson" && LESSONS[kb.sloId])
      ? LESSONS[kb.sloId].tip
      : "Re-read the question slowly and underline the key word that tells you what to do.";
    return {
      mode: "hint",
      text: "🔒 I'm in test mode right now — I can't give direct answers while your assessment is running; that wouldn't be fair to your learning. 💡 Hint: " + hint +
        " I'll explain the full topic after you submit."
    };
  }

  const kb = answerFromKB(q);
  if (kb) return { mode: "answer", text: kb.text };
  const list = SLOS.filter(function (s) { return s.id !== "story" && s.id !== "g0"; })
    .slice(0, 6).map(function (s) { return s.title; }).join(", ");
  return {
    mode: "fallback",
    text: "I don't have a lesson on that yet. Try asking about: " + list + "… or ask me the meaning of any English word."
  };
}

export function renderAsk() {
  const body = $("askBody");
  body.innerHTML =
    '<div id="askLog" class="cv-log">' +
    '<div class="cv-msg partner"><strong>🤖 AI Teacher:</strong> Ask me anything about English — grammar, word meanings, or a lesson topic.</div></div>' +
    '<div class="row-flex"><input id="askInput" type="text" placeholder="e.g. What is past tense?" autocomplete="off" />' +
    '<button class="btn-primary" id="askSend">Ask</button></div>' +
    '<p class="fine">Answers come from LinguaBuddy’s own lessons and word lists.</p>';
  function send() {
    const inp = $("askInput");
    const q = inp.value.trim();
    if (!q) return;
    inp.value = "";
    const log = $("askLog");
    const u = document.createElement("div");
    u.className = "cv-msg you";
    u.innerHTML = "<strong>🧑 You:</strong> " + esc(q);
    log.appendChild(u);
    const res = askTeacher(q);
    hist.push({ q: q, a: res.text });
    const a = document.createElement("div");
    a.className = "cv-msg partner";
    a.innerHTML = "<strong>🤖 AI Teacher:</strong> " + esc(res.text);
    log.appendChild(a);
    log.scrollTop = log.scrollHeight;
  }
  $("askSend").addEventListener("click", send);
  $("askInput").addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
  show("screen-ask");
}
