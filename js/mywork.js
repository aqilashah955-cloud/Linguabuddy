// LinguaBuddy — 📸 My Work: photo uploads of handwritten work + feedback.
// A student writes a story / application / essay / letter on paper,
// photographs it, the app reads the handwriting (OCR), the student
// CORRECTS the extracted text, then gets feedback from the Writing Lab's
// analyzeWriting() — which never rewrites their text (guaranteed).
//
// Honesty rules (also documented in README):
//  - OCR on handwriting is imperfect. The editable check-step is MANDATORY:
//    we never claim perfect accuracy.
//  - Tesseract.js loads lazily from a CDN only when the student taps
//    "Scan photo" — never at app start, so the app stays offline-first.
//  - If the CDN is unreachable (offline), we fall back to typed text.
// Privacy: photos live in localStorage (budget-capped, oldest-first
// eviction). Online, the photo goes to Firebase Storage and the Firestore
// doc holds ONLY the download URL — never raw photo bytes. Students can
// never see each other's work (owner-only reads + teacherIds).

import { S, save, touchStreak } from "./store.js";
import { fb, isConfigured, saveWorkUpload, uploadWorkPhoto } from "./firebase.js";
import { esc, uid, fmtDate } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { analyzeWriting } from "./writing.js";
import { awardXP, checkBadges, toast, XP_TABLE } from "./gamify.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setMyworkGo(fn) { go = fn; }

/* ---------------- constants & pure helpers (DOM-free, node-testable) ---------------- */

export const MW_MAX_ITEMS = 15;                       // gallery cap: oldest-first eviction
export const MW_PHOTO_MAX = 1280;                     // longest side of stored photo (px)
export const MW_THUMB_MAX = 480;                      // longest side of thumbnail (px)
export const MW_JPEG_Q = 0.6;
export const MW_BUDGET = Math.floor(3.5 * 1024 * 1024); // localStorage photo budget (bytes)

export const MW_TYPES = [
  { id: "story", name: "Story", emoji: "📖", kind: "story" },
  { id: "application", name: "Application", emoji: "📨", kind: "letter" },
  { id: "essay", name: "Essay", emoji: "📄", kind: "essay" },
  { id: "letter", name: "Letter", emoji: "✉️", kind: "letter" },
  { id: "other", name: "Other", emoji: "✍️", kind: null }
];

/* Scale (w,h) so the longest side is <= maxSide. Pure math for tests. */
export function targetSize(w, h, maxSide) {
  maxSide = maxSide || MW_PHOTO_MAX;
  w = Math.max(1, Math.round(Number(w) || 0));
  h = Math.max(1, Math.round(Number(h) || 0));
  var m = Math.max(w, h);
  if (m <= maxSide) return { w: w, h: h };
  var k = maxSide / m;
  return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) };
}

/* Clean up raw OCR text: strip control chars, collapse whitespace,
   normalize blank lines, trim. Never "fixes" words — the student does that. */
export function sanitizeOcrText(t) {
  return String(t == null ? "" : t)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n").map(function (l) { return l.trim(); })
    .join("\n").trim();
}

/* Newest-first, capped at max. Oldest items fall off. */
export function evictOldest(list, max) {
  var arr = (list || []).slice()
    .sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
  return arr.slice(0, Math.max(0, max));
}

/* Fit a gallery under a byte budget: strip the full photoDataUrl (keep the
   thumbnail) from the OLDEST items first until it fits. The newest items
   always keep their photos. Pure — safe to unit test. */
export function fitPhotoBudget(items, budget) {
  var arr = (items || []).slice()
    .sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
  function size() { return JSON.stringify(arr).length; }
  var stripped = 0;
  for (var i = arr.length - 1; i >= 0 && size() > budget; i--) {
    if (arr[i].photoDataUrl) {
      arr[i] = Object.assign({}, arr[i], { photoDataUrl: "" });
      stripped++;
    }
  }
  return { items: arr, stripped: stripped };
}

/* Firestore doc shape for writingUploads/{id}.
   The photo itself NEVER goes here — only the Storage download URL. */
export function buildUploadDoc(o) {
  return {
    studentId: o.uid,
    title: String(o.title || "Untitled").slice(0, 120),
    type: o.type || "other",
    photoUrl: o.photoUrl || "",
    text: String(o.text || ""),
    feedbackCount: o.feedbackCount || 0,
    teacherIds: o.teacherIds || [],
    createdAt: o.createdAt || Date.now()
  };
}

