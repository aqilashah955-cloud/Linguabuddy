// LinguaBuddy — 🏆 Certificate Center tests (plain node, no DOM, no network).

import { S } from "../js/store.js";
import { SLOS } from "../data/slos.js";
import {
  CERT_TYPES, certById, earnedCertIds,
  checkCertificates, claimParentCert, lockedCerts, certPrintHTML
} from "../js/certs.js";

let passed = 0, failed = 0;
function ok(cond, name) {
  if (cond) { passed++; }
  else { failed++; console.log("FAIL:", name); }
}

function reset() {
  S.certs = [];
  S.profile.badges = [];
  S.profile.name = "Test Kid";
  S.profile.role = "student";
  S.masteryEv = {};
  S.teacher = { classes: [] };
  S.parentCertClaimed = false;
}

function masteredEv() { return [{ pct: 85 }, { pct: 90 }, { pct: 88 }]; }
function fullMastery() {
  const m = {};
  SLOS.forEach(function (s) { m[s.id] = masteredEv(); });
  return m;
}

/* ---- catalogue sanity ---- */
ok(CERT_TYPES.length === 10, "10 certificate types defined");
ok(new Set(CERT_TYPES.map(function (c) { return c.id; })).size === 10, "cert ids unique");
ok(CERT_TYPES.filter(function (c) { return c.for === "student"; }).length === 8, "8 student certs");
ok(CERT_TYPES.filter(function (c) { return c.for === "teacher"; }).length === 1, "1 teacher cert");
ok(CERT_TYPES.filter(function (c) { return c.for === "parent"; }).length === 1, "1 parent cert");
ok(!!certById("course-complete"), "course completion cert exists");
ok(SLOS.length === 15, "15 SLOs in the course");

/* ---- badge -> cert mapping (pure) ---- */
let ids = earnedCertIds({ badges: ["first-lesson"] });
ok(ids.indexOf("brave-beginner") >= 0, "first-lesson badge -> Brave Beginner cert");
ok(ids.indexOf("star-7") < 0, "no 7-Day Star without the streak badge");
ok(ids.indexOf("course-complete") < 0, "no course completion from one badge");

ids = earnedCertIds({ badges: ["first-lesson", "streak-7", "reader-5", "words-100", "writing-star", "slo-master", "game-night"] });
["brave-beginner", "star-7", "reading-champ", "word-wizard", "writing-star", "slo-master", "game-champ"]
  .forEach(function (id) { ok(ids.indexOf(id) >= 0, "badge maps to cert: " + id); });

/* ---- course completion needs ALL 15 SLOs ---- */
const fourteen = fullMastery();
delete fourteen[SLOS[SLOS.length - 1].id];
ok(earnedCertIds({ badges: [], masteryEv: fourteen }).indexOf("course-complete") < 0,
  "14/15 SLOs mastered -> no course completion");
ok(earnedCertIds({ badges: [], masteryEv: fullMastery() }).indexOf("course-complete") >= 0,
  "15/15 SLOs mastered -> course completion awarded");

/* ---- teacher cert ---- */
ok(earnedCertIds({ teacherClasses: [{ id: "c1", students: [{}, {}] }] }).indexOf("educator") < 0,
  "class with 2 students -> no educator cert");
ok(earnedCertIds({ teacherClasses: [{ id: "c1", students: [{}, {}, {}] }] }).indexOf("educator") >= 0,
  "class with 3 students -> educator cert");

/* ---- parent cert (honor-based claim) ---- */
ok(earnedCertIds({}).indexOf("super-supporter") < 0, "no parent cert before claim");
ok(earnedCertIds({ parentClaimed: true }).indexOf("super-supporter") >= 0, "parent cert after claim");

/* ---- checkCertificates: idempotent, stores records ---- */
reset();
S.profile.badges = ["first-lesson", "streak-7"];
let fresh = checkCertificates();
ok(fresh.length === 2, "two new certs awarded");
ok(S.certs.length === 2, "certs stored in S.certs");
ok(S.certs[0].name === "Test Kid", "learner name stored on the record");
ok(typeof S.certs[0].awardedAt === "string", "award date stored");
fresh = checkCertificates();
ok(fresh.length === 0, "second run awards nothing (idempotent)");
ok(S.certs.length === 2, "no duplicates after second run");

/* ---- claimParentCert ---- */
reset();
fresh = claimParentCert();
ok(fresh.length === 1 && fresh[0].id === "super-supporter", "parent claim awards Super Supporter");
ok(S.parentCertClaimed === true, "claim flag persisted");
fresh = claimParentCert();
ok(fresh.length === 0, "parent claim is idempotent");

/* ---- locked list excludes earned ---- */
reset();
S.profile.badges = ["first-lesson"];
checkCertificates();
const locked = lockedCerts("student").map(function (c) { return c.id; });
ok(locked.indexOf("brave-beginner") < 0, "earned cert not in locked list");
ok(locked.indexOf("star-7") >= 0, "unearned cert stays locked");
ok(lockedCerts("teacher").every(function (c) { return c.for === "teacher"; }),
  "teachers only see teacher certs as locked");

/* ---- printable certificate contains the learner's name ---- */
reset();
S.profile.name = "Amina Khan";
S.profile.badges = ["reader-5"];
checkCertificates();
const rec = S.certs[0];
const html = certPrintHTML(rec);
ok(html.indexOf("Amina Khan") >= 0, "certificate html contains the learner's name");
ok(html.indexOf("Reading Champion") >= 0 || html.toLowerCase().indexOf("reading") >= 0,
  "certificate html mentions the achievement");

console.log(passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
