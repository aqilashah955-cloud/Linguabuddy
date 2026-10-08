// LinguaBuddy — student dashboard (Home) + Progress screen.
// "Welcome back, [Name]!", Continue Learning (weakest SLO), Today's English,
// progress bars, streak, and counts.

import { S, save, touchStreak } from "./store.js";
import { SLOS, STORIES, WORDS, calculateSLOMastery, masteryLabel, weakestSlo, buildItems, buildProgressReport } from "./engine.js";
import { esc, dayOfYear } from "./utils.js";
import { runAttempt, showResult } from "./assess.js";
import { openSetup } from "./learn.js";
import { reportHTML, renderStudentAssignments } from "./teacher.js";
import { todayContent } from "./engage.js";
import { mascotSVG } from "./mascot.js";
import { isConfigured, fb, uploadProfilePhoto, saveUserDoc } from "./firebase.js";

function online() { return isConfigured() && fb().user; }
import { renderSchoolBox } from "./scheme.js";
import { tutorsForWeakSlos } from "./tutors.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGo(fn) { go = fn; }

export const SKILLS = {
  grammar: ["tenses", "past-tense", "sva", "voice", "speech", "articles", "prepositions", "punct", "clauses", "sentence-patterns", "pronouns", "adverbs", "adjectives"],
  vocab: ["synant", "vocab", "syllables", "connotation", "figurative"],
  reading: ["reading", "skimming", "poetry"],
  writing: ["writing", "formal-letters", "descriptive-writing", "paraphrasing"]
};
const SKILL_LABEL = { grammar: "Grammar", vocab: "Vocabulary", reading: "Reading", writing: "Writing" };

export function masteryMap() {
  const m = {};
  SLOS.forEach(function (s) { m[s.id] = calculateSLOMastery(s.id, S.masteryEv[s.id]); });
  return m;
}

function skillAvg(sloIds, m) {
  const vals = sloIds.map(function (id) { return m[id]; }).filter(function (x) { return x && x.count > 0; });
  if (!vals.length) return null;
  return Math.round(vals.reduce(function (s, x) { return s + x.avg; }, 0) / vals.length);
}

function bar(pctOrNull, label) {
  const pct = pctOrNull == null ? 0 : pctOrNull;
  const sub = pctOrNull == null ? "not started" : pct + "%";
  return '<div class="slo-bar"><div class="slo-bar-top"><span>' + esc(label) + "</span><span>" + sub + "</span></div>" +
    '<div class="slo-bar-track"><div class="slo-bar-fill" style="width:' + pct + '%"></div></div></div>';
}