function myworkList() { return S.mywork || (S.mywork = []); }
function typeOf(id) {
  return MW_TYPES.find(function (t) { return t.id === id; }) || MW_TYPES[MW_TYPES.length - 1];
}

const CAT_META = {
  grammar: { icon: "🔧", name: "Grammar" },
  vocabulary: { icon: "🧠", name: "Vocabulary" },
  organization: { icon: "🧱", name: "Organization" },
  spelling: { icon: "🔤", name: "Spelling" },
  punctuation: { icon: "✏️", name: "Punctuation" }
};

/* ---------------- browser-only: image handling ---------------- */

function fileToImage(file) {
  return new Promise(function (resolve, reject) {
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("Could not read that image.")); };
    img.src = url;
  });
}

function drawScaled(img, maxSide) {
  var w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
  var s = targetSize(w, h, maxSide);
  var c = document.createElement("canvas");
  c.width = s.w; c.height = s.h;
  c.getContext("2d").drawImage(img, 0, 0, s.w, s.h);
  return c;
}

function canvasBlob(canvas) {
  return new Promise(function (resolve) {
    if (canvas.toBlob) canvas.toBlob(function (b) { resolve(b); }, "image/jpeg", MW_JPEG_Q);
    else resolve(null);
  });
}

async function handleFile(file) {
  if (!file) return;
  if (file.size > 20 * 1024 * 1024) { toast("That photo is too big — try a smaller one."); return; }
  try {
    var img = await fileToImage(file);
    var full = drawScaled(img, MW_PHOTO_MAX);
    var thumb = drawScaled(img, MW_THUMB_MAX);
    cur.photoDataUrl = full.toDataURL("image/jpeg", MW_JPEG_Q);
    cur.thumbDataUrl = thumb.toDataURL("image/jpeg", MW_JPEG_Q);
    cur.blob = await canvasBlob(full);
    cur.title = cur.title || $("mwTitle").value.trim();
    renderPhotoStep();
  } catch (e) {
    toast("Could not read that photo. Try another one, or type your work.");
  }
}

/* ---------------- browser-only: lazy OCR ---------------- */

var tessPromise = null;
function loadTesseract() {
  if (tessPromise) return tessPromise;
  tessPromise = new Promise(function (resolve, reject) {
    try {
      if (typeof window !== "undefined" && window.Tesseract) return resolve(window.Tesseract);
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      s.onload = function () {
        if (window.Tesseract) resolve(window.Tesseract);
        else reject(new Error("tesseract unavailable"));
      };
      s.onerror = function () { reject(new Error("cdn unreachable")); };
      document.head.appendChild(s);
    } catch (e) { reject(e); }
  });
  // allow a later retry after a failure
  tessPromise.catch(function () { tessPromise = null; });
  return tessPromise;
}

async function runOcr(dataUrl) {
  var T = await loadTesseract();
  var worker = await T.createWorker("eng");
  try {
    var res = await worker.recognize(dataUrl);
    return (res && res.data && res.data.text) || "";
  } finally {
    try { await worker.terminate(); } catch (e) {}
  }
}

/* ---------------- persistence + online sync ---------------- */

function persistItem(item) {
  var list = myworkList();
  var ix = list.findIndex(function (x) { return x.id === item.id; });
  if (ix >= 0) list[ix] = item; else list.unshift(item);
  var kept = evictOldest(list, MW_MAX_ITEMS);
  var fit = fitPhotoBudget(kept, MW_BUDGET);
  S.mywork = fit.items;
  save();
  return fit.stripped;
}

/* Best-effort cloud sync: photo → Firebase Storage, metadata → Firestore.
   The Firestore doc carries only the download URL, never photo bytes.
   The local item remembers its photoUrl so revising text later never
   blanks a previously uploaded photo. */
