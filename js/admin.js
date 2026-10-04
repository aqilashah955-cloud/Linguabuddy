// LinguaBuddy — admin panel (Part 2).
// Visible only when S.profile.email === OWNER_EMAIL (window.OWNER_EMAIL).
// Kept deliberately light: user list, role changes, platform counts.

import { S, save } from "./store.js";
import { fb, isConfigured } from "./firebase.js";
import { esc, fmtDate } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { isAdmin } from "./teacher.js";
import { PLANS, planById, grantSubscription, statusLine } from "./billing.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setAdminGo(fn) { go = fn; }

function online() { return isConfigured() && fb().user; }
async function fsList(coll, field, op, val) {
  const m = fb().fns.fsMod;
  const q = field ? m.query(m.collection(fb().db, coll), m.where(field, op, val))
                  : m.collection(fb().db, coll);
  const snap = await m.getDocs(q);
  return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}
async function fsCount(coll) {
  try { return (await fsList(coll)).length; } catch (e) { return 0; }
}
async function setRole(uid, role) {
  const m = fb().fns.fsMod;
  await m.setDoc(m.doc(fb().db, "users", uid), { role: role }, { merge: true });
}
async function activatePlanOnline(u, planId) {
  const plan = planById(planId);
  const m = fb().fns.fsMod;
  const base = Math.max(Date.now(), u.subUntil || 0); // extend from current expiry
  await m.setDoc(m.doc(fb().db, "users", u.id), {
    subUntil: base + plan.months * 30 * 864e5, subPlan: plan.id
  }, { merge: true });
}

export function renderAdmin() {
  if (!isAdmin()) {
    $("gateBody").innerHTML =
      '<div class="screen-head"><h2>Admin Panel</h2>' +
      "<p>This area is reserved for the platform owner.</p></div>" +
      '<div class="notice">Signed in as <strong>' + esc(S.profile.email || "—") +
      "</strong>. Admin access requires the owner account.</div>";
    $("adminBack").onclick = null;
    show("screen-gate");
    return;
  }
  $("adminBack").onclick = function () { if (go) go("home"); };
  drawAdmin();
  show("screen-admin");
}

async function drawAdmin() {
  const box = $("adminBody");
  box.innerHTML = '<p class="fine">Loading…</p>';
  let users = [], counts = {};
  if (online()) {
    try { users = await fsList("users"); } catch (e) { users = []; }
    counts = {
      users: users.length,
      classes: await fsCount("classes"),
      assignments: await fsCount("assignments"),
      submissions: await fsCount("submissions")
    };
  } else {
    users = [{ id: "local", name: S.profile.name || "(this device)", email: S.profile.email || "—", role: S.profile.role, createdAt: Date.now() }];
    counts = {
      users: 1, classes: S.teacher.classes.length,
      assignments: S.teacher.assignments.length,
      submissions: S.attempts.filter(function (a) { return a.mode === "assessment" || a.mode === "reassessment"; }).length
    };
  }
  let html = '<div class="stats-grid">' +
    [["👥 Users", counts.users], ["🏫 Classes", counts.classes],
     ["📝 Assignments", counts.assignments], ["📥 Submissions", counts.submissions]]
      .map(function (s) {
        return '<div class="stat-card"><div class="stat-num">' + s[1] + '</div><div class="fine">' + s[0] + "</div></div>";
      }).join("") + "</div>";
  html += '<h3 class="sec-title">Users</h3>' +
    '<div class="fine">' + (online() ? "Role changes take effect when the user signs in again." : "Offline — only this device is visible.") + "</div>";
  html += users.slice(0, 200).map(function (u) {
    return '<div class="roster-row"><div><strong>' + esc(u.name || u.id) + "</strong>" +
      '<br><span class="fine">' + esc(u.email || "") + (u.loginId ? " · ID: " + esc(u.loginId) : "") +
      " · joined " + fmtDate(u.createdAt) + "</span></div>" +
      '<select class="role-sel" data-uid="' + esc(u.id) + '" ' + (online() ? "" : "disabled") + ">" +
      ["student", "teacher", "admin"].map(function (r) {
        return '<option value="' + r + '"' + (u.role === r ? " selected" : "") + ">" + r + "</option>";
      }).join("") + "</select></div>";
  }).join("") || '<p class="empty-msg">No users found.</p>';
  box.innerHTML = html;
  box.querySelectorAll(".role-sel").forEach(function (sel) {
    sel.addEventListener("change", async function () {
      const id = sel.getAttribute("data-uid");
      try {
        await setRole(id, sel.value);
        alert("Role updated to " + sel.value + ".");
      } catch (e) {
        alert("Could not update role: " + (e.message || e));
        drawAdmin();
      }
    });
  });
  drawSubscriptions(box, users);
}

/* Subscriptions: trial/sub status per user + one-tap plan activation. */
function drawSubscriptions(box, users) {
  const wrap = document.createElement("div");
  const onlineMode = online();
  const rows = onlineMode ? users : [{
    id: "local", name: S.profile.name || "(this device)",
    loginId: S.profile.loginId, role: S.profile.role,
    trialStart: S.profile.trialStart, subUntil: S.profile.subUntil, subPlan: S.profile.subPlan
  }];
  wrap.innerHTML = '<h3 class="sec-title">💳 Subscriptions</h3>' +
    '<div class="fine">Students get a 3-day free trial, then need a plan. ' +
    "Activating extends from the current expiry date. " +
    (onlineMode ? "" : "Offline — managing this device only.") + "</div>" +
    rows.map(function (u) {
      const prof = {
        role: u.role, trialStart: u.trialStart,
        subUntil: u.subUntil, subPlan: u.subPlan
      };
      return '<div class="roster-row"><div><strong>' + esc(u.name || u.id) + "</strong>" +
        '<br><span class="fine">' + esc(u.loginId ? "ID: " + u.loginId : (u.email || "")) +
        " · " + esc(statusLine(prof, Date.now())) + "</span></div>" +
        '<div class="sub-btns">' + PLANS.map(function (pl) {
          return '<button class="chipbtn sm" data-sub-uid="' + esc(u.id) + '" data-plan="' + pl.id +
            '" title="Activate ' + esc(pl.name) + " — Rs " + pl.price.toLocaleString("en-PK") + '">' +
            esc(pl.name) + "</button>";
        }).join("") + "</div></div>";
    }).join("");
  box.appendChild(wrap);
  wrap.querySelectorAll("[data-sub-uid]").forEach(function (b) {
    b.addEventListener("click", async function () {
      const uid = b.getAttribute("data-sub-uid"), planId = b.getAttribute("data-plan");
      const plan = planById(planId);
      b.disabled = true;
      try {
        if (onlineMode) {
          const u = rows.filter(function (x) { return x.id === uid; })[0] || {};
          await activatePlanOnline(u, planId);
        } else {
          grantSubscription(S.profile, planId);
          save();
        }
        alert("✅ " + plan.name + " activated.");
      } catch (e) {
        alert("Could not activate: " + (e.message || e));
      }
      b.disabled = false;
      drawAdmin();
    });
  });
}
