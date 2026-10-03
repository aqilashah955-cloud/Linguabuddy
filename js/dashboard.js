// LinguaBuddy — student dashboard (Home) + Progress screen.
// "Welcome back, [Name]!", Continue Learning (weakest SLO), Today's English,
// progress bars, streak, and counts.

import { S, touchStreak } from "./store.js";
import { SLOS, STORIES, WORDS, calculateSLOMastery, masteryLabel, weakestSlo, buildItems } from "./engine.js";
import { esc, dayOfYear } from "./utils.js";
import { runAttempt, showResult } from "./assess.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGo(fn) { go = fn; }

export const SKILLS = {
  grammar: ["tenses", "sva", "voice", "speech", "articles", "prepositions", "punct", "clauses"],
  vocab: ["synant", "vocab"],
  reading: ["reading"],
  writing: ["writing"]
};
const SKILL_LABEL = { grammar: "Grammar", vocab: "Vocabulary", reading: "Reading", writing: "Writing" };

export function masteryMap() {
  const m = {};
  SLOS.forEach(function (s) { m[s.id] = calculateSLOMastery(s.id, S.masteryEv[s.id]); });
  return m;
}

function skillAvg(sloIds, m) {
  const vals = sloIds.map(function (id) { return m[id]; }).filter(function (x) { return x && x.count > 0; });
  if (!vals.length) return null;
  return Math.round(vals.reduce(function (s, x) { return s + x.avg; }, 0) / vals.length);
}

function bar(pctOrNull, label) {
  const pct = pctOrNull == null ? 0 : pctOrNull;
  const sub = pctOrNull == null ? "not started" : pct + "%";
  return '<div class="slo-bar"><div class="slo-bar-top"><span>' + esc(label) + "</span><span>" + sub + "</span></div>" +
    '<div class="slo-bar-track"><div class="slo-bar-fill" style="width:' + pct + '%"></div></div></div>';
}

/* ---------------- home dashboard ---------------- */
export function renderDashboard() {
  touchStreak();
  const name = S.profile.name || "Learner";
  $("dashHello").textContent = "Welcome back, " + name + "! 👋";
  $("dashStreak").textContent = "🔥 " + (S.profile.streak || 0) + "-day streak";

  const m = masteryMap();
  const weak = weakestSlo(m);

  // Continue Learning
  const cl = $("continueCard");
  if (!weak.mastery || weak.mastery.count === 0) {
    cl.innerHTML = '<span class="hc-emoji">🚀</span><span class="hc-title">Start learning: ' + esc(weak.title) + '</span>' +
      '<span class="hc-sub">Your first lesson is ready</span>';
  } else {
    cl.innerHTML = '<span class="hc-emoji">🎯</span><span class="hc-title">Continue: ' + esc(weak.title) + '</span>' +
      '<span class="hc-sub">' + masteryLabel(weak.mastery.status) + " · " + weak.mastery.avg + "% — keep going</span>";
  }
  cl.onclick = function () { if (go) go("lesson", weak.sloId); };

  // Today's English (rotated daily)
  const doy = dayOfYear();
  const tSlo = SLOS[doy % SLOS.length];
  const gSlo = SLOS[(doy * 3 + 1) % SLOS.length];
  const story = STORIES[doy % STORIES.length];
  const words = [0, 1, 2, 3, 4].map(function (k) { return WORDS[(doy * 5 + k) % WORDS.length]; });

  const rows = [
    { e: "📖", t: "Today's Lesson", s: tSlo.title, fn: function () { go("lesson", tSlo.id); } },
    { e: "🧠", t: "Today's Vocabulary", s: words.map(function (w) { return w.word; }).join(", "), fn: function () { go("vocab"); } },
    { e: "✏️", t: "Today's Grammar", s: gSlo.title + " · quick 5-question practice", fn: function () { quickPractice(gSlo.id, gSlo.title + " — Quick Practice"); } },
    { e: "📚", t: "Today's Reading", s: story.title, fn: function () { go("story", story.id); } },
    { e: "⚡", t: "Today's Challenge", s: "5 mixed questions against the clock", fn: function () { quickChallenge(); } },
    { e: "🎯", t: "Mini Assessment", s: weak.title + " · 5 questions", fn: function () { if (go) go("assess", weak.sloId); } }
  ];
  const box = $("todayBox");
  box.innerHTML = "";
  rows.forEach(function (r) {
    const b = document.createElement("button");
    b.className = "today-row";
    b.innerHTML = '<span class="tr-emoji">' + r.e + '</span><span class="tr-text"><strong>' + esc(r.t) +
      "</strong><br><span class='fine'>" + esc(r.s) + "</span></span><span class='mc-arrow'>→</span>";
    b.addEventListener("click", r.fn);
    box.appendChild(b);
  });

  // Progress bars
  const overall = skillAvg(SLOS.map(function (s) { return s.id; }), m);
  $("dashBars").innerHTML =
    bar(overall, "Overall English") +
    bar(skillAvg(SKILLS.grammar, m), "Grammar") +
    bar(skillAvg(SKILLS.vocab, m), "Vocabulary") +
    bar(skillAvg(SKILLS.reading, m), "Reading") +
    bar(skillAvg(SKILLS.writing, m), "Writing");

  // Counts
  const mastered = SLOS.filter(function (s) { return m[s.id].status === "mastered"; }).length;
  const storiesDone = Object.keys(S.reading || {}).length;
  const assessments = S.attempts.filter(function (a) { return a.mode === "assessment"; }).length;
  $("dashCounts").innerHTML =
    countChip("🎯", mastered + " SLOs mastered") +
    countChip("🧠", S.vocab.length + " words learned") +
    countChip("📚", storiesDone + " stories completed") +
    countChip("📝", assessments + " assessments done");
  function countChip(e, t) {
    return '<span class="count-chip">' + e + " " + esc(t) + "</span>";
  }

  // vocab preview words with Urdu
  $("todayWords").innerHTML = words.map(function (w) {
    return '<span class="word-chip">' + esc(w.word) + ' <em>' + esc(w.urdu) + "</em></span>";
  }).join("");
}

