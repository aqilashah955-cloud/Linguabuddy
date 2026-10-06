// LinguaBuddy — 🏆 Certificate Center (students, teachers AND parents).
// Auto-awarded printable certificates. Reuses the worksheets.js
// certificate() builder + printHTML() so print styling stays consistent.
// DOM is touched only inside functions, so this module imports cleanly
// in node tests.

import { S, save } from "./store.js";
import { SLOS } from "../data/slos.js";
import { calculateSLOMastery } from "./engine.js";
import { certificate, printHTML } from "./worksheets.js";
import { showScreen as show } from "./ui.js";
import { esc } from "./utils.js";

function $(id) { return (typeof document !== "undefined") ? document.getElementById(id) : null; }

let go = null;
export function setCertsGo(fn) { go = fn; }

/* ================= certificate catalogue ================= */

export const CERT_TYPES = [
  // ---- students ----
  { id: "brave-beginner", for: "student", emoji: "🦁", title: "Brave Beginner",
    achievement: "taking the first step and completing the first English lesson",
    hint: "Complete your first lesson to earn this." },
  { id: "star-7", for: "student", emoji: "⭐", title: "7-Day Star",
    achievement: "practicing English 7 days in a row",
    hint: "Keep your learning streak alive for 7 days." },
  { id: "reading-champ", for: "student", emoji: "📚", title: "Reading Champion",
    achievement: "reading 5 stories and finishing their quizzes",
    hint: "Finish 5 stories with their quizzes." },
  { id: "word-wizard", for: "student", emoji: "🧙", title: "Word Wizard",
    achievement: "collecting 100 words in the vocabulary builder",
    hint: "Save 100 words to your vocabulary." },
  { id: "writing-star", for: "student", emoji: "✍️", title: "Writing Star",
    achievement: "getting feedback on a piece of writing",
    hint: "Get feedback on a story, essay or application in the Writing Lab or 📸 My Work." },
  { id: "slo-master", for: "student", emoji: "🎯", title: "SLO Master",
    achievement: "mastering an English skill with 80% or more across 3 or more assessments",
    hint: "Master any SLO (80%+ across 3+ assessments)." },
  { id: "game-champ", for: "student", emoji: "🎮", title: "Game Champion",
    achievement: "playing 3 game rounds in the Game Arcade",
    hint: "Play 3 rounds in the 🎮 Game Arcade." },
  { id: "course-complete", for: "student", emoji: "🎓", title: "Course Completion",
    achievement: "mastering all 25 English skills of the LinguaBuddy course",
    hint: "Master all 25 SLOs to complete the whole course." },
  // ---- teachers ----
  { id: "educator", for: "teacher", emoji: "🍎", title: "Dedicated Educator",
    achievement: "guiding a class of 3 or more learners on LinguaBuddy",
    hint: "Create a class and add at least 3 students." },
  // ---- parents ----
  { id: "super-supporter", for: "parent", emoji: "💛", title: "Super Supporter",
    achievement: "supporting a young learner's English journey — awarded with love",
    hint: "Claim it from the 👨‍👩‍👧 Parents screen." }
];

export function certById(id) {
  return CERT_TYPES.find(function (c) { return c.id === id; });
}

/* ================= awarding (pure core) ================= */

// Pure: which cert ids does this state earn?
// state = {badges:[], masteryEv:{}, teacherClasses:[], parentClaimed:bool}
export function earnedCertIds(state) {
  state = state || {};
  const badges = state.badges || [];
  function has(b) { return badges.indexOf(b) >= 0; }
  const out = [];
  if (has("first-lesson")) out.push("brave-beginner");
  if (has("streak-7")) out.push("star-7");
  if (has("reader-5")) out.push("reading-champ");
  if (has("words-100")) out.push("word-wizard");
  if (has("writing-star")) out.push("writing-star");
  if (has("slo-master")) out.push("slo-master");
  if (has("game-night")) out.push("game-champ");
  const ev = state.masteryEv || {};
  const allMastered = SLOS.every(function (s) {
    return calculateSLOMastery(s.id, ev[s.id]).status === "mastered";
  });
  if (allMastered) out.push("course-complete");
  const classes = state.teacherClasses || [];
  if (classes.some(function (c) { return (c.students || []).length >= 3; })) out.push("educator");
  if (state.parentClaimed) out.push("super-supporter");
  return out;
}

function certs() { return S.certs || (S.certs = []); }

function readState() {
  return {
    badges: (S.profile && S.profile.badges) || [],
    masteryEv: S.masteryEv || {},
    teacherClasses: (S.teacher && S.teacher.classes) || [],
    parentClaimed: !!S.parentCertClaimed
  };
}

