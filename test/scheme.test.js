// LinguaBuddy — school scheme tests (Aga Khan Prep 9 Term II mapping). Pure logic only.
import {
  schemeById, termOf, clampLesson, lessonOf, lessonSlos, lessonTasks,
  isLessonMapped, schoolState, saveSchool, dailyItems, mappedLessons,
  monthOfLesson, monthLessons, monthKey, startMonthlyTest
} from "../js/scheme.js";
import { SLOS } from "../data/slos.js";
import { SCHEMES } from "../data/schemes.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; } else { fail++; console.log("FAIL:", name); }
}

const p9 = schemeById("ak-prep9-english");
ok(p9 && p9.grade === "Prep 9", "prep9 scheme found");
ok(schemeById("nope") === null, "unknown scheme -> null");

// terms: 1-65 first term, 66+ second term
ok(termOf(p9, 1).name === "First Term", "lesson 1 -> First Term");
ok(termOf(p9, 65).name === "First Term", "lesson 65 -> First Term");
ok(termOf(p9, 66).name === "Second Term", "lesson 66 -> Second Term");
ok(termOf(p9, 96).name === "Second Term", "lesson 96 -> Second Term");

// clamping
ok(clampLesson(p9, 0) === 1, "clamp low");
ok(clampLesson(p9, 999) === 96, "clamp high");
ok(clampLesson(p9, 70) === 70, "clamp ok");

// Term II lessons 66-96 all mapped from the real document
let mapped = 0;
for (let n = 66; n <= 96; n++) if (isLessonMapped(p9, n)) mapped++;
ok(mapped === 31, "all 31 Term II lessons mapped, got " + mapped);
ok(!isLessonMapped(p9, 5), "Term 1 lesson 5 not yet mapped");

// oral lessons use tasks, not banks
ok(lessonSlos(p9, 66).length === 0, "L66 (speaking) has no banks");
ok(lessonTasks(p9, 66).length >= 2, "L66 has speaking tasks");
ok(lessonTasks(p9, 95).length >= 1, "L95 has listening tasks");
// every written lesson maps ONLY to banks built for its specific AK SLO
var specific = {
  68: ["syllables"], 70: ["sentence-patterns"], 72: ["formal-letters"],
  75: ["past-tense"], 77: ["skimming"], 80: ["poetry"], 81: ["poetry"],
  82: ["poetry", "writing"], 86: ["connotation"], 87: ["figurative"],
  88: ["descriptive-writing"], 91: ["paraphrasing"], 92: ["paraphrasing"],
  93: ["skimming"], 96: ["formal-letters"]
};
Object.keys(specific).forEach(function (n) {
  var got = lessonSlos(p9, +n).slice().sort().join(",");
  var want = specific[n].slice().sort().join(",");
  ok(got === want, "L" + n + " maps to its specific SLO bank(s): " + want + ", got " + got);
});

// new banks exist with 10 questions each
["pronouns", "adverbs", "adjectives", "syllables", "sentence-patterns", "formal-letters",
 "past-tense", "skimming", "poetry", "connotation", "figurative", "descriptive-writing",
 "paraphrasing"].forEach(function (id) {
  const s = SLOS.find(function (x) { return x.id === id; });
  ok(!!s, "bank exists: " + id);
  ok(s && s.questions.length === 10, "bank has 10 questions: " + id);
  ok(s && s.questions.every(function (q) { return q.q && q.a !== undefined; }), "bank questions valid: " + id);
});

// schoolState / saveSchool
const prof = { schemeId: "", schemeLesson: 0 };
ok(schoolState(prof) === null, "no setup -> null state");
saveSchool(prof, "ak-prep9-english", 68);
ok(prof.schemeId === "ak-prep9-english" && prof.schemeLesson === 68, "saveSchool stores");
const st = schoolState(prof);
ok(st && st.lesson === 68 && st.term.name === "Second Term", "schoolState resolves");
ok(st.entry && st.entry.code === "E-07-B1-01", "lesson entry carries SLO code");

// dailyItems from the lesson's mapped SLOs
const items = dailyItems(prof, "practice", []);
ok(items.length === 10, "practice set has 10 items, got " + items.length);
ok(items.every(function (it) { return it.sloId === "syllables"; }), "practice items all from lesson's specific SLO (syllables)");
const titems = dailyItems(prof, "test", []);
ok(titems.length === 10, "test capped at unique bank questions, got " + titems.length);
// a two-bank lesson (L69: reading+vocab = 20 questions) fills the full 15-question test
saveSchool(prof, "ak-prep9-english", 69);
const titems2 = dailyItems(prof, "test", []);
ok(titems2.length === 15, "two-bank lesson fills 15-question test, got " + titems2.length);
ok(titems2.every(function (it) { return it.sloId === "reading" || it.sloId === "vocab"; }), "test items from lesson SLOs only");

