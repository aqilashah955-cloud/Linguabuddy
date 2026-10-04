// LinguaBuddy — school scheme of work: daily practice + daily test.
// Students practice/test exactly the lessons taught at school, on a daily basis.
// Written SLOs use question banks; oral (speaking/listening) lessons use
// guided practice tasks. Pure logic is DOM-free and testable in node.

import { SCHEMES } from "../data/schemes.js";
import { buildItems, adjustLevel } from "./engine.js";import { todayKey, esc } from "./utils.js";
import { S, save, recordAttempt } from "./store.js";
import { runAttempt, summarizeResults } from "./assess.js";
import { xpForAttempt, checkBadges } from "./gamify.js";
import { showScreen } from "./ui.js";

export { SCHEMES }; // re-exported for teacher.js class scheme picker

function $(id) { return document.getElementById(id); }

let go = null;
export function setGo(fn) { go = fn; }

// ---------- pure logic ----------

export function schemeById(id) {
  return SCHEMES.find(function (s) { return s.id === id; }) || null;
}

export function termOf(scheme, n) {
  if (!scheme) return null;
  return scheme.terms.find(function (t) { return n >= t.from && n <= t.to; }) || null;
}

export function lessonNums(scheme) {
  return Object.keys(scheme.lessons).map(Number).sort(function (a, b) { return a - b; });
}

export function clampLesson(scheme, n) {
  const nums = lessonNums(scheme);
  if (!nums.length) return 1;
  n = Math.round(Number(n) || nums[0]);
  return Math.min(nums[nums.length - 1], Math.max(nums[0], n));
}

export function lessonOf(scheme, n) {
  return (scheme.lessons || {})[n] || null;
}

export function lessonSlos(scheme, n) {
  const l = lessonOf(scheme, n);
  return l ? (l.slos || []) : [];
}

export function lessonTasks(scheme, n) {
  const l = lessonOf(scheme, n);
  return l ? (l.tasks || []) : [];
}

// A lesson is "mapped" when it has banks or oral tasks — never invented content.
export function isLessonMapped(scheme, n) {
  return lessonSlos(scheme, n).length > 0 || lessonTasks(scheme, n).length > 0;
}

// profile -> { scheme, lesson, term, entry } or null when not set up
export function schoolState(profile) {
  if (!profile || !profile.schemeId) return null;
  const scheme = schemeById(profile.schemeId);
  if (!scheme) return null;
  const lesson = clampLesson(scheme, profile.schemeLesson || 1);
  return { scheme: scheme, lesson: lesson, term: termOf(scheme, lesson), entry: lessonOf(scheme, lesson) };
}

export function saveSchool(profile, schemeId, lesson) {
  const scheme = schemeById(schemeId);
  profile.schemeId = scheme ? scheme.id : "";
  profile.schemeLesson = scheme ? clampLesson(scheme, lesson) : 0;
}

// Build the daily question set from the current lesson's mapped SLOs.
// Returns [] for oral-only lessons (they use tasks instead).
export function dailyItems(profile, kind, attempts) {
  const st = schoolState(profile);
  if (!st) return [];
  const slos = lessonSlos(st.scheme, st.lesson);
  if (!slos.length) return [];
  const seen = new Set();
  (attempts || []).forEach(function (a) {
    (a.usedKeys || []).forEach(function (k) { seen.add(k); });
  });
  return buildItems({
    kind: "mixed",
    sloIds: slos,
    count: kind === "test" ? 15 : 10,
    exclude: seen,
    seed: todayKey() + "|" + kind + "|" + st.scheme.id + "|L" + st.lesson
  });
}

// All mapped lessons of a scheme, in order (for the in-app scheme browser).
export function mappedLessons(scheme) {
  if (!scheme) return [];
  return lessonNums(scheme)
    .map(function (n) { return lessonOf(scheme, n); })
    .filter(function (l) { return l && ((l.slos || []).length > 0 || (l.tasks || []).length > 0); });
}

// ---------- session launch (DOM) ----------

