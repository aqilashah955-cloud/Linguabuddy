// LinguaBuddy — Creative Corner: creative English activities beyond tests.
// Students pick an activity, get a random original prompt, write freely, and
// receive encouragement + writing-lab feedback + XP. All prompts are bundled
// originals in data/creative.js; works fully offline, no new dependencies.
// Pure helpers (wordCount, builtInCheck) are exported for node tests;
// everything touching document lives inside functions.

import { CREATIVE_ACTIVITIES, activityOf } from "../data/creative.js";
import { analyzeWriting } from "./writing.js";
import { awardXP, checkBadges, XP_TABLE } from "./gamify.js";
import { showScreen as show } from "./ui.js";
import { esc } from "./utils.js";

function $(id) { return document.getElementById(id); }
function stage() { return $("creativeBody"); }

let go = null;
export function setCreativeGo(fn) { go = fn; }

let cur = null; // { act, prompt }

/* ================= pure helpers (node-testable) ================= */

export function wordCount(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

const CR_STOP = new Set(
  "the,a,an,and,or,but,to,of,in,on,at,for,with,from,as,is,are,was,were,be,been,am,i,you,he,she,it,we,they,my,his,her,their,our,your,this,that,these,those,its,so,very,not,no,do,does,did,have,has,had,will,would,can,could,should,must,then,than,there,here,when,where,what,which,who,how,all,also,just,like,get,got".split(",")
);

/** Light built-in check used when the writing lab is unavailable, and as a
 *  supplement otherwise. Returns [{kind, text}]. Never throws. */
export function builtInCheck(text) {
  const notes = [];
  try {
    const t = String(text || "").trim();
    const sents = t.split(/[.!?…]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (sents.length < 3) {
      notes.push({ kind: "sentences", text: "You wrote " + sents.length + " sentence" + (sents.length === 1 ? "" : "s") + " — try to write at least 3 full sentences." });
    }
    const freq = {};
    (t.toLowerCase().match(/[a-z']+/g) || []).forEach(function (w) {
      if (!CR_STOP.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1;
    });
    let top = null, topN = 0;
    Object.keys(freq).forEach(function (w) {
      if (freq[w] > topN) { top = w; topN = freq[w]; }
    });
    if (top && topN >= 5) {
      notes.push({ kind: "repeat", text: "You used the word “" + top + "” " + topN + " times — can you find a synonym for it?" });
    }
  } catch (e) { /* never break the flow */ }
  return notes;
}

/* ================= screens ================= */

export function renderCreative() {
  cur = null;
  stage().innerHTML =
    '<div class="grammar-grid">' + CREATIVE_ACTIVITIES.map(function (a) {
      return '<button class="grammar-card" data-cr="' + a.id + '"><div class="g-num">' + a.emoji + "</div>" +
        "<h3>" + esc(a.title) + "</h3><p class=\"fine\">" + esc(a.desc) + "</p>" +
        '<span class="g-link">Try it →</span></button>';
    }).join("") + "</div>" +
    '<p class="fine gm-note">No marks, no timer — just write, imagine, and have fun with English.</p>';
  stage().querySelectorAll("[data-cr]").forEach(function (b) {
    b.addEventListener("click", function () { openActivity(b.getAttribute("data-cr")); });
  });
  show("screen-creative");
}

function pickPrompt(act) {
  const ps = act.prompts || [];
  if (!ps.length) return null;
  return ps[Math.floor(Math.random() * ps.length)];
}

function promptHTML(act, p) {
  if (p == null) return "";
  if (typeof p === "string") {
    const label = act.id === "finish-story" ? "Finish this story:" : "Describe this scene:";
    return '<p class="fine">' + esc(label) + '</p><div class="cr-prompt">' + esc(p) + "</div>";
  }
  if (act.id === "debate-club") {
    return '<p class="fine">Pick a side and give 3 strong reasons:</p>' +
      '<div class="cr-prompt"><strong>' + esc(p.topic) + "</strong><br><br>" +
      "🅰️ " + esc(p.sideA) + "<br>🅱️ " + esc(p.sideB) + "</div>";
  }
  if (act.id === "idiom-theater") {
    return '<p class="fine">Now write your own sentence using this idiom:</p>' +
      '<div class="cr-prompt"><strong>🎭 “' + esc(p.idiom) + "”</strong><br>" +
      "<em>Meaning:</em> " + esc(p.meaning) + "<br><em>Example:</em> " + esc(p.example) + "</div>";
  }
  if (act.id === "poetry-workshop") {
    return '<p class="fine">Write a 4-line poem about:</p>' +
      '<div class="cr-prompt"><strong>🌸 ' + esc(p.theme) + "</strong><br>" +
      '<span class="fine">' + esc(p.hint) + "</span></div>";
  }
  if (act.id === "dialogue-builder") {
    return '<p class="fine">Write their conversation (' + esc(p.charA) + " & " + esc(p.charB) + "):</p>" +
      '<div class="cr-prompt">' + esc(p.situation) + "</div>";
  }
  return '<div class="cr-prompt">' + esc(String(p)) + "</div>";
}

function openActivity(id) {
  const act = activityOf(id);
  if (!act) return;
  cur = { act: act, prompt: pickPrompt(act) };
  drawActivity();
  show("screen-creative");
}

function drawActivity() {
  const act = cur.act;
  stage().innerHTML =
    '<div class="gm-top"><button class="btn-ghost btn-sm" id="crBack">← Creative Corner</button></div>' +
    '<h3 class="gm-title">' + act.emoji + " " + esc(act.title) + "</h3>" +
    '<p class="fine">💡 ' + esc(act.tip) + "</p>" +
    '<div id="crPromptWrap">' + promptHTML(act, cur.prompt) + "</div>" +
    '<div class="cr-row"><button class="btn-ghost btn-sm" id="crNew">🔀 New prompt</button>' +
    '<span class="fine" id="crCount">0 words</span></div>' +
    '<textarea id="crText" class="cr-text" rows="8" placeholder="Write here…"></textarea>' +
    '<div id="crMsg" class="fine" style="min-height:1.4em;"></div>' +
    '<button class="btn-primary" id="crSubmit">✨ Submit my writing</button>';
  $("crBack").addEventListener("click", renderCreative);
  $("crNew").addEventListener("click", function () {
    cur.prompt = pickPrompt(act);
    $("crPromptWrap").innerHTML = promptHTML(act, cur.prompt);
  });
  $("crText").addEventListener("input", function () {
    const n = wordCount($("crText").value);
    $("crCount").textContent = n + (n === 1 ? " word" : " words");
  });
  $("crSubmit").addEventListener("click", submitCreative);
}

function submitCreative() {
  if (!cur) return;
  const text = $("crText").value.trim();
  const wc = wordCount(text);
  if (wc < 20) {
    $("crMsg").textContent = "Write at least 20 words first — you're at " + wc + ". Keep going, you can do it! 💪";
    return;
  }

  let issues = [];
  try {
    if (typeof analyzeWriting === "function") {
      const r = analyzeWriting(text, cur.act.title);
      if (r && Array.isArray(r.issues)) issues = r.issues;
    }
  } catch (e) { issues = []; }
  const notes = builtInCheck(text);

  awardXP(XP_TABLE.writingChecked || 25, "Creative Corner: " + cur.act.title);
  checkBadges();

  const shown = issues.slice(0, 4);
  let fb = '<h3 class="gm-title">🌟 Great writing!</h3>' +
    '<p class="fine">' + wc + " words — every writer starts with a first draft. Here's what to polish:</p>";
  if (!shown.length && !notes.length) {
    fb += '<p>✅ <strong>Flawless!</strong> Not a single issue spotted. Superb work!</p>';
  } else {
    fb += '<div class="cr-feedback">' + shown.map(function (is) {
      return '<div class="cr-issue"><strong>' + esc(is.category || "tip") + ":</strong> " +
        esc(is.explain || is.found || "") +
        (is.hint ? '<br><span class="fine">💡 ' + esc(is.hint) + "</span>" : "") + "</div>";
    }).join("") + notes.map(function (n) {
      return '<div class="cr-issue"><strong>style:</strong> ' + esc(n.text) + "</div>";
    }).join("") + "</div>";
    if (issues.length > shown.length) {
      fb += '<p class="fine">…and ' + (issues.length - shown.length) + " more small thing(s) to check in the Writing Lab.</p>";
    }
  }
  fb += '<div class="cr-row"><button class="btn-ghost btn-sm" id="crAgain">🔀 Another prompt</button>' +
    '<button class="btn-ghost btn-sm" id="crHub">← Creative Corner</button></div>' +
    '<p class="fine">⭐ +' + (XP_TABLE.writingChecked || 25) + " XP earned!</p>";

  stage().innerHTML = fb;
  $("crAgain").addEventListener("click", function () {
    cur.prompt = pickPrompt(cur.act);
    drawActivity();
  });
  $("crHub").addEventListener("click", renderCreative);
  show("screen-creative");
}