function quickPractice(sloId, title) {
  const items = buildItems({ kind: "slo", ref: sloId, count: 5, seed: "daily-" + dayOfYear() + sloId });
  runAttempt({
    title: title, items: items, timePerQ: 0, antiCopy: false, hints: true, lockKey: null,
    onDone: function (out) {
      showResult({
        title: title, scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks",
        results: out.results, perSlo: out.perSlo,
        actions: [
          { label: "Back Home", primary: true, fn: function () { go("home"); } },
          { label: "Full Lesson", fn: function () { go("lesson", sloId); } }
        ]
      });
    }
  });
}

function quickChallenge() {
  const items = buildItems({ kind: "mixed", count: 5, seed: "challenge-" + dayOfYear() + (S.profile.name || "") });
  runAttempt({
    title: "Today's Challenge", items: items, timePerQ: 60, antiCopy: true, hints: false, lockKey: null,
    onDone: function (out) {
      showResult({
        title: "Today's Challenge", scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks · tab switches: " + out.tabs,
        results: out.results, perSlo: out.perSlo,
        actions: [{ label: "Back Home", primary: true, fn: function () { go("home"); } }]
      });
    }
  });
}

/* ---------------- progress screen ---------------- */
export function renderProgress() {
  const m = masteryMap();
  const mine = S.attempts;
  const avg = mine.length ? Math.round(mine.reduce(function (s, a) { return s + a.pct; }, 0) / mine.length) : null;
  $("pgSummary").innerHTML =
    "<strong>" + mine.length + "</strong> attempts · " +
    "<strong>" + (avg == null ? "—" : avg + "%") + "</strong> average · " +
    "🔥 <strong>" + (S.profile.streak || 0) + "</strong>-day streak";

  $("pgMastery").innerHTML = SLOS.map(function (s) {
    const x = m[s.id];
    const pill = x.status === "mastered" ? '<span class="pill ok">Mastered</span>'
      : x.status === "developing" ? '<span class="pill mid">Developing</span>'
      : x.status === "needs" ? '<span class="pill low">Needs Practice</span>'
      : '<span class="pill">Not started</span>';
    return '<div class="mast-row"><div><strong>' + esc(s.title) + "</strong><br>" +
      '<span class="fine">' + (x.count ? x.count + " evidence · " + x.avg + "%" : "no attempts yet") + "</span></div>" + pill + "</div>";
  }).join("");

  $("pgList").innerHTML = mine.length ? mine.slice().reverse().map(function (a) {
    return '<div class="score-row"><div class="score-info"><strong>' + esc(a.title) + "</strong><br>" +
      '<span class="fine">' + fmtDateX(a.date) + " · " + a.score + "/" + a.total + " marks</span></div>" +
      '<div class="score-pct">' + a.pct + "%</div></div>";
  }).join("") : '<p class="empty-msg">No attempts yet. Complete a worksheet to see it here.</p>';

  function fmtDateX(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
  }
}
