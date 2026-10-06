// LinguaBuddy — 🖨️ Worksheets & Resources (printable worksheets for all ages).
// Pure worksheet builders (node-testable) + library/builder UI + printing.
// Offline-first: no external fetches. DOM is touched only inside functions,
// so importing this module in node has no side effects.

import { WORDS } from "../data/words.js";
import { SLOS } from "../data/slos.js";
import { STORIES } from "../data/stories.js";
import { mulberry32, hashStr, shuffle, sample, esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { S } from "./store.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setWorksheetsGo(fn) { go = fn; }

/* ================= constants ================= */

export const AGE_GROUPS = ["🧒 Kids", "🧑 Juniors", "🎓 Teens+"];

export const WS_TYPES = [
  { id: "trace", emoji: "✏️", title: "Letter Tracing" },
  { id: "match", emoji: "🔗", title: "Word–Picture Match" },
  { id: "fill", emoji: "📝", title: "Fill in the Blanks" },
  { id: "wordsearch", emoji: "🔍", title: "Word Search" },
  { id: "scramble", emoji: "✂️", title: "Sentence Scramble" },
  { id: "reading", emoji: "📖", title: "Reading Comprehension" },
  { id: "color", emoji: "🎨", title: "Color & Trace Words" }
];

export function typeOf(id) { return WS_TYPES.find(function (t) { return t.id === id; }); }

/* Small curated emoji map for the vocabulary bank (kids' worksheets). */
const WORD_EMOJI = {
  brave: "🦁", ancient: "🏛️", generous: "🎁", victory: "🏆", honest: "🤝",
  enormous: "🐘", rapid: "⚡", wealthy: "💰", expand: "🎈", polite: "🙏",
  difficult: "🧩", calm: "😌", clever: "🦊", patient: "⏳", grateful: "🙏",
  curious: "🔍", fragile: "🥚", vivid: "🌈", humble: "🙇", fierce: "🐯",
  precious: "💎", diligent: "📚", sincere: "❤️", eager: "🏃"
};
export function emojiOf(word) { return WORD_EMOJI[String(word).toLowerCase()] || "⭐"; }

/* ================= pure helpers ================= */

function seedRand(seed) {
  return mulberry32(typeof seed === "number" ? seed : hashStr(String(seed == null ? 1 : seed)));
}

function sloById(id) { return SLOS.find(function (s) { return s.id === id; }); }

/** mcq/fib bank items whose question contains a blank. */
export function blankItems(sloIds, n, rand) {
  const pool = [];
  (sloIds || []).forEach(function (id) {
    const slo = sloById(id);
    if (!slo) return;
    slo.questions.forEach(function (q) {
      if ((q.t === "mcq" || q.t === "fib") && q.q.indexOf("___") >= 0) {
        pool.push({ q: q.q, o: q.o || q.a, a: q.a, t: q.t });
      }
    });
  });
  return sample(pool, n == null ? 10 : n, rand);
}

/** reorder-type bank items (cut-apart sentence strips). */
export function reorderItems(sloIds, n, rand) {
  const pool = [];
  (sloIds || []).forEach(function (id) {
    const slo = sloById(id);
    if (!slo) return;
    slo.questions.forEach(function (q) {
      if (q.t === "reorder" && q.w && q.a) pool.push({ w: q.w, a: q.a });
    });
  });
  return sample(pool, n == null ? 8 : n, rand);
}

/* ================= worksheet chrome (print-friendly html) ================= */

function wsHead(title, subtitle) {
  return '<div style="font-family:Georgia,\'Times New Roman\',serif;color:#111;max-width:720px;">' +
    '<h1 style="font-size:26px;margin:0 0 4px;">' + esc(title) + '</h1>' +
    '<p style="color:#444;margin:0 0 12px;font-size:14px;">' + esc(subtitle || "") + '</p>' +
    '<p style="margin:0 0 16px;font-size:14px;">Name: ________________________&nbsp;&nbsp;&nbsp;Date: ______________</p>';
}
function wsFoot() {
  return '<p style="margin-top:28px;color:#555;font-size:12px;">🦉 LinguaBuddy Worksheets — practice makes progress!</p></div>';
}
/** n dotted handwriting lines. */
export function writeLines(n, h) {
  h = h || 34;
  let s = "";
  for (let i = 0; i < n; i++) {
    s += '<div style="border-bottom:2px dotted #999;height:' + h + 'px;"></div>';
  }
  return s;
}

/* ================= 1. letter tracing ================= */

/** items: array of strings (letters or short words) to trace. */
export function traceLetters(items, opts) {
  opts = opts || {};
  if (typeof items === "string") items = items.split(" ");
  items = (items && items.length ? items : ["A", "B", "C", "D", "E", "F"])
    .map(function (x) { return String(x); }).filter(Boolean);
  const perRow = opts.perRow || 4;
  let rows = "";
  for (let i = 0; i < items.length; i += perRow) {
    const cells = items.slice(i, i + perRow).map(function (it) {
      return '<div style="flex:1;text-align:center;">' +
        '<div style="font-size:96px;line-height:1.2;color:#d9d9d9;font-family:\'Comic Sans MS\',cursive;border-bottom:4px dotted #aaa;">' +
        esc(it) + '</div>' +
        '<div style="font-size:12px;color:#888;margin-top:4px;">trace me ✏️</div></div>';
    }).join("");
    rows += '<div style="display:flex;gap:16px;margin-bottom:28px;">' + cells + '</div>';
  }
  const html = wsHead(opts.title || "Trace the Letters ✏️",
      "Trace each letter with your pencil. Stay on the pale letters!") +
    rows + wsFoot();
  return {
    title: opts.title || "Trace the Letters ✏️",
    ageGroup: opts.ageGroup || "🧒 Kids",
    html: html,
    answerKey: "No answers — tracing practice. Praise neat work! 🌟"
  };
}

/* ================= 2. word–picture match ================= */

/** pairs: [{word, emoji}]. Defaults to 8 seeded vocabulary words. */
export function matchWords(pairs, opts) {
  opts = opts || {};
  const rand = seedRand(opts.seed == null ? 5 : opts.seed);
  pairs = pairs || sample(WORDS, 8, rand).map(function (w) {
    return { word: w.word, emoji: emojiOf(w.word) };
  });
  const left = pairs.map(function (p, i) {
    return '<div class="ws-item" style="margin-bottom:14px;font-size:20px;"><b>' + (i + 1) + '.</b> ' + esc(p.word) + '</div>';
  }).join("");
  const shuffled = shuffle(pairs.slice(), rand);
  // answer key: number → letter (left index → position in shuffled right column)
  const key = pairs.map(function (p, i) {
    const li = shuffled.findIndex(function (s) { return s.word === p.word; });
    return (i + 1) + "–" + String.fromCharCode(97 + li);
  }).join(", ");
  const html = wsHead(opts.title || "Match the Words 🔗",
      "Draw a line from each word to the picture that matches it.") +
    '<div style="display:flex;gap:48px;">' +
    '<div style="flex:1;">' + left + '</div>' +
    '<div style="flex:1;">' + shuffled.map(function (p, i) {
      return '<div class="ws-item" style="margin-bottom:14px;font-size:20px;"><b>' +
        String.fromCharCode(97 + i) + '.</b> <span style="font-size:28px;">' + esc(p.emoji) + '</span></div>';
    }).join("") + '</div></div>' + wsFoot();
  return {
    title: opts.title || "Match the Words 🔗",
    ageGroup: opts.ageGroup || "🧒 Kids",
    html: html,
    answerKey: key
  };
}

/* ================= 3. fill in the blanks ================= */

/** From real SLO bank items (articles, prepositions, simple tenses…). */
export function fillBlanks(sloIds, n, opts) {
  opts = opts || {};
  const rand = seedRand(opts.seed == null ? 11 : opts.seed);
  const ids = sloIds && sloIds.length ? sloIds : ["articles", "prepositions", "tenses"];
  const items = blankItems(ids, n == null ? 10 : n, rand);
  const bank = [];
  const body = items.map(function (it, i) {
    const optsList = Array.isArray(it.o) ? it.o : [it.o];
    optsList.forEach(function (o) { if (bank.indexOf(String(o)) < 0) bank.push(String(o)); });
    const sentence = esc(it.q).replace(/___/g,
      '<span style="display:inline-block;min-width:90px;border-bottom:2px solid #333;">&nbsp;</span>');
    return '<div class="ws-item" style="margin-bottom:16px;font-size:17px;line-height:2;"><b>' +
      (i + 1) + '.</b> ' + sentence + '</div>';
  }).join("");
  const answers = items.map(function (it, i) {
    const ans = Array.isArray(it.a) ? it.a[0] : (typeof it.a === "number" ? it.o[it.a] : it.a);
    return (i + 1) + ". " + ans;
  }).join(", ");
  const html = wsHead(opts.title || "Fill in the Blanks 📝",
      "Choose the correct word from the Word Bank for each blank.") +
    '<div style="border:2px dashed #888;padding:10px 14px;margin-bottom:18px;font-size:15px;">' +
    '<b>Word Bank:</b> ' + esc(shuffle(bank, rand).join("  •  ")) + '</div>' +
    body + wsFoot();
  return {
    title: opts.title || "Fill in the Blanks 📝",
    ageGroup: opts.ageGroup || "🧑 Juniors",
    html: html,
    answerKey: answers
  };
}

/* ================= 4. word search (seeded) ================= */

/** Seeded word-search generator. Words placed →, ↓ or ↘. Pure + deterministic. */
export function makeWordSearch(words, seed, size) {
  size = size || 12;
  const rand = seedRand(seed == null ? 7 : seed);
  const clean = (words || []).map(function (w) {
    return String(w).toUpperCase().replace(/[^A-Z]/g, "");
  }).filter(function (w) { return w.length >= 3 && w.length <= size; });
  const grid = [];
  for (let r = 0; r < size; r++) { grid.push(new Array(size).fill("")); }
  const dirs = [[0, 1], [1, 0], [1, 1]];
  const dirName = function (d) { return d[0] === 0 ? "→" : (d[1] === 0 ? "↓" : "↘"); };
  const placements = [];
  clean.forEach(function (word) {
    for (let attempt = 0; attempt < 300; attempt++) {
      const d = dirs[Math.floor(rand() * 3)];
      const r = Math.floor(rand() * size), c = Math.floor(rand() * size);
      const er = r + d[0] * (word.length - 1), ec = c + d[1] * (word.length - 1);
      if (er >= size || ec >= size) continue;
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const cell = grid[r + d[0] * i][c + d[1] * i];
        if (cell && cell !== word[i]) { fits = false; break; }
      }
      if (!fits) continue;
      for (let i = 0; i < word.length; i++) grid[r + d[0] * i][c + d[1] * i] = word[i];
      placements.push({ word: word, row: r, col: c, dr: d[0], dc: d[1] });
      break;
    }
  });
  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = ABC[Math.floor(rand() * 26)];
    }
  }
  const rows = grid.map(function (row) {
    return "<tr>" + row.map(function (ch) {
      return '<td style="border:1px solid #999;width:26px;height:26px;text-align:center;' +
        'font-family:monospace;font-size:16px;">' + ch + "</td>";
    }).join("") + "</tr>";
  }).join("");
  const list = placements.map(function (p) { return "<li>" + esc(p.word) + "</li>"; }).join("");
  const key = placements.map(function (p) {
    return p.word + " — row " + (p.row + 1) + ", col " + (p.col + 1) + " " + dirName([p.dr, p.dc]);
  }).join("; ");
  const html = wsHead("Word Search 🔍", "Find these hidden words → ↓ ↘. Circle each one!") +
    '<table style="border-collapse:collapse;margin:8px 0 16px;">' + rows + "</table>" +
    '<div style="font-size:16px;"><b>Find:</b><ul>' + list + "</ul></div>" + wsFoot();
  return {
    title: "Word Search 🔍",
    ageGroup: "🧑 Juniors",
    html: html,
    answerKey: key,
    grid: grid,
    placements: placements
  };
}

