// LinguaBuddy — 🎓 Find a Tutor: marketplace DOM/UI module.
// Renders the tutor directory, profiles, trial-booking flow (with parent
// gate), bookings, in-app chat, reviews, progress notes, and reports.
// Pure data + persistence live in ./tutors.js — this file is DOM only,
// and follows the self-contained pattern of js/marks.js: it creates its own
// <section id="screen-tutors"> and <style id="tutors-css"> if missing.

import { esc } from "./utils.js";
import { S } from "./store.js";
import { showScreen } from "./ui.js";
import { toast } from "./gamify.js";
import { schoolState } from "./scheme.js";
import {
  TUTORS, getTutor, tutorTags, tutorSloIds, filterTutors,
  tutorAvgRating, tutorReviews, weakSloSummary, tutorsForWeakSlos,
  myBookings, createBooking, cancelBooking, rescheduleBooking, markPaid,
  getBooking, threadFor, sendMessage, addReview, addProgressNote,
  notesForBooking, reportTutor, requestVerification, SAFETY
} from "./tutors.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setTutorsGo(fn) { go = fn; }

// ---------- screen + CSS ----------

function ensureTutorsScreen() {
  if (!$("screen-tutors")) {
    const sec = document.createElement("section");
    sec.id = "screen-tutors";
    sec.className = "screen hidden";
    sec.innerHTML = '<div id="tutorsBody"></div>';
    const main = document.querySelector("main");
    if (main) main.appendChild(sec);
  }
  if (!$("tutors-css") && document.head) {
    const st = document.createElement("style");
    st.id = "tutors-css";
    st.textContent =
      ".tutor-list{display:grid;gap:10px}" +
      ".tutor-card{border:1px solid #e6e6e6;border-radius:12px;padding:12px;background:#fff;cursor:pointer}" +
      ".tutor-card:active{transform:scale(.995)}" +
      ".tutor-top{display:flex;gap:10px;align-items:center}" +
      ".tutor-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.25rem;color:#fff;flex:0 0 48px}" +
      ".tutor-avatar.big{width:72px;height:72px;font-size:1.9rem;flex-basis:72px}" +
      ".tutor-name{font-weight:700;font-size:1.05rem}" +
      ".verified{color:#1d8a4c;font-weight:700;white-space:nowrap}" +
      ".pending{color:#b07d10;font-weight:700;white-space:nowrap}" +
      ".stars{color:#e8a13b;letter-spacing:1px;white-space:nowrap}" +
      ".fee{font-weight:700}" +
      ".chiprow{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 0}" +
      ".chiprow .chip{background:#f1efff;border-radius:20px;padding:3px 10px;font-size:.82em}" +
      ".match-line{background:#eef7ee;border:1px solid #bfe3bf;border-radius:8px;padding:8px 10px;margin:10px 0 0;font-size:.9em}" +
      ".tfilter-bar{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}" +
      ".tfilter-bar select,.tfield{padding:10px 12px;border:2px solid #e0ddd5;border-radius:10px;font-family:inherit;background:#fff;min-height:48px;width:100%;font-size:1rem}" +
      ".tfilter-toggles{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 10px}" +
      ".pill{display:inline-block;border-radius:20px;padding:3px 12px;font-size:.82em;font-weight:700}" +
      ".pill-requested{background:#fff3d6;color:#8a6d1a}" +
      ".pill-confirmed{background:#e6f4ea;color:#1d8a4c}" +
      ".pill-cancelled{background:#fdeceb;color:#c0392b}" +
      ".pill-completed{background:#e8eefb;color:#3b5bd6}" +
      ".booking-card{border:1px solid #e6e6e6;border-radius:12px;padding:12px;background:#fff;margin:10px 0}" +
      ".booking-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}" +
      ".slot-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}" +
      ".chat-log{display:flex;flex-direction:column;gap:8px;margin:10px 0;max-height:50vh;overflow-y:auto}" +
      ".bubble{max-width:82%;padding:10px 12px;border-radius:14px;line-height:1.4}" +
      ".bubble.me{align-self:flex-end;background:#7c5cd6;color:#fff;border-bottom-right-radius:4px}" +
      ".bubble.them{align-self:flex-start;background:#f1f1f4;border-bottom-left-radius:4px}" +
      ".bubble small{display:block;opacity:.7;font-size:.75em;margin-top:4px}" +
      ".safety-banner{background:#fff8e1;border:1px solid #e0c36a;border-radius:10px;padding:10px 12px;font-size:.9em;margin:10px 0}" +
      ".star-pick{font-size:2rem;cursor:pointer;color:#ddd;user-select:none}" +
      ".star-pick.lit{color:#e8a13b}" +
      ".tmodal-back{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;z-index:60}" +
      ".tmodal{background:#fff;border-radius:16px 16px 0 0;padding:18px;width:100%;max-width:560px;max-height:88vh;overflow-y:auto}" +
      ".checkline{display:flex;gap:10px;align-items:flex-start;margin:12px 0}" +
      ".checkline input{width:22px;height:22px;margin-top:2px;flex:0 0 22px}" +
      ".prog-note{border:1px solid #e6e6e6;border-radius:10px;padding:10px 12px;margin:8px 0;background:#fafafa}" +
      ".review-item{border-top:1px dashed #e6e6e6;padding:10px 0}" +
      ".guide-card{background:#f4f7ff;border:1px solid #c9d6f2;border-radius:12px;padding:12px;margin-top:14px}" +
      ".guide-card li{margin:6px 0 6px 18px;font-size:.92em}";
    document.head.appendChild(st);
  }
  return $("tutorsBody");
}