// Idempotent: awards newly-earned certs into S.certs, never duplicates.
// Returns the list of newly awarded records (so the caller can toast).
export function checkCertificates() {
  const have = {};
  certs().forEach(function (c) { have[c.id] = true; });
  const fresh = [];
  earnedCertIds(readState()).forEach(function (id) {
    if (!have[id]) {
      const def = certById(id);
      const rec = {
        id: id,
        title: def.title,
        awardedAt: new Date().toISOString(),
        name: (S.profile && S.profile.name) || ""
      };
      certs().push(rec);
      have[id] = true;
      fresh.push(rec);
    }
  });
  if (fresh.length) save();
  return fresh;
}

// Parent certificate is honor-based: claimed from the Parents screen.
export function claimParentCert() {
  if (!S.parentCertClaimed) {
    S.parentCertClaimed = true;
    save();
  }
  return checkCertificates();
}

// Certs of the given role not yet earned (for the "Still to earn" section).
export function lockedCerts(role) {
  const have = {};
  certs().forEach(function (c) { have[c.id] = true; });
  return CERT_TYPES.filter(function (c) {
    if (have[c.id]) return false;
    if (role === "teacher") return c.for === "teacher";
    return c.for === "student"; // parents claim theirs via the Parents flow
  });
}

/* ================= printing ================= */

function prettyDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-PK",
      { day: "numeric", month: "long", year: "numeric" });
  } catch (e) { return ""; }
}

// Printable HTML for one earned certificate (via the worksheets builder).
export function certPrintHTML(rec) {
  const def = certById(rec.id) || {};
  const name = rec.name || (S.profile && S.profile.name) || "";
  const studentId = (S.profile && S.profile.studentId) || "";
  return certificate(name, def.achievement || rec.title, prettyDate(rec.awardedAt), { studentId: studentId }).html;
}

/* ================= gallery UI ================= */

export function showCerts() {
  show("screen-certs", "certs");
  renderCerts();
}

export function renderCerts() {
  const host = $("certGallery");
  if (!host) return; // section not wired yet / node
  const role = (S.profile && S.profile.role) || "student";
  const earned = certs().slice().reverse(); // newest first
  const locked = lockedCerts(role);
  const parentHas = certs().some(function (c) { return c.id === "super-supporter"; });

  let html = '<div class="certs-wrap">';
  html += '<h2 class="certs-h">🏆 My Certificates</h2>';
  if (!earned.length) {
    html += '<div class="certs-empty"><div class="cert-emoji">🦉</div>' +
      '<p>No certificates yet — keep learning! Every lesson brings you closer to your first award.</p></div>';
  } else {
    html += '<div class="certs-grid">';
    earned.forEach(function (c) {
      const def = certById(c.id) || {};
      html += '<div class="cert-card"><div class="cert-emoji">' + (def.emoji || "🏆") + '</div>' +
        '<div class="cert-title">' + esc(c.title) + '</div>' +
        '<div class="cert-date">' + esc(prettyDate(c.awardedAt)) + '</div>' +
        '<button class="btn-print" data-printcert="' + esc(c.id) + '">🖨️ Print</button></div>';
    });
    html += '</div>';
  }
  html += '<h2 class="certs-h">🔒 Still to earn</h2>';
  if (!locked.length) {
    html += '<div class="certs-empty"><p>🎉 You earned them all — amazing!</p></div>';
  } else {
    html += '<div class="certs-grid">';
    locked.forEach(function (c) {
      html += '<div class="cert-card locked"><div class="cert-emoji">' + c.emoji + '</div>' +
        '<div class="cert-title">' + esc(c.title) + '</div>' +
        '<div class="cert-hint">🔒 ' + esc(c.hint) + '</div></div>';
    });
    html += '</div>';
  }
  // Parents often share the learner's device — let them claim here too.
  html += '<div class="certs-parent"><div class="cert-emoji">👨‍👩‍👧</div><div class="certs-parent-t">' +
    '<strong>For Parents</strong><p>Supporting a young learner? Claim the Super Supporter ' +
    'certificate — awarded with love.</p></div>' +
    (parentHas ? '<span class="cert-claimed">💛 Claimed</span>'
      : '<button class="btn-print" id="certClaimParent">🎁 Claim certificate</button>') +
    '</div>';
  html += '</div>';
  host.innerHTML = html;

  host.querySelectorAll("[data-printcert]").forEach(function (b) {
    b.addEventListener("click", function () {
      const rec = certs().find(function (c) { return c.id === b.getAttribute("data-printcert"); });
      if (rec) printHTML(certPrintHTML(rec));
    });
  });
  const claim = $("certClaimParent");
  if (claim) claim.addEventListener("click", function () {
    claimParentCert();
    renderCerts();
  });
}
