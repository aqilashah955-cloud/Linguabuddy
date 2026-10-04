// LinguaBuddy — tests for 🌍 More International Tests (plain node, no DOM).

import assert from "node:assert/strict";
import {
  toeflSectionScore, toeflTotal, pteScore, cambridgeB2, cambridgeC1,
  toeicSection, toeicTotal, scoreMCQ, scoreFill, pctOf, testMeta
} from "../js/moretests.js";
import { TOEFL, PTE, CAMBRIDGE, TOEIC, OET, DATA_VERSION_MORETESTS } from "../data/moretests.js";

let n = 0;
function ok(cond, msg) { n++; assert.ok(cond, msg); }

/* ---- version ---- */
ok(DATA_VERSION_MORETESTS === "1.0.0", "data versioned");

/* ---- TOEFL scoring ---- */
ok(toeflSectionScore(30, 30) === 30, "toefl perfect");
ok(toeflSectionScore(0, 30) === 0, "toefl zero");
ok(toeflSectionScore(20, 40) === 15, "toefl half");
ok(toeflSectionScore(5, 0) === 0, "toefl empty total safe");
ok(toeflTotal([30, 30, 30, 30]) === 120, "toefl total max");
ok(toeflTotal([20, 22, 18, 25]) === 85, "toefl total sum");

/* ---- PTE scoring ---- */
ok(pteScore(10, 10) === 90, "pte perfect");
ok(pteScore(0, 10) === 10, "pte zero");
ok(pteScore(5, 10) === 50, "pte half");
ok(pteScore(3, 0) === 10, "pte empty total safe");

/* ---- Cambridge grades ---- */
ok(cambridgeB2(90).grade === "Grade A", "b2 90 -> A");
ok(cambridgeB2(78).grade === "Grade B", "b2 78 -> B");
ok(cambridgeB2(68).grade === "Grade C", "b2 68 -> C");
ok(cambridgeB2(58).grade === "Level B1", "b2 58 -> B1");
ok(cambridgeB2(40).grade === "Below B1", "b2 40 -> below");
ok(cambridgeC1(82).grade === "Grade A", "c1 82 -> A");
ok(cambridgeC1(72).grade === "Grade B", "c1 72 -> B");
ok(cambridgeC1(62).grade === "Grade C", "c1 62 -> C");
ok(cambridgeC1(52).grade === "Level B2", "c1 52 -> B2");
ok(cambridgeC1(30).grade === "Below B2", "c1 30 -> below");

/* ---- TOEIC scoring ---- */
ok(toeicSection(100, 100) === 495, "toeic perfect -> 495");
ok(toeicSection(0, 100) === 5, "toeic zero -> 5");
ok(toeicSection(50, 100) === 250, "toeic half -> 250");
ok(toeicSection(1, 0) === 5, "toeic empty total safe");
ok(toeicSection(33, 100) % 5 === 0, "toeic rounds to nearest 5");
ok(toeicTotal(495, 495) === 990, "toeic total max 990");

/* ---- generic graders ---- */
ok(scoreMCQ([{ a: 0 }, { a: 2 }], [0, 1]).correct === 1, "scoreMCQ counts");
ok(scoreMCQ([{ a: 0 }], [-1]).correct === 0, "scoreMCQ unanswered wrong");
ok(scoreFill([{ a: "than" }], [" THAN "]).correct === 1, "scoreFill case-insensitive");
ok(scoreFill([{ a: "than" }], [""]).correct === 0, "scoreFill blank wrong");
ok(pctOf(3, 4) === 75, "pctOf");
ok(pctOf(0, 0) === 0, "pctOf empty safe");

/* ---- testMeta ---- */
ok(testMeta("toefl").title === "TOEFL iBT", "meta toefl");
ok(testMeta("oet").title === "OET", "meta oet");
ok(testMeta("nope") === undefined, "meta unknown undefined");

/* ---- TOEFL data integrity ---- */
ok(TOEFL.reading.length === 2, "2 toefl reading passages");
TOEFL.reading.forEach(function (p) {
  ok(p.text.length > 500, "passage " + p.id + " substantial");
  ok(p.questions.length === 6, "passage " + p.id + " has 6 questions");
  p.questions.forEach(function (q, i) {
    ok(Array.isArray(q.o) && q.o.length === 4, "toefl reading q" + i + " has 4 options");
    ok(q.a >= 0 && q.a < 4, "toefl reading q" + i + " answer in range");
  });
});
ok(TOEFL.listening.length === 2, "2 toefl listening scripts");
TOEFL.listening.forEach(function (p) {
  ok(p.script.length > 300, "listening " + p.id + " script non-empty");
  ok(p.questions.length === 5, "listening " + p.id + " has 5 questions");
  p.questions.forEach(function (q, i) {
    ok(q.o.length === 4 && q.a >= 0 && q.a < 4, "toefl listening q" + i + " valid");
  });
});
ok(TOEFL.speaking.length === 4, "4 toefl speaking tasks");
TOEFL.speaking.forEach(function (t) {
  ok(t.prompt && t.prep > 0 && t.talk > 0, "speaking " + t.id + " has prompt+timers");
  if (t.kind === "integrated") ok(t.read && t.listen, "integrated " + t.id + " has read+listen");
});
ok(TOEFL.writing.length === 2, "2 toefl writing tasks");
TOEFL.writing.forEach(function (t) { ok(t.prompt && t.minutes > 0 && t.criteria.length > 0, "writing " + t.id + " complete"); });
ok(TOEFL.tips.length === 6, "6 toefl tips");

