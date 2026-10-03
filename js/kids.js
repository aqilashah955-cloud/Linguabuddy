// LinguaBuddy — Kids Zone (ages 5-8).
// Early-learning activities: alphabet explorer, phonics, picture words,
// listen & tap, rhymes, animated story time, and videos.
// All read-aloud goes through js/tts.js (speak/speakSlow/stopSpeak).
// Pure helpers are exported for node tests; everything touching document
// lives inside functions. Creates NO global state at import time.

import { ALPHABET, SIGHT_WORDS, PICTURE_WORDS, PICTURE_CATS, RHYME_FAMILIES, KIDS_STORIES } from "../data/kids.js";
import { S, save, touchStreak } from "./store.js";
import { speak, speakSlow, stopSpeak, ttsAvailable } from "./tts.js";
import { showScreen as show } from "./ui.js";
import { esc, shuffle, sample } from "./utils.js";

function $(id) { return document.getElementById(id); }
function stage() { return $("kidsBody"); }

let go = null;
export function setKidsGo(fn) { go = fn; }

/* ================= pure helpers (node-testable) ================= */

export const KIDS_ACTIVITIES = [
  { id: "alphabet", emoji: "🔤", label: "Alphabet", desc: "Learn A to Z with fun words!" },
  { id: "phonics", emoji: "🗣️", label: "Phonics", desc: "Which letter does it start with?" },
  { id: "picture", emoji: "🖼️", label: "Picture Words", desc: "Tap pictures, hear words!" },
  { id: "listen", emoji: "👂", label: "Listen & Tap", desc: "Hear a word, tap the picture!" },
  { id: "rhyme", emoji: "🎵", label: "Rhyme Time", desc: "Cat, hat… which one rhymes?" },
  { id: "story", emoji: "📖", label: "Story Time", desc: "Listen to little stories!" },
  { id: "watch", emoji: "🎬", label: "Watch", desc: "Fun learning videos!" }
];

export const KID_VIDEOS = [
  { id: "welcome", title: "👋 Welcome to LinguaBuddy", src: "assets/welcome.mp4" },
  { id: "phonics-abc", title: "🔤 ABC Phonics Song", src: "assets/phonics-abc.mp4" }
];

export const PRAISES = ["Great job!", "Well done!", "Super!", "Amazing!", "You did it!", "Fantastic!"];

export function praiseFor(rand) {
  const r = rand || Math.random;
  return PRAISES[Math.floor(r() * PRAISES.length)];
}

export function letterByName(L) {
  L = String(L || "").toUpperCase();
  return ALPHABET.find(function (e) { return e.letter === L; }) || null;
}

/** Phonics round: "Which one starts with B?" — exactly 1 correct choice. */
export function makePhonicsRound(rand) {
  const r = rand || Math.random;
  const correct = sample(ALPHABET, 1, r)[0];
  const others = sample(ALPHABET.filter(function (e) { return e.letter !== correct.letter; }), 2, r);
  return {
    promptLetter: correct.letter,
    correct: correct,
    choices: shuffle([correct].concat(others), r)
  };
}

/** Listen & Tap round: hear a word, tap the right picture — exactly 1 correct. */
export function makeListenRound(rand) {
  const r = rand || Math.random;
  const cats = Object.keys(PICTURE_WORDS);
  const cat = cats[Math.floor(r() * cats.length)];
  const pool = PICTURE_WORDS[cat];
  const correct = sample(pool, 1, r)[0];
  const others = sample(pool.filter(function (p) { return p.word !== correct.word; }), 3, r);
  return { word: correct.word, emoji: correct.emoji, choices: shuffle([correct].concat(others), r) };
}

/** Rhyme round: target word + exactly 1 rhyming choice. */
export function makeRhymeRound(rand) {
  const r = rand || Math.random;
  const fam = sample(RHYME_FAMILIES, 1, r)[0];
  const words = shuffle(fam.words.slice(), r);
  const target = words[0], answer = words[1];
  const others = [];
  const seen = {};
  seen[target] = 1; seen[answer] = 1;
  const flat = [];
  RHYME_FAMILIES.forEach(function (f) {
    if (f.family === fam.family) return;
    f.words.forEach(function (w) { flat.push(w); });
  });
  shuffle(flat, r).forEach(function (w) {
    if (others.length < 2 && !seen[w]) { seen[w] = 1; others.push(w); }
  });
  return {
    family: fam.family, target: target, answer: answer,
    choices: shuffle([answer].concat(others), r)
  };
}

/** Picture pairs for the match game: n {emoji, word} pairs from a category. */
export function makePicturePairs(catId, n, rand) {
  const pool = PICTURE_WORDS[catId] || PICTURE_WORDS.animals;
  return sample(pool, n || 4, rand).map(function (p) { return { emoji: p.emoji, word: p.word }; });
}

