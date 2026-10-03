// LinguaBuddy — teacher dashboard (Part 2).
// Role-gated: visible only when S.profile.role === "teacher".
// Online (Firebase): classes/assignments in Firestore, inbox from the
// submissions collection (rules let a teacher read submissions whose
// classId belongs to one of their classes). Offline: everything lives in
// S.teacher (localStorage) on this device.

import { S, save, recordAttempt } from "./store.js";
import { fb, isConfigured } from "./firebase.js";
import { esc, fmtDate, uid } from "./utils.js";
import { showScreen as show } from "./ui.js";
import {
  SLOS, sloById, calculateSLOMastery, masteryLabel,
  computeClassAnalytics, commonMissedTypes, suggestIntervention,
  buildProgressReport, evidenceFromSubmissions, buildItems
} from "./engine.js";
import { runAttempt, showResult, summarizeResults } from "./assess.js";
import { awardXP, xpForAttempt, checkBadges } from "./gamify.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setTeacherGo(fn) { go = fn; }

/* ---------------- role guards (pure, testable) ---------------- */
export function roleAllowsTeacher(profile) {
  return !!(profile && profile.role === "teacher");
}
export function roleAllowsAdmin(profile) {
  const owner = (typeof window !== "undefined" && window.OWNER_EMAIL) || "";
  return !!(profile && profile.email && owner && owner !== "REPLACE_WITH_OWNER_EMAIL" &&
    String(profile.email).toLowerCase() === String(owner).toLowerCase());
}
export function isTeacher() { return roleAllowsTeacher(S.profile); }
export function isAdmin() { return roleAllowsAdmin(S.profile); }

/* ---------------- data layer ---------------- */
function online() { return isConfigured() && fb().user; }
function fns() { return fb().fns; }

async function fsList(coll, field, op, val) {
  const m = fns().fsMod;
  const q = m.query(m.collection(fb().db, coll), m.where(field, op, val));
  const snap = await m.getDocs(q);
  return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}
async function fsListIn(coll, field, vals) {
  const m = fns().fsMod;
  const q = m.query(m.collection(fb().db, coll), m.where(field, "in", vals));
  const snap = await m.getDocs(q);
  return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}
async function fsPut(coll, id, data) {
  const m = fns().fsMod;
  await m.setDoc(m.doc(fb().db, coll, id), data, { merge: true });
}
async function fsDel(coll, id) {
  const m = fns().fsMod;
  await m.deleteDoc(m.doc(fb().db, coll, id));
}
async function fsGetDoc(coll, id) {
  const m = fns().fsMod;
  const snap = await m.getDoc(m.doc(fb().db, coll, id));
  return snap.exists() ? Object.assign({ id: snap.id }, snap.data()) : null;
}

// Class: {id, name, teacherId, students:[{uid,name,loginId}], createdAt}
export async function loadClasses() {
  if (online()) return fsList("classes", "teacherId", "==", fb().user.uid);
  return S.teacher.classes.slice();
}
export async function saveClass(cls) {
  cls.id = cls.id || uid("c");
  cls.createdAt = cls.createdAt || Date.now();
  // denormalized uid list — used by firestore.rules for membership checks
  cls.studentIds = (cls.students || []).map(function (r) { return r.uid; }).filter(Boolean);
  if (online()) { await fsPut("classes", cls.id, cls); }
  else {
    const i = S.teacher.classes.findIndex(function (c) { return c.id === cls.id; });
    if (i >= 0) S.teacher.classes[i] = cls; else S.teacher.classes.push(cls);
    save();
  }
  return cls;
}
export async function deleteClass(id) {
  if (!confirm("Delete this class and its assignments?")) return false;
  if (online()) {
    await fsDel("classes", id);
    const as = await fsList("assignments", "classId", "==", id);
    for (const a of as) await fsDel("assignments", a.id);
  } else {
    S.teacher.classes = S.teacher.classes.filter(function (c) { return c.id !== id; });
    S.teacher.assignments = S.teacher.assignments.filter(function (a) { return a.classId !== id; });
    save();
  }
  return true;
}

