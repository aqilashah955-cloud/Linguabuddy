// LinguaBuddy — school scheme tests (Aga Khan Grade 7 Term II mapping). Pure logic only.
import {
  schemeById, termOf, clampLesson, lessonOf, lessonSlos, lessonTasks,
  isLessonMapped, schoolState, saveSchool, dailyItems, mappedLessons
} from "../js/scheme.js";
import { SLOS } from "../data/slos.js";
import { SCHEMES } from "../data/schemes.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; } else { fail++; console.log("FAIL:", name); }
}

const g7 = schemeById("ak-g7-english");
ok(g7 && g7.grade === "Grade 7", "g7 scheme found");
ok(schemeById("nope") === null, "unknown scheme -> null");

// terms: 1-65 first term, 66+ second term
ok(termOf(g7, 1).name === "First Term", "lesson 1 -> First Term");
ok(termOf(g7, 65).name === "First Term", "lesson 65 -> First Term");
ok(termOf(g7, 66).name === "Second Term", "lesson 66 -> Second Term");
ok(termOf(g7, 96).name === "Second Term", "lesson 96 -> Second Term");

// clamping
ok(clampLesson(g7, 0) === 1, "clamp low");
ok(clampLesson(g7, 999) === 96, "clamp high");
ok(clampLesson(g7, 70) === 70, "clamp ok");

// Term II lessons 66-96 all mapped from the real document
let mapped = 0;
for (let n = 66; n <= 96; n++) if (isLessonMapped(g7, n)) mapped++;
ok(mapped === 31, "all 31 Term II lessons mapped, got " + mapped);
ok(!isLessonMapped(g7, 5), "Term 1 lesson 5 not yet mapped");

// oral lessons use tasks, not banks
ok(lessonSlos(g7, 66).length === 0, "L66 (speaking) has no banks");
ok(lessonTasks(g7, 66).length >= 2, "L66 has speaking tasks");
ok(lessonTasks(g7, 95).length >= 1, "L95 has listening tasks");
ok(lessonSlos(g7, 68).indexOf("vocab") >= 0, "L68 -> vocab");
ok(lessonSlos(g7, 79).indexOf("pronouns") >= 0, "L79 -> pronouns");
ok(lessonSlos(g7, 83).indexOf("adverbs") >= 0, "L83 -> adverbs");
ok(lessonSlos(g7, 85).indexOf("adjectives") >= 0, "L85 -> adjectives");
ok(lessonSlos(g7, 84).indexOf("prepositions") >= 0, "L84 -> prepositions");

// new banks exist with 10 questions each
["pronouns", "adverbs", "adjectives"].forEach(function (id) {
  const s = SLOS.find(function (x) { return x.id === id; });
  ok(!!s, "bank exists: " + id);
  ok(s && s.questions.length === 10, "bank has 10 questions: " + id);
  ok(s && s.questions.every(function (q) { return q.q && q.a !== undefined; }), "bank questions valid: " + id);
});

// schoolState / saveSchool
const prof = { schemeId: "", schemeLesson: 0 };
ok(schoolState(prof) === null, "no setup -> null state");
saveSchool(prof, "ak-g7-english", 68);
ok(prof.schemeId === "ak-g7-english" && prof.schemeLesson === 68, "saveSchool stores");
const st = schoolState(prof);
ok(st && st.lesson === 68 && st.term.name === "Second Term", "schoolState resolves");
ok(st.entry && st.entry.code === "E-07-B1-01", "lesson entry carries SLO code");

// dailyItems from the lesson's mapped SLOs
const items = dailyItems(prof, "practice", []);
ok(items.length === 10, "practice set has 10 items, got " + items.length);
ok(items.every(function (it) { return it.sloId === "vocab"; }), "practice items all from lesson SLO");
const titems = dailyItems(prof, "test", []);
ok(titems.length === 10, "test capped at unique bank questions, got " + titems.length);
// a two-bank lesson (L69: reading+vocab = 20 questions) fills the full 15-question test
saveSchool(prof, "ak-g7-english", 69);
const titems2 = dailyItems(prof, "test", []);
ok(titems2.length === 15, "two-bank lesson fills 15-question test, got " + titems2.length);
ok(titems2.every(function (it) { return it.sloId === "reading" || it.sloId === "vocab"; }), "test items from lesson SLOs only");

// oral-only lesson -> no bank items (tasks drive it)
saveSchool(prof, "ak-g7-english", 66);
ok(dailyItems(prof, "practice", []).length === 0, "oral lesson -> no bank items");

// seen questions are excluded when possible
saveSchool(prof, "ak-g7-english", 68);
const first = dailyItems(prof, "practice", []);
const seenAtt = [{ usedKeys: first.map(function (it) { return it.bankKey; }) }];
const second = dailyItems(prof, "practice", seenAtt);
const overlap = second.filter(function (it) {
  return first.some(function (f) { return f.bankKey === it.bankKey; });
});
ok(overlap.length === 0, "seen questions excluded from next daily set");

// prep 9 placeholder still present for the incoming scheme
ok(!!schemeById("ak-prep9-english"), "prep 9 placeholder scheme present");

// hub: mapped lessons browser
const ml = mappedLessons(g7);
ok(ml.length === 31, "hub lists 31 mapped lessons, got " + ml.length);
ok(ml[0].n === 66 && ml[ml.length - 1].n === 96, "hub lessons run 66-96 in order");
ok(ml.every(function (l) { return l.title && l.code && l.week; }), "every hub lesson has title, SLO code and week");
ok(mappedLessons(schemeById("ak-prep9-english")).length === 0, "unmapped scheme -> empty hub list");
ok(mappedLessons(null).length === 0, "null scheme -> empty hub list");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
