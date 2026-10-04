// LinguaBuddy — 💭 AI Buddies (live chatbot practice).
// Works fully offline with a smart built-in conversation engine.
// ─── LLM PLUG-IN ─── : set an API key in ⚙️ settings and aiReply() will call
// a real LLM; otherwise the local engine handles everything, free forever.
// DOM is touched only inside functions — imports cleanly in node tests.

import {
  CHARACTERS, characterById, INTENTS, TOPICS, ERROR_PATTERNS,
  SMALLTALK, QUICK_REPLIES, NEW_WORDS, ABUSE_WORDS, ABUSE_REPLIES, NAME_STOP
} from "../data/buddies.js";
import { S, save, touchStreak, recordAttempt } from "./store.js";
import { awardXP, checkBadges, toast } from "./gamify.js";
import { speak, stopSpeak, ttsAvailable } from "./tts.js";
import { startListen, speechRecCtor } from "./engage.js";
import { printHTML } from "./worksheets.js";
import { showScreen as show } from "./ui.js";
import { esc } from "./utils.js";

function $(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }

let go = null;
export function setBuddiesGo(fn) { go = fn; }

/* ================= pure engine ================= */

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s; }

function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function matchHit(pat, pad, low, raw) {
  if (pat instanceof RegExp) return pat.test(low) || pat.test(raw);
  const s = String(pat).toLowerCase();
  if (s.length <= 3) return new RegExp("\\b" + escRe(s) + "\\b").test(low);
  return pad.indexOf(s) >= 0;
}

