// LinguaBuddy — tests for 💭 AI Buddies (plain node, no DOM).

import assert from "node:assert/strict";
import {
  detectIntent, findErrors, craftReply, newSession, aiReply, transcriptHTML,
  detectDefine, defineWord, evalMath, timeAnswer, captureFacts, reflectiveReply
} from "../js/buddies.js";
import {
  CHARACTERS, INTENTS, TOPICS, ERROR_PATTERNS, SMALLTALK,
  QUICK_REPLIES, NEW_WORDS, DATA_VERSION_BUDDIES, QA, WORD_DEFS, DEPTH_FOLLOWUPS
} from "../data/buddies.js";

let n = 0;
function ok(cond, msg) { n++; assert.ok(cond, msg); }

// deterministic rand
function rand0() { return 0; }

ok(DATA_VERSION_BUDDIES === "2.0.0", "data versioned");
ok(QA.length >= 40, "40+ Q&A entries");
ok(Object.keys(WORD_DEFS).length >= 60, "60+ word definitions");
CHARACTERS.forEach(function (c) {
  ok(c.speech && typeof c.speech.rate === "number" && typeof c.speech.pitch === "number",
    "character " + c.id + " has speech profile");
});
ok(CHARACTERS.find(function (c) { return c.id === "bennett"; }).speech.rate < 0.9,
  "bennett speaks slower for clarity");
ok(CHARACTERS.length === 5, "5 characters");
ok(new Set(CHARACTERS.map(function (c) { return c.id; })).size === 5, "unique character ids");
CHARACTERS.forEach(function (c) {
  ok(c.opener && c.systemPrompt && c.tagline, "character " + c.id + " complete");
});
ok((QUICK_REPLIES.lingoo || []).length >= 4, "lingoo quick replies");
ok(NEW_WORDS.length >= 60, "60+ new words");

/* ---- detectIntent ---- */
ok(detectIntent("hello there").intent === "greeting", "greeting");
ok(detectIntent("Hi!").intent === "greeting", "hi with punctuation");
ok(detectIntent("which movie is good").intent === "movies", "no 'hi'-inside-word false positive");
ok(detectIntent("goodbye friend").intent === "bye", "bye");
ok(detectIntent("my name is Ali").intent === "userNameTell", "name tell intent");
ok(detectIntent("my name is Ali").name === "Ali", "name captured");
ok(detectIntent("I am Ayesha").name === "Ayesha", "i am name captured");
ok(detectIntent("I am happy").intent === "happy", "i am happy -> happy, not name");
ok(detectIntent("tell me a joke").intent === "joke", "joke");
ok(detectIntent("what are your hobbies").intent === "hobbies", "hobbies");
ok(detectIntent("xyzzy plugh qwert").intent === "smalltalk", "unknown -> smalltalk");
ok(detectIntent("let's go to hunza").intent === "topic", "topic detected");
ok(detectIntent("let's go to hunza").topic === "travel", "topic id travel");
ok(detectIntent("you are stupid").intent === "abuse", "abuse guard");
ok(detectIntent("write my essay please").intent === "essayHelp", "essay help redirect");
ok(detectIntent("yes").intent === "yes", "yes");
ok(detectIntent("yesterday was fun").intent !== "yes", "yesterday not yes");

/* ---- findErrors ---- */
let e = findErrors("I am agree with you");
ok(e.length >= 1 && e[0].fix === "I agree", "i am agree fix");
e = findErrors("he go to school");
ok(e.length >= 1 && e[0].fix === "he goes", "he go fix");
e = findErrors("this is more better");
ok(e.length >= 1 && e[0].fix === "better", "more better fix");
e = findErrors("she don't like it");
ok(e.some(function (x) { return x.fix === "she doesn't"; }), "she don't fix");
ok(findErrors("I love cricket very much").length === 0, "clean sentence, no errors");

