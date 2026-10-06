// LinguaBuddy — school scheme of work: daily practice + daily test.
// Students practice/test exactly the lessons taught at school, on a daily basis.
// Written SLOs use question banks; oral (speaking/listening) lessons use
// guided practice tasks. Pure logic is DOM-free and testable in node.

import { SCHEMES } from "../data/schemes.js";
import { buildItems, adjustLevel } from "./engine.js";import { todayKey, esc } from "./utils.js";
import { S, save, recordAttempt } from "./store.js";
import { runAttempt, summarizeResults, showResult } from "./assess.js";
import { xpForAttempt, awardXP, checkBadges } from "./gamify.js";
import { showScreen } from "./ui.js";
import { certificate, printHTML } from "./worksheets.js";

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

function appreciationFor(pct) {
  if (pct >= 90) return "🌟 Outstanding! You have truly mastered this lesson.";
  if (pct >= 80) return "🎉 Excellent work! This lesson's SLO is yours.";
  if (pct >= 60) return "👍 Good effort! A little more practice and you'll master it.";
  if (pct >= 40) return "💪 Keep going! Review the corrections below and try again tomorrow.";
  return "🌱 Every expert was once a beginner. Study the corrections below, then try the practice again.";
}

function sloFeedbackHTML(perSlo) {
  const ids = Object.keys(perSlo || {});
  if (!ids.length) return "";
  return '<div style="margin-top:8px;text-align:left;">' + ids.map(function (id) {
    const p = perSlo[id];
    const pc = Math.round(p.score / Math.max(1, p.total) * 100);
    const verdict = pc >= 80 ? "mastered 🌟" : pc >= 60 ? "good — keep practicing 👍" : "needs more practice 💪";
    return "<div>📊 <b>" + esc(p.title) + ":</b> " +
      (Math.round(p.score * 10) / 10) + "/" + p.total + " (" + pc + "%) — " + verdict + "</div>";
  }).join("") + "</div>";
}

