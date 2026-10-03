// LinguaBuddy — the SLO learning cycle:
// Lesson → Practice → Assessment → Mastery → Remediation →
// Reassessment → Reading recommendation → profile update.

import { S, save, recordAttempt, isLocked } from "./store.js";
import {
  SLOS, sloById, lessonFor, buildItems, calculateSLOMastery, masteryLabel,
  generateRemediation, generateReassessment, pickForLevel, adjustLevel,
  recommendReading, gradeItem
} from "./engine.js";
import { runAttempt, showResult, questionHTML, bindQuestion, readAnswer, summarizeResults } from "./assess.js";
import { awardXP, xpForAttempt, checkBadges } from "./gamify.js";
import { esc } from "./utils.js";
import { masteryMap } from "./dashboard.js";
import { showScreen as show } from "./ui.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGo(fn) { go = fn; }

// Tracks one learning cycle so remediation never repeats seen questions.
let cycle = null;
function newCycle(sloId) { cycle = { sloId: sloId, usedKeys: [] }; }
function noteUsed(keys) { if (cycle) { keys.forEach(function (k) { if (cycle.usedKeys.indexOf(k) < 0) cycle.usedKeys.push(k); }); } }
function seedFor(tag) {
  return (S.profile.uid || S.profile.name || "student") + "|" + tag + "|" + Date.now();
}

/* ---------------- Learn screen: SLO list ---------------- */
export function renderLearn() {
  const m = masteryMap();
  $("learnGrid").innerHTML = SLOS.map(function (s) {
    const x = m[s.id];
    const lv = S.sloLevel[s.id] || 1;
    const pill = x.status === "mastered" ? '<span class="pill ok">Mastered</span>'
      : x.status === "developing" ? '<span class="pill mid">Developing</span>'
      : x.status === "needs" ? '<span class="pill low">Needs Practice</span>'
      : '<span class="pill">New</span>';
    return '<button class="slo-card" data-slo="' + s.id + '">' +
      "<h3>" + esc(s.title) + "</h3><p>" + esc(s.expl) + "</p>" +
      '<span class="slo-count">Level ' + lv + " of 5</span> " + pill + "</button>";
  }).join("");
  $("learnGrid").querySelectorAll("[data-slo]").forEach(function (b) {
    b.addEventListener("click", function () { openLesson(b.getAttribute("data-slo")); });
  });
}

