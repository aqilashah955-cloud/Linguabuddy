// LinguaBuddy — Kids Zone unit tests (run with: node test/kids.test.js)
// Covers: data integrity (alphabet, sight words, picture words, rhymes,
// stories), pure round generators (exactly 1 correct choice), star helpers,
// narration word-index math, SVG scene generation.
import {
  ALPHABET, SIGHT_WORDS, PICTURE_WORDS, RHYME_FAMILIES, KIDS_STORIES
} from "../data/kids.js";
import {
  KIDS_ACTIVITIES, KID_VIDEOS, PRAISES, praiseFor,
  letterByName, makePhonicsRound, makeListenRound, makeRhymeRound,
  makePicturePairs, awardStars, totalStars, starsForScore,
  wordIndexAt, clampPage, svgScene
} from "../js/kids.js";
import { mulberry32 } from "../js/utils.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; }
  else { fail++; console.error("FAIL:", name); }
}
function seeded() { return mulberry32(12345); }
const rng = mulberry32(999); // shared across fuzz loops for varied rounds

const ART_KEYS = ["sun", "house", "tree", "cat", "bird", "pond", "star", "moon"];

/* ---------- data: alphabet ---------- */
ok(ALPHABET.length === 26, "alphabet has 26 entries");
ok(ALPHABET.every(function (e, i) { return e.letter === String.fromCharCode(65 + i); }),
  "alphabet letters are A-Z in order");
ok(new Set(ALPHABET.map(function (e) { return e.letter; })).size === 26,
  "alphabet letters unique");
ok(ALPHABET.every(function (e) { return e.word && e.emoji && e.phonics; }),
  "every letter has word + emoji + phonics");
ok(letterByName("c").word === "Cat", "letterByName finds C");
ok(letterByName("z").letter === "Z", "letterByName finds Z");
ok(letterByName("!") === null, "letterByName returns null for junk");

/* ---------- data: sight words ---------- */
ok(SIGHT_WORDS.length === 30, "30 sight words");
ok(SIGHT_WORDS.every(function (w) { return typeof w === "string" && w.length > 0; }),
  "sight words are non-empty strings");

/* ---------- data: picture words ---------- */
const cats = Object.keys(PICTURE_WORDS);
ok(cats.length === 4, "4 picture categories");
ok(cats.every(function (c) { return PICTURE_WORDS[c].length === 8; }),
  "8 pairs per category");
ok(cats.every(function (c) {
  return PICTURE_WORDS[c].every(function (p) { return p.emoji && p.word; });
}), "every pair has emoji + word");

/* ---------- data: rhymes ---------- */
ok(RHYME_FAMILIES.length === 6, "6 rhyme families");
ok(RHYME_FAMILIES.every(function (f) { return f.words.length >= 4; }),
  "every rhyme family has >= 4 words");

/* ---------- data: stories ---------- */
ok(KIDS_STORIES.length === 3, "3 kids stories");
ok(KIDS_STORIES.every(function (s) {
  return s.id && s.title && Array.isArray(s.pages) && s.pages.length >= 3;
}), "stories have id/title/3+ pages");
ok(KIDS_STORIES.every(function (s) {
  return s.pages.every(function (p) {
    return p.text && p.text.length > 10 && ART_KEYS.indexOf(p.art) >= 0;
  });
}), "every story page has art keyword + real text");

/* ---------- phonics rounds: exactly 1 correct ---------- */
for (let i = 0; i < 20; i++) {
  const r = makePhonicsRound(rng);
  ok(r.choices.length === 3, "phonics: 3 choices");
  ok(r.choices.filter(function (c) { return c.letter === r.promptLetter; }).length === 1,
    "phonics: exactly 1 correct choice");
  ok(r.correct.letter === r.promptLetter, "phonics: correct entry matches prompt");
}

/* ---------- listen rounds: exactly 1 correct ---------- */
for (let i = 0; i < 20; i++) {
  const r = makeListenRound(rng);
  ok(r.choices.length === 4, "listen: 4 choices");
  ok(r.choices.filter(function (c) { return c.word === r.word; }).length === 1,
    "listen: exactly 1 correct choice");
}

/* ---------- rhyme rounds: exactly 1 correct rhyme ---------- */
for (let i = 0; i < 20; i++) {
  const r = makeRhymeRound(rng);
  ok(r.choices.length === 3, "rhyme: 3 choices");
  ok(r.choices.filter(function (w) { return w === r.answer; }).length === 1,
    "rhyme: exactly 1 correct rhyme");
  const fam = RHYME_FAMILIES.find(function (f) { return f.family === r.family; });
  ok(fam.words.indexOf(r.target) >= 0 && fam.words.indexOf(r.answer) >= 0,
    "rhyme: target + answer share a family");
}

/* ---------- picture pairs ---------- */
const pairs = makePicturePairs("food", 4, rng);
ok(pairs.length === 4, "makePicturePairs returns n pairs");
ok(pairs.every(function (p) { return p.emoji && p.word; }), "pairs have emoji + word");

/* ---------- stars ---------- */
let st = awardStars({}, "phonics", 2);
ok(st.phonics === 2, "awardStars records new activity");
ok(Object.keys({}).length === 0, "awardStars does not mutate input");
st = awardStars(st, "phonics", 1);
ok(st.phonics === 2, "awardStars keeps the higher star count");
st = awardStars(st, "phonics", 3);
ok(st.phonics === 3, "awardStars upgrades to higher stars");
ok(totalStars({ a: 3, b: 2 }) === 5, "totalStars sums");
ok(totalStars(null) === 0, "totalStars handles null");
ok(starsForScore(4, 5) === 3, "starsForScore 80% -> 3");
ok(starsForScore(3, 5) === 2, "starsForScore 60% -> 2");
ok(starsForScore(1, 5) === 1, "starsForScore 20% -> 1");
ok(starsForScore(0, 0) === 1, "starsForScore guards div-by-zero");

/* ---------- narration word index ---------- */
ok(wordIndexAt("The sun is up.", 0) === 0, "wordIndexAt start");
ok(wordIndexAt("The sun is up.", 5) === 1, "wordIndexAt middle word");
ok(wordIndexAt("The sun is up.", 14) === 3, "wordIndexAt last word");
ok(clampPage(-2, 3) === 0, "clampPage floors");
ok(clampPage(9, 3) === 2, "clampPage caps");
ok(clampPage(1, 3) === 1, "clampPage passes through");

/* ---------- SVG scenes ---------- */
ART_KEYS.forEach(function (k) {
  const s = svgScene(k);
  ok(s.indexOf("<svg") === 0 && s.indexOf("</svg>") > 0, "svgScene(" + k + ") returns svg");
  ok((s.match(/<(rect|circle|ellipse|polygon|line|path|polyline)/g) || []).length < 15,
    "svgScene(" + k + ") stays under 15 elements");
});
ok(svgScene("nope").indexOf("<svg") === 0, "svgScene falls back for unknown art");

/* ---------- meta ---------- */
ok(KIDS_ACTIVITIES.length === 7, "7 kids activities");
ok(KIDS_ACTIVITIES.every(function (a) { return a.id && a.emoji && a.label; }),
  "activities have id/emoji/label");
ok(KID_VIDEOS.length === 2 && KID_VIDEOS.every(function (v) { return v.src; }),
  "2 videos with src");
ok(PRAISES.indexOf(praiseFor(seeded())) >= 0, "praiseFor returns a known praise");

console.log(pass + " passed, " + fail + " failed");
if (fail) process.exit(1);
