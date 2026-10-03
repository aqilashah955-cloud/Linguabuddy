// LinguaBuddy — tiny text-to-speech helper (Web Speech API).
// Free, no API key, works offline with the device's built-in voices.
// All learning modules should import speak() from here — never build a second TTS.

export function ttsAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeak() {
  if (ttsAvailable()) window.speechSynthesis.cancel();
}

// Speak text aloud. opts: {rate (default 0.95), lang (default "en-US"), onend, onword}
// onword receives {charIndex} as the voice reads (when the voice supports boundary events).
export function speak(text, opts) {
  opts = opts || {};
  if (!ttsAvailable() || !text) return false;
  stopSpeak();
  try {
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = opts.lang || "en-US";
    u.rate = typeof opts.rate === "number" ? opts.rate : 0.95;
    u.pitch = typeof opts.pitch === "number" ? opts.pitch : 1;
    var voices = window.speechSynthesis.getVoices();
    var en = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf("en") === 0; });
    var pref = en.filter(function (v) { return v.name && /female|samantha|zira|google us english/i.test(v.name); });
    if ((pref[0] || en[0])) u.voice = pref[0] || en[0];
    if (typeof opts.onend === "function") u.onend = opts.onend;
    if (typeof opts.onerror === "function") u.onerror = opts.onerror;
    if (typeof opts.onword === "function") {
      u.onboundary = function (e) {
        if (e.name === "word") opts.onword({ charIndex: e.charIndex });
      };
    }
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) {
    return false;
  }
}

export function speakSlow(text, opts) {
  return speak(text, Object.assign({}, opts, { rate: 0.7 }));
}

// Warm up the voice list (some browsers load voices asynchronously).
export function warmVoices() {
  if (!ttsAvailable()) return;
  try {
    window.speechSynthesis.getVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
      };
    }
  } catch (e) { /* ignore */ }
}
