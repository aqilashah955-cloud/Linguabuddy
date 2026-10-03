// LinguaBuddy — Writing Lab (Part 2).
// Keyword/rubric-based feedback. IMPORTANT RULE: this module NEVER
// rewrites the learner's text. Feedback highlights issues by category
// (grammar, vocabulary, organization, spelling, punctuation), explains
// each issue, gives a hint, and asks the learner to correct it.
// The learner's original text always stays on screen; only they edit it.
//
// Limitation (documented in README): checks are rule/keyword based, so
// they catch common learner errors, not every possible mistake.

import { S, save } from "./store.js";
import { WRITING_PROMPTS } from "../data/writing.js";
import { esc } from "./utils.js";
import { showScreen as show } from "./ui.js";
import { awardXP, checkBadges, XP_TABLE } from "./gamify.js";

function $(id) { return document.getElementById(id); }

let go = null;
export function setWritingGo(fn) { go = fn; }

const SPELLING = {
  teh: "the", recieve: "receive", adress: "address", becuase: "because",
  definately: "definitely", seperate: "separate", wich: "which",
  freind: "friend", writting: "writing", grammer: "grammar",
  happyness: "happiness", tommorow: "tomorrow", enviroment: "environment",
  beautifull: "beautiful", knowlege: "knowledge", occassion: "occasion"
};
const ADJECTIVES = ["big", "small", "tall", "short", "long", "red", "blue", "green", "black", "white",
  "yellow", "beautiful", "pretty", "ugly", "happy", "sad", "angry", "kind", "brave", "strong",
  "weak", "fast", "slow", "hot", "cold", "new", "old", "young", "rich", "poor", "clean", "dirty",
  "sweet", "bitter", "loud", "quiet", "bright", "dark", "busy", "free", "great", "good", "bad",
  "nice", "lovely", "wonderful", "amazing", "delicious", "fresh", "soft", "hard", "high", "low"];
const SEQ_WORDS = ["first", "then", "next", "after", "finally", "at last", "suddenly", "meanwhile", "later"];
const STOP = new Set("the,a,an,and,or,but,to,of,in,on,at,for,with,from,as,is,are,was,were,be,been,am,i,you,he,she,it,we,they,my,his,her,their,our,your,this,that,these,those,it,its,so,very,not,no,do,does,did,have,has,had,will,would,can,could,should,must".split(","));

