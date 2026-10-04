// LinguaBuddy — 💼 Professionals (Business English + career skills).
// Email Lab (tone check + writing feedback), Interview Prep (STAR tips +
// mock interviews + optional voice recording), Workplace Role-plays
// (keyword-branch partner), Business Vocabulary (quiz + flashcards),
// CV Builder (printable CV). Offline-first: no network fetches.
// Pure helpers are exported for node tests; DOM lives inside functions.

import { EMAIL_SCENARIOS, INTERVIEW_QS, MEETING_PHRASES, WORKPLACE_SCENARIOS,
         BUSINESS_VOCAB, CV_SECTIONS, TIPS } from "../data/professional.js";
import { S, recordAttempt, touchStreak } from "./store.js";
import { awardXP, checkBadges, XP_TABLE } from "./gamify.js";
import { showScreen as show } from "./ui.js";
import { analyzeWriting } from "./writing.js";
import { printHTML } from "./worksheets.js";
import { speak, stopSpeak } from "./tts.js";
import { esc, shuffle, sample, norm, uid } from "./utils.js";

function $(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }
function stage() { return $("screen-pro"); }

let go = null;
export function setProGo(fn) { go = fn; }

/* ================= pure helpers (node-testable) ================= */

/** Words/phrases too informal for a professional email. */
export const INFORMAL_WORDS = [
  ["gonna", "going to"], ["wanna", "want to"], ["gotta", "have to"],
  ["kinda", "rather"], ["sorta", "rather"], ["yeah", "yes"],
  ["yep", "yes"], ["nope", "no"], ["asap", "as soon as possible"],
  ["btw", "by the way"], ["thx", "thank you"], ["thanks", "thank you"],
  ["plz", "please"], ["ain't", "am not / is not"], ["dunno", "do not know"],
  ["cuz", "because"], ["lemme", "let me"], ["gimme", "give me"],
  ["stuff", "matters / materials"], ["guys", "team / colleagues"],
  ["cool", "suitable / good"], ["okay", "acceptable"], ["ok", "acceptable"],
  ["lol", ""], ["omg", ""], ["cheers", "kind regards"]
];

/**
 * Check the tone/structure of a professional email.
 * Returns [{type, found, explain, hint}]. Pure — no DOM.
 */
export function toneIssues(text) {
  const issues = [];
  const t = String(text || "");
  const low = " " + t.toLowerCase() + " ";
  function add(type, found, explain, hint) {
    if (issues.length >= 8) return;
    if (issues.some(function (x) { return x.found === found; })) return;
    issues.push({ type: type, found: found, explain: explain, hint: hint });
  }

  const lines = t.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);

  // ---- structure first (most important), then tone ----
  // subject line
  if (!/^subject\s*:/im.test(t)) {
    add("structure", "subject", "No subject line found. Every professional email needs one.",
      "Start your email with “Subject: …” — e.g. “Subject: Leave request — 12 October”.");
  }

  // greeting (look in first 4 non-empty lines, excluding the subject line)
  const head = lines.filter(function (l) { return !/^subject\s*:/i.test(l); }).slice(0, 4).join(" ");
  if (!/(dear|hello|salam|assalam|respected)\b/i.test(head)) {
    add("structure", "greeting", "No greeting found. Open with “Dear …” or “Hello …”.",
      "“Dear Mr. Khan,” is safe for formal emails; “Hello Sana,” works for colleagues.");
  }

  // sign-off (look in last 5 non-empty lines)
  const tail = lines.slice(-5).join(" ");
  if (!/(regards|sincerely|thank you|thanks|best|warm wishes|yours)/i.test(tail)) {
    add("structure", "sign-off", "No sign-off found. End with “Kind regards,” or “Sincerely,” plus your name.",
      "Never end a work email abruptly — always sign your name.");
  }

  // overly long sentences
  const sents = t.replace(/\n/g, " ").split(/[.!?]+/).map(function (s) { return s.trim(); }).filter(Boolean);
  const longOnes = sents.filter(function (s) { return s.split(/\s+/).length > 28; });
  if (longOnes.length) {
    add("structure", "long sentence",
      "One sentence has " + longOnes[0].split(/\s+/).length + " words — too long for an email.",
      "Split it into two shorter sentences. Short sentences are easier to read.");
  }

  // informal words
  INFORMAL_WORDS.forEach(function (pair) {
    const w = pair[0];
    // word-boundary match on the padded lowercase text
    const re = new RegExp("(^|[^a-z])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z]|$)");
    if (re.test(low)) {
      const fix = pair[1] ? 'Use "' + pair[1] + '" instead.' : "Remove it — it is not professional.";
      add("tone", w, '“' + w + '” is too informal for a work email. ' + fix,
        "Read your email aloud — would you say this to your manager's face?");
    }
  });

  return issues;
}

