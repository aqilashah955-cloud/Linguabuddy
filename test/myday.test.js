// LinguaBuddy — ☀️ My Day unit tests.
// Plain node, no network, no DOM. Run: node test/myday.test.js
// myday.js's imports are all node-safe at load time (no DOM access
// outside functions), so we import the real module and test the pure
// plan logic: greetingFor / buildDayPlan / nextPendingId.

import { greetingFor, buildDayPlan, nextPendingId } from "../js/myday.js";

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; }
  else { fail++; console.log("FAIL:", name); }
}

function snap(over) {
  return Object.assign({
    name: "Amina", hour: 9,
    checkedIn: false, attemptsToday: 0, readToday: false, vocabToday: false, writeToday: false,
    weakest: { sloId: "s1", title: "Tenses" },
    overdue: [], remedial: [], weakSlos: []
  }, over || {});
}

/* ---- greetingFor ---- */
ok("morning greeting", greetingFor(9, "Amina") === "Good morning, Amina! ☀️");
ok("afternoon greeting", greetingFor(14, "Ali") === "Good afternoon, Ali! ☀️");
ok("evening greeting", greetingFor(20, "Zed") === "Good evening, Zed! ☀️");
ok("noon boundary is afternoon", greetingFor(12, "A").indexOf("Good afternoon") === 0);
ok("5pm boundary is evening", greetingFor(17, "A").indexOf("Good evening") === 0);

/* ---- buildDayPlan: 5 honest checklist items ---- */
var p = buildDayPlan(snap());
ok("plan has 5 items", p.items.length === 5);
ok("item ids stable", p.items.map(function (i) { return i.id; }).join(",") === "daily,practice,read,vocab,write");
ok("none done at start", p.doneCount === 0 && !p.allDone);
ok("no catchup when nothing behind", p.catchup.length === 0);
ok("greeting present", p.greeting.indexOf("Good morning, Amina") === 0);

var p2 = buildDayPlan(snap({ checkedIn: true, attemptsToday: 2, readToday: true, vocabToday: true, writeToday: true }));
ok("all done when everything checked", p2.doneCount === 5 && p2.allDone);
ok("practice done via attempts", p2.items[1].done === true);
ok("daily done via check-in", p2.items[0].done === true);

/* ---- practice item targets the weakest SLO ---- */
var p3 = buildDayPlan(snap());
ok("practice targets weakest slo", p3.items[1].arg === "s1" && p3.items[1].dest === "lesson");
ok("practice title names the slo", p3.items[1].title.indexOf("Tenses") >= 0);

/* ---- catch-up: overdue assignments ---- */
var p4 = buildDayPlan(snap({ overdue: [{ id: "a1", title: "Essay", dueLabel: "Oct 10" }] }));
ok("overdue becomes catchup", p4.catchup.length === 1);
ok("overdue keeps assignment action", p4.catchup[0].action.type === "assignment" && p4.catchup[0].action.id === "a1");

/* ---- catch-up: remedial plans dedupe weak SLOs ---- */
var p5 = buildDayPlan(snap({
  remedial: [{ planId: "r1", sloId: "s1", title: "Tenses" }],
  weakSlos: [{ sloId: "s1", title: "Tenses", avg: 45 }, { sloId: "s2", title: "Articles", avg: 50 }]
}));
ok("remedial shown once", p5.catchup.filter(function (c) { return c.id.indexOf("rem:") === 0; }).length === 1);
ok("weak slo covered by remedial is not duplicated",
  !p5.catchup.some(function (c) { return c.id === "weak:s1"; }));
ok("other weak slo still shown", p5.catchup.some(function (c) { return c.id === "weak:s2"; }));
ok("weak sub cites benchmark", p5.catchup.filter(function (c) { return c.id === "weak:s2"; })[0].sub.indexOf("60%") >= 0);

/* ---- nextPendingId ---- */
ok("next pending is first open item", nextPendingId(p) === "daily");
ok("next pending skips done items", nextPendingId(p2) === null);
var p6 = buildDayPlan(snap({ checkedIn: true }));
ok("next pending after daily", nextPendingId(p6) === "practice");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
