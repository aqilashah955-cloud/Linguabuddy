// LinguaBuddy — student ↔ teacher messaging.
// Students message the teachers of classes they're enrolled in; teachers
// reply from the 💬 Messages tab. One thread per teacher+student pair.
// Needs the online version (Firestore). Safety banner on every chat.

import { S } from "./store.js";
import { esc } from "./utils.js";
import { showScreen } from "./ui.js";
import { isConfigured, fb } from "./firebase.js";

function online() { return isConfigured() && fb().user; }
function me() { return online() ? fb().user.uid : null; }
export function threadId(teacherId, studentId) { return teacherId + "_" + studentId; }

let go = null;
export function setGo(fn) { go = fn; }

const SAFETY = "🛡️ Keep all communication inside LinguaBuddy — never share phone numbers, addresses, CNIC or bank details.";

function fs() { return fb().fns.fsMod; }
function db() { return fb().db; }
function ts() { return fs().serverTimestamp(); }

/* ---------------- data ---------------- */

// Classes the current student is enrolled in.
export async function myClasses() {
  const u = me();
  if (!u) return [];
  try {
    const q = fs().query(fs().collection(db(), "classes"), fs().where("studentIds", "array-contains", u));
    const snap = await fs().getDocs(q);
    return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
  } catch (e) { return []; }
}

// Unique teachers of those classes, with name + photo from their user doc.
export async function myTeachers() {
  const classes = await myClasses();
  const seen = {};
  const out = [];
  for (const c of classes) {
    const tid = c.teacherId;
    if (!tid || tid === "local" || seen[tid]) continue;
    seen[tid] = true;
    let name = "Teacher", photo = "";
    try {
      const snap = await fs().getDoc(fs().doc(db(), "users", tid));
      if (snap.exists()) { name = snap.data().name || name; photo = snap.data().photoURL || ""; }
    } catch (e) {}
    out.push({ id: tid, name: name, photoURL: photo, className: c.name || "" });
  }
  return out;
}

// Threads for the current user (student or teacher). Sorted newest first client-side.
export async function myThreads(role) {
  const u = me();
  if (!u) return [];
  try {
    const field = role === "teacher" ? "teacherId" : "studentId";
    const q = fs().query(fs().collection(db(), "threads"), fs().where(field, "==", u));
    const snap = await fs().getDocs(q);
    const list = snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
    list.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    return list;
  } catch (e) { return []; }
}

export async function getMessages(tid) {
  try {
    const q = fs().query(
      fs().collection(db(), "threads", tid, "messages"),
      fs().orderBy("createdAt", "asc"), fs().limit(100));
    const snap = await fs().getDocs(q);
    return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
  } catch (e) { return []; }
}

// Ensure the thread doc exists (student opening chat first time).
export async function ensureThread(teacher) {
  const u = me();
  if (!u) return null;
  const tid = threadId(teacher.id, u);
  const ref = fs().doc(db(), "threads", tid);
  try {
    const snap = await fs().getDoc(ref);
    if (!snap.exists()) {
      await fs().setDoc(ref, {
        teacherId: teacher.id, teacherName: teacher.name || "Teacher", teacherPhoto: teacher.photoURL || "",
        studentId: u, studentName: (S.profile && S.profile.name) || "Student",
        studentPhoto: (S.profile && S.profile.photoURL) || "",
        className: teacher.className || "",
        updatedAt: Date.now(), lastText: "", lastFrom: "",
        unreadTeacher: 0, unreadStudent: 0, createdAt: ts()
      });
    }
    return tid;
  } catch (e) { return null; }
}