/** words: array of strings. opts: {seed, size, ageGroup}. */
export function wordSearch(words, opts) {
  opts = opts || {};
  const rand = seedRand(opts.seed == null ? 7 : opts.seed);
  const ws = makeWordSearch(
    words || sample(WORDS, 10, rand).map(function (w) { return w.word; }),
    opts.seed == null ? 7 : opts.seed,
    opts.size || 12
  );
  ws.ageGroup = opts.ageGroup || "🧑 Juniors";
  return ws;
}

/* ================= 5. sentence scramble (cut-apart strips) ================= */

/** items: [{w:[words], a:answer}] from reorder bank items. */
export function sentenceScramble(items, opts) {
  opts = opts || {};
  const rand = seedRand(opts.seed == null ? 13 : opts.seed);
  items = items || reorderItems(["tenses", "sva", "voice", "speech"], 8, rand);
  const body = items.map(function (it, i) {
    const strips = shuffle(it.w.slice(), rand).map(function (w) {
      return '<span style="display:inline-block;border:2px dashed #666;padding:6px 10px;margin:4px;font-size:16px;">' +
        esc(w) + "</span>";
    }).join("");
    return '<div class="ws-item" style="margin-bottom:20px;"><b>' + (i + 1) + '.</b> ' +
      '<span style="font-size:14px;color:#555;">✂️ cut apart, then glue in order:</span><br>' + strips +
      writeLines(1, 30) + "</div>";
  }).join("");
  const answers = items.map(function (it, i) { return (i + 1) + ". " + it.a; }).join("; ");
  const html = wsHead(opts.title || "Sentence Scramble ✂️",
      "Cut out the word strips and arrange them into a correct sentence. Write it on the line.") +
    body + wsFoot();
  return {
    title: opts.title || "Sentence Scramble ✂️",
    ageGroup: opts.ageGroup || "🧑 Juniors",
    html: html,
    answerKey: answers
  };
}

