// LinguaBuddy — Worksheets & Resources unit tests (run with: node test/worksheets.test.js)
// Covers: seeded word-search (placement, determinism), every worksheet builder's
// shape ({title, ageGroup, html, answerKey}), the teacher pack builder (counts),
// certificates, the curated library defs, and the offline guarantee (no fetches).

import {
  AGE_GROUPS, WS_TYPES, typeOf, emojiOf,
  traceLetters, matchWords, fillBlanks, makeWordSearch, wordSearch,
  sentenceScramble, readingComprehension, coloringVocab,
  blankItems, reorderItems, makeWorksheet, buildPack, certificate,
  WORKSHEET_DEFS, defById, writeLines
} from "../js/worksheets.js";
import { WORDS } from "../data/words.js";
import { STORIES } from "../data/stories.js";
import { readFileSync } from "fs";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }
function count(str, sub) { return str.split(sub).length - 1; }

/* ---------- 8-direction grid finder (for the word-search test) ---------- */
function findInGrid(grid, word) {
  const n = grid.length;
  const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      for (let d = 0; d < dirs.length; d++) {
        const dr = dirs[d][0], dc = dirs[d][1];
        let good = true;
        for (let i = 0; i < word.length; i++) {
          const rr = r + dr * i, cc = c + dc * i;
          if (rr < 0 || cc < 0 || rr >= n || cc >= n || grid[rr][cc] !== word[i]) { good = false; break; }
        }
        if (good) return true;
      }
    }
  }
  return false;
}

/* ---------- word search ---------- */
section("word search (seeded)");
{
  const words = ["brave", "honest", "clever", "victory", "patient", "grateful"];
  const a = makeWordSearch(words, 42, 12);
  const b = makeWordSearch(words, 42, 12);
  ok(a.placements.length === words.length, "all " + words.length + " words placed");
  const upper = words.map(function (w) { return w.toUpperCase(); });
  ok(upper.every(function (w) { return findInGrid(a.grid, w); }), "every word findable scanning all 8 directions");
  ok(JSON.stringify(a.grid) === JSON.stringify(b.grid), "same seed → identical grid (deterministic)");
  const c = makeWordSearch(words, 43, 12);
  ok(JSON.stringify(a.grid) !== JSON.stringify(c.grid), "different seeds → different grids");
  ok(a.grid.length === 12 && a.grid[0].length === 12, "grid is 12×12");
  ok(a.grid.every(function (row) { return row.every(function (ch) { return /^[A-Z]$/.test(ch); }); }),
    "every cell filled with A–Z");
  ok(a.answerKey.indexOf("BRAVE") >= 0, "answer key names placed words");
  // small grid + long word is filtered out gracefully
  const tiny = makeWordSearch(["supercalifragilistic"], 1, 8);
  ok(tiny.placements.length === 0, "word longer than grid is skipped, not crashed");
}

/* ---------- builder shape ---------- */
section("builder shape {title, ageGroup, html, answerKey}");
{
  const built = [
    traceLetters(["A", "b", "C"]),
    matchWords([{ word: "brave", emoji: "🦁" }, { word: "honest", emoji: "🤝" }], { seed: 3 }),
    fillBlanks(["articles"], 5, { seed: 4 }),
    wordSearch(["brave", "honest"], { seed: 5 }),
    sentenceScramble(undefined, { seed: 6 }),
    readingComprehension(STORIES[0]),
    coloringVocab([{ word: "brave", emoji: "🦁" }], { seed: 7 })
  ];
  built.forEach(function (ws, i) {
    ok(!!(ws && ws.title && ws.html && ws.ageGroup), "builder " + i + " returns title/html/ageGroup");
    ok(ws.html.length > 200, "builder " + i + " html is substantial (" + ws.html.length + " chars)");
    ok(AGE_GROUPS.indexOf(ws.ageGroup) >= 0, "builder " + i + " ageGroup is valid: " + ws.ageGroup);
    ok(typeof ws.answerKey === "string", "builder " + i + " has an answerKey string");
  });
  ok(built[0].html.indexOf("trace me") >= 0, "tracing sheet has trace guides");
  ok(built[1].answerKey.indexOf("1–") >= 0, "match sheet answer key maps numbers to letters");
  ok(built[2].html.indexOf("Word Bank") >= 0, "fill-blanks sheet has a word bank");
  ok(built[4].html.indexOf("✂️") >= 0, "scramble sheet has cut-apart strips");
  ok(built[5].html.indexOf(STORIES[0].title) >= 0, "reading sheet uses the story title");
  ok(built[6].html.indexOf("🎨") >= 0, "coloring sheet has coloring prompt");
}

