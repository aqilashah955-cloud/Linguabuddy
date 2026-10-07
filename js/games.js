// LinguaBuddy — Game Arcade (vocabulary + grammar games).
// Six 60-second arcade rounds, all playable offline from bundled data
// (data/words.js + the SLO banks). Scores convert to XP via gamify.js, each
// round is recorded as a practice attempt (so streaks keep working) and
// counts toward the "Game Night" badge.
// Pure helpers (scrambleWord, hangman, scoring, item pickers) are exported
// for node tests; everything touching document lives inside functions.

import { WORDS } from "../data/words.js";
import { SLOS } from "../data/slos.js";
import { S, recordAttempt, touchStreak } from "./store.js";
import { awardXP, checkBadges } from "./gamify.js";
import { showScreen as show } from "./ui.js";
import { esc, shuffle, sample, norm } from "./utils.js";

function $(id) { return document.getElementById(id); }
function stage() { return $("gmStage"); }

let go = null;
export function setGamesGo(fn) { go = fn; }

/* ================= pure helpers (node-testable) ================= */

export const ROUND_SECS = 60;

export const GAME_META = [
  { id: "scramble", emoji: "🔀", title: "Word Scramble", desc: "Unscramble vocabulary words. Tap 💡 for a meaning hint." },
  { id: "hangman", emoji: "🪢", title: "Hangman", desc: "Guess the word from its definition. 6 wrong guesses and it's over!" },
  { id: "match", emoji: "⚡", title: "Speed Match", desc: "Tap a word, then its definition. Streaks earn bonus points!" },
  { id: "detective", emoji: "🕵️", title: "Error Detective", desc: "Spot the grammar mistake in the sentence, then fix it." },
  { id: "sprint", emoji: "🏃", title: "Sentence Sprint", desc: "Put the shuffled words back into a correct sentence — fast!" },
  { id: "showdown", emoji: "🥊", title: "Synonym Showdown", desc: "Synonym or antonym? Pick the right word from 4 options." }
];

export function metaOf(id) { return GAME_META.find(function (m) { return m.id === id; }); }

/** Scramble a word's letters (guaranteed different from the original when
 *  a different arrangement exists). rand: optional () => [0,1). */
export function scrambleWord(word, rand) {
  word = String(word);
  if (word.length < 2) return word;
  const letters = word.split("");
  const r = rand || Math.random;
  for (let i = 0; i < 12; i++) {
    const s = shuffle(letters, r).join("");
    if (s !== word) return s;
  }
  return shuffle(letters, r).join(""); // e.g. all-identical letters
}

/** Sample n unique items from an array. */
export function pickGameItems(arr, n, rand) {
  return sample(arr, n, rand);
}

/** XP from an arcade score: 1 XP per 10 points, minimum 1. */
export function xpForScore(score) {
  return Math.max(1, Math.round(score / 10));
}

/* ---------- hangman (pure state machine) ---------- */
export function makeHangman(word) {
  return { word: String(word).toLowerCase(), guessed: [], wrong: 0, maxWrong: 6 };
}
export function hangmanStatus(st) {
  const won = st.word.split("").every(function (ch) {
    return !/[a-z]/.test(ch) || st.guessed.indexOf(ch) >= 0;
  });
  if (won) return "won";
  return st.wrong >= st.maxWrong ? "lost" : "ongoing";
}
export function hangmanGuess(st, letter) {
  letter = String(letter).toLowerCase();
  const status = hangmanStatus(st);
  if (status !== "ongoing" || !/^[a-z]$/.test(letter) || st.guessed.indexOf(letter) >= 0) {
    return { state: st, status: status, fresh: false };
  }
  const hit = st.word.indexOf(letter) >= 0;
  const next = {
    word: st.word,
    guessed: st.guessed.concat([letter]),
    wrong: st.wrong + (hit ? 0 : 1),
    maxWrong: st.maxWrong
  };
  return { state: next, status: hangmanStatus(next), fresh: true, hit: hit };
}
export function hangmanDisplay(st) {
  return st.word.split("").map(function (ch) {
    return (/[a-z]/.test(ch) && st.guessed.indexOf(ch) < 0) ? "_" : ch;
  }).join(" ");
}

