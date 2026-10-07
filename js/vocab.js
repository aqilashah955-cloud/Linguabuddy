// LinguaBuddy — vocabulary builder.
// Save words from stories/lessons or add manually. Study with flashcards,
// then test with matching and fill-in-the-blank quizzes. Per-word mastery
// (correct/total) is tracked locally and mirrored to Firestore when online.

import { S, save, addVocabWord } from "./store.js";
import { WORDS } from "./engine.js";
import { esc, shuffle } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { awardXP, checkBadges, XP_TABLE } from "./gamify.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGo(fn) { go = fn; }

export function renderVocab() {
  drawList();
  // seed suggestions from the curated bank (words not yet saved)
  const have = new Set(S.vocab.map(function (w) { return w.word.toLowerCase(); }));
  const sug = WORDS.filter(function (w) { return !have.has(w.word.toLowerCase()); }).slice(0, 6);
  $("vocabSug").innerHTML = sug.length
    ? '<h3 class="sec-title">Suggested words</h3><div class="vchips">' +
      sug.map(function (w, i) { return '<button class="vchip" data-sug="' + i + '">+ ' + esc(w.word) + "</button>"; }).join("") +
      "</div>"
    : "";
  const sugBtns = $("vocabSug").querySelectorAll("[data-sug]");
  sugBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      const w = sug[parseInt(b.getAttribute("data-sug"), 10)];
      addVocabWord({
        word: w.word, definition: w.def, pos: w.pos,
        synonyms: w.syn.slice(), antonyms: w.ant.slice(),
        example: w.example
      });
      awardXP(XP_TABLE.wordAdded, "word saved");
      checkBadges();
      renderVocab();
    });
  });
  $("vocabQuizBtns").classList.toggle("hidden", S.vocab.length < 2);
}

function masteryChip(w) {
  if (!w.total) return '<span class="pill">new</span>';
  const pc = Math.round(w.correct / w.total * 100);
  return '<span class="pill ' + (pc >= 80 ? "ok" : pc >= 50 ? "mid" : "low") + '">' + pc + "%</span>";
}

function drawList() {
  const box = $("vocabList");
  if (!S.vocab.length) {
    box.innerHTML = '<p class="empty-msg">No words saved yet. Save words while reading stories, or add your own below.</p>';
    return;
  }
  box.innerHTML = S.vocab.map(function (w, i) {
    return '<button class="word-card" data-wi="' + i + '"><strong>' + esc(w.word) + "</strong> " + masteryChip(w) +
      "<br><span class='fine'>" + esc(w.definition || "") + "</span></button>";
  }).join("");
  box.querySelectorAll("[data-wi]").forEach(function (b) {
    b.addEventListener("click", function () { openWord(parseInt(b.getAttribute("data-wi"), 10)); });
  });
}

function openWord(i) {
  const w = S.vocab[i];
  if (!w) return;
  $("wordTitle").textContent = w.word;
  $("wordBody").innerHTML =
    (w.pos ? '<p><strong>Part of speech:</strong> ' + esc(w.pos) + "</p>" : "") +
    "<p><strong>Meaning:</strong> " + esc(w.definition || "—") + "</p>" +
    (w.synonyms && w.synonyms.length ? "<p><strong>Synonyms:</strong> " + esc(w.synonyms.join(", ")) + "</p>" : "") +
    (w.antonyms && w.antonyms.length ? "<p><strong>Antonyms:</strong> " + esc(w.antonyms.join(", ")) + "</p>" : "") +
    (w.example ? "<p><strong>Example:</strong> <em>" + esc(w.example) + "</em></p>" : "") +
    '<p class="fine">Mastery: ' + w.correct + "/" + w.total + " correct</p>";
  $("wordDel").onclick = function () {
    if (confirm("Remove '" + w.word + "' from your vocabulary?")) {
      S.vocab.splice(i, 1); save(); show("screen-vocab"); renderVocab();
    }
  };
  show("screen-word");
}

export function initVocab() {
  $("vocabAddBtn").addEventListener("click", function () {
    const word = $("vwWord").value.trim();
    if (!word) { $("vwMsg").textContent = "Type the word first."; return; }
    addVocabWord({
      word: word,
      definition: $("vwDef").value.trim(),
      pos: $("vwPos").value.trim(),
      synonyms: $("vwSyn").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      antonyms: $("vwAnt").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean),
      example: $("vwEx").value.trim()
    });
    ["vwWord", "vwDef", "vwPos", "vwSyn", "vwAnt", "vwEx"].forEach(function (id) { $(id).value = ""; });
    $("vwMsg").textContent = "Saved ✓";
    awardXP(XP_TABLE.wordAdded, "word saved");
    checkBadges();
    setTimeout(function () { $("vwMsg").textContent = ""; }, 2000);
    renderVocab();
  });
  $("vqFlash").addEventListener("click", startFlashcards);
  $("vqMatch").addEventListener("click", startMatchQuiz);
  $("vqFib").addEventListener("click", startFibQuiz);
  $("wordBack").addEventListener("click", function () { show("screen-vocab"); });
  $("flashBack").addEventListener("click", function () { show("screen-vocab"); });
  $("vquizBack").addEventListener("click", function () { show("screen-vocab"); });
}

