// LinguaBuddy — Grammar Lab (Part 2).
// Topic index built from the grammar SLO banks, grouped by level.
// Each topic opens the standard learning cycle — Explain → Example →
// Guided Practice → Independent Practice → Assessment → Remediation —
// via learn.js, so the Grammar Lab reuses engine.js and assess.js
// instead of duplicating the flow.

import { S, save } from "./store.js";
import { SLOS, LESSONS, calculateSLOMastery } from "./engine.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { awardXP, XP_TABLE } from "./gamify.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGrammarGo(fn) { go = fn; }

// grammar SLOs grouped by level (ids missing from SLOS are skipped)
const GRAMMAR_LEVELS = [
  { id: "basic", title: "Basic", ids: ["tenses", "sva", "articles", "prepositions", "punct", "pronouns", "adjectives", "adverbs"] },
  { id: "intermediate", title: "Intermediate", ids: ["voice", "speech", "clauses", "sentence-patterns"] },
  { id: "advanced", title: "Advanced", ids: ["conditionals", "modal-perfects", "subjunctive", "inversion", "cleft-sentences", "participles", "determiners"] }
];

let levelFilter = "all";

function topicById(id) {
  return SLOS.find(function (s) { return s.id === id; }) || null;
}

export function renderGrammar() {
  const levels = GRAMMAR_LEVELS.filter(function (lv) {
    return levelFilter === "all" || lv.id === levelFilter;
  });
  let html = '<div class="g-filter" style="display:flex;gap:8px;margin:0 0 16px;flex-wrap:wrap;">' + GRAMMAR_LEVELS.map(function (lv) {
    return '<button class="g-pill' + (levelFilter === lv.id ? " on" : "") + '" data-level="' + lv.id + '" style="padding:6px 14px;border-radius:20px;border:2px solid var(--border);background:' + (levelFilter === lv.id ? "var(--marigold)" : "#fff") + ";cursor:pointer;font-weight:700;\">" + esc(lv.title) + "</button>";
  }).join("") +
    '<button class="g-pill' + (levelFilter === "all" ? " on" : "") + '" data-level="all" style="padding:6px 14px;border-radius:20px;border:2px solid var(--border);background:' + (levelFilter === "all" ? "var(--marigold)" : "#fff") + ';cursor:pointer;font-weight:700;">All</button></div>';
  let n = 0;
  levels.forEach(function (lv) {
    const topics = lv.ids.map(topicById).filter(Boolean);
    if (!topics.length) return;
    html += '<h3 class="g-level-head" style="margin:18px 0 10px;font-size:1.15rem;">' + esc(lv.title) + "</h3>" + '<div class="grammar-grid">' +
      topics.map(function (t) {
        n++;
        const m = calculateSLOMastery(t.id, S.masteryEv[t.id]);
        const dot = m.count === 0 ? "⚪" : m.status === "mastered" ? "🟢" : m.status === "developing" ? "🟡" : "🔴";
        const les = LESSONS[t.id] || {};
        return '<button class="grammar-card" data-slo="' + t.id + '">' +
          '<div class="g-num">' + n + "</div>" +
          '<h3>' + dot + " " + esc(t.title) + "</h3>" +
          '<p class="fine">' + esc(les.objective || "") + "</p>" +
          '<span class="g-link">Open topic →</span></button>';
      }).join("") + "</div>";
  });
  $("grammarBody").innerHTML = html;
  $("grammarBody").querySelectorAll("[data-level]").forEach(function (b) {
    b.addEventListener("click", function () {
      levelFilter = b.getAttribute("data-level");
      renderGrammar();
    });
  });
  $("grammarBody").querySelectorAll("[data-slo]").forEach(function (b) {
    b.addEventListener("click", function () {
      const sid = b.getAttribute("data-slo");
      // small XP for starting a grammar topic (once per topic per day)
      const today = new Date().toISOString().slice(0, 10);
      const lx = S.profile.lessonXp || (S.profile.lessonXp = {});
      if (lx[sid] !== today) { lx[sid] = today; awardXP(XP_TABLE.lessonOpened, "grammar topic opened"); save(); }
      if (go) go("lesson", sid);
    });
  });
  show("screen-grammar");
}