// Assignment: {id, classId, title, sloIds[], count, dueAt, createdAt, teacherId}
export async function loadAssignments(classId) {
  if (online()) return fsList("assignments", "classId", "==", classId);
  return S.teacher.assignments.filter(function (a) { return a.classId === classId; });
}
export async function saveAssignment(a) {
  a.id = a.id || uid("as");
  a.createdAt = a.createdAt || Date.now();
  if (online()) { await fsPut("assignments", a.id, a); }
  else {
    const i = S.teacher.assignments.findIndex(function (x) { return x.id === a.id; });
    if (i >= 0) S.teacher.assignments[i] = a; else S.teacher.assignments.push(a);
    save();
  }
  return a;
}
export async function deleteAssignment(id) {
  if (!confirm("Delete this assignment?")) return false;
  if (online()) await fsDel("assignments", id);
  else { S.teacher.assignments = S.teacher.assignments.filter(function (a) { return a.id !== id; }); save(); }
  return true;
}

// Resolve a student by login ID (online) → {uid, name, loginId}
export async function resolveStudent(loginId) {
  const id = String(loginId || "").trim().toLowerCase();
  if (!id) return null;
  if (!online()) return null;
  const map = await fsGetDoc("loginIds", id);
  if (!map || !map.uid) return null;
  const u = await fsGetDoc("users", map.uid);
  return { uid: map.uid, name: (u && u.name) || id, loginId: id };
}

function subKey(sub) { return sub.studentId || sub.student || "?"; }
function rosterKey(r) { return r.uid || r.name; }
function rosterName(cls, key) {
  const r = (cls.students || []).find(function (x) { return rosterKey(x) === key; });
  return r ? r.name : key;
}

/* ---------------- teacher dashboard ---------------- */
let tab = "classes";
let curClassId = null;

export function renderTeacher() {
  if (!isTeacher()) { renderGate(); return; }
  $("tchrBack").onclick = function () { if (go) go("home"); };
  $("tchrMode").textContent = online() ? "Online — synced to your account" : "Offline — stored on this device";
  drawTabs();
  show("screen-teacher");
}

function renderGate() {
  const off = !online();
  $("gateBody").innerHTML =
    '<div class="screen-head"><h2>Teacher Dashboard</h2>' +
    "<p>You need a teacher account to open the Teacher Dashboard.</p></div>" +
    '<div class="notice">Your current role on this device is <strong>' + esc(S.profile.role || "student") +
    "</strong>. Teachers sign up with the “Teacher” option, and their classes, assignments and student results appear here.</div>" +
    (off ? '<br><button class="btn-ghost" id="gateDemo">Preview as a teacher on this device</button>' +
      ' <span class="fine">Preview only — for trying the dashboard offline.</span>' : "");
  if (off) {
    $("gateDemo").addEventListener("click", function () {
      S.profile.role = "teacher"; save();
      renderTeacher();
    });
  }
  show("screen-gate");
}

function drawTabs() {
  const tabs = [["classes", "🏫 Classes"], ["assign", "📝 Assignments"], ["inbox", "📥 Inbox"], ["analytics", "📊 Analytics"]];
  $("tchrTabs").innerHTML = tabs.map(function (t) {
    return '<button class="tabbtn' + (tab === t[0] ? " active" : "") + '" data-tab="' + t[0] + '">' + t[1] + "</button>";
  }).join("");
  $("tchrTabs").querySelectorAll("[data-tab]").forEach(function (b) {
    b.addEventListener("click", function () { tab = b.getAttribute("data-tab"); drawTabs(); });
  });
  const body = $("tchrBody");
  if (tab === "classes") drawClasses(body);
  else if (tab === "assign") drawAssignments(body);
  else if (tab === "inbox") drawInbox(body);
  else drawAnalytics(body);
}