/* ---------- speed match ---------- */
export function makeMatchDeck(words, n, rand) {
  const picks = sample(words, n || 6, rand);
  const map = {};
  picks.forEach(function (w) { map[w.word] = w.def; });
  return {
    words: shuffle(picks.map(function (w) { return w.word; }), rand),
    defs: shuffle(picks.map(function (w) { return w.def; }), rand),
    map: map
  };
}
/** hits*10 + bestStreak*5 − misses*2, never below 0. */
export function calcMatchScore(hits, misses, bestStreak) {
  return Math.max(0, hits * 10 + bestStreak * 5 - misses * 2);
}

/* ---------- error detective ----------
 * Curated error sentences, several derived from real bank stems
 * (e.g. the tenses bank's "She ___ to school every day." with the wrong
 * option "go"). Each item marks EXACTLY ONE wrong word (badIdx). */
export const ERROR_ITEMS = [
  { slo: "tenses", words: ["She", "go", "to", "school", "every", "day."], badIdx: 1, fix: "goes", wrong: ["going", "went"], why: "Third-person singular needs “goes”: She goes." },
  { slo: "tenses", words: ["I", "will", "went", "tomorrow."], badIdx: 2, fix: "go", wrong: ["goes", "going"], why: "“will” is followed by the base verb: will go." },
  { slo: "tenses", words: ["She", "has", "went", "to", "Lahore."], badIdx: 2, fix: "gone", wrong: ["went", "go"], why: "After “has”, use the past participle: has gone." },
  { slo: "sva", words: ["The", "boys", "is", "playing", "outside."], badIdx: 2, fix: "are", wrong: ["is", "was"], why: "Plural subject “boys” needs “are”." },
  { slo: "sva", words: ["Each", "of", "the", "students", "wear", "a", "uniform."], badIdx: 4, fix: "wears", wrong: ["wear", "wore"], why: "“Each” is singular: Each wears a uniform." },
  { slo: "articles", words: ["She", "is", "a", "honest", "girl."], badIdx: 2, fix: "an", wrong: ["a", "the"], why: "Use “an” before a vowel sound: an honest girl." },
  { slo: "articles", words: ["I", "saw", "a", "elephant", "today."], badIdx: 2, fix: "an", wrong: ["a", "the"], why: "Use “an” before a vowel sound: an elephant." },
  { slo: "prepositions", words: ["He", "is", "good", "in", "maths."], badIdx: 3, fix: "at", wrong: ["in", "on"], why: "The phrase is “good at” something." },
  { slo: "prepositions", words: ["She", "arrived", "to", "Lahore", "yesterday."], badIdx: 2, fix: "in", wrong: ["to", "at"], why: "“Arrive” takes “in” for cities: arrived in Lahore." },
  { slo: "voice", words: ["The", "letter", "was", "wrote", "by", "Ali."], badIdx: 3, fix: "written", wrong: ["wrote", "writing"], why: "Passive voice needs the past participle: was written." },
  { slo: "speech", words: ["She", "asked", "me", "where", "am", "I", "going."], badIdx: 4, fix: "was", wrong: ["am", "is"], why: "In reported speech the verb shifts back: where I was going." },
  { slo: "punct", words: ["Its", "raining", "today."], badIdx: 0, fix: "It's", wrong: ["Its", "Its'"], why: "“It's” = it is. “Its” shows possession." },
  { slo: "clauses", words: ["The", "boy", "which", "is", "running", "is", "my", "brother."], badIdx: 2, fix: "who", wrong: ["which", "whom"], why: "Use “who” for people: the boy who is running." }
];
export function pickErrorItems(n, rand) {
  return sample(ERROR_ITEMS, n || 8, rand);
}
/** Sanity check for tests: exactly one marked error, fix differs, options unique. */
export function validErrorItem(it) {
  if (!it || !Array.isArray(it.words) || typeof it.badIdx !== "number") return false;
  if (it.badIdx < 0 || it.badIdx >= it.words.length) return false;
  if (typeof it.fix !== "string" || !it.fix) return false;
  if (it.words[it.badIdx] === it.fix) return false;
  const opts = [it.fix].concat(it.wrong || []);
  if (opts.length < 2) return false;
  for (let i = 0; i < opts.length; i++) for (let j = i + 1; j < opts.length; j++) {
    if (opts[i] === opts[j]) return false;
  }
  return true;
}

