// LinguaBuddy — tests for 💭 AI Buddies (plain node, no DOM).

import assert from "node:assert/strict";
import {
  detectIntent, findErrors, craftReply, newSession, aiReply, transcriptHTML
} from "../js/buddies.js";
import {
  CHARACTERS, INTENTS, TOPICS, ERROR_PATTERNS, SMALLTALK,
  QUICK_REPLIES, NEW_WORDS, DATA_VERSION_BUDDIES
} from "../data/buddies.js";

let n = 0;
function ok(cond, msg) { n++; assert.ok(cond, msg); }

// deterministic rand
function rand0() { return 0; }

ok(DATA_VERSION_BUDDIES === "1.0.0", "data versioned");
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

console.log(n + " passed, 0 failed");