/* ---- craftReply: name capture + reuse ---- */
let s = newSession();
let r = craftReply("lingoo", "my name is Ali", s, rand0);
ok(s.name === "Ali", "session name stored");
ok(r.text.indexOf("Ali") >= 0, "name reused in reply");
ok(r.text.indexOf("{name}") < 0 && r.text.indexOf("{topic}") < 0, "no raw placeholders");
r = craftReply("lingoo", "hello", s, rand0);
ok(r.text.indexOf("Ali") >= 0, "name persists across turns");

/* ---- craftReply: never repeats in a session ---- */
s = newSession();
const seen = [];
for (let i = 0; i < 3; i++) seen.push(craftReply("lingoo", "hello", s, rand0).text);
ok(new Set(seen).size === 3, "3 greeting replies all distinct");

/* ---- craftReply: corrections ---- */
s = newSession();
r = craftReply("lingoo", "I am agree with you", s, rand0);
ok(r.corrections.length >= 1, "correction found");
ok(r.corrections[0].fix === "I agree", "correction fix right");
ok(r.text.indexOf("I agree") >= 0, "correction shown in reply");

/* ---- Pip recasts only ---- */
s = newSession();
r = craftReply("pip", "he go to school", s, rand0);
ok(r.corrections.length >= 1 && r.corrections[0].fix === "he goes", "pip finds error");
ok(!/wrong|mistake|incorrect/i.test(r.text), "pip never says wrong/mistake/incorrect");
ok(r.text.indexOf("he goes") >= 0, "pip recasts correctly");

/* ---- fallback never empty ---- */
s = newSession();
r = craftReply("maya", "blorptastic zibble", s, rand0);
ok(r.intent === "smalltalk", "fallback intent");
ok(r.text && r.text.length > 5, "fallback never empty");

/* ---- topic reply ---- */
s = newSession();
r = craftReply("zara", "let's go to hunza", s, rand0);
ok(r.intent === "topic:travel", "topic intent id");
ok(s.topicsMentioned.indexOf("travel") >= 0, "topic tracked");

/* ---- abuse deflect ---- */
s = newSession();
r = craftReply("lingoo", "you are stupid", s, rand0);
ok(r.intent === "abuse", "abuse intent");
ok(/friendly|kind|positive/i.test(r.text), "gentle deflect");

/* ---- new words tracked ---- */
s = newSession();
r = craftReply("lingoo", "hello", s, rand0);
ok(Array.isArray(r.newWords), "newWords array");

/* ---- aiReply: no key → null (caller falls back to local engine) ---- */
const aiRes = await aiReply("lingoo", []);
ok(aiRes === null, "aiReply null without key");

/* ---- transcript ---- */
const ch = CHARACTERS[0];
const html = transcriptHTML(ch, [
  { who: "user", text: "hello <b>bold</b>" },
  { who: "buddy", text: "Hi friend!" }
], { date: "4 Oct 2026", userMsgs: 1, corrections: 0, newWords: [{ word: "brilliant", meaning: "very smart" }] });
ok(html.indexOf("Lingoo") >= 0, "transcript has buddy name");
ok(html.indexOf("&lt;b&gt;") >= 0, "transcript escapes HTML");
ok(html.indexOf("brilliant") >= 0, "transcript lists new words");

/* ---- v2: Q&A knowledge base ---- */
ok(detectIntent("what is photosynthesis").intent === "qa", "qa: photosynthesis");
ok(detectIntent("what is photosynthesis").qa.id === "photosynthesis", "qa entry id");
ok(detectIntent("who made you").intent === "qa", "qa: creator");
ok(detectIntent("what is the capital of pakistan").intent === "qa", "qa: capital");
ok(detectIntent("what is ai").intent === "qa", "qa beats broad technology topic");
s = newSession();
r = craftReply("lingoo", "what is photosynthesis", s, rand0);
ok(r.intent === "qa:photosynthesis", "qa intent id in reply");
ok(/plants|sunlight/i.test(r.text), "qa answer content");
ok(r.text.indexOf("{name}") < 0, "qa reply has no raw placeholders");

