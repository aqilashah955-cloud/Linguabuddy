// LinguaBuddy — tiny text-to-speech helper (Web Speech API).
// Free, no API key, works offline with the device's built-in voices.
// All learning modules should import speak() from here — never build a second TTS.

export function ttsAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeak() {
  speakToken++;
  if (!ttsAvailable()) return;
  try {
    var ss = window.speechSynthesis;
    // Cancel ONLY when the engine is actually busy. cancel() on an empty
    // queue can wedge Chrome's engine so the next speak() hangs forever
    // (utterance stuck: no audio, no onend — the "stuck Speaking…" bug).
    if (ss.speaking || ss.pending || ss.paused) ss.cancel();
  } catch (e) {}
}

/* English voices available on this device — for the voice picker. */
export function listVoices() {
  if (!ttsAvailable()) return [];
  try {
    return (window.speechSynthesis.getVoices() || [])
      .filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf("en") === 0; })
      .map(function (v) { return { name: v.name, lang: v.lang, uri: v.voiceURI }; });
  } catch (e) { return []; }
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

/* Split text into sentence-sized chunks. Chrome silently stops a single
   utterance after ~15 seconds, so long buddy replies are queued chunk by
   chunk instead of one giant utterance. Pure — exported for tests. */
export function chunkText(text) {
  var bits = String(text || "").split(/([.!?…]+["']?\s+)/);
  var out = [], cur = "";
  for (var i = 0; i < bits.length; i += 2) {
    var piece = bits[i] + (bits[i + 1] || "");
    if (cur && cur.length + piece.length > 160) { out.push(cur); cur = ""; }
    cur += piece;
  }
  if (cur) out.push(cur);
  return out.length ? out : [String(text || "")];
}

function pickVoice(uri) {
  try {
    var voices = window.speechSynthesis.getVoices() || [];
    if (uri) {
      var hit = voices.filter(function (v) { return v.voiceURI === uri; })[0];
      if (hit) return hit;
    }
    var en = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf("en") === 0; });
    var pref = en.filter(function (v) { return v.name && /female|samantha|zira|google us english/i.test(v.name); });
    return pref[0] || en[0] || null;
  } catch (e) { return null; }
}

// Token guards the delayed start: a newer speak()/stopSpeak() cancels a pending one.
var speakToken = 0;

// Speak text aloud. opts: {rate (default 0.95), lang (default "en-US"), voiceURI, onend, onword}
// Long text is spoken as chained sentence chunks; onend fires after the last one.
export function speak(text, opts) {
  opts = opts || {};
  if (!ttsAvailable() || !text) return false;
  try {
    // Recover from Chrome's stuck/paused synthesis state.
    try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch (e) {}
    stopSpeak();
    var chunks = chunkText(text);
    var voice = pickVoice(opts.voiceURI);
    var rate = typeof opts.rate === "number" ? opts.rate : 0.95;
    var idx = 0, done = false, my = ++speakToken, watchdog = null;
    var disarm = function () { if (watchdog) { clearTimeout(watchdog); watchdog = null; } };
    var finish = function () {
      if (done) return; done = true; disarm();
      if (typeof opts.onend === "function") { try { opts.onend(); } catch (e) {} }
    };
    var next = function () {
      if (my !== speakToken) return; // superseded by a newer speak()/stop — stay silent
      if (idx >= chunks.length) { finish(); return; }
      // Watchdog: if the engine wedges (no end/error), force-finish so the UI
      // never sticks on "Speaking…" and the conversation can continue by mic.
      disarm();
      (function (len) {
        watchdog = setTimeout(function () {
          if (my !== speakToken || done) return;
          try { window.speechSynthesis.cancel(); } catch (e) {}
          finish();
        }, Math.max(9000, len * 150 + 8000));
      })(chunks[idx].length);
      var u = new SpeechSynthesisUtterance(chunks[idx++]);
      u.lang = opts.lang || "en-US";
      u.rate = rate;
      u.pitch = typeof opts.pitch === "number" ? opts.pitch : 1;
      if (voice) u.voice = voice;
      u.onend = function () { disarm(); next(); };
      u.onerror = function () { disarm(); next(); }; // skip a failed chunk instead of hanging
      if (typeof opts.onword === "function" && idx === 1) {
        u.onboundary = function (e) {
          if (e.name === "word") opts.onword({ charIndex: e.charIndex });
        };
      }
      window.speechSynthesis.speak(u);
    };
    // Chrome quirk: speak() issued synchronously after cancel() can be silently
    // dropped, so the queue starts on the next tick (still within the gesture window).
    setTimeout(function () { if (my === speakToken) next(); }, 80);
    return true;
  } catch (e) {
    return false;
  }
}
