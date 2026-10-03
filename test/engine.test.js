// LinguaBuddy — node unit tests (run with: node test/engine.test.js)
import {
  SLOS, sloById, buildItems, gradeItem, calculateSLOMastery,
  generateRemediation, generateReassessment, buildPlacementItems,
  placementLevel, adjustLevel, pickForLevel, weakestSlo, recommendReading
} from "../js/engine.js";
import { SLOS as D_SLOS } from "../data/slos.js";
import { STORIES } from "../data/stories.js";
import { initFirebase, isConfigured, resolveEmail, validLoginId } from "../js/firebase.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }

/* ---------- data integrity ---------- */
section("data integrity");
ok(D_SLOS.length === 12, "12 SLOs present");
ok(D_SLOS.every(s => s.questions.length === 10), "every SLO has exactly 10 questions (120 total)");
ok(STORIES.length === 8, "8 stories present");
ok(STORIES.every(s => s.quiz.length === 5), "every story has 5 quiz questions");

/* ---------- login-ID logic (stubbed, offline) ---------- */
section("login ID logic (offline stubs)");
ok(validLoginId("amina2026") === true, "validLoginId accepts amina2026");
ok(validLoginId("ab") === false, "validLoginId rejects too-short id");
ok(validLoginId("Bad ID!") === false, "validLoginId rejects spaces/punctuation");
ok(validLoginId("ok_id_123") === true, "validLoginId accepts underscores/numbers");
ok(validLoginId("a".repeat(21)) === false, "validLoginId rejects >20 chars");

const fb = await initFirebase();
ok(fb.ready === false, "initFirebase returns ready:false with no window/config");
ok(isConfigured() === false, "isConfigured() false in unconfigured mode");
const direct = await resolveEmail("User@Example.com");
ok(direct === "user@example.com", "resolveEmail returns email input directly (normalized)");
let threw = false;
try { await resolveEmail("justanid"); } catch (e) { threw = /online/.test(e.message); }
ok(threw, "resolveEmail(loginId) offline throws friendly 'online version' error");

/* ---------- mastery engine ---------- */
section("mastery engine");
const one = calculateSLOMastery("tenses", [{ pct: 100 }]);
ok(one.status !== "mastered", "single 100% question is NOT mastered (status=" + one.status + ")");
const two = calculateSLOMastery("tenses", [{ pct: 90 }, { pct: 85 }]);
ok(two.status !== "mastered", "two evidences at ~87% are NOT mastered (needs 3+)");
const three = calculateSLOMastery("tenses", [{ pct: 90 }, { pct: 85 }, { pct: 95 }]);
ok(three.status === "mastered", "3+ evidences at >=80% -> mastered");
const mid = calculateSLOMastery("tenses", [{ pct: 60 }, { pct: 55 }, { pct: 65 }]);
ok(mid.status === "developing", "3 evidences at ~60% -> developing");
const low = calculateSLOMastery("tenses", [{ pct: 30 }, { pct: 20 }]);
ok(low.status === "needs", "low evidence -> needs practice");
const none = calculateSLOMastery("tenses", []);
ok(none.status === "new", "no evidence -> new");