function finishSchoolAttempt(kind, st, out, lockKey, refOverride) {
  const att = {
    lockKey: lockKey, student: S.profile.name, kind: "scheme-" + kind,
    ref: refOverride || (st.scheme.id + ":L" + st.lesson),
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
  // Auto-generate remedial plan for SLOs below benchmark (not for remedial attempts themselves)
  let remedialPlan = null;
  if (!refOverride && (kind === "practice" || kind === "test")) {
    remedialPlan = createRemedialPlan(st, out);
  }
  save();
  // Results screen: score, per-question mistakes with guidance + correct
  // answers, SLO-based feedback, appreciation, and a printable certificate.
  const e = st.entry || {};
  const lessonName = "Lesson " + st.lesson + (e.title && !/^Lesson \d+$/.test(e.title) ? ": " + e.title : "");
  const sloNames = Object.keys(out.perSlo).map(function (id) { return out.perSlo[id].title; }).filter(Boolean);
  const actions = [
    { label: "🏫 Aga Khan Schools", primary: true, fn: function () { go("ak"); } },
    { label: "📊 My Marks", primary: false, fn: function () { go("marks"); } }
  ];
  // Remedial plan button (if auto-generated for weak SLOs)
  if (remedialPlan) {
    actions.push({
      label: "🆘 Start Remedial Practice", primary: true,
      fn: function () { startRemedialPlan(remedialPlan.id); }
    });
  }
  if (out.pct >= 60) {
    // Lacking areas: SLOs scoring below 60% — shown on the certificate so the
    // teacher and student know exactly what to work on next.
    const lacking = Object.keys(out.perSlo || {}).map(function (id) {
      const p = out.perSlo[id];
      const pc = p.total ? Math.round(p.score / p.total * 100) : 0;
      return pc < 60 ? { title: p.title || id, pc: pc } : null;
    }).filter(Boolean);
    actions.push({
      label: "🏆 Print Certificate", primary: false,
      fn: function () {
        const ach = "scoring " + out.pct + "% on " + st.scheme.grade + " English " + lessonName +
          (e.code ? " (SLO " + e.code + ")" : "") +
          (sloNames.length ? " — " + sloNames.join(", ") : "");
        printHTML(certificate(S.profile.name, ach, null, {
          studentId: S.profile.studentId,
          lackingAreas: lacking.map(function (l) { return l.title + " (" + l.pc + "%)"; })
        }).html);
      }
    });
  }
  showResult({
    title: out.title,
    scoreLine: out.totalScore + "/" + out.items.length + " (" + out.pct + "%)",
    metaLine: [e.code ? "SLO " + e.code : "", e.week || "", e.skill || ""].filter(Boolean).join(" · "),
    bannerHTML: '<div style="font-size:18px;margin-bottom:4px;">' + appreciationFor(out.pct) + "</div>" + sloFeedbackHTML(out.perSlo),
    perSlo: out.perSlo,
    results: out.results,
    actions: actions
  });
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
    (entry.audio
      ? '<div class="audio-player" style="margin:12px 0;padding:12px;background:#f0f4ff;border-radius:8px;text-align:center;">' +
        '<p style="margin:0 0 8px;font-weight:bold;">🎧 Listen to the audio</p>' +
        '<audio controls preload="metadata" style="width:100%;max-width:400px;" src="' + esc(entry.audio) + '">' +
        'Your browser does not support audio playback.' +
        '</audio></div>'
      : "") +
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

/* ================= automatic remedial plans ================= */
// Benchmark: 60%. Students scoring below on any SLO get an auto-generated
// remedial plan with targeted practice. Low scorers get extra attention.

export const REMEDIAL_BENCHMARK = 60;

export function getRemedialPlans() {
  return (S.remedialPlans || []).slice().sort(function (a, b) { return b.created - a.created; });
}

export function getActiveRemedialPlans() {
  return getRemedialPlans().filter(function (p) { return p.status === "active"; });
}

// Count of lessons where the student is struggling (for "needs attention" flag)
export function strugglingLessonCount() {
  const active = getActiveRemedialPlans();
  const lessons = {};
  active.forEach(function (p) { lessons[p.schemeId + ":L" + p.lesson] = 1; });
  return Object.keys(lessons).length;
}

function createRemedialPlan(st, out) {
  const weak = Object.keys(out.perSlo || {}).map(function (id) {
    const p = out.perSlo[id];
    const pc = p.total ? Math.round(p.score / p.total * 100) : 0;
    return pc < REMEDIAL_BENCHMARK ? { id: id, title: p.title || id, pct: pc } : null;
  }).filter(Boolean);
  if (!weak.length) return null;

  // Don't duplicate an active plan for the same lesson
  const key = st.scheme.id + ":L" + st.lesson;
  const existing = getActiveRemedialPlans().filter(function (p) {
    return p.schemeId === st.scheme.id && p.lesson === st.lesson;
  });
  if (existing.length) {
    // Update the existing plan with fresh scores
    existing[0].slos = weak;
    existing[0].created = Date.now();
    save();
    return existing[0];
  }

  const plan = {
    id: "rem_" + Date.now() + "_" + Math.floor(Math.random() * 1e4),
    schemeId: st.scheme.id,
    schemeGrade: st.scheme.grade,
    lesson: st.lesson,
    lessonTitle: (st.entry || {}).title || ("Lesson " + st.lesson),
    slos: weak,
    created: Date.now(),
    status: "active",
    attempts: 0,
    bestPct: 0
  };
  (S.remedialPlans || (S.remedialPlans = [])).push(plan);
  save();
  return plan;
}

export function startRemedialPlan(planId) {
  const plan = getRemedialPlans().filter(function (p) { return p.id === planId; })[0];
  if (!plan || plan.status !== "active") return;
  const st = schoolState(S.profile);
  // Build fresh questions from the weak SLOs, excluding already-seen
  const seen = new Set();
  (S.attempts || []).forEach(function (a) {
    (a.usedKeys || []).forEach(function (k) { seen.add(k); });
  });
  let items = buildItems({
    kind: "mixed",
    sloIds: plan.slos.map(function (s) { return s.id; }),
    count: 10,
    exclude: seen,
    seed: "remedial|" + plan.id + "|" + Date.now()
  });
  if (!items.length) {
    // All seen — allow repeats rather than dead button
    items = buildItems({
      kind: "mixed",
      sloIds: plan.slos.map(function (s) { return s.id; }),
      count: 10,
      exclude: new Set(),
      seed: "remedial|" + plan.id + "|" + Date.now()
    });
  }
  if (!items.length) { alert("📋 No remedial questions available right now."); return; }

  const lockKey = (S.profile.uid || S.profile.name || "s").toLowerCase() +
    "|remedial|" + plan.id + "|" + todayKey();
  runAttempt({
    title: "🆘 Remedial Practice — " + plan.schemeGrade + " · Lesson " + plan.lesson +
      " (" + plan.slos.map(function (s) { return s.title; }).join(", ") + ")",
    items: items,
    timePerQ: 0,
    antiCopy: false,
    hints: true,
    lockKey: lockKey,
    lockLabel: "remedial practice",
    onDone: function (out) {
      plan.attempts++;
      plan.bestPct = Math.max(plan.bestPct, out.pct);
      // Check if all SLOs now above benchmark
      const stillWeak = Object.keys(out.perSlo || {}).filter(function (id) {
        const p = out.perSlo[id];
        const pc = p.total ? Math.round(p.score / p.total * 100) : 0;
        return pc < REMEDIAL_BENCHMARK;
      });
      if (!stillWeak.length) {
        plan.status = "completed";
        plan.completedAt = Date.now();
      }
      save();
      // Record as a practice attempt too
      finishSchoolAttempt("practice", st || { scheme: { id: plan.schemeId, grade: plan.schemeGrade }, lesson: plan.lesson, entry: { title: plan.lessonTitle } }, out, lockKey);
    }
  });
}

export function startDaily(kind) {
  const st = schoolState(S.profile);
  if (!st) return;
  if (!isLessonMapped(st.scheme, st.lesson)) {
    alert("📋 Lesson " + st.lesson + "'s SLOs aren't mapped yet — the scheme of work is being added. Check back soon!");
    return;
  }
  let items = dailyItems(S.profile, kind, S.attempts);
  const tasks = lessonTasks(st.scheme, st.lesson);
  if (tasks.length && kind === "practice") { showSchoolTasks(kind, st, items); return; }
  if (!items.length && !tasks.length) {
    // Every question was already seen (e.g. test after practice on a small
    // bank) — allow repeats rather than leaving the button dead.
    items = dailyItems(S.profile, kind, []);
  }
  if (items.length) { launchQuestions(kind, st, items); return; }
  if (tasks.length) { showSchoolTasks(kind, st, items); return; }
  alert("📋 No questions are available for this lesson right now. Please try again later.");
}

/* ================= month helpers (grouping lessons by calendar month) ================= */

// "September · Week 3" -> "September"
export function monthOfLesson(scheme, n) {
  const l = lessonOf(scheme, n);
  if (!l || !l.week) return "";
  return l.week.split("·")[0].trim();
}

export function monthLessons(scheme, month) {
  if (!scheme || !month) return [];
  return lessonNums(scheme)
    .map(function (n) { return lessonOf(scheme, n); })
    .filter(function (l) {
      return l && monthOfLesson(scheme, l.n) === month &&
        (((l.slos || []).length > 0) || ((l.tasks || []).length > 0));
    });
}

// Monthly test: 20-question formal test drawn from ALL of the current
// month's mapped lessons (mixed SLOs), once per month per student.
// Mirrors the live deployment so a working-copy push never drops it.
export function monthKey() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1);
}

