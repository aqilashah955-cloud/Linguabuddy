// LinguaBuddy — node tests for Engagement & Family (engage.js + mascot.js).
// Plain node, no DOM, no network.

import {
  pickDaily, todayContent, checkIn, scorePronunciation, sayItTargets,
  helpTips, buildReportData, reportHTML, listLearners
} from "../js/engage.js";
import { mascotSVG, MASCOT_MOODS } from "../js/mascot.js";

let passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) { passed++; }
  else { failed++; console.error("FAIL:", name); }
}
function eq(a, b, name) { ok(JSON.stringify(a) === JSON.stringify(b), name + " (got " + JSON.stringify(a) + ")"); }

/* ---------- pickDaily: deterministic ---------- */
eq(pickDaily("2026-10-04"), pickDaily("2026-10-04"), "pickDaily deterministic");
eq(pickDaily("2026-01-01"), pickDaily("2026-01-01"), "pickDaily deterministic (jan)");
ok(pickDaily("2026-10-04").word && pickDaily("2026-10-04").phrase &&
   pickDaily("2026-10-04").idiom && pickDaily("2026-10-04").twister,
   "pickDaily returns all four content types");

/* ---------- pickDaily: consecutive days differ ---------- */
var allDiffer = true;
for (var d = 1; d <= 30; d++) {
  var a = "2026-10-" + d, b = "2026-10-" + (d + 1);
  if (JSON.stringify(pickDaily(a)) === JSON.stringify(pickDaily(b))) { allDiffer = false; break; }
}
ok(allDiffer, "consecutive days give different picks (30 pairs)");

/* ---------- todayContent ---------- */
var tc = todayContent();
ok(tc.word && tc.phrase && tc.idiom && tc.twister, "todayContent returns all content types");

/* ---------- scorePronunciation ---------- */
ok(scorePronunciation("the cat sat", "the cat sat") === 100, "exact match = 100");
ok(scorePronunciation("THE CAT", "the cat") === 100, "case-insensitive = 100");
ok(scorePronunciation("the cat sat", "the cat sat on the mat") === 50, "partial overlap = 50");
ok(scorePronunciation("", "the cat") === 0, "empty spoken = 0");
ok(scorePronunciation("hello", "") === 0, "empty target = 0");
ok(scorePronunciation("xyz abc", "the cat") === 0, "no overlap = 0");
ok(scorePronunciation("cat the", "the cat") === 100, "word order ignored = 100");
ok(scorePronunciation("the, cat!", "the cat") === 100, "punctuation stripped = 100");

/* ---------- checkIn ---------- */
var state = {};
ok(checkIn(state, "2026-10-04") === true, "checkIn marks a new date (returns true)");
ok(state["2026-10-04"] === true, "checkIn writes the date key");
ok(checkIn(state, "2026-10-04") === false, "checkIn idempotent (returns false)");
ok(checkIn(state, "2026-10-05") === true, "checkIn allows a different date");

/* ---------- mascotSVG ---------- */
MASCOT_MOODS.forEach(function (m) {
  var s = mascotSVG(m);
  ok(typeof s === "string" && s.indexOf("<svg") >= 0, "mascotSVG('" + m + "') returns svg string");
});
ok(mascotSVG("nope").indexOf("svg") >= 0, "mascotSVG falls back to default mood");

/* ---------- sayItTargets ---------- */
var daily = pickDaily("2026-10-04");
var tg = sayItTargets({ vocab: [{ word: "bright", definition: "shining" }] }, daily);
ok(tg.length === 3 && tg[0].text === daily.word.word && tg[2].text === "bright",
  "sayItTargets: daily word + phrase + vocab");

/* ---------- helpTips ---------- */
["kids", "juniors", "teens"].forEach(function (g) {
  var t = helpTips(g);
  ok(Array.isArray(t) && t.length >= 3, "helpTips('" + g + "') has 3+ tips");
});
ok(helpTips("unknown").length >= 3, "helpTips falls back for unknown group");

/* ---------- buildReportData + reportHTML ---------- */
var fakeState = {
  profile: { name: "Amina", level: "A2", xp: 250, streak: 7, badges: ["first-lesson"] },
  masteryEv: {
    tenses: [{ pct: 90, n: 10, ts: 1 }, { pct: 85, n: 10, ts: 2 }, { pct: 95, n: 10, ts: 3 }],
    articles: [{ pct: 40, n: 10, ts: 1 }]
  },
  vocab: [{ word: "a" }, { word: "b" }, { word: "c" }],
  reading: { s1: { done: true }, s2: { done: true }, s3: { done: false } },
  attempts: [
    { kind: "game" }, { kind: "game" }, { kind: "game" },
    { mode: "assess" }, { mode: "practice" }
  ]
};
var rep = buildReportData(fakeState);
ok(rep.xp === 250, "report: xp");
ok(rep.streak === 7, "report: streak");
ok(rep.slosMastered === 1, "report: slosMastered counts only mastered (got " + rep.slosMastered + ")");
ok(rep.wordsLearned === 3, "report: wordsLearned");
ok(rep.storiesRead === 2, "report: storiesRead counts done only");
ok(rep.gamesPlayed === 3, "report: gamesPlayed");
ok(rep.assessmentsDone === 1, "report: assessmentsDone");
ok(rep.badges === 1, "report: badges");

var html = reportHTML(rep);
ok(html.indexOf("Amina") >= 0, "reportHTML includes learner name");
ok(html.indexOf("Progress Report") >= 0, "reportHTML includes title");
ok(html.indexOf("250") >= 0 && html.indexOf("SLOs mastered") >= 0, "reportHTML includes key stats");
ok(html.indexOf("<script") < 0, "reportHTML has no script tags");

/* ---------- listLearners ---------- */
ok(Array.isArray(listLearners()) && listLearners().length >= 1, "listLearners falls back to current profile");

console.log(passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