// → { intent, name?, topic? }  (always an object)
export function detectIntent(text) {
  const raw = String(text || "");
  const low = raw.toLowerCase().trim();
  const pad = " " + low + " ";
  if (!low) return { intent: "smalltalk" };
  if (ABUSE_WORDS.some(function (w) { return pad.indexOf(w) >= 0; })) return { intent: "abuse" };
  // name capture: only when unambiguous — "my name is X ..." or the whole message is "i am X"
  const nmStart = raw.match(/^my name is\s+([a-zA-Z]{2,20})/i);
  const nmFull = raw.match(/^(?:this is|i'm|i am)\s+([a-zA-Z]{2,20})$/i);
  const nm = nmStart || nmFull;
  if (nm && !NAME_STOP.has(nm[1].toLowerCase())) return { intent: "userNameTell", name: cap(nm[1]) };
  for (const it of INTENTS) {
    if ((it.match || []).some(function (p) { return matchHit(p, pad, low, raw); })) return { intent: it.id };
  }
  for (const tp of TOPICS) {
    if (tp.keywords.some(function (k) { return pad.indexOf(String(k).toLowerCase()) >= 0; })) {
      return { intent: "topic", topic: tp.id };
    }
  }
  return { intent: "smalltalk" };
}

// → [{wrong, fix, explain}]
export function findErrors(text) {
  const low = " " + String(text || "").toLowerCase() + " ";
  const out = [];
  for (const e of ERROR_PATTERNS) {
    if (e.pattern.test(low)) {
      out.push({ wrong: e.wrong, fix: e.fix, explain: e.explain });
      if (out.length >= 4) break;
    }
  }
  return out;
}

// pick without repeating within a session (key-scoped); resets when exhausted
function pick(arr, session, key, rand) {
  const used = session.usedReplies;
  let idxs = arr.map(function (_, i) { return i; })
    .filter(function (i) { return used.indexOf(key + "::" + i) < 0; });
  if (!idxs.length) {
    for (let i = used.length - 1; i >= 0; i--) {
      if (used[i].indexOf(key + "::") === 0) used.splice(i, 1);
    }
    idxs = arr.map(function (_, i) { return i; });
  }
  const idx = idxs[Math.floor(rand() * idxs.length)];
  used.push(key + "::" + idx);
  return arr[idx];
}

function pickReply(ch, intentId, session, rand) {
  const it = INTENTS.find(function (i) { return i.id === intentId; });
  const arr = (it && it.replies[ch.id]) || (it && it.replies.lingoo) || ["Tell me more!"];
  return pick(arr, session, ch.id + ":" + intentId, rand);
}

function topicLabel(session) {
  const t = (session.topicsMentioned || [])[session.topicsMentioned.length - 1];
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "that";
}

function topicReply(ch, tp, session, rand) {
  const q = pick(tp.followups, session, "fu:" + tp.id, rand);
  const leads = {
    lingoo: ["Nice — {topic}! 🌟 ", "Ooh, {topic}! ", "Great choice, {topic}! "],
    maya: ["Yess, {topic}! 😎 ", "Ooh {topic} — love it! ", "{topic} talk! Let's gooo! "],
    zara: ["Excellent topic: {topic}. 🎓 ", "{topic} — great speaking practice! ", "Good — {topic}! "],
    pip: ["Yay {topic}! 🐣 ", "{topic}! {topic}! 🌈 ", "Ooh! {topic}! 🐥 "],
    bennett: ["Ah, {topic}. 🤵 ", "{topic} — a fine subject. ", "Indeed, {topic}. "]
  };
  return pick(leads[ch.id] || leads.lingoo, session, ch.id + ":toplead", rand) + q;
}

// Pip recasts only — never "wrong"/"mistake"/"incorrect". Others: one gentle tip.
function formatCorrection(ch, e) {
  if (ch.id === "pip") return "Oh, you mean \u201C" + e.fix + "\u201D! 🌟";
  return "💡 Tip: we say \u201C" + e.fix + "\u201D — " + e.explain;
}

const GENERIC_FOLLOWUPS = [
  "What do you think?", "Tell me more!", "Why is that?",
  "How about you — what do you like?", "What else is new?"
];

function newSession() {
  return { name: "", topicsMentioned: [], usedReplies: [], msgCount: 0 };
}
export { newSession };

// → { text, corrections[], newWords[], intent }
export function craftReply(characterId, text, session, rand) {
  rand = rand || Math.random;
  const ch = characterById(characterId);
  session = session || newSession();
  session.usedReplies = session.usedReplies || [];
  session.topicsMentioned = session.topicsMentioned || [];
  const det = detectIntent(text);
  let replyText, intentId = det.intent;
  const corrections = [];

  if (det.intent === "abuse") {
    replyText = pick(ABUSE_REPLIES, session, "abuse", rand);
  } else if (det.intent === "userNameTell" && det.name) {
    session.name = det.name;
    replyText = pickReply(ch, "userNameTell", session, rand);
  } else {
    const errs = findErrors(text).slice(0, 2);
    let base;
    if (det.intent === "topic" && det.topic) {
      const tp = TOPICS.find(function (t) { return t.id === det.topic; });
      if (session.topicsMentioned.indexOf(tp.id) < 0) session.topicsMentioned.push(tp.id);
      base = topicReply(ch, tp, session, rand);
      intentId = "topic:" + tp.id;
    } else {
      const it = INTENTS.find(function (i) { return i.id === det.intent; });
      base = it ? pickReply(ch, it.id, session, rand)
                : pick(SMALLTALK, session, "smalltalk", rand);
      if (!it) intentId = "smalltalk";
    }
    if (errs.length) {
      corrections.push.apply(corrections, errs);
      base += "\n\n" + errs.map(function (e) { return formatCorrection(ch, e); }).join("\n");
    }
    if (!/\?\s*$/.test(base) && rand() < 0.7) {
      base += " " + pick(GENERIC_FOLLOWUPS, session, "gfu", rand);
    }
    replyText = base;
  }

  replyText = replyText.split("{name}").join(session.name || "friend")
                       .split("{topic}").join(topicLabel(session));
  const newWords = NEW_WORDS.filter(function (w) {
    return new RegExp("\\b" + w.word + "\\b", "i").test(replyText);
  });
  session.msgCount = (session.msgCount || 0) + 1;
  return { text: replyText, corrections: corrections, newWords: newWords, intent: intentId };
}

/* ─── LLM PLUG-IN ───
   If the learner saved an API key (⚙️ settings), call a real LLM.
   Returns the reply text, or null when no key / any error —
   the caller must fall back to craftReply() silently.
   The key lives only in localStorage (S.settings) and is never logged. */
export async function aiReply(characterId, history) {
  const settings = (S.settings = S.settings || {});
  const key = settings.aiKey;
  if (!key) return null;
  const ch = characterById(characterId);
  try {
    const res = await fetch(settings.aiEndpoint || "https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({
        model: settings.aiModel || "gpt-4o-mini",
        messages: [{ role: "system", content: ch.systemPrompt }].concat(history || [])
      })
    });
    const data = await res.json();
    const msg = data && data.choices && data.choices[0] && data.choices[0].message;
    const text = msg && msg.content ? String(msg.content).trim() : "";
    return text || null;
  } catch (e) {
    return null;
  }
}