export function startMonthlyTest() {
  const st = schoolState(S.profile);
  if (!st) return;
  const month = monthOfLesson(st.scheme, st.lesson);
  const lessons = monthLessons(st.scheme, month).filter(function (l) { return (l.slos || []).length > 0; });
  if (lessons.length < 2) {
    alert("📋 The monthly test needs at least 2 written lessons in " + (month || "this month") + ".");
    return;
  }
  const sloIds = [];
  lessons.forEach(function (l) {
    (l.slos || []).forEach(function (id) { if (sloIds.indexOf(id) < 0) sloIds.push(id); });
  });
  const seen = new Set();
  (S.attempts || []).forEach(function (a) {
    (a.usedKeys || []).forEach(function (k) { seen.add(k); });
  });
  const items = buildItems({
    kind: "mixed", sloIds: sloIds, count: 20, exclude: seen,
    seed: monthKey() + "|monthly|" + st.scheme.id + "|" + month
  });
  if (!items.length) return;
  const lockKey = (S.profile.uid || S.profile.name || "s").toLowerCase() +
    "|scheme-test|" + st.scheme.id + "|M:" + month + "|" + monthKey();
  runAttempt({
    title: "📋 Monthly Test — " + month + " · " + st.scheme.grade,
    items: items, timePerQ: 60, antiCopy: true, hints: false,
    lockKey: lockKey, lockLabel: "monthly test",
    onDone: function (out) {
      finishSchoolAttempt("test", st, out, lockKey, st.scheme.id + ":M:" + month);
    }
  });
}