/** Score a formal-word quiz round. answers: [{ok:boolean}]. */
export function formalizeScore(answers) {
  const total = answers.length;
  const score = answers.filter(function (a) { return !!a.ok; }).length;
  return { score: score, total: total, pct: total ? Math.round(score / total * 100) : 0 };
}

/** "★★★☆☆" style star string. */
export function starStr(n, max) {
  max = max || 5;
  n = Math.max(0, Math.min(max, Math.round(n)));
  var s = "";
  for (var i = 0; i < max; i++) s += i < n ? "★" : "☆";
  return s;
}

/** Escape + build a printable CV from CV_SECTIONS field ids. Pure. */
export function cvHTML(data) {
  data = data || {};
  function v(id) { return esc(String(data[id] || "").trim()); }
  function block(txt) {
    return String(txt || "").split(/\r?\n/).map(function (l) {
      return l.trim() ? "<div>" + esc(l.trim()) + "</div>" : "";
    }).join("");
  }
  var sec = function (title, inner) {
    if (!inner) return "";
    return '<div style="margin:14px 0;"><div style="font-size:15px;font-weight:800;color:#1e3a8a;' +
      'border-bottom:2px solid #1e3a8a;padding-bottom:4px;margin-bottom:6px;">' + esc(title) +
      '</div><div style="font-size:13px;line-height:1.6;">' + inner + "</div></div>";
  };
  var head = '<div style="text-align:center;margin-bottom:10px;">' +
    '<div style="font-size:24px;font-weight:800;color:#1e3a8a;">' + (v("fullName") || "Your Name") + "</div>" +
    '<div style="font-size:14px;color:#555;">' + v("jobTitle") + "</div>" +
    '<div style="font-size:12px;color:#555;">' + [v("phone"), v("email"), v("city")].filter(Boolean).join(" · ") + "</div></div>";
  return '<div style="font-family:Georgia,serif;max-width:640px;margin:0 auto;padding:8px;color:#222;">' +
    head +
    sec("Professional Summary", block(v("summary"))) +
    sec("Work Experience", block(v("exp1")) + (v("exp2") ? '<div style="margin-top:8px;">' + block(v("exp2")) + "</div>" : "")) +
    sec("Education", block(v("edu1"))) +
    sec("Skills", block(String(data.skills || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean).join(" · "))) +
    "</div>";
}

/** Unique interview question groups. */
export function interviewGroups() {
  const seen = [];
  INTERVIEW_QS.forEach(function (q) { if (seen.indexOf(q.group) < 0) seen.push(q.group); });
  return seen;
}

/** Pick n interview questions (optionally filtered by group). rand: ()=>[0,1). */
export function pickInterviewQuestions(n, group, rand) {
  var pool = group ? INTERVIEW_QS.filter(function (q) { return q.group === group; }) : INTERVIEW_QS.slice();
  return sample(shuffle(pool.slice(), rand), n, rand);
}

/** Build a 4-option casual→formal quiz item. rand: ()=>[0,1). */
export function makeVocabItem(rand) {
  const correct = sample(BUSINESS_VOCAB, 1, rand)[0];
  const distract = sample(BUSINESS_VOCAB.filter(function (x) { return x.formal !== correct.formal; }), 3, rand)
    .map(function (x) { return x.formal; });
  const options = shuffle([correct.formal].concat(distract), rand);
  return { casual: correct.casual, answer: correct.formal, example: correct.example, options: options };
}

/**
 * Walk a role-play node graph; return {ok, problems[]}.
 * Every node must be reachable-to-an-end: no missing targets, no dead ends.
 */
export function graphTerminates(scn) {
  const problems = [];
  const nodes = scn.nodes || {};
  if (!nodes.start) problems.push("missing 'start' node");
  Object.keys(nodes).forEach(function (id) {
    const nd = nodes[id];
    (nd.b || []).forEach(function (br) {
      if (!nodes[br[1]]) problems.push("node '" + id + "' links to missing '" + br[1] + "'");
    });
    if (nd.f && !nodes[nd.f]) problems.push("node '" + id + "' fallback to missing '" + nd.f + "'");
    if (!nd.end) {
      const hasNext = (nd.b && nd.b.length) || nd.f;
      if (!hasNext) problems.push("node '" + id + "' is a dead end (no branches, no fallback)");
    }
  });
  // reachability: every node reachable from start via b/f links
  const seen = {};
  const stack = ["start"];
  while (stack.length) {
    const id = stack.pop();
    if (seen[id] || !nodes[id]) continue;
    seen[id] = true;
    const nd = nodes[id];
    (nd.b || []).forEach(function (br) { stack.push(br[1]); });
    if (nd.f) stack.push(nd.f);
  }
  Object.keys(nodes).forEach(function (id) {
    if (!seen[id]) problems.push("node '" + id + "' unreachable from start");
  });
  return { ok: problems.length === 0, problems: problems };
}