/* ================= transcript (pure) ================= */
export function transcriptHTML(character, messages, summary) {
  const rows = messages.map(function (m) {
    const cls = m.who === "user" ? "tp-u" : "tp-b";
    const who = m.who === "user" ? "You" : character.emoji + " " + esc(character.name);
    return '<div class="' + cls + '"><strong>' + who + ":</strong> " + esc(m.text) + "</div>";
  }).join("");
  const words = (summary.newWords || []).map(function (w) {
    return "<li><strong>" + esc(w.word) + "</strong> — " + esc(w.meaning) + "</li>";
  }).join("");
  return '<div class="ws-page"><h2>' + character.emoji + " Chat with " + esc(character.name) + "</h2>" +
    '<p class="fine">' + esc(summary.date) + " · " + summary.userMsgs + " messages from you · " +
    summary.corrections + " gentle corrections</p>" +
    '<div class="tp-transcript">' + rows + "</div>" +
    (words ? "<h3>📚 New words you met</h3><ul>" + words + "</ul>" : "") +
    '<p class="fine">LinguaBuddy 💭 AI Buddies — practice chat, not an exam.</p></div>';
}

/* ================= UI ================= */
let chat = null; // {ch, session, messages:[], ttsOn, busy}

export function showBuddies() {
  stopSpeak();
  chat = null;
  const root = $("screen-buddies");
  if (!root) return;
  root.innerHTML =
    '<div class="bd-wrap"><div class="bd-head"><h2>💭 AI Buddies</h2>' +
    '<p class="fine">Chat live with a buddy and practise real English. Works offline — no account, no cost.' +
    (speechRecCtor() ? ' 🎤 <strong>Voice chat is on</strong> — just talk, no typing needed!' : '') +
    '</p></div>' +
    '<div class="bd-grid">' + CHARACTERS.map(function (c) {
      return '<button class="bd-card" data-buddy="' + c.id + '">' +
        '<div class="bd-emoji">' + c.emoji + "</div>" +
        "<h3>" + esc(c.name) + "</h3>" +
        '<p class="fine">' + esc(c.tagline) + "</p>" +
        '<span class="bd-age">' + esc(c.ageGroup) + "</span></button>";
    }).join("") + "</div>" +
    '<div class="bd-note fine">🤖 Buddies chat with a smart built-in engine. Add your own AI key in ⚙️ settings any time for live AI replies.</div></div>';
  root.querySelectorAll("[data-buddy]").forEach(function (b) {
    b.addEventListener("click", function () { startChat(b.getAttribute("data-buddy")); });
  });
  show("screen-buddies", "buddies");
}

