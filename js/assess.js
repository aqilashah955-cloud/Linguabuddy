// LinguaBuddy — attempt runtime: question rendering, timed/anti-cheat
// attempts, grading, and flexible result screens.
// Used by practice, assessments, placement tests, story quizzes and
// remediation. Pure grading lives in engine.js; this is the UI layer.

import { gradeItem, explainItem } from "./engine.js";
import { esc, fmtTime, fmtDate } from "./utils.js";
import { S, isLocked } from "./store.js";
import { lessonFor } from "./engine.js";
import { showScreen } from "./ui.js";

function $(id) { return document.getElementById(id); }

let ATT = null;

/* ---------------- question rendering ---------------- */
export function questionHTML(it, i, total, opts) {
  opts = opts || {};
  let body = "";
  const nm = "ans_" + it.uid;
  if (it.type === "passage") {
    body += '<div class="q-passage">' + esc(it.passage) + "</div>";
  }
  if (it.type === "mcq" || it.type === "passage") {
    body += it.options.map(function (op, oi) {
      return '<label class="opt-label"><input type="radio" name="' + nm + '" value="' + oi + '" />' + esc(op) + "</label>";
    }).join("");
  } else if (it.type === "fib") {
    body += '<input class="fib-input" id="' + nm + '" type="text" placeholder="Type your answer" autocomplete="off" />';
  } else if (it.type === "tf") {
    body += '<label class="opt-label"><input type="radio" name="' + nm + '" value="true" />True</label>' +
            '<label class="opt-label"><input type="radio" name="' + nm + '" value="false" />False</label>';
  } else if (it.type === "reorder") {
    body += '<div class="chips" id="chips_' + it.uid + '">' +
      it.words.map(function (w, wi) { return '<button type="button" class="chip" data-wi="' + wi + '">' + esc(w) + "</button>"; }).join("") +
      '</div><div class="tray" id="tray_' + it.uid + '"></div>' +
      '<button type="button" class="btn-ghost btn-sm" id="clear_' + it.uid + '">Clear</button>';
  } else if (it.type === "match") {
    body += it.lefts.map(function (l, li) {
      return '<div class="match-row"><span class="match-left">' + esc(l) + "</span>" +
        '<select id="' + nm + "_" + li + '"><option value="">Choose…</option>' +
        it.rights.map(function (r) { return '<option value="' + esc(r) + '">' + esc(r) + "</option>"; }).join("") +
        "</select></div>";
    }).join("");
  } else if (it.type === "short") {
    body += '<textarea class="short-input" id="' + nm + '" placeholder="Write in your own words"></textarea>';
  }
  const hintBtn = opts.hints && it.sloId && lessonFor(it.sloId)
    ? '<button type="button" class="btn-ghost btn-sm hint-btn" id="hint_' + it.uid + '">💡 Hint</button><div class="q-hint hidden" id="hintbox_' + it.uid + '">' + esc(lessonFor(it.sloId).tip) + "</div>"
    : "";
  return '<div class="q-card" id="card_' + it.uid + '">' +
    '<div class="q-num">Question ' + (i + 1) + " of " + total + " · " + esc(it.sloTitle) + "</div>" +
    '<div class="q-text">' + esc(it.q) + "</div>" +
    (it.hint ? '<div class="q-hint">' + esc(it.hint) + "</div>" : "") +
    hintBtn + body + "</div>";
}

export function bindQuestion(it) {
  const nm = "ans_" + it.uid;
  const hb = $("hint_" + it.uid);
  if (hb) hb.addEventListener("click", function () { $("hintbox_" + it.uid).classList.toggle("hidden"); });
  if (it.type === "reorder") {
    const tray = $("tray_" + it.uid);
    $("chips_" + it.uid).querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        if (chip.classList.contains("picked")) return;
        chip.classList.add("picked");
        it.trayArr.push(chip.textContent);
        renderTray();
      });
    });
    function renderTray() {
      tray.innerHTML = "";
      it.trayArr.forEach(function (w, i) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "chip picked"; b.textContent = w;
        b.addEventListener("click", function () {
          it.trayArr.splice(i, 1);
          const chips = document.querySelectorAll("#chips_" + it.uid + " .chip");
          for (let k = 0; k < chips.length; k++) {
            if (chips[k].textContent === w && chips[k].classList.contains("picked")) { chips[k].classList.remove("picked"); break; }
          }
          renderTray(); updateAnsCount();
        });
        tray.appendChild(b);
      });
      updateAnsCount();
    }
    $("clear_" + it.uid).addEventListener("click", function () {
      it.trayArr = [];
      document.querySelectorAll("#chips_" + it.uid + " .chip").forEach(function (c) { c.classList.remove("picked"); });
      renderTray();
    });
  }
  if (it.type === "mcq" || it.type === "passage" || it.type === "tf") {
    document.querySelectorAll('input[name="' + nm + '"]').forEach(function (r) {
      r.addEventListener("change", updateAnsCount);
    });
  }
  if (it.type === "fib" || it.type === "short") {
    const el = $(nm);
    if (el) el.addEventListener("input", updateAnsCount);
  }
  if (it.type === "match") {
    it.lefts.forEach(function (l, li) {
      const sel = $(nm + "_" + li);
      if (sel) sel.addEventListener("change", updateAnsCount);
    });
  }
}