function finishSchoolAttempt(kind, st, out, lockKey) {
  const att = {
    lockKey: lockKey, student: S.profile.name, kind: "scheme-" + kind,
    ref: st.scheme.id + ":L" + st.lesson,
    title: out.title, mode: kind === "practice" ? "practice" : "assessment",
    score: out.totalScore, total: out.items.length, pct: out.pct,
    perSlo: out.perSlo, tabs: out.tabs, secs: out.secs, usedKeys: out.usedKeys,
    answers: summarizeResults(out.results)
  };
  recordAttempt(att);
  awardXP(xpForAttempt({ mode: att.mode, results: out.results }), kind === "practice" ? "school practice" : "school test");
  checkBadges();
  Object.keys(out.perSlo).forEach(function (id) {
    if (id === "story") return;
    const p = out.perSlo[id];
    const pc = Math.round(p.score / p.total * 100);
    S.sloLevel[id] = adjustLevel(S.sloLevel[id] || 1, pc);
  });
  save();
  showScreen("screen-home", "home");
}

function launchQuestions(kind, st, items) {
  const lockKey = (S.profile.uid || S.profile.name || "s").toLowerCase() +
    "|scheme-" + kind + "|" + st.scheme.id + "|L" + st.lesson + "|" + todayKey();
  const practice = kind === "practice";
  runAttempt({
    title: (practice ? "📝 Daily Practice" : "🎯 Daily Test") + " — " + st.scheme.grade + " · Lesson " + st.lesson,
    items: items,
    timePerQ: practice ? 0 : 60,
    antiCopy: !practice,
    hints: practice,
    lockKey: lockKey,
    lockLabel: practice ? "school practice" : "school test",
    onDone: function (out) { finishSchoolAttempt(kind, st, out, lockKey); }
  });
}

// Oral task screen: checklist of speaking/listening tasks, then either
// continue to written questions or mark the oral practice/test complete.
function showSchoolTasks(kind, st, items) {
  const tasks = lessonTasks(st.scheme, st.lesson);
  const practice = kind === "practice";
  const entry = st.entry || {};
  let html = '<div class="screen-head"><button class="back-btn" id="schTaskBack">← Home</button>' +
    "<h2>" + (practice ? "📝 Daily Practice" : "🎯 Daily Test") + "</h2></div>" +
    '<div class="card"><p class="fine">' + esc(st.scheme.grade) + " · " + esc(st.term ? st.term.name : "") +
    " · <b>Lesson " + st.lesson + ": " + esc(entry.title || "") + "</b></p>" +
    (entry.code ? '<p class="fine">SLO ' + esc(entry.code) + (entry.week ? " · " + esc(entry.week) : "") + "</p>" : "") +
    "<p>" + (practice
      ? "This lesson is speaking & listening — do each task aloud, then tick it off."
      : "This lesson is speaking & listening — perform each task, then tick it off as your test.") + "</p>";
  tasks.forEach(function (t, i) {
    html += '<label class="task-check"><input type="checkbox" data-task="' + i + '" /> <span>' + esc(t) + "</span></label>";
  });
  html += '<div class="row-btns">';
  if (items.length) {
    html += '<button class="btn-primary" id="schTaskGo">' + (practice ? "Continue to written practice →" : "Start written test →") + "</button>";
  } else {
    html += '<button class="btn-primary" id="schTaskDone">' + (practice ? "✅ Mark practice complete" : "✅ Mark test complete") + "</button>";
  }
  html += "</div></div>";
  $("schoolBody").innerHTML = html;
  showScreen("screen-school");
  $("schTaskBack").addEventListener("click", function () { showScreen("screen-home", "home"); });
  if (items.length) {
    $("schTaskGo").addEventListener("click", function () { launchQuestions(kind, st, items); });
  } else {
    $("schTaskDone").addEventListener("click", function () {
      const boxes = $("schoolBody").querySelectorAll("[data-task]");
      let done = 0;
      boxes.forEach(function (b) { if (b.checked) done++; });
      if (!done) { alert("Tick off each task after you do it 🙂"); return; }
      const lockKey = (S.profile.uid || S.profile.name || "s").toLowerCase() +
        "|scheme-task-" + kind + "|" + st.scheme.id + "|L" + st.lesson + "|" + todayKey();
      recordAttempt({
        lockKey: lockKey, student: S.profile.name, kind: "scheme-" + kind,
        ref: st.scheme.id + ":L" + st.lesson,
        title: (practice ? "📝 Daily Practice" : "🎯 Daily Test") + " — " + st.scheme.grade + " · Lesson " + st.lesson,
        mode: practice ? "practice" : "assessment",
        score: done, total: boxes.length, pct: Math.round(done / boxes.length * 100),
        perSlo: {}, tabs: 0, secs: 0, usedKeys: [], answers: []
      });
      awardXP(practice ? 10 : 20, practice ? "oral practice" : "oral test");
      checkBadges();
      save();
      showScreen("screen-home", "home");
    });
  }
}