function startChat(id) {
  const ch = characterById(id);
  const micOk = !!speechRecCtor();
  chat = {
    ch: ch, session: newSession(), messages: [], ttsOn: ttsAvailable(), busy: false,
    newWordsSeen: [], correctionsCount: 0,
    voiceMode: micOk // voice chat ON by default — talk instead of typing
  };
  const root = $("screen-buddies");
  root.innerHTML =
    '<div class="bd-wrap"><div class="bd-chathead">' +
    '<button class="back-btn" id="bdBack">← Buddies</button>' +
    '<div class="bd-who">' + ch.emoji + " <strong>" + esc(ch.name) + "</strong></div>" +
    '<div class="bd-tools">' +
    '<button class="chipbtn sm" id="bdVoice" title="Voice chat: talk instead of typing">🎤 Voice: Off</button>' +
    '<button class="chipbtn sm" id="bdTts" title="Read replies aloud">🔊 Off</button>' +
    '<button class="chipbtn sm" id="bdSettings" title="AI settings">⚙️</button>' +
    "</div></div>" +
    '<div id="bdSettingsPanel" class="bd-settings hidden"></div>' +
    '<div id="bdLog" class="bd-log"></div>' +
    '<div id="bdQuick" class="bd-quick"></div>' +
    '<div class="bd-inputrow" id="bdTypeRow"><input id="bdInput" type="text" placeholder="Type your message…" autocomplete="off" maxlength="500" />' +
    '<button class="btn-icon" id="bdMic" title="Speak instead of typing">🎤</button>' +
    '<button class="btn-primary" id="bdSend">Send</button></div>' +
    '<div class="bd-voicerow hidden" id="bdVoiceRow">' +
    '<button class="bd-micbig" id="bdMicBig">🎤<span>Tap & Speak</span></button>' +
    '<p class="fine" id="bdListenMsg"></p></div>' +
    '<div class="row-btns"><button class="btn-ghost btn-sm" id="bdEnd">📝 End & Summary</button></div></div>';
  $("bdBack").addEventListener("click", showBuddies);
  $("bdVoice").addEventListener("click", function () { setVoiceMode(!chat.voiceMode); });
  $("bdTts").addEventListener("click", function () {
    chat.ttsOn = !chat.ttsOn;
    $("bdTts").textContent = chat.ttsOn ? "🔊 On" : "🔊 Off";
    if (!chat.ttsOn) stopSpeak();
    else if (!ttsAvailable()) toast("🔊 Your device can't read aloud — chat still works!");
  });
  $("bdSettings").addEventListener("click", renderSettings);
  $("bdSend").addEventListener("click", sendMsg);
  $("bdMic").addEventListener("click", micTap);
  $("bdMicBig").addEventListener("click", micTap);
  $("bdInput").addEventListener("keydown", function (e) { if (e.key === "Enter") sendMsg(); });
  if (!speechRecCtor()) {
    // No mic on this browser: hide voice options, keep text chat fully working.
    $("bdMic").style.display = "none";
    $("bdVoice").style.display = "none";
    $("bdVoiceRow").classList.add("hidden");
  } else if (chat.voiceMode) {
    setVoiceMode(true);
  }
  renderQuick();
  buddySay(ch.opener);
  $("bdEnd").addEventListener("click", endChat);
  if (!chat.voiceMode) $("bdInput").focus();
}

/* Voice chat: big mic button + replies read aloud automatically.
   In voice mode the conversation is hands-free: after the buddy finishes
   speaking, the mic opens on its own so the learner just keeps talking. */
var activeRec = null; // current speech-recognition handle while listening

function stopVoiceInput(silent) {
  if (activeRec) { try { activeRec.stop(); } catch (e) {} activeRec = null; }
  var big = $("bdMicBig"), msg = $("bdListenMsg");
  if (big) big.classList.remove("listening");
  if (msg && !silent) msg.textContent = "";
}

function setVoiceMode(on) {
  if (!chat) return;
  chat.voiceMode = on;
  stopVoiceInput(true);
  if (!on) stopSpeak();
  $("bdVoice").textContent = on ? "🎤 Voice: On" : "🎤 Voice: Off";
  $("bdTypeRow").classList.toggle("hidden", on);
  $("bdVoiceRow").classList.toggle("hidden", !on);
  if (on && !chat.ttsOn && ttsAvailable()) chat.ttsOn = true;
  $("bdTts").textContent = chat.ttsOn ? "🔊 On" : "🔊 Off";
  if (on) {
    var msg = $("bdListenMsg");
    if (msg) msg.textContent = "Tap 🎤 and speak — I'll keep the conversation going!";
  }
}

/* One listening turn. auto=true means the hands-free loop triggered it. */
function startVoiceInput(auto) {
  if (!chat || chat.busy) return;
  stopSpeak();
  stopVoiceInput(true);
  var big = $("bdMicBig"), msg = $("bdListenMsg");
  var rec = startListen(function (txt) {
    activeRec = null;
    if (big) big.classList.remove("listening");
    if (msg) msg.textContent = "";
    txt = (txt || "").trim();
    if (!txt) {
      // Empty (mic blocked, silence, error): never spin — hand control back.
      if (msg && chat.voiceMode) msg.textContent = "Tap 🎤 when you're ready to speak.";
      else if (!auto) toast("Didn't catch that — try again! 🎤");
      return;
    }
    userSays(txt);
  });
  if (!rec.supported) {
    activeRec = null;
    if (msg) msg.textContent = chat.voiceMode ? "Tap 🎤 to speak." : "";
    if (!auto) toast("🎤 This browser can't listen — type or tap a suggestion instead.");
    return;
  }
  activeRec = rec;
  if (big) big.classList.add("listening");
  if (msg) msg.textContent = auto ? "Your turn — speak!" : "Listening… speak now!";
}

