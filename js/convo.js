// LinguaBuddy — Conversation Practice (Part 2).
// Guided role-plays from curated multi-turn scripts (data/convo.js:
// ROLEPLAYS with node trees {p, b:[[keywords,nextId]], f, end}).
// The partner responds from the script tree with keyword branches;
// fallback nodes keep the conversation supportive, never stuck.
// After the role-play, feedback is supportive and rubric-based
// (grammar, vocabulary, sentence construction) — encouragement first,
// then gentle next steps.

import { ROLEPLAYS } from "../data/convo.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { analyzeWriting } from "./writing.js";
import { awardXP, checkBadges, XP_TABLE } from "./gamify.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setConvoGo(fn) { go = fn; }

export function renderConvo() {
  const body = $("convoBody");
  body.innerHTML = '<div class="grammar-grid">' + ROLEPLAYS.map(function (c) {
    return '<button class="grammar-card" data-cv="' + c.id + '"><div class="g-num">' + c.emoji + "</div>" +
      "<h3>" + esc(c.title) + "</h3>" +
      '<p class="fine">' + esc(c.setting) + "</p>" +
      '<span class="g-link">Start role-play →</span></button>';
  }).join("") + "</div>" +
    '<div id="cvStage"></div>';
  body.querySelectorAll("[data-cv]").forEach(function (b) {
    b.addEventListener("click", function () { startConvo(b.getAttribute("data-cv")); });
  });
  show("screen-convo");
}

let sess = null; // {rp, nodeId, userLines:[]}

function nodeOf(rp, id) { return rp.nodes[id]; }

function startConvo(id) {
  const rp = ROLEPLAYS.find(function (c) { return c.id === id; });
  if (!rp) return;
  sess = { rp: rp, nodeId: "start", userLines: [] };
  $("cvStage").innerHTML =
    '<div class="cv-card"><div class="cv-head">' + rp.emoji + " <strong>" + esc(rp.title) + "</strong></div>" +
    '<p class="fine"><strong>Setting:</strong> ' + esc(rp.setting) + "<br><strong>Your goal:</strong> " + esc(rp.goal) + "</p>" +
    '<div id="cvLog" class="cv-log"></div>' +
    '<div class="row-flex"><input id="cvInput" type="text" placeholder="Type your reply…" autocomplete="off" />' +
    '<button class="btn-primary" id="cvSend">Send</button></div>' +
    '<div class="row-btns"><button class="btn-ghost btn-sm" id="cvEnd">End Role-Play</button></div></div>';
  $("cvSend").addEventListener("click", sendLine);
  $("cvInput").addEventListener("keydown", function (e) { if (e.key === "Enter") sendLine(); });
  $("cvEnd").addEventListener("click", function () { endConvo(false); });
  partnerTurn();
  $("cvStage").scrollIntoView({ behavior: "smooth", block: "start" });
}

function say(who, text) {
  const log = $("cvLog");
  if (!log) return;
  const div = document.createElement("div");
  div.className = "cv-msg " + who;
  div.innerHTML = "<strong>" + (who === "partner" ? "🤝 Partner" : "🧑 You") + ":</strong> " + esc(text);
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function partnerTurn() {
  if (!sess) return;
  const node = nodeOf(sess.rp, sess.nodeId);
  if (!node) { endConvo(true); return; }
  const ended = !!node.end;
  const mySess = sess;
  setTimeout(function () {
    if (sess !== mySess) return;
    say("partner", node.p);
    if (ended) setTimeout(function () { endConvo(true); }, 1400);
    else { const i = $("cvInput"); if (i) i.focus(); }
  }, 600);
}

function sendLine() {
  const inp = $("cvInput");
  if (!inp || !sess) return;
  const line = inp.value.trim();
  if (!line) return;
  inp.value = "";
  say("you", line);
  sess.userLines.push(line);
  const node = nodeOf(sess.rp, sess.nodeId);
  if (!node || node.end) return;
  const low = " " + line.toLowerCase() + " ";
  let next = null;
  (node.b || []).forEach(function (br) {
    if (next) return;
    const kws = br[0] || [];
    if (kws.some(function (kw) { return low.indexOf(String(kw).toLowerCase()) >= 0; })) next = br[1];
  });
  sess.nodeId = next || node.f || sess.nodeId;
  partnerTurn();
}

function endConvo(finished) {
  if (!sess) return;
  const rp = sess.rp;
  const lines = sess.userLines.slice();
  sess = null;
  const fb = feedbackFor(lines);
  if (lines.length) { awardXP(XP_TABLE.conversationDone, "conversation practice"); checkBadges(); }
  $("cvStage").innerHTML =
    '<div class="cv-card"><div class="cv-head">🌟 Role-Play ' + (finished ? "Complete" : "Ended") + "</div>" +
    '<p><strong>' + esc(rp.title) + "</strong> — you wrote " + lines.length + " repl" +
    (lines.length === 1 ? "y" : "ies") + ".</p>" +
    '<div class="notice ok"><strong>Well done:</strong><ul>' +
    fb.strengths.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" +
    (fb.nextSteps.length ? '<div class="notice"><strong>Next time, try:</strong><ul>' +
      fb.nextSteps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul></div>" : "") +
    '<div class="row-btns"><button class="btn-primary" id="cvAgain">Try Another</button></div></div>';
  $("cvAgain").addEventListener("click", renderConvo);
}

/* Pure: builds supportive feedback from the learner's lines. */
export function feedbackFor(lines) {
  const strengths = [], nextSteps = [];
  const joined = lines.join(" ");
  const n = lines.length;
  if (n >= 4) strengths.push("You kept the conversation going for " + n + " turns — great stamina!");
  else if (n >= 2) strengths.push("You answered every turn — good participation.");
  else if (n === 1) strengths.push("You gave it a try — every conversation makes you braver.");
  if (/\?/.test(joined)) strengths.push("You asked a question — asking questions keeps conversations alive.");
  const avgLen = n ? Math.round(joined.split(/\s+/).filter(Boolean).length / n) : 0;
  if (avgLen >= 8) strengths.push("Your replies are nicely detailed (" + avgLen + " words on average).");
  else if (avgLen > 0) strengths.push("Your answers are clear and to the point.");
  if (/(please|thank|thanks|excuse me|sorry)/i.test(joined)) strengths.push("You used polite expressions — very natural.");
  if (!strengths.length) strengths.push("You completed the role-play — well done for showing up.");

  if (avgLen > 0 && avgLen < 5) nextSteps.push("Try answering in full sentences (6+ words) instead of one or two words.");
  if (n >= 2 && !/\?/.test(joined)) nextSteps.push("Next time, ask your partner one question — e.g. “What about you?”");
  const res = analyzeWriting(joined, null);
  const g = res.issues.filter(function (x) { return x.category === "grammar" || x.category === "punctuation"; })[0];
  if (g) nextSteps.push("Watch this in your replies: " + g.explain.split(".")[0] + ".");
  const v = res.issues.filter(function (x) { return x.category === "vocabulary"; })[0];
  if (v && v.found) nextSteps.push("You repeated “" + v.found + "” a lot — try a synonym next time.");
  return { strengths: strengths.slice(0, 3), nextSteps: nextSteps.slice(0, 2) };
}