/* ================= 6. reading comprehension ================= */

/** story: a STORIES entry. Questions become open-ended with writing lines. */
export function readingComprehension(story, opts) {
  opts = opts || {};
  story = story || STORIES[0];
  const paras = String(story.text).split("\n\n").map(function (p) {
    return '<p style="font-size:16px;line-height:1.7;margin:0 0 12px;">' + esc(p) + "</p>";
  }).join("");
  const body = (story.quiz || []).map(function (q, i) {
    return '<div class="ws-item" style="margin-bottom:18px;"><b>' + (i + 1) + ".</b> " +
      '<span style="font-size:16px;">' + esc(q.q) + "</span>" + writeLines(2, 30) + "</div>";
  }).join("");
  const answers = (story.quiz || []).map(function (q, i) {
    return (i + 1) + ". " + q.o[q.a];
  }).join("; ");
  const html = wsHead("📖 " + story.title,
      "Read the story carefully, then answer the questions in your own words.") +
    paras + '<h3 style="margin:20px 0 10px;">Questions</h3>' + body + wsFoot();
  return {
    title: "📖 " + story.title,
    ageGroup: opts.ageGroup || "🧑 Juniors",
    html: html,
    answerKey: answers
  };
}

/* ================= 7. color & trace vocabulary ================= */