/* ================= hub ================= */

export function showPro() {
  stopSpeak();
  const root = stage();
  if (!root) return;
  const cards = [
    { id: "email", emoji: "✉️", title: "Email Lab", desc: "Write 8 real workplace emails — get tone + grammar feedback." },
    { id: "interview", emoji: "🎤", title: "Interview Prep", desc: "20 common questions, STAR tips, mock interviews." },
    { id: "roleplay", emoji: "🤝", title: "Workplace Role-plays", desc: "Client calls, meetings, negotiations — practise live." },
    { id: "vocab", emoji: "📇", title: "Business Vocabulary", desc: "Sound professional: casual → formal words." },
    { id: "cv", emoji: "📄", title: "CV Builder", desc: "Build and print a clean one-page CV." }
  ];
  root.innerHTML =
    '<div class="pro-hub"><div class="pro-hero"><div class="pro-heroemoji">💼</div>' +
    "<h2>Professionals</h2><p class=\"fine\">Business English for work, interviews and careers.</p></div>" +
    '<div class="pro-grid">' + cards.map(function (c) {
      return '<button class="pro-card" data-sec="' + c.id + '"><span class="pro-emoji">' + c.emoji + "</span>" +
        "<strong>" + esc(c.title) + "</strong><span class=\"fine\">" + esc(c.desc) + "</span></button>";
    }).join("") + "</div>" +
    '<h3 class="sec-title">💡 Career English Tips</h3><div class="pro-tips">' +
    TIPS.map(function (t) {
      return '<div class="pro-tip"><div class="pro-tipemoji">' + t.emoji + "</div><div><strong>" +
        esc(t.title) + "</strong><p class=\"fine\">" + esc(t.text) + "</p></div></div>";
    }).join("") + "</div>" +
    '<h3 class="sec-title">🗣️ Meeting Phrases</h3><div class="pro-tips">' +
    MEETING_PHRASES.map(function (g) {
      return '<div class="pro-tip"><div><strong>' + esc(g.group) + "</strong><p class=\"fine\">" +
        g.phrases.map(esc).join("<br>") + "</p></div></div>";
    }).join("") + "</div></div>";
  root.querySelectorAll("[data-sec]").forEach(function (b) {
    b.addEventListener("click", function () { openSection(b.getAttribute("data-sec")); });
  });
  show("screen-pro", "pro");
  if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
}

function backBar(title) {
  return '<div class="row-btns"><button class="btn-ghost" id="proBack">← Professionals</button></div>' +
    "<h2>" + esc(title) + "</h2>";
}
function wireBack() {
  const b = $("proBack");
  if (b) b.addEventListener("click", showPro);
}

function openSection(id) {
  if (id === "email") renderEmailLab();
  else if (id === "interview") renderInterview();
  else if (id === "roleplay") renderRoleplays();
  else if (id === "vocab") renderBizVocab();
  else if (id === "cv") renderCV();
}

/* ================= Email Lab ================= */

let emailScn = null;

function renderEmailLab() {
  const root = stage();
  root.innerHTML = backBar("✉️ Email Lab") +
    '<p class="fine">Pick a scenario, fill in the <strong>[brackets]</strong>, then check your email.</p>' +
    '<div class="pro-chips">' + EMAIL_SCENARIOS.map(function (s) {
      return '<button class="chipbtn" data-em="' + s.id + '">' + s.emoji + " " + esc(s.title.replace(/^[^\s]+\s/, "")) + "</button>";
    }).join("") + "</div><div id=\"proEmailBody\"></div>";
  wireBack();
  root.querySelectorAll("[data-em]").forEach(function (b) {
    b.addEventListener("click", function () { openEmail(b.getAttribute("data-em")); });
  });
  if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
}

function openEmail(id) {
  emailScn = EMAIL_SCENARIOS.find(function (s) { return s.id === id; }) || EMAIL_SCENARIOS[0];
  const s = emailScn;
  $("proEmailBody").innerHTML =
    '<div class="pro-panel"><h3>' + s.emoji + " " + esc(s.title.replace(/^[^\s]+\s/, "")) + "</h3>" +
    '<p class="fine">' + esc(s.context) + "</p>" +
    '<div class="pro-tmpl">' + esc(s.template).split("\n").join("<br>") + "</div>" +
    '<div class="pro-tips"><div class="pro-tip"><div>💡 <strong>Tone tips</strong><p class="fine">' +
    s.toneTips.map(esc).join("<br>") + "</p></div></div></div>" +
    '<label class="fine"><strong>Now write your email:</strong> (copy the template and fill the [brackets])</label>' +
    '<textarea id="proEmailText" class="pro-text" rows="10" placeholder="Subject: …\n\nDear …"></textarea>' +
    '<div class="row-btns"><button class="btn-primary" id="proEmailCheck">Check My Email ✓</button></div>' +
    '<div id="proEmailFb"></div></div>';
  $("proEmailCheck").addEventListener("click", checkEmail);
  $("proEmailBody").scrollIntoView({ behavior: "smooth", block: "start" });
}