function syncOnline(item) {
  if (!isConfigured()) return;
  var f = fb();
  if (!f.ready || !f.user || !S.profile.uid) return;
  (async function () {
    try {
      var url = item.photoUrl || "";
      if (cur && cur.blob) {
        url = await uploadWorkPhoto(S.profile.uid, item.id, cur.blob) || url;
      }
      await saveWorkUpload(S.profile.uid, item.id, {
        title: item.title, type: item.type, photoUrl: url,
        text: item.text, feedbackCount: (item.feedback || []).length,
        createdAt: item.createdAt
      });
      if (url && url !== item.photoUrl) {
        item.photoUrl = url;
        var list = myworkList();
        var ix = list.findIndex(function (x) { return x.id === item.id; });
        if (ix >= 0) { list[ix] = item; save(); }
      }
    } catch (e) { /* local copy is the source of truth */ }
  })();
}

/* ---------------- UI ---------------- */

var cur = null; // working draft for a new upload

export function renderMywork() {
  cur = null;
  renderHub();
  show("screen-mywork", "mywork");
}

function renderHub() {
  var body = $("myworkBody");
  var list = myworkList().slice()
    .sort(function (a, b) { return b.createdAt - a.createdAt; });
  var html = '<div class="row-btns"><button class="btn-primary" id="mwNew">＋ New upload</button></div>';
  if (!list.length) {
    html += '<div class="notice">📸 Write a story, application, essay or letter on paper, ' +
      "photograph it, and I'll read your handwriting and give feedback — just like the Writing Lab.</div>";
  } else {
    html += '<div class="mw-grid">' + list.map(function (it) {
      var t = typeOf(it.type);
      return '<button class="mw-card" data-mw="' + it.id + '">' +
        (it.thumbDataUrl
          ? '<img src="' + it.thumbDataUrl + '" alt="photo of your work">'
          : '<div class="mw-notile">' + t.emoji + "</div>") +
        '<div class="mw-meta"><strong>' + esc(it.title || "Untitled") + "</strong>" +
        '<span class="fine">' + t.emoji + " " + t.name + " · " + fmtDate(it.createdAt) + "</span>" +
        '<span class="fine">💬 ' + (it.feedback || []).length + " feedback notes" +
        (it.photoDataUrl ? "" : (it.thumbDataUrl ? " · photo trimmed to save space" : "")) + "</span></div></button>";
    }).join("") + "</div>";
  }
  body.innerHTML = html;
  $("mwNew").addEventListener("click", renderSetup);
  body.querySelectorAll("[data-mw]").forEach(function (b) {
    b.addEventListener("click", function () { openDetail(b.getAttribute("data-mw")); });
  });
}

function renderSetup() {
  cur = {
    id: uid("mw"), type: "story", title: "",
    photoDataUrl: "", thumbDataUrl: "", photoUrl: "", blob: null,
    text: "", feedback: [], createdAt: Date.now()
  };
  var body = $("myworkBody");
  body.innerHTML =
    '<div class="form-card"><button class="back-btn" id="mwBack">← My Work</button>' +
    "<h3>What did you write?</h3>" +
    '<div class="chipwrap" id="mwTypes">' + MW_TYPES.map(function (t) {
      return '<button class="chipbtn' + (t.id === cur.type ? " on" : "") + '" data-t="' + t.id + '">' +
        t.emoji + " " + t.name + "</button>";
    }).join("") + "</div>" +
    '<div class="field"><label>Title (optional)</label>' +
    '<input id="mwTitle" maxlength="120" placeholder="e.g. My summer holidays"></div>' +
    "<h3>Add it</h3>" +
    '<div class="mw-upbtns">' +
    '<label class="btn-upload">📷 Take photo<input type="file" id="mwCam" accept="image/*" capture="environment" class="hidden"></label>' +
    '<label class="btn-upload">🖼️ Choose photo<input type="file" id="mwPick" accept="image/*" class="hidden"></label>' +
    '<button class="btn-upload" id="mwType">⌨️ Type / paste text</button>' +
    "</div>" +
    '<p class="fine">Photos stay on this device unless you sign in online — then they sync privately to your account. Other students can never see your work.</p></div>';
  body.querySelectorAll("#mwTypes [data-t]").forEach(function (b) {
    b.addEventListener("click", function () {
      cur.type = b.getAttribute("data-t");
      body.querySelectorAll("#mwTypes .chipbtn").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
    });
  });
  $("mwBack").addEventListener("click", renderHub);
  $("mwCam").addEventListener("change", function (e) { handleFile(e.target.files[0]); });
  $("mwPick").addEventListener("change", function (e) { handleFile(e.target.files[0]); });
  $("mwType").addEventListener("click", function () {
    cur.title = $("mwTitle").value.trim();
    renderEditText("", false);
  });
}

