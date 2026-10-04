// LinguaBuddy — subscriptions & 3-day free trial.
// Pure logic (testable in node) + the subscribe screen UI (DOM-guarded).
//
// Model: every student gets TRIAL_DAYS free from first use. After that the
// app gates to the subscribe screen until an admin activates a plan.
// Payment is manual (JazzCash/Easypaisa via WhatsApp); the admin activates
// the login ID in the Admin panel. Teachers/admins are always free.
//
// Trial/subscription state lives on the profile: trialStart (ms), subUntil
// (ms), subPlan ("monthly"|"halfyear"|"yearly"|""). It mirrors to Firestore
// via store.save() when online, so the trial can't be reset by clearing
// the browser on a signed-in account.

import { S, save } from "./store.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { fb, isConfigured, getUserDoc } from "./firebase.js";

/* ================= config — EDIT YOUR PRICES HERE ================= */
export const TRIAL_DAYS = 3;
export const WHATSAPP_NUMBER = "923456121725"; // +92 345 6121725 — subscription requests
export const PLANS = [
  { id: "monthly", name: "Monthly", price: 500, months: 1, tag: "Flexible" },
  { id: "halfyear", name: "6 Months", price: 2500, months: 6, tag: "Save 17%" },
  { id: "yearly", name: "1 Year", price: 4500, months: 12, tag: "Best value · Save 25%" }
];
/* ================================================================== */

export function planById(id) {
  return PLANS.filter(function (p) { return p.id === id; })[0] || null;
}

export function isStaff(profile) {
  const r = (profile && profile.role) || "student";
  return r === "teacher" || r === "admin";
}

/* Trial bookkeeping. Mutates the profile; caller must save(). */
export function ensureTrial(profile, now) {
  now = now || Date.now();
  if (!profile.trialStart) profile.trialStart = now;
  return profile;
}

export function trialDaysLeft(profile, now) {
  now = now || Date.now();
  if (!profile || !profile.trialStart) return TRIAL_DAYS;
  const msLeft = profile.trialStart + TRIAL_DAYS * 864e5 - now;
  return Math.max(0, Math.ceil(msLeft / 864e5));
}

export function subActive(profile, now) {
  now = now || Date.now();
  return !!(profile && profile.subUntil && profile.subUntil > now);
}

export function subDaysLeft(profile, now) {
  now = now || Date.now();
  if (!subActive(profile, now)) return 0;
  return Math.ceil((profile.subUntil - now) / 864e5);
}

/* "staff" | "trial" | "subscribed" | "expired" */
export function accessState(profile, now) {
  now = now || Date.now();
  if (isStaff(profile)) return "staff";
  if (subActive(profile, now)) return "subscribed";
  ensureTrial(profile, now);
  return trialDaysLeft(profile, now) > 0 ? "trial" : "expired";
}

/* Should the app gate this profile to the subscribe screen? */
export function needsGate(profile, now) {
  return accessState(profile, now) === "expired";
}

/* Admin action: activate/extend a plan. Returns the new subUntil. */
export function grantSubscription(profile, planId, now) {
  now = now || Date.now();
  const plan = planById(planId);
  if (!plan) return 0;
  const base = Math.max(now, profile.subUntil || 0); // extend from current expiry
  profile.subUntil = base + plan.months * 30 * 864e5;
  profile.subPlan = plan.id;
  return profile.subUntil;
}

export function waSubscribeLink(profile, plan) {
  const id = (profile && (profile.loginId || profile.email || profile.name)) || "guest";
  const msg = "Assalam-o-Alaikum! I want to subscribe to LinguaBuddy.\n" +
    "Login ID: " + id + "\nPlan: " + plan.name + " — Rs " + plan.price.toLocaleString("en-PK");
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
}

export function statusLine(profile, now) {
  const st = accessState(profile, now);
  if (st === "staff") return "Staff — full access, always free.";
  if (st === "subscribed") {
    const p = planById(profile.subPlan);
    return "✅ Subscribed" + (p ? " (" + p.name + ")" : "") + " · " + subDaysLeft(profile, now) + " days left.";
  }
  if (st === "trial") {
    const d = trialDaysLeft(profile, now);
    return "🎁 Free trial · " + d + (d === 1 ? " day" : " days") + " left.";
  }
  return "🔒 Trial ended — subscribe to continue.";
}

/* Re-fetch subscription state from Firestore (so "I've paid — check again"
   picks up an admin activation without re-login). */
export async function refreshSubscription() {
  try {
    if (isConfigured() && fb().user && S.profile.uid) {
      const doc = await getUserDoc(S.profile.uid);
      if (doc) {
        if (doc.trialStart) S.profile.trialStart = doc.trialStart;
        S.profile.subUntil = doc.subUntil || 0;
        S.profile.subPlan = doc.subPlan || "";
        save();
      }
    }
  } catch (e) { /* offline — keep local state */ }
}

/* ================= subscribe screen ================= */
let go = null;
export function setBillingGo(fn) { go = fn; }

function $(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }

export function renderSubscribe() {
  const root = $("screen-subscribe");
  if (!root) return;
  const p = S.profile;
  const days = trialDaysLeft(p, Date.now());
  root.innerHTML =
    '<div class="sub-wrap">' +
    '<div class="sub-mascot">🦉</div>' +
    "<h2>Your 3 free days have ended</h2>" +
    '<p class="sub-sub">We loved learning with you, ' + esc(p.name || "friend") + "! " +
    "Subscribe to keep your buddies, lessons, games and certificates going. " +
    "💛 <strong>Kids:</strong> please ask a parent or guardian to subscribe for you.</p>" +
    '<div class="plan-grid">' + PLANS.map(function (pl) {
      return '<div class="plan-card">' +
        '<div class="plan-tag">' + esc(pl.tag) + "</div>" +
        "<h3>" + esc(pl.name) + "</h3>" +
        '<div class="plan-price">Rs ' + pl.price.toLocaleString("en-PK") + "</div>" +
        '<a class="btn-primary plan-wa" target="_blank" rel="noopener" href="' + waSubscribeLink(p, pl) + '">' +
        "💬 Subscribe on WhatsApp</a></div>";
    }).join("") + "</div>" +
    '<p class="fine">Pay with JazzCash / Easypaisa / bank transfer — details are shared on WhatsApp. ' +
    "Your subscription is usually activated within a few hours of payment.</p>" +
    '<div class="row-btns"><button class="btn-primary" id="subCheck">✓ I\'ve paid — check again</button></div>' +
    '<p class="fine">Trial used: ' + TRIAL_DAYS + ' days · ' + days + ' left · ID: ' + esc(p.loginId || p.email || "—") + "</p>" +
    "</div>";
  $("subCheck").addEventListener("click", async function () {
    $("subCheck").textContent = "Checking… ⏳";
    await refreshSubscription();
    if (!needsGate(S.profile, Date.now())) {
      if (go) go("home");
    } else {
      $("subCheck").textContent = "Still locked — activation can take a few hours ⏳";
      setTimeout(function () {
        const b = $("subCheck");
        if (b) b.textContent = "✓ I've paid — check again";
      }, 2500);
    }
  });
  show("screen-subscribe");
}