/* ---------- bank helpers ---------- */
section("bank helpers");
{
  ok(blankItems(["articles"], 20).length > 0, "blankItems finds ___ items in articles bank");
  ok(blankItems(["nope"], 5).length === 0, "blankItems ignores unknown SLO ids");
  ok(reorderItems(["tenses", "sva"], 20).length > 0, "reorderItems finds reorder items");
  ok(emojiOf("brave") === "🦁", "emojiOf maps known words");
  ok(emojiOf("zzzunknown") === "⭐", "emojiOf falls back to a star");
  ok(writeLines(3).split("dotted").length === 4, "writeLines(3) renders three dotted lines");
}

/* ---------- dispatcher ---------- */
section("makeWorksheet dispatcher");
{
  const seen = {};
  WS_TYPES.forEach(function (t) {
    const ws = makeWorksheet(t.id, { ageGroup: "🧑 Juniors", seed: 9 });
    seen[t.id] = true;
    ok(ws && ws.html && ws.html.length > 100, "dispatcher builds " + t.id);
  });
  ok(Object.keys(seen).length === WS_TYPES.length, "every registered type is buildable");
  const jr = makeWorksheet("fill", { ageGroup: "🧒 Kids", seed: 9 });
  ok(jr.html.indexOf("Word Bank") >= 0, "kids fill-blanks stays simple (articles only)");
}

/* ---------- teacher pack builder ---------- */
section("buildPack");
{
  const pack = buildPack({ ageGroup: "🧑 Juniors", types: ["fill"], items: { fill: 5 }, seed: 3 });
  ok(pack.title.indexOf("Pack") >= 0, "pack has a title");
  ok(pack.ageGroup === "🧑 Juniors", "pack keeps the age group");
  ok(count(pack.html, 'class="ws-item"') === 5, "pack respects per-type item counts (5 blanks)");
  const multi = buildPack({ ageGroup: "🧒 Kids", types: ["trace", "match", "color"], seed: 8 });
  ok(count(multi.html, "page-break-before:always") === 2, "multi-worksheet pack page-breaks between sections");
  ok(multi.answerKey.length > 20, "pack ships a combined answer key");
  const empty = buildPack({});
  ok(empty.html.length > 500, "buildPack works with an empty config (sane defaults)");
}

/* ---------- certificates ---------- */
section("certificates");
{
  const cert = certificate("Amina Khan", "Reading Star — finished 5 stories", "4 Oct 2026");
  ok(cert.html.indexOf("Amina Khan") >= 0, "certificate includes the student's name");
  ok(cert.html.indexOf("Reading Star") >= 0, "certificate includes the achievement");
  ok(cert.html.indexOf("4 Oct 2026") >= 0, "certificate includes the date");
  ok(cert.html.indexOf("Certificate of Achievement") >= 0, "certificate has its heading");
  const anon = certificate("", "", "");
  ok(anon.html.indexOf("________________") >= 0, "blank name degrades to a write-in line");
}

/* ---------- curated library ---------- */
section("curated library");
{
  ok(WORKSHEET_DEFS.length >= 10, "library has 10+ ready worksheets (" + WORKSHEET_DEFS.length + ")");
  const ids = WORKSHEET_DEFS.map(function (d) { return d.id; });
  ok(new Set(ids).size === ids.length, "library ids are unique");
  let allGood = true;
  WORKSHEET_DEFS.forEach(function (d) {
    if (!d.id || !d.type || !d.title || !d.desc || typeof d.make !== "function") allGood = false;
    if (AGE_GROUPS.indexOf(d.ageGroup) < 0) allGood = false;
    if (!typeOf(d.type)) allGood = false;
    const ws = d.make();
    if (!ws || !ws.html || ws.html.length < 100) allGood = false;
  });
  ok(allGood, "every library entry builds a valid worksheet");
  ok(!!defById("trace-abc") && defById("trace-abc").title === "Trace the Alphabet", "defById resolves entries");
  const ages = new Set(WORKSHEET_DEFS.map(function (d) { return d.ageGroup; }));
  ok(ages.has("🧒 Kids") && ages.has("🧑 Juniors") && ages.has("🎓 Teens+"), "library covers all three age groups");
}

/* ---------- offline guarantee ---------- */
section("offline guarantee");
{
  const src = readFileSync(new URL("../js/worksheets.js", import.meta.url), "utf8");
  ok(!/fetch\s*\(/.test(src), "no fetch() calls in worksheets.js");
  ok(src.indexOf("http://") < 0 && src.indexOf("https://") < 0, "no external URLs in worksheets.js");
  const css = readFileSync(new URL("../print.css", import.meta.url), "utf8");
  ok(css.indexOf("@media print") >= 0, "print.css has print rules");
  ok(css.indexOf("print-area") >= 0, "print.css targets #print-area");
  ok(css.indexOf("@media screen") >= 0, "print.css hides #print-area on screen");
}

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