/** Record stars (keeps the highest ever earned). Pure: does not mutate input. */
export function awardStars(starsObj, activityId, stars) {
  const cur = starsObj || {};
  const next = Object.assign({}, cur);
  next[activityId] = Math.max(cur[activityId] || 0, stars || 0);
  return next;
}

export function totalStars(starsObj) {
  let t = 0;
  Object.keys(starsObj || {}).forEach(function (k) { t += starsObj[k] || 0; });
  return t;
}

/** Stars from a score: >=80% -> 3, >=50% -> 2, else 1. */
export function starsForScore(score, total) {
  const pct = total > 0 ? score / total * 100 : 0;
  return pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
}

/** Index of the word containing charIndex (for narration highlighting). */
export function wordIndexAt(text, charIndex) {
  let idx = 0, result = 0;
  const re = /\S+/g;
  let m;
  while ((m = re.exec(String(text)))) {
    if (m.index > charIndex) break;
    result = idx;
    idx++;
  }
  return result;
}

export function clampPage(i, n) {
  return Math.max(0, Math.min(n - 1, i));
}

/* ---------- tiny inline SVG scenes (each < 15 elements) ---------- */
const SVG_OPEN = '<svg viewBox="0 0 200 120" class="kz-svg" aria-hidden="true">';
const SVG_CLOSE = "</svg>";

function sceneSun() {
  let rays = "";
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const x1 = 100 + Math.cos(a) * 28, y1 = 45 + Math.sin(a) * 28;
    const x2 = 100 + Math.cos(a) * 38, y2 = 45 + Math.sin(a) * 38;
    rays += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="#e9a13b" stroke-width="3" stroke-linecap="round"/>';
  }
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#bfe8ff"/>' +
    '<circle cx="100" cy="45" r="22" fill="#ffd93b" stroke="#e9a13b" stroke-width="3"/>' +
    rays +
    '<rect y="95" width="200" height="25" fill="#8fd18f"/>' +
    SVG_CLOSE;
}

function sceneHouse() {
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#bfe8ff"/>' +
    '<rect y="95" width="200" height="25" fill="#8fd18f"/>' +
    '<rect x="70" y="55" width="60" height="42" fill="#fffdf7" stroke="#7a5c3e" stroke-width="3"/>' +
    '<polygon points="62,56 100,28 138,56" fill="#e9a13b" stroke="#b97a1e" stroke-width="3"/>' +
    '<rect x="93" y="72" width="15" height="25" fill="#7a5c3e"/>' +
    '<rect x="77" y="62" width="14" height="12" fill="#bfe8ff" stroke="#7a5c3e" stroke-width="2"/>' +
    '<circle cx="165" cy="25" r="12" fill="#ffd93b"/>' +
    SVG_CLOSE;
}

function sceneTree() {
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#bfe8ff"/>' +
    '<rect y="95" width="200" height="25" fill="#8fd18f"/>' +
    '<rect x="95" y="60" width="10" height="38" fill="#7a5c3e"/>' +
    '<circle cx="100" cy="45" r="22" fill="#4caf50"/>' +
    '<circle cx="82" cy="56" r="15" fill="#66bb6a"/>' +
    '<circle cx="118" cy="56" r="15" fill="#66bb6a"/>' +
    '<circle cx="165" cy="22" r="12" fill="#ffd93b"/>' +
    SVG_CLOSE;
}

function sceneCat() {
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#fbeed3"/>' +
    '<rect y="95" width="200" height="25" fill="#e7dcc3"/>' +
    '<ellipse cx="100" cy="82" rx="34" ry="20" fill="#f0a35e"/>' +
    '<circle cx="100" cy="52" r="17" fill="#f0a35e"/>' +
    '<polygon points="86,42 82,26 95,35" fill="#f0a35e" stroke="#b97a1e" stroke-width="2"/>' +
    '<polygon points="114,42 118,26 105,35" fill="#f0a35e" stroke="#b97a1e" stroke-width="2"/>' +
    '<circle cx="94" cy="50" r="2.6" fill="#2c2a24"/>' +
    '<circle cx="106" cy="50" r="2.6" fill="#2c2a24"/>' +
    '<polygon points="100,55 96,59 104,59" fill="#e26d8d"/>' +
    '<line x1="88" y1="57" x2="74" y2="55" stroke="#2c2a24" stroke-width="1.4"/>' +
    '<line x1="88" y1="60" x2="74" y2="62" stroke="#2c2a24" stroke-width="1.4"/>' +
    '<line x1="112" y1="57" x2="126" y2="55" stroke="#2c2a24" stroke-width="1.4"/>' +
    '<line x1="112" y1="60" x2="126" y2="62" stroke="#2c2a24" stroke-width="1.4"/>' +
    '<path d="M132 78 q 18 -4 14 -22" fill="none" stroke="#f0a35e" stroke-width="6" stroke-linecap="round"/>' +
    SVG_CLOSE;
}

