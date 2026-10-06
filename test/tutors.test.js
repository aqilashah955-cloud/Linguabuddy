// LinguaBuddy — 🎓 Find a Tutor marketplace tests. Pure data + logic only (DOM-free).
import {
  TUTORS, getTutor, tutorTags, tutorSloIds, filterTutors,
  tutorAvgRating, tutorReviews, weakSloSummary, tutorsForWeakSlos,
  myBookings, getBooking, createBooking, cancelBooking, rescheduleBooking, markPaid,
  threadFor, sendMessage, addReview, addProgressNote, notesForBooking,
  reportTutor, requestVerification, SAFETY
} from "../js/tutors.js";
import { schemeById, lessonOf, isLessonMapped } from "../js/scheme.js";
import { S } from "../js/store.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; } else { fail++; console.log("FAIL:", name); }
}
function throws(fn) {
  try { fn(); return false; } catch (e) { return true; }
}
function ids(list) { return list.map(function (t) { return t.id; }).sort().join(","); }

// fresh tutoring state so tests are isolated from any real saved data
function resetTutoring() {
  S.tutoring = { bookings: [], threads: {}, reviews: {}, reports: [], notes: [], verif: [] };
}
resetTutoring();

/* ---------- (a) seed integrity: tags resolve to REAL mapped lessons ---------- */

ok(Array.isArray(TUTORS) && TUTORS.length === 12, "12 seed tutors, got " + TUTORS.length);
ok(new Set(TUTORS.map(function (t) { return t.id; })).size === 12, "tutor ids unique");
ok(getTutor("t1") && getTutor("t1").name === "Ayesha Khan", "getTutor finds t1");
ok(getTutor("nope") === null, "getTutor unknown -> null");

let tagsChecked = 0, tagsOk = true;
TUTORS.forEach(function (t) {
  ok(Array.isArray(t.lessons) && t.lessons.length > 0, t.id + " has lesson tags");
  ok(Array.isArray(t.slots) && t.slots.length > 0, t.id + " has slots");
  ok(typeof t.feePKR === "number" && t.feePKR > 0, t.id + " has feePKR");
  ok(Array.isArray(t.subjects) && t.subjects.length > 0, t.id + " has subjects");
  ok(Array.isArray(t.grades) && t.grades.length > 0, t.id + " has grades");
  ok(Array.isArray(t.modes) && t.modes.length > 0, t.id + " has modes");
  (t.seededReviews || []).forEach(function (r) {
    if (!(r.stars >= 1 && r.stars <= 5 && (r.text || "").trim())) tagsOk = false;
  });
  // every tag must resolve to a REAL mapped lesson, with the lesson's own title/code
  (t.lessons || []).forEach(function (tag) {
    tagsChecked++;
    const scheme = schemeById(tag.schemeId);
    const lesson = scheme ? lessonOf(scheme, tag.n) : null;
    if (!scheme || !lesson || !isLessonMapped(scheme, tag.n)) { tagsOk = false; return; }
    if (tag.title !== lesson.title || tag.code !== lesson.code) tagsOk = false;
  });
  // tutorTags() exposes the same tags as {schemeId,n,title,code}
  const exposed = tutorTags(t);
  ok(exposed.length === t.lessons.length, t.id + " tutorTags length matches");
  ok(exposed.every(function (g) {
    return g.schemeId && g.n != null && typeof g.title === "string" && typeof g.code === "string";
  }), t.id + " tutorTags shape {schemeId,n,title,code}");
  ok(Array.isArray(tutorSloIds(t)), t.id + " tutorSloIds is array");
});
ok(tagsChecked > 0 && tagsOk, "all " + tagsChecked + " lesson tags resolve to real mapped lessons (title+code match)");
ok(tutorSloIds(getTutor("t1")).length >= 2, "t1 has SLO ids for weak-area matching");

// SAFETY strings
ok(SAFETY && typeof SAFETY.chat === "string" && SAFETY.chat.length > 10, "SAFETY.chat string");
ok(SAFETY && typeof SAFETY.pay === "string" && SAFETY.pay.length > 10, "SAFETY.pay string");

/* ---------- (b) filterTutors ---------- */

ok(filterTutors().length === 12, "no filters -> all 12");
ok(filterTutors({}).length === 12, "empty opts -> all 12");
ok(ids(filterTutors({ subject: "Grammar" })) === "t1,t10,t12,t6", "subject Grammar -> t1,t6,t10,t12");
ok(ids(filterTutors({ grade: "Prep 9" })) === "t12,t3,t5,t6,t7,t9", "grade Prep 9 -> 6 tutors");
ok(filterTutors({ mode: "online" }).length === 11, "mode online -> 11 (t9 is inperson-only)");
ok(ids(filterTutors({ mode: "inperson" })) === "t1,t11,t12,t3,t4,t7,t9", "mode inperson");
ok(ids(filterTutors({ maxFee: 600 })) === "t2,t3,t5", "maxFee 600 -> t2,t3,t5");
ok(ids(filterTutors({ verifiedOnly: true })) === "t1,t10,t4,t6,t7", "verifiedOnly -> 5 tutors");
const hiRated = filterTutors({ minRating: 4.8 });
ok(ids(hiRated) === "t1,t10,t4,t7", "minRating 4.8 -> t1,t4,t7,t10");
ok(hiRated.every(function (t) { return tutorAvgRating(t) >= 4.8; }), "minRating results all >= 4.8");
ok(ids(filterTutors({ schemeId: "ak-g7-english", lessonN: 70 })) === "t1,t10", "lesson 70 (ak-g7-english) -> t1,t10");
ok(ids(filterTutors({ lessonN: 70 })) === "t1,t10", "lesson 70 without schemeId -> t1,t10");
ok(ids(filterTutors({ subject: "Grammar", grade: "Grade 7", maxFee: 1000 })) === "t1", "combined filters -> t1 only");
ok(filterTutors({ subject: "Astronomy" }).length === 0, "unknown subject -> none");
ok(filterTutors({ lessonN: 9999 }).length === 0, "unknown lesson -> none");

