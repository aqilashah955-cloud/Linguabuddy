// LinguaBuddy — 📊 Marks: automatic test records for Aga Khan scheme work.
// Every scheme test a student takes is recorded automatically; this module
// aggregates marks daily / weekly / monthly / term-wise so teachers never
// keep manual records, and lets anyone share a mark sheet on WhatsApp.
// Pure logic is DOM-free and testable in node.

import { esc } from "./utils.js";
import { schemeById, termOf, lessonOf } from "./scheme.js";
import { S, save } from "./store.js";
import { showScreen } from "./ui.js";

function $(id) { return document.getElementById(id); }
let go = null;
export function setGo(fn) { go = fn; }

export const PERIODS = [
  { id: "day", label: "Daily" },
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
  { id: "term", label: "Semester" }
];

// ---------- pure logic ----------

// Only real tests count toward marks (practice with hints never does).
export function isSchemeMark(att) {
  return !!att && typeof att.kind === "string" && att.kind.indexOf("scheme-") === 0 &&
    att.mode === "assessment" && typeof att.pct === "number";
}

// ref shapes: "ak-g7-english:L68" | "ak-g7-english:M:September"
export function parseSchemeRef(ref) {
  if (typeof ref !== "string") return null;
  const m = ref.match(/^([^:]+):L(\d+)$/);
  if (m) return { schemeId: m[1], lesson: Number(m[2]) };
  const m2 = ref.match(/^([^:]+):M:(.+)$/);
  if (m2) return { schemeId: m2[1], month: m2[2] };
  return null;
}

function pad2(n) { return (n < 10 ? "0" : "") + n; }

function isoWeek(ts) {
  const d = new Date(ts);
  const day = (d.getDay() + 6) % 7; // Mon=0
  d.setDate(d.getDate() - day + 3); // Thursday of this week
  const first = new Date(d.getFullYear(), 0, 4);
  const fday = (first.getDay() + 6) % 7;
  first.setDate(first.getDate() - fday + 3);
  const week = 1 + Math.round((d - first) / 604800000);
  return { year: d.getFullYear(), week: week };
}

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export function termForRef(ref) {
  const p = parseSchemeRef(ref);
  if (!p) return null;
  const scheme = schemeById(p.schemeId);
  if (!scheme) return null;
  if (p.lesson) {
    const t = termOf(scheme, p.lesson);
    return t ? { scheme: scheme, term: t } : null;
  }
  // monthly test: find the term via the first lesson taught that month
  const nums = Object.keys(scheme.lessons || {}).map(Number).sort(function (a, b) { return a - b; });
  for (let i = 0; i < nums.length; i++) {
    const l = lessonOf(scheme, nums[i]);
    if (l && l.week && l.week.indexOf(p.month) === 0 && ((l.slos || []).length || (l.tasks || []).length)) {
      const t = termOf(scheme, nums[i]);
      if (t) return { scheme: scheme, term: t };
    }
  }
  return null;
}

export function periodKey(ts, period, ref) {
  const d = new Date(ts);
  if (period === "day") return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  if (period === "week") { const w = isoWeek(ts); return w.year + "-W" + pad2(w.week); }
  if (period === "month") return d.getFullYear() + "-" + pad2(d.getMonth() + 1);
  if (period === "term") {
    const t = termForRef(ref);
    return t ? (t.scheme.id + "|" + t.term.name) : "other";
  }
  return "all";
}

export function periodLabel(key, period) {
  if (period === "day") {
    const p = key.split("-");
    return Number(p[2]) + " " + MONTHS[Number(p[1]) - 1];
  }
  if (period === "week") {
    const m = key.match(/(\d+)-W(\d+)/);
    return "Week " + Number(m[2]) + ", " + m[1];
  }
  if (period === "month") {
    const p = key.split("-");
    return MONTHS[Number(p[1]) - 1] + " " + p[0];
  }
  if (period === "term") {
    const p = key.split("|");
    const scheme = schemeById(p[0]);
    return (p[1] || "Other") + (scheme ? " · " + scheme.grade : "");
  }
  return key;
}