function sceneBird() {
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#bfe8ff"/>' +
    '<line x1="30" y1="95" x2="170" y2="85" stroke="#7a5c3e" stroke-width="5" stroke-linecap="round"/>' +
    '<ellipse cx="105" cy="70" rx="22" ry="14" fill="#5aa9e6"/>' +
    '<circle cx="124" cy="60" r="10" fill="#5aa9e6"/>' +
    '<circle cx="127" cy="58" r="2.2" fill="#2c2a24"/>' +
    '<polygon points="133,60 141,63 133,66" fill="#e9a13b"/>' +
    '<ellipse cx="100" cy="68" rx="10" ry="6" fill="#3d7fb8"/>' +
    '<line x1="98" y1="83" x2="98" y2="90" stroke="#e9a13b" stroke-width="2.5"/>' +
    '<line x1="108" y1="83" x2="108" y2="90" stroke="#e9a13b" stroke-width="2.5"/>' +
    SVG_CLOSE;
}

function scenePond() {
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#bfe8ff"/>' +
    '<rect y="88" width="200" height="32" fill="#8fd18f"/>' +
    '<ellipse cx="100" cy="92" rx="62" ry="20" fill="#5aa9e6"/>' +
    '<ellipse cx="70" cy="92" rx="18" ry="6" fill="none" stroke="#bfe8ff" stroke-width="2"/>' +
    '<ellipse cx="130" cy="94" rx="22" ry="7" fill="none" stroke="#bfe8ff" stroke-width="2"/>' +
    '<ellipse cx="80" cy="80" rx="15" ry="9" fill="#ffd93b"/>' +
    '<circle cx="92" cy="73" r="7" fill="#ffd93b"/>' +
    '<polygon points="98,73 104,75 98,77" fill="#e9a13b"/>' +
    '<line x1="160" y1="88" x2="158" y2="66" stroke="#4caf50" stroke-width="3"/>' +
    '<line x1="170" y1="88" x2="172" y2="68" stroke="#4caf50" stroke-width="3"/>' +
    SVG_CLOSE;
}

function sceneStar() {
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#16295f"/>' +
    '<polygon points="100,33 105.3,47.7 120.9,48.2 108.6,57.8 112.9,72.8 100,64 87.1,72.8 91.4,57.8 79.1,48.2 94.7,47.7" fill="#ffd93b"/>' +
    '<circle cx="40" cy="25" r="3" fill="#fffdf7"/>' +
    '<circle cx="160" cy="30" r="2.5" fill="#fffdf7"/>' +
    '<circle cx="150" cy="88" r="2" fill="#fffdf7"/>' +
    '<rect y="100" width="200" height="20" fill="#0e1c42"/>' +
    SVG_CLOSE;
}

function sceneMoon() {
  return SVG_OPEN +
    '<rect width="200" height="120" fill="#16295f"/>' +
    '<circle cx="135" cy="45" r="20" fill="#f5e9b8"/>' +
    '<circle cx="143" cy="38" r="17" fill="#16295f"/>' +
    '<circle cx="50" cy="30" r="2.5" fill="#fffdf7"/>' +
    '<circle cx="80" cy="70" r="2" fill="#fffdf7"/>' +
    '<circle cx="160" cy="90" r="2.5" fill="#fffdf7"/>' +
    SVG_CLOSE;
}

const SCENES = {
  sun: sceneSun, house: sceneHouse, tree: sceneTree, cat: sceneCat,
  bird: sceneBird, pond: scenePond, star: sceneStar, moon: sceneMoon
};

/** Inline SVG string for a story page's art keyword. Falls back to sun. */
export function svgScene(art) {
  const fn = SCENES[art] || sceneSun;
  return fn();
}

/* ================= session state + stars ================= */

let KZ = null; // active kids session

function kidStars() {
  return S.kidsStars || (S.kidsStars = {});
}

function giveStars(activityId, stars) {
  const before = kidStars()[activityId] || 0;
  S.kidsStars = awardStars(S.kidsStars, activityId, stars);
  touchStreak();
  save();
  return (S.kidsStars[activityId] || 0) > before;
}

function sayPraise() {
  speak(praiseFor());
}

function hubBar() {
  return '<div class="kz-topbar">' +
    '<button class="btn-ghost btn-sm" id="kzBack">← Home</button>' +
    '<div class="kz-starcount">⭐ ' + totalStars(kidStars()) + "</div></div>";
}

function wireBack() {
  const b = $("kzBack");
  if (b) b.addEventListener("click", function () {
    stopSpeak();
    if (go) go("home");
  });
}

/* ================= Kids home ================= */