/* ---- PTE data integrity ---- */
ok(PTE.readAloud.length === 6, "6 read-aloud texts");
PTE.readAloud.forEach(function (t) {
  var w = t.split(/\s+/).length;
  ok(w >= 35 && w <= 70, "read-aloud length " + w + " words in range");
});
ok(PTE.fibRW.length === 8, "8 PTE blanks");
PTE.fibRW.forEach(function (x, i) { ok(x.s.indexOf("___") >= 0 && x.a, "pte fib " + i + " has blank+answer"); });
ok(PTE.repeatSentence.length === 8, "8 repeat sentences");
ok(PTE.describeImage.length === 4, "4 describe-image prompts");
ok(PTE.retellLecture.length === 4, "4 retell lectures");
PTE.retellLecture.forEach(function (s, i) { ok(s.split(/\s+/).length > 80, "retell " + i + " substantial"); });
ok(PTE.writeEssay.length === 4, "4 pte essays");
ok(PTE.tips.length === 6, "6 pte tips");

/* ---- Cambridge data integrity ---- */
["b2", "c1"].forEach(function (lvl) {
  var d = CAMBRIDGE[lvl];
  d.mcCloze.forEach(function (x, i) { ok(x.s.indexOf("___") >= 0 && x.o.length === 4 && x.a >= 0 && x.a < 4, lvl + " mcCloze " + i + " valid"); });
  d.openCloze.forEach(function (x, i) { ok(x.s.indexOf("___") >= 0 && x.a, lvl + " openCloze " + i + " valid"); });
  d.wordFormation.forEach(function (x, i) { ok(x.s.indexOf("___") >= 0 && x.root && x.a, lvl + " wordFormation " + i + " valid"); });
});
ok(CAMBRIDGE.b2.mcCloze.length === 8 && CAMBRIDGE.c1.mcCloze.length === 6, "cambridge cloze counts");
ok(CAMBRIDGE.gappedText.length === 2, "2 gapped-text exercises");
CAMBRIDGE.gappedText.forEach(function (g) {
  ok(g.paragraphs.length === 6, "gapped " + g.id + " has 6 paragraphs");
  ok(g.headings.length === 7, "gapped " + g.id + " has 7 headings (1 extra)");
  ok(g.answers.length === 6, "gapped " + g.id + " has 6 answers");
  var used = {};
  g.answers.forEach(function (a, i) {
    ok(a >= 0 && a < 7, "gapped " + g.id + " answer " + i + " in range");
    ok(!used[a], "gapped " + g.id + " no duplicate heading");
    used[a] = true;
  });
  ok(Object.keys(used).length === 6, "gapped " + g.id + " leaves exactly 1 heading unused");
});
ok(CAMBRIDGE.tips.length === 5, "5 cambridge tips");

/* ---- TOEIC data integrity ---- */
ok(TOEIC.photo.length === 10, "10 toeic photos");
TOEIC.photo.forEach(function (p, i) {
  ok(p.photo && p.s.length === 4 && p.a >= 0 && p.a < 4, "toeic photo " + i + " valid");
});
ok(TOEIC.response.length === 10, "10 toeic responses");
TOEIC.response.forEach(function (p, i) {
  ok(p.q && p.o.length === 3 && p.a >= 0 && p.a < 3, "toeic response " + i + " valid");
});
ok(TOEIC.incomplete.length === 15, "15 incomplete sentences");
TOEIC.incomplete.forEach(function (x, i) {
  ok(x.s.indexOf("___") >= 0 && x.o.length === 4 && x.a >= 0 && x.a < 4, "toeic incomplete " + i + " valid");
});
ok(TOEIC.textCompletion.length === 2, "2 text-completion passages");
TOEIC.textCompletion.forEach(function (p, i) {
  ok(p.blanks.length === 5, "toeic tc " + i + " has 5 blanks");
  var n = (p.text.match(/__\d__/g) || []).length;
  ok(n === 5, "toeic tc " + i + " has 5 blank markers in text");
  p.blanks.forEach(function (b, j) { ok(b.o.length === 4 && b.a >= 0 && b.a < 4, "toeic tc " + i + " blank " + j + " valid"); });
});
ok(TOEIC.tips.length === 5, "5 toeic tips");

/* ---- OET data integrity ---- */
ok(OET.overview.subtests.length === 4, "oet 4 sub-tests");
ok(OET.tips.length === 6, "6 oet tips");
ok(OET.letters.length === 4, "4 oet letters");
OET.letters.forEach(function (l) {
  ok(l.scenario && l.notes.length >= 4 && l.structure.length >= 4, "oet letter " + l.id + " has scenario+notes+structure");
});

console.log(n + " passed, 0 failed");
