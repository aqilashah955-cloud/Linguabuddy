// LinguaBuddy — Part 2 unit tests (run with: node test/part2.test.js)
// Covers: teacher analytics math, role gating, writing-lab no-rewrite rule,
// askTeacher assessment lock, gamification, conversation feedback.
import {
  SLOS, computeClassAnalytics, commonMissedTypes, evidenceFromSubmissions,
  suggestIntervention, buildProgressReport
} from "../js/engine.js";
import { roleAllowsTeacher, roleAllowsAdmin } from "../js/teacher.js";
import { analyzeWriting } from "../js/writing.js";
import { askTeacher } from "../js/ask.js";
import { __setAttemptForTest, attemptActive } from "../js/assess.js";
import { XP_TABLE, xpForAttempt, awardBadge, badgeList, checkBadges } from "../js/gamify.js";
import { feedbackFor } from "../js/convo.js";
import { S } from "../js/store.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }

/* ---------- analytics math ---------- */
section("teacher analytics math");
const subs = [
  { studentId: "u1", date: 1, title: "T1", perSlo: { tenses: { score: 9, total: 10, title: "Tenses" } },
    answers: [{ type: "mcq", sloId: "tenses", score: 1 }] },
  { studentId: "u1", date: 2, title: "T2", perSlo: { tenses: { score: 8, total: 10, title: "Tenses" } },
    answers: [{ type: "fib", sloId: "tenses", score: 1 }] },
  { studentId: "u1", date: 3, title: "T3", perSlo: { tenses: { score: 10, total: 10, title: "Tenses" } },
    answers: [{ type: "fib", sloId: "tenses", score: 0 }] },
  { studentId: "u2", date: 1, title: "T1", perSlo: { tenses: { score: 2, total: 10, title: "Tenses" } },
    answers: [{ type: "fib", sloId: "tenses", score: 0 }, { type: "fib", sloId: "tenses", score: 0 }] },
  { studentId: "u2", date: 2, title: "T2", perSlo: { tenses: { score: 3, total: 10, title: "Tenses" } },
    answers: [{ type: "mcq", sloId: "tenses", score: 0 }] }
];
const rows = computeClassAnalytics(["u1", "u2", "u3"], subs);
const tRow = rows.find(function (r) { return r.sloId === "tenses"; });
ok(tRow.mastered === 1, "u1 (90/80/100) counts as mastered");
ok(tRow.needs === 1, "u2 (20/30) counts as needs practice");
ok(tRow.notStarted === 1, "u3 with no evidence counts as not started");
// recency-weighted: u1 avg=92, u2 avg=27 → class avg = round((92+27)/2) = 60
ok(tRow.avg === 60, "class avg = mean of student avgs (" + tRow.avg + "%)");
ok(rows.length === SLOS.length, "one analytics row per SLO");

const ev = evidenceFromSubmissions(subs);
ok(ev.u1.tenses.length === 3 && ev.u2.tenses.length === 2 && !ev.u3, "evidence grouped per student per SLO");

const missed = commonMissedTypes(subs, "tenses");
ok(missed[0].type === "fib" && missed[0].misses === 3, "fib is the most-missed type (3 misses)");
ok(typeof suggestIntervention("tenses", missed) === "string" && /remediation/i.test(suggestIntervention("tenses", missed)),
  "suggestIntervention returns actionable text");

/* ---------- progress report ---------- */
section("progress report");
const mastery = {};
SLOS.forEach(function (s) { mastery[s.id] = { status: "mastered", avg: 85, count: 3 }; });
mastery.sva = { status: "needs", avg: 30, count: 2 };
const rep = buildProgressReport({
  mastery: mastery, attempts: subs, level: "Intermediate",
  vocabCount: 12, storiesDone: 2, writingDone: false, readingDone: {}
});
ok(rep.strengths.some(function (x) { return /tenses/i.test(x); }), "mastered SLO appears in strengths");
ok(rep.weaknesses.some(function (x) { return /subject/i.test(x); }), "weak SLO appears in areas to improve");
ok(rep.sloRows.length === SLOS.length, "report has a row per SLO");
ok(rep.recommendations.length > 0 && rep.recommendations.every(function (r) { return r.dest && r.text && r.icon; }),
  "recommendations have destination + text");
ok(rep.recommendations.some(function (r) { return r.dest === "lesson" && r.arg === "sva"; }),
  "weakest SLO recommended as next lesson");

/* ---------- role gating ---------- */
section("role gating");
ok(roleAllowsTeacher({ role: "teacher" }) === true, "teacher role passes teacher gate");
ok(roleAllowsTeacher({ role: "student" }) === false, "student role fails teacher gate");
ok(roleAllowsTeacher({}) === false && roleAllowsTeacher(null) === false, "missing profile fails teacher gate");
globalThis.window = { OWNER_EMAIL: "owner@example.com" };
ok(roleAllowsAdmin({ email: "owner@example.com" }) === true, "owner email passes admin gate");
ok(roleAllowsAdmin({ email: "Owner@Example.com" }) === true, "admin gate is case-insensitive");
ok(roleAllowsAdmin({ email: "someone@else.com" }) === false, "other email fails admin gate");
ok(roleAllowsAdmin({ email: "owner@example.com", role: "student" }) === true, "admin gate uses email, not role field");
delete globalThis.window;
ok(roleAllowsAdmin({ email: "owner@example.com" }) === false, "admin gate closed when OWNER_EMAIL unconfigured");

