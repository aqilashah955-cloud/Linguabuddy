// LinguaBuddy — Test Prep tests (plain node, no DOM, no network).
import assert from "node:assert/strict";
import { IELTS_READING, IELTS_LISTENING, IELTS_WRITING, IELTS_SPEAKING, IELTS_TIPS } from "../data/ielts.js";
import { DET_READ_SELECT_REAL, DET_READ_SELECT_FAKE, DET_READ_COMPLETE, DET_LISTEN_TYPE, DET_WRITING, DET_SPEAKING, DET_TIPS } from "../data/duolingo.js";
import {
  bandForListening, bandForReading, bandForScaled, detScore, overallBand,
  wordCount, detReadSelectScore, scoreListenType, ieltsWritingFeedback, speakingBandFromStars
} from "../js/testprep.js";

let n = 0;
function t(name, fn) { n++; try { fn(); } catch (e) { console.error("FAIL:", name, "-", e.message); process.exitCode = 1; } }

/* ---------- band tables ---------- */
t("listening boundaries", () => {
  assert.equal(bandForListening(40), 9);
  assert.equal(bandForListening(39), 9);
  assert.equal(bandForListening(30), 7);
  assert.equal(bandForListening(29), 6.5);
  assert.equal(bandForListening(16), 5.5);
  assert.equal(bandForListening(15), 4.5);
  assert.equal(bandForListening(0), 0);
});
t("reading boundaries", () => {
  assert.equal(bandForReading(40), 9);
  assert.equal(bandForReading(33), 7.5);
  assert.equal(bandForReading(30), 7);
  assert.equal(bandForReading(29), 6.5);
  assert.equal(bandForReading(15), 5);
  assert.equal(bandForReading(14), 4.5);
  assert.equal(bandForReading(0), 0);
});
t("bandForScaled proportions", () => {
  assert.equal(bandForScaled(8, 8, "reading"), 9);   // 100% -> 40 -> 9
  assert.equal(bandForScaled(6, 8, "reading"), bandForReading(30)); // 75% -> 30 -> 7
  assert.equal(bandForScaled(0, 8, "listening"), 0);
});
t("overallBand rounding", () => {
  assert.equal(overallBand([6, 6, 6.5, 7]), 6.5);     // 6.375 -> 6.5
  assert.equal(overallBand([6.5, 7, 7, 6.5]), 7);     // 6.75 -> 7
  assert.equal(overallBand([6.25]), 6.5);
  assert.equal(overallBand([6.75]), 7);
  assert.equal(overallBand([]), 0);
  assert.equal(overallBand([0, 0]), 0);
});

/* ---------- DET scoring ---------- */
t("detScore 10-160 scale", () => {
  assert.equal(detScore(18, 18), 160);
  assert.equal(detScore(0, 18), 10);
  assert.equal(detScore(9, 18), 85);
  assert.equal(detScore(0, 0), 10);
});
t("detReadSelectScore hits minus false alarms", () => {
  const deck = { real: ["cat", "happy"], fake: ["florp", "blorp"] };
  assert.equal(detReadSelectScore(["cat", "happy"], deck), 2);
  assert.equal(detReadSelectScore(["cat", "florp"], deck), 0);
  assert.equal(detReadSelectScore(["florp", "blorp"], deck), 0); // floored
});
t("scoreListenType", () => {
  assert.equal(scoreListenType("The cat is sleeping.", "The cat is sleeping."), 100);
  assert.equal(scoreListenType("The cat is sleeping.", ""), 0);
  assert.equal(scoreListenType("", ""), 0);
  const partial = scoreListenType("The cat is sleeping.", "The cat is running.");
  assert.ok(partial > 0 && partial < 100, "partial credit, got " + partial);
});
t("wordCount", () => {
  assert.equal(wordCount("Hello world!"), 2);
  assert.equal(wordCount("  "), 0);
  assert.equal(wordCount("don't stop"), 2);
});

/* ---------- writing feedback mapping ---------- */
t("ieltsWritingFeedback shape + criteria", () => {
  const prompt = { task: 2, minWords: 250, prompt: "Some people believe university education should be free. To what extent do you agree?" };
  const fb = ieltsWritingFeedback("I agree that university education should be free.\n\nFirst, education helps people get good jobs.\n\nIn conclusion, free university is good.", prompt);
  assert.equal(fb.criteria.length, 4);
  assert.deepEqual(fb.criteria.map(c => c.name),
    ["Task Achievement", "Coherence & Cohesion", "Lexical Resource", "Grammatical Range & Accuracy"]);
  assert.ok(fb.band >= 4 && fb.band <= 8.5);
  assert.ok(fb.band * 2 === Math.round(fb.band * 2), "band on 0.5 steps");
});
t("ieltsWritingFeedback penalizes short text", () => {
  const prompt = { task: 2, minWords: 250, prompt: "Climate change is a problem. What can be done?" };
  const short = ieltsWritingFeedback("Climate change is bad. We should act.", prompt);
  const long = ieltsWritingFeedback(
    "Climate change is one of the most serious challenges facing humanity today, and urgent action is required at every level of society.\n\n" +
    "First, governments should invest heavily in renewable energy such as solar, wind and hydro power. Furthermore, they can introduce stricter laws to limit harmful emissions from factories and vehicles.\n\n" +
    "In addition, ordinary people have an important role to play. For instance, families can reduce waste, recycle more carefully and choose public transport instead of driving everywhere.\n\n" +
    "In conclusion, although the problem is enormous, combined efforts by leaders and citizens can still protect the planet for future generations to enjoy.",
    prompt);
  assert.ok(short.band < long.band, "short=" + short.band + " long=" + long.band);
});
t("speakingBandFromStars", () => {
  assert.equal(speakingBandFromStars({ fluency: 5, vocab: 5, grammar: 5, pron: 5 }), 8.5);
  assert.equal(speakingBandFromStars({ fluency: 3, vocab: 3, grammar: 3, pron: 3 }), 6.5);
  assert.ok(speakingBandFromStars({ fluency: 1, vocab: 1, grammar: 1, pron: 1 }) >= 4);
});

