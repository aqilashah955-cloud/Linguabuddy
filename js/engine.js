// LinguaBuddy — learning engine (pure, DOM-free, testable in node).
// Item building, grading, explanations, SLO mastery, remediation,
// reassessment, adaptive difficulty, placement scoring, recommendations.

import { SLOS } from "../data/slos.js";
import { STORIES } from "../data/stories.js";
import { LESSONS } from "../data/lessons.js";
import { STORYMETA } from "../data/storymeta.js";
import { WORDS } from "../data/words.js";
import { shuffle, sample, norm, mulberry32, hashStr, clamp } from "./utils.js";

export function sloById(id) { return SLOS.find(function (s) { return s.id === id; }); }
export function storyById(id) { return STORIES.find(function (s) { return s.id === id; }); }
export function lessonFor(sloId) { return LESSONS[sloId] || null; }
export function storyMeta(id) { return STORYMETA[id] || null; }

/* ---------------- item building ----------------
   Bank identity for a question is "sloId:bankIndex" — stable across
   attempts, so remediation can exclude already-seen questions. */
function makeItem(p, idx, rand) {
  const q = p.q;
  const item = {
    uid: "q" + idx + "_" + Math.floor((rand || Math.random)() * 1000000),
    sloId: p.slo ? p.slo.id : "story",
    sloTitle: p.slo ? p.slo.title : (p.story ? p.story.title : ""),
    type: q.t, q: q.q,
    bankKey: p.slo ? (p.slo.id + ":" + p.bankIndex) : ("story:" + (p.story ? p.story.id : "?") + ":" + p.bankIndex)
  };
  if (q.hint) item.hint = q.hint;
  if (q.t === "mcq" || q.t === "passage") {
    if (q.t === "passage") item.passage = q.passage;
    const order = shuffle(q.o.map(function (text, i) { return { text: text, correct: i === q.a }; }), rand);
    item.options = order.map(function (o) { return o.text; });
    item.answer = order.findIndex(function (o) { return o.correct; });
  } else if (q.t === "fib") {
    item.accepted = q.a.slice();
  } else if (q.t === "tf") {
    item.answer = q.a;
  } else if (q.t === "reorder") {
    item.words = shuffle(q.w.slice(), rand);
    item.answer = q.a;
    item.trayArr = [];
  } else if (q.t === "match") {
    item.lefts = q.pairs.map(function (pr) { return pr[0]; });
    item.rights = shuffle(q.pairs.map(function (pr) { return pr[1]; }), rand);
    item.answer = q.pairs.map(function (pr) { return pr[1]; });
  } else if (q.t === "short") {
    item.keys = q.keys.slice();
    item.model = q.model;
  }
  return item;
}

// spec: {kind, ref, count, seed, exclude:Set(bankKey), refs:[{sloId,bankIndex}], level}
export function buildItems(spec) {
  const rand = spec.seed ? mulberry32(hashStr(spec.seed)) : null;
  let pool = [];
  const excluded = spec.exclude || new Set();
  if (spec.kind === "refs") {
    (spec.refs || []).forEach(function (r) {
      const slo = sloById(r.sloId);
      if (!slo || !slo.questions[r.bankIndex]) return;
      const key = r.sloId + ":" + r.bankIndex;
      if (excluded.has(key)) return;
      pool.push({ slo: slo, q: slo.questions[r.bankIndex], bankIndex: r.bankIndex });
    });
  } else if (spec.kind === "slo") {
    const slo = sloById(spec.ref);
    if (!slo) return [];
    pool = slo.questions.map(function (q, bi) { return { slo: slo, q: q, bankIndex: bi }; });
  } else if (spec.kind === "mixed") {
    let slos = SLOS;
    if (spec.sloIds && spec.sloIds.length) {
      slos = SLOS.filter(function (s) { return spec.sloIds.indexOf(s.id) >= 0; });
      if (!slos.length) return [];
    }
    const order = shuffle(slos.slice(), rand);
    const seen = {};
    let i = 0, guard = 0;
    while (pool.length < spec.count && guard < 2000) {
      guard++;
      const slo = order[i % order.length]; i++;
      const qi = Math.floor((rand || Math.random)() * slo.questions.length);
      const key = slo.id + ":" + qi;
      if (seen[key] || excluded.has(key)) continue;
      seen[key] = 1;
      pool.push({ slo: slo, q: slo.questions[qi], bankIndex: qi });
    }
  } else if (spec.kind === "story") {
    const st = storyById(spec.ref);
    if (!st) return [];
    pool = st.quiz.map(function (q, bi) {
      return { slo: null, story: st, q: { t: "mcq", q: q.q, o: q.o, a: q.a }, bankIndex: bi };
    });
  }
  pool = pool.filter(function (p) {
    const key = p.slo ? (p.slo.id + ":" + p.bankIndex) : "story";
    return !excluded.has(key);
  });
  let list = shuffle(pool, rand);
  if (spec.kind === "slo" || spec.kind === "refs") list = list.slice(0, spec.count);
  return list.map(function (p, idx) { return makeItem(p, idx, rand); });
}

