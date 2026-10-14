// LinguaBuddy — node unit tests for the digital library (original + expansion)
// (run with: node test/library.test.js)
import { LIBRARY, DATA_VERSION_LIBRARY } from "../data/library.js";
import { LIBRARYMETA, DATA_VERSION_LIBRARYMETA } from "../data/librarymeta.js";
import { LIBRARY2, DATA_VERSION_LIBRARY2 } from "../data/library2.js";
import { LIBRARYMETA2, DATA_VERSION_LIBRARYMETA2 } from "../data/librarymeta2.js";
import { GENRE_GUIDE, READING_STRATEGIES, SPEED_READING, DATA_VERSION_READGUIDE } from "../data/readguide.js";
import { STORIES, STORYMETA as CORE_STORYMETA, storyById, storyMeta } from "../js/engine.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }

const GENRES = ["Adventure", "Mystery", "Science", "Biography", "Poetry", "History",
  "Humor", "Fantasy", "Fable", "Folk Tale",
  "Drama", "Myth & Legend", "Short Story", "Essay", "Speech", "Letter", "Diary",
  "News Report", "Travelogue", "Interview", "Review", "Opinion", "Description"];
const DIFFS = ["Easy", "Medium", "Advanced"];
const CORE_IDS = ["thirsty-crow", "tortoise-hare", "boy-wolf", "honest-woodcutter",
  "ant-grasshopper", "greedy-dog", "clever-rabbit", "unity-strength"];

const ALL_PIECES = LIBRARY.concat(LIBRARY2);
// genre coverage counts the whole catalog, including the 8 core fables/folk tales
const ALL_META = Object.assign({}, CORE_STORYMETA, LIBRARYMETA, LIBRARYMETA2);

section("library data integrity");
ok(DATA_VERSION_LIBRARY === "1.0.0", "library version stamped");
ok(DATA_VERSION_LIBRARYMETA === "1.0.0", "library meta version stamped");
ok(DATA_VERSION_LIBRARY2 === "1.0.0", "library2 version stamped");
ok(DATA_VERSION_LIBRARYMETA2 === "1.0.0", "librarymeta2 version stamped");
ok(LIBRARY.length === 24, "24 original library pieces present");
ok(LIBRARY2.length === 26, "26 expansion pieces present");
ok(Object.keys(LIBRARYMETA2).length === 26, "26 expansion meta entries present");

section("story shape");
const ids = new Set();
let idOk = true, noCollision = true;
ALL_PIECES.forEach(function (s) {
  if (ids.has(s.id)) idOk = false;
  ids.add(s.id);
  if (CORE_IDS.indexOf(s.id) >= 0) noCollision = false;
});
ok(idOk, "all 50 piece ids unique");
ok(noCollision, "no id collides with core stories");
ok(ALL_PIECES.every(function (s) { return DIFFS.indexOf(s.difficulty) >= 0; }),
  "every piece has a valid difficulty");
ok(ALL_PIECES.every(function (s) { return s.title && s.text && s.text.length > 100; }),
  "every piece has title + substantive text");
ok(ALL_PIECES.every(function (s) {
  return Array.isArray(s.quiz) && s.quiz.length >= 4 &&
    s.quiz.every(function (q) {
      return q.q && Array.isArray(q.o) && q.o.length === 4 &&
        Number.isInteger(q.a) && q.a >= 0 && q.a <= 3;
    });
}), "every piece has 4+ valid quiz questions (4 options, valid answer index)");
ok(LIBRARY2.every(function (s) { return !!s.takeaway; }),
  "every expansion piece has a takeaway line");

section("meta shape");
ok(ALL_PIECES.every(function (s) { return !!ALL_META[s.id]; }),
  "every piece has a meta entry");
ok(Object.keys(ALL_META).every(function (k) {
  return STORIES.some(function (s) { return s.id === k; });
}), "every meta entry maps to a catalog piece");
ok(Object.keys(ALL_META).every(function (k) { return GENRES.indexOf(ALL_META[k].genre) >= 0; }),
  "every meta genre is a known genre");
ok(GENRES.every(function (g) {
  return Object.keys(ALL_META).some(function (k) { return ALL_META[k].genre === g; });
}), "all 23 genres represented");
ok(Object.keys(ALL_META).every(function (k) {
  const m = ALL_META[k];
  return m.prediction && Array.isArray(m.vocab) && m.vocab.length === 3 &&
    m.vocab.every(function (v) { return v.word && v.def; }) &&
    m.inference && m.inference.q && m.writing;
}), "every meta has prediction, 3 vocab (word/def), inference, writing prompt");
ok(Object.keys(ALL_META).every(function (k) {
  const m = ALL_META[k];
  const text = STORIES.find(function (s) { return s.id === k; }).text.toLowerCase();
  return m.vocab.every(function (v) { return text.indexOf(v.word.toLowerCase()) >= 0; });
}), "vocab words appear in their piece's text");

section("expansion activities data");
ok(LIBRARY2.every(function (s) {
  const m = LIBRARYMETA2[s.id];
  return m && m.scan && m.scan.task && m.scan.answer;
}), "every expansion piece has a scan challenge (task + answer)");
ok(LIBRARY2.every(function (s) {
  const m = LIBRARYMETA2[s.id];
  return m && Array.isArray(m.order) && m.order.length === 4 &&
    m.order.every(function (e) { return typeof e === "string" && e.length > 0 && e.length <= 80; });
}), "every expansion piece has 4 ordered events");
ok(LIBRARY2.every(function (s) {
  const m = LIBRARYMETA2[s.id];
  const low = s.text.toLowerCase();
  return m.order.every(function (e) {
    // each event's key words should be findable in the text
    const words = e.toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter(function (w) { return w.length > 3; });
    return words.some(function (w) { return low.indexOf(w) >= 0; });
  });
}), "ordered events reference the piece text");

section("reading resources");
ok(DATA_VERSION_READGUIDE === "1.0.0", "readguide version stamped");
ok(GENRE_GUIDE.length === GENRES.length, "genre guide covers all genres");
ok(GENRES.every(function (g) {
  return GENRE_GUIDE.some(function (x) { return x.genre === g; });
}), "every genre has a guide entry");
ok(GENRE_GUIDE.every(function (x) { return x.icon && x.blurb && x.tip; }),
  "every guide entry has icon, blurb, tip");
ok(READING_STRATEGIES.length === 3 &&
  READING_STRATEGIES.every(function (s) { return s.when && s.points && s.points.length >= 2; }),
  "3 strategy groups (before/during/after) with points");
ok(SPEED_READING.length === 2 &&
  SPEED_READING.every(function (s) { return s.skill && s.what && s.how; }),
  "skimming + scanning explained");

section("engine merge");
ok(STORIES.length === 58, "merged catalog has 58 pieces (8 core + 24 + 26)");
ok(STORIES.every(function (s) { return !!storyById(s.id); }), "storyById resolves every piece");
ok(STORIES.every(function (s) { return !!storyMeta(s.id); }), "storyMeta resolves every piece");
ok(storyMeta("letter-to-the-editor").genre === "Letter", "new genre resolves through storyMeta");
ok(storyMeta("letter-to-the-editor").scan.task.length > 0, "scan data resolves through storyMeta");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