/* ---------- sentence sprint (reorder bank items) ---------- */
export function pickReorderItems(n, rand) {
  const items = [];
  SLOS.forEach(function (s) {
    (s.questions || []).forEach(function (q) {
      if (q.t === "reorder" && Array.isArray(q.w) && q.w.length > 1 && q.a) {
        items.push({ sloId: s.id, words: q.w.slice(), answer: q.a });
      }
    });
  });
  return sample(items, n || 8, rand).map(function (it) {
    return { sloId: it.sloId, words: it.words, answer: it.answer, shuffled: scrambleWordList(it.words, rand) };
  });
}
function scrambleWordList(words, rand) {
  const r = rand || Math.random;
  for (let i = 0; i < 12; i++) {
    const s = shuffle(words, r);
    if (s.join(" ") !== words.join(" ")) return s;
  }
  return shuffle(words, r);
}

/* ---------- synonym showdown ---------- */
export function makeSynAntRound(words, kind, rand) {
  const r = rand || Math.random;
  const pool = words.filter(function (w) {
    return kind === "synonym" ? (w.syn && w.syn.length) : (w.ant && w.ant.length);
  });
  if (!pool.length) return null;
  const pick = sample(pool, 1, r)[0];
  const answer = (kind === "synonym" ? pick.syn : pick.ant)[0];
  const seen = {};
  seen[answer.toLowerCase()] = 1; seen[pick.word.toLowerCase()] = 1;
  const dpool = [];
  words.forEach(function (w) {
    if (w.word === pick.word) return;
    (w.syn || []).concat(w.ant || []).forEach(function (d) {
      const k = String(d).toLowerCase();
      if (!seen[k]) { seen[k] = 1; dpool.push(d); }
    });
  });
  const distracts = sample(dpool, 3, r);
  return {
    word: pick.word, kind: kind, def: pick.def, answer: answer,
    options: shuffle([answer].concat(distracts), r)
  };
}

/* ================= arcade hub ================= */

function bestScores() {
  const best = {};
  (S.attempts || []).forEach(function (a) {
    if (a.kind !== "game" || !a.ref) return;
    const id = a.ref.slice(5);
    if (!best[id] || a.score > best[id]) best[id] = a.score;
  });
  return best;
}

export function renderGames() {
  stopTimer();
  G = null;
  const best = bestScores();
  const body = $("gamesBody");
  body.innerHTML =
    '<div class="grammar-grid">' + GAME_META.map(function (m) {
      return '<button class="grammar-card" data-game="' + m.id + '"><div class="g-num">' + m.emoji + "</div>" +
        "<h3>" + esc(m.title) + "</h3><p class=\"fine\">" + esc(m.desc) + "</p>" +
        '<span class="g-link">' + (best[m.id] != null ? "Best: " + best[m.id] + " · Play →" : "Play →") + "</span></button>";
    }).join("") + "</div>" +
    '<p class="fine gm-note">Every round is 60 seconds. Scores turn into XP and count toward your streak.</p>';
  body.querySelectorAll("[data-game]").forEach(function (b) {
    b.addEventListener("click", function () { startGame(b.getAttribute("data-game")); });
  });
  show("screen-games");
}

/* ================= session + timer ================= */

let G = null; // active session

function startGame(id) {
  const meta = metaOf(id);
  if (!meta) return;
  stopTimer();
  G = {
    id: id, meta: meta, score: 0, correct: 0, total: 0,
    timeLeft: ROUND_SECS, timer: null, over: false, streak: 0
  };
  $("gamesBody").innerHTML =
    '<div class="gm-top"><button class="btn-ghost btn-sm" id="gmQuit">← Hub</button>' +
    '<div class="gm-timerwrap" title="Time left"><div class="gm-timerbar" id="gmTimerBar"></div></div>' +
    '<div class="gm-clock" id="gmTimer">' + ROUND_SECS + '</div>' +
    '<div class="gm-score">⭐ <span id="gmScore">0</span></div></div>' +
    '<h3 class="gm-title">' + meta.emoji + " " + esc(meta.title) + "</h3>" +
    '<div id="gmStage"></div>';
  $("gmQuit").addEventListener("click", renderGames);
  show("screen-games");
  GAME_START[id]();
  startTimer();
}