export function readAnswer(it) {
  const nm = "ans_" + it.uid;
  if (it.type === "mcq" || it.type === "passage") {
    const r = document.querySelector('input[name="' + nm + '"]:checked');
    return r ? parseInt(r.value, 10) : null;
  }
  if (it.type === "fib") { const el = $(nm); return el ? el.value : ""; }
  if (it.type === "tf") {
    const r = document.querySelector('input[name="' + nm + '"]:checked');
    return r ? (r.value === "true") : null;
  }
  if (it.type === "reorder") return it.trayArr.join(" ");
  if (it.type === "match") {
    return it.lefts.map(function (l, li) { const s = $(nm + "_" + li); return s ? s.value : ""; });
  }
  if (it.type === "short") { const el = $(nm); return el ? el.value : ""; }
  return null;
}

export function isAnswered(it) {
  const g = readAnswer(it);
  if (g == null) return false;
  if (typeof g === "string") return g.trim() !== "";
  if (Array.isArray(g)) return g.some(function (x) { return x !== ""; });
  return true;
}

function updateAnsCount() {
  if (!ATT) return;
  const n = ATT.items.filter(isAnswered).length;
  const el = $("ansCount");
  if (el) el.textContent = "Answered " + n + " of " + ATT.items.length;
}

/* ---------------- attempt flow ----------------
   spec: {title, items, timePerQ (0 = no timer), antiCopy, lockKey,
          lockLabel, hints, onDone}
   onDone receives {items, results, pct, totalScore, perSlo, tabs, secs, usedKeys} */
export function runAttempt(spec) {
  if (spec.lockKey && isLocked(spec.lockKey)) {
    const prev = S.attempts.find(function (a) { return a.lockKey === spec.lockKey; });
    alert("You have already completed this " + (spec.lockLabel || "assessment") + "." +
      (prev ? " Your score was " + prev.pct + "%." : "") +
      " Ask your teacher to reset attempts for another try.");
    return false;
  }
  if (!spec.items || !spec.items.length) { alert("No questions available."); return false; }
  const perQ = spec.timePerQ == null ? 60 : spec.timePerQ;
  ATT = {
    title: spec.title, items: spec.items, spec: spec,
    tabs: 0, totalSecs: spec.items.length * perQ, left: spec.items.length * perQ,
    timerId: null, submitted: false, startedAt: Date.now(), noTimer: perQ <= 0
  };
  $("attTitle").textContent = spec.title;
  $("tabNote").textContent = spec.antiCopy ? "Tab switches: 0 / 4" : "";
  $("tabWarn").classList.add("hidden");
  const box = $("quizBox");
  box.innerHTML = ATT.items.map(function (it, i) { return questionHTML(it, i, ATT.items.length, { hints: spec.hints }); }).join("");
  ATT.items.forEach(bindQuestion);
  updateAnsCount();
  const timerEl = $("timer");
  if (ATT.noTimer) { timerEl.textContent = "∞"; timerEl.classList.remove("low"); }
  else startTimer();
  if (spec.antiCopy) {
    box.oncopy = function (e) { e.preventDefault(); return false; };
    box.oncut = function (e) { e.preventDefault(); return false; };
    box.onpaste = function (e) { e.preventDefault(); return false; };
    box.oncontextmenu = function (e) { e.preventDefault(); return false; };
    document.addEventListener("visibilitychange", onVis);
  } else {
    box.oncopy = box.oncut = box.onpaste = box.oncontextmenu = null;
  }
  showScreen("screen-attempt");
  return true;
}

function onVis() {
  if (!ATT || ATT.submitted || !document.hidden) return;
  ATT.tabs++;
  const n = $("tabNote");
  if (n) n.textContent = "Tab switches: " + ATT.tabs + " / 4";
  if (ATT.tabs === 2) {
    const w = $("tabWarn");
    w.textContent = "Warning: leaving this test is being recorded. At 4 tab switches your answers will be submitted automatically.";
    w.classList.remove("hidden");
  }
  if (ATT.tabs >= 4) submitAttempt(true);
}

function startTimer() {
  updateTimerUI();
  ATT.timerId = setInterval(function () {
    ATT.left--;
    updateTimerUI();
    if (ATT.left <= 0) submitAttempt(true);
  }, 1000);
}
function updateTimerUI() {
  const t = $("timer");
  t.textContent = fmtTime(Math.max(0, ATT.left));
  t.classList.toggle("low", ATT.left <= 60);
}