function lessonLabelFor(ref) {
  const p = parseSchemeRef(ref);
  if (!p) return "";
  const scheme = schemeById(p.schemeId);
  if (p.lesson) {
    const l = scheme ? lessonOf(scheme, p.lesson) : null;
    const title = l && l.title && !/^Lesson \d+$/.test(l.title) ? ": " + l.title : "";
    return "Lesson " + p.lesson + title;
  }
  if (p.month) return p.month + " Test";
  return "";
}

// attempts -> { name, count, avg, best, groups: [{key,label,count,avg,best,marks[]}] }
export function studentMarks(name, attempts, period) {
  const marks = (attempts || []).filter(isSchemeMark).map(function (a) {
    return {
      ts: a.date, pct: a.pct, score: a.score, total: a.total,
      title: a.title, lesson: lessonLabelFor(a.ref), ref: a.ref,
      key: periodKey(a.date, period, a.ref)
    };
  }).sort(function (a, b) { return b.ts - a.ts; });
  const gmap = {};
  marks.forEach(function (m) {
    (gmap[m.key] = gmap[m.key] || []).push(m);
  });
  const groups = Object.keys(gmap).sort().reverse().map(function (key) {
    const ms = gmap[key];
    const avg = Math.round(ms.reduce(function (s, m) { return s + m.pct; }, 0) / ms.length);
    const best = Math.max.apply(null, ms.map(function (m) { return m.pct; }));
    return { key: key, label: periodLabel(key, period), count: ms.length, avg: avg, best: best, marks: ms };
  });
  const avg = marks.length ? Math.round(marks.reduce(function (s, m) { return s + m.pct; }, 0) / marks.length) : 0;
  const best = marks.length ? Math.max.apply(null, marks.map(function (m) { return m.pct; })) : 0;
  return { name: name, count: marks.length, avg: avg, best: best, groups: groups };
}

// entries: [{name, attempts}] -> [studentMarks...] sorted by name
export function classMarks(entries, period) {
  return (entries || []).map(function (e) {
    return studentMarks(e.name, e.attempts, period);
  }).sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });
}

export function marksWhatsAppText(entry, schemeLabel) {
  const lines = ["📊 *LinguaBuddy Marks* — " + entry.name + (schemeLabel ? " (" + schemeLabel + ")" : "")];
  if (!entry.count) {
    lines.push("No scheme tests taken yet.");
    return lines.join("\n");
  }
  lines.push("Overall: " + entry.avg + "% avg · best " + entry.best + "% · " + entry.count + " tests");
  entry.groups.slice(0, 8).forEach(function (g) {
    lines.push("• " + g.label + ": " + g.avg + "% avg (" + g.count + " test" + (g.count > 1 ? "s" : "") + ", best " + g.best + "%)");
  });
  if (entry.groups.length > 8) lines.push("…and " + (entry.groups.length - 8) + " more periods in the app.");
  lines.push("🦉 Auto-recorded by LinguaBuddy — no manual entry needed.");
  return lines.join("\n");
}

export function waLink(text) {
  return "https://wa.me/?text=" + encodeURIComponent(text);
}

// ---------- UI ----------

let curPeriod = "week";

function periodTabsHTML() {
  return '<div class="row-flex">' + PERIODS.map(function (p) {
    return '<button class="btn-ghost' + (curPeriod === p.id ? " active" : "") + '" data-period="' + p.id + '">' + p.label + "</button>";
  }).join("") + "</div>";
}

function groupsHTML(entry) {
  if (!entry.count) return '<p class="fine">No scheme tests taken yet.</p>';
  return entry.groups.map(function (g) {
    return '<div class="mark-group"><div class="mark-ghead"><strong>' + esc(g.label) + "</strong>" +
      '<span class="fine">' + g.count + " test" + (g.count > 1 ? "s" : "") + " · avg " + g.avg + "% · best " + g.best + "%</span></div>" +
      g.marks.map(function (m) {
        const d = new Date(m.ts);
        return '<div class="mark-row"><span>' + esc(m.lesson || m.title) + "</span>" +
          '<span class="fine">' + d.getDate() + " " + MONTHS[d.getMonth()] + "</span>" +
          '<strong class="' + (m.pct >= 70 ? "good" : m.pct >= 40 ? "mid" : "low") + '">' + m.pct + "%</strong></div>";
      }).join("") + "</div>";
  }).join("");
}

