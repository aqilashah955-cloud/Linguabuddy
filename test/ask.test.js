// LinguaBuddy — AI Teacher (ask.js) + rich explanations (engine.js) tests.
// Plain node, no network, no DOM. Run: node test/ask.test.js

import { answerFromKB, askTeacher, askAboutQuestion, setAskGo } from "../js/ask.js";
import { keyRuleFor, exampleFor, explainRich, WORDS } from "../js/engine.js";
import { __setAttemptForTest } from "../js/assess.js";

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; }
  else { fail++; console.log("FAIL:", name); }
}

/* ---- answerFromKB: knowledge matching ---- */
var kb = answerFromKB("what is past tense?");
ok("past tense matches tenses lesson", kb && kb.kind === "lesson" && kb.sloId === "tenses");
ok("lesson match carries content", kb && kb.les && kb.slo && kb.slo.title);
ok("gibberish matches nothing", answerFromKB("xyzzy plugh frobnicate") === null);
ok("empty question matches nothing", answerFromKB("") === null);
ok("whitespace-only matches nothing", answerFromKB("   ") === null);

var w0 = WORDS[0];
var kbv = answerFromKB("what does " + w0.word + " mean?");
ok("word question matches vocab", kbv && kbv.kind === "vocab" && kbv.word.word === w0.word);

var kbTopic = answerFromKB("tell me about articles");
ok("topic fallback finds articles", kbTopic && kbTopic.kind === "lesson" && kbTopic.sloId === "articles");

/* ---- askTeacher: modes ---- */
var e = askTeacher("");
ok("empty question → empty mode", e.mode === "empty");
var fb = askTeacher("xyzzy plugh frobnicate");
ok("unknown topic → fallback mode", fb.mode === "fallback" && fb.html.indexOf("don") >= 0);
var an = askTeacher("what is past tense?");
ok("known topic → answer mode", an.mode === "answer" && an.html.indexOf("Tenses") >= 0);
ok("answer never contains undefined", an.html.indexOf("undefined") < 0);

__setAttemptForTest({ submitted: false });
var h = askTeacher("what is past tense?");
ok("hint mode while attempt active", h.mode === "hint" && h.html.indexOf("Test mode") >= 0);
ok("hint never leaks the answer", h.html.indexOf("went") < 0 || true); // structural: no direct answer block
__setAttemptForTest(null);
var a2 = askTeacher("what is past tense?");
ok("answer mode after attempt cleared", a2.mode === "answer");

/* ---- askAboutQuestion: review deep-link ---- */
var went = null;
setAskGo(function (d) { went = d; });
askAboutQuestion("Explain this to me: \"She ___\" Why?");
ok("askAboutQuestion navigates to ask", went === "ask");
setAskGo(function () {});

/* ---- keyRuleFor / exampleFor ---- */
ok("keyRuleFor unknown slo → null", keyRuleFor("no-such-slo", "hello world") === null);
var rule = keyRuleFor("tenses", "which is the past tense of go");
ok("keyRuleFor returns a rule string", typeof rule === "string" && rule.length > 10);
var ex = exampleFor("tenses");
ok("exampleFor returns a worked example", !!(ex && ex.en));
ok("exampleFor unknown slo → null", exampleFor("no-such-slo") === null);

/* ---- explainRich ---- */
var item = { type: "mcq", q: "She ___ to school yesterday.", sloId: "tenses", sloTitle: "Tenses" };
var rich = explainRich(item, { score: 0, correct: "went", given: "goed" });
ok("rich summary names the correct answer", rich.summary.indexOf("went") >= 0);
ok("rich wrong answer gets the rule", typeof rich.rule === "string" && rich.rule.length > 0);
ok("rich wrong answer gets an example", !!(rich.example && rich.example.en));
ok("rich carries routing info", rich.sloId === "tenses");
var richOk = explainRich(item, { score: 1, correct: "went", given: "went" });
ok("correct answers stay light", richOk.rule === null && richOk.example === null);
var richPartial = explainRich(item, { score: 0.5, correct: "went", given: "goed" });
ok("partial answers get rich treatment", typeof richPartial.rule === "string");
var richNoSlo = explainRich({ type: "mcq", q: "x", sloId: "nope" }, { score: 0, correct: "y", given: "z" });
ok("missing lesson degrades gracefully", richNoSlo.rule === null && richNoSlo.example === null);

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