function renderPhotoStep() {
  var body = $("myworkBody");
  body.innerHTML =
    '<div class="form-card"><button class="back-btn" id="mwBack2">← Start over</button>' +
    "<h3>Your photo</h3>" +
    '<img class="mw-preview" src="' + cur.photoDataUrl + '" alt="photo of your handwritten work">' +
    '<div class="row-btns">' +
    '<button class="btn-primary" id="mwScan">🔍 Scan photo — read my handwriting</button>' +
    '<button class="btn-ghost" id="mwTypeInstead">⌨️ I\'ll type it instead</button>' +
    "</div>" +
    '<p class="fine">The reader downloads a small tool the first time (needs internet once). ' +
    "Handwriting reading isn't perfect — you'll check and fix the text before getting feedback.</p></div>";
  $("mwBack2").addEventListener("click", renderSetup);
  $("mwScan").addEventListener("click", renderScanning);
  $("mwTypeInstead").addEventListener("click", function () { renderEditText("", false); });
}

function renderScanning() {
  var body = $("myworkBody");
  body.innerHTML =
    '<div class="form-card"><h3>🔍 Reading your handwriting…</h3>' +
    '<div class="mw-progress"><div class="mw-bar"></div></div>' +
    '<p class="fine" id="mwScanNote">This can take half a minute on a phone. Please wait.</p></div>';
  runOcr(cur.photoDataUrl).then(function (raw) {
    renderEditText(sanitizeOcrText(raw), true);
  }).catch(function () {
    var b2 = $("myworkBody");
    b2.innerHTML =
      '<div class="form-card"><h3>📶 The photo reader needs internet</h3>' +
      '<p>The handwriting reader downloads a small tool the first time, and it looks like ' +
      "you're offline right now. No problem — you can type your work instead and still get feedback.</p>" +
      '<div class="row-btns"><button class="btn-primary" id="mwTypeFallback">⌨️ Type my work</button>' +
      '<button class="btn-ghost" id="mwRetryScan">🔁 Try scanning again</button></div></div>';
    $("mwTypeFallback").addEventListener("click", function () { renderEditText("", false); });
    $("mwRetryScan").addEventListener("click", renderScanning);
  });
}

/* The mandatory honesty step: the student always sees and fixes the text
   before any feedback is given. fromOcr=true shows the accuracy warning. */
function renderEditText(prefill, fromOcr) {
  cur.text = prefill;
  var body = $("myworkBody");
  body.innerHTML =
    '<div class="form-card"><button class="back-btn" id="mwBack3">← Back</button>' +
    "<h3>Check your text</h3>" +
    (fromOcr
      ? '<div class="notice warn">🤖 Handwriting reading isn\'t perfect — I may have misread some words. ' +
        "<strong>Check what I read — fix any mistakes</strong>, then get feedback.</div>"
      : "") +
    '<div class="field"><label>Your work (edit freely)</label>' +
    '<textarea id="mwText" rows="10" placeholder="Your story, application, essay…"></textarea></div>' +
    '<div class="row-btns"><button class="btn-primary" id="mwGetFb">Get feedback</button></div>' +
    '<div id="mwOut"></div></div>';
  $("mwText").value = prefill;
  $("mwBack3").addEventListener("click", function () {
    if (cur.photoDataUrl) renderPhotoStep(); else renderSetup();
  });
  $("mwGetFb").addEventListener("click", giveFeedback);
}

function feedbackHTML(text, issues) {
  var html = '<div class="wr-text"><h4>Your text</h4><p>' + esc(text).replace(/\n/g, "<br>") + "</p></div>";
  if (!issues.length) {
    html += '<div class="notice ok">🎉 Excellent! I found no issues in this piece. Keep writing!</div>';
  } else {
    html += "<h4>" + issues.length + " thing" + (issues.length === 1 ? "" : "s") + " to look at</h4>";
    html += issues.map(function (is) {
      var meta = CAT_META[is.category] || { icon: "•", name: is.category };
      return '<div class="fb-card"><div class="fb-head">' + meta.icon + " <strong>" + meta.name + "</strong>" +
        (is.found ? ' · <code>"' + esc(is.found) + '"</code>' : "") + "</div>" +
        "<p>" + esc(is.explain) + "</p>" +
        '<p class="fb-hint">💡 Hint: ' + esc(is.hint) + "</p></div>";
    }).join("");
    html += '<div class="notice">Now it\'s your turn: fix these in your text, then press <strong>Check again</strong>. ' +
      "I will never rewrite it for you — fixing it yourself is how the learning sticks.</div>";
  }
  return html;
}