/* ================= printable worksheet ================= */

function wsQuestionHTML(i, it) {
  let body = "";
  if (it.type === "mcq") {
    body = '<div style="margin-top:6px;">' + (it.options || []).map(function (o, j) {
      return '<div style="margin:3px 0;">○ <b>' + "ABCD"[j] + ".</b> " + esc(o) + "</div>";
    }).join("") + "</div>";
  } else if (it.type === "fib") {
    body = '<div style="border-bottom:1px solid #999;height:30px;margin-top:6px;"></div>';
  } else if (it.type === "tf") {
    body = '<div style="margin-top:6px;">○ True&emsp;&emsp;○ False</div>';
  } else if (it.type === "reorder") {
    body = '<div style="margin-top:6px;">' + (it.words || []).map(function (w) {
      return '<span style="border:1px solid #999;padding:2px 8px;margin:2px;display:inline-block;">' + esc(w) + "</span>";
    }).join("") + '</div><div style="border-bottom:1px solid #999;height:30px;margin-top:8px;"></div>';
  }
  return '<div style="margin-bottom:16px;"><b>' + (i + 1) + ".</b> " + esc(it.q) + body + "</div>";
}

export function akWorksheetHTML(scheme, n) {
  const l = lessonOf(scheme, n) || {};
  const title = l.title && !/^Lesson \d+$/.test(l.title) ? l.title : "Lesson " + n;
  let html = '<div style="font-family:Georgia,\'Times New Roman\',serif;color:#111;max-width:720px;">' +
    '<h1 style="font-size:24px;margin:0 0 4px;">🏫 ' + esc(scheme.board + " · " + scheme.grade + " English") + "</h1>" +
    '<h2 style="font-size:18px;margin:0 0 4px;">Lesson ' + n + ": " + esc(title) + "</h2>" +
    '<p style="color:#444;margin:0 0 12px;font-size:14px;">' +
    esc([l.code ? "SLO " + l.code : "", l.week || "", l.skill || ""].filter(Boolean).join(" · ")) + "</p>" +
    '<p style="margin:0 0 16px;font-size:14px;">Name: ________________________&nbsp;&nbsp;ID: ______________&nbsp;&nbsp;Date: ____________&nbsp;&nbsp;Score: ______ / 10</p>';
  const slos = (l.slos || []);
  if (slos.length) {
    const seen = new Set();
    (S.attempts || []).forEach(function (a) {
      (a.usedKeys || []).forEach(function (k) { seen.add(k); });
    });
    const items = buildItems({
      kind: "mixed", sloIds: slos, count: 10, exclude: seen,
      seed: todayKey() + "|worksheet|" + scheme.id + "|L" + n
    });
    html += items.map(function (it, i) { return wsQuestionHTML(i, it); }).join("");
    var writingFamily = ["writing", "formal-letters", "descriptive-writing", "paraphrasing"];
    if (slos.some(function (id) { return writingFamily.indexOf(id) >= 0; })) {
      html += '<h3 style="font-size:16px;">✍️ Writing space</h3>';
      for (let i = 0; i < 8; i++) html += '<div style="border-bottom:2px dotted #999;height:34px;"></div>';
    }
  }
  (l.tasks || []).forEach(function (t) {
    html += '<div style="margin-bottom:12px;">☐ ' + esc(t) + "</div>";
  });
  html += '<p style="margin-top:24px;color:#555;font-size:12px;">🦉 Check your answers in the LinguaBuddy app — no answer key is printed. Practice makes progress!</p></div>';
  return html;
}

