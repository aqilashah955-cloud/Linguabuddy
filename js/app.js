// LinguaBuddy — app entry: init, router, bottom nav, profile screen.
// Firebase-first when configured; fully local otherwise.

import { showScreen } from "./ui.js";
import { S, save, wipeAll } from "./store.js";
import { fb, initFirebase, getUserDoc, signOut, onAuthChange, isConfigured } from "./firebase.js";
import { SLOS, sloById } from "./engine.js";
import { esc } from "./utils.js";
import { renderAuth, initAuthUI, setAuthDone } from "./auth.js";
import { startOnboarding, initOnboarding, setOnboardingDone } from "./onboarding.js";
import { renderDashboard, renderProgress, setGo as setDashGo } from "./dashboard.js";
import { renderLearn, openLesson, openSetup, launchSetup, setGo as setLearnGo, startRemediation } from "./learn.js";
import { renderLibrary, openStory, startStoryQuiz, setGo as setReadGo } from "./reading.js";
import { renderVocab, initVocab, setGo as setVocabGo } from "./vocab.js";
import { submitAttempt, quitAttempt } from "./assess.js";
import { renderTeacher, openClass, renderStudentAssignments, setTeacherGo, isTeacher, isAdmin } from "./teacher.js";
import { renderAdmin, setAdminGo } from "./admin.js";
import { renderGrammar, setGrammarGo } from "./grammar.js";
import { renderWriting, setWritingGo } from "./writing.js";
import { renderConvo, setConvoGo } from "./convo.js";
import { renderAsk, setAskGo } from "./ask.js";
import { renderGames, setGamesGo } from "./games.js";
import { renderMywork, setMyworkGo } from "./mywork.js";
import { showKidsHome, setKidsGo } from "./kids.js";
import { showWorksheets, setWorksheetsGo } from "./worksheets.js";
import { renderDaily, renderSayIt, renderParents } from "./engage.js";
import { showCerts, setCertsGo } from "./certs.js";
import { showTestprep, setTestprepGo } from "./testprep.js";
import { showPro, setProGo } from "./pro.js";
import { showMoreTests, setMoreTestsGo } from "./moretests.js";
import { showBuddies, setBuddiesGo } from "./buddies.js";
import { needsGate, ensureTrial, renderSubscribe, setBillingGo } from "./billing.js";
import { renderAKHub, setGo as setAkGo } from "./scheme.js";
import { warmVoices } from "./tts.js";
import { badgeList } from "./gamify.js";
import { LEVEL_OPTS, GOAL_OPTS } from "./auth.js";

function $(id) { return document.getElementById(id); }

/* ---------------- router ---------------- */
let browseMode = "practice";
export function go(dest, arg) {
  // Subscription gate: expired students see only the subscribe screen (and
  // their profile). Teachers/admins and active trials/subs pass through.
  const hadTrial = !!S.profile.trialStart;
  if (dest !== "subscribe" && dest !== "profile" && needsGate(S.profile, Date.now())) {
    if (!hadTrial) save(); // persist a just-started trial
    renderSubscribe();
    return;
  }
  switch (dest) {
    case "home": renderDashboard(); showScreen("screen-home", "home"); break;
    case "learn": renderLearn(); showScreen("screen-learn", "learn"); break;
    case "lesson": openLesson(arg); break;
    case "practice":
      if (arg) openSetup(arg, "practice");
      else { browseMode = "practice"; renderBrowse(); showScreen("screen-browse", "practice"); }
      break;
    case "assess":
      if (arg) openSetup(arg, "assess");
      else { browseMode = "assess"; renderBrowse(); showScreen("screen-browse", "assess"); }
      break;
    case "read": renderLibrary(); showScreen("screen-library", "read"); break;
    case "story": openStory(arg); break;
    case "vocab": renderVocab(); showScreen("screen-vocab", "vocab"); break;
    case "grammar": renderGrammar(); showScreen("screen-grammar", "grammar"); break;
    case "writing": renderWriting(); showScreen("screen-writing", "writing"); break;
    case "convo": renderConvo(); showScreen("screen-convo", "convo"); break;
    case "ask": renderAsk(); showScreen("screen-ask", "ask"); break;
    case "games": renderGames(); showScreen("screen-games", "games"); break;
    case "mywork": renderMywork(); break;
    case "kids": showKidsHome(); break;
    case "worksheets": showWorksheets(); break;
    case "daily": renderDaily(); showScreen("screen-daily", "daily"); break;
    case "sayit": renderSayIt(); showScreen("screen-sayit", "sayit"); break;
    case "parents": renderParents(); showScreen("screen-parents", "parents"); break;
    case "certs": showCerts(); break;
    case "testprep": showTestprep(); break;
    case "pro": showPro(); break;
    case "moretests": showMoreTests(); break;
    case "buddies": showBuddies(); break;
    case "ak": renderAKHub(); showScreen("screen-ak"); break;
    case "teacher": renderTeacher(); break;
    case "class": openClass(arg); break;
    case "admin": renderAdmin(); break;
    case "progress": renderProgress(); showScreen("screen-progress", "progress"); break;
    case "profile": renderProfile(); showScreen("screen-profile", "profile"); break;
    default: renderDashboard(); showScreen("screen-home", "home");
  }
}

