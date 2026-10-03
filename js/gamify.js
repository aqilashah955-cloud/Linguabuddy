// LinguaBuddy — gamification (Part 2).
// XP awards + badge definitions + earn toasts. Pure-ish: reads the local
// store S, mutates profile.xp / profile.badges, saves. DOM access is
// guarded so this file also imports cleanly in node tests.

import { S, save } from "./store.js";
import { calculateSLOMastery } from "./engine.js";
import { checkCertificates } from "./certs.js";
import { esc } from "./utils.js";

function $(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }

/* ---------------- XP table ---------------- */
export const XP_TABLE = {
  correctAnswer: 10,     // per fully-correct answer
  partialAnswer: 4,      // per partially-correct answer
  assessmentComplete: 50,
  reassessmentComplete: 40,
  practiceComplete: 15,
  lessonOpened: 20,
  remediationDone: 40,
  storyRead: 30,
  storyQuizComplete: 40,
  wordAdded: 15,
  writingChecked: 25,
  conversationDone: 30,
  streakDay: 25,
  placementDone: 40
};

/* ---------------- toast ---------------- */
let toastTimer = null;
export function toast(msg) {
  const el = $("toast");
  if (!el) return; // node / no DOM
  el.innerHTML = msg;
  el.classList.remove("hidden");
  el.classList.remove("pop");
  void el.offsetWidth; // restart animation
  el.classList.add("pop");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.add("hidden"); }, 2600);
}

/* ---------------- XP ---------------- */
export function awardXP(n, reason) {
  if (!n) return;
  S.profile.xp = (S.profile.xp || 0) + n;
  save();
  if (reason) toast("+" + n + " XP · " + esc(reason));
  return S.profile.xp;
}

export function xpForAttempt(att) {
  // att: {mode, results:[{res:{score}}]} — mirrors the attempt record shape
  let xp = 0;
  (att.results || []).forEach(function (r) {
    xp += r.res.score === 1 ? XP_TABLE.correctAnswer : (r.res.score > 0 ? XP_TABLE.partialAnswer : 0);
  });
  xp += att.mode === "assessment" ? XP_TABLE.assessmentComplete
    : att.mode === "reassessment" ? XP_TABLE.reassessmentComplete
    : XP_TABLE.practiceComplete;
  return xp;
}

/* ---------------- badges ---------------- */
export const BADGES = [
  { id: "first-lesson", emoji: "🏆", name: "First Lesson", desc: "Complete your first worksheet or assessment." },
  { id: "streak-7", emoji: "🔥", name: "7-Day Streak", desc: "Learn 7 days in a row." },
  { id: "reader-5", emoji: "📚", name: "Story Reader", desc: "Finish 5 stories with their quizzes." },
  { id: "words-100", emoji: "🧠", name: "Word Collector", desc: "Save 100 words to your vocabulary." },
  { id: "writing-star", emoji: "✍️", name: "Writing Star", desc: "Get feedback on a piece of writing." },
  { id: "slo-master", emoji: "🎯", name: "SLO Master", desc: "Master any SLO (80%+ across 3+ assessments)." },
  { id: "game-night", emoji: "🎮", name: "Game Night", desc: "Play 3 game rounds in the Arcade." }
];

function badgeEarned(id) {
  const b = S.profile.badges || (S.profile.badges = []);
  return b.indexOf(id) >= 0;
}

export function awardBadge(id) {
  if (badgeEarned(id)) return false;
  const def = BADGES.find(function (x) { return x.id === id; });
  (S.profile.badges || (S.profile.badges = [])).push(id);
  awardXP(50, "Badge earned");
  save();
  if (def) toast(def.emoji + " Badge earned: <strong>" + esc(def.name) + "</strong>");
  return true;
}

// Idempotent: safe to call after every meaningful event.
export function checkBadges() {
  if ((S.attempts || []).length >= 1) awardBadge("first-lesson");
  if ((S.profile.streak || 0) >= 7) awardBadge("streak-7");
  if (Object.keys(S.reading || {}).length >= 5) awardBadge("reader-5");
  if ((S.vocab || []).length >= 100) awardBadge("words-100");
  if ((S.writing || []).length >= 1) awardBadge("writing-star");
  const gamesPlayed = (S.attempts || []).filter(function (a) { return a.kind === "game"; }).length;
  if (gamesPlayed >= 3) awardBadge("game-night");
  const ev = S.masteryEv || {};
  const mastered = Object.keys(ev).some(function (sloId) {
    return calculateSLOMastery(sloId, ev[sloId]).status === "mastered";
  });
  if (mastered) awardBadge("slo-master");
  // Certificates ride along with badges — idempotent, safe to call often.
  checkCertificates().forEach(function (c) {
    toast("🏆 Certificate earned: <strong>" + esc(c.title) + "</strong>");
  });
}

export function badgeList() {
  const have = S.profile.badges || [];
  return BADGES.map(function (b) {
    return { id: b.id, emoji: b.emoji, name: b.name, desc: b.desc, earned: have.indexOf(b.id) >= 0 };
  });
}