/* ----- classes tab ----- */
async function drawClasses(box) {
  box.innerHTML = '<p class="fine">Loading…</p>';
  const classes = await loadClasses();
  let html = '<div class="row-btns"><button class="btn-primary" id="newClassBtn">+ New Class</button></div>';
  html += classes.length ? '<div class="class-grid">' + classes.map(function (c) {
    const n = (c.students || []).length;
    return '<button class="class-card" data-cid="' + c.id + '"><h3>' + esc(c.name) + "</h3>" +
      '<span class="fine">' + n + " student" + (n === 1 ? "" : "s") + "</span></button>";
  }).join("") + "</div>" : '<p class="empty-msg">No classes yet. Create your first class to get started.</p>';
  box.innerHTML = html;
  $("newClassBtn").addEventListener("click", async function () {
    const name = prompt("Class name (e.g. Class 7-A):");
    if (!name || !name.trim()) return;
    await saveClass({ name: name.trim(), teacherId: online() ? fb().user.uid : "local", students: [] });
    drawClasses(box);
  });
  box.querySelectorAll("[data-cid]").forEach(function (b) {
    b.addEventListener("click", function () { openClass(b.getAttribute("data-cid")); });
  });
}

/* ----- class detail ----- */
export async function openClass(classId) {
  const classes = await loadClasses();
  const cls = classes.find(function (c) { return c.id === classId; });
  if (!cls) { drawTabs(); return; }
  curClassId = classId;
  const subs = await loadInboxSubs();
  const ev = evidenceFromSubmissions(subs.filter(function (s) {
    return (cls.students || []).some(function (r) { return rosterKey(r) === subKey(s); });
  }));
  let html = '<div class="screen-head"><button class="back-btn" id="clsBack">← Classes</button>' +
    "<h2>" + esc(cls.name) + "</h2></div>";
  html += '<h3 class="sec-title">Students (' + (cls.students || []).length + ")</h3>";
  html += '<div class="form-card"><div class="field"><label>Add student by login ID' +
    (online() ? "" : " (offline: type the student's name)") + "</label>" +
    '<div class="row-flex"><input id="addStuInput" type="text" placeholder="e.g. amina2026" />' +
    '<button class="btn-primary" id="addStuBtn">Add</button></div><p class="fine" id="addStuMsg"></p></div></div>';
  html += '<div id="rosterBox">' + rosterHTML(cls, ev) + "</div>";
  html += '<h3 class="sec-title">Assignments</h3><div id="clsAssignBox"><p class="fine">Loading…</p></div>';
  html += '<div class="row-btns"><button class="btn-danger btn-sm" id="delClassBtn">Delete Class</button></div>';
  $("classBody").innerHTML = html;
  show("screen-class");
  $("clsBack").addEventListener("click", function () { renderTeacher(); });
  function bindReports() {
    $("classBody").querySelectorAll("[data-report]").forEach(function (b) {
      b.onclick = function () { showStudentReport(cls, b.getAttribute("data-report"), subs); };
    });
  }
  bindReports();
  $("addStuBtn").addEventListener("click", async function () {
    const v = $("addStuInput").value.trim();
    const msg = $("addStuMsg");
    if (!v) { msg.textContent = "Type a login ID or name."; return; }
    let entry = null;
    if (online()) {
      msg.textContent = "Looking up…";
      const r = await resolveStudent(v);
      if (!r) { msg.textContent = "No account found for “" + v + "”. The student must sign up first."; return; }
      entry = r;
    } else {
      entry = { uid: "", name: v, loginId: "" };
    }
    if ((cls.students || []).some(function (x) { return rosterKey(x) === rosterKey(entry); })) {
      msg.textContent = "Already in this class."; return;
    }
    cls.students = (cls.students || []).concat([entry]);
    await saveClass(cls);
    msg.textContent = "Added ✓";
    $("rosterBox").innerHTML = rosterHTML(cls, ev);
    bindReports();
  });
  $("delClassBtn").addEventListener("click", async function () {
    if (await deleteClass(cls.id)) { tab = "classes"; renderTeacher(); }
  });
  const as = await loadAssignments(cls.id);
  $("clsAssignBox").innerHTML = as.length ? as.map(function (a) {
    return '<div class="assign-row"><div><strong>' + esc(a.title) + "</strong><br><span class='fine'>" +
      a.sloIds.length + " SLOs · " + a.count + " questions" + (a.dueAt ? " · due " + esc(a.dueAt) : "") +
      "</span></div></div>";
  }).join("") : '<p class="fine">No assignments yet — create one from the Assignments tab.</p>';
}