function startTimer() {
  stopTimer();
  G.timer = setInterval(function () {
    if (!G) { stopTimer(); return; }
    const screen = $("screen-games");
    const clock = $("gmTimer");
    if (!clock || !screen || screen.classList.contains("hidden")) { stopTimer(); return; }
    G.timeLeft = Math.max(0, G.timeLeft - 0.25);
    clock.textContent = Math.ceil(G.timeLeft);
    const bar = $("gmTimerBar");
    if (bar) bar.style.width = (G.timeLeft / ROUND_SECS * 100) + "%";
    if (G.timeLeft <= 0) endGame();
  }, 250);
}

function stopTimer() {
  if (G && G.timer) { clearInterval(G.timer); G.timer = null; }
}

function addScore(n) {
  if (!G) return;
  G.score = Math.max(0, G.score + n);
  const el = $("gmScore");
  if (el) el.textContent = G.score;
}

function sayMsg(text, good) {
  const el = $("gmMsg");
  if (!el) return;
  el.textContent = text;
  el.className = "gm-msg" + (good === true ? " good" : good === false ? " bad" : "");
}

function endGame() {
  if (!G || G.over) return;
  G.over = true;
  stopTimer();
  const id = G.id, meta = G.meta;
  const xp = xpForScore(G.score);
  const total = Math.max(1, G.total);
  const pct = Math.round(G.correct / total * 100);
  recordAttempt({
    mode: "practice", kind: "game", ref: "game:" + id,
    title: "🎮 " + meta.title,
    score: G.score, total: total, pct: pct,
    secs: Math.round(ROUND_SECS - G.timeLeft), perSlo: {}
  });
  awardXP(xp, "arcade: " + meta.title);
  touchStreak();
  checkBadges();
  const best = bestScores();
  const isBest = best[id] != null && G.score >= best[id] && G.score > 0;
  stage().innerHTML =
    '<div class="gm-card gm-end"><div class="gm-endemoji">' + (pct >= 70 ? "🏆" : pct >= 40 ? "👏" : "💪") + "</div>" +
    "<h3>Round over!</h3>" +
    '<div class="gm-bigscore">' + G.score + "</div>" +
    '<p class="fine">' + G.correct + " of " + G.total + " correct" +
    (isBest ? ' · <strong>New best!</strong> 🎉' : "") + "</p>" +
    '<p class="gm-xp">+' + xp + " XP earned</p>" +
    '<div class="row-btns"><button class="btn-primary" id="gmAgain">Play Again</button>' +
    '<button class="btn-ghost" id="gmHub">Game Hub</button></div></div>';
  $("gmAgain").addEventListener("click", function () { startGame(id); });
  $("gmHub").addEventListener("click", renderGames);
  window.scrollTo(0, 0);
}

/* ================= 1. Word Scramble ================= */

function scrambleSetup() { nextScramble(); }

function nextScramble() {
  if (!G || G.over) return;
  const w = sample(WORDS, 1)[0];
  G.item = w;
  stage().innerHTML =
    '<div class="gm-card"><div class="gm-big gm-letters">' + esc(scrambleWord(w.word)) + "</div>" +
    '<p class="fine"><strong>' + esc(w.pos) + "</strong> · " + esc(w.def) + "</p>" +
    '<div class="row-flex"><input id="gmInput" type="text" placeholder="Type the unscrambled word…" autocomplete="off" autocapitalize="off" />' +
    '<button class="btn-primary" id="gmCheck">Check</button></div>' +
    '<div class="row-btns"><button class="btn-ghost btn-sm" id="gmHint">💡 Meaning hint</button>' +
    '<button class="btn-ghost btn-sm" id="gmSkip">Skip →</button></div>' +
    '<p class="gm-msg" id="gmMsg"></p></div>';
  const check = function () {
    const v = $("gmInput").value;
    G.total++;
    if (norm(v) === norm(w.word)) {
      G.correct++; addScore(10);
      sayMsg("Correct! +10 ⭐", true);
      setTimeout(function () { nextScramble(); }, 700);
    } else {
      sayMsg("Not quite — try again!", false);
    }
  };
  $("gmCheck").addEventListener("click", check);
  $("gmInput").addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
  $("gmHint").addEventListener("click", function () { sayMsg("Meaning: " + w.def); });
  $("gmSkip").addEventListener("click", function () { sayMsg("It was “" + w.word + "”.", null); setTimeout(nextScramble, 800); });
  $("gmInput").focus();
}

