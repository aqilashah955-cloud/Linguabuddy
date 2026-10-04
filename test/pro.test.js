// LinguaBuddy — Professionals unit tests (run with: node test/pro.test.js)
// Covers: email tone check, CV builder (escaping), quiz scoring, interview
// data integrity, role-play graph termination, business vocab data.
import {
  toneIssues, formalizeScore, starStr, cvHTML,
  interviewGroups, pickInterviewQuestions, makeVocabItem,
  graphTerminates, rpFeedback, setProGo, showPro
} from "../js/pro.js";
import {
  EMAIL_SCENARIOS, INTERVIEW_QS, MEETING_PHRASES, WORKPLACE_SCENARIOS,
  BUSINESS_VOCAB, CV_SECTIONS, TIPS, DATA_VERSION_PRO
} from "../data/professional.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }

/* ---------- data integrity ---------- */
section("data integrity");
ok(DATA_VERSION_PRO === "1.0.0", "data versioned 1.0.0");
ok(EMAIL_SCENARIOS.length === 8, "8 email scenarios");
ok(new Set(EMAIL_SCENARIOS.map(function (s) { return s.id; })).size === 8, "email scenario ids unique");
EMAIL_SCENARIOS.forEach(function (s) {
  ok(!!(s.template && s.template.indexOf("[") >= 0), "scenario '" + s.id + "' template has [bracket] blanks");
  ok(Array.isArray(s.toneTips) && s.toneTips.length >= 3, "scenario '" + s.id + "' has 3+ tone tips");
  ok(Array.isArray(s.formalWords) && s.formalWords.length >= 1, "scenario '" + s.id + "' has formal-word pairs");
});
ok(INTERVIEW_QS.length === 20, "20 interview questions");
ok(new Set(INTERVIEW_QS.map(function (q) { return q.q; })).size === 20, "interview questions unique");
INTERVIEW_QS.forEach(function (q, i) {
  ok(!!(q.starTip && q.starTip.length > 20), "interview q" + i + " has a STAR tip");
  ok(Array.isArray(q.keywords) && q.keywords.length >= 2, "interview q" + i + " has keywords");
  ok(!!q.group, "interview q" + i + " grouped");
});
const phraseCount = MEETING_PHRASES.reduce(function (n, g) { return n + g.phrases.length; }, 0);
ok(phraseCount === 30, "30 meeting phrases (got " + phraseCount + ")");
ok(BUSINESS_VOCAB.length === 40, "40 business vocab pairs");
ok(BUSINESS_VOCAB.every(function (x) { return x.casual && x.formal && x.example; }),
  "every vocab pair has casual/formal/example");
ok(new Set(BUSINESS_VOCAB.map(function (x) { return x.casual; })).size === 40, "casual words unique");
ok(CV_SECTIONS.length >= 4, "CV has 4+ sections");
ok(TIPS.length === 8, "8 career tips");

/* ---------- tone check ---------- */
section("toneIssues");
var bad = toneIssues("Subject: hi\n\nhey guys gonna send the stuff asap lol\nthx");
ok(bad.some(function (x) { return x.found === "gonna"; }), "flags 'gonna'");
ok(bad.some(function (x) { return x.found === "asap"; }), "flags 'asap'");
ok(bad.some(function (x) { return x.found === "guys"; }), "flags 'guys'");
ok(bad.some(function (x) { return x.found === "lol"; }), "flags 'lol'");
ok(bad.some(function (x) { return x.found === "thx"; }), "flags 'thx'");
ok(bad.some(function (x) { return x.found === "greeting"; }), "flags missing greeting");
ok(bad.some(function (x) { return x.found === "sign-off"; }), "flags missing sign-off");
var good = toneIssues("Subject: Leave request\n\nDear Ms. Ahmed,\n\nI would like to request leave on Monday.\n\nKind regards,\nAli");
ok(good.filter(function (x) { return x.found === "greeting" || x.found === "sign-off" || x.found === "subject"; }).length === 0,
  "clean email has no structure issues");