function rosterHTML(cls, ev) {
  if (!(cls.students || []).length) return '<p class="empty-msg">No students yet.</p>';
  return cls.students.map(function (r) {
    const key = rosterKey(r);
    const m = {};
    SLOS.forEach(function (s) {
      m[s.id] = calculateSLOMastery(s.id, ((ev[key] || {})[s.id]) || []);
    });
    const mastered = SLOS.filter(function (s) { return m[s.id].status === "mastered"; }).length;
    return '<div class="roster-row"><div><strong>' + esc(r.name) + "</strong>" +
      (r.loginId ? ' <span class="fine">ID: ' + esc(r.loginId) + "</span>" : "") +
      '<br><span class="fine">' + mastered + "/" + SLOS.length + " SLOs mastered</span></div>" +
      '<button class="btn-ghost btn-sm" data-report="' + esc(key) + '">Report</button></div>';
  }).join("");
}

/* ----- assignments tab ----- */
async function drawAssignments(box) {
  box.innerHTML = '<p class="fine">Loading…</p>';
  const classes = await loadClasses();
  if (!classes.length) { box.innerHTML = '<p class="empty-msg">Create a class first, then assign work to it.</p>'; return; }
  let html = '<div class="form-card"><h3>New Assignment</h3>' +
    '<div class="field"><label>Class</label><select id="asClass">' +
    classes.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + "</option>"; }).join("") +
    '</select></div>' +
    '<div class="field"><label>Title</label><input id="asTitle" type="text" placeholder="e.g. Tenses — Week 3 Homework" /></div>' +
    '<div class="field"><label>SLOs (pick any)</label><div class="chipwrap" id="asSlos">' +
    SLOS.map(function (s) { return '<button type="button" class="chipbtn" data-slo="' + s.id + '">' + esc(s.title) + "</button>"; }).join("") +
    "</div></div>" +
    '<div class="field"><label>Questions</label><select id="asCount"><option>10</option><option>15</option><option>20</option></select></div>' +
    '<div class="field"><label>Due date (optional)</label><input id="asDue" type="date" /></div>' +
    '<button class="btn-primary" id="asCreate">Create Assignment</button><p class="fine" id="asMsg"></p></div>';
  html += '<h3 class="sec-title">All Assignments</h3><div id="asList"><p class="fine">Loading…</p></div>';
  box.innerHTML = html;
  box.querySelectorAll("#asSlos .chipbtn").forEach(function (b) {
    b.addEventListener("click", function () { b.classList.toggle("on"); });
  });
  $("asCreate").addEventListener("click", async function () {
    const sloIds = [];
    box.querySelectorAll("#asSlos .chipbtn.on").forEach(function (b) { sloIds.push(b.getAttribute("data-slo")); });
    const title = $("asTitle").value.trim();
    if (!title) { $("asMsg").textContent = "Give the assignment a title."; return; }
    if (!sloIds.length) { $("asMsg").textContent = "Pick at least one SLO."; return; }
    await saveAssignment({
      classId: $("asClass").value, title: title, sloIds: sloIds,
      count: parseInt($("asCount").value, 10), dueAt: $("asDue").value,
      teacherId: online() ? fb().user.uid : "local"
    });
    $("asMsg").textContent = "Created ✓";
    drawAssignments(box);
  });
  // list
  let rows = "";
  for (const c of classes) {
    const as = await loadAssignments(c.id);
    as.forEach(function (a) {
      rows += '<div class="assign-row"><div><strong>' + esc(a.title) + "</strong><br><span class='fine'>" +
        esc(c.name) + " · " + a.sloIds.length + " SLOs · " + a.count + " Qs" +
        (a.dueAt ? " · due " + esc(a.dueAt) : "") + '</span></div>' +
        '<button class="btn-ghost btn-sm" data-delas="' + a.id + '">Delete</button></div>';
    });
  }
  $("asList").innerHTML = rows || '<p class="empty-msg">No assignments yet.</p>';
  $("asList").querySelectorAll("[data-delas]").forEach(function (b) {
    b.addEventListener("click", async function () {
      if (await deleteAssignment(b.getAttribute("data-delas"))) drawAssignments(box);
    });
  });
}