// ---------- view state ----------

let viaParents = false;
let curView = { name: "directory" };
let filters = null;
let bookState = null;      // { tutorId, slot, step }
let reviewStars = 5;
let reschedFor = null;     // booking id currently picking a new slot
let noteSloSel = [];

function backDest() { return viaParents ? "parents" : "home"; }

function defaultFilters() {
  return { subject: "", grade: "", mode: "", maxFee: "", myLesson: false, verifiedOnly: false, minRating: "" };
}

// ---------- small helpers ----------

const AVATAR_COLORS = ["#7c5cd6", "#4a8de0", "#2a9d8f", "#e76f51", "#e9a13b", "#c15bbd"];

function avatarColor(name) {
  let h = 0;
  String(name || "?").split("").forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; });
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initialOf(name) {
  const n = String(name || "?").trim();
  return n ? n[0].toUpperCase() : "?";
}

function avatarHTML(name, big) {
  return '<div class="tutor-avatar' + (big ? " big" : "") + '" style="background:' + avatarColor(name) + '">' +
    esc(initialOf(name)) + "</div>";
}

function starsHTML(r) {
  r = Number(r) || 0;
  let out = "";
  for (let i = 1; i <= 5; i++) out += i <= Math.round(r) ? "★" : "☆";
  return '<span class="stars" title="' + r.toFixed(1) + ' / 5">' + out + "</span> " +
    '<span class="fine">' + (r ? r.toFixed(1) : "new") + "</span>";
}

function statusPill(status) {
  const s = String(status || "requested").toLowerCase();
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  return '<span class="pill pill-' + esc(s) + '">' + esc(label) + "</span>";
}

