// LinguaBuddy — reading library.
// Filters (difficulty, genre, length); story view with Before Reading
// (prediction), During Reading (vocab support with Urdu glosses), After
// Reading (comprehension quiz + inference + writing extension); automatic
// next-reading recommendations.

import { S, markReading, addVocabWord } from "./store.js";
import { STORIES, storyById, storyMeta, recommendReading, buildItems } from "./engine.js";
import { runAttempt, showResult } from "./assess.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGo(fn) { go = fn; }

let filters = { difficulty: "all", genre: "all", length: "all" };
let curStory = null;

function genres() {
  const g = {};
  STORIES.forEach(function (s) {
    const m = storyMeta(s.id);
    if (m) g[m.genre] = 1;
  });
  return Object.keys(g);
}

export function renderLibrary() {
  const gs = genres();
  $("libFilters").innerHTML =
    filterSel("fDiff", "Level", ["all", "Easy", "Medium"]) +
    filterSel("fGenre", "Genre", ["all"].concat(gs)) +
    filterSel("fLen", "Length", ["all", "Short (<3 min)", "Long (3+ min)"]);
  function filterSel(id, label, opts) {
    return '<label class="fsel">' + label + '<select id="' + id + '">' +
      opts.map(function (o) {
        const v = o === "all" ? "all" : o;
        const t = o === "all" ? "All" : o.replace(" (<3 min)", "").replace(" (3+ min)", "");
        return '<option value="' + esc(v) + '"' + (filters[id === "fDiff" ? "difficulty" : id === "fGenre" ? "genre" : "length"] === v ? " selected" : "") + ">" + esc(t) + "</option>";
      }).join("") + "</select></label>";
  }
  $("fDiff").addEventListener("change", function () { filters.difficulty = $("fDiff").value; drawStories(); });
  $("fGenre").addEventListener("change", function () { filters.genre = $("fGenre").value; drawStories(); });
  $("fLen").addEventListener("change", function () { filters.length = $("fLen").value; drawStories(); });
  drawStories();
}

function drawStories() {
  const list = STORIES.filter(function (s) {
    const m = storyMeta(s.id) || {};
    if (filters.difficulty !== "all" && s.difficulty !== filters.difficulty) return false;
    if (filters.genre !== "all" && m.genre !== filters.genre) return false;
    if (filters.length === "Short (<3 min)" && s.minutes >= 3) return false;
    if (filters.length === "Long (3+ min)" && s.minutes < 3) return false;
    return true;
  });
  $("storyGrid").innerHTML = list.length ? list.map(function (st) {
    const done = S.reading[st.id];
    const m = storyMeta(st.id) || {};
    const words = st.text.split(/\s+/).length;
    return '<button class="story-card" data-story="' + st.id + '">' +
      "<h3>" + esc(st.title) + " " + (done ? "✅" : "") + "</h3>" +
      '<span class="tag tag-' + st.difficulty.toLowerCase() + '">' + st.difficulty + "</span>" +
      (m.genre ? '<span class="tag tag-genre">' + esc(m.genre) + "</span>" : "") +
      '<br><span class="fine">' + st.minutes + " min · " + words + " words" +
      (done ? " · quiz: " + done.quizPct + "%" : "") + "</span></button>";
  }).join("") : '<p class="empty-msg">No stories match these filters.</p>';
  $("storyGrid").querySelectorAll("[data-story]").forEach(function (b) {
    b.addEventListener("click", function () { openStory(b.getAttribute("data-story")); });
  });
}