/* ----- inbox ----- */
async function loadInboxSubs() {
  if (online()) {
    // submissions from students in my classes (matched by uid; teacherIds
    // on each submission lets the rules authorize the read)
    const classes = await loadClasses();
    const out = [];
    for (const c of classes) {
      const uids = (c.students || []).map(function (r) { return r.uid; }).filter(Boolean);
      for (let i = 0; i < uids.length; i += 10) {
        const chunk = uids.slice(i, i + 10);
        if (!chunk.length) continue;
        const subs = await fsListIn("submissions", "studentId", chunk);
        subs.forEach(function (s) { out.push(Object.assign({ _className: c.name }, s)); });
      }
    }
    return out.sort(function (a, b) { return (b.date || 0) - (a.date || 0); });
  }
  // offline: this device's graded attempts
  return S.attempts.filter(function (a) { return a.mode === "assessment" || a.mode === "reassessment"; })
    .map(function (a) { return Object.assign({ studentId: a.student, _className: "This device" }, a); })
    .sort(function (a, b) { return b.date - a.date; });
}

async function drawInbox(box) {
  box.innerHTML = '<p class="fine">Loading…</p>';
  const subs = await loadInboxSubs();
  if (!subs.length) { box.innerHTML = '<p class="empty-msg">No submissions yet. When students complete assigned work, their answers appear here.</p>'; return; }
  box.innerHTML = subs.map(function (s, i) {
    const nm = s.student || s._rosterName || subKey(s);
    return '<div class="inbox-row" data-sub="' + i + '"><div><strong>' + esc(nm) + "</strong> — " + esc(s.title || "Assessment") +
      '<br><span class="fine">' + esc(s._className || "") + " · " + fmtDate(s.date) +
      (s.tabs ? " · tab switches: " + s.tabs : "") + "</span></div>" +
      '<div class="score-pct">' + (s.pct != null ? s.pct + "%" : "—") + "</div></div>" +
      '<div class="inbox-detail hidden" id="subdet_' + i + '"></div>';
  }).join("");
  box.querySelectorAll("[data-sub]").forEach(function (row) {
    row.addEventListener("click", function () {
      const i = parseInt(row.getAttribute("data-sub"), 10);
      const det = $("subdet_" + i);
      const s = subs[i];
      if (det.classList.contains("hidden")) {
        det.innerHTML = (s.answers || []).map(function (a, k) {
          const cls = a.score === 1 ? "correct" : (a.score > 0 ? "partial" : "wrong");
          return '<div class="review-card ' + cls + '"><div class="rev-q">Q' + (k + 1) + ". " + esc(a.q) +
            " <em>(" + esc(a.sloTitle || "") + ")</em></div>" +
            '<div class="rev-line">Student answer: ' + esc(a.given) + "</div>" +
            '<div class="rev-line">Correct: ' + esc(a.correct) + "</div></div>";
        }).join("") || '<p class="fine">No per-question detail saved for this submission.</p>';
        det.classList.remove("hidden");
      } else det.classList.add("hidden");
    });
  });
}

