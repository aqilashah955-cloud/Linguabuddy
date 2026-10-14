// LinguaBuddy — reading library.
// Filters (difficulty, genre, length); story view with Before Reading
// During Reading (vocab support with English definitions), After
// Reading (comprehension quiz + inference + writing extension); automatic
// next-reading recommendations.

import { S, markReading, addVocabWord } from "./store.js";
import { STORIES, storyById, storyMeta, recommendReading, buildItems } from "./engine.js";
import { runAttempt, showResult } from "./assess.js";
import { awardXP, checkBadges, XP_TABLE } from "./gamify.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { speak, stopSpeak, ttsAvailable } from "./tts.js";
import { GENRE_GUIDE, READING_STRATEGIES, SPEED_READING } from "../data/readguide.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setGo(fn) { go = fn; }

let filters = { difficulty: "all", genre: "all", length: "all" };
let libTab = "library"; // "library" | "resources"
let curStory = null;

function shuffled(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = r[i]; r[i] = r[j]; r[j] = t;
  }
  return r;
}

function genres() {
  const g = {};
  STORIES.forEach(function (s) {
    const m = storyMeta(s.id);
    if (m) g[m.genre] = 1;
  });
  return Object.keys(g);
}

function renderLibTabs() {
  $("libTabs").innerHTML =
    '<button class="tab-btn' + (libTab === "library" ? " tab-on" : "") + '" data-tab="library">📖 Library</button>' +
    '<button class="tab-btn' + (libTab === "resources" ? " tab-on" : "") + '" data-tab="resources">🧰 Resources</button>';
  $("libTabs").querySelectorAll("[data-tab]").forEach(function (b) {
    b.addEventListener("click", function () { libTab = b.getAttribute("data-tab"); renderLibrary(); });
  });
  $("libFilters").classList.toggle("hidden", libTab !== "library");
  $("storyGrid").classList.toggle("hidden", libTab !== "library");
  $("libResources").classList.toggle("hidden", libTab !== "resources");
}