export function startDaily(kind) {
  const st = schoolState(S.profile);
  if (!st) return;
  if (!isLessonMapped(st.scheme, st.lesson)) {
    alert("📋 Lesson " + st.lesson + "'s SLOs aren't mapped yet — the scheme of work is being added. Check back soon!");
    return;
  }
  const items = dailyItems(S.profile, kind, S.attempts);
  const tasks = lessonTasks(st.scheme, st.lesson);
  if (tasks.length && kind === "practice") { showSchoolTasks(kind, st, items); return; }
  if (items.length) { launchQuestions(kind, st, items); return; }
  if (tasks.length) { showSchoolTasks(kind, st, items); return; }
}

// ---------- dashboard UI (DOM) ----------

function moveLesson(delta) {
  const st = schoolState(S.profile);
  if (!st) return;
  S.profile.schemeLesson = clampLesson(st.scheme, st.lesson + delta);
  save();
  renderSchoolBox();
}

function lessonLabel(st) {
  const e = st.entry || {};
  let s = "<b>Lesson " + st.lesson + "</b>";
  if (e.title && !/^Lesson \d+$/.test(e.title)) s += ": " + esc(e.title);
  return s;
}

export function renderSchoolBox() {
  const box = $("schoolBox");
  if (!box) return;
  const st = schoolState(S.profile);
  if (!st) {
    const opts = SCHEMES.map(function (s) {
      return '<option value="' + esc(s.id) + '">' + esc(s.board + " · " + s.grade + " · " + s.subject) + "</option>";
    }).join("");
    box.innerHTML = '<div class="card school-card"><h3>🏫 School Practice</h3>' +
      '<p class="fine">Practice and test exactly what your school teaches — set your class once, then do your daily set.</p>' +
      '<div class="field"><label>Class / scheme</label><select id="schScheme">' + opts + "</select></div>" +
      '<div class="field"><label>Current lesson number</label>' +
      '<div class="row-flex"><button class="btn-ghost" id="schLessMinus">−</button>' +
      '<input id="schLesson" type="number" min="1" value="1" style="width:90px;text-align:center" />' +
      '<button class="btn-ghost" id="schLessPlus">+</button></div>' +
      '<p class="fine" id="schTermNote"></p></div>' +
      '<button class="btn-primary" id="schSave">Save & Start</button> ' +
      '<button class="btn-secondary" id="schOpenHub">🏫 Aga Khan Schools</button></div>';
    const upd = function () {
      const sch = schemeById($("schScheme").value);
      const n = clampLesson(sch, Number($("schLesson").value));
      const t = termOf(sch, n);
      const e = lessonOf(sch, n) || {};
      $("schTermNote").textContent = t
        ? ("Lesson " + n + (e.title && !/^Lesson \d+$/.test(e.title) ? " — " + e.title : "") + " → " + t.name)
        : "";
    };
    $("schScheme").addEventListener("change", upd);
    $("schLesson").addEventListener("input", upd);
    $("schLessMinus").addEventListener("click", function () { $("schLesson").value = Number($("schLesson").value || 1) - 1; upd(); });
    $("schLessPlus").addEventListener("click", function () { $("schLesson").value = Number($("schLesson").value || 1) + 1; upd(); });
    $("schSave").addEventListener("click", function () {
      saveSchool(S.profile, $("schScheme").value, Number($("schLesson").value));
      save();
      renderSchoolBox();
    });
    upd();
    return;
  }
  const mapped = isLessonMapped(st.scheme, st.lesson);
  const termName = st.term ? st.term.name : "";
  const e = st.entry || {};
  box.innerHTML = '<div class="card school-card"><h3>🏫 School Practice</h3>' +
    '<p class="school-line">' + esc(st.scheme.grade) + " · " + esc(termName) + " · " + lessonLabel(st) + "</p>" +
    (e.code ? '<p class="fine">SLO ' + esc(e.code) + (e.week ? " · " + esc(e.week) : "") + "</p>" : "") +
    (mapped ? "" : '<p class="fine">📋 This lesson\'s SLOs are being added from the scheme of work — check back soon.</p>') +
    '<div class="row-flex"><button class="btn-ghost" id="schPrev">‹</button>' +
    '<button class="btn-primary" id="schPractice"' + (mapped ? "" : " disabled") + ">📝 Daily Practice</button>" +
    '<button class="btn-secondary" id="schTest"' + (mapped ? "" : " disabled") + ">🎯 Daily Test</button>" +
    '<button class="btn-ghost" id="schNext">›</button></div>' +
    '<div class="row-flex"><button class="linklike" id="schChange">⚙️ Change class / lesson</button>' +
    '<button class="linklike" id="schOpenHub">🏫 Open Aga Khan Schools →</button></div></div>';
  $("schPrev").addEventListener("click", function () { moveLesson(-1); });
  $("schNext").addEventListener("click", function () { moveLesson(1); });
  if (mapped) {
    $("schPractice").addEventListener("click", function () { startDaily("practice"); });
    $("schTest").addEventListener("click", function () { startDaily("test"); });
  }
  $("schChange").addEventListener("click", function () {
    S.profile.schemeId = ""; S.profile.schemeLesson = 0; save(); renderSchoolBox();
  });
  const openHub = $("schOpenHub");
  if (openHub) openHub.addEventListener("click", function () { go("ak"); });
}