/* ---------------- grading (pure) ---------------- */
export function gradeItem(item, given) {
  let score = 0, givenText = "", correctText = "", extra = null;
  if (item.type === "mcq" || item.type === "passage") {
    const ok = given === item.answer;
    score = ok ? 1 : 0;
    givenText = given == null ? "(no answer)" : item.options[given];
    correctText = item.options[item.answer];
  } else if (item.type === "fib") {
    const g = norm(given);
    const ok = g !== "" && item.accepted.some(function (a) { return norm(a) === g; });
    score = ok ? 1 : 0;
    givenText = given === "" ? "(no answer)" : given;
    correctText = item.accepted[0];
  } else if (item.type === "tf") {
    const ok = given === item.answer;
    score = ok ? 1 : 0;
    givenText = given == null ? "(no answer)" : (given ? "True" : "False");
    correctText = item.answer ? "True" : "False";
  } else if (item.type === "reorder") {
    const g = String(given || "").replace(/\s+([?.!])/g, "$1");
    const ok = norm(g) === norm(item.answer);
    score = ok ? 1 : 0;
    givenText = g === "" ? "(no answer)" : g;
    correctText = item.answer;
  } else if (item.type === "match") {
    let c = 0;
    item.lefts.forEach(function (l, i) { if (given && given[i] === item.answer[i]) c++; });
    const frac = item.lefts.length ? c / item.lefts.length : 0;
    score = frac === 1 ? 1 : (frac >= 0.5 ? 0.5 : 0);
    givenText = c + " of " + item.lefts.length + " pairs matched";
    correctText = item.lefts.map(function (l, i) { return l + " → " + item.answer[i]; }).join("; ");
  } else if (item.type === "short") {
    const g = " " + norm(given) + " ";
    let hit = 0;
    item.keys.forEach(function (k) { if (g.indexOf(norm(k)) >= 0) hit++; });
    const frac = item.keys.length ? hit / item.keys.length : 0;
    score = frac === 1 ? 1 : (frac >= 0.5 ? 0.5 : 0);
    givenText = given === "" ? "(no answer)" : given;
    correctText = "Model answer shown below";
    extra = { model: item.model, keysHit: hit, keysTotal: item.keys.length };
  }
  return { score: score, given: givenText, correct: correctText, extra: extra };
}

/* ---------------- AI-style explanations ----------------
   Never just "wrong": every miss gets the correct answer plus a
   targeted teaching tip for that SLO. */
export function explainItem(item, res) {
  const les = item.sloId && LESSONS[item.sloId] ? LESSONS[item.sloId] : null;
  const tip = les ? les.tip : "";
  if (res.score === 1) {
    return item.type === "short"
      ? "Correct — you included all the key ideas."
      : "Correct.";
  }
  const partial = res.score > 0 ? "Partially correct. " : "Not correct. ";
  let body = "";
  if (item.type === "mcq" || item.type === "passage") {
    body = "The correct answer is \"" + res.correct + "\".";
  } else if (item.type === "fib") {
    body = "The blank needs \"" + res.correct + "\".";
  } else if (item.type === "tf") {
    body = "The correct answer is " + res.correct + ".";
  } else if (item.type === "reorder") {
    body = "The correct order is: \"" + res.correct + "\".";
  } else if (item.type === "match") {
    body = "Correct pairs: " + res.correct + ".";
  } else if (item.type === "short") {
    body = "You matched " + res.extra.keysHit + " of " + res.extra.keysTotal + " key ideas. Compare with the model answer below.";
  }
  return partial + body + (tip ? " Remember: " + tip : "");
}

/* ---------------- SLO mastery ----------------
   Mastered / Developing / Needs Practice from MULTIPLE evidence
   points. Never mastered from a single question or a single attempt. */
export function calculateSLOMastery(sloId, evidence) {
  const ev = (evidence || []).slice(-5);
  if (!ev.length) return { sloId: sloId, status: "new", avg: 0, count: 0 };
  let wSum = 0, tot = 0;
  ev.forEach(function (e, i) {
    const w = i + 1; // recent evidence counts more
    wSum += e.pct * w; tot += w;
  });
  const avg = Math.round(wSum / tot);
  const count = ev.length;
  let status;
  if (count >= 3 && avg >= 80) status = "mastered";
  else if (avg >= 50) status = "developing";
  else status = "needs";
  return { sloId: sloId, status: status, avg: avg, count: count };
}