function fmtWhen(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

function tagLabel(t) {
  if (t == null) return "";
  if (typeof t === "string") return t;
  return (t.code ? t.code + " · " : "") + (t.title || t.label || "");
}

function tutorSlots(t) {
  return (t && (t.availability || t.slots)) || [];
}

// weakSloSummary() shape is owned by tutors.js; normalize to a titles string
function weakTitlesText() {
  try {
    const s = weakSloSummary();
    if (!s) return "";
    if (typeof s === "string") return s;
    if (Array.isArray(s)) {
      return s.map(function (x) { return typeof x === "string" ? x : (x && (x.title || x.code)) || ""; })
        .filter(Boolean).join(", ");
    }
    if (s.titles) return Array.isArray(s.titles) ? s.titles.join(", ") : String(s.titles);
    return "";
  } catch (e) { return ""; }
}

// tutorsForWeakSlos() returns [{tutor, matched}] — normalize to a tutor-id set
function weakTutorIds() {
  try {
    return ((tutorsForWeakSlos() || []).map(function (x) {
      return typeof x === "string" ? x : (x && (x.tutor ? x.tutor.id : x.id));
    }).filter(Boolean));
  } catch (e) { return []; }
}

function activeBookingsFor(tutorId) {
  return (myBookings() || []).filter(function (b) {
    return b.tutorId === tutorId && ["requested", "confirmed"].indexOf(String(b.status || "").toLowerCase()) >= 0;
  });
}

// ---------- VIEW 1: directory ----------

function filterOptions() {
  const subs = {}, grades = {}, modes = {};
  (TUTORS || []).forEach(function (t) {
    (t.subjects || []).forEach(function (s) { subs[s] = 1; });
    (t.grades || []).forEach(function (g) { grades[g] = 1; });
    ((t.modes || []).concat(t.mode ? [t.mode] : [])).forEach(function (m) { modes[m] = 1; });
  });
  return {
    subjects: Object.keys(subs).sort(),
    grades: Object.keys(grades).sort(),
    modes: Object.keys(modes).sort()
  };
}

function optHTML(value, label, cur) {
  return '<option value="' + esc(value) + '"' + (String(cur) === String(value) ? " selected" : "") + ">" + esc(label) + "</option>";
}

function filterBarHTML() {
  const o = filterOptions();
  const f = filters;
  const st = schoolState(S.profile);
  let html = '<div class="tfilter-bar">' +
    '<select data-f="subject" aria-label="Subject">' + optHTML("", "All subjects", f.subject) +
      o.subjects.map(function (s) { return optHTML(s, s, f.subject); }).join("") + "</select>" +
    '<select data-f="grade" aria-label="Grade">' + optHTML("", "All grades", f.grade) +
      o.grades.map(function (g) { return optHTML(g, g, f.grade); }).join("") + "</select>" +
    '<select data-f="mode" aria-label="Mode">' + optHTML("", "Online + In-person", f.mode) +
      o.modes.map(function (m) { return optHTML(m, m, f.mode); }).join("") + "</select>" +
    '<select data-f="maxFee" aria-label="Maximum fee">' + optHTML("", "Any fee", f.maxFee) +
      optHTML("500", "Up to Rs 500", f.maxFee) + optHTML("1000", "Up to Rs 1,000", f.maxFee) +
      optHTML("1500", "Up to Rs 1,500", f.maxFee) + optHTML("2000", "Up to Rs 2,000", f.maxFee) +
      optHTML("3000", "Up to Rs 3,000", f.maxFee) + "</select>" +
    '<select data-f="minRating" aria-label="Minimum rating">' + optHTML("", "Any rating", f.minRating) +
      optHTML("4.5", "4.5★ & up", f.minRating) + optHTML("4", "4.0★ & up", f.minRating) +
      optHTML("3.5", "3.5★ & up", f.minRating) + "</select>" +
    "</div>" +
    '<div class="tfilter-toggles">';
  if (st) {
    html += '<button class="btn-ghost btn-sm' + (f.myLesson ? " active" : "") + '" data-toggle="myLesson">' +
      "📍 Teaches my child's current lesson" + (f.myLesson ? " ✓" : "") + "</button>";
  }
  html += '<button class="btn-ghost btn-sm' + (f.verifiedOnly ? " active" : "") + '" data-toggle="verifiedOnly">' +
    "✓ Verified only" + (f.verifiedOnly ? " ✓" : "") + "</button></div>";
  return html;
}

function tutorCardHTML(t, weakIds) {
  const rating = tutorAvgRating(t);
  const tags = (tutorTags(t) || []).slice(0, 4);
  const weak = weakIds.indexOf(t.id) >= 0;
  const weakTitles = weak ? weakTitlesText() : "";
  return '<div class="tutor-card" data-tutor="' + esc(t.id) + '">' +
    '<div class="tutor-top">' + avatarHTML(t.name) +
    '<div style="flex:1;min-width:0"><div class="tutor-name">' + esc(t.name) + " " +
    (t.verified ? '<span class="verified">✓ Verified</span>' : "") + "</div>" +
    '<div class="fine">' + esc([t.city, (t.modes || []).join("/"), t.mode].filter(Boolean).join(" · ")) + "</div></div>" +
    '<div style="text-align:right">' + starsHTML(rating) +
    '<div class="fee">Rs ' + esc(t.feePKR) + "/lesson</div></div></div>" +
    '<div class="chiprow">' + (t.subjects || []).map(function (s) {
      return '<span class="chip">' + esc(s) + "</span>";
    }).join("") +
    (t.grades || []).map(function (g) { return '<span class="chip">' + esc(g) + "</span>"; }).join("") +
    tags.map(function (g) { return '<span class="chip">' + esc(tagLabel(g)) + "</span>"; }).join("") + "</div>" +
    (weak ? '<div class="match-line">🎯 Matches ' + esc((S.profile && S.profile.name) || "your") +
      " weak areas" + (weakTitles ? ": " + esc(weakTitles) : "") + "</div>" : "") +
    "</div>";
}

function guidelinesHTML() {
  return '<div class="guide-card"><strong>🛡️ Tutoring safety guidelines</strong><ul>' +
    "<li>First meeting: online, or in person with a parent/guardian present.</li>" +
    "<li>Keep all communication inside LinguaBuddy — no phone numbers or addresses.</li>" +
    "<li>Never share CNIC, bank account details, or passwords with a tutor.</li>" +
    "<li>" + esc((SAFETY && SAFETY.pay) || "Agree payment terms before the first lesson.") + "</li>" +
    "</ul></div>";
}

function renderDirectory() {
  if (!filters) {
    filters = defaultFilters();
    const st = schoolState(S.profile);
    if (st) filters.myLesson = true; // default: tutors for my child's current lesson
  }
  const st = schoolState(S.profile);
  const list = filterTutors({
    subject: filters.subject || undefined,
    grade: filters.grade || undefined,
    mode: filters.mode || undefined,
    maxFee: filters.maxFee ? Number(filters.maxFee) : undefined,
    verifiedOnly: !!filters.verifiedOnly,
    minRating: filters.minRating ? Number(filters.minRating) : undefined,
    schemeId: (filters.myLesson && st) ? st.scheme.id : undefined,
    lessonN: (filters.myLesson && st) ? st.lesson : undefined
  }) || [];
  const weakIds = weakTutorIds();
  const body = ensureTutorsScreen();
  if (!body) return;
  body.innerHTML =
    '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Back</button>' +
    "<h2>🎓 Find a Tutor</h2>" +
    '<p class="fine">Tutors matched to the Aga Khan curriculum your child is studying.</p></div>' +
    '<div class="card">' + filterBarHTML() +
    '<p class="fine">' + list.length + " tutor" + (list.length === 1 ? "" : "s") + " found</p>" +
    '<div class="tutor-list">' +
    (list.length ? list.map(function (t) { return tutorCardHTML(t, weakIds); }).join("") :
      '<p class="fine">No tutors match these filters. Try widening the fee or rating range.</p>') +
    "</div></div>" +
    '<div class="card"><div class="row-flex">' +
    '<button class="btn-secondary" id="tutorsMyBookings">📋 My bookings</button>' +
    "</div></div>" +
    guidelinesHTML();
  showScreen("screen-tutors");
  body.querySelector("#tutorsBack").addEventListener("click", function () { go(backDest()); });
  body.querySelector("#tutorsMyBookings").addEventListener("click", function () {
    curView = { name: "bookings" }; render();
  });
  body.querySelectorAll("[data-f]").forEach(function (sel) {
    sel.addEventListener("change", function () {
      filters[sel.getAttribute("data-f")] = sel.value;
      renderDirectory();
    });
  });
  body.querySelectorAll("[data-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const k = btn.getAttribute("data-toggle");
      filters[k] = !filters[k];
      renderDirectory();
    });
  });
  body.querySelectorAll("[data-tutor]").forEach(function (card) {
    card.addEventListener("click", function () {
      curView = { name: "detail", tutorId: card.getAttribute("data-tutor") };
      render();
    });
  });
}