/* ================= 2. Hangman ================= */

const HANG_STAGES = ["🪢", "🙂", "😐", "😟", "😨", "😱", "💀"];

function hangmanSetup() { nextHangman(); }

function nextHangman() {
  if (!G || G.over) return;
  const w = sample(WORDS.filter(function (x) { return x.word.length >= 4; }), 1)[0];
  G.h = makeHangman(w.word);
  G.hdef = w.def;
  G.hword = w.word;
  drawHangman();
}

function drawHangman() {
  const st = G.h;
  const st5 = hangmanStatus(st);
  const alpha = "abcdefghijklmnopqrstuvwxyz".split("");
  stage().innerHTML =
    '<div class="gm-card"><div class="gm-hang">' + HANG_STAGES[st.wrong] + "</div>" +
    '<p class="fine">Clue: ' + esc(G.hdef) + "</p>" +
    '<div class="gm-big gm-letters">' + esc(hangmanDisplay(st)) + "</div>" +
    '<p class="fine">Wrong guesses: ' + st.wrong + " / " + st.maxWrong + "</p>" +
    (st5 === "ongoing"
      ? '<div class="gm-keys">' + alpha.map(function (L) {
          const used = st.guessed.indexOf(L) >= 0;
          return '<button class="gm-key" data-k="' + L + '"' + (used ? " disabled" : "") + ">" + L.toUpperCase() + "</button>";
        }).join("") + "</div>"
      : '<div class="row-btns"><button class="btn-primary" id="gmNext">Next word →</button></div>') +
    '<p class="gm-msg" id="gmMsg"></p></div>';
  if (st5 === "ongoing") {
    stage().querySelectorAll("[data-k]").forEach(function (b) {
      b.addEventListener("click", function () { hangmanTap(b.getAttribute("data-k")); });
    });
  } else {
    if (st5 === "won") sayMsg("You got it! +25 ⭐", true);
    else sayMsg("The word was “" + G.hword + "”.", null);
    $("gmNext").addEventListener("click", nextHangman);
  }
}

function hangmanTap(letter) {
  if (!G || G.over) return;
  const r = hangmanGuess(G.h, letter);
  G.h = r.state;
  if (r.status === "won") { G.correct++; G.total++; addScore(25); }
  if (r.status === "lost") { G.total++; }
  drawHangman();
}

/* ================= 3. Speed Match ================= */

function matchSetup() {
  G.hits = 0; G.misses = 0; G.bestStreak = 0;
  nextDeck();
}

function nextDeck() {
  if (!G || G.over) return;
  const deck = makeMatchDeck(WORDS, 6);
  G.deck = deck; G.matched = []; G.matchedDefs = []; G.sel = null;
  drawMatch();
}

function drawMatch() {
  const deck = G.deck;
  stage().innerHTML =
    '<div class="gm-card"><p class="fine">Tap a word, then its definition. Streak: <strong>' + G.streak + "</strong></p>" +
    '<div class="gm-matchgrid">' +
    '<div class="gm-col">' + deck.words.map(function (w) {
      const done = G.matched.indexOf(w) >= 0;
      return '<button class="gm-match' + (done ? " done" : G.sel === w ? " sel" : "") + '" data-w="' + esc(w) + '"' +
        (done ? " disabled" : "") + ">" + esc(w) + "</button>";
    }).join("") + "</div>" +
    '<div class="gm-col">' + deck.defs.map(function (d) {
      const done = G.matchedDefs.indexOf(d) >= 0;
      return '<button class="gm-match gm-def' + (done ? " done" : "") + '" data-d="' + esc(d) + '"' +
        (done ? " disabled" : "") + ">" + esc(d) + "</button>";
    }).join("") + "</div></div>" +
    '<p class="gm-msg" id="gmMsg"></p></div>';
  stage().querySelectorAll("[data-w]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.disabled) return;
      G.sel = b.getAttribute("data-w");
      drawMatch();
    });
  });
  stage().querySelectorAll("[data-d]").forEach(function (b) {
    b.addEventListener("click", function () { matchTap(b); });
  });
}