export function showKidsHome() {
  stopSpeak();
  KZ = null;
  const stars = kidStars();
  stage().innerHTML = hubBar() +
    '<div class="kz-hero"><div class="kz-heroemoji">🧒</div><h2>Kids Zone</h2>' +
    '<p class="fine">Tap a card to play and learn!</p></div>' +
    '<div class="kz-grid">' + KIDS_ACTIVITIES.map(function (a) {
      const s = stars[a.id] || 0;
      return '<button class="kz-btn" data-act="' + a.id + '">' +
        '<span class="kz-btnemoji">' + a.emoji + "</span>" +
        '<span class="kz-btnlabel">' + esc(a.label) + "</span>" +
        '<span class="kz-btnstars">' + (s > 0 ? "⭐".repeat(s) : "☆☆☆") + "</span>" +
        '<span class="kz-btndesc">' + esc(a.desc) + "</span></button>";
    }).join("") + "</div>";
  wireBack();
  stage().querySelectorAll("[data-act]").forEach(function (b) {
    b.addEventListener("click", function () {
      const a = KIDS_ACTIVITIES.find(function (x) { return x.id === b.getAttribute("data-act"); });
      if (a) speak(a.label); // labels spoken aloud — little kids may not read yet
      openActivity(b.getAttribute("data-act"));
    });
  });
  show("screen-kids");
  if (window.scrollTo) window.scrollTo(0, 0);
}

function openActivity(id) {
  stopSpeak();
  if (id === "alphabet") renderAlphabet();
  else if (id === "phonics") renderPhonics();
  else if (id === "picture") renderPictureWords();
  else if (id === "listen") renderListen();
  else if (id === "rhyme") renderRhyme();
  else if (id === "story") renderStories();
  else if (id === "watch") renderWatch();
}

function actHeader(emoji, title, backTo) {
  return hubBar() +
    '<div class="kz-acthead"><button class="btn-ghost btn-sm" id="kzActBack">← Kids Zone</button>' +
    '<h3>' + emoji + " " + esc(title) + "</h3></div>";
}

function wireActBack() {
  wireBack();
  const b = $("kzActBack");
  if (b) b.addEventListener("click", function () { stopSpeak(); showKidsHome(); });
}

/* ================= 🔤 Alphabet Explorer ================= */

function renderAlphabet(visited) {
  KZ = { view: "alphabet", visited: visited || {} };
  stage().innerHTML = actHeader("🔤", "Alphabet Explorer") +
    '<p class="fine kz-center">Tap a letter to meet it!</p>' +
    '<div class="kz-alpha-grid">' + ALPHABET.map(function (e) {
      return '<button class="kz-letter" data-l="' + e.letter + '">' + e.letter + "</button>";
    }).join("") + "</div>" +
    '<p class="fine kz-center" id="kzAlphaProg">0 / 26 letters met</p>';
  wireActBack();
  stage().querySelectorAll("[data-l]").forEach(function (b) {
    b.addEventListener("click", function () { showLetter(b.getAttribute("data-l")); });
  });
  markVisited();
  show("screen-kids");
}

function showLetter(L) {
  const e = letterByName(L);
  if (!e) return;
  KZ.visited[L] = true;
  const n = Object.keys(KZ.visited).length;
  stage().innerHTML = actHeader("🔤", "Alphabet Explorer") +
    '<div class="kz-lettercard">' +
    '<div class="kz-bigletter kz-pop">' + e.letter + '<span class="kz-bigletter-sm">' + e.letter.toLowerCase() + "</span></div>" +
    '<div class="kz-letteremoji kz-pop2">' + e.emoji + "</div>" +
    '<div class="kz-letterword">' + esc(e.word) + "</div>" +
    '<p class="fine kz-center">' + e.letter + " says “" + esc(e.phonics) + "”</p>" +
    '<div class="row-btns"><button class="btn-primary" id="kzHear">🔊 Hear it</button>' +
    '<button class="btn-ghost" id="kzAlphaBack">All letters</button></div>' +
    (n >= 26 ? '<p class="kz-praise">🎉 You met every letter! Amazing!</p>' : "") +
    "</div>";
  wireActBack();
  const sayIt = function () { speak(L + ". " + L + " says " + e.phonics + ". " + L + " for " + e.word + "."); };
  $("kzHear").addEventListener("click", sayIt);
  $("kzAlphaBack").addEventListener("click", function () {
    stopSpeak();
    const visited = KZ.visited;
    if (n >= 26 && giveStars("alphabet", 3)) sayPraise();
    renderAlphabet(visited);
    markVisited();
  });
  setTimeout(sayIt, 250);
}

function markVisited() {
  if (!KZ || !KZ.visited) return;
  const n = Object.keys(KZ.visited).length;
  stage().querySelectorAll("[data-l]").forEach(function (b) {
    if (KZ.visited[b.getAttribute("data-l")]) b.classList.add("met");
  });
  const prog = $("kzAlphaProg");
  if (prog) prog.textContent = n + " / 26 letters met";
}

/* ================= 🗣️ Phonics game ================= */