/* ---------- data integrity ---------- */
t("reading: 3 passages, 4 paras + 8 questions each, all keyed", () => {
  assert.equal(IELTS_READING.length, 3);
  IELTS_READING.forEach(p => {
    assert.equal(p.paras.length, 4, p.id + " paras");
    assert.equal(p.questions.length, 8, p.id + " questions");
    const words = p.paras.map(x => x.text.split(/\s+/).length).reduce((a, b) => a + b, 0);
    assert.ok(words >= 220 && words <= 400, p.id + " words=" + words);
    p.questions.forEach((q, i) => {
      assert.ok(q.q && q.ref && q.why, p.id + " q" + i + " needs q/ref/why");
      assert.ok(["tfng", "mcq", "heading"].includes(q.t));
      if (q.t === "tfng") assert.ok(["T", "F", "NG"].includes(q.a));
      if (q.t === "mcq") assert.ok(q.a >= 0 && q.a < q.o.length);
      if (q.t === "heading") { assert.equal(q.heads.length, 5); assert.ok(q.a >= 0 && q.a < 5); }
    });
  });
});
t("listening: 3 scripts, non-empty, 6 questions each with answers", () => {
  assert.equal(IELTS_LISTENING.length, 3);
  IELTS_LISTENING.forEach(s => {
    assert.ok(s.script && s.script.split(/\s+/).length >= 100, s.id + " script too short");
    assert.equal(s.questions.length, 6);
    s.questions.forEach((q, i) => {
      assert.ok(q.q && q.why, s.id + " q" + i);
      if (q.t === "mcq") assert.ok(q.a >= 0 && q.a < q.o.length);
      if (q.t === "fill") assert.ok(Array.isArray(q.a) && q.a.length > 0);
    });
  });
});
t("writing: 6 task-1 + 8 task-2, each with structure guide", () => {
  const t1 = IELTS_WRITING.filter(w => w.task === 1);
  const t2 = IELTS_WRITING.filter(w => w.task === 2);
  assert.equal(t1.length, 6);
  assert.equal(t2.length, 8);
  IELTS_WRITING.forEach(w => {
    assert.ok(w.prompt && w.structure && w.structure.length >= 3, w.id);
    assert.ok(w.minWords >= 150);
  });
});
t("speaking: 12 + 6x4 + 8", () => {
  assert.equal(IELTS_SPEAKING.part1.length, 12);
  assert.equal(IELTS_SPEAKING.part2.length, 6);
  IELTS_SPEAKING.part2.forEach(c => assert.equal(c.bullets.length, 4));
  assert.equal(IELTS_SPEAKING.part3.length, 8);
});
t("DET real/fake word lists disjoint", () => {
  assert.equal(DET_READ_SELECT_REAL.length, 60);
  assert.equal(DET_READ_SELECT_FAKE.length, 40);
  const realSet = new Set(DET_READ_SELECT_REAL.map(w => w.toLowerCase()));
  DET_READ_SELECT_FAKE.forEach(w => {
    assert.ok(!realSet.has(w.toLowerCase()), "fake word collides with real: " + w);
  });
  assert.equal(new Set(DET_READ_SELECT_REAL).size, 60, "real list unique");
  assert.equal(new Set(DET_READ_SELECT_FAKE).size, 40, "fake list unique");
});
t("DET read-complete: blanks match answers", () => {
  assert.equal(DET_READ_COMPLETE.length, 4);
  DET_READ_COMPLETE.forEach(p => {
    const blanks = (p.text.match(/___/g) || []).length;
    assert.equal(blanks, p.answers.length, p.id + " blanks vs answers");
    p.answers.forEach(a => assert.ok(a && a.length > 3));
  });
});
t("DET listen-type / writing / speaking counts", () => {
  assert.equal(DET_LISTEN_TYPE.length, 20);
  assert.equal(DET_WRITING.length, 6);
  assert.equal(DET_SPEAKING.length, 6);
  assert.ok(DET_TIPS.length >= 5);
  Object.values(IELTS_TIPS).forEach(list => assert.ok(list.length >= 5));
});

console.log(n + " passed, " + (process.exitCode ? "FAILURES" : "0 failed"));
