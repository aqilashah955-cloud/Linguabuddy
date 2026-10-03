// LinguaBuddy — Game Arcade unit tests (run with: node test/games.test.js)
// Covers: pure game helpers (scramble, hangman state machine, match deck +
// scoring, error-item validity, reorder items, synonym rounds, XP math),
// the Game Night badge wiring, and the arcade meta list.
import {
  GAME_META, ROUND_SECS, metaOf,
  scrambleWord, pickGameItems, xpForScore,
  makeHangman, hangmanGuess, hangmanStatus, hangmanDisplay,
  makeMatchDeck, calcMatchScore,
  ERROR_ITEMS, pickErrorItems, validErrorItem,
  pickReorderItems, makeSynAntRound
} from "../js/games.js";
import { WORDS } from "../data/words.js";
import { BADGES } from "../js/gamify.js";
import { mulberry32 } from "../js/utils.js";

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; console.log("  PASS " + name); }
  else { fail++; console.log("  FAIL " + name); }
}
function section(s) { console.log("\n" + s); }
function sorted(s) { return s.split("").sort().join(""); }

/* ---------- arcade meta ---------- */
section("arcade meta");
ok(ROUND_SECS === 60, "rounds are 60 seconds");
ok(GAME_META.length === 6, "six games defined");
ok(new Set(GAME_META.map(function (m) { return m.id; })).size === 6, "game ids are unique");
ok(!!metaOf("detective") && metaOf("detective").title === "Error Detective", "metaOf resolves a game");

/* ---------- scramble ---------- */
section("scrambleWord");
const r1 = mulberry32(42);
ok(scrambleWord("brave", r1).length === 5, "scrambled word keeps length");
let differs = false;
for (let i = 0; i < 20; i++) {
  const s = scrambleWord("ancient", mulberry32(i + 1));
  if (sorted(s) !== sorted("ancient")) { fail++; console.log("  FAIL scramble keeps letters"); break; }
  if (s !== "ancient") differs = true;
  if (i === 19) { pass++; console.log("  PASS scramble keeps letters (20 samples)"); }
}
ok(differs, "scramble produces a different arrangement when possible");
ok(scrambleWord("a") === "a", "single letter unchanged");
ok(scrambleWord("ab", mulberry32(7)) === "ba" || sorted(scrambleWord("ab", mulberry32(7))) === "ab", "two-letter word handled");
ok(scrambleWord("zzz") === "zzz", "all-identical letters return unchanged");

/* ---------- pickGameItems ---------- */
section("pickGameItems");
const picks = pickGameItems(WORDS, 6, mulberry32(3));
ok(picks.length === 6 && new Set(picks.map(function (w) { return w.word; })).size === 6, "6 unique items sampled");
ok(pickGameItems(WORDS, 999, mulberry32(3)).length === WORDS.length, "n is capped at array length");

/* ---------- xpForScore ---------- */
section("xpForScore");
ok(xpForScore(100) === 10, "100 pts -> 10 XP");
ok(xpForScore(95) === 10, "95 pts -> 10 XP (rounds)");
ok(xpForScore(44) === 4, "44 pts -> 4 XP");
ok(xpForScore(5) === 1, "tiny score -> min 1 XP");
ok(xpForScore(0) === 1, "zero score -> min 1 XP");

/* ---------- hangman ---------- */
section("hangman");
let st = makeHangman("brave");
ok(hangmanStatus(st) === "ongoing", "fresh game is ongoing");
ok(hangmanDisplay(st) === "_ _ _ _ _", "blanks shown at start");
let g = hangmanGuess(st, "b");
ok(g.fresh && g.hit && g.status === "ongoing", "correct guess is fresh + hit");
ok(hangmanDisplay(g.state) === "b _ _ _ _", "correct letter revealed");
const g2 = hangmanGuess(g.state, "b");
ok(!g2.fresh && g2.state.wrong === g.state.wrong, "repeat guess changes nothing");
let h = hangmanGuess(g.state, "z");
ok(h.fresh && !h.hit && h.state.wrong === 1, "wrong guess increments wrong count");
let lose = makeHangman("brave");
"zqxjkp".split("").forEach(function (L) { lose = hangmanGuess(lose, L).state; });
ok(hangmanStatus(lose) === "lost", "6 wrong guesses -> lost");
let win = makeHangman("brave");
"brave".split("").forEach(function (L) { win = hangmanGuess(win, L).state; });
ok(hangmanStatus(win) === "won", "all letters guessed -> won");
ok(hangmanGuess(lose, "a").fresh === false, "no fresh guesses after game over");

