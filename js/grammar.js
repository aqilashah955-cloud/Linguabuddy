// LinguaBuddy — Grammar Lab (Part 2).
// Topic index built from the grammar SLO banks. Each topic opens the
// standard learning cycle — Explain → Example → Guided Practice →
// Independent Practice → Assessment → Remediation — via learn.js,
// so the Grammar Lab reuses engine.js and assess.js instead of
// duplicating the flow.

import { S, save } from "./store.js";
import { SLOS, LESSONS, calculateSLOMastery } from "./engine.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { awardXP, XP_TABLE } from "./gamify.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGrammarGo(fn) { go = fn; }

// the 8 grammar SLOs (excludes vocabulary / reading / writing SLOs)
const GRAMMAR_IDS = ["tenses", "sva", "voice", "speech", "articles", "prepositions", "punct", "clauses"];

export function renderGrammar() {
  const topics = GRAMMAR_IDS.map(function (id) { return SLOS.find(function (s) { return s.id === id; }); })
    .filter(Boolean);
  $("grammarBody").innerHTML = '<div class="grammar-grid">' + topics.map(function (t, i) {
    const m = calculateSLOMastery(t.id, S.masteryEv[t.id]);
    const dot = m.count === 0 ? "⚪" : m.status === "mastered" ? "🟢" : m.status === "developing" ? "🟡" : "🔴";
    const les = LESSONS[t.id] || {};
    return '<button class="grammar-card" data-slo="' + t.id + '">' +
      '<div class="g-num">' + (i + 1) + '</div>' +
      '<h3>' + dot + " " + esc(t.title) + "</h3>" +
      '<p class="fine">' + esc(les.objective || "") + "</p>" +
      '<span class="g-link">Open topic →</span></button>';
  }).join("") + "</div>";
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