// ---------- VIEW 2: tutor detail ----------

function reviewItemHTML(r) {
  return '<div class="review-item"><div>' + starsHTML(r.stars) +
    ' <span class="fine">' + esc(r.author || "Parent") + (r.date ? " · " + esc(fmtWhen(r.date)) : "") + "</span></div>" +
    '<div>' + esc(r.text || "") + "</div></div>";
}

function renderDetail(tutorId) {
  const t = getTutor(tutorId);
  const body = ensureTutorsScreen();
  if (!body || !t) { renderDirectory(); return; }
  const rating = tutorAvgRating(t);
  const tags = tutorTags(t) || [];
  const reviews = tutorReviews(t) || [];
  const weakIds = weakTutorIds();
  const weak = weakIds.indexOf(t.id) >= 0;
  const slots = tutorSlots(t);
  let verifyBlock;
  if (t.verified) verifyBlock = '<span class="verified">✓ Verified tutor</span>';
  else if (t.verificationPending) verifyBlock = '<span class="pending">⏳ Verification pending</span>';
  else verifyBlock = '<button class="btn-ghost btn-sm" id="tVerify">✓ Request verification</button>';
  body.innerHTML =
    '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Tutors</button>' +
    "<h2>🎓 Tutor profile</h2></div>" +
    '<div class="card"><div class="tutor-top">' + avatarHTML(t.name, true) +
    '<div style="flex:1"><div class="tutor-name" style="font-size:1.2rem">' + esc(t.name) + "</div>" +
    "<div>" + verifyBlock + "</div>" +
    '<div style="margin-top:4px">' + starsHTML(rating) + ' <span class="fine">(' + reviews.length + " review" +
    (reviews.length === 1 ? "" : "s") + ")</span></div>" +
    '<div class="fee" style="font-size:1.1rem">Rs ' + esc(t.feePKR) + "/lesson</div>" +
    '<div class="fine">' + esc([t.city, (t.modes || []).join("/"), t.mode].filter(Boolean).join(" · ")) + "</div></div></div>" +
    '<div class="chiprow">' + (t.subjects || []).map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") +
    (t.grades || []).map(function (g) { return '<span class="chip">' + esc(g) + "</span>"; }).join("") + "</div>" +
    (t.langs && t.langs.length ? '<p class="fine" style="margin:8px 0 0">🗣️ ' + esc(t.langs.join(", ")) + "</p>" : "") +
    (t.about ? "<p>" + esc(t.about) + "</p>" : "") +
    (weak ? '<div class="match-line">🎯 Matches ' + esc((S.profile && S.profile.name) || "your") +
      " weak areas" + (weakTitlesText() ? ": " + esc(weakTitlesText()) : "") + "</div>" : "") +
    "</div>" +
    '<div class="card"><h3>📚 Teaches</h3><div class="chiprow">' +
    (tags.length ? tags.map(function (g) { return '<span class="chip">' + esc(tagLabel(g)) + "</span>"; }).join("") :
      '<span class="fine">General English support</span>') + "</div></div>" +
    '<div class="card"><h3>🕒 Availability</h3>' +
    (slots.length ? '<div class="slot-grid">' + slots.map(function (s) {
      return '<button class="btn-ghost btn-sm" data-bookslot="' + esc(s) + '">' + esc(s) + "</button>";
    }).join("") + "</div>" : '<p class="fine">No slots listed — message the tutor after booking.</p>') + "</div>" +
    '<div class="card"><h3>⭐ Reviews</h3><div id="tReviews">' +
    (reviews.length ? reviews.map(reviewItemHTML).join("") : '<p class="fine">No reviews yet — be the first!</p>') +
    "</div></div>" +
    '<div class="card"><div class="booking-actions" style="margin-top:0">' +
    '<button class="btn-primary" id="tBook">📅 Request trial lesson</button>' +
    '<button class="btn-secondary" id="tMsg">💬 Message</button>' +
    '<button class="btn-ghost" id="tReview">⭐ Write review</button>' +
    '<button class="btn-ghost" id="tNotes">📝 Progress notes</button>' +
    '<button class="btn-ghost" id="tReport">🚩 Report</button>' +
    "</div></div>" +
    guidelinesHTML();
  showScreen("screen-tutors");
  body.querySelector("#tutorsBack").addEventListener("click", function () {
    curView = { name: "directory" }; render();
  });
  body.querySelectorAll("[data-bookslot]").forEach(function (b) {
    b.addEventListener("click", function () {
      bookState = { tutorId: t.id, slot: b.getAttribute("data-bookslot"), step: 2 };
      curView = { name: "book" }; render();
    });
  });
  body.querySelector("#tBook").addEventListener("click", function () {
    bookState = { tutorId: t.id, slot: null, step: 1 };
    curView = { name: "book" }; render();
  });
  body.querySelector("#tMsg").addEventListener("click", function () {
    const bks = activeBookingsFor(t.id);
    if (bks.length) { curView = { name: "chat", bookingId: bks[0].id }; render(); }
    else toast("📅 Request a trial lesson first — chat opens once you have a booking.");
  });
  body.querySelector("#tReview").addEventListener("click", function () {
    reviewStars = 5;
    curView = { name: "review", tutorId: t.id }; render();
  });
  body.querySelector("#tNotes").addEventListener("click", function () {
    const mine = (myBookings() || []).filter(function (b) { return b.tutorId === t.id; });
    if (mine.length) { noteSloSel = []; curView = { name: "notes", bookingId: mine[0].id }; render(); }
    else toast("📝 Progress notes appear once you have a booking with this tutor.");
  });
  body.querySelector("#tReport").addEventListener("click", function () { openReportDialog(t); });
  const vbtn = body.querySelector("#tVerify");
  if (vbtn) vbtn.addEventListener("click", function () {
    requestVerification(t.id);
    toast("✓ Verification requested — the tutor will be reviewed soon.");
    renderDetail(t.id);
  });
}