/** pairs: [{word, emoji}]. Big emoji to color + pale word to trace. */
export function coloringVocab(pairs, opts) {
  opts = opts || {};
  const rand = seedRand(opts.seed == null ? 17 : opts.seed);
  pairs = pairs || sample(WORDS, 6, rand).map(function (w) {
    return { word: w.word, emoji: emojiOf(w.word) };
  });
  const body = pairs.map(function (p, i) {
    return '<div class="ws-item" style="margin-bottom:26px;text-align:center;">' +
      '<div style="font-size:20px;margin-bottom:6px;"><b>' + (i + 1) + ".</b></div>" +
      '<div style="font-size:110px;line-height:1.2;">' + esc(p.emoji) + "</div>" +
      '<div style="font-size:14px;color:#888;margin:6px 0;">color the picture 🎨</div>' +
      '<div style="font-size:64px;color:#d9d9d9;font-family:\'Comic Sans MS\',cursive;' +
      'border-bottom:4px dotted #aaa;display:inline-block;padding:0 24px;">' + esc(p.word) + "</div>" +
      '<div style="font-size:12px;color:#888;margin-top:4px;">trace the word, then write it yourself:</div>' +
      writeLines(1, 36) + "</div>";
  }).join("");
  const html = wsHead(opts.title || "Color & Trace 🎨",
      "Color each picture, trace the word, then write it on the line.") +
    body + wsFoot();
  return {
    title: opts.title || "Color & Trace 🎨",
    ageGroup: opts.ageGroup || "🧒 Kids",
    html: html,
    answerKey: "No answers — coloring and tracing practice. 🖍️"
  };
}

/* ================= dispatcher ================= */

/** Build one worksheet by type id. opts: {ageGroup, seed, items}. */
export function makeWorksheet(typeId, opts) {
  opts = opts || {};
  const ageGroup = opts.ageGroup || "🧒 Kids";
  const seed = opts.seed == null ? 1 : opts.seed;
  const items = opts.items || {};
  switch (typeId) {
    case "trace":
      return traceLetters(
        (items.trace || "A B C D E F G H").split(" "),
        { ageGroup: ageGroup, perRow: 4 });
    case "match":
      return matchWords(null, { ageGroup: ageGroup, seed: seed });
    case "fill": {
      const ids = ageGroup === "🧒 Kids" ? ["articles"] :
        (ageGroup === "🧑 Juniors" ? ["articles", "prepositions"] :
          ["articles", "prepositions", "tenses", "sva"]);
      return fillBlanks(ids, items.fill || 8, { ageGroup: ageGroup, seed: seed });
    }
    case "wordsearch": {
      const rand = seedRand(seed);
      const words = sample(WORDS, items.wordsearch || 10, rand).map(function (w) { return w.word; });
      return wordSearch(words, { ageGroup: ageGroup, seed: seed, size: ageGroup === "🧒 Kids" ? 10 : 12 });
    }
    case "scramble":
      return sentenceScramble(null, { ageGroup: ageGroup, seed: seed });
    case "reading": {
      const easy = STORIES.filter(function (s) { return s.difficulty === "Easy"; });
      const pool = ageGroup === "🎓 Teens+" ? STORIES : (easy.length ? easy : STORIES);
      const story = sample(pool, 1, seedRand(seed))[0] || STORIES[0];
      return readingComprehension(story, { ageGroup: ageGroup });
    }
    case "color":
      return coloringVocab(null, { ageGroup: ageGroup, seed: seed });
    default:
      return traceLetters(["A", "B", "C"], { ageGroup: ageGroup });
  }
}

/* ================= teacher pack builder (pure) ================= */

/**
 * config: {ageGroup, types:[typeIds], items:{typeId:count}, seed}
 * Returns a combined multi-page worksheet pack.
 */