/* ================= Aga Khan Schools hub ================= */

function hubSetupHTML() {
  const opts = SCHEMES.map(function (s) {
    return '<option value="' + esc(s.id) + '">' + esc(s.board + " · " + s.grade + " · " + s.subject) + "</option>";
  }).join("");
  return '<div class="card"><h3>🎒 Set your class</h3>' +
    '<p class="fine">Choose your school scheme once — then practice and test the exact lessons taught in class, every day.</p>' +
    '<div class="field"><label>Class / scheme</label><select id="akScheme">' + opts + "</select></div>" +
    '<div class="field"><label>Current lesson number</label>' +
    '<div class="row-flex"><button class="btn-ghost" id="akLessMinus">−</button>' +
    '<input id="akLesson" type="number" min="1" value="66" style="width:90px;text-align:center" />' +
    '<button class="btn-ghost" id="akLessPlus">+</button></div>' +
    '<p class="fine" id="akTermNote"></p></div>' +
    '<button class="btn-primary" id="akSave">Save & Start</button></div>';
}

function bindHubSetup() {
  const upd = function () {
    const sch = schemeById($("akScheme").value);
    if (!sch) return;
    const n = clampLesson(sch, Number($("akLesson").value));
    const t = termOf(sch, n);
    const e = lessonOf(sch, n) || {};
    $("akTermNote").textContent = t
      ? ("Lesson " + n + (e.title && !/^Lesson \d+$/.test(e.title) ? " — " + e.title : "") + " → " + t.name)
      : "";
  };
  $("akScheme").addEventListener("change", upd);
  $("akLesson").addEventListener("input", upd);
  $("akLessMinus").addEventListener("click", function () { $("akLesson").value = Number($("akLesson").value || 66) - 1; upd(); });
  $("akLessPlus").addEventListener("click", function () { $("akLesson").value = Number($("akLesson").value || 66) + 1; upd(); });
  $("akSave").addEventListener("click", function () {
    saveSchool(S.profile, $("akScheme").value, Number($("akLesson").value));
    save();
    renderAKHub();
    renderSchoolBox();
  });
  upd();
}

function lessonRowHTML(scheme, l, current) {
  const meta = [l.code, l.week, l.skill].filter(Boolean).map(esc).join(" · ");
  return '<button class="ak-row' + (current === l.n ? " current" : "") + '" data-lesson="' + l.n + '">' +
    '<span class="ak-num">L' + l.n + "</span>" +
    '<span class="ak-main"><strong>' + esc(l.title) + "</strong>" +
    (meta ? '<span class="ak-meta">' + meta + "</span>" : "") + "</span>" +
    (current === l.n ? '<span class="ak-badge">📍</span>' : '<span class="ak-go">→</span>') +
    "</button>";
}

