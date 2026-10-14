// LinguaBuddy — P4 reporting tests: SLO trends.
// Plain node, no network, no DOM. Run: node test/report.test.js

import { sloTrend } from "../js/engine.js";

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; }
  else { fail++; console.log("FAIL:", name); }
}
function ev(pcts) {
  return pcts.map(function (p, i) { return { pct: p, n: 5, ts: 1000 + i }; });
}

/* ---- not enough evidence → null (honest: no trend invented) ---- */
ok("null for empty", sloTrend([]) === null);
ok("null for null", sloTrend(null) === null);
ok("null for 1 point", sloTrend(ev([80])) === null);
ok("null for 2 points", sloTrend(ev([40, 90])) === null);

/* ---- clear trends ---- */
ok("up trend", sloTrend(ev([40, 50, 90])) === "up");
ok("down trend", sloTrend(ev([90, 50, 40])) === "down");
ok("up across 4 points", sloTrend(ev([30, 40, 80, 90])) === "up");
ok("down across 5 points", sloTrend(ev([95, 90, 60, 55, 50])) === "down");

/* ---- noise counts as flat ---- */
ok("flat for small swings", sloTrend(ev([70, 72, 71])) === "flat");
ok("flat under 7-point threshold", sloTrend(ev([60, 62, 66])) === "flat");
ok("exactly 7 points of half-avg swing is up", sloTrend(ev([60, 60, 74])) === "up");
ok("exactly -7 points of half-avg swing is down", sloTrend(ev([74, 60, 60])) === "down");

/* ---- only recent evidence matters ---- */
var long = ev([20, 25, 30, 35, 90, 95, 92, 94]);
ok("uses last 6 evidence points", sloTrend(long) === "up");

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