export function masteryLabel(status) {
  return status === "mastered" ? "Mastered"
    : status === "developing" ? "Developing"
    : status === "needs" ? "Needs Practice" : "Not started";
}

/* ---------------- adaptive difficulty (5 levels) ----------------
   L1 choose the correct answer · L2 correct the sentence ·
   L3 complete the paragraph · L4 write sentences · L5 creative application */
export const TYPE_LEVEL = { mcq: 1, tf: 1, fib: 2, match: 2, reorder: 3, passage: 3, short: 4 };
export function levelForType(t) { return TYPE_LEVEL[t] || 2; }

export function adjustLevel(current, pct) {
  if (pct >= 80) return clamp(current + 1, 1, 5);
  if (pct < 50) return clamp(current - 1, 1, 5);
  return clamp(current, 1, 5);
}

// Prefer questions at/below the student's level; fill up with higher ones if needed.
export function pickForLevel(slo, level, count, exclude) {
  const ex = exclude || new Set();
  const avail = slo.questions
    .map(function (q, bi) { return { q: q, bankIndex: bi, lv: levelForType(q.t) }; })
    .filter(function (x) { return !ex.has(slo.id + ":" + x.bankIndex); });
  const atOrBelow = avail.filter(function (x) { return x.lv <= level; });
  const above = avail.filter(function (x) { return x.lv > level; });
  const picked = atOrBelow.slice();
  let i = 0;
  while (picked.length < count && i < above.length) { picked.push(above[i]); i++; }
  return sample(picked, count).map(function (x) { return { sloId: slo.id, bankIndex: x.bankIndex }; });
}

/* ---------------- remediation ----------------
   Never repeats the original worksheet: every practice question is
   drawn from bank items the student has NOT seen in this cycle.
   If the SLO's own bank is exhausted, we top up with fresh questions
   from the same skill group so remediation always has 5-8 questions. */
const SLO_SKILL = {
  tenses: "grammar", sva: "grammar", voice: "grammar", speech: "grammar",
  articles: "grammar", prepositions: "grammar", punct: "grammar", clauses: "grammar",
  pronouns: "grammar", adverbs: "grammar", adjectives: "grammar",
  synant: "vocab", vocab: "vocab", reading: "reading", writing: "writing"
};

function freshRefsFor(sloId, used) {
  const s = sloById(sloId);
  if (!s) return [];
  return s.questions
    .map(function (q, bi) { return { q: q, bankIndex: bi, sloId: sloId }; })
    .filter(function (x) { return !used.has(sloId + ":" + x.bankIndex); });
}

export function generateRemediation(sloId, gradedResults, usedBankKeys) {
  const slo = sloById(sloId);
  const les = lessonFor(sloId);
  const used = new Set(usedBankKeys || []);
  // Subskill targeting: question types the student missed get priority.
  const missedTypes = {};
  (gradedResults || []).forEach(function (r) {
    if (r.res.score < 1 && r.item.sloId === sloId) {
      missedTypes[r.item.type] = (missedTypes[r.item.type] || 0) + 1;
    }
  });
  const candidates = freshRefsFor(sloId, used);
  candidates.sort(function (a, b) {
    return (missedTypes[b.q.t] || 0) - (missedTypes[a.q.t] || 0);
  });
  const refs = candidates.slice(0, 8).map(function (x) { return { sloId: x.sloId, bankIndex: x.bankIndex }; });
  // Top up from the same skill group when the bank is exhausted.
  if (refs.length < 5) {
    const group = SLO_SKILL[sloId];
    SLOS.forEach(function (s) {
      if (refs.length >= 8 || s.id === sloId || SLO_SKILL[s.id] !== group) return;
      freshRefsFor(s.id, used).slice(0, 8 - refs.length).forEach(function (x) {
        refs.push({ sloId: x.sloId, bankIndex: x.bankIndex });
      });
    });
  }
  return {
    sloId: sloId,
    miniLesson: les ? {
      title: "Quick review: " + slo.title,
      points: les.keyPoints,
      examples: les.examples.slice(0, 2)
    } : null,
    missedTypes: Object.keys(missedTypes),
    practiceRefs: refs, // fresh questions, never from the original worksheet
    application: les ? les.applyPrompt : ""
  };
}

/* ---------------- reassessment ----------------
   Fresh variants on the same SLO, excluding everything seen so far.
   Topped up from the same skill group if the bank runs dry. */