function renderBrowse() {
  const practice = browseMode === "practice";
  $("browseTitle").textContent = practice ? "Practice Worksheets" : "Assessments";
  $("browseSub").textContent = practice
    ? "Relaxed practice with hints — no timer, no locks."
    : "Timed assessments with anti-copying. Scores update your SLO mastery.";
  $("browseGrid").innerHTML =
    '<button class="mixed-card" id="browseMixed"><span class="mc-emoji">🎲</span>' +
    '<span class="mc-text"><strong>Mixed ' + (practice ? "Practice" : "Test") + "</strong><br>Questions from all 15 SLOs</span>" +
    '<span class="mc-arrow">→</span></button>' +
    '<div class="slo-grid">' + SLOS.map(function (s) {
      return '<button class="slo-card" data-slo="' + s.id + '"><h3>' + esc(s.title) + "</h3><p>" + esc(s.expl) + "</p>" +
        '<span class="slo-count">' + s.questions.length + " questions</span></button>";
    }).join("") + "</div>";
  $("browseMixed").addEventListener("click", function () { openSetup("mixed", browseMode); });
  $("browseGrid").querySelectorAll("[data-slo]").forEach(function (b) {
    b.addEventListener("click", function () { openSetup(b.getAttribute("data-slo"), browseMode); });
  });
}

/* Show/hide role-gated nav buttons. */
export function refreshNav() {
  document.querySelectorAll('[data-role="teacher"]').forEach(function (b) {
    b.classList.toggle("hidden", !isTeacher());
  });
  document.querySelectorAll('[data-role="admin"]').forEach(function (b) {
    b.classList.toggle("hidden", !isAdmin());
  });
}

/* ---------------- profile ---------------- */
function renderProfile() {
  const p = S.profile;
  $("pfName").textContent = p.name || "—";
  $("pfMeta").textContent =
    (p.loginId ? "ID: " + p.loginId + " · " : "") +
    (p.email ? p.email + " · " : "") +
    "Role: " + (p.role || "student");
  $("pfLevel").innerHTML = LEVEL_OPTS.map(function (l) {
    return '<option value="' + l + '"' + (p.level === l ? " selected" : "") + ">" + l + "</option>";
  }).join("");
  var ageOpts = [
    ["kids", "🧒 Kids (5–8)"],
    ["juniors", "🧑 Juniors (9–12)"],
    ["teens", "🎓 Teens & Adults (13+)"]
  ];
  $("pfAge").innerHTML = ageOpts.map(function (a) {
    return '<button type="button" class="chipbtn' + (p.ageGroup === a[0] ? " on" : "") +
      '" data-age="' + a[0] + '">' + a[1] + "</button>";
  }).join("");
  $("pfAge").querySelectorAll("[data-age]").forEach(function (b) {
    b.addEventListener("click", function () {
      $("pfAge").querySelectorAll("[data-age]").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
    });
  });
  $("pfGoals").innerHTML = GOAL_OPTS.map(function (g) {
    const on = (p.goals || []).indexOf(g) >= 0 ? " on" : "";
    return '<button type="button" class="chipbtn' + on + '" data-goal="' + g + '">' + g + "</button>";
  }).join("");
  $("pfGoals").querySelectorAll("[data-goal]").forEach(function (b) {
    b.addEventListener("click", function () { b.classList.toggle("on"); });
  });
  $("pfStreak").textContent = "🔥 " + (p.streak || 0) + "-day streak · " + (p.xp || 0) + " XP";
  $("pfOnline").textContent = isConfigured()
    ? (fb().user ? "Signed in online · data syncs to your account" : "Online mode available")
    : "Offline mode — everything is stored on this device";
  // badges
  const badges = badgeList();
  const earned = badges.filter(function (b) { return b.earned; });
  let bh = '<h3 class="sec-title">🏅 Badges (' + earned.length + "/" + badges.length + ")</h3>";
  bh += '<div class="badge-grid">' + badges.map(function (b) {
    return '<div class="badge-card' + (b.earned ? "" : " locked") + '" title="' + esc(b.desc) + '">' +
      '<div class="badge-emoji">' + (b.earned ? b.emoji : "🔒") + '</div><div class="badge-name">' + esc(b.name) + "</div></div>";
  }).join("") + "</div>";
  let bd = $("badgeBox");
  if (!bd) {
    bd = document.createElement("div");
    bd.id = "badgeBox";
    $("pfSaved").parentNode.appendChild(bd);
  }
  bd.innerHTML = bh;
}