export function buildPack(config) {
  config = config || {};
  const ageGroup = config.ageGroup || "🧒 Kids";
  const types = (config.types && config.types.length ? config.types : ["trace", "match", "fill", "wordsearch"])
    .filter(function (t) { return !!typeOf(t); });
  const seed = config.seed == null ? 1 : config.seed;
  const items = config.items || {};
  const sections = [];
  const keys = [];
  types.forEach(function (t, ti) {
    const ws = makeWorksheet(t, { ageGroup: ageGroup, seed: seed + ti * 101, items: items });
    sections.push('<div class="ws-page"' + (ti ? ' style="page-break-before:always;"' : "") +
      ">" + ws.html + "</div>");
    keys.push("<b>" + esc(ws.title) + ":</b> " + esc(ws.answerKey));
  });
  const html = '<div style="font-family:Georgia,serif;color:#111;max-width:720px;">' +
    "<h1>📦 My Worksheet Pack</h1>" +
    '<p style="color:#555;">' + esc(ageGroup) + " • " + types.length + " worksheets • " +
    new Date().toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) + "</p>" +
    '<p style="margin:0 0 16px;">Name: ________________________&nbsp;&nbsp;&nbsp;Class: __________</p>' +
    sections.join("") + "</div>";
  return {
    title: "📦 My Worksheet Pack (" + types.length + " worksheets)",
    ageGroup: ageGroup,
    html: html,
    answerKey: keys.join("<br><br>")
  };
}

/* ================= certificates ================= */

/** Printable Certificate of Achievement. Pure. */
export function certificate(name, achievement, dateStr, opts) {
  opts = opts || {};
  name = String(name == null || name === "" ? "________________" : name);
  achievement = String(achievement || "great effort in learning English");
  dateStr = String(dateStr || new Date().toLocaleDateString("en-PK",
    { day: "numeric", month: "long", year: "numeric" }));
  const studentId = String(opts.studentId || "").trim();
  const lacking = (opts.lackingAreas || []).filter(Boolean);
  const html =
    '<div style="font-family:Georgia,serif;color:#111;max-width:720px;text-align:center;' +
    'border:8px double #b8860b;padding:48px 32px;margin:8px;">' +
    '<div style="font-size:64px;">🦉</div>' +
    '<h1 style="font-size:36px;margin:8px 0;letter-spacing:2px;">Certificate of Achievement</h1>' +
    '<p style="font-size:16px;color:#555;">This certificate is proudly presented to</p>' +
    '<div style="font-size:32px;font-weight:bold;border-bottom:2px solid #333;' +
    'display:inline-block;padding:4px 32px;margin:8px 0;">' + esc(name) + "</div>" +
    (studentId ? '<p style="font-size:15px;color:#555;margin:4px 0;">Student ID: <strong>' + esc(studentId) + "</strong></p>" : "") +
    "<p>for</p>" +
    '<div style="font-size:20px;font-style:italic;margin:8px 0;">' + esc(achievement) + "</div>" +
    (lacking.length
      ? '<div style="margin:16px auto;max-width:520px;text-align:left;background:#fff8e1;' +
        'border:1px solid #e0c36a;border-radius:8px;padding:12px 16px;">' +
        '<p style="margin:0 0 6px;font-weight:bold;font-size:15px;">📋 Areas to keep working on:</p>' +
        '<ul style="margin:0;padding-left:20px;font-size:14px;">' +
        lacking.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") +
        "</ul></div>"
      : "") +
    '<p style="color:#555;">' + esc(dateStr) + "</p>" +
    '<div style="display:flex;justify-content:space-around;margin-top:56px;">' +
    '<div style="border-top:2px solid #333;width:200px;padding-top:6px;font-size:14px;">Teacher</div>' +
    '<div style="border-top:2px solid #333;width:200px;padding-top:6px;font-size:14px;">Parent</div>' +
    "</div></div>";
  return { title: "Certificate of Achievement 🦉", ageGroup: "All ages", html: html, answerKey: "" };
}

/* ================= curated library ================= */

