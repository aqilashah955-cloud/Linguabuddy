// LinguaBuddy — node unit tests for the digital library expansion
// (run with: node test/library.test.js)
import { LIBRARY, DATA_VERSION_LIBRARY } from "../data/library.js";
import { LIBRARYMETA, DATA_VERSION_LIBRARYMETA } from "../data/librarymeta.js";
import { STORIES, storyById, storyMeta } from "../js/engine.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }

const GENRES = ["Adventure", "Mystery", "Science", "Biography", "Poetry", "History", "Humor", "Fantasy"];
const DIFFS = ["Easy", "Medium", "Advanced"];
const CORE_IDS = ["thirsty-crow", "tortoise-hare", "boy-wolf", "honest-woodcutter",
  "ant-grasshopper", "greedy-dog", "clever-rabbit", "unity-strength"];

section("library data integrity");
ok(DATA_VERSION_LIBRARY === "1.0.0", "library version stamped");
ok(DATA_VERSION_LIBRARYMETA === "1.0.0", "library meta version stamped");
ok(LIBRARY.length === 24, "24 library pieces present");
ok(Object.keys(LIBRARYMETA).length === 24, "24 library meta entries present");

section("story shape");
const ids = new Set();
let idOk = true, noCollision = true;
LIBRARY.forEach(function (s) {
  if (ids.has(s.id)) idOk = false;
  ids.add(s.id);
  if (CORE_IDS.indexOf(s.id) >= 0) noCollision = false;
});
ok(idOk, "all library ids unique");
ok(noCollision, "no id collides with core stories");
ok(LIBRARY.every(function (s) { return DIFFS.indexOf(s.difficulty) >= 0; }),
  "every piece has a valid difficulty");
ok(LIBRARY.every(function (s) { return s.title && s.text && s.text.length > 100; }),
  "every piece has title + substantive text");
ok(LIBRARY.every(function (s) {
  return Array.isArray(s.quiz) && s.quiz.length >= 4 &&
    s.quiz.every(function (q) {
      return q.q && Array.isArray(q.o) && q.o.length === 4 &&
        Number.isInteger(q.a) && q.a >= 0 && q.a <= 3;
    });
}), "every piece has 4+ valid quiz questions (4 options, valid answer index)");

section("meta shape");
ok(LIBRARY.every(function (s) { return !!LIBRARYMETA[s.id]; }),
  "every library piece has a meta entry");
ok(Object.keys(LIBRARYMETA).every(function (k) { return ids.has(k); }),
  "every meta entry maps to a library piece");
ok(Object.keys(LIBRARYMETA).every(function (k) { return GENRES.indexOf(LIBRARYMETA[k].genre) >= 0; }),
  "every meta genre is a known genre");
ok(GENRES.every(function (g) {
  return Object.keys(LIBRARYMETA).some(function (k) { return LIBRARYMETA[k].genre === g; });
}), "all 8 genres represented");
ok(Object.keys(LIBRARYMETA).every(function (k) {
  const m = LIBRARYMETA[k];
  return m.prediction && Array.isArray(m.vocab) && m.vocab.length === 3 &&
    m.vocab.every(function (v) { return v.word && v.def; }) &&
    m.inference && m.inference.q && m.writing;
}), "every meta has prediction, 3 vocab (word/def), inference, writing prompt");
ok(Object.keys(LIBRARYMETA).every(function (k) {
  const m = LIBRARYMETA[k];
  const text = LIBRARY.find(function (s) { return s.id === k; }).text.toLowerCase();
  return m.vocab.every(function (v) { return text.indexOf(v.word.toLowerCase()) >= 0; });
}), "vocab words appear in their piece's text");

section("engine merge");
ok(STORIES.length === 32, "merged catalog has 32 pieces (8 core + 24 library)");
ok(STORIES.every(function (s) { return !!storyById(s.id); }), "storyById resolves every piece");
ok(STORIES.every(function (s) { return !!storyMeta(s.id); }), "storyMeta resolves every piece");
ok(storyMeta("the-locked-library").genre === "Mystery", "new genre resolves through storyMeta");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