function initProfile() {
  $("pfSave").addEventListener("click", function () {
    S.profile.level = $("pfLevel").value;
    const g = [];
    $("pfGoals").querySelectorAll(".chipbtn.on").forEach(function (b) { g.push(b.getAttribute("data-goal")); });
    S.profile.goals = g;
    const ab = $("pfAge").querySelector(".chipbtn.on");
    if (ab) S.profile.ageGroup = ab.getAttribute("data-age");
    save();
    $("pfSaved").textContent = "Saved ✓";
    setTimeout(function () { $("pfSaved").textContent = ""; }, 2000);
  });
  $("logoutBtn").addEventListener("click", async function () {
    if (!confirm("Log out? Your progress on this device will be erased.")) return;
    await signOut();
    wipeAll(false);
    renderAuth();
    showScreen("screen-auth", null);
  });
}

/* ---------------- boot ---------------- */
function enterApp() {
  refreshNav();
  if (needsGate(S.profile, Date.now())) { renderSubscribe(); return; }
  if (!S.profile.onboarded) startOnboarding();
  else go("home");
}

async function boot() {
  // wire go() into modules
  [setDashGo, setLearnGo, setReadGo, setVocabGo,
   setTeacherGo, setAdminGo, setGrammarGo, setWritingGo, setConvoGo, setAskGo, setGamesGo, setMyworkGo,
   setKidsGo, setWorksheetsGo, setCertsGo,
   setTestprepGo, setProGo, setMoreTestsGo, setBuddiesGo, setBillingGo, setAkGo]
    .forEach(function (fn) { fn(go); });
  warmVoices();
  setAuthDone(function () { enterApp(); });
  setOnboardingDone(function () { go("home"); });

  renderAuth();
  initAuthUI();
  initOnboarding();
  initVocab();
  initProfile();

  // bottom nav
  document.querySelectorAll(".navbtn").forEach(function (b) {
    b.addEventListener("click", function () { go(b.getAttribute("data-nav")); });
  });
  document.querySelectorAll("[data-gohome]").forEach(function (b) {
    b.addEventListener("click", function () { go("home"); });
  });
  $("gateBack").addEventListener("click", function () { go("home"); });

  // attempt screen buttons
  $("submitBtn").addEventListener("click", function () { submitAttempt(false); });
  $("attemptQuit").addEventListener("click", quitAttempt);
  $("beginBtn").addEventListener("click", launchSetup);
  $("stQuizBtn").addEventListener("click", startStoryQuiz);

  await initFirebase();
  if (isConfigured()) {
    onAuthChange(async function (u) {
      if (u) {
        const doc = await getUserDoc(u.uid);
        if (doc) {
          S.profile.name = doc.name || S.profile.name;
          S.profile.loginId = doc.loginId || "";
          S.profile.email = doc.email || "";
          S.profile.uid = u.uid;
          S.profile.role = doc.role || "student";
          S.profile.level = doc.level || S.profile.level;
          S.profile.goals = doc.goals || S.profile.goals;
          S.profile.streak = doc.streak || S.profile.streak || 0;
          if (doc.trialStart) S.profile.trialStart = doc.trialStart;
          S.profile.subUntil = doc.subUntil || 0;
          S.profile.subPlan = doc.subPlan || "";
          if (doc.masteryEv) S.masteryEv = doc.masteryEv;
          if (doc.sloLevel) S.sloLevel = doc.sloLevel;
          if (doc.reading) S.reading = doc.reading;
          // onboarded if we have the essentials
          if (S.profile.name && S.profile.level) S.profile.onboarded = true;
          save();
        } else {
          S.profile.uid = u.uid;
          S.profile.email = u.email || "";
          save();
        }
        enterApp();
      } else {
        renderAuth();
        showScreen("screen-auth", null);
      }
    });
  } else {
    // local mode: straight to auth screen (name-only continue)
    renderAuth();
    showScreen("screen-auth", null);
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", boot);
}