function renderPhonics() {
  KZ = { view: "phonics", q: 0, correct: 0, total: 5 };
  nextPhonics();
}

function nextPhonics() {
  if (KZ.q >= KZ.total) {
    const stars = starsForScore(KZ.correct, KZ.total);
    giveStars("phonics", stars);
    stage().innerHTML = actHeader("🗣️", "Phonics") +
      '<div class="kz-endcard"><div class="kz-endemoji">' + (stars >= 3 ? "🏆" : stars === 2 ? "👏" : "💪") + "</div>" +
      "<h3>You got " + KZ.correct + " of " + KZ.total + "!</h3>" +
      '<p class="kz-stars-big">' + "⭐".repeat(stars) + "</p>" +
      '<div class="row-btns"><button class="btn-primary" id="kzAgain">Play again</button>' +
      '<button class="btn-ghost" id="kzDone">Kids Zone</button></div></div>';
    wireActBack();
    sayPraise();
    $("kzAgain").addEventListener("click", renderPhonics);
    $("kzDone").addEventListener("click", function () { stopSpeak(); showKidsHome(); });
    return;
  }
  const round = makePhonicsRound();
  KZ.q++;
  stage().innerHTML = actHeader("🗣️", "Phonics") +
    '<p class="fine kz-center">Question ' + KZ.q + " of " + KZ.total + "</p>" +
    '<div class="kz-qcard"><button class="btn-ghost btn-sm" id="kzAsk">🔊 Hear the question</button>' +
    '<h3 class="kz-bigq">Which one starts with <span class="kz-hl">' + round.promptLetter + "</span>?</h3>" +
    '<div class="kz-optrow">' + round.choices.map(function (c) {
      return '<button class="kz-optbtn" data-l="' + c.letter + '">' +
        '<span class="kz-optemoji">' + c.emoji + "</span>" +
        '<span class="kz-optword">' + esc(c.word) + "</span></button>";
    }).join("") + "</div>" +
    '<p class="kz-msg" id="kzMsg"></p></div>';
  wireActBack();
  const ask = function () { speakSlow("Which one starts with " + round.promptLetter + "?"); };
  $("kzAsk").addEventListener("click", ask);
  setTimeout(ask, 400);
  stage().querySelectorAll("[data-l]").forEach(function (b) {
    b.addEventListener("click", function () {
      const ok = b.getAttribute("data-l") === round.promptLetter;
      const msg = $("kzMsg");
      if (ok) {
        KZ.correct++;
        b.classList.add("right");
        msg.textContent = "⭐ Yes! " + round.correct.word + " starts with " + round.promptLetter + "!";
        sayPraise();
        setTimeout(nextPhonics, 1600);
      } else {
        b.classList.add("wrong");
        b.disabled = true;
        msg.textContent = "Try again! 💪";
        speak("Try again!");
      }
    });
  });
  show("screen-kids");
}

/* ================= 🖼️ Picture Words ================= */

function renderPictureWords() {
  KZ = { view: "picture" };
  stage().innerHTML = actHeader("🖼️", "Picture Words") +
    '<p class="fine kz-center">Pick a group, then tap a picture to hear its word!</p>' +
    '<div class="kz-chiprow">' + PICTURE_CATS.map(function (c) {
      return '<button class="kz-chip" data-cat="' + c.id + '">' + c.emoji + " " + esc(c.label) + "</button>";
    }).join("") + "</div>" +
    '<div id="kzPicGrid"></div>' +
    '<div class="kz-center"><button class="btn-primary" id="kzMatchBtn" style="display:none">🎮 Play Match Game</button></div>';
  wireActBack();
  stage().querySelectorAll("[data-cat]").forEach(function (b) {
    b.addEventListener("click", function () {
      speak(b.textContent.trim());
      showPictureCat(b.getAttribute("data-cat"));
    });
  });
  show("screen-kids");
}

function showPictureCat(catId) {
  KZ.cat = catId;
  const items = PICTURE_WORDS[catId] || [];
  $("kzPicGrid").innerHTML = '<div class="kz-picgrid">' + items.map(function (p) {
    return '<button class="kz-piccard" data-w="' + esc(p.word) + '">' +
      '<span class="kz-picemoji">' + p.emoji + "</span>" +
      '<span class="kz-picword">' + esc(p.word) + "</span></button>";
  }).join("") + "</div>";
  $("kzMatchBtn").style.display = "";
  $("kzPicGrid").querySelectorAll("[data-w]").forEach(function (b) {
    b.addEventListener("click", function () {
      b.classList.remove("kz-pop");
      void b.offsetWidth; // restart animation
      b.classList.add("kz-pop");
      speak(b.getAttribute("data-w"));
    });
  });
  $("kzMatchBtn").onclick = function () { startPictureMatch(catId); };
}