/* ---------------- flashcard study ---------------- */
let deck = [], di = 0;
function startFlashcards() {
  deck = shuffle(S.vocab.slice());
  di = 0;
  if (!deck.length) return;
  drawFlash();
  show("screen-flash");
}
function drawFlash() {
  const w = deck[di];
  $("flashCount").textContent = "Card " + (di + 1) + " of " + deck.length;
  $("flashCard").innerHTML = '<div class="flash-front"><strong>' + esc(w.word) + "</strong><br><span class='fine'>Tap to flip</span></div>";
  $("flashCard").onclick = function () {
    $("flashCard").innerHTML = '<div class="flash-back">' + esc(w.definition || "—") +
      (w.example ? "<br><em>" + esc(w.example) + "</em>" : "") + "</div>";
  };
  $("flashKnow").onclick = function () { w.correct++; w.total++; save(); nextFlash(); };
  $("flashDont").onclick = function () { w.total++; save(); nextFlash(); };
}
function nextFlash() {
  di++;
  if (di >= deck.length) { show("screen-vocab"); renderVocab(); return; }
  drawFlash();
}

/* ---------------- matching quiz ---------------- */
function startMatchQuiz() {
  const words = shuffle(S.vocab.slice()).slice(0, 6);
  const defs = shuffle(words.map(function (w) { return w; }));
  let html = "<p class='fine'>Match each word with its meaning.</p>";
  html += words.map(function (w, i) {
    return '<div class="match-row"><span class="match-left">' + esc(w.word) + "</span>" +
      '<select data-mi="' + i + '"><option value="">Choose…</option>' +
      defs.map(function (d, j) { return '<option value="' + j + '">' + esc(d.definition || d.word) + "</option>"; }).join("") +
      "</select></div>";
  }).join("");
  html += '<button class="btn-primary btn-big" id="matchCheck">Check</button><div id="matchRes"></div>';
  $("vqBox").innerHTML = html;
  show("screen-vquiz");
  $("matchCheck").addEventListener("click", function () {
    let c = 0;
    words.forEach(function (w, i) {
      const sel = document.querySelector('[data-mi="' + i + '"]');
      const picked = defs[parseInt(sel.value, 10)];
      const ok = picked && picked.word === w.word;
      if (ok) c++;
      w.total++; if (ok) w.correct++;
      sel.style.borderColor = ok ? "var(--ok)" : "var(--bad)";
    });
    save();
    $("matchRes").innerHTML = '<p class="rev-' + (c === words.length ? "correct" : "wrong-note") + '"><strong>' +
      c + " of " + words.length + " correct.</strong></p>" +
      '<button class="btn-ghost" id="vqBack1">Back to Vocabulary</button>';
    $("vqBack1").addEventListener("click", function () { show("screen-vocab"); renderVocab(); });
  });
}

/* ---------------- fill-in-the-blank quiz ---------------- */
function startFibQuiz() {
  const words = shuffle(S.vocab.filter(function (w) { return w.example; })).slice(0, 6);
  if (!words.length) { alert("Add example sentences to your words to play this quiz."); return; }
  let html = "<p class='fine'>Complete each sentence with the right word.</p>";
  html += words.map(function (w, i) {
    const sent = w.example.replace(new RegExp(w.word, "ig"), "_____");
    return '<div class="q-card"><div class="q-text">' + (i + 1) + ". " + esc(sent) + "</div>" +
      '<input class="fib-input" data-fi="' + i + '" type="text" placeholder="Type the word" autocomplete="off" /></div>';
  }).join("");
  html += '<button class="btn-primary btn-big" id="fibCheck">Check</button><div id="fibRes"></div>';
  $("vqBox").innerHTML = html;
  show("screen-vquiz");
  $("fibCheck").addEventListener("click", function () {
    let c = 0, out = "";
    words.forEach(function (w, i) {
      const el = document.querySelector('[data-fi="' + i + '"]');
      const ok = el.value.trim().toLowerCase() === w.word.toLowerCase();
      if (ok) c++;
      w.total++; if (ok) w.correct++;
      out += '<div class="rev-line ' + (ok ? "rev-correct" : "rev-wrong-note") + '">' + (i + 1) + ". " +
        (ok ? "Correct" : "The word was <strong>" + esc(w.word) + "</strong>") + "</div>";
    });
    save();
    $("fibRes").innerHTML = "<p><strong>" + c + " of " + words.length + " correct.</strong></p>" + out +
      '<button class="btn-ghost" id="vqBack2">Back to Vocabulary</button>';
    $("vqBack2").addEventListener("click", function () { show("screen-vocab"); renderVocab(); });
  });
}