// ---------- VIEW 3: booking flow (slot picker -> parent gate -> confirm) ----------

function renderBook() {
  const t = getTutor(bookState.tutorId);
  const body = ensureTutorsScreen();
  if (!body || !t) { renderDirectory(); return; }
  const slots = tutorSlots(t);

  if (bookState.step === 1) {
    body.innerHTML =
      '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Profile</button>' +
      "<h2>📅 Request trial lesson</h2></div>" +
      '<div class="card"><div class="tutor-top">' + avatarHTML(t.name) +
      '<div><div class="tutor-name">' + esc(t.name) + "</div>" +
      '<div class="fine">Rs ' + esc(t.feePKR) + "/lesson · Trial lesson</div></div></div>" +
      "<h3>Pick a time slot</h3>" +
      (slots.length ? '<div class="slot-grid">' + slots.map(function (s) {
        return '<button class="btn-ghost btn-sm" data-slot="' + esc(s) + '">' + esc(s) + "</button>";
      }).join("") + "</div>" : '<p class="fine">No slots listed. Pick "Any time" and confirm with the tutor in chat.</p>' +
        '<button class="btn-primary" data-slot="Any time">Any time</button>') +
      "</div>";
    showScreen("screen-tutors");
    body.querySelector("#tutorsBack").addEventListener("click", function () {
      curView = { name: "detail", tutorId: t.id }; render();
    });
    body.querySelectorAll("[data-slot]").forEach(function (b) {
      b.addEventListener("click", function () {
        bookState.slot = b.getAttribute("data-slot");
        bookState.step = 2;
        renderBook();
      });
    });
    return;
  }

  // step 2: parent gate — always required (the app has no parent role)
  body.innerHTML =
    '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Slots</button>' +
    "<h2>👨‍👩‍👧 Parent confirmation</h2></div>" +
    '<div class="card"><p><strong>Trial bookings must be confirmed by a parent or guardian.</strong></p>' +
    '<div class="safety-banner">🛡️ ' + esc((SAFETY && SAFETY.chat) || "Keep all communication inside LinguaBuddy.") + "</div>" +
    '<p class="fine">Tutor: <strong>' + esc(t.name) + "</strong> · Slot: <strong>" + esc(bookState.slot) +
    "</strong> · Fee: <strong>Rs " + esc(t.feePKR) + "</strong></p>" +
    '<label class="fine" for="pgName">Parent / guardian full name</label>' +
    '<input class="tfield" id="pgName" type="text" placeholder="e.g. Fatima Khan" autocomplete="off">' +
    '<label class="checkline"><input type="checkbox" id="pgCheck">' +
    "<span>I am the parent/guardian and I approve this trial lesson.</span></label>" +
    '<button class="btn-primary" id="pgSubmit" disabled>✅ Confirm trial booking</button></div>';
  showScreen("screen-tutors");
  const nameEl = body.querySelector("#pgName");
  const checkEl = body.querySelector("#pgCheck");
  const submitEl = body.querySelector("#pgSubmit");
  const validate = function () {
    submitEl.disabled = !(nameEl.value.trim() && checkEl.checked);
  };
  nameEl.addEventListener("input", validate);
  checkEl.addEventListener("change", validate);
  body.querySelector("#tutorsBack").addEventListener("click", function () {
    bookState.step = 1; renderBook();
  });
  submitEl.addEventListener("click", function () {
    if (submitEl.disabled) return;
    const booking = createBooking({ tutorId: t.id, slot: bookState.slot, parentName: nameEl.value.trim() });
    curView = { name: "bookDone", booking: booking, tutorId: t.id };
    render();
  });
}