/* ---- v2: definitions ---- */
ok(detectDefine("what does although mean") === "although", "define pattern 1");
ok(detectDefine("meaning of courage") === "courage", "define pattern 2");
ok(detectIntent("define gravity").intent === "qa", "qa wins over define for known entries");
ok(detectIntent("what does although mean").intent === "define", "define intent");
ok(detectIntent("what does although mean").word === "although", "define word captured");
ok(defineWord("although").meaning.indexOf("even though") >= 0, "WORD_DEFS lookup");
ok(defineWord("brilliant").meaning.indexOf("smart") >= 0, "NEW_WORDS lookup first");
ok(defineWord("xyzzyplugh") === null, "unknown word -> null");
s = newSession();
r = craftReply("zara", "what does although mean", s, rand0);
ok(/even though/i.test(r.text), "define answer in reply");
ok(r.newWords.some(function (w) { return w.word === "although"; }), "defined word tracked as new word");
ok(r.corrections.length === 0, "definition is not a correction");
s = newSession();
r = craftReply("lingoo", "what does xyzzyplugh mean", s, rand0);
ok(/not sure|don't know/i.test(r.text), "unknown word -> honest reply");

/* ---- v2: maths ---- */
let mm = evalMath("12 + 8");
ok(mm && mm.value === "20", "12 + 8 = 20");
mm = evalMath("what is 15*3?");
ok(mm && mm.value === "45", "15*3 = 45");
mm = evalMath("100 divided by 4");
ok(mm && mm.value === "25", "100 divided by 4 = 25");
mm = evalMath("10 / 0");
ok(mm === null, "division by zero -> null");
ok(evalMath("hello world") === null, "no math in plain text");
ok(evalMath("call me at 5") === null, "lone number is not maths");
ok(detectIntent("what is 12 + 8").intent === "math", "math intent");
s = newSession();
r = craftReply("maya", "what is 7 x 6", s, rand0);
ok(r.text.indexOf("42") >= 0, "math answer in reply");

/* ---- v2: time ---- */
ok(detectIntent("what time is it").intent === "time", "time intent");
ok(detectIntent("what day is it").intent === "time", "day intent");
const ta = timeAnswer(new Date(2026, 9, 15, 15, 45));
ok(/3:45 PM/.test(ta) && /Thursday/.test(ta), "timeAnswer formats date: " + ta);

/* ---- v2: fact memory ---- */
s = newSession();
captureFacts("I love cricket", s);
ok(s.facts.likes.indexOf("cricket") >= 0, "like captured");
captureFacts("I live in Lahore", s);
ok(s.facts.city === "Lahore", "city captured");
captureFacts("my favourite food is biryani", s);
ok(s.facts["fav:food"] === "biryani", "favourite captured");

/* ---- v2: reflective fallback ---- */
s = newSession();
const rr = reflectiveReply("I went to the bazaar yesterday", s, rand0);
ok(/bazaar/.test(rr), "reflective reply echoes keyword: " + rr);
ok(rr.indexOf("{kw}") < 0, "no raw placeholder in reflective reply");
s = newSession();
r = craftReply("maya", "blorptastic zibble", s, rand0);
ok(r.intent === "smalltalk", "fallback intent still smalltalk");

/* ---- v2: topic depth ---- */
s = newSession();
const r1 = craftReply("lingoo", "let's go to hunza", s, rand0);
const r2 = craftReply("lingoo", "hunza is beautiful", s, rand0);
ok(r1.intent === "topic:travel" && r2.intent === "topic:travel", "topic intents");
ok(r1.text !== r2.text, "second turn on same topic goes deeper, not repeats");
ok(DEPTH_FOLLOWUPS.travel.some(function (q) { return r2.text.indexOf(q) >= 0; }),
  "depth follow-up used on repeat topic");

console.log(n + " passed, 0 failed");
