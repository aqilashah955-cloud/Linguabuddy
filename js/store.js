// LinguaBuddy — app state store.
// Local-first: everything persists to localStorage (key english_teacher_v1)
// so the full learning flow works offline. When Firebase is configured and
// a user is signed in, profile/attempts/vocabulary/reading also mirror to
// Firestore (best-effort, never blocking the UI).

import { fb, saveUserDoc, saveSubmission, saveVocabWord, saveReadingProgress } from "./firebase.js";
import { todayKey, uid } from "./utils.js";

const LS_KEY = "english_teacher_v1";

const store = (typeof localStorage !== "undefined") ? localStorage
  : { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };

function blankState() {
  return {
    v: 2,
    profile: {
      name: "", loginId: "", email: "", uid: "", role: "student",
      ageGroup: "", level: "", goals: [], onboarded: false,
      streak: 0, lastActive: "", xp: 0, badges: [], lessonXp: {},
      trialStart: 0, subUntil: 0, subPlan: ""
    },
    attempts: [],   // {id, lockKey, student, kind, ref, title, mode, score, total, pct, perSlo, tabs, secs, date, usedKeys[], answers[]}
    locks: {},
    masteryEv: {},  // sloId -> [{pct, n, ts}]
    sloLevel: {},   // sloId -> 1..5
    vocab: [],      // {word, definition, pos, synonyms[], antonyms[], example, urdu, correct, total, addedAt}
    reading: {},    // storyId -> {done, quizPct, date}
    writing: [],    // {id, promptId, title, words, issues, date}
    mywork: [],     // {id, title, type, photoDataUrl, thumbDataUrl, photoUrl, text, feedback[], createdAt}
    teacher: { classes: [], assignments: [] }, // offline-mode classes/assignments
    placement: null // {pct, level, date}
  };
}

function loadState() {
  try {
    const raw = store.getItem(LS_KEY);
    if (!raw) return blankState();
    const s = JSON.parse(raw);
    const b = blankState();
    return Object.assign(b, s, { profile: Object.assign(b.profile, s.profile || {}) });
  } catch (e) { return blankState(); }
}

export const S = loadState();

export function save() {
  try { store.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {}
  // Firestore mirror (fire-and-forget)
  const f = fb();
  if (f.ready && f.user && S.profile.uid) {
    saveUserDoc(S.profile.uid, {
      name: S.profile.name, level: S.profile.level, goals: S.profile.goals,
      streak: S.profile.streak, xp: S.profile.xp,
      trialStart: S.profile.trialStart, subUntil: S.profile.subUntil, subPlan: S.profile.subPlan,
      masteryEv: S.masteryEv, sloLevel: S.sloLevel, reading: S.reading
    });
  }
}

export function touchStreak() {
  const t = todayKey();
  const p = S.profile;
  if (p.lastActive === t) return p.streak;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yKey = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
  p.streak = (p.lastActive === yKey) ? (p.streak || 0) + 1 : 1;
  p.lastActive = t;
  save();
  return p.streak;
}

export function recordAttempt(att) {
  att.id = att.id || uid("a");
  att.date = att.date || Date.now();
  S.attempts.push(att);
  if (att.lockKey) S.locks[att.lockKey] = att.id;
  // mastery evidence per SLO — only from real assessments (never practice
  // with hints on, never a single question)
  if (att.mode !== "practice") {
  Object.keys(att.perSlo || {}).forEach(function (sloId) {
    if (sloId === "story") return;
    const p = att.perSlo[sloId];
    (S.masteryEv[sloId] = S.masteryEv[sloId] || []).push({
      pct: Math.round(p.score / p.total * 100), n: p.total, ts: att.date
    });
  });
  }
  save();
  const f = fb();
  if (f.ready && f.user && S.profile.uid) saveSubmission(S.profile.uid, att);
  return att;
}

export function addVocabWord(w) {
  const ex = S.vocab.find(function (x) { return x.word.toLowerCase() === w.word.toLowerCase(); });
  if (ex) return ex;
  w.correct = 0; w.total = 0; w.addedAt = Date.now();
  S.vocab.push(w);
  save();
  const f = fb();
  if (f.ready && f.user && S.profile.uid) saveVocabWord(S.profile.uid, w);
  return w;
}

export function markReading(storyId, quizPct) {
  S.reading[storyId] = { done: true, quizPct: quizPct, date: Date.now() };
  save();
  const f = fb();
  if (f.ready && f.user && S.profile.uid) saveReadingProgress(S.profile.uid, storyId, S.reading[storyId]);
}

export function isLocked(lockKey) { return !!(lockKey && S.locks[lockKey]); }

export function resetLocks() { S.locks = {}; save(); }

export function wipeAll(keepProfile) {
  const keep = keepProfile ? { profile: S.profile } : null;
  const b = blankState();
  Object.keys(S).forEach(function (k) { delete S[k]; });
  Object.assign(S, b);
  if (keep) S.profile = keep.profile;
  save();
}