function renderBookDone(booking, tutorId) {
  const t = getTutor(tutorId);
  const body = ensureTutorsScreen();
  if (!body) return;
  body.innerHTML =
    '<div class="screen-head"><h2>✅ Trial requested!</h2></div>' +
    '<div class="card"><p>Your trial lesson request has been sent to <strong>' + esc(t ? t.name : "the tutor") + "</strong>.</p>" +
    '<p class="fine">Slot: <strong>' + esc(booking.slot) + "</strong><br>" +
    "Confirmed by: <strong>" + esc(booking.parentName) + "</strong><br>" +
    "Reference: <strong>" + esc(booking.id) + "</strong></p>" +
    '<div class="safety-banner">🛡️ ' + esc((SAFETY && SAFETY.chat) || "Keep all communication inside LinguaBuddy.") + "<br>" +
    "For the first meeting: join online, or meet in person with a parent/guardian present. " +
    esc((SAFETY && SAFETY.pay) || "") + "</div>" +
    '<div class="booking-actions">' +
    '<button class="btn-primary" id="bdChat">💬 Message tutor</button>' +
    '<button class="btn-secondary" id="bdBookings">📋 My bookings</button>' +
    '<button class="btn-ghost" id="bdDone">🎓 Find more tutors</button>' +
    "</div></div>";
  showScreen("screen-tutors");
  body.querySelector("#bdChat").addEventListener("click", function () {
    curView = { name: "chat", bookingId: booking.id }; render();
  });
  body.querySelector("#bdBookings").addEventListener("click", function () {
    curView = { name: "bookings" }; render();
  });
  body.querySelector("#bdDone").addEventListener("click", function () {
    curView = { name: "directory" }; render();
  });
}

// ---------- VIEW 4: my bookings ----------

function bookingCardHTML(b) {
  const t = getTutor(b.tutorId) || {};
  const slots = tutorSlots(t);
  let html = '<div class="booking-card" data-booking="' + esc(b.id) + '">' +
    '<div class="tutor-top">' + avatarHTML(t.name) +
    '<div style="flex:1"><div class="tutor-name">' + esc(t.name || "Tutor") + " " +
    (t.verified ? '<span class="verified">✓</span>' : "") + "</div>" +
    '<div class="fine">🕒 ' + esc(b.slot) + (b.parentName ? " · 👨‍👩‍👧 " + esc(b.parentName) : "") + "</div></div>" +
    statusPill(b.status) + "</div>" +
    '<div class="fine" style="margin-top:8px">' +
    (b.paid ? "💵 <strong>Paid</strong>" : "💵 Not paid yet") +
    (t.feePKR ? " · Rs " + esc(t.feePKR) + "/lesson" : "") + "</div>" +
    (b.paid ? "" : '<p class="fine">💵 <button class="btn-ghost btn-sm" data-paid="' + esc(b.id) + '">Mark as paid (JazzCash/Easypaisa)</button><br>' +
      "Local record only — no real payment is processed in the app.</p>");
  if (reschedFor === b.id && slots.length) {
    html += '<div class="slot-grid">' + slots.map(function (s) {
      return '<button class="btn-ghost btn-sm" data-resched="' + esc(b.id) + '" data-slot="' + esc(s) + '">' + esc(s) + "</button>";
    }).join("") + "</div>";
  }
  html += '<div class="booking-actions">' +
    '<button class="btn-secondary btn-sm" data-chat="' + esc(b.id) + '">💬 Message tutor</button>' +
    '<button class="btn-ghost btn-sm" data-notes="' + esc(b.id) + '">📝 Progress notes</button>' +
    (slots.length && String(b.status || "").toLowerCase() !== "cancelled" ?
      '<button class="btn-ghost btn-sm" data-resched-toggle="' + esc(b.id) + '">🔁 Reschedule</button>' : "") +
    (String(b.status || "").toLowerCase() !== "cancelled" ?
      '<button class="btn-ghost btn-sm" data-cancel="' + esc(b.id) + '">❌ Cancel</button>' : "") +
    "</div></div>";
  return html;
}

function renderBookings() {
  reschedFor = null;
  const list = (myBookings() || []).slice().reverse();
  const body = ensureTutorsScreen();
  if (!body) return;
  body.innerHTML =
    '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Back</button>' +
    "<h2>📋 My bookings</h2></div>" +
    '<div class="card">' +
    (list.length ? list.map(bookingCardHTML).join("") :
      '<p class="fine">No bookings yet.</p>' +
      '<button class="btn-primary" id="bkBrowse">🎓 Browse tutors</button>') +
    "</div>";
  showScreen("screen-tutors");
  body.querySelector("#tutorsBack").addEventListener("click", function () { go(backDest()); });
  const browse = body.querySelector("#bkBrowse");
  if (browse) browse.addEventListener("click", function () { curView = { name: "directory" }; render(); });
  body.querySelectorAll("[data-chat]").forEach(function (b) {
    b.addEventListener("click", function () {
      curView = { name: "chat", bookingId: b.getAttribute("data-chat") }; render();
    });
  });
  body.querySelectorAll("[data-notes]").forEach(function (b) {
    b.addEventListener("click", function () {
      noteSloSel = [];
      curView = { name: "notes", bookingId: b.getAttribute("data-notes") }; render();
    });
  });
  body.querySelectorAll("[data-paid]").forEach(function (b) {
    b.addEventListener("click", function () {
      markPaid(b.getAttribute("data-paid"));
      toast("💵 Marked as paid (local record only).");
      renderBookings();
    });
  });
  body.querySelectorAll("[data-cancel]").forEach(function (b) {
    b.addEventListener("click", function () {
      cancelBooking(b.getAttribute("data-cancel"));
      toast("❌ Booking cancelled.");
      renderBookings();
    });
  });
  body.querySelectorAll("[data-resched-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      reschedFor = b.getAttribute("data-resched-toggle");
      renderBookings();
    });
  });
  body.querySelectorAll("[data-resched]").forEach(function (b) {
    b.addEventListener("click", function () {
      rescheduleBooking(b.getAttribute("data-resched"), b.getAttribute("data-slot"));
      toast("🔁 Booking rescheduled.");
      renderBookings();
    });
  });
}