function renderResources() {
  let html = '<h3 class="sec-title">📚 Genre Guide</h3>' +
    '<p class="fine">Every kind of writing in your library — what it is, and how to read it well.</p>' +
    '<div class="res-grid">' +
    GENRE_GUIDE.map(function (g) {
      return '<div class="res-card"><div class="res-head">' + g.icon + " <strong>" + esc(g.genre) + "</strong></div>" +
        "<p>" + esc(g.blurb) + '</p><p class="fine">💡 ' + esc(g.tip) + "</p></div>";
    }).join("") + "</div>";
  html += '<h3 class="sec-title">🧠 Reading Strategies</h3><div class="res-grid">' +
    READING_STRATEGIES.map(function (s) {
      return '<div class="res-card"><div class="res-head"><strong>' + esc(s.when) + "</strong></div><ul>" +
        s.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div>";
  html += '<h3 class="sec-title">⚡ Speed Reading</h3><div class="res-grid">' +
    SPEED_READING.map(function (s) {
      return '<div class="res-card"><div class="res-head"><strong>' + esc(s.skill) + "</strong></div>" +
        "<p>" + esc(s.what) + '</p><p class="fine">' + esc(s.how) + "</p></div>";
    }).join("") + "</div>";
  $("libResources").innerHTML = html;
}

export function renderLibrary() {
  renderLibTabs();
  if (libTab === "resources") { renderResources(); return; }
  const gs = genres();
  $("libFilters").innerHTML =
    filterSel("fDiff", "Level", ["all", "Easy", "Medium", "Advanced"]) +
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
  // Story text (+ optional listen-aloud)
  const listenBtn = ttsAvailable() ? ' <button class="btn-ghost btn-sm" id="listenBtn">🔊 Listen</button>' : "";
  html += '<div class="read-sec"><h3>📖 Read' + listenBtn + '</h3><article class="story-text">' +
    st.text.split("\n").map(function (p) { return "<p>" + esc(p.trim()) + "</p>"; }).join("") +
    "</article>";
  const takeaway = st.takeaway || st.moral;
  if (takeaway) html += '<p class="moral"><strong>💡 Takeaway:</strong> ' + esc(takeaway) + "</p>";
  html += "</div>";
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
  // Word Match game (built from the same vocab list)
  if (meta.vocab && meta.vocab.length) {
    html += '<div class="read-sec"><h3>🎮 Word Match</h3><p class="fine">Tap a word, then tap its meaning.</p>' +
      '<div class="match-wrap"><div class="match-col" id="matchWords"></div>' +
      '<div class="match-col" id="matchDefs"></div></div>' +
      '<p class="fine" id="matchMsg"></p></div>';
  }
  // Scan challenge (find one fact, fast)
  if (meta.scan && meta.scan.task) {
    html += '<div class="read-sec"><h3>🔍 Scan Challenge</h3><p>' + esc(meta.scan.task) + "</p>" +
      '<p class="fine">⏱️ Time yourself — can you find it in 30 seconds? Sweep the text above!</p>' +
      '<button class="btn-ghost btn-sm" id="scanReveal">Show answer</button> ' +
      '<span class="fine hidden" id="scanAns"><strong>Answer:</strong> ' + esc(meta.scan.answer) + "</span></div>";
  }
  // Order the events
  if (meta.order && meta.order.length >= 2) {
    html += '<div class="read-sec"><h3>🔢 Order the Events</h3>' +
      '<p class="fine">Tap the events in the order they happened in the piece.</p>' +
      '<div id="ordPool" class="ord-pool"></div><p class="fine">Your order:</p><ol id="ordMine"></ol>' +
      '<button class="btn-ghost btn-sm" id="ordCheck">Check</button> ' +
      '<button class="btn-ghost btn-sm" id="ordReset">Reset</button> ' +
      '<span class="fine" id="ordMsg"></span></div>';
  }
  $("storyBody").innerHTML = html;

  // Listen-aloud toggle
  const lb = $("listenBtn");
  if (lb) {
    let speaking = false;
    lb.addEventListener("click", function () {
      if (speaking) { stopSpeak(); speaking = false; lb.textContent = "🔊 Listen"; return; }
      speaking = true; lb.textContent = "⏹️ Stop";
      speak(st.text.replace(/\n+/g, " "), {
        onend: function () { speaking = false; lb.textContent = "🔊 Listen"; }
      });
    });
  }

  // Word Match game wiring
  const mw = $("matchWords");
  if (mw && meta.vocab) {
    const words = meta.vocab.map(function (v) { return v.word; });
    const defs = shuffled(meta.vocab.map(function (v) { return v.def; }));
    mw.innerHTML = words.map(function (w, i) {
      return '<button class="mchip" data-w="' + i + '">' + esc(w) + "</button>";
    }).join("");
    $("matchDefs").innerHTML = defs.map(function (d, i) {
      return '<button class="mchip mdef" data-d="' + i + '">' + esc(d) + "</button>";
    }).join("");
    let selW = -1, matched = 0;
    const mMsg = $("matchMsg");
    mw.querySelectorAll("[data-w]").forEach(function (b) {
      b.addEventListener("click", function () {
        mw.querySelectorAll("[data-w]").forEach(function (x) { x.classList.remove("msel"); });
        b.classList.add("msel");
        selW = parseInt(b.getAttribute("data-w"), 10);
      });
    });
    $("matchDefs").querySelectorAll("[data-d]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (selW < 0) { mMsg.textContent = "First tap a word on the left."; return; }
        const defText = defs[parseInt(b.getAttribute("data-d"), 10)];
        const wBtn = mw.querySelector('[data-w="' + selW + '"]');
        if (meta.vocab[selW].def === defText) {
          b.disabled = true; b.classList.add("mok");
          wBtn.disabled = true; wBtn.classList.remove("msel"); wBtn.classList.add("mok");
          selW = -1; matched++;
          mMsg.textContent = matched === words.length ? "🎉 All matched! Great work." : "✅ Correct! " + matched + "/" + words.length;
        } else {
          mMsg.textContent = "❌ Not quite — try again.";
          b.classList.add("mno");
          setTimeout(function () { b.classList.remove("mno"); }, 600);
        }
      });
    });
  }

  // Scan challenge wiring
  const sr = $("scanReveal");
  if (sr) {
    sr.addEventListener("click", function () {
      $("scanAns").classList.remove("hidden");
      sr.disabled = true;
    });
  }

  // Order-the-events wiring
  const op = $("ordPool");
  if (op && meta.order) {
    const correct = meta.order.slice();
    let pool = shuffled(correct);
    const mine = [];
    const oMsg = $("ordMsg");
    const drawOrd = function () {
      op.innerHTML = pool.map(function (e, i) {
        return '<button class="mchip" data-p="' + i + '">' + esc(e) + "</button>";
      }).join("");
      $("ordMine").innerHTML = mine.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("");
      op.querySelectorAll("[data-p]").forEach(function (b) {
        b.addEventListener("click", function () {
          const e = pool[parseInt(b.getAttribute("data-p"), 10)];
          mine.push(e);
          pool = pool.filter(function (x) { return x !== e; });
          drawOrd();
        });
      });
    };
    drawOrd();
    $("ordCheck").addEventListener("click", function () {
      if (mine.length < correct.length) { oMsg.textContent = "Tap all " + correct.length + " events first."; return; }
      const good = mine.every(function (e, i) { return e === correct[i]; });
      oMsg.textContent = good ? "🎉 Perfect order!" : "❌ Not quite — tap Reset and try again.";
    });
    $("ordReset").addEventListener("click", function () {
      pool = shuffled(correct); mine.length = 0; oMsg.textContent = ""; drawOrd();
    });
  }

  // vocab chip interactions
  const chips = $("storyBody").querySelectorAll(".vchip");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      const v = meta.vocab[parseInt(c.getAttribute("data-vi"), 10)];
      const box = $("vMean");
      box.classList.remove("hidden");
      box.innerHTML = "<strong>" + esc(v.word) + "</strong> — " + esc(v.def) +
        ' <button class="btn-ghost btn-sm" id="vSaveBtn">+ Save to Vocabulary</button>';
      $("vSaveBtn").addEventListener("click", function () {
        addVocabWord({ word: v.word, definition: v.def, pos: "", synonyms: [], antonyms: [], example: "" });
        $("vSaveBtn").textContent = "Saved ✓";
        $("vSaveBtn").disabled = true;
      });
    });
  });
  const wd = $("wExtDone");
  if (wd) wd.addEventListener("click", function () {
    $("wExtNote").textContent = $("wExtText").value.trim().length > 10 ? "Saved. Good writing!" : "Write a little more first.";
  });

  $("storyBack").onclick = function () { stopSpeak(); renderLibrary(); show("screen-library", "read"); };
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
      awardXP(XP_TABLE.storyRead + XP_TABLE.storyQuizComplete, "story + quiz complete");
      checkBadges();
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