function issueHTML(iss) {
  if (!iss.length) {
    return '<div class="notice ok">✅ <strong>Excellent email!</strong> Professional tone, greeting and sign-off all look right.</div>';
  }
  return '<div class="notice"><strong>📝 Feedback (' + iss.length + "):</strong><ul>" +
    iss.map(function (x) {
      return "<li><strong>" + esc(x.found) + "</strong> — " + esc(x.explain) +
        '<br><em>💡 ' + esc(x.hint) + "</em></li>";
    }).join("") + "</ul></div>";
}

function checkEmail() {
  const txt = ($("proEmailText") || {}).value || "";
  if (!txt.trim()) { $("proEmailFb").innerHTML = '<div class="notice">Write your email first, then check it.</div>'; return; }
  const tone = toneIssues(txt);
  const wr = analyzeWriting(txt, null);
  const all = tone.concat(wr.issues.map(function (x) {
    return { type: x.category, found: x.found, explain: x.explain, hint: x.hint };
  }));
  awardXP(XP_TABLE.writingChecked, "email writing");
  recordAttempt({ kind: "email", mode: "practice", title: "Email Lab: " + emailScn.title, results: [], perSlo: {} });
  touchStreak(); checkBadges();
  $("proEmailFb").innerHTML = issueHTML(all) +
    '<div class="row-btns"><button class="btn-ghost" id="proEmailAgain">↻ Revise & check again</button></div>';
  $("proEmailAgain").addEventListener("click", checkEmail);
  $("proEmailFb").scrollIntoView({ behavior: "smooth", block: "start" });
  if (!all.length) speak("Excellent email! Very professional.");
}

/* ================= Interview Prep ================= */

let ivList = [];
let ivIdx = 0;
let ivRatings = {};

function renderInterview() {
  const root = stage();
  const groups = interviewGroups();
  root.innerHTML = backBar("🎤 Interview Prep") +
    '<p class="fine">20 real interview questions. Learn the <strong>STAR</strong> method: ' +
    "Situation → Task → Action → Result.</p>" +
    '<div class="row-btns"><button class="btn-primary" id="proMock">🎲 Start Mock Interview (5 questions)</button></div>' +
    '<div class="pro-chips">' + groups.map(function (g) {
      return '<button class="chipbtn" data-ivg="' + esc(g) + '">' + esc(g) + "</button>";
    }).join("") + "</div><div id=\"proIvBody\"></div>";
  wireBack();
  $("proMock").addEventListener("click", function () {
    ivList = pickInterviewQuestions(5, null, Math.random);
    ivIdx = 0; ivRatings = {};
    openInterviewQ();
  });
  root.querySelectorAll("[data-ivg]").forEach(function (b) {
    b.addEventListener("click", function () {
      const g = b.getAttribute("data-ivg");
      ivList = INTERVIEW_QS.filter(function (q) { return q.group === g; });
      ivIdx = 0; ivRatings = {};
      openInterviewQ();
    });
  });
  if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
}