export function generateReassessment(sloId, usedBankKeys, count, level) {
  const slo = sloById(sloId);
  if (!slo) return [];
  const want = count || 8;
  const used = new Set(usedBankKeys || []);
  let refs = pickForLevel(slo, level || 3, want, used);
  if (refs.length < want) {
    const group = SLO_SKILL[sloId];
    SLOS.forEach(function (s) {
      if (refs.length >= want || s.id === sloId || SLO_SKILL[s.id] !== group) return;
      refs = refs.concat(pickForLevel(s, level || 3, want - refs.length, used));
    });
  }
  return refs;
}

/* ---------------- placement test ---------------- */
const PLACE_SLOS = ["tenses", "sva", "articles", "prepositions", "synant", "vocab", "reading", "clauses"];
export function buildPlacementItems(seed) {
  const rand = mulberry32(hashStr(seed || "placement"));
  const pool = [];
  PLACE_SLOS.forEach(function (id) {
    const slo = sloById(id);
    const pick = sample(slo.questions.map(function (q, bi) { return { slo: slo, q: q, bankIndex: bi }; }), 2, rand);
    pick.forEach(function (p) { pool.push(p); });
  });
  // 16 picked; trim to 15
  const list = shuffle(pool, rand).slice(0, 15);
  return list.map(function (p, idx) { return makeItem(p, idx, rand); });
}

export function placementLevel(pct) {
  if (pct >= 85) return "Intermediate";
  if (pct >= 65) return "Pre-Intermediate";
  if (pct >= 45) return "Elementary";
  return "Beginner";
}

/* ---------------- reading recommendations ---------------- */
export function recommendReading(doneIds, lastSloId) {
  const done = new Set(doneIds || []);
  const fresh = STORIES.filter(function (s) { return !done.has(s.id); });
  if (!fresh.length) return STORIES[0];
  if (lastSloId) {
    const match = fresh.find(function (s) {
      const m = STORYMETA[s.id];
      return m && m.sloIds.indexOf(lastSloId) >= 0;
    });
    if (match) return match;
  }
  const easy = fresh.find(function (s) { return s.difficulty === "Easy"; });
  return easy || fresh[0];
}

/* ---------------- weakest SLO ---------------- */
export function weakestSlo(masteryMap) {
  // masteryMap: {sloId: {status, avg, count}}
  let worst = null;
  SLOS.forEach(function (s) {
    const m = masteryMap[s.id];
    const score = m ? (m.status === "mastered" ? 101 : m.avg) : -1;
    if (!worst || score < worst.score) worst = { sloId: s.id, title: s.title, score: score, mastery: m || null };
  });
  return worst;
}

/* ---------------- teacher analytics (pure) ----------------
   Submissions carry: {studentId, perSlo:{sloId:{score,total,title}},
   answers:[{type,sloId,score}], date}. These helpers turn them into
   class analytics and student progress reports. */

/* Group submission per-SLO scores into mastery evidence per student. */
export function evidenceFromSubmissions(submissions) {
  const out = {}; // studentId -> sloId -> [{pct,n,ts}]
  (submissions || []).forEach(function (sub) {
    if (!sub || !sub.studentId) return;
    const per = sub.perSlo || {};
    Object.keys(per).forEach(function (sloId) {
      if (sloId === "story") return;
      const p = per[sloId];
      if (!p || !p.total) return;
      const st = (out[sub.studentId] = out[sub.studentId] || {});
      (st[sloId] = st[sloId] || []).push({
        pct: Math.round(p.score / p.total * 100), n: p.total, ts: sub.date || 0
      });
    });
  });
  return out;
}

/* Per-SLO counts of Mastered / Developing / Needs Practice across a class. */
export function computeClassAnalytics(studentIds, submissions) {
  const ev = evidenceFromSubmissions(submissions);
  const ids = studentIds || [];
  return SLOS.map(function (s) {
    let mastered = 0, developing = 0, needs = 0, sum = 0, n = 0;
    const byStatus = { mastered: [], developing: [], needs: [] };
    ids.forEach(function (sid) {
      const m = calculateSLOMastery(s.id, (ev[sid] || {})[s.id]);
      if (!m.count) return;
      n++; sum += m.avg;
      byStatus[m.status].push({ studentId: sid, avg: m.avg, count: m.count });
      if (m.status === "mastered") mastered++;
      else if (m.status === "developing") developing++;
      else needs++;
    });
    return {
      sloId: s.id, title: s.title,
      mastered: mastered, developing: developing, needs: needs,
      notStarted: ids.length - n,
      avg: n ? Math.round(sum / n) : null, students: n,
      byStatus: byStatus
    };
  });
}

