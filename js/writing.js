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
  teh: "the", recieve: "receive", adress: "address", becuase: "because", becasue: "because",
  definately: "definitely", seperate: "separate", wich: "which", whitch: "which",
  freind: "friend", freinds: "friends", writting: "writing", grammer: "grammar",
  happyness: "happiness", tommorow: "tomorrow", enviroment: "environment",
  beautifull: "beautiful", knowlege: "knowledge", occassion: "occasion",
  coutries: "countries", coutry: "country", thier: "their", beleive: "believe",
  neccessary: "necessary", exersise: "exercise", alot: "a lot", untill: "until",
  occured: "occurred", begining: "beginning", arguement: "argument",
  maintanance: "maintenance", posession: "possession", tendancy: "tendency"
};
/* Lowercase words that must always be capitalized (languages, places). */
const PROPER = {
  english: "English", urdu: "Urdu", pakistan: "Pakistan", lahore: "Lahore",
  karachi: "Karachi", islamabad: "Islamabad", punjab: "Punjab", sindh: "Sindh",
  america: "America", england: "England", india: "India", quran: "Quran"
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

/* Pure: returns {issues:[{category, found, explain, hint}], marks:[{at,len,cat}]}.
   issues keep the stable {category,found,explain,hint} shape (tests + My Work rely on it).
   marks carry exact character offsets so the UI can highlight precisely what is wrong.
   The function only DESCRIBES problems; it never produces corrected text. */
export function analyzeWriting(text, prompt) {
  const issues = [];
  const marks = [];
  const t = String(text || "").trim();
  const words = wordsOf(t);
  const sents = sentencesOf(t);

  function mark(at, len, cat) {
    if (typeof at !== "number" || at < 0 || at >= t.length) return;
    marks.push({ at: at, len: Math.max(1, len | 0), cat: cat });
  }
  function add(category, found, explain, hint, ats, len) {
    if (issues.length >= 8) return;
    if (issues.some(function (x) { return x.category === category && x.found === found; })) return;
    issues.push({ category: category, found: found, explain: explain, hint: hint });
    if (ats != null) {
      (Array.isArray(ats) ? ats : [ats]).forEach(function (a) { mark(a, len, category); });
    }
  }
  /* Collect every match offset of a global regex. max caps runaway loops. */
  function allIdx(re, max) {
    const out = [];
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(t)) !== null) {
      out.push({ i: m.index, m: m });
      if (out.length >= (max || 12)) break;
      if (m[0].length === 0) re.lastIndex++;
    }
    return out;
  }
  function isSentenceStart(idx) {
    return idx === 0 || /[.!?…]["']?\s+$/.test(t.slice(0, idx));
  }

  if (!t) return { issues: issues, marks: marks };

  // ---- spelling: common misspellings (every occurrence marked) ----
  Object.keys(SPELLING).forEach(function (w) {
    const hits = allIdx(new RegExp("\\b" + w + "\\b", "gi"));
    if (!hits.length) return;
    const shown = hits[0].m[0];
    const n = hits.length;
    add("spelling", shown,
      "“" + shown + "” is spelled “" + SPELLING[w] + "”." + (n > 1 ? " It appears " + n + " times — fix them all." : ""),
      "Sound the word out slowly, then fix it letter by letter.",
      hits.map(function (h) { return h.i; }), shown.length);
  });

  // ---- grammar: subject–verb agreement & articles (every occurrence marked) ----
  const GRAMMAR_RULES = [
    { re: /\bi\s+(goes|eats|plays|does|has|watches|writes|reads)\b/gi,
      why: "After “I”, use the base form of the verb — “I go”, “I eat”, “I play” — never with -s.",
      hint: "Remove the -s ending after “I”. What is the base verb here?" },
    { re: /\b(he|she|it)\s+(go|eat|play|do|have|watch|write|read)\b(?!\s+(a|the|to)\b)/gi,
      why: "With “he / she / it”, most verbs add -s: “he goes”, “she eats”. (“have” becomes “has”.)",
      hint: "How does this verb change after “he / she / it”?" },
    { re: /\b(me|him|her|them)\s+(am|is|are|was|were)\b/gi,
      why: "“me / him / her / them” are object pronouns — they cannot start a sentence. Use “I / he / she / they”: “I am”, “they are”.",
      hint: "Which subject pronoun replaces this word?" },
    { re: /\ba\s+[aeiou][a-z]+\b/gi,
      why: "Use “an” (not “a”) before a word that starts with a vowel sound: “an apple”, “an umbrella”.",
      hint: "What sound does the next word start with — a vowel or a consonant?" },
    { re: /\bdid\s+not\s+\w+ed\b/gi,
      why: "After “did / did not”, use the base verb: “did not go” — not “did not went”. “Did” already shows the past.",
      hint: "“Did” already shows the past. What is the base form of this verb?" },
    { re: /\bdidn'?t\s+\w+ed\b/gi,
      why: "After “didn't”, use the base verb: “didn't go” — not “didn't went”.",
      hint: "What is the base form of this verb?" },
    { re: /\b([a-z]{2,})\s+\1\b/gi,
      why: "You repeated a word. One is enough — delete the extra one.",
      hint: "Read the sentence aloud. Where do you stumble on the repeated word?" }
  ];
  GRAMMAR_RULES.forEach(function (r) {
    const hits = allIdx(r.re);
    if (!hits.length) return;
    // "an + consonant" needs its exception check; keep it out of the table
    const shown = hits[0].m[0];
    add("grammar", shown, r.why + (hits.length > 1 ? " (Found " + hits.length + " times.)" : ""), r.hint,
      hits.map(function (h) { return h.i; }), shown.length);
  });
  // an + consonant (with hour/honest exceptions)
  (function () {
    const hits = allIdx(/\ban\s+([a-z]+)\b/gi).filter(function (h) {
      return !/^(hour|honest|honour|heir)/i.test(h.m[1]);
    }).filter(function (h) { return !/^[aeiou]/i.test(h.m[1]); });
    if (!hits.length) return;
    const shown = hits[0].m[0];
    add("grammar", shown,
      "Use “a” (not “an”) before a word that starts with a consonant sound: “a book”, “a cat”.",
      "What sound does the next word start with?",
      hits.map(function (h) { return h.i; }), shown.length);
  })();

  // ---- punctuation / capitalization ----
  // standalone "i" meaning yourself (never the i inside "things"!)
  (function () {
    const hits = allIdx(/(^|[\s("])i(?=[\s.,!?)'":;])/g);
    if (!hits.length) return;
    const ats = hits.map(function (h) { return h.i + h.m[1].length; });
    add("punctuation", "i",
      "The pronoun “I” is always capital, even mid-sentence." + (ats.length > 1 ? " I found " + ats.length + " small “i”s." : ""),
      "Find every small “i” that means “yourself” and capitalize it.",
      ats, 1);
  })();
  // proper nouns in lowercase (english -> English), except at sentence start
  Object.keys(PROPER).forEach(function (w) {
    const hits = allIdx(new RegExp("\\b" + w + "\\b", "g")).filter(function (h) { return !isSentenceStart(h.i); });
    if (!hits.length) return;
    const shown = hits[0].m[0];
    add("punctuation", shown,
      "“" + PROPER[w] + "” is a name — names of languages and places always start with a capital letter.",
      "Which words in your text are names? Capitalize their first letter.",
      hits.map(function (h) { return h.i; }), shown.length);
  });
  // sentences starting with a small letter (skip "i" — the pronoun rule covers it)
  (function () {
    const ats = [];
    const first = t.match(/^([a-z])/);
    if (first && first[1] !== "i") ats.push(0);
    allIdx(/([.!?…]["']?\s+)([a-z])/g).forEach(function (h) {
      const at = h.i + h.m[1].length;
      if (h.m[2] !== "i") ats.push(at);
    });
    if (!ats.length) return;
    const letters = ats.map(function (a) { return t[a]; });
    const uniq = letters.filter(function (c, ix) { return letters.indexOf(c) === ix; });
    add("punctuation", uniq.join(", "),
      "Every sentence must start with a capital letter." + (ats.length > 1 ? " I found " + ats.length + " sentences starting small." : ""),
      "Look at the first letter of each sentence and capitalize it.",
      ats, 1);
  })();
  // missing space after punctuation: "day.We"
  (function () {
    const hits = allIdx(/([.!?,;:])(?=[A-Za-z])/g);
    if (!hits.length) return;
    add("punctuation", hits[0].m[0] + t[hits[0].i + 1],
      "Leave a space after . ! ? , ; and : — “day. We”, not “day.We”.",
      "Where do two words touch a punctuation mark with no space? Add one.",
      hits.map(function (h) { return h.i; }), 2);
  })();
  // no end mark at all
  if (t.length > 10 && !/[.!?…]["']?$/.test(t)) {
    add("punctuation", "",
      "Your writing does not end with a full stop (.), question mark (?) or exclamation mark (!).",
      "Read your last sentence aloud — how should it end?");
  }

  // ---- vocabulary ----
  const freq = {};
  words.forEach(function (w) { if (!STOP.has(w) && w.length > 3) freq[w] = (freq[w] || 0) + 1; });
  const rep = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; })[0];
  if (rep && freq[rep] >= 4) add("vocabulary", rep,
    "You used “" + rep + "” " + freq[rep] + " times. Repeating one word makes writing feel flat.",
    "Replace one “" + rep + "” with a synonym or a different phrase — which one?");
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

  return { issues: issues, marks: marks };
}

/* Offset-based highlighter: marks = [{at, len, cat}] on the RAW text.
   Escape-safe — it slices the raw text and escapes each piece, so offsets
   can never drift (the old indexOf-on-escaped-text approach highlighted the
   wrong characters, e.g. the "i" inside "things"). Overlapping marks: first wins. */
function highlight(text, marks) {
  const ms = (marks || []).slice().sort(function (a, b) { return a.at - b.at; });
  let out = "";
  let pos = 0;
  ms.forEach(function (m) {
    if (m.at < pos || m.at >= text.length) return;
    const end = Math.min(text.length, m.at + Math.max(1, m.len | 0));
    out += esc(text.slice(pos, m.at));
    out += '<mark class="mk-' + m.cat + '">' + esc(text.slice(m.at, end)) + "</mark>";
    pos = end;
  });
  out += esc(text.slice(pos));
  return out;
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

  let html = '<div class="wr-text"><h4>Your text</h4><p>' + highlight(text, res.marks) + "</p></div>";
  if (!res.issues.length) {
    html += '<div class="notice ok">🎉 Excellent! I found no issues in this piece. Try a harder prompt next.</div>';
  } else {
    // Group issues by category so feedback reads as a short, prioritized list
    // instead of many repetitive cards.
    const CAT_ORDER = ["spelling", "grammar", "punctuation", "vocabulary", "organization"];
    const groups = [];
    res.issues.forEach(function (is) {
      let g = null;
      for (let i = 0; i < groups.length; i++) if (groups[i].cat === is.category) g = groups[i];
      if (!g) { g = { cat: is.category, items: [] }; groups.push(g); }
      g.items.push(is);
    });
    groups.sort(function (a, b) { return CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat); });

    const total = res.issues.length;
    html += "<h4>" + total + " thing" + (total === 1 ? "" : "s") + " to look at</h4>";
    html += groups.map(function (g) {
      const meta = CAT_META[g.cat] || { icon: "•", name: g.cat };
      const lis = g.items.map(function (is) {
        return "<li>" + (is.found ? '<code>"' + esc(is.found) + '"</code> — ' : "") +
          esc(is.explain) + '<br><span class="fb-hint">💡 Hint: ' + esc(is.hint) + "</span></li>";
      }).join("");
      return '<div class="fb-card"><div class="fb-head">' + meta.icon + " <strong>" + meta.name + "</strong>" +
        ' <span class="fine">· ' + g.items.length + (g.items.length === 1 ? " issue" : " issues") + "</span></div>" +
        '<ul class="fb-list">' + lis + "</ul></div>";
    }).join("");

    // A little balance: name what's already working.
    const strengths = [];
    if (words >= 15 && !res.issues.some(function (x) { return x.category === "spelling"; }))
      strengths.push("clean spelling");
    if (words >= (curPrompt ? curPrompt.minWords : 40))
      strengths.push("reached the word target");
    if (sentencesOf(text).length >= 3)
      strengths.push(sentencesOf(text).length + " complete sentences");
    if (strengths.length)
      html += '<div class="notice ok">💪 What’s working: ' + esc(strengths.join(" · ")) + ". Keep it up!</div>";

    html += '<div class="notice">Now it’s your turn: edit your text above using these hints, then press <strong>Check Again</strong>. I will never rewrite it for you — fixing it yourself is how the learning sticks.</div>';
    html += '<div class="row-btns"><button class="btn-primary" id="wpRecheck">Check Again</button></div>';
  }
  out.innerHTML = html;
  const re = $("wpRecheck");
  if (re) re.addEventListener("click", checkWriting);
  out.scrollIntoView({ behavior: "smooth", block: "start" });
}