/* Mic button: tap to talk; tap again while listening to cancel that turn. */
function micTap() {
  if (!chat || chat.busy) return;
  if (activeRec) {
    stopVoiceInput();
    var m = $("bdListenMsg");
    if (m) m.textContent = chat.voiceMode ? "Paused — tap 🎤 to keep talking." : "";
    return;
  }
  startVoiceInput(false);
}

function renderQuick() {
  const q = $("bdQuick");
  if (!q || !chat) return;
  const arr = QUICK_REPLIES[chat.ch.id] || QUICK_REPLIES.lingoo;
  q.innerHTML = arr.map(function (s) {
    return '<button class="chipbtn sm" data-qr="' + esc(s) + '">' + esc(s) + "</button>";
  }).join("");
  q.querySelectorAll("[data-qr]").forEach(function (b) {
    b.addEventListener("click", function () {
      $("bdInput").value = b.getAttribute("data-qr");
      sendMsg();
    });
  });
}

function bubble(who, text) {
  const log = $("bdLog");
  if (!log) return;
  const d = document.createElement("div");
  d.className = "bd-msg " + (who === "user" ? "bd-u" : "bd-b");
  d.innerHTML = who === "user" ? esc(text)
    : '<span class="bd-av">' + chat.ch.emoji + "</span><span>" + esc(text).replace(/\n/g, "<br>") + "</span>";
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

function buddySay(text) {
  bubble("buddy", text);
  chat.messages.push({ who: "buddy", text: text });
  // Hands-free discourse: when the buddy finishes speaking, open the mic
  // automatically so the conversation flows without tapping.
  var keepTalking = function () {
    if (chat && chat.voiceMode && !chat.busy && !activeRec) startVoiceInput(true);
  };
  if (chat.ttsOn && ttsAvailable()) speak(text, { onend: keepTalking });
  else keepTalking();
}

function typingOn() {
  const log = $("bdLog");
  if (!log) return;
  const d = document.createElement("div");
  d.className = "bd-msg bd-b";
  d.id = "bdTyping";
  d.innerHTML = '<span class="bd-av">' + chat.ch.emoji + '</span><span class="bd-dots"><i></i><i></i><i></i></span>';
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}
function typingOff() {
  const t = $("bdTyping");
  if (t) t.remove();
}

async function sendMsg() {
  if (!chat || chat.busy) return;
  const inp = $("bdInput");
  const text = inp.value.trim();
  if (!text) return;
  inp.value = "";
  userSays(text);
}

/* Shared by typed, tapped and spoken input. */
async function userSays(text) {
  if (!chat || chat.busy) return;
  bubble("user", text);
  chat.messages.push({ who: "user", text: text });
  chat.busy = true;
  typingOn();
  await new Promise(function (r) { setTimeout(r, 600 + Math.random() * 600); });

  let replyText = null, corrections = [], newWords = [];
  const history = chat.messages.slice(-10).map(function (m) {
    return { role: m.who === "user" ? "user" : "assistant", content: m.text };
  });
  try { replyText = await aiReply(chat.ch.id, history); } catch (e) { replyText = null; }
  if (!replyText) {
    const out = craftReply(chat.ch.id, text, chat.session);
    replyText = out.text;
    corrections = out.corrections;
    newWords = out.newWords;
  }
  typingOff();
  chat.busy = false;
  chat.correctionsCount += corrections.length;
  newWords.forEach(function (w) {
    if (!chat.newWordsSeen.some(function (x) { return x.word === w.word; })) chat.newWordsSeen.push(w);
  });
  buddySay(replyText);
}

function renderSettings() {
  const p = $("bdSettingsPanel");
  if (!p || !chat) return;
  const st = (S.settings = S.settings || {});
  const open = !p.classList.contains("hidden");
  if (open) { p.classList.add("hidden"); p.innerHTML = ""; return; }
  p.classList.remove("hidden");
  p.innerHTML =
    '<h3>⚙️ AI settings</h3>' +
    '<p class="fine">Optional. Without a key, your built-in buddies chat offline free forever. ' +
    "Your key stays on this device and is only sent to the AI service you choose.</p>" +
    '<div class="field"><label>API key</label>' +
    '<input id="bdKey" type="password" placeholder="sk-…" value="' + esc(st.aiKey || "") + '" autocomplete="off" /></div>' +
    '<div class="field"><label>Model</label>' +
    '<input id="bdModel" type="text" value="' + esc(st.aiModel || "gpt-4o-mini") + '" /></div>' +
    '<div class="field"><label>Endpoint</label>' +
    '<input id="bdEp" type="text" value="' + esc(st.aiEndpoint || "https://api.openai.com/v1/chat/completions") + '" /></div>' +
    '<div class="row-btns"><button class="btn-primary btn-sm" id="bdSaveKey">Save</button>' +
    '<button class="btn-ghost btn-sm" id="bdClearKey">Clear</button></div>' +
    '<p class="fine" id="bdKeyMsg"></p>';
  $("bdSaveKey").addEventListener("click", function () {
    st.aiKey = $("bdKey").value.trim();
    st.aiModel = $("bdModel").value.trim() || "gpt-4o-mini";
    st.aiEndpoint = $("bdEp").value.trim() || "https://api.openai.com/v1/chat/completions";
    save();
    $("bdKeyMsg").textContent = st.aiKey ? "Saved ✓ Live AI replies enabled." : "Cleared — offline buddies active.";
  });
  $("bdClearKey").addEventListener("click", function () {
    st.aiKey = "";
    save();
    $("bdKey").value = "";
    $("bdKeyMsg").textContent = "Cleared — offline buddies active.";
  });
}

function endChat() {
  if (!chat) return;
  stopSpeak();
  stopVoiceInput(true);
  chat.voiceMode = false;
  const userMsgs = chat.messages.filter(function (m) { return m.who === "user"; }).length;
  const xp = Math.min(20, Math.floor(userMsgs / 2));
  if (xp > 0) awardXP(xp, "Buddy chat");
  touchStreak();
  checkBadges();
  recordAttempt({ kind: "buddy", mode: "practice", title: "Chat with " + chat.ch.name, score: userMsgs, total: userMsgs });
  const summary = {
    date: new Date().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }),
    userMsgs: userMsgs,
    corrections: chat.correctionsCount,
    newWords: chat.newWordsSeen
  };
  const root = $("screen-buddies");
  const wordsHtml = chat.newWordsSeen.length
    ? '<ul class="bd-words">' + chat.newWordsSeen.map(function (w) {
        return "<li><strong>" + esc(w.word) + "</strong> — " + esc(w.meaning) + "</li>";
      }).join("") + "</ul>"
    : '<p class="fine">No new words this time — chat longer to meet more!</p>';
  root.innerHTML =
    '<div class="bd-wrap"><div class="bd-chathead"><button class="back-btn" id="bdBack2">← Buddies</button>' +
    "<h2>📝 Chat Summary</h2></div>" +
    '<div class="bd-sumcard"><div class="bd-emoji">' + chat.ch.emoji + "</div>" +
    "<h3>" + esc(chat.ch.name) + "</h3>" +
    '<div class="bd-stats">' +
    '<div><strong>' + userMsgs + "</strong><span>your messages</span></div>" +
    '<div><strong>' + chat.correctionsCount + "</strong><span>gentle corrections</span></div>" +
    '<div><strong>' + chat.newWordsSeen.length + "</strong><span>new words</span></div>" +
    '<div><strong>+' + xp + "</strong><span>XP earned</span></div>" +
    "</div></div>" +
    "<h3>📚 Words you met</h3>" + wordsHtml +
    '<div class="row-btns"><button class="btn-primary" id="bdPrint">🖨️ Print transcript</button>' +
    '<button class="btn-ghost" id="bdAgain">Chat again →</button></div></div>';
  const ch = chat.ch, msgs = chat.messages;
  $("bdBack2").addEventListener("click", showBuddies);
  $("bdAgain").addEventListener("click", function () { startChat(ch.id); });
  $("bdPrint").addEventListener("click", function () {
    printHTML(transcriptHTML(ch, msgs, summary));
  });
  show("screen-buddies", "buddies");
  chat = null;
}