export const WORKSHEET_DEFS = [
  { id: "trace-abc", type: "trace", ageGroup: "🧒 Kids", emoji: "✏️", title: "Trace the Alphabet",
    desc: "Giant pale A–Z letters to trace with a pencil.",
    make: function () { return traceLetters("A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" "), { ageGroup: "🧒 Kids", perRow: 4 }); } },
  { id: "trace-words", type: "trace", ageGroup: "🧒 Kids", emoji: "🐱", title: "Trace Fun Words",
    desc: "Trace easy words: cat, dog, sun, bus…",
    make: function () { return traceLetters(["cat", "dog", "sun", "bus", "egg", "fish", "hat", "pen"], { ageGroup: "🧒 Kids", perRow: 2, title: "Trace Fun Words 🐱" }); } },
  { id: "color-words", type: "color", ageGroup: "🧒 Kids", emoji: "🎨", title: "Color & Trace Words",
    desc: "Color the picture, trace the word, write it.",
    make: function () { return coloringVocab(null, { ageGroup: "🧒 Kids", seed: 21 }); } },
  { id: "match-pic", type: "match", ageGroup: "🧒 Kids", emoji: "🔗", title: "Match Word to Picture",
    desc: "Draw lines from words to matching pictures.",
    make: function () { return matchWords(null, { ageGroup: "🧒 Kids", seed: 22 }); } },
  { id: "ws-easy", type: "wordsearch", ageGroup: "🧒 Kids", emoji: "🔍", title: "Easy Word Search",
    desc: "Find 8 hidden words in a 10×10 grid.",
    make: function () {
      const rand = seedRand(23);
      const words = sample(WORDS, 8, rand).map(function (w) { return w.word; });
      return wordSearch(words, { ageGroup: "🧒 Kids", seed: 23, size: 10 });
    } },
  { id: "fill-articles", type: "fill", ageGroup: "🧑 Juniors", emoji: "📝", title: "Articles: a, an, the",
    desc: "10 fill-in-the-blank questions from the Articles bank.",
    make: function () { return fillBlanks(["articles"], 10, { ageGroup: "🧑 Juniors", seed: 31, title: "Articles: a, an, the 📝" }); } },
  { id: "fill-prep", type: "fill", ageGroup: "🧑 Juniors", emoji: "📝", title: "Prepositions Practice",
    desc: "10 fill-in-the-blank questions from the Prepositions bank.",
    make: function () { return fillBlanks(["prepositions"], 10, { ageGroup: "🧑 Juniors", seed: 32, title: "Prepositions Practice 📝" }); } },
  { id: "scramble-jr", type: "scramble", ageGroup: "🧑 Juniors", emoji: "✂️", title: "Sentence Scramble",
    desc: "Cut-apart word strips to arrange into sentences.",
    make: function () { return sentenceScramble(null, { ageGroup: "🧑 Juniors", seed: 33 }); } },
  { id: "read-crow", type: "reading", ageGroup: "🧑 Juniors", emoji: "📖", title: "The Thirsty Crow",
    desc: "Read the story and answer 5 questions in writing.",
    make: function () {
      const s = STORIES.find(function (x) { return x.id === "thirsty-crow"; }) || STORIES[0];
      return readingComprehension(s, { ageGroup: "🧑 Juniors" });
    } },
  { id: "ws-hard", type: "wordsearch", ageGroup: "🎓 Teens+", emoji: "🔍", title: "Challenge Word Search",
    desc: "14 longer words hidden in a 12×12 grid.",
    make: function () {
      const rand = seedRand(41);
      const words = sample(WORDS, 14, rand).map(function (w) { return w.word; });
      return wordSearch(words, { ageGroup: "🎓 Teens+", seed: 41, size: 12 });
    } },
  { id: "fill-grammar", type: "fill", ageGroup: "🎓 Teens+", emoji: "📝", title: "Grammar Mixed Bag",
    desc: "12 blanks across tenses, verbs and articles.",
    make: function () { return fillBlanks(["tenses", "sva", "articles", "voice"], 12, { ageGroup: "🎓 Teens+", seed: 42, title: "Grammar Mixed Bag 📝" }); } },
  { id: "read-wolf", type: "reading", ageGroup: "🎓 Teens+", emoji: "📖", title: "The Boy Who Cried Wolf",
    desc: "Longer story + 5 written answers.",
    make: function () {
      const s = STORIES.find(function (x) { return x.id === "boy-wolf"; }) || STORIES[0];
      return readingComprehension(s, { ageGroup: "🎓 Teens+" });
    } }
];

export function defById(id) { return WORKSHEET_DEFS.find(function (d) { return d.id === id; }); }

/* ================= printing ================= */

/** Render html into #print-area and open the print dialog. */
export function printHTML(html) {
  const area = $("print-area");
  if (area) area.innerHTML = html;
  if (typeof window !== "undefined" && typeof window.print === "function") window.print();
}
export function printWorksheetById(id) {
  const def = defById(id);
  if (def) printHTML(def.make().html);
}

/* ================= library + builder + certificates UI ================= */

const chipStyle = "display:inline-block;padding:8px 14px;margin:4px;border-radius:999px;border:2px solid #1e3a8a;" +
  "background:#fff;color:#1e3a8a;font-size:14px;cursor:pointer;";
const chipOn = "background:#1e3a8a;color:#fff;";
const cardStyle = "border:2px solid #e5d9c3;border-radius:14px;background:#fffdf7;padding:14px;margin:8px;" +
  "flex:1 1 220px;max-width:320px;box-shadow:0 2px 6px rgba(0,0,0,.06);";
const btnPri = "background:#1e3a8a;color:#fff;border:none;border-radius:10px;padding:10px 14px;" +
  "font-size:15px;cursor:pointer;margin:4px 4px 0 0;";
const btnSec = "background:#fff;border:2px solid #1e3a8a;color:#1e3a8a;border-radius:10px;padding:8px 12px;" +
  "font-size:14px;cursor:pointer;margin:4px 4px 0 0;";

let ageFilter = "All";
let typeFilter = "All";
let previewId = null;

function cardHTML(def) {
  const t = typeOf(def.type);
  return '<div style="' + cardStyle + '">' +
    '<div style="font-size:34px;">' + def.emoji + "</div>" +
    '<div style="font-weight:bold;font-size:16px;margin:6px 0;">' + esc(def.title) + "</div>" +
    '<div style="font-size:13px;color:#666;margin-bottom:6px;">' + esc(def.desc) + "</div>" +
    '<div style="margin-bottom:8px;"><span style="font-size:12px;background:#fef3c7;border-radius:999px;' +
    'padding:3px 10px;">' + esc(def.ageGroup) + '</span> <span style="font-size:12px;color:#888;">' +
    esc(t ? t.title : def.type) + "</span></div>" +
    '<button style="' + btnSec + '" data-preview="' + def.id + '">' +
    (previewId === def.id ? "Hide preview" : "👁️ Preview") + "</button>" +
    '<button style="' + btnPri + '" data-printws="' + def.id + '">🖨️ Print</button>' +
    (previewId === def.id ?
      '<div style="margin-top:10px;max-height:260px;overflow:hidden;border:1px dashed #ccc;' +
      'border-radius:8px;padding:8px;transform:scale(.92);transform-origin:top left;">' +
      def.make().html + "</div>" : "") +
    "</div>";
}

function renderLibrary() {
  const host = $("wsLibGrid");
  if (!host) return;
  const defs = WORKSHEET_DEFS.filter(function (d) {
    return (ageFilter === "All" || d.ageGroup === ageFilter) &&
           (typeFilter === "All" || d.type === typeFilter);
  });
  host.innerHTML = defs.length
    ? defs.map(cardHTML).join("")
    : '<p style="padding:16px;">No worksheets match these filters. Try “All”.</p>';
  host.querySelectorAll("[data-printws]").forEach(function (b) {
    b.addEventListener("click", function () { printWorksheetById(b.getAttribute("data-printws")); });
  });
  host.querySelectorAll("[data-preview]").forEach(function (b) {
    b.addEventListener("click", function () {
      const id = b.getAttribute("data-preview");
      previewId = previewId === id ? null : id;
      renderLibrary();
    });
  });
}

function renderChips() {
  const ages = ["All"].concat(AGE_GROUPS);
  $("wsAgeChips").innerHTML = ages.map(function (a) {
    return '<button style="' + chipStyle + (ageFilter === a ? chipOn : "") + '" data-age="' + esc(a) + '">' +
      esc(a) + "</button>";
  }).join("");
  $("wsAgeChips").querySelectorAll("[data-age]").forEach(function (b) {
    b.addEventListener("click", function () { ageFilter = b.getAttribute("data-age"); renderChips(); renderLibrary(); });
  });
  $("wsTypeChips").innerHTML = ["All"].concat(WS_TYPES.map(function (t) { return t.id; })).map(function (t) {
    const label = t === "All" ? "All types" : (typeOf(t).emoji + " " + typeOf(t).title);
    return '<button style="' + chipStyle + (typeFilter === t ? chipOn : "") + '" data-type="' + t + '">' +
      esc(label) + "</button>";
  }).join("");
  $("wsTypeChips").querySelectorAll("[data-type]").forEach(function (b) {
    b.addEventListener("click", function () { typeFilter = b.getAttribute("data-type"); renderChips(); renderLibrary(); });
  });
}

function wireBuilder() {
  const box = $("wsBuilderTypes");
  if (!box) return;
  box.innerHTML = WS_TYPES.map(function (t) {
    return '<label style="display:inline-block;margin:4px 10px 4px 0;font-size:15px;">' +
      '<input type="checkbox" data-btype="' + t.id + '" checked> ' + t.emoji + " " + esc(t.title) + "</label>";
  }).join("");
  $("wsBuildBtn").addEventListener("click", function () {
    const types = [];
    box.querySelectorAll("[data-btype]:checked").forEach(function (c) { types.push(c.getAttribute("data-btype")); });
    if (!types.length) { alert("Pick at least one worksheet type."); return; }
    const perType = Math.max(1, Math.min(20, parseInt($("wsPerType").value, 10) || 8));
    const seed = parseInt($("wsSeed").value, 10);
    const items = {};
    types.forEach(function (t) { items[t] = perType; });
    const pack = buildPack({
      ageGroup: $("wsAgeSel").value,
      types: types,
      items: items,
      seed: isNaN(seed) ? Math.floor(Math.random() * 100000) : seed
    });
    $("wsPackPreview").innerHTML =
      '<h3 style="margin:16px 0 8px;">' + esc(pack.title) + "</h3>" +
      '<div style="border:2px dashed #1e3a8a;border-radius:12px;padding:12px;max-height:420px;overflow:auto;">' +
      pack.html + "</div>" +
      '<button style="' + btnPri + 'margin-top:10px;" id="wsPackPrint">🖨️ Print pack</button>' +
      '<details style="margin-top:10px;"><summary style="cursor:pointer;color:#1e3a8a;">🔑 Answer key (teachers/parents)</summary>' +
      '<div style="font-size:14px;margin-top:6px;">' + pack.answerKey + "</div></details>";
    $("wsPackPrint").addEventListener("click", function () {
      printHTML(pack.html + '<div style="page-break-before:always;"><h2>🔑 Answer Key</h2>' + pack.answerKey + "</div>");
    });
  });
}

function wireCertificates() {
  const btn = $("wsCertBtn");
  if (!btn) return;
  let name = "";
  try {
    if (S && S.profile && S.profile.name) name = S.profile.name;
  } catch (e) { /* store unavailable (shouldn't happen) */ }
  if (name && !$("wsCertName").value) $("wsCertName").value = name;
  btn.addEventListener("click", function () {
    const cert = certificate($("wsCertName").value, $("wsCertFor").value, $("wsCertDate").value, {
      studentId: $("wsCertId") ? $("wsCertId").value : ""
    });
    $("wsCertPreview").innerHTML = cert.html +
      '<div style="text-align:center;margin-top:12px;"><button style="' + btnPri + '" id="wsCertPrint">🖨️ Print certificate</button></div>';
    $("wsCertPrint").addEventListener("click", function () { printHTML(cert.html); });
  });
}

/** Library screen: filterable worksheet cards, teacher pack builder, certificates. */
export function showWorksheets() {
  show("screen-worksheets", "worksheets");
  const host = $("wsLibrary");
  if (!host) return;
  host.innerHTML =
    '<div style="padding:4px 4px 24px;">' +
    '<h2 style="margin:6px 0;">🖨️ Worksheets & Resources</h2>' +
    '<p style="color:#555;margin:0 0 10px;">Printable worksheets for every age. Pick, preview, print!</p>' +
    '<div id="wsAgeChips" style="margin-bottom:6px;"></div>' +
    '<div id="wsTypeChips" style="margin-bottom:10px;"></div>' +
    '<div id="wsLibGrid" style="display:flex;flex-wrap:wrap;"></div>' +
    '<h3 style="margin:22px 0 8px;">🧰 Teacher Builder — make a worksheet pack</h3>' +
    '<div style="border:2px solid #e5d9c3;border-radius:14px;background:#fffdf7;padding:14px;">' +
    '<div style="margin-bottom:8px;"><label>Age group: <select id="wsAgeSel" style="padding:8px;font-size:15px;">' +
    AGE_GROUPS.map(function (a) { return '<option value="' + esc(a) + '">' + esc(a) + "</option>"; }).join("") +
    "</select></label> " +
    '<label style="margin-left:12px;">Items each: <input id="wsPerType" type="number" value="8" min="1" max="20" style="width:60px;padding:8px;"></label> ' +
    '<label style="margin-left:12px;">Seed: <input id="wsSeed" type="number" placeholder="random" style="width:90px;padding:8px;"></label></div>' +
    '<div id="wsBuilderTypes" style="margin-bottom:8px;"></div>' +
    '<button id="wsBuildBtn" style="' + btnPri + '">✨ Generate pack</button>' +
    '<div id="wsPackPreview"></div></div>' +
    '<h3 style="margin:22px 0 8px;">🏆 Certificates</h3>' +
    '<div style="border:2px solid #e5d9c3;border-radius:14px;background:#fffdf7;padding:14px;">' +
    '<label>Student name:<br><input id="wsCertName" placeholder="e.g. Amina Khan" style="width:100%;max-width:320px;padding:10px;margin:4px 0;font-size:15px;"></label><br>' +
    '<label>Student ID:<br><input id="wsCertId" placeholder="e.g. Roll no. / ID (optional)" style="width:100%;max-width:320px;padding:10px;margin:4px 0;font-size:15px;"></label><br>' +
    '<label>Achievement:<br><input id="wsCertFor" placeholder="e.g. Reading Star — finished 5 stories" style="width:100%;max-width:320px;padding:10px;margin:4px 0;font-size:15px;"></label><br>' +
    '<label>Date:<br><input id="wsCertDate" type="date" style="padding:10px;margin:4px 0;font-size:15px;"></label><br>' +
    '<button id="wsCertBtn" style="' + btnPri + '">✨ Make certificate</button>' +
    '<div id="wsCertPreview" style="margin-top:12px;"></div></div>' +
    "</div>";
  renderChips();
  renderLibrary();
  wireBuilder();
  wireCertificates();
  if (go) { /* reserved for router back-navigation */ }
}
