// LinguaBuddy — tiny text-to-speech helper (Web Speech API).
// Free, no API key, works offline with the device's built-in voices.
// All learning modules should import speak() from here — never build a second TTS.

export function ttsAvailable() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeak() {
  if (ttsAvailable()) window.speechSynthesis.cancel();
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

function pickVoice() {
  try {
    var voices = window.speechSynthesis.getVoices() || [];
    var en = voices.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf("en") === 0; });
    var pref = en.filter(function (v) { return v.name && /female|samantha|zira|google us english/i.test(v.name); });
    return pref[0] || en[0] || null;
  } catch (e) { return null; }
}

// Speak text aloud. opts: {rate (default 0.95), lang (default "en-US"), onend, onword}
// Long text is spoken as chained sentence chunks; onend fires after the last one.
export function speak(text, opts) {
  opts = opts || {};
  if (!ttsAvailable() || !text) return false;
  try {
    // Recover from Chrome's stuck/paused synthesis state.
    try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch (e) {}
    stopSpeak();
    var chunks = chunkText(text);
    var voice = pickVoice();
    var rate = typeof opts.rate === "number" ? opts.rate : 0.95;
    var idx = 0;
    var done = false;
    var finish = function () {
      if (done) return; done = true;
      if (typeof opts.onend === "function") { try { opts.onend(); } catch (e) {} }
    };
    var next = function () {
      if (idx >= chunks.length) { finish(); return; }
      var u = new SpeechSynthesisUtterance(chunks[idx++]);
      u.lang = opts.lang || "en-US";
      u.rate = rate;
      u.pitch = typeof opts.pitch === "number" ? opts.pitch : 1;
      if (voice) u.voice = voice;
      u.onend = next;
      u.onerror = next; // skip a failed chunk instead of hanging the queue
      if (typeof opts.onword === "function" && idx === 1) {
        u.onboundary = function (e) {
          if (e.name === "word") opts.onword({ charIndex: e.charIndex });
        };
      }
      window.speechSynthesis.speak(u);
    };
    next();
    return true;
  } catch (e) {
    return false;
  }
}