function matchTap(dBtn) {
  if (!G || G.over || !G.sel) { sayMsg("Pick a word first!", null); return; }
  const w = G.sel, d = dBtn.getAttribute("data-d");
  if (G.deck.map[w] === d) {
    G.matched.push(w); G.matchedDefs.push(d); G.sel = null;
    G.hits++; G.streak++;
    if (G.streak > G.bestStreak) G.bestStreak = G.streak;
    G.score = calcMatchScore(G.hits, G.misses, G.bestStreak);
    G.correct = G.hits; G.total = G.hits + G.misses;
    const el = $("gmScore"); if (el) el.textContent = G.score;
    dBtn.disabled = true; dBtn.classList.add("done");
    if (G.matched.length >= G.deck.words.length) {
      sayMsg("Deck cleared! +streak bonus ⭐", true);
      setTimeout(nextDeck, 800);
    } else drawMatch();
  } else {
    G.misses++; G.streak = 0;
    G.score = calcMatchScore(G.hits, G.misses, G.bestStreak);
    G.correct = G.hits; G.total = G.hits + G.misses;
    const el = $("gmScore"); if (el) el.textContent = G.score;
    sayMsg("Nope — streak reset!", false);
  }
}

/* ================= 4. Error Detective ================= */

function detectiveSetup() {
  G.items = pickErrorItems(12);
  G.i = 0;
  nextError();
}

function nextError() {
  if (!G || G.over) return;
  if (G.i >= G.items.length) { G.items = pickErrorItems(12); G.i = 0; }
  const it = G.items[G.i];
  G.phase = 1;
  stage().innerHTML =
    '<div class="gm-card"><p class="fine"><strong>' + esc(sloTitle(it.slo)) + '</strong> — tap the word with the mistake:</p>' +
    '<div class="gm-sentence">' + it.words.map(function (w, i) {
      return '<button class="gm-word" data-i="' + i + '">' + esc(w) + "</button>";
    }).join(" ") + "</div>" +
    '<div id="gmFix"></div><p class="gm-msg" id="gmMsg"></p></div>';
  stage().querySelectorAll("[data-i]").forEach(function (b) {
    b.addEventListener("click", function () { detectiveTap(parseInt(b.getAttribute("data-i"), 10)); });
  });
}

function detectiveTap(i) {
  if (!G || G.over || G.phase !== 1) return;
  const it = G.items[G.i];
  if (i === it.badIdx) {
    addScore(10);
    G.phase = 2;
    const opts = shuffle([it.fix].concat(it.wrong));
    $("gmFix").innerHTML =
      '<p class="fine"><strong>Found it! +10</strong> Now pick the correction:</p>' +
      '<div class="row-btns">' + opts.map(function (o) {
        return '<button class="btn-ghost gm-opt" data-o="' + esc(o) + '">' + esc(o) + "</button>";
      }).join("") + "</div>";
    stage().querySelectorAll("[data-o]").forEach(function (b) {
      b.addEventListener("click", function () {
        G.total++;
        if (b.getAttribute("data-o") === it.fix) {
          G.correct++; addScore(10);
          sayMsg("Fixed! +10 ⭐ " + it.why, true);
        } else {
          sayMsg("The fix is “" + it.fix + "”. " + it.why, false);
        }
        G.i++;
        setTimeout(nextError, 1400);
      });
    });
  } else {
    sayMsg("Not quite — look again!", false);
  }
}

function sloTitle(id) {
  const s = SLOS.find(function (x) { return x.id === id; });
  return s ? s.title : id;
}

/* ================= 5. Sentence Sprint ================= */

function sprintSetup() {
  G.items = pickReorderItems(8);
  G.i = 0;
  nextSprint();
}

function nextSprint() {
  if (!G || G.over) return;
  if (G.i >= G.items.length) { G.items = pickReorderItems(8); G.i = 0; }
  const it = G.items[G.i];
  G.pool = it.shuffled.slice();
  G.built = [];
  drawSprint();
}

