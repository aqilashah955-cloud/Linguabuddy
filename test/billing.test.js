// LinguaBuddy — billing tests (3-day trial + subscriptions). Pure logic only.
import {
  TRIAL_DAYS, PLANS, planById, isStaff, ensureTrial, trialDaysLeft,
  subActive, subDaysLeft, accessState, needsGate, grantSubscription,
  waSubscribeLink, statusLine
} from "../js/billing.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(t) { console.log("\n" + t); }

const DAY = 864e5;
const NOW = 1759500000000;
function student(over) {
  return Object.assign({ role: "student", trialStart: 0, subUntil: 0, subPlan: "" }, over || {});
}

section("trial");
ok(TRIAL_DAYS === 3, "trial is 3 days");
const p1 = student();
ensureTrial(p1, NOW);
ok(p1.trialStart === NOW, "ensureTrial stamps first use");
ensureTrial(p1, NOW + DAY);
ok(p1.trialStart === NOW, "ensureTrial never overwrites");
ok(trialDaysLeft(p1, NOW) === 3, "3 days left at start");
ok(trialDaysLeft(p1, NOW + 2 * DAY) === 1, "1 day left near the end");
ok(trialDaysLeft(p1, NOW + 4 * DAY) === 0, "0 after expiry");
ok(trialDaysLeft(student(), NOW) === 3, "unset trial counts as fresh");

section("access states");
ok(accessState({ role: "teacher" }, NOW) === "staff", "teachers are staff");
ok(accessState({ role: "admin" }, NOW) === "staff", "admins are staff");
ok(accessState(student({ trialStart: NOW }), NOW) === "trial", "fresh student on trial");
ok(accessState(student({ trialStart: NOW - 4 * DAY }), NOW) === "expired", "student expired after 3 days");
ok(accessState(student({ trialStart: NOW - 4 * DAY, subUntil: NOW + 10 * DAY }), NOW) === "subscribed",
  "active subscription beats expired trial");
ok(needsGate(student({ trialStart: NOW - 4 * DAY }), NOW) === true, "expired student is gated");
ok(needsGate(student({ trialStart: NOW }), NOW) === false, "trial student passes");
ok(needsGate({ role: "admin" }, NOW) === false, "admin never gated");

section("subscriptions");
const p2 = student({ trialStart: NOW - 10 * DAY });
const until = grantSubscription(p2, "monthly", NOW);
ok(p2.subPlan === "monthly", "plan recorded");
ok(Math.abs(until - (NOW + 30 * DAY)) < 1000, "monthly = ~30 days from now");
ok(subActive(p2, NOW) === true, "subscription active");
ok(subDaysLeft(p2, NOW) === 30, "30 days left");
const p3 = student({ subUntil: NOW + 20 * DAY, subPlan: "monthly" });
grantSubscription(p3, "yearly", NOW);
ok(Math.abs(p3.subUntil - (NOW + 20 * DAY + 360 * DAY)) < 1000, "activation extends from current expiry");
ok(grantSubscription(student(), "nope", NOW) === 0, "unknown plan rejected");

section("plans & whatsapp");
ok(PLANS.length === 3 && planById("halfyear").price === 2500, "3 editable PKR plans");
const link = waSubscribeLink({ loginId: "ali_123" }, planById("yearly"));
ok(link.indexOf("https://wa.me/923456121725?text=") === 0, "links to the business WhatsApp");
ok(decodeURIComponent(link).indexOf("ali_123") >= 0, "message carries the login ID");
ok(decodeURIComponent(link).indexOf("1 Year") >= 0, "message names the plan");

section("status line");
ok(statusLine({ role: "teacher" }, NOW).indexOf("Staff") === 0, "staff line");
ok(statusLine(student({ trialStart: NOW }), NOW).indexOf("Free trial") >= 0, "trial line");
ok(statusLine(student({ trialStart: NOW - 9 * DAY }), NOW).indexOf("ended") >= 0, "expired line");
ok(statusLine(student({ subUntil: NOW + 5 * DAY, subPlan: "monthly" }), NOW).indexOf("Subscribed") >= 0,
  "subscribed line");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
