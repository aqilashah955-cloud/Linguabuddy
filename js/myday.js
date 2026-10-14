// LinguaBuddy — ☀️ My Day: a guided daily flow.
// A short, honest daily checklist built from the student's real state —
// whatever they already did today is checked automatically. Overdue
// assignments and weak SLOs surface as catch-up, never as fake progress.
// "Start my day" walks through the list one item at a time.
// The pure plan logic (greetingFor / buildDayPlan / nextPendingId) is
// DOM-free and node-testable.

import { S } from "./store.js";
import { esc, todayKey } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { mascotSVG } from "./mascot.js";
import { SLOS, calculateSLOMastery, weakestSlo } from "./engine.js";
import { getActiveRemedialPlans, startRemedialPlan, REMEDIAL_BENCHMARK } from "./scheme.js";
import { listOpenAssignments, startAssignment } from "./teacher.js";

let go = null;
export function setMydayGo(fn) { go = fn; }

function $(id) { return document.getElementById(id); }

/* ---------------- pure logic (DOM-free) ---------------- */

export function greetingFor(hour, name) {
  var part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return part + ", " + name + "! ☀️";
}

/**
 * snap: {
 *   name, hour,
 *   checkedIn, attemptsToday, readToday, vocabToday, writeToday,
 *   weakest: {sloId, title} | null,
 *   overdue: [{id, title, dueLabel}],
 *   remedial: [{planId, sloId, title}],
 *   weakSlos: [{sloId, title, avg}]
 * }
 */
export function buildDayPlan(snap) {
  var weak = snap.weakest;
  var items = [
    {
      id: "daily", icon: "📅", title: "Daily English",
      sub: "Word, phrase & idiom of the day",
      dest: "daily", done: !!snap.checkedIn
    },
    {
      id: "practice", icon: "🎯",
      title: weak ? "Practice: " + weak.title : "Start learning",
      sub: "Your weakest area · quick practice",
      dest: "lesson", arg: weak ? weak.sloId : null, done: snap.attemptsToday > 0
    },
    {
      id: "read", icon: "📚", title: "Read a story",
      sub: "15 minutes of reading",
      dest: "read", done: !!snap.readToday
    },
    {
      id: "vocab", icon: "🧠", title: "Learn 3 new words",
      sub: "Grow your word bank",
      dest: "vocab", done: !!snap.vocabToday
    },
    {
      id: "write", icon: "✍️", title: "Write something",
      sub: "Writing Lab or a photo of your work",
      dest: "writing", done: !!snap.writeToday
    }
  ];
  var remIds = {};
  var catchup = [];
  (snap.overdue || []).forEach(function (a) {
    catchup.push({
      id: "asg:" + a.id, icon: "⏰", title: "Overdue: " + a.title,
      sub: "Was due " + a.dueLabel, kind: "catchup",
      action: { type: "assignment", id: a.id }
    });
  });
  (snap.remedial || []).forEach(function (r) {
    remIds[r.sloId] = true;
    catchup.push({
      id: "rem:" + r.planId + ":" + r.sloId, icon: "🩹", title: "Catch up: " + r.title,
      sub: "Your remedial plan is ready", kind: "catchup",
      action: { type: "remedial", planId: r.planId }
    });
  });
  (snap.weakSlos || []).forEach(function (w) {
    if (remIds[w.sloId]) return; // already covered by a remedial plan
    catchup.push({
      id: "weak:" + w.sloId, icon: "📉", title: "Strengthen: " + w.title,
      sub: w.avg + "% — below the " + REMEDIAL_BENCHMARK + "% benchmark", kind: "catchup",
      action: { type: "lesson", sloId: w.sloId }
    });
  });
  var doneCount = items.filter(function (i) { return i.done; }).length;
  return {
    greeting: greetingFor(snap.hour, snap.name),
    items: items, catchup: catchup,
    doneCount: doneCount, total: items.length,
    allDone: doneCount === items.length
  };
}

/** First checklist item still open — the walkthrough's next step. */
export function nextPendingId(plan) {
  for (var i = 0; i < plan.items.length; i++) {
    if (!plan.items[i].done) return plan.items[i].id;
  }
  return null;
}

/* ---------------- state snapshot (browser) ---------------- */

var asgCache = {};   // assignment id -> assignment object (for catch-up actions)
var walk = null;     // {order:[ids]} while "Start my day" is running