/* ---------- writing lab: never rewrites ---------- */
section("writing lab");
const wres = analyzeWriting("i goes to school teh morning. he go to market", { kind: "paragraph", minWords: 20 });
ok(Array.isArray(wres.issues) && wres.issues.length > 0, "issues detected in flawed text");
ok(wres.issues.every(function (x) { return x.category && x.explain && x.hint; }),
  "every issue has category + explanation + hint");
const keys = Object.keys(wres).concat(wres.issues.length ? Object.keys(wres.issues[0]) : []);
ok(!/(rewrit|corrected|fixed)/i.test(keys.join(" ")), "no rewrite/corrected-text field in feedback output");
ok(!/correctedText|rewrite|fixedText/.test(JSON.stringify(wres)), "feedback payload contains no corrected text");
ok(wres.issues.some(function (x) { return x.category === "spelling" && /teh/.test(x.found); }), "misspelling 'teh' flagged");
ok(wres.issues.some(function (x) { return x.category === "grammar" && /i goes/.test(x.found); }), "subject-verb error flagged");
const wgood = analyzeWriting("I went to school in the morning. It was a beautiful day. My friends were happy to see me.", { kind: "sentence", minWords: 5 });
ok(wgood.issues.length === 0, "clean text produces no issues");

/* ---------- askTeacher assessment lock ---------- */
section("askTeacher");
__setAttemptForTest(null);
ok(attemptActive() === false, "no active attempt by default");
const a1 = askTeacher("What is past tense?");
ok(a1.mode === "answer" && /tense/i.test(a1.text), "normal question answered from KB");
__setAttemptForTest({ submitted: false });
ok(attemptActive() === true, "simulated attempt is active");
const a2 = askTeacher("What is past tense?");
ok(a2.mode === "hint", "direct answer refused during assessment (mode=hint)");
ok(/test mode|assessment/i.test(a2.text), "refusal explains test mode");
ok(!/walked|simple past form/i.test(a2.text), "hint does not leak a direct answer");
const a3 = askTeacher("What does 'beautiful' mean?");
ok(a3.mode === "hint", "vocab question also hint-only during assessment");
__setAttemptForTest(null);
ok(askTeacher("").mode === "empty", "empty question handled");

/* ---------- gamification ---------- */
section("gamification");
const xp = xpForAttempt({ mode: "assessment", results: [{ res: { score: 1 } }, { res: { score: 0.5 } }, { res: { score: 0 } }] });
ok(xp === XP_TABLE.correctAnswer + XP_TABLE.partialAnswer + XP_TABLE.assessmentComplete,
  "XP math: 10 + 4 + 50 = " + xp);
S.profile.badges = [];
ok(awardBadge("first-lesson") === true, "first award returns true");
ok(awardBadge("first-lesson") === false, "duplicate award returns false (idempotent)");
ok(badgeList().find(function (b) { return b.id === "first-lesson"; }).earned === true, "badge shows as earned");
S.profile.streak = 7; S.attempts = [{ id: "x" }];
checkBadges();
ok(S.profile.badges.indexOf("streak-7") >= 0 && S.profile.badges.indexOf("first-lesson") >= 0,
  "checkBadges awards streak + first-lesson");
S.profile.streak = 0; S.attempts = [];

/* ---------- conversation feedback ---------- */
section("conversation feedback");
const fb = feedbackFor(["Hello, how are you?", "I am fine thank you. And you?", "I like football very much."]);
ok(fb.strengths.length > 0, "strengths listed");
ok(Array.isArray(fb.nextSteps), "next steps array present");
ok(fb.strengths.length <= 3 && fb.nextSteps.length <= 2, "feedback is concise (<=3 strengths, <=2 next steps)");

/* ---------- writing lab: precise highlights (regression: "i" in "things") ---------- */
section("writing highlight precision");
const txtP = "We learn new things every day. i am happy becasue coutries are far. She is good at english";
const precise = analyzeWriting(txtP, { kind: "paragraph", minWords: 5 });
ok(Array.isArray(precise.marks) && precise.marks.length > 0, "marks array returned with offsets");
ok(precise.marks.every(function (m) { return m.at >= 0 && m.at + m.len <= txtP.length; }),
  "every mark offset stays inside the text (no drift)");
const iMarks = precise.marks.filter(function (m) { return txtP.slice(m.at, m.at + m.len) === "i"; });
ok(iMarks.length === 1 && txtP[iMarks[0].at - 1] === " ", "standalone pronoun 'i' marked exactly once (not the 'i' in 'things')");
ok(!precise.marks.some(function (m) { return txtP.slice(Math.max(0, m.at - 3), m.at + m.len) === "thi"; }),
  "no mark lands inside the word 'things'");
ok(precise.issues.some(function (x) { return x.category === "spelling" && x.found === "becasue"; }), "misspelling 'becasue' flagged");
ok(precise.issues.some(function (x) { return x.category === "spelling" && x.found === "coutries"; }), "misspelling 'coutries' flagged");
ok(precise.issues.some(function (x) { return x.category === "punctuation" && x.found === "english"; }), "lowercase proper noun 'english' flagged");
ok(precise.issues.every(function (x) {
  return JSON.stringify(Object.keys(x).sort()) === JSON.stringify(["category", "explain", "found", "hint"]);
}), "issue shape unchanged (category/found/explain/hint only)");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