function startPictureMatch(catId) {
  const pairs = makePicturePairs(catId, 4);
  KZ = { view: "match", pairs: pairs, found: 0, misses: 0, first: null, lock: false };
  drawMatchBoard();
}

function drawMatchBoard() {
  const tiles = [];
  KZ.pairs.forEach(function (p, i) {
    tiles.push({ kind: "emoji", key: p.word, face: p.emoji, done: false });
    tiles.push({ kind: "word", key: p.word, face: p.word, done: false });
  });
  KZ.tiles = shuffle(tiles);
  stage().innerHTML = actHeader("🖼️", "Match Game") +
    '<p class="fine kz-center">Tap two cards that go together!</p>' +
    '<div class="kz-matchgrid" id="kzMatchGrid">' + KZ.tiles.map(function (t, i) {
      return '<button class="kz-tile" data-i="' + i + '"><span class="kz-tileback">❓</span></button>';
    }).join("") + "</div>" +
    '<p class="kz-msg" id="kzMsg"></p>';
  wireActBack();
  stage().querySelectorAll("[data-i]").forEach(function (b) {
    b.addEventListener("click", function () { matchTap(parseInt(b.getAttribute("data-i"), 10)); });
  });
  show("screen-kids");
}

function matchTap(i) {
  if (KZ.lock) return;
  const t = KZ.tiles[i];
  if (!t || t.done || t.open) return;
  t.open = true;
  paintTiles();
  speak(t.kind === "emoji" ? t.key : t.face);
  if (KZ.first === null) { KZ.first = i; return; }
  const a = KZ.tiles[KZ.first], b = t;
  KZ.lock = true;
  if (a.key === b.key && KZ.first !== i) {
    setTimeout(function () {
      a.done = b.done = true; a.open = b.open = false;
      KZ.first = null; KZ.lock = false; KZ.found++;
      sayPraise();
      if (KZ.found >= KZ.pairs.length) {
        const stars = KZ.misses <= 1 ? 3 : KZ.misses <= 4 ? 2 : 1;
        giveStars("picture", stars);
        const msg = $("kzMsg");
        if (msg) msg.textContent = "🎉 All matched! " + "⭐".repeat(stars);
        setTimeout(function () { renderPictureWords(); }, 2200);
      } else paintTiles();
    }, 900);
  } else {
    KZ.misses++;
    setTimeout(function () {
      a.open = b.open = false;
      KZ.first = null; KZ.lock = false;
      paintTiles();
      speak("Try again!");
    }, 900);
  }
}

function paintTiles() {
  const grid = $("kzMatchGrid");
  if (!grid) return;
  KZ.tiles.forEach(function (t, i) {
    const b = grid.querySelector('[data-i="' + i + '"]');
    if (!b) return;
    if (t.done) { b.className = "kz-tile done"; b.innerHTML = '<span class="kz-tileface">' + esc(t.face) + "</span>"; b.disabled = true; }
    else if (t.open) { b.className = "kz-tile open"; b.innerHTML = '<span class="kz-tileface">' + esc(t.face) + "</span>"; }
    else { b.className = "kz-tile"; b.innerHTML = '<span class="kz-tileback">❓</span>'; }
  });
}

/* ================= 👂 Listen & Tap ================= */

function renderListen() {
  KZ = { view: "listen", q: 0, correct: 0, total: 5 };
  nextListen();
}

function nextListen() {
  if (KZ.q >= KZ.total) {
    const stars = starsForScore(KZ.correct, KZ.total);
    giveStars("listen", stars);
    stage().innerHTML = actHeader("👂", "Listen & Tap") +
      '<div class="kz-endcard"><div class="kz-endemoji">' + (stars >= 3 ? "🏆" : stars === 2 ? "👏" : "💪") + "</div>" +
      "<h3>You got " + KZ.correct + " of " + KZ.total + "!</h3>" +
      '<p class="kz-stars-big">' + "⭐".repeat(stars) + "</p>" +
      '<div class="row-btns"><button class="btn-primary" id="kzAgain">Play again</button>' +
      '<button class="btn-ghost" id="kzDone">Kids Zone</button></div></div>';
    wireActBack();
    sayPraise();
    $("kzAgain").addEventListener("click", renderListen);
    $("kzDone").addEventListener("click", function () { stopSpeak(); showKidsHome(); });
    return;
  }
  const round = makeListenRound();
  KZ.q++;
  stage().innerHTML = actHeader("👂", "Listen & Tap") +
    '<p class="fine kz-center">Question ' + KZ.q + " of " + KZ.total + "</p>" +
    '<div class="kz-qcard"><button class="btn-primary btn-big" id="kzHearWord">🔊 Hear the word</button>' +
    '<div class="kz-optrow">' + round.choices.map(function (c) {
      return '<button class="kz-optbtn kz-bigemoji" data-w="' + esc(c.word) + '">' + c.emoji + "</button>";
    }).join("") + "</div>" +
    '<p class="kz-msg" id="kzMsg"></p></div>';
  wireActBack();
  const ask = function () { speakSlow("Tap the " + round.word + "."); };
  $("kzHearWord").addEventListener("click", ask);
  setTimeout(ask, 400);
  stage().querySelectorAll("[data-w]").forEach(function (b) {
    b.addEventListener("click", function () {
      const ok = b.getAttribute("data-w") === round.word;
      const msg = $("kzMsg");
      if (ok) {
        KZ.correct++;
        b.classList.add("right");
        msg.textContent = "⭐ Yes! That is the " + round.word + "!";
        sayPraise();
        setTimeout(nextListen, 1600);
      } else {
        b.classList.add("wrong");
        b.disabled = true;
        msg.textContent = "Listen again! 💪";
        speak("Try again! Tap the " + round.word + ".");
      }
    });
  });
  show("screen-kids");
}