/* ---------------- home dashboard ---------------- */
var GREETINGS = [
  "Ready for today's adventure?",
  "Let's learn something new!",
  "Your English is growing every day!",
  "Small steps, big English!",
  "Time to shine, superstar!"
];
function pickGreeting(name) {
  var n = 0;
  for (var i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return GREETINGS[(n + dayOfYear()) % GREETINGS.length];
}

export function renderDashboard() {
  touchStreak();
  wireProfileModal();
  const name = S.profile.name || "Learner";
  const photo = S.profile.photoURL;
  $("dashHello").innerHTML = (photo
    ? '<img src="' + esc(photo) + '" alt="" style="width:44px;height:44px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:10px;border:2px solid #e8dcc0;" />'
    : "") + "Welcome back, " + esc(name) + "! 👋";
  $("dashStreak").textContent = "🔥 " + (S.profile.streak || 0) + "-day streak";
  // Lingoo the owl greets the learner
  $("lingooHello").innerHTML = mascotSVG("wave") +
    '<div class="lingoo-bubble">' + esc(pickGreeting(name)) + "</div>";

  const m = masteryMap();
  const weak = weakestSlo(m);

  // Continue Learning
  const cl = $("continueCard");
  if (!weak.mastery || weak.mastery.count === 0) {
    cl.innerHTML = '<span class="hc-emoji">🚀</span><span class="hc-title">Start learning: ' + esc(weak.title) + '</span>' +
      '<span class="hc-sub">Your first lesson is ready</span>';
  } else {
    cl.innerHTML = '<span class="hc-emoji">🎯</span><span class="hc-title">Continue: ' + esc(weak.title) + '</span>' +
      '<span class="hc-sub">' + masteryLabel(weak.mastery.status) + " · " + weak.mastery.avg + "% — keep going</span>";
  }
  cl.onclick = function () { if (go) go("lesson", weak.sloId); };

  // Today's English (rotated daily)
  const doy = dayOfYear();
  const tSlo = SLOS[doy % SLOS.length];
  const gSlo = SLOS[(doy * 3 + 1) % SLOS.length];
  const story = STORIES[doy % STORIES.length];
  const words = [0, 1, 2, 3, 4].map(function (k) { return WORDS[(doy * 5 + k) % WORDS.length]; });

  const daily = todayContent();
  const rows = [
    { e: "📅", t: "Daily English", s: 'Word of the day: "' + daily.word.word + '" + phrase & idiom', fn: function () { go("daily"); } },
    { e: "📖", t: "Today's Lesson", s: tSlo.title, fn: function () { go("lesson", tSlo.id); } },
    { e: "🧠", t: "Today's Vocabulary", s: words.map(function (w) { return w.word; }).join(", "), fn: function () { go("vocab"); } },
    { e: "✏️", t: "Today's Grammar", s: gSlo.title + " · quick 5-question practice", fn: function () { quickPractice(gSlo.id, gSlo.title + " — Quick Practice"); } },
    { e: "📚", t: "Today's Reading", s: story.title, fn: function () { go("story", story.id); } },
    { e: "⚡", t: "Today's Challenge", s: "5 mixed questions against the clock", fn: function () { quickChallenge(); } },
    { e: "🎯", t: "Mini Assessment", s: weak.title + " · 5 questions", fn: function () { if (go) go("assess", weak.sloId); } }
  ];
  const box = $("todayBox");
  box.innerHTML = "";
  rows.forEach(function (r) {
    const b = document.createElement("button");
    b.className = "today-row";
    b.innerHTML = '<span class="tr-emoji">' + r.e + '</span><span class="tr-text"><strong>' + esc(r.t) +
      "</strong><br><span class='fine'>" + esc(r.s) + "</span></span><span class='mc-arrow'>→</span>";
    b.addEventListener("click", r.fn);
    box.appendChild(b);
  });

  // Progress bars
  const overall = skillAvg(SLOS.map(function (s) { return s.id; }), m);
  $("dashBars").innerHTML =
    bar(overall, "Overall English") +
    bar(skillAvg(SKILLS.grammar, m), "Grammar") +
    bar(skillAvg(SKILLS.vocab, m), "Vocabulary") +
    bar(skillAvg(SKILLS.reading, m), "Reading") +
    bar(skillAvg(SKILLS.writing, m), "Writing");

  // Counts
  const mastered = SLOS.filter(function (s) { return m[s.id].status === "mastered"; }).length;
  const storiesDone = Object.keys(S.reading || {}).length;
  const assessments = S.attempts.filter(function (a) { return a.mode === "assessment"; }).length;
  $("dashCounts").innerHTML =
    countChip("🎯", mastered + " SLOs mastered") +
    countChip("🧠", S.vocab.length + " words learned") +
    countChip("📚", storiesDone + " stories completed") +
    countChip("📝", assessments + " assessments done");
  function countChip(e, t) {
    return '<span class="count-chip">' + e + " " + esc(t) + "</span>";
  }

  // vocab preview words
  $("todayWords").innerHTML = words.map(function (w) {
    return '<span class="word-chip">' + esc(w.word) + "</span>";
  }).join("");

  // teacher assignments (renders into #assignBox; hidden if none)
  renderStudentAssignments().catch(function () {});
  // school scheme: daily practice + test on taught lessons
  renderSchoolBox();

  // tutor marketplace card (guard: home screen may lack the container)
  var tutorBox = $("tutorBox");
  if (tutorBox) {
    var matches = [];
    try { matches = tutorsForWeakSlos(); } catch (e) {}
    var teaser = matches && matches.length
      ? '<p class="fine">🎯 ' + matches.length + ' tutors match ' + esc(name) + '\u2019s weak areas</p>'
      : "";
    tutorBox.innerHTML = '<div class="card"><h3>🎓 Find a Tutor</h3>' +
      '<p class="fine">AKS-curriculum tutors for Grade 7 &amp; Prep 9</p>' +
      teaser +
      '<button class="btn-secondary btn-big" id="tutorBrowseBtn">Browse tutors →</button></div>';
    $("tutorBrowseBtn").addEventListener("click", function () { if (go) go("tutors"); });
  }

  // Explore: every feature as a big tappable tile — easy one-tap access
  // for students (the bottom nav hides most of these in a tiny scroll).
  renderExploreGrid();
}

/* Big-tile feature grid on the student dashboard. Destinations mirror
   the bottom nav so tiles and nav always agree. */
var EXPLORE_FEATURES = [
  { e: "🏫", t: "Aga Khan Schools", d: "ak" },
  { e: "👩‍🏫", t: "Teachers", d: "teachers" },
  { e: "📚", t: "Learn", d: "learn" },
  { e: "📝", t: "Practice", d: "practice" },
  { e: "🎯", t: "Assess", d: "assess" },
  { e: "🔤", t: "Grammar", d: "grammar" },
  { e: "🧠", t: "Words", d: "vocab" },
  { e: "✍️", t: "Writing", d: "writing" },
  { e: "📖", t: "Read", d: "read" },
  { e: "🎮", t: "Games", d: "games" },
  { e: "🎨", t: "Create", d: "creative" },
  { e: "💭", t: "Buddies", d: "buddies" },
  { e: "🤖", t: "Ask", d: "ask" },
  { e: "💬", t: "Convo", d: "convo" },
  { e: "📸", t: "My Work", d: "mywork" },
  { e: "🧒", t: "Kids", d: "kids" },
  { e: "📅", t: "Daily", d: "daily" },
  { e: "🗣️", t: "Say It", d: "sayit" },
  { e: "🎓", t: "Tests", d: "testprep" },
  { e: "🌍", t: "More Tests", d: "moretests" },
  { e: "🏆", t: "Awards", d: "certs" },
  { e: "🖨️", t: "Print", d: "worksheets" },
  { e: "💼", t: "Career", d: "pro" },
  { e: "📊", t: "Progress", d: "progress" }
];

function renderExploreGrid() {
  var grid = $("exploreGrid");
  if (!grid) return;
  grid.innerHTML = "";
  EXPLORE_FEATURES.forEach(function (f) {
    var b = document.createElement("button");
    b.className = "explore-tile";
    b.innerHTML = '<span class="xt-emoji">' + f.e + '</span><span class="xt-label">' + esc(f.t) + "</span>";
    b.setAttribute("aria-label", f.t);
    b.addEventListener("click", function () { if (go) go(f.d); });
    grid.appendChild(b);
  });
}

function quickPractice(sloId, title) {
  const items = buildItems({ kind: "slo", ref: sloId, count: 5, seed: "daily-" + dayOfYear() + sloId });
  runAttempt({
    title: title, items: items, timePerQ: 0, antiCopy: false, hints: true, lockKey: null,
    onDone: function (out) {
      showResult({
        title: title, scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks",
        results: out.results, perSlo: out.perSlo,
        actions: [
          { label: "Back Home", primary: true, fn: function () { go("home"); } },
          { label: "Full Lesson", fn: function () { go("lesson", sloId); } }
        ]
      });
    }
  });
}

function quickChallenge() {
  const items = buildItems({ kind: "mixed", count: 5, seed: "challenge-" + dayOfYear() + (S.profile.name || "") });
  runAttempt({
    title: "Today's Challenge", items: items, timePerQ: 60, antiCopy: true, hints: false, lockKey: null,
    onDone: function (out) {
      showResult({
        title: "Today's Challenge", scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks · tab switches: " + out.tabs,
        results: out.results, perSlo: out.perSlo,
        actions: [{ label: "Back Home", primary: true, fn: function () { go("home"); } }]
      });
    }
  });
}

/* ---------------- progress screen ---------------- */
export function renderProgress() {
  const m = masteryMap();
  const mine = S.attempts;
  const avg = mine.length ? Math.round(mine.reduce(function (s, a) { return s + a.pct; }, 0) / mine.length) : null;
  $("pgSummary").innerHTML =
    "<strong>" + mine.length + "</strong> attempts · " +
    "<strong>" + (avg == null ? "—" : avg + "%") + "</strong> average · " +
    "🔥 <strong>" + (S.profile.streak || 0) + "</strong>-day streak";

  $("pgMastery").innerHTML = SLOS.map(function (s) {
    const x = m[s.id];
    const pill = x.status === "mastered" ? '<span class="pill ok">Mastered</span>'
      : x.status === "developing" ? '<span class="pill mid">Developing</span>'
      : x.status === "needs" ? '<span class="pill low">Needs Practice</span>'
      : '<span class="pill">Not started</span>';
    return '<div class="mast-row"><div><strong>' + esc(s.title) + "</strong><br>" +
      '<span class="fine">' + (x.count ? x.count + " evidence · " + x.avg + "%" : "no attempts yet") + "</span></div>" + pill + "</div>";
  }).join("");

  $("pgList").innerHTML = mine.length ? mine.slice().reverse().map(function (a) {
    return '<div class="score-row"><div class="score-info"><strong>' + esc(a.title) + "</strong><br>" +
      '<span class="fine">' + fmtDateX(a.date) + " · " + a.score + "/" + a.total + " marks</span></div>" +
      '<div class="score-pct">' + a.pct + "%</div></div>";
  }).join("") : '<p class="empty-msg">No attempts yet. Complete a worksheet to see it here.</p>';

  // full progress report (Part 2) with clickable recommendations
  const report = buildProgressReport({
    mastery: m, attempts: mine, level: S.profile.level,
    xp: S.profile.xp, streak: S.profile.streak,
    vocabCount: S.vocab.length, storiesDone: Object.keys(S.reading || {}).length,
    writingDone: (S.writing || []).length > 0, readingDone: S.reading
  });
  $("pgReport").innerHTML = reportHTML(report, null, true, routeRec);
  $("pgReport").querySelectorAll("[data-rec]").forEach(function (b) {
    b.addEventListener("click", function () { routeRec(report.recommendations[parseInt(b.getAttribute("data-rec"), 10)]); });
  });
  function routeRec(r) {
    if (!r) return;
    if (r.dest === "lesson") go("lesson", r.arg);
    else if (r.dest === "story") go("story", r.arg);
    else if (r.dest === "vocab") go("vocab");
    else if (r.dest === "writing") go("writing");
    else if (r.dest === "assess") openSetup(r.arg, "assess");
  }

  function fmtDateX(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
  }
}

/* ================= edit profile (name + student ID + photo) ================= */

let pendingPhotoBlob = null;

function showProfPhoto(url) {
  const img = document.getElementById("profPhotoPreview");
  const ph = document.getElementById("profPhotoPlaceholder");
  if (url) { img.src = url; img.style.display = "inline-block"; ph.style.display = "none"; }
  else { img.style.display = "none"; ph.style.display = "inline-flex"; }
}

function openProfileModal() {
  const m = document.getElementById("profileModal");
  if (!m) return;
  document.getElementById("profName").value = (S.profile && S.profile.name) || "";
  document.getElementById("profId").value = (S.profile && S.profile.studentId) || "";
  pendingPhotoBlob = null;
  showProfPhoto(S.profile && S.profile.photoURL);
  const note = document.getElementById("profPhotoNote");
  if (note) note.textContent = online() ? "" : "Sign in to upload a photo (offline right now).";
  m.classList.remove("hidden");
}

// Square-crop + shrink a photo to a 256px JPEG blob.
function photoToSquareBlob(file) {
  return new Promise(function (resolve, reject) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      try {
        const side = Math.min(img.naturalWidth || img.width, img.naturalHeight || img.height);
        const sx = ((img.naturalWidth || img.width) - side) / 2;
        const sy = ((img.naturalHeight || img.height) - side) / 2;
        const c = document.createElement("canvas");
        c.width = 256; c.height = 256;
        c.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, 256, 256);
        if (c.toBlob) c.toBlob(function (b) { b ? resolve(b) : reject(new Error("bad image")); }, "image/jpeg", 0.85);
        else reject(new Error("bad image"));
      } catch (e) { reject(e); }
    };
    img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("Could not read that image.")); };
    img.src = url;
  });
}