export function printAKWorksheet() {
  const st = schoolState(S.profile);
  if (!st || !isLessonMapped(st.scheme, st.lesson)) return;
  printHTML(akWorksheetHTML(st.scheme, st.lesson));
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
    box.innerHTML = '<div class="card school-card"><h3>🏫 Aga Khan Schools</h3>' +
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
  box.innerHTML = '<div class="card school-card"><h3>🏫 Aga Khan Schools</h3>' +
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
  const month = monthOfLesson(st.scheme, st.lesson);
  const monthlyReady = monthLessons(st.scheme, month).filter(function (l) { return (l.slos || []).length > 0; }).length >= 2;
  // today's lesson card
  html += '<div class="card ak-today"><p class="fine">' + esc(st.scheme.board + " · " + st.scheme.grade + " · " + st.scheme.subject) + "</p>" +
    "<h3>📍 Lesson " + st.lesson + (e.title && !/^Lesson \d+$/.test(e.title) ? ": " + esc(e.title) : "") + "</h3>" +
    '<p class="fine">' + esc(st.term ? st.term.name : "") +
    (e.code ? " · SLO " + esc(e.code) : "") + (e.week ? " · " + esc(e.week) : "") + "</p>" +
    (mapped
      ? '<p class="fine">✅ This lesson\'s test & worksheet cover its specific SLO only.</p>' +
        '<div class="row-flex"><button class="btn-primary" id="akPractice">📝 Daily Practice</button>' +
        '<button class="btn-secondary" id="akTest">🎯 Daily Test</button></div>' +
        '<div class="row-flex">' +
        '<button class="btn-ghost" id="akWorksheet">🖨️ Worksheet</button>' +
        '<button class="btn-ghost" id="akMarks">📊 My Marks</button>' +
        '<button class="btn-ghost" id="akTutors">🎓 Find a Tutor</button></div>' +
        (monthlyReady ? '<div class="row-flex"><button class="btn-ghost" id="akMonthly">📋 Monthly Test — ' + esc(month) + '</button></div>' : "")
      : '<p class="fine">📋 This lesson\'s SLOs are being added from the scheme of work — check back soon.</p>') +
    '<div class="row-flex"><button class="btn-ghost" id="akPrev">‹ Prev lesson</button>' +
    '<button class="btn-ghost" id="akNext">Next lesson ›</button>' +
    '<button class="linklike" id="akChange">⚙️ Change class</button></div></div>';
  // remedial plans — auto-generated for SLOs below benchmark
  const activePlans = getActiveRemedialPlans();
  const struggleCount = strugglingLessonCount();
  if (activePlans.length) {
    html += '<div class="card" style="border:2px solid #e0a800;background:#fffdf5;"><h3>🆘 Remedial Practice' +
      (struggleCount >= 3 ? ' <span style="background:#d32f2f;color:#fff;padding:2px 8px;border-radius:10px;font-size:12px;">⚠️ Needs attention</span>' : "") +
      '</h3><p class="fine">Targeted practice for SLOs below ' + REMEDIAL_BENCHMARK + '% — fresh questions, hints on.</p>' +
      activePlans.map(function (p) {
        return '<div style="margin:8px 0;padding:10px;background:#fff;border:1px solid #e0c36a;border-radius:8px;">' +
          '<strong>' + esc(p.schemeGrade) + ' · Lesson ' + p.lesson + ": " + esc(p.lessonTitle) + "</strong><br>" +
          '<span class="fine">' + p.slos.map(function (s) { return esc(s.title) + " (" + s.pct + "%)"; }).join(", ") + "</span><br>" +
          '<span class="fine">Attempts: ' + p.attempts + (p.bestPct ? " · Best: " + p.bestPct + "%" : "") + "</span> " +
          '<button class="btn-primary btn-sm" data-remedial="' + p.id + '" style="margin-top:6px;">Start remedial →</button></div>';
      }).join("") + "</div>";
  }
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
    if (monthlyReady) $("akMonthly").addEventListener("click", startMonthlyTest);
    $("akWorksheet").addEventListener("click", printAKWorksheet);
    $("akMarks").addEventListener("click", function () { go("marks"); });
    if ($("akTutors")) $("akTutors").addEventListener("click", function () { go("tutors"); });
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
  box.querySelectorAll("[data-remedial]").forEach(function (b) {
    b.addEventListener("click", function () {
      startRemedialPlan(b.getAttribute("data-remedial"));
    });
  });
}