/* ================= 🎵 Rhyme Time ================= */

function renderRhyme() {
  KZ = { view: "rhyme", q: 0, correct: 0, total: 5 };
  nextRhyme();
}

function nextRhyme() {
  if (KZ.q >= KZ.total) {
    const stars = starsForScore(KZ.correct, KZ.total);
    giveStars("rhyme", stars);
    stage().innerHTML = actHeader("🎵", "Rhyme Time") +
      '<div class="kz-endcard"><div class="kz-endemoji">' + (stars >= 3 ? "🏆" : stars === 2 ? "👏" : "💪") + "</div>" +
      "<h3>You got " + KZ.correct + " of " + KZ.total + "!</h3>" +
      '<p class="kz-stars-big">' + "⭐".repeat(stars) + "</p>" +
      '<div class="row-btns"><button class="btn-primary" id="kzAgain">Play again</button>' +
      '<button class="btn-ghost" id="kzDone">Kids Zone</button></div></div>';
    wireActBack();
    sayPraise();
    $("kzAgain").addEventListener("click", renderRhyme);
    $("kzDone").addEventListener("click", function () { stopSpeak(); showKidsHome(); });
    return;
  }
  const round = makeRhymeRound();
  KZ.q++;
  stage().innerHTML = actHeader("🎵", "Rhyme Time") +
    '<p class="fine kz-center">Question ' + KZ.q + " of " + KZ.total + "</p>" +
    '<div class="kz-qcard"><h3 class="kz-bigq">Which word rhymes with <span class="kz-hl">“' + esc(round.target) + "”</span>?</h3>" +
    '<button class="btn-ghost btn-sm" id="kzHearT">🔊 Hear “' + esc(round.target) + '”</button>' +
    '<div class="kz-optrow">' + round.choices.map(function (w) {
      return '<button class="kz-optbtn kz-wordbtn" data-w="' + esc(w) + '">' + esc(w) + "</button>";
    }).join("") + "</div>" +
    '<p class="kz-msg" id="kzMsg"></p></div>';
  wireActBack();
  $("kzHearT").addEventListener("click", function () { speakSlow(round.target); });
  setTimeout(function () { speakSlow("Which word rhymes with " + round.target + "?"); }, 400);
  stage().querySelectorAll("[data-w]").forEach(function (b) {
    b.addEventListener("click", function () {
      const w = b.getAttribute("data-w");
      speak(w); // let the child hear the tapped word first
      const msg = $("kzMsg");
      setTimeout(function () {
        if (w === round.answer) {
          KZ.correct++;
          b.classList.add("right");
          msg.textContent = "⭐ Yes! " + round.target + " and " + round.answer + " rhyme!";
          sayPraise();
          setTimeout(nextRhyme, 1800);
        } else {
          b.classList.add("wrong");
          b.disabled = true;
          msg.textContent = "Try again! 💪";
          speak("Try again!");
        }
      }, 650);
    });
  });
  show("screen-kids");
}

/* ================= 📖 Story Time ================= */

function renderStories() {
  KZ = { view: "stories" };
  stage().innerHTML = actHeader("📖", "Story Time") +
    '<p class="fine kz-center">Pick a story to listen to!</p>' +
    '<div class="kz-grid">' + KIDS_STORIES.map(function (s) {
      return '<button class="kz-btn" data-story="' + s.id + '">' +
        '<span class="kz-btnemoji">' + s.emoji + "</span>" +
        '<span class="kz-btnlabel">' + esc(s.title) + "</span>" +
        '<span class="kz-btndesc">' + s.pages.length + " little pages</span></button>";
    }).join("") + "</div>";
  wireActBack();
  stage().querySelectorAll("[data-story]").forEach(function (b) {
    b.addEventListener("click", function () {
      const s = KIDS_STORIES.find(function (x) { return x.id === b.getAttribute("data-story"); });
      if (s) { speak(s.title); storyPlayer(s); }
    });
  });
  show("screen-kids");
}

