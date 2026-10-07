// LinguaBuddy — node unit tests for Creative Corner data
// (run with: node test/creative.test.js)
import { CREATIVE_ACTIVITIES, DATA_VERSION_CREATIVE, activityOf } from "../data/creative.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}

ok(DATA_VERSION_CREATIVE === "1.0.0", "creative version stamped");
ok(CREATIVE_ACTIVITIES.length === 6, "6 creative activities present");
const ids = new Set();
ok(CREATIVE_ACTIVITIES.every(function (a) {
  if (ids.has(a.id)) return false;
  ids.add(a.id);
  return a.id && a.emoji && a.title && a.desc && a.tip &&
    Array.isArray(a.prompts) && a.prompts.length >= 8;
}), "every activity has id/emoji/title/desc/tip + 8+ prompts");
ok(CREATIVE_ACTIVITIES.every(function (a) {
  return a.prompts.every(function (p) {
    const t = typeof p === "string" ? p :
      (p.text || p.topic || p.idiom || p.theme || p.situation || "");
    return t.length > 2 && !/[\u0600-\u06FF]/.test(t);
  });
}), "all prompts substantive and English-only (no Urdu script)");
ok(activityOf("debate-club").prompts.length === 8, "activityOf resolves debate-club");
ok(activityOf("nope") == null, "activityOf returns nullish for unknown id");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