/* ---------- remediation never reuses original questions ---------- */
section("remediation / reassessment");
const orig = buildItems({ kind: "slo", ref: "tenses", count: 10, seed: "orig-seed" });
ok(orig.length === 10, "original worksheet built (10 items)");
const usedKeys = orig.map(i => i.bankKey);
ok(new Set(usedKeys).size === 10, "10 distinct bankKeys in original worksheet");
// fake graded results: miss some
const graded = orig.map((it, i) => ({ item: it, res: { score: i % 2 === 0 ? 1 : 0 } }));
const rem = generateRemediation("tenses", graded, usedKeys);
ok(rem.practiceRefs.length >= 5, "remediation tops up to 5+ fresh refs even when the SLO bank is exhausted (" + rem.practiceRefs.length + ")");
const overlap = rem.practiceRefs.some(r => usedKeys.indexOf(r.sloId + ":" + r.bankIndex) >= 0);
ok(overlap === false, "remediation refs never overlap original bankKeys");
const remItems = buildItems({ kind: "refs", refs: rem.practiceRefs, count: rem.practiceRefs.length, seed: "rem-seed" });
const overlap2 = remItems.some(i => usedKeys.indexOf(i.bankKey) >= 0);
ok(overlap2 === false, "built remediation items never reuse original questions");
ok(rem.missedTypes.length > 0, "remediation targets missed question types: " + rem.missedTypes.join(","));
const reass = generateReassessment("tenses", usedKeys, 8, 2);
ok(reass.length >= 5, "reassessment yields fresh refs even when bank exhausted (" + reass.length + ")");
const overlap3 = reass.some(r => usedKeys.indexOf(r.sloId + ":" + r.bankIndex) >= 0);
ok(overlap3 === false, "reassessment refs exclude everything seen");

/* ---------- anti-copy: seeded variants ---------- */
section("seeded anti-copy variants");
const a1 = buildItems({ kind: "slo", ref: "sva", count: 5, seed: "student-A" });
const a2 = buildItems({ kind: "slo", ref: "sva", count: 5, seed: "student-A" });
ok(JSON.stringify(a1) === JSON.stringify(a2), "same seed -> identical variant (deterministic)");
const b1 = buildItems({ kind: "slo", ref: "sva", count: 5, seed: "student-B" });
ok(JSON.stringify(a1) !== JSON.stringify(b1), "different seed -> different variant (unique per student)");
const excl = new Set([a1[0].bankKey]);
const c1 = buildItems({ kind: "slo", ref: "sva", count: 9, seed: "s", exclude: excl });
ok(!c1.some(i => i.bankKey === a1[0].bankKey), "exclude set is respected");

/* ---------- adaptive difficulty ---------- */
section("adaptive difficulty");
ok(adjustLevel(2, 85) === 3, ">=80% moves level up");
ok(adjustLevel(2, 40) === 1, "<50% moves level down");
ok(adjustLevel(5, 95) === 5, "level capped at 5");
ok(adjustLevel(1, 10) === 1, "level floored at 1");
ok(adjustLevel(3, 65) === 3, "50-79% keeps level");
const picked = pickForLevel(sloById("tenses"), 2, 5, new Set());
ok(picked.length === 5, "pickForLevel returns requested count");

/* ---------- placement ---------- */
section("placement test");
const place = buildPlacementItems("test-seed");
ok(place.length === 15, "placement test has 15 questions");
ok(placementLevel(90) === "Intermediate", "placementLevel(90) = Intermediate");
ok(placementLevel(70) === "Pre-Intermediate", "placementLevel(70) = Pre-Intermediate");
ok(placementLevel(50) === "Elementary", "placementLevel(50) = Elementary");
ok(placementLevel(20) === "Beginner", "placementLevel(20) = Beginner");

/* ---------- grading sanity ---------- */
section("grading sanity");
const mcq = buildItems({ kind: "refs", refs: [{ sloId: "tenses", bankIndex: 0 }], count: 1, seed: "g" })[0];
if (mcq.type === "mcq" || mcq.type === "passage") {
  const r = gradeItem(mcq, mcq.answer);
  ok(r.score === 1, "grading correct option -> 1");
  const r2 = gradeItem(mcq, (mcq.answer + 1) % mcq.options.length);
  ok(r2.score === 0, "grading wrong option -> 0");
} else {
  ok(true, "first tenses question is type " + mcq.type + " (skipped mcq check)");
}

/* ---------- recommendations ---------- */
section("recommendations");
const w = weakestSlo({});
ok(w && SLOS.some(s => s.id === w.sloId), "weakestSlo returns an SLO when no mastery data");
const rec = recommendReading([], "tenses");
ok(rec && rec.id, "recommendReading returns a story");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