// ---------- VIEW 5: chat ----------

function renderChat(bookingId) {
  const b = getBooking(bookingId);
  const t = (b && getTutor(b.tutorId)) || {};
  const body = ensureTutorsScreen();
  if (!body || !b) { renderBookings(); return; }
  const msgs = threadFor(b.tutorId) || [];
  body.innerHTML =
    '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Bookings</button>' +
    "<h2>💬 " + esc(t.name || "Tutor") + "</h2>" +
    '<p class="fine">Booking ' + esc(b.id) + " · " + esc(b.slot) + "</p></div>" +
    '<div class="card"><div class="safety-banner">🛡️ ' +
    esc((SAFETY && SAFETY.chat) || "Keep all communication inside LinguaBuddy.") + "</div>" +
    '<div class="chat-log" id="chatLog">' +
    (msgs.length ? msgs.map(function (m) {
      const me = m.from === "me" || m.from === "parent" || m.from === "you";
      return '<div class="bubble ' + (me ? "me" : "them") + '">' + esc(m.text) +
        "<small>" + esc(me ? "You" : (t.name || "Tutor")) + (m.ts ? " · " + esc(fmtWhen(m.ts)) : "") + "</small></div>";
    }).join("") : '<p class="fine">No messages yet — say salaam and confirm your trial slot! 👋</p>') +
    "</div>" +
    '<div class="row-flex"><input id="chatInput" class="tfield" type="text" placeholder="Type a message…" autocomplete="off">' +
    '<button class="btn-primary" id="chatSend">Send</button></div>' +
    '<p class="fine">No phone numbers or addresses — keep everything here.</p></div>';
  showScreen("screen-tutors");
  const log = body.querySelector("#chatLog");
  log.scrollTop = log.scrollHeight;
  body.querySelector("#tutorsBack").addEventListener("click", function () {
    curView = { name: "bookings" }; render();
  });
  const input = body.querySelector("#chatInput");
  const send = function () {
    const text = input.value.trim();
    if (!text) return;
    sendMessage(b.tutorId, text);
    renderChat(bookingId);
  };
  body.querySelector("#chatSend").addEventListener("click", send);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });
  input.focus();
}

// ---------- VIEW 6: review form ----------

function renderReview(tutorId) {
  const t = getTutor(tutorId);
  const body = ensureTutorsScreen();
  if (!body || !t) { renderDirectory(); return; }
  body.innerHTML =
    '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Profile</button>' +
    "<h2>⭐ Review " + esc(t.name) + "</h2></div>" +
    '<div class="card"><div id="starPick">' +
    [1, 2, 3, 4, 5].map(function (v) {
      return '<span class="star-pick' + (v <= reviewStars ? " lit" : "") + '" data-star="' + v + '">★</span>';
    }).join("") + "</div>" +
    '<p class="fine"><span id="starLabel">' + reviewStars + "</span> out of 5</p>" +
    '<label class="fine" for="revText">What went well? What could be better?</label>' +
    '<textarea class="tfield" id="revText" rows="4" placeholder="e.g. Explained sentence patterns clearly, my son enjoyed the trial…"></textarea>' +
    '<div class="booking-actions"><button class="btn-primary" id="revSubmit">Submit review</button></div></div>';
  showScreen("screen-tutors");
  body.querySelector("#tutorsBack").addEventListener("click", function () {
    curView = { name: "detail", tutorId: t.id }; render();
  });
  body.querySelectorAll("[data-star]").forEach(function (s) {
    s.addEventListener("click", function () {
      reviewStars = Number(s.getAttribute("data-star"));
      body.querySelectorAll("[data-star]").forEach(function (x) {
        x.classList.toggle("lit", Number(x.getAttribute("data-star")) <= reviewStars);
      });
      body.querySelector("#starLabel").textContent = reviewStars;
    });
  });
  body.querySelector("#revSubmit").addEventListener("click", function () {
    const text = body.querySelector("#revText").value.trim();
    if (!text) { toast("✍️ Please write a few words about the lesson."); return; }
    addReview(t.id, { stars: reviewStars, text: text });
    toast("⭐ Thanks! Your review was added.");
    curView = { name: "detail", tutorId: t.id }; render();
  });
}

// ---------- VIEW 7: progress notes (per booking) ----------