function openInterviewQ() {
  const q = ivList[ivIdx];
  const body = $("proIvBody");
  if (!q) { finishInterview(); return; }
  body.innerHTML =
    '<div class="pro-panel"><div class="fine">Question ' + (ivIdx + 1) + " of " + ivList.length +
    ' · <em>' + esc(q.group) + "</em></div>" +
    '<h3>❓ ' + esc(q.q) + "</h3>" +
    '<button class="btn-ghost btn-sm" id="proStarBtn">💡 Show STAR tip</button>' +
    '<div id="proStarTip" class="notice hidden" style="margin-top:8px;"><strong>STAR tip:</strong> ' + esc(q.starTip) + "</div>" +
    '<div class="fine" style="margin-top:8px;"><strong>Strong answers mention:</strong> ' +
    q.keywords.map(function (k) { return '<span class="pro-kw">' + esc(k) + "</span>"; }).join(" ") + "</div>" +
    '<div class="row-btns" style="margin-top:10px;">' +
    '<button class="btn-ghost btn-sm" id="proHear">🔊 Hear it</button>' +
    (recSupported() ? '<button class="btn-ghost btn-sm" id="proRec">🎤 Record my answer</button>' : "") +
    "</div><div id=\"proRecBox\"></div>" +
    '<label class="fine"><strong>Rate your answer</strong> (be honest — it helps you improve):</label>' +
    '<div class="pro-stars" id="proStars">' +
    [1, 2, 3, 4, 5].map(function (n) {
      return '<button class="pro-star" data-st="' + n + '">☆</button>';
    }).join("") + "</div>" +
    '<div class="row-btns"><button class="btn-primary" id="proIvNext">' +
    (ivIdx + 1 < ivList.length ? "Next Question →" : "Finish →") + "</button></div></div>";
  $("proStarBtn").addEventListener("click", function () { $("proStarTip").classList.remove("hidden"); });
  $("proHear").addEventListener("click", function () { speak(q.q); });
  const recBtn = $("proRec");
  if (recBtn) recBtn.addEventListener("click", function () { startRecording(q); });
  body.querySelectorAll("[data-st]").forEach(function (b) {
    b.addEventListener("click", function () {
      const n = +b.getAttribute("data-st");
      ivRatings[ivIdx] = n;
      body.querySelectorAll("[data-st]").forEach(function (x) {
        x.textContent = (+x.getAttribute("data-st") <= n) ? "★" : "☆";
      });
    });
  });
  $("proIvNext").addEventListener("click", function () {
    stopSpeak();
    const r = ivRatings[ivIdx] || 0;
    if (r >= 4) speak("Great answer! Confident and clear.");
    else if (r >= 2) speak("Good effort. Check the STAR tip and try again.");
    ivIdx++;
    openInterviewQ();
  });
  body.scrollIntoView({ behavior: "smooth", block: "start" });
}

function finishInterview() {
  const rated = Object.keys(ivRatings).length;
  const avg = rated ? (Object.keys(ivRatings).reduce(function (s, k) { return s + ivRatings[k]; }, 0) / rated) : 0;
  if (rated) {
    awardXP(XP_TABLE.practiceComplete, "interview practice");
    recordAttempt({ kind: "interview", mode: "practice", title: "Interview Prep", results: [], perSlo: {} });
    touchStreak(); checkBadges();
  }
  $("proIvBody").innerHTML =
    '<div class="pro-panel"><h3>🎉 Interview practice complete!</h3>' +
    "<p>You practised <strong>" + ivList.length + "</strong> questions" +
    (rated ? ' and rated yourself <strong>' + starStr(avg) + "</strong>." : ".") + "</p>" +
    (avg > 0 && avg < 3 ? '<div class="notice">💡 Tip: re-read the STAR tips and practise the low-rated ones again. Interviewers love short, specific stories.</div>' : "") +
    '<div class="row-btns"><button class="btn-primary" id="proIvAgain">↻ Practise Again</button></div></div>';
  $("proIvAgain").addEventListener("click", renderInterview);
  speak("Interview practice complete. Well done!");
}

/* ---- optional voice recording (MediaRecorder, guarded) ---- */

function recSupported() {
  return typeof window !== "undefined" && !!(navigator.mediaDevices && window.MediaRecorder);
}

let mediaRec = null, recChunks = [];

function startRecording(q) {
  const box = $("proRecBox");
  if (!box) return;
  box.innerHTML = '<p class="fine">🎤 Recording… speak your answer, then stop.</p>' +
    '<div class="row-btns"><button class="btn-danger btn-sm" id="proRecStop">⏹ Stop</button></div>';
  recChunks = [];
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    mediaRec = new MediaRecorder(stream);
    mediaRec.ondataavailable = function (e) { if (e.data.size) recChunks.push(e.data); };
    mediaRec.onstop = function () {
      stream.getTracks().forEach(function (t) { t.stop(); });
      const url = URL.createObjectURL(new Blob(recChunks, { type: mediaRec.mimeType || "audio/webm" }));
      box.innerHTML = '<p class="fine"><strong>Your answer:</strong></p>' +
        '<audio controls src="' + url + '" style="width:100%"></audio>' +
        '<p class="fine">Listen back: did you use the STAR structure? Any filler words (“um”, “like”)?</p>';
    };
    mediaRec.start();
    $("proRecStop").addEventListener("click", function () { if (mediaRec) mediaRec.stop(); });
  }).catch(function () {
    box.innerHTML = '<div class="notice">Could not access the microphone. You can still practise by answering aloud!</div>';
  });
}

/* ================= Workplace Role-plays ================= */

let rpSess = null; // {scn, nodeId, userLines:[]}

