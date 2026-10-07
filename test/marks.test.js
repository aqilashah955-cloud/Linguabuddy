// LinguaBuddy — marks tests (auto records: daily/weekly/monthly/semester).
import {
  isSchemeMark, parseSchemeRef, periodKey, periodLabel,
  studentMarks, classMarks, marksWhatsAppText, termForRef
} from "../js/marks.js";
import { monthOfLesson, monthLessons, akWorksheetHTML, schemeById } from "../js/scheme.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; } else { fail++; console.log("FAIL:", name); }
}

const DAY = 86400000;
const t0 = new Date(2026, 9, 5, 10, 0, 0).getTime(); // Mon 5 Oct 2026

function mkAtt(o) {
  return Object.assign({
    kind: "scheme-test", mode: "assessment", student: "Amina",
    ref: "ak-prep9-english:L68", title: "Daily Test", pct: 80,
    score: 8, total: 10, date: t0, perSlo: {}
  }, o);
}

// ---- filtering ----
ok(isSchemeMark(mkAtt({})), "scheme test counts as a mark");
ok(!isSchemeMark(mkAtt({ mode: "practice" })), "practice never counts as a mark");
ok(!isSchemeMark(mkAtt({ kind: "slo" })), "non-scheme attempts excluded");
ok(!isSchemeMark(mkAtt({ kind: "scheme-test", mode: "assessment", pct: "80" })), "non-numeric pct excluded");

// ---- ref parsing ----
const r1 = parseSchemeRef("ak-prep9-english:L68");
ok(r1 && r1.schemeId === "ak-prep9-english" && r1.lesson === 68, "lesson ref parsed");
const r2 = parseSchemeRef("ak-prep9-english:M:September");
ok(r2 && r2.schemeId === "ak-prep9-english" && r2.month === "September", "month ref parsed");
ok(parseSchemeRef("bogus") === null, "bad ref -> null");

// ---- period keys ----
ok(periodKey(t0, "day") === "2026-10-05", "day key");
ok(periodKey(t0, "week") === "2026-W41", "week key (ISO)");
ok(periodKey(t0, "month") === "2026-10", "month key");
ok(periodKey(t0 + 6 * DAY, "week") === "2026-W41", "same ISO week");
ok(periodKey(t0 + 7 * DAY, "week") === "2026-W42", "next ISO week");
ok(periodKey(t0, "term", "ak-prep9-english:L68") === "ak-prep9-english|Second Term", "term key from lesson");

// ---- period labels ----
ok(periodLabel("2026-10-05", "day") === "5 October", "day label");
ok(periodLabel("2026-W41", "week") === "Week 41, 2026", "week label");
ok(periodLabel("2026-10", "month") === "October 2026", "month label");
ok(periodLabel("ak-prep9-english|Second Term", "term").indexOf("Second Term") === 0, "term label");

// ---- student report ----
const atts = [
  mkAtt({ pct: 80, date: t0 }),
  mkAtt({ pct: 60, date: t0 + 3600000, ref: "ak-prep9-english:L69" }),
  mkAtt({ pct: 100, date: t0 + 7 * DAY, ref: "ak-prep9-english:L70" }),
  mkAtt({ mode: "practice", pct: 90, date: t0 }), // excluded
  mkAtt({ kind: "slo", pct: 50, date: t0 }) // excluded
];
const rep = studentMarks("Amina", atts, "week");
ok(rep.count === 3, "only 3 tests counted, got " + rep.count);
ok(rep.avg === 80, "avg 80, got " + rep.avg);
ok(rep.best === 100, "best 100");
ok(rep.groups.length === 2, "two weekly groups");
ok(rep.groups[0].key === "2026-W42", "newest week first");
ok(rep.groups[1].marks.length === 2, "two marks in first week");
ok(rep.groups[1].marks[0].lesson.indexOf("Lesson 69") === 0, "lesson label on mark");

const repDay = studentMarks("Amina", atts, "day");
ok(repDay.groups.length === 2, "two daily groups");

const repTerm = studentMarks("Amina", atts, "term");
ok(repTerm.groups.length === 1 && repTerm.groups[0].label.indexOf("Second Term") === 0, "term grouping");

const repMonth = studentMarks("Amina", atts.concat([mkAtt({ pct: 70, date: new Date(2026, 10, 2).getTime() })]), "month");
ok(repMonth.groups.length === 2, "two monthly groups");

const empty = studentMarks("Nobody", [], "week");
ok(empty.count === 0 && empty.avg === 0 && empty.groups.length === 0, "empty report");

// ---- class report ----
const cls = classMarks([
  { name: "Zara", attempts: [mkAtt({ student: "Zara", pct: 90 })] },
  { name: "Amina", attempts: atts }
], "week");
ok(cls.length === 2 && cls[0].name === "Amina", "class sorted by name");
ok(cls[1].count === 1 && cls[1].avg === 90, "second student stats");

// ---- WhatsApp text ----
const txt = marksWhatsAppText(rep, "Prep 9");
ok(txt.indexOf("Amina") >= 0 && txt.indexOf("80%") >= 0, "whatsapp text has name + avg");
ok(txt.indexOf("LinguaBuddy") >= 0, "whatsapp text branded");
ok(marksWhatsAppText(empty).indexOf("No scheme tests") >= 0, "empty whatsapp text");

// ---- term lookup ----
const tf = termForRef("ak-prep9-english:L66");
ok(tf && tf.term.name === "Second Term", "termForRef lesson");
const tfm = termForRef("ak-prep9-english:M:September");
ok(tfm && tfm.term.name === "Second Term", "termForRef month");

// ---- monthly test helpers ----
const p9 = schemeById("ak-prep9-english");
ok(monthOfLesson(p9, 68) === "September", "month of L68");
ok(monthOfLesson(p9, 72) === "October", "month of L72");
const sept = monthLessons(p9, "September");
ok(sept.length === 4, "September has 4 mapped lessons, got " + sept.length);
ok(sept.every(function (l) { return monthOfLesson(p9, l.n) === "September"; }), "all September lessons");
ok(monthLessons(p9, "Nope").length === 0, "unknown month -> none");

// ---- worksheet html ----
const ws = akWorksheetHTML(p9, 68);
ok(ws.indexOf("Lesson 68") >= 0, "worksheet has lesson title");
ok(ws.indexOf("E-07-B1-01") >= 0, "worksheet has SLO code");
ok(ws.indexOf("Name:") >= 0 && ws.indexOf("Score:") >= 0, "worksheet has name/score fields");
ok(ws.indexOf("answer key is printed") >= 0 || ws.indexOf("no answer key") >= 0 || ws.indexOf("No answer key") >= 0 || ws.indexOf("answer key") >= 0, "worksheet notes no printed key");
const wsOral = akWorksheetHTML(p9, 66);
ok(wsOral.indexOf("☐") >= 0, "oral lesson worksheet prints task checklist");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