/* ---------- speed match ---------- */
section("speed match");
const deck = makeMatchDeck(WORDS, 6, mulberry32(11));
ok(deck.words.length === 6 && deck.defs.length === 6, "deck has 6 words + 6 defs");
ok(deck.words.every(function (w) { return deck.map[w]; }), "map covers every word");
ok(deck.defs.every(function (d) {
  return deck.words.some(function (w) { return deck.map[w] === d; });
}), "defs match the same 6 words");
ok(calcMatchScore(5, 2, 3) === 61, "5 hits + streak 3 − 2 misses = 61");
ok(calcMatchScore(0, 10, 0) === 0, "score never goes below 0");
ok(calcMatchScore(6, 0, 6) === 90, "perfect 6-pair round = 60 + 30 streak bonus");

/* ---------- error detective ---------- */
section("error detective");
ok(ERROR_ITEMS.length >= 8, "curated error set has 8+ items");
ok(ERROR_ITEMS.every(validErrorItem), "every curated item has exactly one marked error");
const slosUsed = new Set(ERROR_ITEMS.map(function (it) { return it.slo; }));
["tenses", "sva", "articles", "prepositions"].forEach(function (s) {
  ok(slosUsed.has(s), "error set covers SLO: " + s);
});
const errPick = pickErrorItems(8, mulberry32(5));
ok(errPick.length === 8 && errPick.every(validErrorItem), "picked error items all valid");
ok(new Set(errPick).size === 8, "picked error items are unique");
const it0 = errPick[0];
ok(it0.words[it0.badIdx] !== it0.fix, "marked word differs from the fix");
ok(!validErrorItem({ words: ["a", "b"], badIdx: 5, fix: "c", wrong: ["d"] }), "out-of-range badIdx is invalid");

/* ---------- sentence sprint ---------- */
section("sentence sprint");
const ro = pickReorderItems(8, mulberry32(9));
ok(ro.length > 0, "reorder items found in banks");
ok(ro.every(function (it) {
  return sorted(it.shuffled.join("").replace(/ /g, "")) === sorted(it.words.join("").replace(/ /g, ""));
}), "shuffled words are a permutation of the originals");
ok(ro.every(function (it) { return typeof it.answer === "string" && it.answer.length > 0; }), "every reorder item has an answer");

/* ---------- synonym showdown ---------- */
section("synonym showdown");
const rs = makeSynAntRound(WORDS, "synonym", mulberry32(13));
ok(rs && rs.options.length === 4, "4 options offered");
ok(rs.options.indexOf(rs.answer) >= 0, "options include the answer");
ok(new Set(rs.options.map(function (o) { return o.toLowerCase(); })).size === 4, "options are unique");
ok(rs.answer === WORDS.find(function (w) { return w.word === rs.word; }).syn[0], "synonym round uses the word's synonym");
const ra = makeSynAntRound(WORDS, "antonym", mulberry32(14));
ok(ra.answer === WORDS.find(function (w) { return w.word === ra.word; }).ant[0], "antonym round uses the word's antonym");
ok(ra.options.indexOf(ra.word) < 0, "the word itself is never an option");

/* ---------- gamify wiring ---------- */
section("gamify wiring");
const gn = BADGES.find(function (b) { return b.id === "game-night"; });
ok(!!gn && gn.emoji === "🎮" && /3 game/i.test(gn.desc), "Game Night badge registered");

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