function closeProfileModal() {
  const m = document.getElementById("profileModal");
  if (m) m.classList.add("hidden");
}

export function wireProfileModal() {
  const openBtn = document.getElementById("editProfileBtn");
  if (openBtn && !openBtn.dataset.wired) {
    openBtn.dataset.wired = "1";
    openBtn.addEventListener("click", openProfileModal);
  }
  const cancel = document.getElementById("profCancel");
  if (cancel && !cancel.dataset.wired) {
    cancel.dataset.wired = "1";
    cancel.addEventListener("click", closeProfileModal);
  }
  const saveBtn = document.getElementById("profSave");
  if (saveBtn && !saveBtn.dataset.wired) {
    saveBtn.dataset.wired = "1";
    saveBtn.addEventListener("click", async function () {
      const n = document.getElementById("profName").value.trim();
      if (!n) { document.getElementById("profName").focus(); return; }
      saveBtn.disabled = true;
      try {
        if (pendingPhotoBlob && online()) {
          const note = document.getElementById("profPhotoNote");
          if (note) note.textContent = "Uploading photo…";
          const url = await uploadProfilePhoto(fb().user.uid, pendingPhotoBlob);
          if (url) {
            S.profile.photoURL = url;
            await saveUserDoc(fb().user.uid, { photoURL: url });
          } else if (note) {
            note.textContent = "Photo upload failed — saved everything else.";
          }
          pendingPhotoBlob = null;
        }
        S.profile.name = n;
        S.profile.studentId = document.getElementById("profId").value.trim();
        save();
        closeProfileModal();
        renderDashboard();
      } finally {
        saveBtn.disabled = false;
      }
    });
  }
  const photoBtn = document.getElementById("profPhotoBtn");
  const photoInput = document.getElementById("profPhotoInput");
  if (photoBtn && photoInput && !photoBtn.dataset.wired) {
    photoBtn.dataset.wired = "1";
    photoBtn.addEventListener("click", function () {
      if (!online()) {
        const note = document.getElementById("profPhotoNote");
        if (note) note.textContent = "Sign in to upload a photo (offline right now).";
        return;
      }
      photoInput.click();
    });
    photoInput.addEventListener("change", async function () {
      const f = photoInput.files && photoInput.files[0];
      photoInput.value = "";
      if (!f) return;
      const note = document.getElementById("profPhotoNote");
      try {
        if (f.size > 20 * 1024 * 1024) { if (note) note.textContent = "That photo is too big — try a smaller one."; return; }
        const blob = await photoToSquareBlob(f);
        pendingPhotoBlob = blob;
        showProfPhoto(URL.createObjectURL(blob));
        if (note) note.textContent = "Nice! Tap Save to keep it.";
      } catch (e) {
        if (note) note.textContent = "Could not read that image — try another.";
      }
    });
  }
  const modal = document.getElementById("profileModal");
  if (modal && !modal.dataset.wired) {
    modal.dataset.wired = "1";
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeProfileModal();
    });
  }
}