/* ---------------- Lesson view ---------------- */
export function openLesson(sloId) {
  const slo = sloById(sloId);
  const les = lessonFor(sloId);
  if (!slo || !les) return;
  newCycle(sloId);
  const m = calculateSLOMastery(sloId, S.masteryEv[sloId]);
  const lv = S.sloLevel[sloId] || 1;

  $("lesTitle").textContent = slo.title;
  $("lesMeta").textContent = masteryLabel(m.status) + (m.count ? " · " + m.avg + "% over " + m.count + " attempts" : "") + " · Level " + lv + "/5";
  $("lesBody").innerHTML =
    lessonSec("🎯 Learning Objective", "<p>" + esc(slo.expl) + "</p>") +
    lessonSec("🔥 Warm-up", '<p class="fine">Think first, then reveal.</p><p><strong>' + esc(les.warmup.q) + '</p>' +
      '<button class="btn-ghost btn-sm" id="warmReveal">Show answer</button><p class="hidden warm-a" id="warmA">' + esc(les.warmup.a) + "</p>") +
    lessonSec("📖 Key Points", "<ul>" + les.keyPoints.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>") +
    lessonSec("💡 Examples", les.examples.map(function (e) {
      return '<div class="ex-card"><strong>' + esc(e.en) + "</strong><br><span class='fine'>" + esc(e.note) + "</span></div>";
    }).join("")) +
    lessonSec("✏️ Guided Practice", '<p class="fine">Try these two — use the 💡 hint if you get stuck.</p><div id="guidedBox"></div>');

  function lessonSec(title, body) {
    return '<div class="lesson-sec"><h3>' + title + "</h3>" + body + "</div>";
  }

  $("warmReveal").addEventListener("click", function () { $("warmA").classList.remove("hidden"); $("warmReveal").classList.add("hidden"); });

  // guided practice: 2 bank questions with hints
  const gItems = buildItems({ kind: "slo", ref: sloId, count: 2, seed: seedFor("guided") });
  noteUsed(gItems.map(function (it) { return it.bankKey; }));
  const gb = $("guidedBox");
  gb.innerHTML = gItems.map(function (it, i) { return questionHTML(it, i, gItems.length, { hints: true }); }).join("");
  gItems.forEach(function (it) {
    bindQuestion(it);
    const card = $("card_" + it.uid);
    const btn = document.createElement("button");
    btn.className = "btn-primary btn-sm"; btn.textContent = "Check";
    btn.style.marginTop = "10px";
    btn.addEventListener("click", function () {
      const r = gradeItem(it, readAnswer(it));
      let note = card.querySelector(".guided-note");
      if (!note) { note = document.createElement("div"); note.className = "guided-note"; card.appendChild(note); }
      note.innerHTML = r.score === 1
        ? '<span class="rev-correct">Correct!</span>'
        : '<span class="rev-wrong-note">Not quite — correct answer: ' + esc(String(r.correct)).slice(0, 200) + "</span>";
    });
    card.appendChild(btn);
  });

  $("lesPracticeBtn").onclick = function () { openSetup(sloId, "practice"); };
  $("lesAssessBtn").onclick = function () { openSetup(sloId, "assess"); };
  $("lesBack").onclick = function () { if (go) go("learn"); };
  show("screen-lesson");
}

/* ---------------- setup (count) + launch ---------------- */
let setupCtx = null;
export function openSetup(sloId, mode) {
  // mode: "practice" | "assess"
  const slo = sloId === "mixed" ? null : sloById(sloId);
  setupCtx = { sloId: sloId, mode: mode, count: mode === "assess" ? 10 : 5 };
  $("setupTitle").textContent = (slo ? slo.title : "Mixed Test") + (mode === "assess" ? " — Assessment" : " — Practice");
  $("setupSub").textContent = mode === "assess"
    ? "Timed, one attempt, anti-copying on. Your score updates your SLO mastery."
    : "Relaxed practice with hints. No timer, no locks — learn at your pace.";
  const counts = mode === "assess" ? [10, 15, 20] : [5, 10, 15];
  const row = $("setupCounts");
  row.innerHTML = "";
  counts.forEach(function (n) {
    const b = document.createElement("button");
    b.className = "count-btn" + (n === setupCtx.count ? " active" : "");
    b.textContent = n;
    b.addEventListener("click", function () {
      row.querySelectorAll(".count-btn").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      setupCtx.count = n;
    });
    row.appendChild(b);
  });
  if (mode === "practice") newCycle(sloId); // fresh cycle for practice too
  show("screen-setup");
}

export function launchSetup() {
  if (!setupCtx) return;
  const { sloId, mode, count } = setupCtx;
  const lv = sloId === "mixed" ? 3 : (S.sloLevel[sloId] || 1);
  const seed = seedFor(mode + "-" + sloId);
  let items;
  if (sloId === "mixed") {
    items = buildItems({ kind: "mixed", count: count, seed: seed, exclude: new Set(cycle ? cycle.usedKeys : []) });
  } else {
    const refs = pickForLevel(sloById(sloId), mode === "practice" ? Math.min(lv + 1, 5) : lv, count, new Set(cycle ? cycle.usedKeys : []));
    items = buildItems({ kind: "refs", refs: refs, count: count, seed: seed });
  }
  if (!items.length) { alert("No fresh questions left — great job, you have seen them all!"); return; }
  noteUsed(items.map(function (it) { return it.bankKey; }));

  if (mode === "practice") {
    runAttempt({
      title: (sloId === "mixed" ? "Mixed Practice" : sloById(sloId).title + " Practice"),
      items: items, timePerQ: 0, antiCopy: false, hints: true, lockKey: null,
      onDone: function (out) {
        showResult({
          title: "Practice Complete", scoreLine: out.pct + "%",
          metaLine: out.totalScore + " of " + out.items.length + " marks · hints were on, so this does not change mastery",
          results: out.results, perSlo: out.perSlo,
          actions: [
            { label: "Practice Again (new questions)", primary: true, fn: function () { openSetup(sloId, "practice"); } },
            { label: "Take the Assessment", fn: function () { openSetup(sloId, "assess"); } }
          ].concat(sloId === "mixed" ? [] : [{ label: "Back to Lesson", fn: function () { openLesson(sloId); } }])
        });
      }
    });
  } else {
    const lockKey = (S.profile.uid || S.profile.name || "s").toLowerCase() + "|assess|" + sloId + "|" + count;
    runAttempt({
      title: (sloId === "mixed" ? "Mixed Assessment" : sloById(sloId).title + " Assessment"),
      items: items, timePerQ: 60, antiCopy: true, hints: false, lockKey: lockKey, lockLabel: "assessment",
      onDone: function (out) { finishAssessment(sloId, out, lockKey); }
    });
  }
}

function finishAssessment(sloId, out, lockKey) {
  const att = {
    lockKey: lockKey, student: S.profile.name, kind: sloId === "mixed" ? "mixed" : "slo",
    ref: sloId, title: out.title, mode: "assessment",
    score: out.totalScore, total: out.items.length, pct: out.pct,
    perSlo: out.perSlo, tabs: out.tabs, secs: out.secs, usedKeys: out.usedKeys,
    answers: summarizeResults(out.results)
  };
  recordAttempt(att);
  awardXP(xpForAttempt({ mode: "assessment", results: out.results }), "assessment complete");
  checkBadges();
  // adaptive difficulty per SLO
  Object.keys(out.perSlo).forEach(function (id) {
    if (id === "story") return;
    const p = out.perSlo[id];
    const pc = Math.round(p.score / p.total * 100);
    S.sloLevel[id] = adjustLevel(S.sloLevel[id] || 1, pc);
  });
  save();

  const m = sloId === "mixed" ? null : calculateSLOMastery(sloId, S.masteryEv[sloId]);
  const banner = m ? masteryBanner(sloId, m) : "";
  const actions = [];
  if (m && (m.status === "needs" || m.status === "developing")) {
    actions.push({ label: "🔧 Start Remediation", primary: true, fn: function () { startRemediation(sloId, out.results); } });
  }
  actions.push({ label: "📖 Recommended Reading", fn: function () { showReadingRec(sloId); } });
  actions.push({ label: "Back Home", fn: function () { go("home"); } });

  showResult({
    title: out.title, scoreLine: out.pct + "%",
    metaLine: out.totalScore + " of " + out.items.length + " marks · " + fmtSecs(out.secs) + " · tab switches: " + out.tabs,
    bannerHTML: banner,
    results: out.results, perSlo: out.perSlo, actions: actions
  });
}

function masteryBanner(sloId, m) {
  const slo = sloById(sloId);
  if (m.status === "mastered") {
    return '<div class="notice good">🎉 <strong>' + esc(slo.title) + ": Mastered!</strong> " +
      "You scored " + m.avg + "% across " + m.count + " assessments. Keep it up!</div>";
  }
  if (m.status === "developing") {
    return '<div class="notice">📈 <strong>' + esc(slo.title) + ": Developing</strong> (" + m.avg +
      "%). A short remediation will fix the weak spots.</div>";
  }
  return '<div class="notice warn">🔧 <strong>' + esc(slo.title) + ": Needs Practice</strong> (" + m.avg +
    "%). Let's fix it with a targeted remediation.</div>";
}

function fmtSecs(s) {
  const m = Math.floor(s / 60), ss = s % 60;
  return (m < 10 ? "0" + m : m) + ":" + (ss < 10 ? "0" + ss : ss);
}

/* ---------------- remediation ---------------- */
export function startRemediation(sloId, gradedResults) {
  const rem = generateRemediation(sloId, gradedResults, cycle ? cycle.usedKeys : []);
  const slo = sloById(sloId);
  let html = '<div class="screen-head"><button class="back-btn" data-go="screen-lesson">← Back to Lesson</button>' +
    "<h2>Remediation: " + esc(slo.title) + "</h2><p>Targeted practice on exactly what you missed — never the same questions.</p></div>";

  if (rem.miniLesson) {
    html += '<div class="lesson-sec"><h3>📖 Mini Lesson</h3><ul>' +
      rem.miniLesson.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
      rem.miniLesson.examples.map(function (e) {
        return '<div class="ex-card"><strong>' + esc(e.en) + "</strong><br><span class='fine'>" + esc(e.note) + "</span></div>";
      }).join("") + "</div>";
  }
  if (rem.missedTypes.length) {
    html += '<p class="fine">Focus areas: ' + rem.missedTypes.map(esc).join(", ") + "</p>";
  }
  html += '<div class="lesson-sec"><h3>✏️ Targeted Practice (' + rem.practiceRefs.length + ' fresh questions)</h3>' +
    '<div id="remBox"></div></div>';
  html += '<div class="lesson-sec"><h3>🚀 Application Activity</h3><p>' + esc(rem.application) + "</p>" +
    '<textarea class="short-input" id="remApplyText" placeholder="Write your answer here"></textarea>' +
    '<button class="btn-ghost btn-sm" id="remApplyDone">Mark as done</button> ' +
    '<span class="fine" id="remApplyNote"></span></div>';
  html += '<button class="btn-primary btn-big" id="remReassess">Take Reassessment →</button>';

  $("remBody").innerHTML = html;
  show("screen-remedy");

  // targeted practice items (fresh, never from the original worksheet)
  const items = buildItems({ kind: "refs", refs: rem.practiceRefs, count: rem.practiceRefs.length, seed: seedFor("remediation") });
  noteUsed(items.map(function (it) { return it.bankKey; }));
  const box = $("remBox");
  box.innerHTML = items.length
    ? items.map(function (it, i) { return questionHTML(it, i, items.length, { hints: true }); }).join("")
    : '<p class="fine">You have already seen every question in this bank — excellent coverage!</p>';
  items.forEach(function (it) {
    bindQuestion(it);
    const card = $("card_" + it.uid);
    const btn = document.createElement("button");
    btn.className = "btn-primary btn-sm"; btn.textContent = "Check"; btn.style.marginTop = "10px";
    btn.addEventListener("click", function () {
      const r = gradeItem(it, readAnswer(it));
      let note = card.querySelector(".guided-note");
      if (!note) { note = document.createElement("div"); note.className = "guided-note"; card.appendChild(note); }
      note.innerHTML = r.score === 1 ? '<span class="rev-correct">Correct!</span>'
        : '<span class="rev-wrong-note">Correct answer: ' + esc(String(r.correct)).slice(0, 200) + "</span>";
    });
    card.appendChild(btn);
  });

  $("remApplyDone").addEventListener("click", function () {
    const v = $("remApplyText").value.trim();
    $("remApplyNote").textContent = v.length > 10 ? "Saved. Good work!" : "Write a little more first.";
  });
  document.querySelector('#screen-remedy [data-go="screen-lesson"]').addEventListener("click", function () { openLesson(sloId); });

  $("remReassess").addEventListener("click", function () { startReassessment(sloId); });
}

export function startReassessment(sloId) {
  const refs = generateReassessment(sloId, cycle ? cycle.usedKeys : [], 8, S.sloLevel[sloId] || 2);
  if (!refs.length) { alert("No fresh questions left for reassessment."); return; }
  const items = buildItems({ kind: "refs", refs: refs, count: refs.length, seed: seedFor("reassess") });
  noteUsed(items.map(function (it) { return it.bankKey; }));
  const lockKey = (S.profile.uid || S.profile.name || "s").toLowerCase() + "|reassess|" + sloId + "|" + Date.now();
  runAttempt({
    title: sloById(sloId).title + " — Reassessment",
    items: items, timePerQ: 60, antiCopy: true, hints: false, lockKey: null,
    onDone: function (out) {
      const att = {
        lockKey: lockKey, student: S.profile.name, kind: "slo", ref: sloId,
        title: out.title, mode: "reassessment",
        score: out.totalScore, total: out.items.length, pct: out.pct,
        perSlo: out.perSlo, tabs: out.tabs, secs: out.secs, usedKeys: out.usedKeys,
        answers: summarizeResults(out.results)
      };
      recordAttempt(att);
      awardXP(xpForAttempt({ mode: "reassessment", results: out.results }), "reassessment complete");
      checkBadges();
      const p = out.perSlo[sloId];
      const pc = p ? Math.round(p.score / p.total * 100) : out.pct;
      S.sloLevel[sloId] = adjustLevel(S.sloLevel[sloId] || 1, pc);
      save();
      const m = calculateSLOMastery(sloId, S.masteryEv[sloId]);
      showResult({
        title: out.title, scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks",
        bannerHTML: masteryBanner(sloId, m),
        results: out.results, perSlo: out.perSlo,
        actions: [
          { label: "📖 Recommended Reading", primary: true, fn: function () { showReadingRec(sloId); } },
          { label: "Back Home", fn: function () { go("home"); } }
        ]
      });
    }
  });
}

function showReadingRec(sloId) {
  const doneIds = Object.keys(S.reading || {});
  const rec = recommendReading(doneIds, sloId);
  showResult({
    title: "Recommended Reading",
    scoreLine: "📚",
    metaLine: "Matched to your work on " + (sloId === "mixed" ? "mixed skills" : sloById(sloId).title),
    bannerHTML: '<div class="notice">Because you practiced <strong>' + esc(sloId === "mixed" ? "mixed skills" : sloById(sloId).title) +
      '</strong>, try this story next:<br><br><strong>' + esc(rec.title) + "</strong> <span class='fine'>" + esc(rec.difficulty) +
      " · ~" + rec.minutes + " min</span><br><span class='fine'>" + esc(rec.moral) + "</span></div>",
    results: [], perSlo: {}, showSloBars: false,
    actions: [
      { label: "Read It Now", primary: true, fn: function () { go("story", rec.id); } },
      { label: "Back Home", fn: function () { go("home"); } }
    ]
  });
}