// oral-only lesson -> no bank items (tasks drive it)
saveSchool(prof, "ak-prep9-english", 66);
ok(dailyItems(prof, "practice", []).length === 0, "oral lesson -> no bank items");

// unmapped lesson (e.g. Prep 9 Lesson 17, First Term) -> NO items at all,
// never unrelated questions from other SLOs
saveSchool(prof, "ak-prep9-english", 17);
ok(dailyItems(prof, "practice", []).length === 0, "unmapped lesson -> no practice items");
ok(dailyItems(prof, "test", []).length === 0, "unmapped lesson -> no test items");
ok(!isLessonMapped(p9, 17), "L17 not mapped");

// seen questions are excluded when possible
saveSchool(prof, "ak-prep9-english", 68);
const first = dailyItems(prof, "practice", []);
const seenAtt = [{ usedKeys: first.map(function (it) { return it.bankKey; }) }];
const second = dailyItems(prof, "practice", seenAtt);
const overlap = second.filter(function (it) {
  return first.some(function (f) { return f.bankKey === it.bankKey; });
});
ok(overlap.length === 0, "seen questions excluded from next daily set");

// monthly test: month helpers + presence of the monthly launcher (regression:
// deleting this section must fail the suite, not silently drop the live feature)
ok(monthOfLesson(p9, 68) === "September", "L68 week -> September, got " + monthOfLesson(p9, 68));
ok(monthOfLesson(p9, 70) === "October", "L70 week -> October");
ok(monthOfLesson(p9, 5) === "", "unmapped lesson -> empty month");
const sept = monthLessons(p9, "September").map(function (l) { return l.n; });
ok(sept.join(",") === "66,67,68,69", "September lessons 66-69, got " + sept.join(","));
ok(monthLessons(p9, "").length === 0, "empty month -> no lessons");
ok(monthLessons(null, "September").length === 0, "null scheme -> no lessons");
const septWritten = monthLessons(p9, "September").filter(function (l) { return (l.slos || []).length > 0; });
ok(septWritten.length >= 2, "September has >= 2 written lessons for the monthly test");
ok(/^\d{4}-\d{1,2}$/.test(monthKey()), "monthKey format YYYY-M, got " + monthKey());
ok(typeof startMonthlyTest === "function", "startMonthlyTest exported (monthly test not dropped)");

// prep 9 placeholder still present for the incoming scheme
ok(!!schemeById("ak-prep9-english"), "prep 9 placeholder scheme present");

// hub: mapped lessons browser
const ml = mappedLessons(p9);
ok(ml.length === 31, "hub lists 31 mapped lessons, got " + ml.length);
ok(ml[0].n === 66 && ml[ml.length - 1].n === 96, "hub lessons run 66-96 in order");
ok(ml.every(function (l) { return l.title && l.code && l.week; }), "every hub lesson has title, SLO code and week");
ok(mappedLessons(null).length === 0, "null scheme -> empty hub list");

// regression: every app module must load (catches missing exports like SCHEMES)
const modResults = await Promise.all([
  import("../js/app.js").then(() => ["app.js", null]).catch(e => ["app.js", e.message]),
  import("../js/teacher.js").then(() => ["teacher.js", null]).catch(e => ["teacher.js", e.message]),
  import("../js/dashboard.js").then(() => ["dashboard.js", null]).catch(e => ["dashboard.js", e.message])
]);
modResults.forEach(function ([name, err]) {
  ok(!err, name + " loads without missing exports" + (err ? " :: " + err : ""));
});

// regression (2026-10-06): submit crashed AFTER saving because finishSchoolAttempt
// called awardXP() without importing it -> ReferenceError, no results/home shown.
// The module loads fine (not an import error), so guard the source directly.
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const here = dirname(fileURLToPath(import.meta.url));
const schemeSrc = readFileSync(join(here, "../js/scheme.js"), "utf8");
ok(/import\s*\{[^}]*\bawardXP\b[^}]*\}\s*from\s*["']\.\/gamify\.js["']/.test(schemeSrc),
  "scheme.js imports awardXP from gamify.js (submit-crash regression)");
ok((schemeSrc.match(/\bawardXP\s*\(/g) || []).length <= 3,
  "awardXP call sites are covered by the import");

// regression (2026-10-06): Daily Test button went dead when every question was
// already seen (test after practice on a 10-question bank -> dailyItems [] ->
// startDaily silently did nothing). The fallback rebuilds without exclusions.
const prof68 = { schemeId: "ak-prep9-english", schemeLesson: 68 };
const allSeen = [{ usedKeys: ["syllables:0","syllables:1","syllables:2","syllables:3","syllables:4","syllables:5","syllables:6","syllables:7","syllables:8","syllables:9"] }];
ok(dailyItems(prof68, "test", allSeen).length === 0, "test with all questions seen -> empty (bug scenario)");
ok(dailyItems(prof68, "test", []).length > 0, "test fallback without exclusions -> questions available");
ok(dailyItems(prof68, "practice", []).length === 10, "practice on L68 -> 10 questions");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