function bindPeriodTabs(rerender) {
  document.querySelectorAll("[data-period]").forEach(function (b) {
    b.addEventListener("click", function () {
      curPeriod = b.getAttribute("data-period");
      rerender();
    });
  });
}

// ---- student / parent: own (or learner's) marks ----
export function openMarksStudent(name, attempts, back) {
  back = back || { dest: "ak" };
  const render = function () {
    const entry = studentMarks(name || S.profile.name || "Learner", attempts || S.attempts, curPeriod);
    $("marksBody").innerHTML =
      '<div class="screen-head"><button class="back-btn" id="marksBack">← Back</button><h2>📊 My Marks</h2></div>' +
      '<div class="card"><p class="fine">Auto-recorded from your scheme tests — daily, weekly, monthly and semester-wise.</p>' +
      periodTabsHTML() +
      '<div class="mark-summary"><div><strong>' + entry.avg + '%</strong><span class="fine">average</span></div>' +
      '<div><strong>' + entry.best + '%</strong><span class="fine">best</span></div>' +
      '<div><strong>' + entry.count + '</strong><span class="fine">tests</span></div></div>' +
      groupsHTML(entry) +
      '<button class="btn-secondary" id="marksShare">📤 Share on WhatsApp</button></div>';
    showScreen("screen-marks");
    $("marksBack").addEventListener("click", function () { go(back.dest, back.arg); });
    bindPeriodTabs(render);
    $("marksShare").addEventListener("click", function () {
      window.open(waLink(marksWhatsAppText(entry, "Aga Khan Schools")), "_blank");
    });
  };
  render();
}

// ---- teacher: whole class mark sheet, auto from submissions ----
export function openMarksClass(cls, subs) {
  const roster = cls.students || [];
  const render = function () {
    const entries = roster.map(function (r) {
      const key = r.uid || r.name;
      const mine = (subs || []).filter(function (s) { return (s.studentId || s.student) === key; });
      return { name: r.name || key, attempts: mine };
    });
    const report = classMarks(entries, curPeriod);
    const tested = report.filter(function (e) { return e.count > 0; }).length;
    $("marksBody").innerHTML =
      '<div class="screen-head"><button class="back-btn" id="marksBack">← Class</button><h2>📊 Marks — ' + esc(cls.name) + "</h2></div>" +
      '<div class="card"><p class="fine">Auto-recorded from students\' scheme tests. <b>No manual entry needed.</b></p>' +
      periodTabsHTML() +
      '<p class="fine">' + tested + " of " + report.length + " students have test marks.</p>" +
      report.map(function (e) {
        return '<div class="mark-student"><div class="mark-ghead"><strong>' + esc(e.name) + "</strong>" +
          '<span class="fine">' + (e.count ? (e.avg + "% avg · " + e.count + " tests") : "no tests yet") + "</span>" +
          (e.count ? '<button class="btn-ghost btn-sm" data-share="' + esc(e.name) + '">📤</button>' : "") + "</div>" +
          (e.count ? '<div class="mark-groups-mini">' + e.groups.slice(0, 3).map(function (g) {
            return '<span class="chip">' + esc(g.label) + ": " + g.avg + "%</span>";
          }).join("") + "</div>" : "") + "</div>";
      }).join("") + "</div>";
    showScreen("screen-marks");
    $("marksBack").addEventListener("click", function () { go("class", cls.id); });
    bindPeriodTabs(render);
    $("marksBody").querySelectorAll("[data-share]").forEach(function (b) {
      b.addEventListener("click", function () {
        const e = report.filter(function (x) { return x.name === b.getAttribute("data-share"); })[0];
        if (e) window.open(waLink(marksWhatsAppText(e, cls.name + " · Aga Khan Schools")), "_blank");
      });
    });
  };
  render();
}
