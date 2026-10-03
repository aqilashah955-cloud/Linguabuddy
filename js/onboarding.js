// LinguaBuddy — first-time onboarding.
// Step 1: name · Step 2: learning goals (multi-select) ·
// Step 3: English level ("I don't know" → 15-question placement test,
// labeled as an estimate, never a certification) → "Your personalized
// learning path is ready!"

import { S, save, touchStreak } from "./store.js";
import { GOAL_OPTS, LEVEL_OPTS } from "./auth.js";
import { buildPlacementItems, placementLevel } from "./engine.js";
import { runAttempt, showResult } from "./assess.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";

function $(id) { return document.getElementById(id); }

let onDone = null;
export function setOnboardingDone(fn) { onDone = fn; }
function done() { if (onDone) onDone(); }

export function startOnboarding() {
  $("obName").value = S.profile.name || "";
  renderGoalChips();
  renderLevelOpts();
  renderAgeOpts();
  show("screen-ob-name");
}

function renderGoalChips() {
  $("obGoals").innerHTML = GOAL_OPTS.map(function (g) {
    const on = (S.profile.goals || []).indexOf(g) >= 0 ? " on" : "";
    return '<button type="button" class="chipbtn' + on + '" data-goal="' + g + '">' + g + "</button>";
  }).join("");
  $("obGoals").querySelectorAll("[data-goal]").forEach(function (b) {
    b.addEventListener("click", function () { b.classList.toggle("on"); });
  });
}

function renderLevelOpts() {
  const opts = LEVEL_OPTS.concat(["I don't know"]);
  $("obLevels").innerHTML = opts.map(function (l) {
    const on = S.profile.level === l ? " on" : "";
    return '<button type="button" class="chipbtn big' + on + '" data-level="' + l + '">' + l + "</button>";
  }).join("");
  $("obLevels").querySelectorAll("[data-level]").forEach(function (b) {
    b.addEventListener("click", function () {
      $("obLevels").querySelectorAll("[data-level]").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
    });
  });
}

function chosenGoals() {
  const out = [];
  $("obGoals").querySelectorAll(".chipbtn.on").forEach(function (b) { out.push(b.getAttribute("data-goal")); });
  return out;
}
function chosenLevel() {
  const b = $("obLevels").querySelector(".chipbtn.on");
  return b ? b.getAttribute("data-level") : "";
}

export const AGE_OPTS = [
  ["kids", "🧒 Kids (5–8)"],
  ["juniors", "🧑 Juniors (9–12)"],
  ["teens", "🎓 Teens & Adults (13+)"]
];

function renderAgeOpts() {
  $("obAges").innerHTML = AGE_OPTS.map(function (a) {
    const on = S.profile.ageGroup === a[0] ? " on" : "";
    return '<button type="button" class="chipbtn big' + on + '" data-age="' + a[0] + '">' + a[1] + "</button>";
  }).join("");
  $("obAges").querySelectorAll("[data-age]").forEach(function (b) {
    b.addEventListener("click", function () {
      $("obAges").querySelectorAll("[data-age]").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
    });
  });
}
function chosenAge() {
  const b = $("obAges").querySelector(".chipbtn.on");
  return b ? b.getAttribute("data-age") : "";
}

export function initOnboarding() {
  $("obNameNext").addEventListener("click", function () {
    const v = $("obName").value.trim();
    if (!v) { $("obNameErr").textContent = "What should we call you?"; return; }
    S.profile.name = v; save();
    show("screen-ob-goals");
  });
  $("obGoalsBack").addEventListener("click", function () { show("screen-ob-name"); });
  $("obGoalsNext").addEventListener("click", function () {
    S.profile.goals = chosenGoals(); save();
    show("screen-ob-level");
  });
  $("obLevelBack").addEventListener("click", function () { show("screen-ob-goals"); });
  $("obLevelNext").addEventListener("click", function () {
    const lv = chosenLevel();
    if (!lv) { $("obLevelErr").textContent = "Pick the closest level — or choose “I don't know”."; return; }
    if (lv === "I don't know") { startPlacement(); return; }
    S.profile.level = lv; save();
    show("screen-ob-age");
  });
  $("obAgeBack").addEventListener("click", function () { show("screen-ob-level"); });
  $("obAgeNext").addEventListener("click", function () {
    const ag = chosenAge();
    if (!ag) { $("obAgeErr").textContent = "Pick the age group that fits best."; return; }
    S.profile.ageGroup = ag;
    S.profile.onboarded = true; save();
    touchStreak();
    finishOnboarding();
  });
  $("obReadyBtn").addEventListener("click", function () { done(); });
}

function finishOnboarding() {
  $("obReadyText").innerHTML =
    "Welcome, <strong>" + esc(S.profile.name) + "</strong>!<br>" +
    "Your level: <strong>" + esc(S.profile.level || "Beginner") + "</strong>" +
    (S.profile.goals && S.profile.goals.length ? "<br>Goals: " + esc(S.profile.goals.join(", ")) : "") +
    "<br><br><strong>Your personalized English learning path is ready!</strong>";
  show("screen-ob-ready");
}

function startPlacement() {
  const seed = "placement-" + Date.now();
  const items = buildPlacementItems(seed);
  runAttempt({
    title: "Placement Check",
    items: items,
    timePerQ: 0,
    antiCopy: false,
    hints: false,
    lockKey: null,
    onDone: function (out) {
      const level = placementLevel(out.pct);
      S.profile.level = level;
      S.placement = { pct: out.pct, level: level, date: Date.now() };
      save();
      showResult({
        title: "Your Placement Estimate",
        scoreLine: level,
        metaLine: "You scored " + out.pct + "% on the placement check.",
        bannerHTML: '<div class="notice">This is a <strong>learning placement estimate</strong> to set your starting level — not an official language certification.</div>',
        results: out.results,
        perSlo: out.perSlo,
        actions: [
          { label: "Continue", primary: true, fn: function () { show("screen-ob-age"); } }
        ]
      });
    }
  });
}