function renderRoleplays() {
  const root = stage();
  root.innerHTML = backBar("🤝 Workplace Role-plays") +
    '<p class="fine">Real work situations. Reply naturally — your partner responds to keywords.</p>' +
    '<div class="pro-grid">' + WORKPLACE_SCENARIOS.map(function (c) {
      return '<button class="pro-card" data-rp="' + c.id + '"><span class="pro-emoji">' + c.emoji + "</span>" +
        "<strong>" + esc(c.title) + "</strong><span class=\"fine\">" + esc(c.setting) + "</span></button>";
    }).join("") + '</div><div id="proRpStage"></div>';
  wireBack();
  root.querySelectorAll("[data-rp]").forEach(function (b) {
    b.addEventListener("click", function () { startRoleplay(b.getAttribute("data-rp")); });
  });
  if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
}

function rpNode(scn, id) { return (scn.nodes || {})[id]; }

function startRoleplay(id) {
  const scn = WORKPLACE_SCENARIOS.find(function (c) { return c.id === id; });
  if (!scn) return;
  rpSess = { scn: scn, nodeId: "start", userLines: [] };
  $("proRpStage").innerHTML =
    '<div class="pro-panel"><h3>' + scn.emoji + " " + esc(scn.title) + "</h3>" +
    '<p class="fine"><strong>Setting:</strong> ' + esc(scn.setting) +
    "<br><strong>Your goal:</strong> " + esc(scn.goal) + "</p>" +
    '<div id="proRpLog" class="cv-log"></div>' +
    '<div class="row-flex"><input id="proRpInput" type="text" placeholder="Type your reply…" autocomplete="off" />' +
    '<button class="btn-primary" id="proRpSend">Send</button></div>' +
    '<div class="row-btns"><button class="btn-ghost btn-sm" id="proRpEnd">End Role-Play</button></div></div>';
  $("proRpSend").addEventListener("click", rpSend);
  $("proRpInput").addEventListener("keydown", function (e) { if (e.key === "Enter") rpSend(); });
  $("proRpEnd").addEventListener("click", function () { endRoleplay(false); });
  rpPartnerTurn();
  $("proRpStage").scrollIntoView({ behavior: "smooth", block: "start" });
}