function storyPlayer(story) {
  KZ = { view: "story", story: story, page: 0, finished: {} };
  drawStoryPage();
}

function wordsHtml(text) {
  return String(text).split(/\s+/).map(function (w, i) {
    return '<span class="kw-w" data-i="' + i + '">' + esc(w) + "</span>";
  }).join(" ");
}

function drawStoryPage() {
  const st = KZ.story, i = KZ.page, p = st.pages[i];
  stage().innerHTML = actHeader("📖", st.title) +
    '<p class="fine kz-center">Page ' + (i + 1) + " of " + st.pages.length + "</p>" +
    '<div class="kz-scene">' + svgScene(p.art) + "</div>" +
    '<div class="kz-storytext" id="kzStoryText">' + wordsHtml(p.text) + "</div>" +
    '<div class="row-btns kz-storybtns">' +
    '<button class="btn-ghost" id="kzPrev"' + (i === 0 ? " disabled" : "") + ">← Back</button>" +
    '<button class="btn-primary" id="kzReplay">🔊 Read to me</button>' +
    (i < st.pages.length - 1
      ? '<button class="btn-primary" id="kzNext">Next →</button>'
      : '<button class="btn-primary" id="kzFinish">Finish 🎉</button>') +
    "</div>";
  wireActBack();
  if (i > 0) $("kzPrev").addEventListener("click", function () {
    stopSpeak(); KZ.page = clampPage(KZ.page - 1, st.pages.length); drawStoryPage();
  });
  $("kzReplay").addEventListener("click", playPageNarration);
  const nx = $("kzNext");
  if (nx) nx.addEventListener("click", function () {
    stopSpeak(); KZ.page = clampPage(KZ.page + 1, st.pages.length); drawStoryPage();
  });
  const fin = $("kzFinish");
  if (fin) fin.addEventListener("click", function () {
    stopSpeak();
    giveStars("story", 3);
    stage().innerHTML = actHeader("📖", st.title) +
      '<div class="kz-endcard"><div class="kz-endemoji">🎉</div>' +
      "<h3>The End!</h3><p>You finished “" + esc(st.title) + "”!</p>" +
      '<p class="kz-stars-big">⭐⭐⭐</p>' +
      '<div class="row-btns"><button class="btn-primary" id="kzAgain">Read again</button>' +
      '<button class="btn-ghost" id="kzDone">Stories</button></div></div>';
    wireActBack();
    sayPraise();
    $("kzAgain").addEventListener("click", function () { storyPlayer(st); });
    $("kzDone").addEventListener("click", function () { stopSpeak(); renderStories(); });
  });
  show("screen-kids");
  setTimeout(playPageNarration, 500); // auto-narrate each page
}

function playPageNarration() {
  const p = KZ.story.pages[KZ.page];
  clearWordHL();
  speak(p.text, {
    rate: 0.85,
    onword: function (e) { hlWord(wordIndexAt(p.text, e.charIndex)); },
    onend: function () { clearWordHL(); }
  });
}

function hlWord(i) {
  const box = $("kzStoryText");
  if (!box) return;
  const spans = box.querySelectorAll(".kw-w");
  spans.forEach(function (s) { s.classList.remove("on"); });
  const el = box.querySelector('[data-i="' + i + '"]');
  if (el) el.classList.add("on");
}

function clearWordHL() {
  const box = $("kzStoryText");
  if (!box) return;
  box.querySelectorAll(".kw-w.on").forEach(function (s) { s.classList.remove("on"); });
}

/* ================= 🎬 Watch ================= */

function renderWatch() {
  KZ = { view: "watch" };
  stage().innerHTML = actHeader("🎬", "Watch") +
    '<p class="fine kz-center">Watch and learn!</p>' +
    '<div class="kz-videos">' + KID_VIDEOS.map(function (v) {
      return '<div class="kz-videocard" data-vid="' + v.id + '">' +
        "<h4>" + esc(v.title) + "</h4>" +
        '<div class="kz-videowrap"><video controls preload="none" playsinline src="' + esc(v.src) + '">' +
        "Your browser cannot play this video.</video></div></div>";
    }).join("") + "</div>";
  wireActBack();
  KID_VIDEOS.forEach(function (v) {
    const card = stage().querySelector('[data-vid="' + v.id + '"]');
    if (!card) return;
    const video = card.querySelector("video");
    const missing = function () {
      const wrap = card.querySelector(".kz-videowrap");
      if (wrap) wrap.innerHTML = '<div class="kz-videosoon">🎬<br>Video coming soon!</div>';
    };
    video.addEventListener("error", missing);
    video.addEventListener("ended", function () {
      giveStars("watch", 2);
      sayPraise();
    });
    // If the file 404s before error fires reliably, probe once:
    setTimeout(function () {
      if (video.readyState === 0 && video.networkState === 3) missing();
    }, 4000);
  });
  show("screen-kids");
}
