// LinguaBuddy — My Work (photo uploads) unit tests.
// Plain node, no network, no DOM. Run: node test/mywork.test.js

import {
  targetSize, sanitizeOcrText, evictOldest, fitPhotoBudget,
  buildUploadDoc, MW_MAX_ITEMS, MW_PHOTO_MAX, MW_TYPES
} from "../js/mywork.js";
import { analyzeWriting } from "../js/writing.js";

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; }
  else { fail++; console.log("FAIL:", name); }
}
function eq(name, a, b) { ok(name + " (" + JSON.stringify(a) + ")", JSON.stringify(a) === JSON.stringify(b)); }

/* ---- targetSize: compression sizing math ---- */
eq("landscape 4000x3000 -> 1600x1200", targetSize(4000, 3000, 1600), { w: 1600, h: 1200 });
eq("small image unchanged", targetSize(800, 600, 1600), { w: 800, h: 600 });
eq("portrait 1000x2000 -> 800x1600", targetSize(1000, 2000, 1600), { w: 800, h: 1600 });
eq("square 2000x2000 -> 1600x1600", targetSize(2000, 2000, 1600), { w: 1600, h: 1600 });
eq("exact max unchanged", targetSize(1600, 900, 1600), { w: 1600, h: 900 });
eq("default maxSide is MW_PHOTO_MAX", targetSize(3200, 3200), { w: MW_PHOTO_MAX, h: MW_PHOTO_MAX });
eq("zero guarded", targetSize(0, 0, 1600).w >= 1, true);

/* ---- sanitizeOcrText ---- */
eq("trims + collapses spaces", sanitizeOcrText("  hello   world  "), "hello world");
eq("collapses blank lines", sanitizeOcrText("a\n\n\n\nb"), "a\n\nb");
eq("trims each line", sanitizeOcrText("  a  \n  b  "), "a\nb");
eq("strips control chars", sanitizeOcrText("a\x01b"), "ab");
eq("empty in -> empty out", sanitizeOcrText("   \n  "), "");
eq("null-safe", sanitizeOcrText(null), "");

/* ---- buildUploadDoc: Firestore shape, no photo bytes ---- */
var doc = buildUploadDoc({
  uid: "u1", id: "mw1", title: "My story", type: "story",
  photoUrl: "https://storage.example/w.jpg", text: "Once upon a time.",
  feedbackCount: 3, teacherIds: ["t1"], createdAt: 123
});
ok("doc has studentId", doc.studentId === "u1");
ok("doc has title", doc.title === "My story");
ok("doc has type", doc.type === "story");
ok("doc has photoUrl", doc.photoUrl === "https://storage.example/w.jpg");
ok("doc has text", doc.text === "Once upon a time.");
ok("doc has feedbackCount", doc.feedbackCount === 3);
ok("doc has teacherIds", JSON.stringify(doc.teacherIds) === '["t1"]');
ok("doc has createdAt", doc.createdAt === 123);
ok("doc has NO photoDataUrl (no raw bytes)", !("photoDataUrl" in doc));
ok("doc has NO thumbDataUrl", !("thumbDataUrl" in doc));
ok("doc has NO blob", !("blob" in doc));
var longDoc = buildUploadDoc({ uid: "u", title: "x".repeat(200) });
ok("title truncated to 120", longDoc.title.length === 120);

/* ---- evictOldest: oldest-first eviction ---- */
var many = [];
for (var i = 0; i < MW_MAX_ITEMS + 2; i++) many.push({ id: "it" + i, createdAt: 1000 + i });
var kept = evictOldest(many, MW_MAX_ITEMS);
eq("evicts down to cap", kept.length, MW_MAX_ITEMS);
ok("keeps newest", kept.some(function (x) { return x.id === "it" + (MW_MAX_ITEMS + 1); }));
ok("drops oldest", !kept.some(function (x) { return x.id === "it0"; }));
ok("drops second-oldest too", !kept.some(function (x) { return x.id === "it1"; }));

/* ---- fitPhotoBudget: strip full photos from oldest first ---- */
function mkItem(i, photoLen) {
  return {
    id: "p" + i, createdAt: 1000 + i,
    photoDataUrl: photoLen ? "d".repeat(photoLen) : "",
    thumbDataUrl: "thumb" + i, text: "t" + i
  };
}
var items = [mkItem(0, 1000), mkItem(1, 1000), mkItem(2, 1000)];
var fit = fitPhotoBudget(items, 2500);
var byId = {};
fit.items.forEach(function (x) { byId[x.id] = x; });
ok("oldest stripped first", byId.p0.photoDataUrl === "");
ok("thumbnails always kept", byId.p0.thumbDataUrl === "thumb0");
ok("newest keeps photo", byId.p2.photoDataUrl.length === 1000);
ok("stripped count reported", fit.stripped >= 1);
var fit2 = fitPhotoBudget([mkItem(0, 10)], 100000);
ok("under budget: nothing stripped", fit2.stripped === 0 && fit2.items[0].photoDataUrl.length === 10);

/* ---- MW_TYPES sanity ---- */
eq("5 work types", MW_TYPES.length, 5);
ok("type ids unique", new Set(MW_TYPES.map(function (t) { return t.id; })).size === 5);

/* ---- analyzeWriting: feedback never contains a full rewrite ---- */
var sampleText = "i goes to school every day. teh teacher is kind. i has many freinds.";
var res = analyzeWriting(sampleText, { kind: "story", minWords: 10 });
ok("issues found in errorful text", res.issues.length > 0);
res.issues.forEach(function (is, i) {
  ok("issue " + i + " has explain", typeof is.explain === "string" && is.explain.length > 0);
  ok("issue " + i + " has hint", typeof is.hint === "string" && is.hint.length > 0);
  ok("issue " + i + " explain is not the full text", is.explain !== sampleText);
  ok("issue " + i + " hint is not the full text", is.hint !== sampleText);
  ok("issue " + i + " no corrected-text field", !("corrected" in is) && !("rewrite" in is));
});
var keys = new Set();
res.issues.forEach(function (is) { Object.keys(is).forEach(function (k) { keys.add(k); }); });
ok("issue shape is category/found/explain/hint (+optional suggest)",
  JSON.stringify(Array.from(keys).sort()) === JSON.stringify(["category", "explain", "found", "hint", "suggest"]) ||
  JSON.stringify(Array.from(keys).sort()) === JSON.stringify(["category", "explain", "found", "hint"]));

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