function giveFeedback() {
  var text = $("mwText").value.trim();
  var out = $("mwOut");
  if (text.length < 10) {
    out.innerHTML = '<p class="fine">Write a little more first — then I\'ll give feedback.</p>';
    return;
  }
  cur.text = text;
  if (!cur.title) cur.title = ($("mwTitle") && $("mwTitle").value.trim()) || defaultTitle();
  var t = typeOf(cur.type);
  var res = analyzeWriting(text, { kind: t.kind, minWords: 40 });
  cur.feedback = res.issues;
  var isNew = !myworkList().some(function (x) { return x.id === cur.id; });
  var stripped = persistItem(cur);
  if (isNew) {
    // count toward the Writing Star badge, like the Writing Lab does
    S.writing.push({ id: cur.id, promptId: "mywork", title: cur.title, words: text.split(/\s+/).length, issues: res.issues.length, date: Date.now() });
    save();
  }
  touchStreak();
  awardXP(XP_TABLE.writingChecked, "my work feedback");
  checkBadges();
  syncOnline(cur);

  var html = feedbackHTML(text, res.issues) +
    '<div class="row-btns"><button class="btn-primary" id="mwRecheck">Check again</button> ' +
    '<button class="btn-ghost" id="mwDone">Done</button></div>' +
    (stripped ? '<p class="fine">ℹ️ To save space on this device, the full photo of your oldest work was trimmed (thumbnail kept).</p>' : "");
  out.innerHTML = html;
  $("mwRecheck").addEventListener("click", function () { renderEditText($("mwText").value, false); });
  $("mwDone").addEventListener("click", renderHub);
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}

function defaultTitle() {
  var t = typeOf(cur.type);
  return t.name + " — " + fmtDate(cur.createdAt);
}

function openDetail(id) {
  var it = myworkList().find(function (x) { return x.id === id; });
  if (!it) { renderHub(); return; }
  cur = null;
  var t = typeOf(it.type);
  var body = $("myworkBody");
  body.innerHTML =
    '<div class="form-card"><button class="back-btn" id="mwBack4">← My Work</button>' +
    "<h3>" + esc(it.title || "Untitled") + "</h3>" +
    '<p class="fine">' + t.emoji + " " + t.name + " · " + fmtDate(it.createdAt) + "</p>" +
    (it.photoDataUrl
      ? '<img class="mw-preview" src="' + it.photoDataUrl + '" alt="photo of your handwritten work">'
      : (it.thumbDataUrl ? '<img class="mw-preview" src="' + it.thumbDataUrl + '" alt="thumbnail of your work">' : "")) +
    '<div class="wr-text"><h4>Your text</h4><p>' + esc(it.text).replace(/\n/g, "<br>") + "</p></div>" +
    (it.feedback && it.feedback.length
      ? "<h4>Past feedback (" + it.feedback.length + ")</h4>" + feedbackHTML(it.text, it.feedback)
      : '<p class="fine">No feedback saved for this piece yet.</p>') +
    '<div class="row-btns"><button class="btn-primary" id="mwRevise">✏️ Revise & check again</button> ' +
    '<button class="btn-danger" id="mwDelete">🗑 Delete</button></div></div>';
  $("mwBack4").addEventListener("click", renderHub);
  $("mwRevise").addEventListener("click", function () {
    // reopen as a working draft (photo kept for reference)
    cur = Object.assign({}, it, { blob: null });
    renderEditText(it.text, false);
  });
  $("mwDelete").addEventListener("click", function () {
    if (!confirm("Delete this piece of work? This cannot be undone.")) return;
    S.mywork = myworkList().filter(function (x) { return x.id !== id; });
    save();
    toast("Deleted.");
    renderHub();
  });
}