const TYPE_LABEL = {
  mcq: "multiple choice", passage: "reading questions", fib: "fill in the blanks",
  tf: "true/false", reorder: "sentence ordering", match: "matching", short: "written answers"
};
export function typeLabel(t) { return TYPE_LABEL[t] || t; }

/* Most-missed question types for one SLO (from answer summaries). */
export function commonMissedTypes(submissions, sloId) {
  const miss = {}, tot = {};
  (submissions || []).forEach(function (sub) {
    (sub.answers || []).forEach(function (a) {
      if (a.sloId !== sloId) return;
      tot[a.type] = (tot[a.type] || 0) + 1;
      if (a.score < 1) miss[a.type] = (miss[a.type] || 0) + 1;
    });
  });
  return Object.keys(miss).map(function (t) {
    return { type: t, label: typeLabel(t), misses: miss[t], total: tot[t] || 0 };
  }).sort(function (a, b) { return b.misses - a.misses; });
}

/* Suggested teaching intervention for a weak SLO. */
export function suggestIntervention(sloId, missedTypes) {
  const slo = sloById(sloId);
  const les = lessonFor(sloId);
  const types = (missedTypes || []).slice(0, 2).map(function (m) { return m.label; }).join(" and ");
  let s = "Re-teach “" + (slo ? slo.title : sloId) + "” with 2–3 fresh examples, then assign a short remediation.";
  if (types) s += " Most mistakes are in " + types + ".";
  if (les && les.tip) s += " Key reminder for students: " + les.tip;
  return s;
}

/* ---------------- student progress report (pure) ---------------- */
export function buildProgressReport(ctx) {
  // ctx: {mastery:{sloId:{status,avg,count}}, attempts, vocabCount,
  //       storiesDone, writingDone, level}
  const m = ctx.mastery || {};
  const rows = SLOS.map(function (s) {
    const x = m[s.id] || { status: "new", avg: 0, count: 0 };
    return { sloId: s.id, title: s.title, status: x.status, avg: x.avg, count: x.count };
  });
  const withEv = rows.filter(function (r) { return r.count > 0; });
  const byAvgDesc = withEv.slice().sort(function (a, b) { return b.avg - a.avg; });
  const byAvgAsc = withEv.slice().sort(function (a, b) { return a.avg - b.avg; });
  const strengths = byAvgDesc.filter(function (r) { return r.status === "mastered"; }).slice(0, 3)
    .map(function (r) { return r.title; });
  const weaknesses = byAvgAsc.filter(function (r) { return r.status === "needs"; }).slice(0, 3)
    .map(function (r) { return r.title; });
  if (!strengths.length && byAvgDesc.length) strengths.push(byAvgDesc[0].title + " (" + byAvgDesc[0].avg + "%)");
  if (!weaknesses.length && byAvgAsc.length) weaknesses.push(byAvgAsc[0].title + " (" + byAvgAsc[0].avg + "%)");

  const recs = [];
  const weak = weakestSlo(m);
  if (weak && weak.sloId) {
    recs.push({ icon: "🎯", text: "Continue: " + weak.title, dest: "lesson", arg: weak.sloId });
  }
  const unread = STORIES.filter(function (s) { return !(ctx.readingDone || {})[s.id]; })[0];
  if (unread) recs.push({ icon: "📚", text: "Read next: " + unread.title, dest: "story", arg: unread.id });
  if ((ctx.vocabCount || 0) < 20) {
    recs.push({ icon: "🧠", text: "Save 10 new words to your vocabulary", dest: "vocab", arg: null });
  }
  if (!ctx.writingDone) {
    recs.push({ icon: "✍️", text: "Try the Writing Lab — get feedback on a paragraph", dest: "writing", arg: null });
  }
  const weekAgo = Date.now() - 7 * 86400000;
  const recentAssess = (ctx.attempts || []).some(function (a) {
    return a.mode === "assessment" && a.date > weekAgo;
  });
  if (!recentAssess && weak && weak.sloId) {
    recs.push({ icon: "📝", text: "Take an assessment on " + weak.title, dest: "assess", arg: weak.sloId });
  }

  return {
    level: ctx.level || "Beginner",
    strengths: strengths, weaknesses: weaknesses,
    sloRows: rows.sort(function (a, b) { return a.title.localeCompare(b.title); }),
    vocabCount: ctx.vocabCount || 0, storiesDone: ctx.storiesDone || 0,
    attempts: (ctx.attempts || []).length,
    recommendations: recs.slice(0, 4)
  };
}

export { SLOS, STORIES, LESSONS, STORYMETA, WORDS };