export async function sendThreadMessage(tid, text, role) {
  const u = me();
  text = String(text || "").trim().slice(0, 2000);
  if (!u || !text) return false;
  try {
    const tref = fs().doc(db(), "threads", tid);
    const tsnap = await fs().getDoc(tref);
    if (!tsnap.exists()) return false;
    const t = tsnap.data();
    await fs().addDoc(fs().collection(db(), "threads", tid, "messages"), {
      from: u, text: text, createdAt: ts()
    });
    const upd = { updatedAt: Date.now(), lastText: text.slice(0, 120), lastFrom: u };
    if (role === "student") upd.unreadTeacher = (t.unreadTeacher || 0) + 1;
    else upd.unreadStudent = (t.unreadStudent || 0) + 1;
    // refresh display names/photos in case they changed
    if (role === "student") {
      upd.studentName = (S.profile && S.profile.name) || t.studentName || "Student";
      upd.studentPhoto = (S.profile && S.profile.photoURL) || "";
    }
    await fs().updateDoc(tref, upd);
    return true;
  } catch (e) { return false; }
}

export async function markThreadRead(tid, role) {
  const u = me();
  if (!u) return;
  try {
    const field = role === "teacher" ? "unreadTeacher" : "unreadStudent";
    await fs().updateDoc(fs().doc(db(), "threads", tid), { [field]: 0 });
  } catch (e) {}
}

/* ---------------- shared chat UI ---------------- */

function photoHTML(url, size) {
  size = size || 40;
  if (url) return '<img src="' + esc(url) + '" alt="" style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;object-fit:cover;flex:none;" />';
  return '<span style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:#e8e0d0;display:inline-flex;align-items:center;justify-content:center;font-size:' + Math.round(size / 2) + 'px;flex:none;">👤</span>';
}

function chatShell(opts) {
  // opts: {title, subtitle, photo, backLabel, onBack, role, tid}
  return '<div class="screen-head"><button class="back-btn" id="msgBack">← ' + esc(opts.backLabel || "Back") + "</button>" +
    "<h2>💬 " + esc(opts.title) + "</h2>" +
    (opts.subtitle ? '<p class="fine">' + esc(opts.subtitle) + "</p>" : "") + "</div>" +
    '<div class="card"><div class="safety-banner">' + SAFETY + "</div>" +
    '<div class="chat-log" id="msgLog" style="max-height:50vh;overflow-y:auto;"></div>' +
    '<div class="row-flex"><input id="msgInput" class="tfield" type="text" placeholder="Type a message…" autocomplete="off" maxlength="2000">' +
    '<button class="btn-primary" id="msgSend">Send</button></div></div>';
}

export async function openChat(opts) {
  // opts: {tid, role, title, subtitle, photo, backLabel, onBack}
  const body = document.getElementById("msgBody");
  if (!body) return;
  body.innerHTML = chatShell(opts);
  showScreen("screen-teachers");
  const log = body.querySelector("#msgLog");
  const input = body.querySelector("#msgInput");

  async function render() {
    const msgs = await getMessages(opts.tid);
    const u = me();
    log.innerHTML = msgs.length ? msgs.map(function (m) {
      const mine = m.from === u;
      return '<div class="bubble ' + (mine ? "me" : "them") + '">' + esc(m.text) +
        "<small>" + esc(mine ? "You" : opts.title) + "</small></div>";
    }).join("") : '<p class="fine">No messages yet — say salaam! 👋</p>';
    log.scrollTop = log.scrollHeight;
  }
  await render();
  await markThreadRead(opts.tid, opts.role);

  body.querySelector("#msgBack").addEventListener("click", opts.onBack);
  const send = async function () {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    input.disabled = true;
    const ok = await sendThreadMessage(opts.tid, text, opts.role);
    input.disabled = false;
    if (ok) { await render(); await markThreadRead(opts.tid, opts.role); }
    else { input.value = text; }
    input.focus();
  };
  body.querySelector("#msgSend").addEventListener("click", send);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
  input.focus();
  // light polling for new messages while the chat is open
  const poll = setInterval(async function () {
    if (!document.body.contains(log)) { clearInterval(poll); return; }
    await render();
  }, 8000);
}

/* ---------------- student views ---------------- */