function sentencesOf(text) {
  return text.split(/[.!?…]+/).map(function (s) { return s.trim(); }).filter(Boolean);
}
function wordsOf(text) {
  return (text.toLowerCase().match(/[a-z']+/g) || []);
}

/* Pure: returns {issues:[{category, found, explain, hint}]}.
   The function only DESCRIBES problems; it never produces corrected text. */
export function analyzeWriting(text, prompt) {
  const issues = [];
  const t = String(text || "").trim();
  const words = wordsOf(t);
  const sents = sentencesOf(t);

  function add(category, found, explain, hint) {
    if (issues.length >= 7) return;
    if (issues.some(function (x) { return x.category === category && x.found === found; })) return;
    issues.push({ category: category, found: found, explain: explain, hint: hint });
  }

  if (!t) return { issues: [] };

  // ---- spelling: common misspellings ----
  Object.keys(SPELLING).forEach(function (w) {
    const re = new RegExp("\\b" + w + "\\b", "i");
    const m = t.match(re);
    if (m) add("spelling", m[0],
      "“" + m[0] + "” is spelled incorrectly. The correct spelling is “" + SPELLING[w] + "”.",
      "Look at the word again and fix one letter at a time.");
  });

  // ---- grammar: subject–verb agreement ----
  let m1 = t.match(/\bi\s+(goes|eats|plays|does|has|watches|writes|reads)\b/i);
  if (m1) add("grammar", m1[0],
    "After “I”, use the base form of the verb: “I go”, “I eat”, “I play” — not “" + m1[0] + "”.",
    "Remove the -s ending after “I”. What is the base verb here?");
  let m2 = t.match(/\b(he|she|it)\s+(go|eat|play|do|have|watch|write|read)\b(?!\s+(a|the|to)\b)/i);
  if (m2) add("grammar", m2[0],
    "With “he / she / it”, most verbs add -s: “he goes”, “she eats”. (“have” becomes “has”.)",
    "How does this verb change after “he / she / it”?");
  let m3 = t.match(/\b(me|him|her|them)\s+(am|is|are|was|were)\b/i);
  if (m3) add("grammar", m3[0],
    "“me / him / her / them” are object pronouns — they cannot be the subject. Use “I / he / she / they”: “I am”, “they are”.",
    "Which subject pronoun replaces “" + m3[1] + "”?");
  let m4 = t.match(/\ba\s+[aeiou][a-z]+\b/i);
  if (m4) add("grammar", m4[0],
    "Use “an” (not “a”) before a word that starts with a vowel sound: “an apple”, “an umbrella”.",
    "What sound does the next word start with?");
  let m5 = t.match(/\ban\s+(?![aeiou])[a-z]+\b/i);
  if (m5 && !/an (hour|honest|honour)\b/i.test(m5[0])) add("grammar", m5[0],
    "Use “a” (not “an”) before a word that starts with a consonant sound: “a book”, “a cat”.",
    "What sound does the next word start with?");
  let m6 = t.match(/\bdid\s+not\s+\w+ed\b/i) || t.match(/\bdidn'?t\s+\w+ed\b/i);
  if (m6) add("grammar", m6[0],
    "After “did / did not”, use the base verb: “did not go” — not “did not went”.",
    "“Did” already shows the past. What is the base form of this verb?");

  // ---- punctuation / capitalization ----
  let m7 = t.match(/(^|[\s("])i(?=[\s.,!?)'"])/);
  if (m7) add("punctuation", "i",
    "The pronoun “I” is always written with a capital letter, even in the middle of a sentence.",
    "Find the small “i” that means yourself and capitalize it.");
  const firstCap = t.match(/^[a-z]/) || t.match(/[.!?…]\s+[a-z]/);
  if (firstCap) add("punctuation", firstCap[0].trim(),
    "Every sentence must start with a capital letter.",
    "Look at the first letter of each sentence.");
  if (t.length > 10 && !/[.!?…]["']?$/.test(t.trim())) add("punctuation", t.slice(-20),
    "Your writing does not end with a full stop (.), question mark (?) or exclamation mark (!).",
    "How should this last sentence end?");

  // ---- vocabulary ----
  const freq = {};
  words.forEach(function (w) { if (!STOP.has(w) && w.length > 3) freq[w] = (freq[w] || 0) + 1; });
  const rep = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; })[0];
  if (rep && freq[rep] >= 4) add("vocabulary", rep,
    "You used the word “" + rep + "” " + freq[rep] + " times. Repeating one word makes writing feel flat.",
    "Can you replace one “" + rep + "” with a synonym or a different phrase?");
  const adj = words.filter(function (w) { return ADJECTIVES.indexOf(w) >= 0; });
  if (prompt && prompt.kind === "descriptive" && adj.length < 2 && words.length > 15) add("vocabulary", "",
    "Descriptive writing paints a picture with describing words (adjectives). I found fewer than two.",
    "What color, size or feeling words could describe your subject?");
  if (words.length < (prompt ? prompt.minWords : 40)) add("vocabulary", "",
    "This is only " + words.length + " words. The task asks for about " + (prompt ? prompt.minWords : 40) + "+.",
    "Add one more detail: what happened, or how did it look or feel?");

  // ---- organization ----
  if (prompt) {
    const k = prompt.kind;
    if (k === "sentence" && sents.length < 3 && words.length > 5) add("organization", "",
      "This task asks for complete sentences — aim for at least three.",
      "Can you add one more full sentence about your topic?");
    if ((k === "letter" || k === "email") &&
        !/(dear|hello|assalam|respected|sir|madam)/i.test(t)) add("organization", "",
      "A " + k + " should open with a greeting (e.g. “Dear Sir,” or “Hello,”).",
      "How would you greet the person you are writing to?");
    if ((k === "letter" || k === "email") &&
        !/(yours|sincerely|regards|best|thank you|thanks)/i.test(t)) add("organization", "",
      "A " + k + " should close politely (e.g. “Yours sincerely,” or “Best regards,”).",
      "How do you want to sign off?");
    if ((k === "story" || k === "narrative") && !new RegExp(SEQ_WORDS.join("|"), "i").test(t) && words.length > 20) add("organization", "",
      "Stories flow better with sequence words: first, then, after that, finally.",
      "Add one sequence word to show the order of events.");
    if (k === "essay" && sents.length < 5 && words.length > 15) add("organization", "",
      "An essay needs an introduction, body and conclusion — at least a few sentences each.",
      "What is your main point? Add a sentence that states it clearly.");
    if (k === "paragraph" && sents.length < 3 && words.length > 10) add("organization", "",
      "A paragraph develops one idea in several connected sentences.",
      "Add 1–2 sentences that develop your idea further.");
    if (k === "essay" && !/\n\s*\n/.test(t) && words.length > 60) add("organization", "",
      "Long writing is easier to read in paragraphs — one main idea per paragraph.",
      "Where could you break this into a new paragraph?");
  }

  return { issues: issues };
}

function highlight(text, issues) {
  let h = esc(text);
  const seen = new Set();
  issues.forEach(function (is) {
    if (!is.found || seen.has(is.found)) return;
    seen.add(is.found);
    const needle = esc(is.found);
    const idx = h.indexOf(needle);
    if (idx >= 0) {
      h = h.slice(0, idx) + '<mark class="mk-' + is.category + '">' + needle + "</mark>" + h.slice(idx + needle.length);
    }
  });
  return h;
}

const CAT_META = {
  grammar: { icon: "🔧", name: "Grammar" },
  vocabulary: { icon: "🧠", name: "Vocabulary" },
  organization: { icon: "🧱", name: "Organization" },
  spelling: { icon: "🔤", name: "Spelling" },
  punctuation: { icon: "✏️", name: "Punctuation" }
};

const LEVEL_EMOJI = { Sentence: "✏️", Paragraph: "📝", Text: "📄" };

export function renderWriting() {
  const body = $("writingBody");
  let html = '<div class="chipwrap" id="wpChips">' +
    WRITING_PROMPTS.map(function (p) {
      return '<button class="chipbtn" data-wp="' + p.id + '">' +
        (LEVEL_EMOJI[p.level] || "✍️") + " " + esc(p.title) +
        ' <span class="fine">' + esc(p.level) + "</span></button>";
    }).join("") + "</div>" +
    '<div id="wpDetail"></div>';
  body.innerHTML = html;
  body.querySelectorAll("[data-wp]").forEach(function (b) {
    b.addEventListener("click", function () { openPrompt(b.getAttribute("data-wp")); });
  });
  show("screen-writing");
}

let curPrompt = null;

function openPrompt(pid) {
  curPrompt = WRITING_PROMPTS.find(function (p) { return p.id === pid; });
  const det = $("wpDetail");
  det.innerHTML = '<div class="form-card"><h3>' + (LEVEL_EMOJI[curPrompt.level] || "✍️") + " " + esc(curPrompt.title) + "</h3>" +
    '<p>' + esc(curPrompt.prompt) + "</p>" +
    ((curPrompt.keywords && curPrompt.keywords.length)
      ? '<p class="fine">Try to include: <strong>' + esc(curPrompt.keywords.join(", ")) + "</strong></p>" : "") +
    ((curPrompt.tips && curPrompt.tips.length)
      ? '<p class="fine">💡 ' + esc(curPrompt.tips.join(" ")) + "</p>" : "") +
    '<div class="field"><label>Your writing (about ' + curPrompt.minWords + "+ words)</label>" +
    '<textarea id="wpText" rows="8" placeholder="Write here…"></textarea></div>' +
    '<div class="row-btns"><button class="btn-primary" id="wpCheck">Get Feedback</button></div>' +
    '<div id="wpOut"></div></div>';
  $("wpCheck").addEventListener("click", checkWriting);
}

function checkWriting() {
  const text = $("wpText").value.trim();
  const out = $("wpOut");
  if (!text) { out.innerHTML = '<p class="fine">Write something first — then I’ll give feedback.</p>'; return; }
  const res = analyzeWriting(text, curPrompt);
  const words = wordsOf(text).length;
  const entry = {
    id: "w" + Date.now(), promptId: curPrompt.id, title: curPrompt.title,
    words: words, issues: res.issues.length, date: Date.now()
  };
  S.writing.push(entry); save();
  awardXP(XP_TABLE.writingChecked, "writing feedback");
  checkBadges();

  let html = '<div class="wr-text"><h4>Your text</h4><p>' + highlight(text, res.issues) + "</p></div>";
  if (!res.issues.length) {
    html += '<div class="notice ok">🎉 Excellent! I found no issues in this piece. Try a harder prompt next.</div>';
  } else {
    html += '<h4>' + res.issues.length + " thing" + (res.issues.length === 1 ? "" : "s") + " to look at</h4>";
    html += res.issues.map(function (is, i) {
      const meta = CAT_META[is.category] || { icon: "•", name: is.category };
      return '<div class="fb-card"><div class="fb-head">' + meta.icon + " <strong>" + meta.name + "</strong>" +
        (is.found ? ' · <code>"' + esc(is.found) + '"</code>' : "") + "</div>" +
        "<p>" + esc(is.explain) + "</p>" +
        '<p class="fb-hint">💡 Hint: ' + esc(is.hint) + "</p></div>";
    }).join("");
    html += '<div class="notice">Now it’s your turn: edit your text above using these hints, then press <strong>Check Again</strong>. I will never rewrite it for you — fixing it yourself is how the learning sticks.</div>';
    html += '<div class="row-btns"><button class="btn-primary" id="wpRecheck">Check Again</button></div>';
  }
  out.innerHTML = html;
  const re = $("wpRecheck");
  if (re) re.addEventListener("click", checkWriting);
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}