function dayStart() {
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

async function buildSnap(skipAssignments) {
  var start = dayStart(), now = Date.now(), tk = todayKey();
  var m = {};
  SLOS.forEach(function (s) {
    m[s.id] = calculateSLOMastery(s.id, (S.masteryEv || {})[s.id]);
  });
  var weak = weakestSlo(m);
  var weakSlos = SLOS
    .map(function (s) {
      var e = m[s.id] || {};
      return { sloId: s.id, title: s.title, avg: e.avg, count: e.count };
    })
    .filter(function (w) { return w.count > 0 && w.avg < REMEDIAL_BENCHMARK; })
    .sort(function (a, b) { return a.avg - b.avg; })
    .slice(0, 2);
  var remedial = [];
  try {
    getActiveRemedialPlans().forEach(function (p) {
      (p.slos || []).forEach(function (s) {
        remedial.push({ planId: p.id, sloId: s.id, title: s.title });
      });
    });
  } catch (e) { /* scheme data unavailable */ }
  var overdue = [];
  if (!skipAssignments) {
    try {
      var open = await listOpenAssignments();
      asgCache = {};
      open.forEach(function (a) {
        if (a.dueAt && new Date(a.dueAt).getTime() < now) {
          asgCache[a.id] = a;
          overdue.push({ id: a.id, title: a.title, dueLabel: a.dueAt });
        }
      });
    } catch (e) { /* assignments unavailable — checklist still works */ }
  }
  var reading = S.reading || {};
  return {
    name: (S.profile && S.profile.name) || "Learner",
    hour: new Date().getHours(),
    checkedIn: !!((S.dailyCheck || {})[tk]),
    attemptsToday: (S.attempts || []).filter(function (a) { return (a.date || 0) >= start; }).length,
    readToday: Object.keys(reading).some(function (k) { return ((reading[k] || {}).date || 0) >= start; }),
    vocabToday: (S.vocab || []).some(function (w) { return (w.addedAt || 0) >= start; }),
    writeToday: (S.writing || []).some(function (w) { return (w.date || 0) >= start; }) ||
      ((S.mywork || []).some(function (w) { return (w.createdAt || 0) >= start; })),
    weakest: weak && weak.sloId ? { sloId: weak.sloId, title: weak.title } : null,
    overdue: overdue, remedial: remedial, weakSlos: weakSlos
  };
}

/* ---------------- actions ---------------- */

function doItem(it) {
  if (it.action) {
    var a = it.action;
    if (a.type === "assignment" && asgCache[a.id]) { startAssignment(asgCache[a.id]); return; }
    if (a.type === "remedial") { startRemedialPlan(a.planId); return; }
    if (a.type === "lesson" && go) { go("lesson", a.sloId); return; }
  }
  if (go) go(it.dest, it.arg);
}

/* ---------------- rendering ---------------- */

function itemRow(it) {
  return '<button class="myday-row' + (it.done ? " done" : "") + '" data-myday="' + esc(it.id) + '">' +
    '<span class="myday-check">' + (it.done ? "✅" : "⬜") + "</span>" +
    '<span class="tr-emoji">' + it.icon + "</span>" +
    '<span class="tr-text"><strong>' + esc(it.title) + "</strong><br><span class='fine'>" + esc(it.sub) + "</span></span>" +
    "<span class='mc-arrow'>→</span></button>";
}

function progressHTML(plan) {
  var pct = Math.round(plan.doneCount / plan.total * 100);
  return '<div class="myday-progress"><div class="myday-progress-top"><span><strong>' +
    plan.doneCount + " of " + plan.total + "</strong> done today</span><span>" + pct + "%</span></div>" +
    '<div class="slo-bar-track"><div class="slo-bar-fill" style="width:' + pct + '%"></div></div></div>';
}

function renderPlan(plan) {
  var body = $("mydayBody");
  var html = '<div class="screen-head"><button class="back-btn" id="mydayBack">← Home</button>' +
    "<h2>☀️ My Day</h2></div>";
  html += '<div class="lingoo-hello">' + mascotSVG("wave") +
    '<div class="lingoo-bubble">' + esc(plan.greeting) +
    (plan.allDone ? " You finished everything — brilliant! 🎉" : " Here's your plan for today.") + "</div></div>";
  html += progressHTML(plan);
  if (!plan.allDone) {
    html += '<div class="row-btns"><button class="btn-primary btn-big" id="mydayStart">▶ Start my day</button></div>';
  }
  html += '<h3 class="sec-title">Today\'s checklist</h3><div>' +
    plan.items.map(itemRow).join("") + "</div>";
  if (plan.catchup.length) {
    html += '<h3 class="sec-title">📬 Catch up</h3><div>' +
      plan.catchup.map(itemRow).join("") + "</div>";
  }
  html += '<div class="card myday-help"><h3>🙋 I need help</h3>' +
    '<p class="fine">Stuck on something? Ask away — no question is too small.</p>' +
    '<div class="row-btns"><button class="btn-primary" id="mydayAsk">🤖 Ask AI Teacher</button>' +
    '<button class="btn-ghost" id="mydayTeacher">👩‍🏫 Message my teacher</button></div></div>';
  body.innerHTML = html;

  $("mydayBack").addEventListener("click", function () { walk = null; if (go) go("home"); });
  var startBtn = $("mydayStart");
  if (startBtn) startBtn.addEventListener("click", function () {
    walk = { order: plan.items.map(function (i) { return i.id; }) };
    renderMyday();
  });
  $("mydayAsk").addEventListener("click", function () { if (go) go("ask"); });
  $("mydayTeacher").addEventListener("click", function () { if (go) go("teachers"); });
  var all = plan.items.concat(plan.catchup);
  body.querySelectorAll("[data-myday]").forEach(function (b) {
    b.addEventListener("click", function () {
      var it = all.filter(function (x) { return x.id === b.getAttribute("data-myday"); })[0];
      if (it) doItem(it);
    });
  });
  show("screen-myday", "home");
}

function renderWalk(plan) {
  var body = $("mydayBody");
  var id = nextPendingId(plan);
  if (!id) {
    walk = null;
    renderPlan(plan);
    return;
  }
  var it = plan.items.filter(function (x) { return x.id === id; })[0];
  var stepNum = plan.doneCount + 1;
  var html = '<div class="screen-head"><button class="back-btn" id="mydayWalkExit">✕ Exit</button>' +
    "<h2>☀️ My Day</h2><p>Step " + stepNum + " of " + plan.total + "</p></div>";
  html += '<div class="myday-walk"><div class="myday-walk-icon">' + it.icon + "</div>" +
    "<h3>" + esc(it.title) + "</h3><p class='fine'>" + esc(it.sub) + "</p>" +
    '<button class="btn-primary btn-big" id="mydayWalkDo">▶ Do it</button>' +
    '<button class="btn-ghost" id="mydayWalkSkip">Skip for now →</button></div>';
  body.innerHTML = html;
  $("mydayWalkExit").addEventListener("click", function () { walk = null; renderMyday(); });
  $("mydayWalkDo").addEventListener("click", function () { doItem(it); });
  $("mydayWalkSkip").addEventListener("click", function () {
    walk.order = walk.order.filter(function (x) { return x !== id; });
    renderWalk(plan);
  });
  show("screen-myday", "home");
}

export async function renderMyday() {
  var body = $("mydayBody");
  if (body) body.innerHTML = '<p class="fine">Planning your day…</p>';
  var snap = await buildSnap(false);
  var plan = buildDayPlan(snap);
  if (walk) renderWalk(plan);
  else renderPlan(plan);
}

/** Compact hero card for the home dashboard (checklist progress only). */
export async function renderMydayCard() {
  var el = $("mydayCard");
  if (!el) return;
  var snap = await buildSnap(true);
  var plan = buildDayPlan(snap);
  var pct = Math.round(plan.doneCount / plan.total * 100);
  el.innerHTML = '<span class="hc-emoji">☀️</span>' +
    '<span class="hc-title">My Day: ' + plan.doneCount + " of " + plan.total + " done</span>" +
    '<span class="hc-sub"><span class="slo-bar-track" style="display:block;margin-top:6px;"><span class="slo-bar-fill" style="display:block;width:' + pct + '%"></span></span>' +
    (plan.allDone ? "Day complete! 🎉" : plan.catchup.length ? "Tap for your guided plan · " + plan.catchup.length + " to catch up on" : "Tap for your guided plan") + "</span>";
  el.onclick = function () { if (go) go("myday"); };
}