/* ---------- (c) booking lifecycle ---------- */

const b1 = createBooking({ tutorId: "t1", slot: "Mon 4:00 PM", parentName: "Test Parent" });
ok(b1 && b1.tutorId === "t1" && b1.slot === "Mon 4:00 PM", "createBooking stores tutor+slot");
ok(b1.status === "requested" && b1.paid === false, "new booking requested + unpaid");
ok(b1.parentName === "Test Parent" && typeof b1.id === "string", "booking keeps parentName + id");
ok(myBookings().length === 1 && getBooking(b1.id) === b1, "myBookings/getBooking find it");
ok(throws(function () { createBooking({ tutorId: "nope", slot: "Mon 4:00 PM" }); }), "createBooking rejects unknown tutor");
ok(throws(function () { createBooking({ tutorId: "t1", slot: "Never o'clock", parentName: "P" }); }), "createBooking rejects bad slot");
ok(throws(function () { createBooking({ tutorId: "t1", parentName: "P" }); }), "createBooking rejects missing slot");

const r1 = rescheduleBooking(b1.id, "Wed 5:30 PM");
ok(r1 && r1.slot === "Wed 5:30 PM", "reschedule updates slot");
ok(throws(function () { rescheduleBooking(b1.id, "Nope" ); }), "reschedule rejects bad slot");
ok(rescheduleBooking("nope", "Wed 5:30 PM") === null, "reschedule unknown -> null");

ok(markPaid(b1.id, true).paid === true, "markPaid true");
ok(markPaid(b1.id, false).paid === false, "markPaid false");
ok(markPaid("nope", true) === null, "markPaid unknown -> null");

ok(cancelBooking(b1.id).status === "cancelled", "cancelBooking marks cancelled");
ok(cancelBooking("nope") === null, "cancelBooking unknown -> null");

/* ---------- (d) parentName: data module enforces the parent gate ---------- */

resetTutoring();
ok(throws(function () { createBooking({ tutorId: "t2", slot: "Tue 5:00 PM" }); }),
  "createBooking without parentName throws — the parent gate is enforced at the data layer, not just the UI");
ok(throws(function () { createBooking({ tutorId: "t2", slot: "Tue 5:00 PM", parentName: "   " }); }),
  "createBooking with blank parentName throws");
const bWithParent = createBooking({ tutorId: "t2", slot: "Tue 5:00 PM", parentName: "  Test Parent " });
ok(bWithParent && bWithParent.parentName === "Test Parent", "createBooking trims and stores parentName");
resetTutoring();

/* ---------- (e) weakSloSummary / tutorsForWeakSlos with injected state ---------- */

const origRemedial = S.remedialPlans, origAttempts = S.attempts;
const weakA = tutorSloIds(getTutor("t1"))[0];
const weakB = tutorSloIds(getTutor("t1"))[1];
S.remedialPlans = [{ id: "rp1", slos: [{ id: weakA, title: "Weak A", pct: 45 }, { id: weakB, title: "Weak B", pct: 30 }] }];
S.attempts = [
  { perSlo: { [weakA]: { score: 2, total: 10, title: "Weak A" } } },   // 20% -> worst for weakA
  { perSlo: { "strong-slo": { score: 9, total: 10, title: "Strong" } } } // 90% -> excluded
];
const summary = weakSloSummary();
ok(Array.isArray(summary) && summary.length === 2, "weakSloSummary finds 2 weak SLOs, got " + summary.length);
ok(summary[0].sloId === weakA && summary[0].pct === 20, "worst-first: weakA at 20% (min of plan 45% + attempt 20%)");
ok(summary[1].sloId === weakB && summary[1].pct === 30, "weakB at 30% second");
ok(summary.every(function (s) {
  return typeof s.sloId === "string" && typeof s.title === "string" && typeof s.pct === "number" && s.pct < 60;
}), "weakSloSummary shape {sloId,title,pct}, all < 60");
ok(!summary.some(function (s) { return s.sloId === "strong-slo"; }), "90% SLO excluded from weak summary");

