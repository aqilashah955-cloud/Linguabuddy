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

/* English voices available on this device — female only, for the voice picker. */
export function listVoices() {
  if (!ttsAvailable()) return [];
  try {
    return femaleVoiceObjs(window.speechSynthesis.getVoices() || [])
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
   chunk instead of one giant utterance. maxLen keeps slow speech (fewer
   chars per second) safely under the cutoff too. Pure — exported for tests. */
export function chunkText(text, maxLen) {
  maxLen = maxLen || 160;
  var bits = String(text || "").split(/([.!?…]+["']?\s+)/);
  var out = [], cur = "";
  for (var i = 0; i < bits.length; i += 2) {
    var piece = bits[i] + (bits[i + 1] || "");
    if (cur && cur.length + piece.length > maxLen) { out.push(cur); cur = ""; }
    cur += piece;
  }
  if (cur) out.push(cur);
  return out.length ? out : [String(text || "")];
}

/* ---- female voices ----
   The Web Speech API exposes no gender field, so we match well-known female
   voice names. LinguaBuddy speakers are female by design. */
var FEMALE_HINTS = [
  "female",
  "samantha", "zira", "karen", "moira", "tessa", "veena", "fiona", "serena",
  "allison", "ava", "joana", "susan", "kate", "anna", "emma", "olivia",
  "sophia", "amelia", "aria", "ellen", "martha", "jane", "lily", "sarah",
  "lisa", "mary", "nora", "zoe", "kathy", "agnes", "princess", "victoria",
  "google us english", "google uk english female"
];

/* Heuristic gender check. Pure — exported for tests. */
export function isFemaleVoice(v) {
  var n = String((v && v.name) || "").toLowerCase();
  if (!n) return false;
  for (var i = 0; i < FEMALE_HINTS.length; i++) {
    if (n.indexOf(FEMALE_HINTS[i]) >= 0) return true;
  }
  return false;
}

function englishVoices(voices) {
  return (voices || []).filter(function (v) {
    return v.lang && v.lang.toLowerCase().indexOf("en") === 0;
  });
}

/* Female English voices, best-known quality first. */
function femaleVoiceObjs(voices) {
  var fem = englishVoices(voices).filter(isFemaleVoice);
  var good = /samantha|zira|google us english|google uk english female/i;
  fem.sort(function (a, b) {
    return (good.test(b.name) ? 1 : 0) - (good.test(a.name) ? 1 : 0);
  });
  return fem;
}

function pickVoice(uri, buddyId) {
  try {
    var voices = window.speechSynthesis.getVoices() || [];
    if (uri) {
      var hit = voices.filter(function (v) { return v.voiceURI === uri; })[0];
      // A saved male voice (e.g. picked before this rule) falls back to auto.
      if (hit && isFemaleVoice(hit)) return hit;
    }
    // Auto: every speaker is female — a different voice per buddy for character.
    var fem = femaleVoiceObjs(voices);
    if (fem.length) {
      var h = 0, s = String(buddyId || "lingoo");
      for (var i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
      return fem[h % fem.length];
    }
    var en = englishVoices(voices);
    return en[0] || null; // last resort: never stay silent
  } catch (e) { return null; }
}

/* Run cb once the device's voice list is loaded (or after 2s). Chains with any
   existing onvoiceschanged handler instead of replacing it. */
function withVoices(cb) {
  try {
    var ss = window.speechSynthesis;
    if (ss.getVoices().length) { cb(); return; }
    var prev = ss.onvoiceschanged, done = false;
    var go = function () {
      if (done) return; done = true;
      try { ss.onvoiceschanged = prev || null; } catch (e) {}
      cb();
    };
    ss.onvoiceschanged = function () { try { if (prev) prev(); } catch (e) {} go(); };
    setTimeout(go, 2000);
  } catch (e) { cb(); }
}

/* Snapshot of the speech engine for self-diagnosis. */
export function voiceDiag() {
  try {
    var ss = window.speechSynthesis;
    return {
      state: ss.speaking ? "speaking" : (ss.pending ? "queued" : "idle"),
      voices: ss.getVoices().length
    };
  } catch (e) { return { state: "unknown", voices: 0 }; }
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
    var rate = typeof opts.rate === "number" ? opts.rate : 0.95;
    // Slow speech = fewer chars per second, so chunks must be shorter to stay
    // under Chrome's ~15s silent utterance cutoff.
    var chunks = chunkText(text, rate < 0.8 ? 100 : 160);
    var voice = pickVoice(opts.voiceURI, opts.buddyId);
    var idx = 0, done = false, my = ++speakToken, watchdog = null;
    var disarm = function () { if (watchdog) { clearTimeout(watchdog); watchdog = null; } };
    var finish = function () {
      if (done) return; done = true; disarm();
      if (typeof opts.onend === "function") { try { opts.onend(); } catch (e) {} }
    };
    var next = function () {
      if (my !== speakToken) return; // superseded by a newer speak()/stop — stay silent
      if (idx >= chunks.length) { finish(); return; }
      // Watchdog: if the engine wedges (no end/error), report it and force-finish
      // so the UI never sticks on "Speaking…" and the conversation can continue.
      disarm();
      (function (len) {
        watchdog = setTimeout(function () {
          if (my !== speakToken || done) return;
          try { window.speechSynthesis.cancel(); } catch (e) {}
          if (typeof opts.onwedged === "function") {
            try { opts.onwedged(voiceDiag()); } catch (e) {}
          }
          finish();
        }, Math.max(7000, len * 100 + 5000));
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
    // Voices are awaited first: speaking before the voice list loads is another
    // classic way an utterance gets stuck forever.
    setTimeout(function () {
      if (my !== speakToken) return;
      withVoices(function () { if (my === speakToken) next(); });
    }, 80);
    return true;
  } catch (e) {
    return false;
  }
}