function renderNotes(bookingId) {
  const b = getBooking(bookingId);
  const t = (b && getTutor(b.tutorId)) || {};
  const body = ensureTutorsScreen();
  if (!body || !b) { renderBookings(); return; }
  const notes = notesForBooking(bookingId) || [];
  const sloIds = tutorSloIds(t) || [];
  body.innerHTML =
    '<div class="screen-head"><button class="back-btn" id="tutorsBack">← Bookings</button>' +
    "<h2>📝 Progress notes</h2>" +
    '<p class="fine">' + esc(t.name || "Tutor") + " · " + esc(b.slot) + "</p></div>" +
    '<div class="card"><p class="fine">🧪 Demo: this simulates the tutor\'s view — in the live product only the tutor writes these.</p>' +
    '<div id="noteList">' +
    (notes.length ? notes.map(function (n) {
      return '<div class="prog-note"><div>' + esc(n.text || "") + "</div>" +
        (n.sloIds && n.sloIds.length ? '<div class="chiprow">' + n.sloIds.map(function (id) {
          return '<span class="chip">' + esc(id) + "</span>";
        }).join("") + "</div>" : "") +
        '<div class="fine">' + esc(fmtWhen(n.ts)) + "</div></div>";
    }).join("") : '<p class="fine">No notes yet.</p>') +
    "</div></div>" +
    '<div class="card"><h3>➕ Add note (tutor-simulated demo)</h3>' +
    '<label class="fine" for="noteText">Note</label>' +
    '<textarea class="tfield" id="noteText" rows="3" placeholder="e.g. Good grasp of past tense; needs work on articles…"></textarea>' +
    (sloIds.length ? '<p class="fine">Related SLOs (tap to select):</p><div class="chiprow" id="noteSlos">' +
      sloIds.map(function (id) {
        const sel = noteSloSel.indexOf(id) >= 0;
        return '<span class="chip' + (sel ? " picked" : "") + '" data-slo="' + esc(id) + '" style="cursor:pointer">' + esc(id) + "</span>";
      }).join("") + "</div>" : "") +
    '<div class="booking-actions"><button class="btn-primary" id="noteAdd">Add note</button></div></div>';
  showScreen("screen-tutors");
  body.querySelector("#tutorsBack").addEventListener("click", function () {
    curView = { name: "bookings" }; render();
  });
  body.querySelectorAll("[data-slo]").forEach(function (c) {
    c.addEventListener("click", function () {
      const id = c.getAttribute("data-slo");
      const i = noteSloSel.indexOf(id);
      if (i >= 0) noteSloSel.splice(i, 1); else noteSloSel.push(id);
      c.classList.toggle("picked");
    });
  });
  body.querySelector("#noteAdd").addEventListener("click", function () {
    const text = body.querySelector("#noteText").value.trim();
    if (!text) { toast("✍️ Write the note first."); return; }
    addProgressNote(bookingId, text, noteSloSel.slice());
    toast("📝 Note added.");
    renderNotes(bookingId);
  });
}

// ---------- VIEW 8: report dialog (modal) ----------

function openReportDialog(t) {
  closeReportDialog();
  const back = document.createElement("div");
  back.className = "tmodal-back";
  back.id = "reportModal";
  back.innerHTML = '<div class="tmodal">' +
    "<h3>🚩 Report " + esc(t.name) + "</h3>" +
    '<p class="fine">Reports are reviewed by our team. False reports may lead to account action.</p>' +
    '<label class="fine" for="repReason">Reason</label>' +
    '<select class="tfield" id="repReason">' +
    "<option>Inappropriate behaviour</option>" +
    "<option>Asked for contact details / CNIC / bank info</option>" +
    "<option>Asked for payment outside agreed terms</option>" +
    "<option>No-show / repeatedly late</option>" +
    "<option>Profile information looks fake</option>" +
    "<option>Other</option>" +
    "</select>" +
    '<label class="fine" for="repDetails">Details</label>' +
    '<textarea class="tfield" id="repDetails" rows="3" placeholder="What happened?"></textarea>' +
    '<div class="booking-actions"><button class="btn-primary" id="repSubmit">Submit report</button>' +
    '<button class="btn-ghost" id="repCancel">Cancel</button></div></div>';
  document.body.appendChild(back);
  back.querySelector("#repCancel").addEventListener("click", closeReportDialog);
  back.addEventListener("click", function (e) { if (e.target === back) closeReportDialog(); });
  back.querySelector("#repSubmit").addEventListener("click", function () {
    const reason = back.querySelector("#repReason").value;
    const details = back.querySelector("#repDetails").value.trim();
    reportTutor(t.id, details ? reason + " — " + details : reason);
    closeReportDialog();
    toast("🚩 Report submitted. Our team will review this tutor.");
  });
}

function closeReportDialog() {
  const m = $("reportModal");
  if (m && m.parentNode) m.parentNode.removeChild(m);
}

// ---------- dispatcher ----------

function render() {
  closeReportDialog();
  const v = curView || { name: "directory" };
  if (v.name === "detail") renderDetail(v.tutorId);
  else if (v.name === "book") renderBook();
  else if (v.name === "bookDone") renderBookDone(v.booking, v.tutorId);
  else if (v.name === "bookings") renderBookings();
  else if (v.name === "chat") renderChat(v.bookingId);
  else if (v.name === "review") renderReview(v.tutorId);
  else if (v.name === "notes") renderNotes(v.bookingId);
  else renderDirectory();
}

// arg may be { tutorId }, { view: "bookings" }, or { via: "parents" }
export function renderTutors(arg) {
  arg = arg || {};
  viaParents = arg.via === "parents";
  if (arg.tutorId) curView = { name: "detail", tutorId: arg.tutorId };
  else if (arg.view === "bookings") curView = { name: "bookings" };
  else curView = { name: "directory" };
  render();
}