function drawSprint() {
  const it = G.items[G.i];
  stage().innerHTML =
    '<div class="gm-card"><p class="fine"><strong>' + esc(sloTitle(it.sloId)) + '</strong> — tap the words in order:</p>' +
    '<div class="gm-answer" id="gmAns">' + (G.built.length
      ? G.built.map(function (w, i) { return '<button class="gm-word built" data-b="' + i + '">' + esc(w) + "</button>"; }).join(" ")
      : '<span class="gm-placeholder">Your sentence…</span>') + "</div>" +
    '<div class="gm-pool">' + G.pool.map(function (w, i) {
      return '<button class="gm-word" data-p="' + i + '">' + esc(w) + "</button>";
    }).join(" ") + "</div>" +
    '<div class="row-btns"><button class="btn-primary" id="gmCheckS">Check</button>' +
    '<button class="btn-ghost btn-sm" id="gmClear">Clear</button></div>' +
    '<p class="gm-msg" id="gmMsg"></p></div>';
  stage().querySelectorAll("[data-p]").forEach(function (b) {
    b.addEventListener("click", function () {
      const i = parseInt(b.getAttribute("data-p"), 10);
      G.built.push(G.pool[i]);
      G.pool.splice(i, 1);
      drawSprint();
    });
  });
  stage().querySelectorAll("[data-b]").forEach(function (b) {
    b.addEventListener("click", function () {
      const i = parseInt(b.getAttribute("data-b"), 10);
      G.pool.push(G.built[i]);
      G.built.splice(i, 1);
      drawSprint();
    });
  });
  $("gmClear").addEventListener("click", function () {
    G.pool = G.pool.concat(G.built); G.built = [];
    drawSprint();
  });
  $("gmCheckS").addEventListener("click", function () {
    G.total++;
    if (norm(G.built.join(" ")) === norm(it.answer)) {
      G.correct++; addScore(15);
      sayMsg("Perfect! +15 ⭐", true);
      G.i++;
      setTimeout(nextSprint, 800);
    } else {
      sayMsg("Not quite — try again!", false);
      G.pool = G.pool.concat(G.built); G.built = [];
      drawSprint();
    }
  });
}

/* ================= 6. Synonym Showdown ================= */

function showdownSetup() {
  G.kind = Math.random() < 0.5 ? "synonym" : "antonym";
  nextShowdown();
}

function nextShowdown() {
  if (!G || G.over) return;
  const r = makeSynAntRound(WORDS, G.kind);
  G.kind = G.kind === "synonym" ? "antonym" : "synonym"; // alternate rounds
  if (!r) { sayMsg("No words available.", null); return; }
  const label = r.kind === "synonym" ? "SYNONYM" : "ANTONYM";
  stage().innerHTML =
    '<div class="gm-card"><p class="fine">Pick the <strong>' + label + '</strong> of:</p>' +
    '<div class="gm-big">“' + esc(r.word) + "”</div>" +
    '<p class="fine">' + esc(r.def) + "</p>" +
    '<div class="gm-opts">' + r.options.map(function (o) {
      return '<button class="gm-optbtn" data-o="' + esc(o) + '">' + esc(o) + "</button>";
    }).join("") + "</div>" +
    '<p class="gm-msg" id="gmMsg"></p></div>';
  stage().querySelectorAll("[data-o]").forEach(function (b) {
    b.addEventListener("click", function () {
      G.total++;
      if (b.getAttribute("data-o") === r.answer) {
        G.correct++; G.streak++;
        addScore(10 + (G.streak >= 2 ? 2 : 0));
        sayMsg("Right! +10" + (G.streak >= 2 ? " (+2 streak)" : "") + " ⭐", true);
      } else {
        G.streak = 0;
        sayMsg("The " + r.kind + " is “" + r.answer + "”.", false);
      }
      setTimeout(nextShowdown, 1100);
    });
  });
}

/* ================= dispatch ================= */

const GAME_START = {
  scramble: scrambleSetup,
  hangman: hangmanSetup,
  match: matchSetup,
  detective: detectiveSetup,
  sprint: sprintSetup,
  showdown: showdownSetup
};