export async function renderTeachers() {
  const body = document.getElementById("msgBody");
  if (!body) return;
  if (!online()) {
    body.innerHTML = '<div class="screen-head"><button class="back-btn" id="msgBack">← Home</button><h2>👩‍🏫 My Teachers</h2></div>' +
      '<div class="notice">Sign in to message your teachers (offline right now).</div>';
    showScreen("screen-teachers");
    body.querySelector("#msgBack").addEventListener("click", function () { go("home"); });
    return;
  }
  body.innerHTML = '<div class="screen-head"><button class="back-btn" id="msgBack">← Home</button><h2>👩‍🏫 My Teachers</h2>' +
    '<p>Message the teachers of your classes. They usually reply within a day.</p></div><div id="msgList"><p class="fine">Loading…</p></div>';
  showScreen("screen-teachers");
  body.querySelector("#msgBack").addEventListener("click", function () { go("home"); });

  const teachers = await myTeachers();
  const threads = await myThreads("student");
  const unreadByTeacher = {};
  threads.forEach(function (t) { unreadByTeacher[t.teacherId] = t.unreadStudent || 0; });
  const list = body.querySelector("#msgList");
  if (!teachers.length) {
    list.innerHTML = '<div class="empty-msg">No teachers yet.<br>Ask your teacher to add you to their class in the app — then you can message them here. 💬</div>';
    return;
  }
  list.innerHTML = '<div class="card">' + teachers.map(function (t) {
    const un = unreadByTeacher[t.id] || 0;
    return '<div class="roster-row"><div style="display:flex;align-items:center;gap:10px;">' + photoHTML(t.photoURL, 44) +
      "<div><strong>" + esc(t.name) + "</strong>" +
      (t.className ? '<br><span class="fine">' + esc(t.className) + "</span>" : "") + "</div>" +
      (un ? '<span class="pill" style="margin-left:auto;">' + un + " new</span>" : "") + "</div>" +
      '<button class="btn-secondary btn-sm" data-teacher="' + esc(t.id) + '">💬 Message</button></div>';
  }).join("") + "</div>";
  const byId = {};
  teachers.forEach(function (t) { byId[t.id] = t; });
  list.querySelectorAll("[data-teacher]").forEach(function (b) {
    b.addEventListener("click", async function () {
      const t = byId[b.getAttribute("data-teacher")];
      const tid = await ensureThread(t);
      if (!tid) return;
      openChat({
        tid: tid, role: "student", title: t.name, photo: t.photoURL,
        subtitle: t.className || "", backLabel: "Teachers",
        onBack: renderTeachers
      });
    });
  });
}

/* ---------------- teacher views ---------------- */

export async function renderTeacherInbox(box) {
  if (!online()) { box.innerHTML = '<p class="fine">Sign in to see messages.</p>'; return; }
  box.innerHTML = '<p class="fine">Loading…</p>';
  const threads = await myThreads("teacher");
  if (!threads.length) {
    box.innerHTML = '<p class="empty-msg">No messages yet.<br>When a student from your class messages you, it appears here. 💬</p>';
    return;
  }
  box.innerHTML = '<div class="card">' + threads.map(function (t) {
    const un = t.unreadTeacher || 0;
    return '<div class="roster-row"><div style="display:flex;align-items:center;gap:10px;">' + photoHTML(t.studentPhoto, 44) +
      "<div><strong>" + esc(t.studentName || "Student") + "</strong>" +
      (t.className ? '<br><span class="fine">' + esc(t.className) + "</span>" : "") +
      (t.lastText ? '<br><span class="fine">“' + esc(t.lastText) + "”</span>" : "") + "</div>" +
      (un ? '<span class="pill" style="margin-left:auto;">' + un + " new</span>" : "") + "</div>" +
      '<button class="btn-secondary btn-sm" data-thread="' + esc(t.id) + '">💬 Reply</button></div>';
  }).join("") + "</div>";
  const byId = {};
  threads.forEach(function (t) { byId[t.id] = t; });
  box.querySelectorAll("[data-thread]").forEach(function (b) {
    b.addEventListener("click", function () {
      const t = byId[b.getAttribute("data-thread")];
      openChat({
        tid: t.id, role: "teacher",
        title: t.studentName || "Student", photo: t.studentPhoto,
        subtitle: t.className || "", backLabel: "Inbox",
        onBack: function () { renderTeacherInbox(box); }
      });
    });
  });
}