function rpSay(who, text) {
  const log = $("proRpLog");
  if (!log) return;
  const div = document.createElement("div");
  div.className = "cv-msg " + who;
  div.innerHTML = "<strong>" + (who === "partner" ? "🤝 Partner" : "🧑 You") + ":</strong> " + esc(text);
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function rpPartnerTurn() {
  if (!rpSess) return;
  const node = rpNode(rpSess.scn, rpSess.nodeId);
  if (!node) { endRoleplay(true); return; }
  const ended = !!node.end;
  const mine = rpSess;
  setTimeout(function () {
    if (rpSess !== mine) return;
    rpSay("partner", node.p);
    if (ended) setTimeout(function () { endRoleplay(true); }, 1400);
    else { const i = $("proRpInput"); if (i) i.focus(); }
  }, 600);
}

function rpSend() {
  const inp = $("proRpInput");
  if (!inp || !rpSess) return;
  const line = inp.value.trim();
  if (!line) return;
  inp.value = "";
  rpSay("you", line);
  rpSess.userLines.push(line);
  const node = rpNode(rpSess.scn, rpSess.nodeId);
  if (!node || node.end) return;
  const low = " " + norm(line) + " ";
  let next = null;
  (node.b || []).forEach(function (br) {
    if (next) return;
    if ((br[0] || []).some(function (kw) { return low.indexOf(String(kw).toLowerCase()) >= 0; })) next = br[1];
  });
  rpSess.nodeId = next || node.f || rpSess.nodeId;
  rpPartnerTurn();
}

/** Supportive feedback for a workplace role-play. Pure-ish (uses analyzeWriting). */
export function rpFeedback(lines) {
  const strengths = [], nextSteps = [];
  const joined = lines.join(" ");
  const n = lines.length;
  if (n >= 4) strengths.push("You handled " + n + " turns professionally — great composure.");
  else if (n >= 1) strengths.push("You stepped into the situation — well done.");
  if (/(please|thank|apologise|apologize|sorry|appreciate)/i.test(joined))
    strengths.push("You used polite professional language.");
  if (/\?/.test(joined)) strengths.push("You asked clarifying questions — very professional.");
  if (!strengths.length) strengths.push("You completed the role-play — good effort.");
  const avgLen = n ? Math.round(joined.split(/\s+/).filter(Boolean).length / n) : 0;
  if (avgLen > 0 && avgLen < 6) nextSteps.push("Use fuller sentences at work — short replies can sound abrupt.");
  const res = analyzeWriting(joined, null);
  const g = res.issues.filter(function (x) { return x.category === "grammar"; })[0];
  if (g) nextSteps.push("Watch this: " + g.explain.split(".")[0] + ".");
  return { strengths: strengths.slice(0, 3), nextSteps: nextSteps.slice(0, 2) };
}

function endRoleplay(finished) {
  if (!rpSess) return;
  const scn = rpSess.scn;
  const lines = rpSess.userLines.slice();
  rpSess = null;
  const fb = rpFeedback(lines);
  if (lines.length) {
    awardXP(XP_TABLE.conversationDone, "workplace role-play");
    recordAttempt({ kind: "roleplay", mode: "practice", title: "Workplace: " + scn.title, results: [], perSlo: {} });
    touchStreak(); checkBadges();
  }
  $("proRpStage").innerHTML =
    '<div class="pro-panel"><h3>🌟 ' + (finished ? "Role-Play Complete" : "Role-Play Ended") + "</h3>" +
    "<p><strong>" + esc(scn.title) + "</strong> — " + lines.length + " replies.</p>" +
    '<div class="notice ok"><strong>Well done:</strong><ul>' +
    fb.strengths.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" +
    (fb.nextSteps.length ? '<div class="notice"><strong>Next time:</strong><ul>' +
      fb.nextSteps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" : "") +
    '<div class="row-btns"><button class="btn-primary" id="proRpAgain">Try Another</button></div></div>';
  $("proRpAgain").addEventListener("click", renderRoleplays);
}

/* ================= Business Vocabulary ================= */

let bvMode = null, bvItem = null, bvScore = { ok: 0, total: 0 }, bvTimer = null, bvSecs = 0;

function renderBizVocab() {
  const root = stage();
  root.innerHTML = backBar("📇 Business Vocabulary") +
    '<p class="fine">At work, <em>formal</em> words win. Turn casual words into professional ones.</p>' +
    '<div class="row-btns"><button class="btn-primary" id="proBvQuiz">⚡ Timed Quiz (60s)</button>' +
    '<button class="btn-ghost" id="proBvCards">🃏 Flashcards</button></div>' +
    '<div id="proBvBody"></div>';
  wireBack();
  $("proBvQuiz").addEventListener("click", startBvQuiz);
  $("proBvCards").addEventListener("click", startBvCards);
  if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
}

function startBvQuiz() {
  stopBvTimer();
  bvMode = "quiz"; bvScore = { ok: 0, total: 0 }; bvSecs = 60;
  nextBvItem();
  bvTimer = setInterval(function () {
    bvSecs--;
    const t = $("proBvTimer");
    if (t) t.textContent = "⏱ " + bvSecs + "s";
    if (bvSecs <= 0) endBvQuiz();
  }, 1000);
}

function nextBvItem() {
  bvItem = makeVocabItem(Math.random);
  const body = $("proBvBody");
  body.innerHTML =
    '<div class="pro-panel"><div class="fine" id="proBvTimer">⏱ ' + bvSecs + 's · Score: <span id="proBvScore">' +
    bvScore.ok + "/" + bvScore.total + "</span></div>" +
    '<h3>Say it professionally: <strong>“' + esc(bvItem.casual) + "”</strong></h3>" +
    '<div class="pro-opts">' + bvItem.options.map(function (o, i) {
      return '<button class="pro-opt" data-oi="' + i + '">' + esc(o) + "</button>";
    }).join("") + "</div><div id=\"proBvFb\" class=\"fine\"></div></div>";
  body.querySelectorAll("[data-oi]").forEach(function (b) {
    b.addEventListener("click", function () {
      const pick = bvItem.options[+b.getAttribute("data-oi")];
      const ok = pick === bvItem.answer;
      bvScore.total++;
      if (ok) { bvScore.ok++; speak("Correct!"); }
      else speak("Not quite. The answer is " + bvItem.answer + ".");
      $("proBvFb").innerHTML = (ok ? "✅ " : "❌ ") + "<em>“" + esc(bvItem.example) + "”</em>";
      $("proBvScore").textContent = bvScore.ok + "/" + bvScore.total;
      setTimeout(nextBvItem, 1100);
    });
  });
}

function stopBvTimer() { if (bvTimer) { clearInterval(bvTimer); bvTimer = null; } }

function endBvQuiz() {
  stopBvTimer();
  stopSpeak();
  const r = formalizeScore(Array(bvScore.total).fill(0).map(function (_, i) { return { ok: i < bvScore.ok }; }));
  if (bvScore.total) {
    awardXP(Math.min(50, bvScore.ok * 5), "business vocabulary");
    recordAttempt({ kind: "bizvocab", mode: "practice", title: "Business Vocabulary Quiz", results: [], perSlo: {} });
    touchStreak(); checkBadges();
  }
  $("proBvBody").innerHTML =
    '<div class="pro-panel"><h3>⏱ Time! You scored <strong>' + r.score + "/" + r.total + "</strong> (" + r.pct + "%)</h3>" +
    (r.pct >= 80 ? '<div class="notice ok">🌟 Boardroom-ready vocabulary!</div>'
      : '<div class="notice">💡 Tip: use the flashcards below, then try the quiz again.</div>') +
    '<div class="row-btns"><button class="btn-primary" id="proBvRetry">↻ Play Again</button></div></div>';
  $("proBvRetry").addEventListener("click", startBvQuiz);
}

function startBvCards() {
  stopBvTimer();
  bvMode = "cards";
  const items = sample(BUSINESS_VOCAB.slice(), 12, Math.random);
  let i = 0, flipped = false;
  const body = $("proBvBody");
  function draw() {
    const it = items[i];
    body.innerHTML =
      '<div class="pro-panel"><div class="fine">Card ' + (i + 1) + " of " + items.length + "</div>" +
      '<button class="pro-flash" id="proFlash">' +
      (flipped
        ? '<div class="pro-flash-a">' + esc(it.formal) + '</div><div class="fine"><em>“' + esc(it.example) + '”</em></div>'
        : '<div class="pro-flash-q">“' + esc(it.casual) + '”</div><div class="fine">Tap to see the formal word 👆</div>') +
      "</button>" +
      '<div class="row-flex"><button class="btn-ghost" id="proFcHear">🔊 Hear it</button></div>' +
      '<div class="row-btns"><button class="btn-ghost" id="proFcPrev">← Prev</button>' +
      '<button class="btn-primary" id="proFcNext">' + (i + 1 < items.length ? "Next →" : "Finish ✓") + "</button></div></div>";
    $("proFlash").addEventListener("click", function () { flipped = !flipped; draw(); });
    $("proFcHear").addEventListener("click", function () { speak(it.formal + ". " + it.example); });
    $("proFcPrev").addEventListener("click", function () { if (i > 0) { i--; flipped = false; draw(); } });
    $("proFcNext").addEventListener("click", function () {
      stopSpeak();
      if (i + 1 < items.length) { i++; flipped = false; draw(); }
      else {
        awardXP(10, "vocabulary flashcards");
        touchStreak(); checkBadges();
        body.innerHTML = '<div class="pro-panel"><h3>🃏 Flashcards done!</h3>' +
          '<p>12 new formal words. Try the timed quiz now!</p>' +
          '<div class="row-btns"><button class="btn-primary" id="proBvToQuiz">⚡ Take the Quiz</button></div></div>';
        $("proBvToQuiz").addEventListener("click", startBvQuiz);
      }
    });
  }
  draw();
}

/* ================= CV Builder ================= */

function renderCV() {
  const root = stage();
  root.innerHTML = backBar("📄 CV Builder") +
    '<p class="fine">Fill the form — your CV builds itself. Then print it.</p>' +
    '<div class="pro-cvwrap"><div class="pro-panel"><h3>Your details</h3><div id="proCvForm">' +
    CV_SECTIONS.map(function (sec) {
      return "<h4>" + esc(sec.title) + "</h4>" + sec.fields.map(function (f) {
        return '<label class="fine">' + esc(f.label) + "</label>" +
          (f.textarea
            ? '<textarea class="pro-text" rows="3" data-cv="' + f.id + '" placeholder="' + esc(f.ph || "") + '"></textarea>'
            : '<input class="pro-input" type="text" data-cv="' + f.id + '" placeholder="' + esc(f.ph || "") + '" />');
      }).join("");
    }).join("") +
    '</div><div class="row-btns"><button class="btn-primary" id="proCvPrint">🖨️ Print My CV</button></div></div>' +
    '<div class="pro-panel"><h3>Live preview</h3><div id="proCvPrev" class="pro-cvprev"></div></div></div>';
  wireBack();
  function collect() {
    const d = {};
    root.querySelectorAll("[data-cv]").forEach(function (el) { d[el.getAttribute("data-cv")] = el.value; });
    return d;
  }
  function refresh() { $("proCvPrev").innerHTML = cvHTML(collect()); }
  root.querySelectorAll("[data-cv]").forEach(function (el) {
    el.addEventListener("input", refresh);
  });
  refresh();
  $("proCvPrint").addEventListener("click", function () {
    const d = collect();
    if (!String(d.fullName || "").trim()) {
      if (!confirm("Your name is empty — print anyway?")) return;
    }
    awardXP(15, "CV built");
    touchStreak(); checkBadges();
    printHTML(cvHTML(d));
  });
  if (typeof window !== "undefined" && window.scrollTo) window.scrollTo(0, 0);
}