export function submitAttempt(auto) {
  if (!ATT || ATT.submitted) return;
  if (!auto) {
    const n = ATT.items.filter(isAnswered).length;
    if (n < ATT.items.length) {
      if (!confirm("You have answered " + n + " of " + ATT.items.length + " questions. Submit anyway?")) return;
    }
  }
  ATT.submitted = true;
  if (ATT.timerId) clearInterval(ATT.timerId);
  document.removeEventListener("visibilitychange", onVis);
  const secs = ATT.noTimer ? Math.round((Date.now() - ATT.startedAt) / 1000) : (ATT.totalSecs - Math.max(0, ATT.left));

  const results = ATT.items.map(function (it) {
    return { item: it, res: gradeItem(it, readAnswer(it)) };
  });
  const totalScore = results.reduce(function (s, r) { return s + r.res.score; }, 0);
  const pct = Math.round(totalScore / ATT.items.length * 100);
  const perSlo = {};
  results.forEach(function (r) {
    const id = r.item.sloId;
    perSlo[id] = perSlo[id] || { title: r.item.sloTitle, score: 0, total: 0 };
    perSlo[id].score += r.res.score;
    perSlo[id].total += 1;
  });
  const usedKeys = ATT.items.map(function (it) { return it.bankKey; }).filter(Boolean);
  const out = {
    items: ATT.items, results: results, pct: pct, totalScore: Math.round(totalScore * 10) / 10,
    perSlo: perSlo, tabs: ATT.tabs, secs: secs, usedKeys: usedKeys,
    title: ATT.title, lockKey: ATT.spec.lockKey
  };
  const cb = ATT.spec.onDone;
  ATT = null;
  if (cb) cb(out);
}

export function quitAttempt() {
  if (ATT && !ATT.submitted && confirm("Quit? Your answers will be lost.")) {
    if (ATT.timerId) clearInterval(ATT.timerId);
    document.removeEventListener("visibilitychange", onVis);
    ATT = null;
    showScreen("screen-home");
  }
}

/* ---------------- result screen ----------------
   spec: {title, scoreLine, metaLine, results, perSlo, showSloBars,
          actions: [{label, primary, fn}], bannerHTML} */
export function showResult(spec) {
  $("rTitle").textContent = spec.title || "Your Result";
  $("rScore").textContent = spec.scoreLine || "";
  $("rMeta").textContent = spec.metaLine || "";
  $("rBanner").innerHTML = spec.bannerHTML || "";
  $("rBanner").classList.toggle("hidden", !spec.bannerHTML);

  const sloBox = $("rSlo");
  const ids = Object.keys(spec.perSlo || {});
  if (spec.showSloBars === false || !ids.length) {
    $("rSloTitle").classList.add("hidden"); sloBox.innerHTML = "";
  } else {
    $("rSloTitle").classList.remove("hidden");
    sloBox.innerHTML = ids.map(function (id) {
      const p = spec.perSlo[id];
      const pc = Math.round(p.score / p.total * 100);
      return '<div class="slo-bar"><div class="slo-bar-top"><span>' + esc(p.title) + "</span><span>" +
        (Math.round(p.score * 10) / 10) + "/" + p.total + " (" + pc + "%)</span></div>" +
        '<div class="slo-bar-track"><div class="slo-bar-fill" style="width:' + pc + '%"></div></div></div>';
    }).join("");
  }

  $("rReview").innerHTML = (spec.results || []).map(function (r, i) {
    const cls = r.res.score === 1 ? "correct" : (r.res.score > 0 ? "partial" : "wrong");
    let extra = "";
    if (r.res.extra) {
      extra = '<div class="rev-line rev-given">Key ideas matched: ' + r.res.extra.keysHit + " of " + r.res.extra.keysTotal + "</div>" +
        '<div class="rev-model"><strong>Model answer:</strong> ' + esc(r.res.extra.model) + "</div>";
    }
    return '<div class="review-card ' + cls + '">' +
      '<div class="rev-q">Q' + (i + 1) + ". " + esc(r.item.q) + " <em>(" + esc(r.item.sloTitle) + ")</em></div>" +
      '<div class="rev-line rev-given">Your answer: ' + esc(String(r.res.given)).slice(0, 300) + "</div>" +
      '<div class="rev-line ' + (r.res.score === 1 ? "rev-correct" : "rev-wrong-note") + '">' + esc(explainItem(r.item, r.res)) + "</div>" +
      extra + "</div>";
  }).join("");

  const ab = $("rActions");
  ab.innerHTML = "";
  (spec.actions || []).forEach(function (a) {
    const b = document.createElement("button");
    b.className = a.primary ? "btn-primary" : "btn-ghost";
    b.textContent = a.label;
    b.addEventListener("click", a.fn);
    ab.appendChild(b);
  });
  showScreen("screen-result");
}