export function openStory(id) {
  const st = storyById(id);
  const meta = storyMeta(id) || {};
  if (!st) return;
  curStory = st;
  $("stTitle").textContent = st.title;
  $("stMeta").textContent = st.difficulty + " · about " + st.minutes + " min read" + (meta.genre ? " · " + meta.genre : "");

  // Before Reading: prediction
  let html = "";
  if (meta.prediction) {
    html += '<div class="read-sec"><h3>🔮 Before Reading</h3><p>' + esc(meta.prediction) + "</p>" +
      '<textarea class="short-input" id="predText" placeholder="Write your prediction…"></textarea></div>';
  }
  // Story text
  html += '<div class="read-sec"><h3>📖 Read</h3><article class="story-text">' +
    st.text.split("\n").map(function (p) { return "<p>" + esc(p.trim()) + "</p>"; }).join("") +
    "</article>" + '<p class="moral"><strong>Moral:</strong> ' + esc(st.moral) + "</p></div>";
  // During Reading: vocab support
  if (meta.vocab && meta.vocab.length) {
    html += '<div class="read-sec"><h3>🧠 Words to Know</h3><p class="fine">Tap a word to see its meaning, then save it to your vocabulary.</p><div class="vchips">' +
      meta.vocab.map(function (v, i) {
        return '<button class="vchip" data-vi="' + i + '">' + esc(v.word) + "</button>";
      }).join("") + "</div><div id='vMean' class='vmean hidden'></div></div>";
  }
  // After Reading: writing extension
  if (meta.writing) {
    html += '<div class="read-sec"><h3>✍️ Writing Extension</h3><p>' + esc(meta.writing) + "</p>" +
      '<textarea class="short-input" id="wExtText" placeholder="Write here…"></textarea>' +
      '<button class="btn-ghost btn-sm" id="wExtDone">Save</button> <span class="fine" id="wExtNote"></span></div>';
  }
  $("storyBody").innerHTML = html;

  // vocab chip interactions
  const chips = $("storyBody").querySelectorAll(".vchip");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      const v = meta.vocab[parseInt(c.getAttribute("data-vi"), 10)];
      const box = $("vMean");
      box.classList.remove("hidden");
      box.innerHTML = "<strong>" + esc(v.word) + "</strong> — " + esc(v.def) +
        ' <em class="urdu">' + esc(v.urdu) + "</em> " +
        '<button class="btn-ghost btn-sm" id="vSaveBtn">+ Save to Vocabulary</button>';
      $("vSaveBtn").addEventListener("click", function () {
        addVocabWord({ word: v.word, definition: v.def, pos: "", synonyms: [], antonyms: [], example: "", urdu: v.urdu });
        $("vSaveBtn").textContent = "Saved ✓";
        $("vSaveBtn").disabled = true;
      });
    });
  });
  const wd = $("wExtDone");
  if (wd) wd.addEventListener("click", function () {
    $("wExtNote").textContent = $("wExtText").value.trim().length > 10 ? "Saved. Good writing!" : "Write a little more first.";
  });

  $("storyBack").onclick = function () { renderLibrary(); show("screen-library", "read"); };
  show("screen-story");
}

export function startStoryQuiz() {
  if (!curStory) return;
  const meta = storyMeta(curStory.id) || {};
  const items = buildItems({ kind: "story", ref: curStory.id, count: 5, seed: "story-" + curStory.id + "-" + Date.now() });
  // append the inference question as a 6th item
  if (meta.inference) {
    const inf = meta.inference;
    items.push({
      uid: "qinf_" + Date.now(), sloId: "story", sloTitle: curStory.title + " · Think Deeper",
      type: "mcq", q: inf.q, bankKey: "story:" + curStory.id + ":inf",
      options: inf.o.slice(), answer: inf.a
    });
    // shuffle its options
    const order = inf.o.map(function (t, i) { return { t: t, c: i === inf.a }; });
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    const last = items[items.length - 1];
    last.options = order.map(function (o) { return o.t; });
    last.answer = order.findIndex(function (o) { return o.c; });
  }
  const lockKey = (S.profile.name || "s").toLowerCase() + "|story|" + curStory.id;
  runAttempt({
    title: curStory.title + " — Quiz", items: items,
    timePerQ: 60, antiCopy: true, hints: false, lockKey: lockKey, lockLabel: "quiz",
    onDone: function (out) {
      markReading(curStory.id, out.pct);
      const rec = recommendReading(Object.keys(S.reading), null);
      showResult({
        title: curStory.title + " — Quiz", scoreLine: out.pct + "%",
        metaLine: out.totalScore + " of " + out.items.length + " marks · tab switches: " + out.tabs,
        results: out.results, perSlo: out.perSlo,
        actions: [
          { label: "📚 Read Next: " + rec.title, primary: true, fn: function () { openStory(rec.id); } },
          { label: "Library", fn: function () { renderLibrary(); show("screen-library"); } }
        ]
      });
    }
  });
}


