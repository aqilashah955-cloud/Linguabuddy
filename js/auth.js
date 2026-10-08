// LinguaBuddy — authentication screens.
// Firebase email/password when configured; graceful local fallback
// (name-only profile) when not. Login accepts a Login ID or an email.

import { fb, isConfigured, signUp, signIn, signOut, resetPassword, validLoginId, onAuthChange } from "./firebase.js";
import { S, save } from "./store.js";
import { ensureTrial } from "./billing.js";
import { esc } from "./utils.js";
import { showScreen as showLocal } from "./ui.js";

function $(id) { return document.getElementById(id); }

const GOAL_OPTS = ["Grammar", "Vocabulary", "Reading", "Writing", "Speaking", "Conversation", "Overall"];
const LEVEL_OPTS = ["Beginner", "Elementary", "Pre-Intermediate", "Intermediate", "Upper-Intermediate", "Advanced"];
const AGE_OPTS = ["Under 13", "13–17", "18+"];

let onDone = null; // called with {mode:'firebase'|'local'} after auth resolves
export function setAuthDone(fn) { onDone = fn; }
function done(mode) { if (onDone) onDone(mode); }

function authError(e) {
  const m = String((e && e.message) || e || "");
  if (/user-not-found|no account/i.test(m)) return "No account found. Check your login ID or sign up.";
  if (/wrong-password|invalid-credential/i.test(m)) return "Wrong password. Try again or reset it.";
  if (/email-already-in-use/i.test(m)) return "That email is already registered. Try logging in.";
  if (/weak-password/i.test(m)) return "Password must be at least 6 characters.";
  if (/invalid-email/i.test(m)) return "That email address looks wrong.";
  if (/taken/i.test(m)) return m;
  if (/Login ID/i.test(m)) return m;
  return m.replace(/^Firebase:\s*/i, "").slice(0, 160) || "Something went wrong. Try again.";
}

export function renderAuth() {
  const online = isConfigured();
  $("authOfflineNote").classList.toggle("hidden", online);
  $("authOnlineNote").classList.toggle("hidden", !online);
  // Offline (no Firebase configured): login/signup buttons can't work —
  // hide them so students aren't trapped, and make name-only entry obvious.
  document.querySelectorAll("#screen-auth .auth-tabs").forEach(function (el) {
    el.classList.toggle("hidden", !online);
  });
  $("loginForm").classList.toggle("hidden", !online);
  $("signupForm").classList.add("hidden");
  const btn = $("localContinueBtn");
  btn.classList.toggle("hidden", online);
  btn.classList.toggle("btn-primary", !online);
  btn.classList.toggle("btn-ghost", online);
  const wrap = $("localContinueWrap");
  if (wrap) {
    let h = $("localContinueHead");
    if (!online && !h) {
      h = document.createElement("h3");
      h.id = "localContinueHead";
      h.textContent = "👋 Start learning";
      wrap.insertBefore(h, wrap.firstChild);
    }
    if (h) h.classList.toggle("hidden", online);
  }
  // goal chips
  $("suGoals").innerHTML = GOAL_OPTS.map(function (g) {
    return '<button type="button" class="chipbtn" data-goal="' + g + '">' + g + "</button>";
  }).join("");
  $("suGoals").querySelectorAll("[data-goal]").forEach(function (b) {
    b.addEventListener("click", function () { b.classList.toggle("on"); });
  });
  $("suLevel").innerHTML = '<option value="">Choose…</option>' +
    LEVEL_OPTS.map(function (l) { return '<option value="' + l + '">' + l + "</option>"; }).join("");
  $("suAge").innerHTML = '<option value="">Choose…</option>' +
    AGE_OPTS.map(function (a) { return '<option value="' + a + '">' + a + "</option>"; }).join("");
}

function selectedGoals() {
  const out = [];
  $("suGoals").querySelectorAll(".chipbtn.on").forEach(function (b) { out.push(b.getAttribute("data-goal")); });
  return out;
}

export function initAuthUI() {
  // tabs
  document.querySelectorAll("#screen-auth .auth-tabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("#screen-auth .auth-tabs button").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      const login = b.getAttribute("data-tab") === "login";
      $("loginForm").classList.toggle("hidden", !login);
      $("signupForm").classList.toggle("hidden", login);
      $("authErr").textContent = "";
    });
  });

  $("loginBtn").addEventListener("click", async function () {
    const id = $("liId").value.trim(), pw = $("liPw").value;
    if (!id || !pw) { $("authErr").textContent = "Enter your login ID (or email) and password."; return; }
    $("loginBtn").disabled = true;
    try {
      await signIn(id, pw);
      // profile sync happens in app.js onAuthChange
    } catch (e) { $("authErr").textContent = authError(e); }
    $("loginBtn").disabled = false;
  });

  $("signupBtn").addEventListener("click", async function () {
    const name = $("suName").value.trim();
    const loginId = $("suId").value.trim().toLowerCase();
    const email = $("suEmail").value.trim();
    const pw = $("suPw").value, pw2 = $("suPw2").value;
    const err = $("authErr");
    if (!name) { err.textContent = "Please enter your full name."; return; }
    if (!validLoginId(loginId)) { err.textContent = "Login ID: 3–20 characters, lowercase letters, numbers or _ only."; return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = "Enter a valid email address."; return; }
    if (pw.length < 6) { err.textContent = "Password must be at least 6 characters."; return; }
    if (pw !== pw2) { err.textContent = "Passwords do not match."; return; }
    $("signupBtn").disabled = true;
    try {
      await signUp({
        name: name, loginId: loginId, email: email, password: pw,
        ageGroup: $("suAge").value, level: $("suLevel").value,
        goals: selectedGoals(),
        role: document.querySelector('input[name="suRole"]:checked').value
      });
    } catch (e) { err.textContent = authError(e); }
    $("signupBtn").disabled = false;
  });

  $("forgotLink").addEventListener("click", function () { $("authErr").textContent = ""; showLocal("screen-forgot"); });
  $("forgotBack").addEventListener("click", function () { showLocal("screen-auth"); });
  $("forgotBtn").addEventListener("click", async function () {
    const em = $("fgEmail").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(em)) { $("fgMsg").textContent = "Enter a valid email address."; return; }
    try {
      await resetPassword(em);
      $("fgMsg").textContent = "Password reset email sent. Check your inbox.";
    } catch (e) { $("fgMsg").textContent = authError(e); }
  });

  // local fallback
  $("localContinueBtn").addEventListener("click", function () {
    const v = $("localName").value.trim();
    if (!v) { $("authErr").textContent = "Type your name to continue."; return; }
    S.profile.name = v;
    S.profile.onboarded = S.profile.onboarded || false;
    ensureTrial(S.profile);
    save();
    done("local");
  });
}

export function wireAuthState(onUser) {
  // Called by app.js after initFirebase. Routes signed-in users onward.
  onAuthChange(function (u) { onUser(u); });
}

export { GOAL_OPTS, LEVEL_OPTS, AGE_OPTS };
