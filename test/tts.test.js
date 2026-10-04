// LinguaBuddy — TTS helper tests (plain node, no DOM).
import { chunkText, ttsAvailable, speak, stopSpeak, listVoices } from "../js/tts.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }

section("chunkText");
let c = chunkText("Hello world. How are you? I am fine!");
ok(c.length === 1, "short text stays one smooth chunk, got " + c.length);
ok(c.join("") === "Hello world. How are you? I am fine!", "chunk rejoins to the original text exactly");
c = chunkText("Short.");
ok(c.length === 1 && c[0] === "Short.", "short text stays one chunk");
c = chunkText("First. " + "Second. ".repeat(40));
const origLong = "First. " + "Second. ".repeat(40);
ok(c.length > 2 && c.every(function (x) { return x.length <= 175; }), "long text split into bounded chunks (" + c.length + ")");
ok(c.join("") === origLong, "long chunks rejoin losslessly");
ok(c.every(function (x) { return x.trim().length > 0; }), "no empty chunks");
c = chunkText("");
ok(Array.isArray(c) && c.length === 1, "empty text yields one empty chunk");
c = chunkText("No punctuation here at all");
ok(c.length === 1 && c[0] === "No punctuation here at all", "text without sentence marks stays whole");

section("tts guards (no DOM)");
ok(ttsAvailable() === false, "ttsAvailable false without window");
ok(speak("hello") === false, "speak returns false without window");
ok(listVoices().length === 0, "listVoices empty without window");
stopSpeak(); // must not throw
ok(true, "stopSpeak safe without window");

section("cancel only when busy (mocked engine)");
globalThis.SpeechSynthesisUtterance = function (t) { this.text = t; };
globalThis.window = {
  speechSynthesis: {
    speaking: false, pending: false, paused: false, cancelCount: 0,
    cancel: function () { this.cancelCount++; },
    speak: function () {},
    getVoices: function () { return []; },
    resume: function () {}
  }
};
ok(speak("hello world") === true, "speak accepted with mocked engine");
ok(globalThis.window.speechSynthesis.cancelCount === 0,
  "no cancel() issued when the engine is idle (avoids the Chrome wedge bug)");
globalThis.window.speechSynthesis.speaking = true;
ok(speak("hello again") === true, "speak accepted while busy");
ok(globalThis.window.speechSynthesis.cancelCount === 1,
  "cancel() issued when the engine was speaking");
globalThis.window.speechSynthesis.speaking = false;
globalThis.window.speechSynthesis.pending = true;
ok(speak("one more") === true, "speak accepted while pending");
ok(globalThis.window.speechSynthesis.cancelCount === 2,
  "cancel() issued when the engine had pending utterances");
var vs = listVoices();
ok(Array.isArray(vs) && vs.length === 0, "listVoices empty when device has no voices");
delete globalThis.window;
delete globalThis.SpeechSynthesisUtterance;
ok(ttsAvailable() === false, "guards restored after mock cleanup");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