var noSubj = toneIssues("Dear Sir,\n\nHello there.\n\nKind regards,\nAli");
ok(noSubj.some(function (x) { return x.found === "subject"; }), "flags missing subject line");
var longSent = toneIssues("Subject: x\n\nDear Sir,\n\n" +
  "I am writing this extremely long sentence which just keeps going and going and going without any pause whatsoever because I do not know where to stop it at all really.\n\nKind regards,\nAli");
ok(longSent.some(function (x) { return x.found === "long sentence"; }), "flags overly long sentence");
var empty = toneIssues("");
ok(Array.isArray(empty), "empty text returns array (no crash)");

/* ---------- cvHTML ---------- */
section("cvHTML");
var cv = cvHTML({ fullName: "Amina Khan", jobTitle: "Sales Assistant", phone: "0300 1",
  email: "a@b.com", city: "Lahore", summary: "Hardworking graduate.", skills: "MS Office, English" });
ok(cv.indexOf("Amina Khan") >= 0, "CV contains the name");
ok(cv.indexOf("Sales Assistant") >= 0, "CV contains the job title");
var xss = cvHTML({ fullName: "<script>alert(1)</script>", summary: "<b>hi</b>" });
ok(xss.indexOf("<script>") < 0, "CV escapes HTML in name");
ok(xss.indexOf("&lt;script&gt;") >= 0, "CV escapes script tags");
ok(xss.indexOf("<b>hi</b>") < 0, "CV escapes HTML in summary");

/* ---------- scoring helpers ---------- */
section("scoring helpers");
var r = formalizeScore([{ ok: true }, { ok: true }, { ok: false }, { ok: true }]);
ok(r.score === 3 && r.total === 4 && r.pct === 75, "formalizeScore 3/4 = 75%");
ok(formalizeScore([]).pct === 0, "empty answers → 0% (no crash)");
ok(starStr(3) === "★★★☆☆", "starStr(3) renders 3/5");
ok(starStr(0) === "☆☆☆☆☆", "starStr(0) all empty");
ok(starStr(9) === "★★★★★", "starStr clamps at max");

/* ---------- interview pickers ---------- */
section("interview pickers");
ok(interviewGroups().length >= 5, "5+ interview groups");
var mock = pickInterviewQuestions(5, null, function () { return 0.5; });
ok(mock.length === 5, "mock interview picks 5");
ok(new Set(mock.map(function (q) { return q.q; })).size === 5, "mock questions unique");
var team = pickInterviewQuestions(99, "Teamwork", function () { return 0.3; });
ok(team.length > 0 && team.every(function (q) { return q.group === "Teamwork"; }),
  "group filter returns only that group");

/* ---------- vocab quiz items ---------- */
section("makeVocabItem");
for (var t = 0; t < 20; t++) {
  var it = makeVocabItem(Math.random);
  var goodItem = it.options.length === 4 &&
    it.options.indexOf(it.answer) >= 0 &&
    new Set(it.options).size === 4;
  if (!goodItem) break;
}
ok(good, "20 random items: 4 unique options incl. answer");

/* ---------- role-play graphs terminate ---------- */
section("role-play graphs");
ok(WORKPLACE_SCENARIOS.length === 6, "6 workplace scenarios");
WORKPLACE_SCENARIOS.forEach(function (scn) {
  var g = graphTerminates(scn);
  ok(g.ok, "scenario '" + scn.id + "' terminates cleanly" +
    (g.ok ? "" : " — " + g.problems.join("; ")));
});

/* ---------- rpFeedback ---------- */
section("rpFeedback");
var fb = rpFeedback(["Thank you for calling.", "I apologise for the delay, we will deliver on Friday.", "Can we agree on a discount?"]);
ok(fb.strengths.length >= 1, "feedback finds strengths");
ok(fb.strengths.some(function (s) { return /polit/i.test(s); }), "feedback notices polite language");
var fb2 = rpFeedback([]);
ok(fb2.strengths.length >= 1, "empty lines still get encouragement (no crash)");

/* ---------- module shape ---------- */
section("module shape");
ok(typeof setProGo === "function", "setProGo exported (router parity)");
ok(typeof showPro === "function", "showPro exported");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
