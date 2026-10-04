// LinguaBuddy — school schemes of work (data).
//
// A scheme maps a school's taught lessons to LinguaBuddy SLO ids so students
// get daily practice + daily tests on exactly what was taught.
//
// Source: Aga Khan Education Service, Pakistan (Education Office, GB & Chitral)
// Grade VII English — Second Term Instructional Plans, Academic session 2026-27.
// Term 1 = lessons 1-65 (scheme doc awaited); Term 2 lessons continue at 66+.
// Lessons with oral-only SLOs carry `tasks` (speaking/listening practice)
// instead of question banks.

function L(n, title, skill, code, week, slos, tasks) {
  return { n: n, title: title, skill: skill, code: code, week: week, slos: slos || [], tasks: tasks || [] };
}

const G7_T2 = [
  L(66, "Speak fluently & lead a discussion", "Speaking & Listening", "E-07-A1-ADD", "September · Week 3", [], [
    "Prepare a 1–2 minute talk: pick an issue from your school or community, explain it in detail, say how you feel about it, and give two suggestions with reasons or examples.",
    "Pair discussion — “Should schools limit mobile phone use during school hours?” Take turns, ask follow-up questions (Why do you think so? Can you give an example?), and build on your partner's ideas."
  ]),
  L(67, "Listen & respond for discussion", "Listening", "E-07-A1-03", "September · Week 4", [], [
    "Listen to an English news bulletin (TV, radio or YouTube). Note down 3 headlines, then retell the news to a family member in your own words.",
    "With a partner: one reads a short paragraph aloud while the other listens and puts 5 events from it in the correct order."
  ]),
  L(68, "Syllables, silent letters, prefixes & suffixes", "Vocabulary", "E-07-B1-01", "September · Week 4", ["vocab"]),
  L(69, "Guess word meanings; literal vs contextual", "Reading", "E-07-B2-03 · E-08-B2-03", "September · Week 5", ["reading", "vocab"]),
  L(70, "Sentence patterns: SVOO & SVOC", "Grammar", "E-07-C5-02", "October · Week 1", ["clauses"]),
  L(71, "Sentences, clauses & phrases", "Grammar", "E-07-C5-01", "October · Week 1", ["clauses"]),
  L(72, "Formal letters & emails", "Writing", "E-07-D4-07", "October · Week 3", ["writing"]),
  L(73, "Punctuation", "Grammar", "E-07-C3-01", "October · Week 3", ["punct"]),
  L(74, "Free-writing paragraph", "Writing", "E-07-D4-11", "October · Week 4", ["writing"]),
  L(75, "Simple past tense", "Grammar", "E-07 (past tense)", "October · Week 4", ["tenses"]),
  L(76, "Fluent reading with expression", "Reading", "E-07-B1-02", "October · Week 5", ["reading"]),
  L(77, "Skimming for the main idea", "Reading", "E-07-B3-05", "October · Week 5", ["reading"]),
  L(78, "Answering comprehension questions", "Reading", "E-07-B2-06", "November · Week 1", ["reading"]),
  L(79, "Pronouns", "Grammar", "E-07-C2-03", "November · Week 1", ["pronouns"]),
  L(80, "Poetry: rhymes, cinquains, haiku", "Reading", "E-07-B3-15", "November · Week 2", ["reading"]),
  L(81, "Text structure; rhyme, rhythm & imagery", "Reading", "E-07-B3-07", "November · Week 2", ["reading"]),
  L(82, "Write a poem narrating an event", "Writing", "E-07-D4-08", "November · Week 3", ["writing"]),
  L(83, "Adverbs & adverb clauses", "Grammar", "E-07-C2-11 · E-07-C2-ADD", "November · Week 3", ["adverbs", "clauses"]),
  L(84, "Prepositions (revision)", "Grammar", "E-07-C2-12", "November · Week 3", ["prepositions"]),
  L(85, "Adjectives", "Grammar", "E-07-C2-06", "November · Week 4", ["adjectives"]),
  L(86, "Connotations & shades of meaning", "Reading & Grammar", "E-07-C1-05", "November · Week 4", ["vocab", "synant"]),
  L(87, "Figurative & connotative meanings", "Reading & Vocabulary", "E-07-B3-01", "November · Week 4", ["vocab", "reading"]),
  L(88, "Descriptive composition", "Writing", "E-06-D4-04 · E-07-D4-04", "November · Week 5", ["writing"]),
  L(89, "Listen & respond to texts", "Listening", "E-06-A2-01 · E-07-A2-01", "December · Week 1", [], [
    "Listen to a short English audio or announcement. Write down 5 key words you hear, then summarize what it was about in 3 sentences.",
    "Listen to a classmate read a paragraph. Ask them 3 questions about it and answer 3 of theirs."
  ]),
  L(90, "Speak confidently; ask & answer", "Speaking", "E-06-A3-01 · E-07-A3-01 · E-07-A2-03", "December · Week 2", [], [
    "Role-play an interview: ask a friend 5 questions about their daily routine, and answer 5 questions about yours — in full sentences.",
    "Speak for 1 minute without stopping: describe your best friend's personality and habits."
  ]),
  L(91, "Summarize by paraphrasing", "Writing", "E-07-B3-12", "December · Week 2", ["writing", "reading"]),
  L(92, "Paraphrase poem stanzas", "Writing", "E-07-D4-09", "December · Week 2", ["writing"]),
  L(93, "Skim for the writer's purpose", "Reading", "E-07-B3-05", "December · Week 3", ["reading"]),
  L(94, "Comprehension strategies", "Reading", "E-07-B2-06", "December · Week 3", ["reading"]),
  L(95, "Listening for arguments & discussions", "Listening", "E-07-A1-03", "December · Week 3", [], [
    "Listen to a short talk or story. List the speaker's 3 main points, then say whether you agree or disagree — with one reason.",
    "Play 'keyword bingo' with a friend: each picks 5 words, listens to an audio clip, and ticks the words they hear."
  ]),
  L(96, "Formal letters & emails", "Writing", "E-07-D4-07", "December · Week 4", ["writing"])
];

function lessonMap(list) {
  const o = {};
  list.forEach(function (l) { o[l.n] = l; });
  return o;
}

function emptyRange(from, to) {
  const o = {};
  for (let n = from; n <= to; n++) o[n] = L(n, "Lesson " + n, "", "", "", [], []);
  return o;
}

export const SCHEMES = [
  {
    id: "ak-g7-english",
    board: "Aga Khan",
    grade: "Grade 7",
    subject: "English",
    source: "AKES,P GB & Chitral — Grade VII English, 2nd Term Instructional Plans 2026-27",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 65 },
      { id: "t2", name: "Second Term", from: 66, to: 96 }
    ],
    // Term 1 mapping arrives with the Term 1 scheme document.
    lessons: Object.assign(emptyRange(1, 65), lessonMap(G7_T2))
  },
  {
    id: "ak-prep9-english",
    board: "Aga Khan",
    grade: "Prep 9",
    subject: "English",
    source: "Scheme of work awaited",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 65 },
      { id: "t2", name: "Second Term", from: 66, to: 130 }
    ],
    lessons: emptyRange(1, 130)
  }
  // Grade 10 scheme will be added here when its documents arrive.
];