export function renderAKHub() {
  const box = $("akBody");
  if (!box) return;
  let html = '<div class="screen-head"><button class="back-btn" id="akBack">← Home</button>' +
    "<h2>🏫 Aga Khan Schools</h2></div>";
  const st = schoolState(S.profile);
  if (!st) {
    html += hubSetupHTML();
    html += '<div class="card"><h3>📖 What is this?</h3><p class="fine">' +
      "Daily practice and tests matched to the Aga Khan scheme of work — students revise exactly what was " +
      "taught in school that week. Written lessons use question practice; speaking & listening lessons use guided tasks.</p></div>";
    box.innerHTML = html;
    showScreen("screen-ak");
    $("akBack").addEventListener("click", function () { go("home"); });
    bindHubSetup();
    return;
  }
  const mapped = isLessonMapped(st.scheme, st.lesson);
  const e = st.entry || {};
  // today's lesson card
  html += '<div class="card ak-today"><p class="fine">' + esc(st.scheme.board + " · " + st.scheme.grade + " · " + st.scheme.subject) + "</p>" +
    "<h3>📍 Lesson " + st.lesson + (e.title && !/^Lesson \d+$/.test(e.title) ? ": " + esc(e.title) : "") + "</h3>" +
    '<p class="fine">' + esc(st.term ? st.term.name : "") +
    (e.code ? " · SLO " + esc(e.code) : "") + (e.week ? " · " + esc(e.week) : "") + "</p>" +
    (mapped
      ? '<div class="row-flex"><button class="btn-primary" id="akPractice">📝 Daily Practice</button>' +
        '<button class="btn-secondary" id="akTest">🎯 Daily Test</button></div>'
      : '<p class="fine">📋 This lesson\'s SLOs are being added from the scheme of work — check back soon.</p>') +
    '<div class="row-flex"><button class="btn-ghost" id="akPrev">‹ Prev lesson</button>' +
    '<button class="btn-ghost" id="akNext">Next lesson ›</button>' +
    '<button class="linklike" id="akChange">⚙️ Change class</button></div></div>';
  // scheme browser — the scheme of work info, right in the app
  const lessons = mappedLessons(st.scheme);
  html += '<div class="card"><h3>📋 Scheme of work</h3>' +
    (st.scheme.source ? '<p class="fine">' + esc(st.scheme.source) + "</p>" : "") +
    (lessons.length
      ? '<p class="fine">Tap any lesson to jump to it.</p><div class="ak-list">' +
        lessons.map(function (l) { return lessonRowHTML(st.scheme, l, st.lesson); }).join("") + "</div>"
      : '<p class="fine">📋 The scheme of work for this class is being added — lessons will appear here.</p>') +
    "</div>";
  box.innerHTML = html;
  showScreen("screen-ak");
  $("akBack").addEventListener("click", function () { go("home"); });
  if (mapped) {
    $("akPractice").addEventListener("click", function () { startDaily("practice"); });
    $("akTest").addEventListener("click", function () { startDaily("test"); });
  }
  $("akPrev").addEventListener("click", function () {
    S.profile.schemeLesson = clampLesson(st.scheme, st.lesson - 1); save(); renderAKHub(); renderSchoolBox();
  });
  $("akNext").addEventListener("click", function () {
    S.profile.schemeLesson = clampLesson(st.scheme, st.lesson + 1); save(); renderAKHub(); renderSchoolBox();
  });
  $("akChange").addEventListener("click", function () {
    S.profile.schemeId = ""; S.profile.schemeLesson = 0; save(); renderAKHub(); renderSchoolBox();
  });
  box.querySelectorAll("[data-lesson]").forEach(function (b) {
    b.addEventListener("click", function () {
      S.profile.schemeLesson = clampLesson(st.scheme, Number(b.getAttribute("data-lesson")));
      save(); renderAKHub(); renderSchoolBox();
    });
  });
}