const matches = tutorsForWeakSlos();
ok(matches.length > 0, "tutorsForWeakSlos finds matches");
const m1 = matches.filter(function (m) { return m.tutor && m.tutor.id === "t1"; })[0];
ok(!!m1, "t1 matches the weak SLOs");
ok(m1 && m1.matched.some(function (w) { return w.sloId === weakA && w.pct === 20; }), "t1 matched entry carries {sloId,title,pct}");
ok(m1 && m1.matched.some(function (w) { return w.sloId === weakB; }), "t1 matched includes weakB");
ok(matches.every(function (m) {
  return m.tutor && Array.isArray(m.matched) && m.matched.length > 0;
}), "tutorsForWeakSlos shape [{tutor, matched:[...]}]");

S.remedialPlans = []; S.attempts = [];
ok(weakSloSummary().length === 0, "no weak data -> empty summary");
ok(tutorsForWeakSlos().length === 0, "no weak data -> no tutor matches");
S.remedialPlans = origRemedial; S.attempts = origAttempts; // clean up

/* ---------- (f) addReview validation ---------- */

resetTutoring();
const t1 = getTutor("t1");
const revCount0 = tutorReviews(t1).length;
ok(throws(function () { addReview("nope", { stars: 5, text: "x" }); }), "addReview rejects unknown tutor");
ok(throws(function () { addReview("t1", { stars: 0, text: "bad" }); }), "addReview rejects stars 0");
ok(throws(function () { addReview("t1", { stars: 6, text: "bad" }); }), "addReview rejects stars 6");
ok(throws(function () { addReview("t1", { stars: "abc", text: "bad" }); }), "addReview rejects non-numeric stars");
ok(throws(function () { addReview("t1", { stars: 5, text: "" }); }), "addReview rejects empty text");
ok(throws(function () { addReview("t1", { stars: 5, text: "   " }); }), "addReview rejects whitespace text");
const rev = addReview("t1", { name: "Tester", stars: 5, text: "Great trial lesson!" });
ok(rev && rev.name === "Tester" && rev.stars === 5, "addReview stores name+stars+text");
ok(tutorReviews(t1).length === revCount0 + 1, "review appears in tutorReviews");
ok(tutorReviews(t1).some(function (r) { return r.text === "Great trial lesson!"; }), "new review text present");
ok(typeof tutorAvgRating(t1) === "number" && tutorAvgRating(t1) > 0, "tutorAvgRating recomputes");
delete S.tutoring.reviews["t1"]; // clean up local review
ok(tutorReviews(t1).length === revCount0, "cleanup restores seeded-only reviews");

/* ---------- (g) messaging: thread + auto-reply ---------- */

resetTutoring();
const th0 = threadFor("t2");
ok(Array.isArray(th0) && th0.length === 1 && th0[0].from === "tutor", "threadFor auto-creates tutor welcome");
const th1 = sendMessage("t2", "When can we book a slot?");
ok(th1.length === 3, "sendMessage appends parent msg + auto-reply");
ok(th1[1].from === "parent" && th1[1].text === "When can we book a slot?", "parent message stored verbatim");
ok(th1[2].from === "tutor" && /book/i.test(th1[2].text), "booking question gets scheduling auto-reply");
const th2 = sendMessage("t2", "My son is weak in his lessons");
ok(/lesson/i.test(th2[th2.length - 1].text), "lesson question gets lesson auto-reply");
const th3 = sendMessage("t2", "Hello!");
ok(th3[th3.length - 1].from === "tutor", "generic message gets default auto-reply");
ok(throws(function () { sendMessage("nope", "hi"); }), "sendMessage rejects unknown tutor");
ok(throws(function () { sendMessage("t2", "   "); }), "sendMessage rejects empty text");
delete S.tutoring.threads["t2"]; // clean up
ok(threadFor("t2").length === 1, "thread cleanup ok");

/* ---------- progress notes ---------- */

resetTutoring();
const bn = createBooking({ tutorId: "t3", slot: "Mon 3:30 PM", parentName: "P" });
ok(throws(function () { addProgressNote("nope", "note"); }), "addProgressNote rejects unknown booking");
ok(throws(function () { addProgressNote(bn.id, "  "); }), "addProgressNote rejects empty text");
const note = addProgressNote(bn.id, "Good session", ["skimming"]);
ok(note && note.bookingId === bn.id && note.text === "Good session", "addProgressNote stores note");
ok(notesForBooking(bn.id).length === 1 && notesForBooking("nope").length === 0, "notesForBooking filters by booking");
resetTutoring();

/* ---------- (h) reportTutor / requestVerification ---------- */

const rep = reportTutor("t3", "Test reason");
ok(rep && rep.tutorId === "t3" && rep.status === "open" && rep.reason === "Test reason", "reportTutor creates open report");
ok(S.tutoring.reports.indexOf(rep) >= 0, "report persisted");
ok(throws(function () { reportTutor("nope", "x"); }), "reportTutor rejects unknown tutor");
const ver = requestVerification("t3");
ok(ver && ver.tutorId === "t3" && ver.status === "pending", "requestVerification creates pending request");
ok(throws(function () { requestVerification("nope"); }), "requestVerification rejects unknown tutor");
resetTutoring(); // clean up reports + verifications

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