/* ----- analytics ----- */
async function drawAnalytics(box) {
  box.innerHTML = '<p class="fine">Loading…</p>';
  const classes = await loadClasses();
  if (!classes.length) { box.innerHTML = '<p class="empty-msg">Create a class to see analytics.</p>'; return; }
  const subs = await loadInboxSubs();
  const selId = curClassId && classes.some(function (c) { return c.id === curClassId; }) ? curClassId : classes[0].id;
  let html = '<div class="field"><label>Class</label><select id="anClass">' +
    classes.map(function (c) { return '<option value="' + c.id + '"' + (c.id === selId ? " selected" : "") + ">" + esc(c.name) + "</option>"; }).join("") +
    "</select></div><div id='anBody'></div>";
  box.innerHTML = html;
  async function draw() {
    const cid = $("anClass").value;
    const cls = classes.find(function (c) { return c.id === cid; });
    const keys = (cls.students || []).map(rosterKey);
    const csubs = subs.filter(function (s) { return keys.indexOf(subKey(s)) >= 0; })
      .map(function (s) { return Object.assign({}, s, { studentId: subKey(s) }); });
    const rows = computeClassAnalytics(keys, csubs);
    $("anBody").innerHTML =
      '<table class="an-table"><tr><th>SLO</th><th>Mastered</th><th>Developing</th><th>Needs Practice</th><th>Avg</th></tr>' +
      rows.map(function (r) {
        return '<tr data-slo="' + r.sloId + '" class="an-row"><td>' + esc(r.title) + "</td>" +
          '<td class="c-ok">' + r.mastered + "</td><td class='c-mid'>" + r.developing + "</td>" +
          '<td class="c-low">' + r.needs + "</td><td>" + (r.avg == null ? "—" : r.avg + "%") + "</td></tr>";
      }).join("") + "</table>" +
      '<p class="fine">Tap a row for detail. Student details are private to you as their teacher.</p>' +
      '<div id="anDetail"></div>';
    $("anBody").querySelectorAll(".an-row").forEach(function (tr) {
      tr.addEventListener("click", function () { drawSloDetail(tr.getAttribute("data-slo"), rows, cls, csubs); });
    });
  }
  $("anClass").addEventListener("change", draw);
  await draw();
}

function drawSloDetail(sloId, rows, cls, csubs) {
  const r = rows.find(function (x) { return x.sloId === sloId; });
  const missed = commonMissedTypes(csubs, sloId);
  const needNames = r.byStatus.needs.concat(r.byStatus.developing).map(function (x) {
    return rosterName(cls, x.studentId) + " (" + x.avg + "%)";
  });
  $("anDetail").innerHTML = '<div class="form-card"><h3>' + esc(r.title) + "</h3>" +
    "<p><strong>Needs support:</strong> " + (needNames.length ? esc(needNames.join(", ")) : "none — everyone is on track") + "</p>" +
    "<p><strong>Most-missed question types:</strong> " + (missed.length
      ? esc(missed.slice(0, 3).map(function (m) { return m.label + " (" + m.misses + "/" + m.total + ")"; }).join(", "))
      : "—") + "</p>" +
    "<p><strong>Class average:</strong> " + (r.avg == null ? "—" : r.avg + "%") + "</p>" +
    '<div class="notice"><strong>Suggested intervention:</strong> ' + esc(suggestIntervention(sloId, missed)) + "</div>" +
    '<div class="row-btns"><button class="btn-ghost btn-sm" id="anRemind">Assign Remediation</button></div></div>';
  $("anRemind").addEventListener("click", async function () {
    await saveAssignment({
      classId: cls.id, title: "Remediation: " + r.title, sloIds: [sloId],
      count: 8, dueAt: "", teacherId: online() ? fb().user.uid : "local"
    });
    alert("Remediation assignment created for " + cls.name + ".");
  });
}

/* ---------------- student: my assignments ---------------- */
export async function renderStudentAssignments() {
  const box = $("assignBox");
  if (!box) return;
  let mine = [];
  if (online()) {
    // scan classes (small data) and match roster by uid in code
    const m = fns().fsMod;
    const csnap = await m.getDocs(m.collection(fb().db, "classes"));
    const classIds = [];
    csnap.docs.forEach(function (d) {
      const st = d.data().students || [];
      if (st.some(function (r) { return r.uid === fb().user.uid; })) classIds.push(d.id);
    });
    for (const cid of classIds) {
      const as = await fsList("assignments", "classId", "==", cid);
      mine = mine.concat(as);
    }
  } else {
    const nm = (S.profile.name || "").toLowerCase();
    mine = S.teacher.assignments.filter(function (a) {
      const cls = S.teacher.classes.find(function (c) { return c.id === a.classId; });
      if (!cls || !(cls.students || []).length) return true; // unassigned class → visible
      return cls.students.some(function (r) { return (r.name || "").toLowerCase() === nm; });
    });
  }
  const doneIds = new Set(S.attempts.filter(function (a) { return a.assignmentId; }).map(function (a) { return a.assignmentId; }));
  const open = mine.filter(function (a) { return !doneIds.has(a.id); });
  if (!open.length) { box.innerHTML = ""; box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  box.innerHTML = '<h3 class="sec-title">📝 My Assignments</h3>' + open.map(function (a) {
    return '<button class="today-row" data-asg="' + a.id + '"><span class="tr-emoji">📝</span>' +
      '<span class="tr-text"><strong>' + esc(a.title) + "</strong><br><span class='fine'>" +
      a.sloIds.length + " SLOs · " + a.count + " questions" + (a.dueAt ? " · due " + esc(a.dueAt) : "") +
      "</span></span><span class='mc-arrow'>→</span></button>";
  }).join("");
  box.querySelectorAll("[data-asg]").forEach(function (b) {
    b.addEventListener("click", function () {
      const a = open.find(function (x) { return x.id === b.getAttribute("data-asg"); });
      if (a) startAssignment(a);
    });
  });
}

export function startAssignment(a) {
  const lockKey = "assign|" + (S.profile.uid || S.profile.name || "s").toLowerCase() + "|" + a.id;
  const seed = "assign-" + a.id + "-" + Date.now();
  const refs = [];
  const per = Math.max(2, Math.ceil(a.count / a.sloIds.length));
  a.sloIds.forEach(function (sid) {
    const slo = sloById(sid);
    if (!slo) return;
    for (let i = 0; i < Math.min(per, slo.questions.length); i++) {
      refs.push({ sloId: sid, bankIndex: (i * 3 + a.id.length) % slo.questions.length });
    }
  });
  const items = buildItems({ kind: "refs", refs: refs.slice(0, a.count), count: a.count, seed: seed });
  if (!items.length) { alert("No questions available for this assignment."); return; }
  runAttempt({
    title: a.title, items: items, timePerQ: 60, antiCopy: true, hints: false,
    lockKey: lockKey, lockLabel: "assignment",
    onDone: function (out) {
      const att = {
        lockKey: lockKey, student: S.profile.name, kind: "assignment", ref: a.sloIds.join(","),
        title: a.title, mode: "assessment", assignmentId: a.id, classId: a.classId,
        score: out.totalScore, total: out.items.length, pct: out.pct,
        perSlo: out.perSlo, tabs: out.tabs, secs: out.secs, usedKeys: out.usedKeys,
        answers: summarizeResults(out.results)
      };
      recordAttempt(att);
      awardXP(xpForAttempt({ mode: "assessment", results: out.results }), "assignment complete");
      checkBadges();
      showResult({
        title: a.title, scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks · sent to your teacher",
        results: out.results, perSlo: out.perSlo,
        actions: [{ label: "Back Home", primary: true, fn: function () { if (go) go("home"); } }]
      });
    }
  });
}

/* ---------------- student progress report (shared) ---------------- */
export function reportContextFor(studentKey, submissions) {
  const ev = evidenceFromSubmissions((submissions || []).map(function (s) {
    return Object.assign({}, s, { studentId: subKey(s) });
  }));
  const sev = ev[studentKey] || {};
  const mastery = {};
  SLOS.forEach(function (s) { mastery[s.id] = calculateSLOMastery(s.id, sev[s.id]); });
  const mine = (submissions || []).filter(function (s) { return subKey(s) === studentKey; });
  return { mastery: mastery, attempts: mine };
}

/* Shared renderer for the progress report. clickable=true turns the
   recommended-next-step rows into buttons; onNav(dest, arg) handles them. */
export function reportHTML(report, studentName, clickable, onNav) {
  function bar(status, pct) {
    const cls = status === "mastered" ? "ok" : status === "developing" ? "mid" : status === "needs" ? "low" : "";
    return '<div class="progbar"><div class="progfill ' + cls + '" style="width:' + pct + '%"></div></div>';
  }
  function dot(status) {
    return status === "mastered" ? "🟢" : status === "developing" ? "🟡" : status === "needs" ? "🔴" : "⚪";
  }
  let html = '<div class="form-card"><h3>📈 Progress Report' + (studentName ? " — " + esc(studentName) : "") + "</h3>";
  const meta = ["<strong>Level:</strong> " + esc(report.level)];
  if (report.xp != null) meta.push("<strong>XP:</strong> " + report.xp);
  if (report.streak != null) meta.push("<strong>Streak:</strong> 🔥 " + report.streak + " day" + (report.streak === 1 ? "" : "s"));
  if (report.vocabCount != null) meta.push("<strong>Words saved:</strong> " + report.vocabCount);
  if (report.storiesDone != null) meta.push("<strong>Stories finished:</strong> " + report.storiesDone);
  html += "<p>" + meta.join(" · ") + "</p>";
  html += "<p><strong>Strengths:</strong> " + (report.strengths.length ? esc(report.strengths.join("; ")) : "—") + "</p>";
  html += "<p><strong>Areas to improve:</strong> " + (report.weaknesses.length ? esc(report.weaknesses.join("; ")) : "—") + "</p>";
  html += '<div class="slo-progress">' + report.sloRows.map(function (r) {
    return '<div class="slo-row"><div class="slo-row-head">' + dot(r.status) + " " + esc(r.title) +
      '<span class="fine">' + (r.count ? r.avg + "% · " + r.count + " attempts" : "not started") + "</span></div>" +
      bar(r.status, r.count ? r.avg : 0) + "</div>";
  }).join("") + "</div>";
  if (report.recommendations.length) {
    html += '<h4 class="sec-title">🎯 Recommended next steps</h4>';
    html += report.recommendations.map(function (r, i) {
      if (clickable) {
        return '<button class="today-row" data-rec="' + i + '"><span class="tr-emoji">' + r.icon + "</span>" +
          '<span class="tr-text">' + esc(r.text) + '</span><span class="mc-arrow">→</span></button>';
      }
      return '<div class="rec-row"><span class="tr-emoji">' + r.icon + "</span><span>" + esc(r.text) + "</span></div>";
    }).join("");
  }
  html += "</div>";
  return html;
}

/* Teacher view: modal with one student's report. */
export function showStudentReport(cls, studentKey, submissions) {
  const name = rosterName(cls, studentKey);
  const ctx = reportContextFor(studentKey, submissions);
  const report = buildProgressReport(ctx);
  openModal(reportHTML(report, name, false), "Student Report");
}

/* Small modal used by teacher/admin views. */
export function openModal(html, title) {
  const ov = $("modalOv"), box = $("modalBox");
  if (!ov || !box) return;
  box.innerHTML = (title ? "<h3>" + esc(title) + "</h3>" : "") + html +
    '<div class="row-btns"><button class="btn-ghost" id="modalClose">Close</button></div>';
  ov.classList.remove("hidden");
  $("modalClose").addEventListener("click", function () { ov.classList.add("hidden"); });
  ov.onclick = function (e) { if (e.target === ov) ov.classList.add("hidden"); };
}
