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

function L(n, title, skill, code, week, slos, tasks, audio) {
  const o = { n: n, title: title, skill: skill, code: code, week: week, slos: slos || [], tasks: tasks || [] };
  if (audio) o.audio = audio;
  return o;
}

const P9_T2 = [
  L(66, "Speak fluently & lead a discussion", "Speaking & Listening", "E-07-A1-ADD", "September · Week 3", [], [
    "Prepare a 1–2 minute talk: pick an issue from your school or community, explain it in detail, say how you feel about it, and give two suggestions with reasons or examples.",
    "Pair discussion — “Should schools limit mobile phone use during school hours?” Take turns, ask follow-up questions (Why do you think so? Can you give an example?), and build on your partner's ideas."
  ]),
  L(67, "Listen & respond for discussion", "Listening", "E-07-A1-03", "September · Week 4", [], [
    "🎧 Press play and listen to the discussion: “Should schools limit mobile phone use?” Note down 3 arguments you hear for limiting phones and 2 against.",
    "With a partner: discuss the same question. Use at least 2 arguments you heard in the audio, then add your own opinion with one reason."
  ], "assets/audio/l67-discussion.mp3"),
  L(68, "Syllables, silent letters, prefixes & suffixes", "Vocabulary", "E-07-B1-01", "September · Week 4", ["syllables"]),
  L(69, "Guess word meanings; literal vs contextual", "Reading", "E-07-B2-03 · E-08-B2-03", "September · Week 5", ["reading", "vocab"]),
  L(70, "Sentence patterns: SVOO & SVOC", "Grammar", "E-07-C5-02", "October · Week 1", ["sentence-patterns"]),
  L(71, "Sentences, clauses & phrases", "Grammar", "E-07-C5-01", "October · Week 1", ["clauses"]),
  L(72, "Formal letters & emails", "Writing", "E-07-D4-07", "October · Week 3", ["formal-letters"]),
  L(73, "Punctuation", "Grammar", "E-07-C3-01", "October · Week 3", ["punct"]),
  L(74, "Free-writing paragraph", "Writing", "E-07-D4-11", "October · Week 4", ["writing"]),
  L(75, "Simple past tense", "Grammar", "E-07 (past tense)", "October · Week 4", ["past-tense"]),
  L(76, "Fluent reading with expression", "Reading", "E-07-B1-02", "October · Week 5", ["reading"]),
  L(77, "Skimming for the main idea", "Reading", "E-07-B3-05", "October · Week 5", ["skimming"]),
  L(78, "Answering comprehension questions", "Reading", "E-07-B2-06", "November · Week 1", ["reading"]),
  L(79, "Pronouns", "Grammar", "E-07-C2-03", "November · Week 1", ["pronouns"]),
  L(80, "Poetry: rhymes, cinquains, haiku", "Reading", "E-07-B3-15", "November · Week 2", ["poetry"]),
  L(81, "Text structure; rhyme, rhythm & imagery", "Reading", "E-07-B3-07", "November · Week 2", ["poetry"]),
  L(82, "Write a poem narrating an event", "Writing", "E-07-D4-08", "November · Week 3", ["poetry", "writing"]),
  L(83, "Adverbs & adverb clauses", "Grammar", "E-07-C2-11 · E-07-C2-ADD", "November · Week 3", ["adverbs", "clauses"]),
  L(84, "Prepositions (revision)", "Grammar", "E-07-C2-12", "November · Week 3", ["prepositions"]),
  L(85, "Adjectives", "Grammar", "E-07-C2-06", "November · Week 4", ["adjectives"]),
  L(86, "Connotations & shades of meaning", "Reading & Grammar", "E-07-C1-05", "November · Week 4", ["connotation"]),
  L(87, "Figurative & connotative meanings", "Reading & Vocabulary", "E-07-B3-01", "November · Week 4", ["figurative"]),
  L(88, "Descriptive composition", "Writing", "E-06-D4-04 · E-07-D4-04", "November · Week 5", ["descriptive-writing"]),
  L(89, "Listen & respond to texts", "Listening", "E-06-A2-01 · E-07-A2-01", "December · Week 1", [], [
    "🎧 Press play and listen to the informational text about the markhor. Write down 5 key words you hear, then summarize what it was about in 3 sentences.",
    "Ask a partner 3 questions about the markhor (e.g. Where does it live? What does it eat?) and answer 3 of theirs."
  ], "assets/audio/l89-markhor.mp3"),
  L(90, "Speak confidently; ask & answer", "Speaking", "E-06-A3-01 · E-07-A3-01 · E-07-A2-03", "December · Week 2", [], [
    "Role-play an interview: ask a friend 5 questions about their daily routine, and answer 5 questions about yours — in full sentences.",
    "Speak for 1 minute without stopping: describe your best friend's personality and habits."
  ]),
  L(91, "Summarize by paraphrasing", "Writing", "E-07-B3-12", "December · Week 2", ["paraphrasing"]),
  L(92, "Paraphrase poem stanzas", "Writing", "E-07-D4-09", "December · Week 2", ["paraphrasing"]),
  L(93, "Skim for the writer's purpose", "Reading", "E-07-B3-05", "December · Week 3", ["skimming"]),
  L(94, "Comprehension strategies", "Reading", "E-07-B2-06", "December · Week 3", ["reading"]),
  L(95, "Listening for arguments & discussions", "Listening", "E-07-A1-03", "December · Week 3", [], [
    "🎧 Press play and listen to the persuasive talk: “Three reasons to read 20 minutes daily.” List the speaker's 3 main points, then say whether you agree or disagree — with one reason.",
    "Play 'keyword bingo' with a friend: each picks 5 words (e.g. brain, focus, vocabulary, imagination, habit), listens to the talk, and ticks the words they hear."
  ], "assets/audio/l95-arguments.mp3"),
  L(96, "Formal letters & emails", "Writing", "E-07-D4-07", "December · Week 4", ["formal-letters"])
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


const G4_T2 = [
  L(66, "Unit 7 & 8: Why do we make art?", "Grammar", "E-05-C2-04 · E-03-C4-06 · E-04-C2-06 · E-04-C1-07 · E-04-D4-03", "Second Term", ["pronouns", "tenses", "articles", "vocab", "writing"], [
    "With a partner, practise polite agreement and disagreement: one says \u2018Art is important in school\u2019 and gives a reason; the other replies \u2018I agree because...\u2019 or \u2018I disagree because...\u2019. Swap roles.",
    "Speak for 1 minute: describe a painting or piece of art you like \u2014 what it shows and why you like it."
  ]),
  L(67, "Unit 9 & 10: What is a city?", "Grammar", "E-04-C4-01 · E-04-C4-02 · E-04-C2-12 · E-04-D4-03", "Second Term", ["tenses", "clauses", "writing", "reading"], [
    "Dictation: ask a partner to read 3 sentences about your city aloud; write them down, then check together.",
    "Speak: compare your city or village with another city in 5\u20136 sentences \u2014 what is the same, what is different?"
  ]),
  L(68, "Unit 11: How do our bodies work?", "Reading", "", "Second Term", ["reading", "writing"], [
    "Listen and match: ask someone to read 5 body-part clues aloud (e.g. \u2018It pumps blood\u2019); point to each part as you hear it.",
    "Pre-reading: look at the pictures in Unit 11, guess what the text is about, then read to check your guesses."
  ]),
  L(69, "Unit 12: How do our bodies work?", "Grammar", "E-05-C4-04 · E-04-C2-10 · E-04-C2-12 · E-04-C4-01 · E-04-D4-03", "Second Term", ["past-tense", "modals", "prepositions", "tenses", "writing"], [
    "Speak: tell a partner about something you did yesterday \u2014 use 5 past-tense verbs.",
    "Give directions: guide a partner from the classroom door to your desk using prepositions (next to, behind, between)."
  ])
];

const G5_T2 = [
  L(66, "Unit 8: How do animals communicate?", "Grammar", "E-05-C2-09 · E-05-C2-11 · E-05-C2-ADD · E-05-C1-07 · E-05-D4-04", "Second Term", ["adverbs", "vocab", "writing"], [
    "Speak: describe how two different animals communicate \u2014 use 3 adverbs of manner (loudly, quickly, softly).",
    "Listen: ask a partner to read an animal description; raise your hand every time you hear an adverb."
  ]),
  L(67, "Units 9 & 10: What do different cultures give to the world?", "Grammar", "E-05-C5-04 · E-05-C5-06", "Second Term", ["questions", "pronouns", "writing"], [
    "Interview a partner: ask 5 wh-questions about their family culture or traditions; write down the answers.",
    "Speak: name one thing your culture gives to the world; explain it in 4\u20135 sentences."
  ]),
  L(68, "Units 11 & 12: Why are mountains important?", "Grammar", "E-05-C2-06", "Second Term", ["articles", "writing", "reading"], [
    "Speak: describe a mountain you know or have seen \u2014 use a, an and the correctly.",
    "Discuss: why are mountains important? Give two reasons with examples."
  ]),
  L(69, "Unit 13: Why do we use money?", "Writing", "E-05-D4-01", "Second Term", ["writing", "vocab"], [
    "Tell a partner a short true story about money (saving, spending, sharing) \u2014 keep a clear event order.",
    "Discuss: is money the most important thing? Give one reason for your opinion."
  ])
];

const G6_T2 = [
  L(66, "Presenting an argument and viewpoint", "Speaking & Listening", "E-06-A4-01", "Second Term", [], [
    "Prepare a 1\u20132 minute argument on a school or community issue: state your viewpoint clearly and give two convincing reasons.",
    "Debate with a partner: \u2018Should homework be banned?\u2019 Take turns, respond to each other\u2019s points, and sum up."
  ]),
  L(67, "Figurative language: metaphors and similes", "Reading", "E-06-B3-01", "Second Term \u00B7 Week 17", ["figurative"]),
  L(68, "Modal verbs: ability, permission, obligation", "Grammar", "E-06-C2-11", "Second Term", ["modals"]),
  L(69, "Punctuation: capitals, commas, apostrophes", "Punctuation", "E-06-C3-01", "Second Term", ["punct"]),
  L(70, "Simple present tense", "Tenses", "E-06-C4-01", "Second Term", ["tenses"]),
  L(71, "Conjunctions and transitional devices", "Grammar", "E-06-C2-14", "Second Term", ["clauses"]),
  L(72, "Past continuous and past perfect", "Tenses", "E-06-C4-05", "Second Term", ["tenses"]),
  L(73, "Writing narratives", "Writing", "E-06-D4-01", "Second Term", ["writing"]),
  L(74, "Role-play and group assignments", "Speaking & Listening", "E-06-A4-02", "Second Term", [], [
    "Role-play with a group: act out a short scene (e.g. asking for directions, shopping) \u2014 everyone speaks.",
    "Group assignment: plan a 2-minute presentation together; decide who says what, then present."
  ]),
  L(75, "Identifying themes in stories and poems", "Reading", "E-06-B3-02", "Second Term \u00B7 Week 17", ["reading"]),
  L(76, "Adverb phrases", "Grammar", "E-06-C2-12", "Second Term", ["adverbs"]),
  L(77, "Informative text: book blurb and poster", "Writing", "E-06-D4-02", "Second Term", ["writing"]),
  L(78, "Scanning for answers and opinions", "Reading", "E-06-B3-03", "Second Term", ["reading"]),
  L(79, "Prepositions of position, time and direction", "Grammar", "E-06-C2-13", "Second Term", ["prepositions"]),
  L(80, "Apostrophes with nouns", "Punctuation", "E-06-C3-02", "Second Term", ["punct"]),
  L(81, "Present continuous tense", "Tenses", "E-06-C4-02", "Second Term", ["tenses"]),
  L(82, "Phrases vs clauses", "Sentence Structure", "E-06-C5-01", "Second Term", ["clauses"]),
  L(83, "Opinion piece writing", "Writing", "E-06-D4-03", "Second Term", ["writing"]),
  L(84, "Fact vs opinion; imperative language", "Reading", "E-06-B3-04", "Second Term \u00B7 Week 17", ["reading"]),
  L(85, "Skimming for the main idea", "Reading", "E-06-B3-05", "Second Term \u00B7 Week 15", ["skimming"]),
  L(86, "Present perfect tense", "Tenses", "E-06-C4-03", "Second Term", ["tenses"]),
  L(87, "Simple and compound sentence patterns", "Sentence Structure", "E-06-C5-02", "Second Term", ["sentence-types"]),
  L(88, "Descriptive composition", "Writing", "E-06-D4-04", "Second Term", ["descriptive-writing"]),
  L(89, "Point of view and character types", "Reading", "E-06-B3-06", "Second Term \u00B7 Week 22", ["reading"]),
  L(90, "Past perfect tense and gerunds", "Tenses", "E-06-C4-04", "Second Term", ["tenses", "verbals"]),
  L(91, "Direct and indirect speech", "Sentence Structure", "E-06-C5-04", "Second Term", ["speech"]),
  L(92, "Formal letter and email", "Writing", "E-06-D4-07", "Second Term", ["formal-letters"]),
  L(93, "Story structure and poetic elements", "Reading", "E-06-B3-07", "Second Term", ["reading"]),
  L(94, "Writing poetry", "Writing", "E-06-D4-08", "Second Term", ["poetry"]),
  L(95, "Main idea of a poem", "Writing", "E-06-D4-09", "Second Term", ["poetry"]),
  L(96, "Main ideas and supporting details", "Reading", "E-06-B3-08", "Second Term", ["reading"]),
  L(97, "Literary genres: fiction, nonfiction, poetry, drama", "Reading", "E-06-B3-09", "Second Term", ["reading"]),
  L(98, "Future tense", "Tenses", "E-06-C4-06", "Second Term", ["tenses"]),
  L(99, "Writing an objective summary", "Writing", "E-06-D4-10", "Second Term", ["writing"]),
  L(100, "Rhyme, rhythm and metre", "Reading", "E-06-B3-10", "Second Term", ["poetry"]),
  L(101, "Speaker of a poem or story", "Reading", "E-06-B3-11", "Second Term", ["reading"]),
  L(102, "Free writing for fluency", "Writing", "E-06-D4-11", "Second Term", ["writing"]),
  L(103, "Paraphrasing and drawing conclusions", "Reading", "E-06-B3-12", "Second Term", ["paraphrasing"]),
  L(104, "Integrating information from sources", "Reading", "E-06-B3-13", "Second Term", ["reading"]),
  L(105, "Proofreading and editing", "Writing", "E-06-D4-12", "Second Term", ["writing"]),
  L(106, "Responding to a text", "Reading", "E-06-B3-14", "Second Term", ["writing"]),
  L(107, "Reading poetry: rhymes and shape poems", "Reading", "E-06-B3-15", "Second Term", ["poetry"])
];

const G9_FULL = [
  L(1, "Hazrat Muhammad (SAW): The Model of Tolerance", "Reading & Grammar", "", "April 2024 \u00B7 Apr 20\u201330", ["reading", "synant", "nouns", "writing"], [
    "Discuss with a partner: what does tolerance mean? Give one example from the lesson and one from your own life.",
    "Listen to your teacher read a paragraph; note the main idea and two supporting details."
  ]),
  L(2, "Iqbal\u2019s Message to Youth", "Reading & Grammar", "", "May 2024 \u00B7 May 2\u201312", ["reading", "vocab", "pronouns", "writing"], [
    "Discuss: what is Iqbal\u2019s main message to the youth? Do you agree? Give one reason.",
    "Practise: read a stanza aloud with clear pronunciation and expression."
  ]),
  L(3, "Quaid \u2014 A Great Leader", "Reading & Grammar", "", "May 2024 \u00B7 May 13\u201323", ["reading", "articles", "modals", "verbals", "synant", "writing"], [
    "Group discussion: name three qualities of a great leader, with one example for each.",
    "Listen and note: what are the three main events described in the lesson?"
  ]),
  L(4, "The Daffodils", "Poetry", "", "May 2024 \u00B7 May 23 \u2013 Jun 4", ["poetry", "paraphrasing", "verbals"], [
    "Recite the poem aloud with rhythm and expression.",
    "Discuss with a partner: what does the poet compare the daffodils to, and how does it make him feel?"
  ]),
  L(5, "The Madina Charter", "Reading & Grammar", "", "June 2024 \u00B7 Jun 4\u201315", ["reading", "verbals", "tenses", "paraphrasing"], [
    "Discuss: why was the Madina Charter important? Give two reasons.",
    "Pair work: explain the main idea of one paragraph to your partner in your own words."
  ]),
  L(6, "Nasiruddin", "Reading & Grammar", "", "June 2024 \u00B7 Jun 18\u201329, Aug 1\u20137", ["reading", "vocab", "synant", "adjectives", "writing"], [
    "Tell the story of Nasiruddin in your own words (6\u20138 sentences).",
    "Discuss: what lesson does the story teach?"
  ]),
  L(7, "The Two Bargains", "Reading & Grammar", "", "August 2024 \u00B7 Aug 7\u201317", ["reading", "adverbs", "writing"], [
    "Role-play the bargain scene with a partner \u2014 one is the buyer, one the seller.",
    "Discuss: was the bargain fair? Give reasons."
  ]),
  L(8, "Hope is the Thing with Feathers", "Poetry", "", "August 2024 \u00B7 Aug 18\u201329", ["poetry", "paraphrasing", "connotation", "prepositions"], [
    "Recite the poem with feeling; emphasise the words that show hope.",
    "Discuss: what is \u2018the thing with feathers\u2019? Explain in your own words."
  ]),
  L(9, "The Fantastic Shoemaker", "Reading & Grammar", "", "September 2024 \u00B7 Sep 1\u201313", ["reading", "synant", "sentence-types", "clauses", "paraphrasing"], [
    "Predict: read the title and first paragraph \u2014 what do you think happens next? Read on to check.",
    "Discuss the story\u2019s ending: was it what you expected? Why?"
  ]),
  L(10, "Technology in Everyday Life", "Reading & Grammar", "", "September 2024 \u00B7 Sep 24 \u2013 Oct 5", ["reading", "synant", "vocab", "writing", "clauses"], [
    "Discuss: name three ways technology helps in your daily life.",
    "Debate: \u2018Technology does more harm than good.\u2019 Give two points for your side."
  ]),
  L(11, "Safety First", "Reading & Grammar", "", "October 2024 \u00B7 Oct 9\u201321", ["reading", "punct", "clauses"], [
    "Discuss: list five safety rules for your school or home.",
    "Pair work: explain one safety rule and why it matters."
  ]),
  L(12, "The Old Woman", "Poetry", "", "October 2024 \u00B7 Oct 22 \u2013 Nov 4", ["poetry", "paraphrasing", "voice"], [
    "Recite the poem aloud with expression.",
    "Discuss: how does the poet show respect for the old woman?"
  ]),
  L(13, "Letter to the Newspaper Editor", "Writing", "", "November 2024 \u00B7 Nov 5\u201318", ["formal-letters", "synant", "punct", "writing"], [
    "Discuss: when would YOU write a letter to a newspaper editor? Name a local issue.",
    "Practise polite disagreement with a partner: \u2018I partly agree that...\u2019 \u2014 give one reason."
  ]),
  L(14, "Biodiversity in Pakistan", "Reading & Grammar", "", "November 2024 \u00B7 Nov 19 \u2013 Dec 3", ["reading", "synant", "punct"], [
    "Discuss: why is biodiversity important for Pakistan? Give two reasons.",
    "Explain to a partner: what happens if one species disappears?"
  ]),
  L(15, "Abou Ben Adhem", "Poetry", "", "December 2024 \u00B7 Dec 4\u201317", ["poetry", "paraphrasing", "connotation"], [
    "Recite the poem with expression.",
    "Discuss: what kind of person was Abou Ben Adhem? Support with a line from the poem."
  ])
];

const G10_FULL = [
  L(1, "Simplicity and Humility of Prophet Muhammad", "Reading & Grammar", "", "May 2024", ["reading", "synant", "nouns", "writing"], [
    "Discuss: what does humility mean? Give an example from the lesson.",
    "Narrate one incident from the lesson in your own words."
  ]),
  L(2, "The Champion", "Reading & Grammar", "", "May 2024 \u00B7 May\u2013Jun", ["vocab", "articles", "modals", "tenses"], [
    "Discuss: what makes a champion \u2014 talent or hard work? Give reasons.",
    "Debate with a partner: \u2018Winning is everything.\u2019"
  ]),
  L(3, "Dreams", "Poetry", "", "June 2024", ["poetry", "paraphrasing", "verbals"], [
    "Recite the poem with expression.",
    "Discuss: what do dreams symbolise in the poem?"
  ]),
  L(4, "Population Growth and its Impact on Environment", "Reading & Grammar", "", "August 2024", ["tenses", "writing", "reading"], [
    "Discuss: name two effects of population growth on the environment.",
    "Group talk: suggest two solutions; present them to the class."
  ]),
  L(5, "The Great Masjid of Cordoba and Iqbal", "Reading & Grammar", "", "August 2024", ["synant", "vocab", "adjectives"], [
    "Discuss: why is the Great Masjid of Cordoba famous?",
    "Explain Iqbal\u2019s message in this lesson in 3\u20134 sentences."
  ]),
  L(6, "In Spite of War (Poem)", "Poetry", "", "August 2024", ["poetry", "paraphrasing", "vocab", "adjectives"], [
    "Recite the poem with feeling.",
    "Discuss: what is the poet\u2019s attitude towards war?"
  ]),
  L(7, "The Aged Mother", "Reading & Grammar", "", "August 2024", ["pronouns", "vocab", "reading"], [
    "Narrate the story of the aged mother in your own words.",
    "Discuss: what does the story teach about respecting elders?"
  ]),
  L(8, "Women\u2019s Role in Pakistan Movement", "Reading & Grammar", "", "August 2024", ["reading", "adverbs", "vocab"], [
    "Discuss: name two contributions of women to the Pakistan Movement.",
    "Group discussion: why is this topic important today?"
  ]),
  L(9, "Equipment (Poem)", "Poetry", "", "September 2024", ["poetry", "paraphrasing", "prepositions"], [
    "Recite the poem aloud.",
    "Discuss: what \u2018equipment\u2019 does the poet talk about? Explain."
  ]),
  L(10, "Water Scarcity in Pakistan", "Reading & Grammar", "", "September 2024", ["writing", "clauses", "reading"], [
    "Discuss: what causes water scarcity in Pakistan? Name two causes.",
    "Suggest two ways to save water at home or school."
  ]),
  L(11, "Genetically Modified Organisms (GMOs)", "Reading & Grammar", "", "September 2024", ["writing", "sentence-types", "clauses"], [
    "Discuss: are GMOs good or bad? Give one argument for each side.",
    "Present your group\u2019s view in 4\u20135 sentences."
  ]),
  L(12, "They have cut Down the Pines (Poem)", "Poetry", "", "October 2024", ["poetry", "paraphrasing", "conditionals"], [
    "Recite the poem with expression.",
    "Discuss: what is the poet\u2019s message about nature?"
  ]),
  L(13, "Hazrat Umar", "Reading & Grammar", "", "November 2024", ["synant", "voice", "reading"], [
    "Narrate an incident from Hazrat Umar\u2019s life in your own words.",
    "Discuss: which quality of Hazrat Umar impresses you most? Why?"
  ]),
  L(14, "The Model Millionaire", "Reading & Grammar", "", "November 2024", ["vocab", "reading"], [
    "Discuss: what is the message of the story?",
    "Role-play: act out the millionaire\u2019s conversation with the young man."
  ]),
  L(15, "Opportunity", "Poetry", "", "November 2024", ["poetry", "paraphrasing", "connotation", "vocab"], [
    "Recite the poem with expression.",
    "Discuss: what does the poet mean by \u2018opportunity\u2019? Give an example."
  ])
];

export const SCHEMES = [
  {
    id: "ak-g7-english",
    board: "Aga Khan",
    grade: "Grade 7",
    subject: "English",
    source: "AKES,P GB & Chitral — English, 2nd Term Instructional Plans 2026-27",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 65 },
      { id: "t2", name: "Second Term", from: 66, to: 96 }
    ],
    // Term 1 mapping arrives with the Term 1 scheme document.
    lessons: Object.assign(emptyRange(1, 65), lessonMap(P9_T2))
  },
  {
    id: "ak-prep9-english",
    board: "Aga Khan",
    grade: "Prep 9",
    subject: "English",
    source: "AKES,P GB & Chitral — English, 2nd Term Instructional Plans 2026-27",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 65 },
      { id: "t2", name: "Second Term", from: 66, to: 96 }
    ],
    // Term 1 mapping arrives with the Term 1 scheme document.
    lessons: Object.assign(emptyRange(1, 65), lessonMap(P9_T2))
  }
  ,
  {
    id: "ak-g4-english",
    board: "Aga Khan",
    grade: "Grade 4",
    subject: "English",
    source: "AKES,P — Second Term Pacing Guide, AY 2026-27 · Class IV English (Oxford Discover)",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 65 },
      { id: "t2", name: "Second Term", from: 66, to: 69 }
    ],
    // Term 1 mapping arrives with the Term 1 scheme document.
    lessons: Object.assign(emptyRange(1, 65), lessonMap(G4_T2))
  },
  {
    id: "ak-g5-english",
    board: "Aga Khan",
    grade: "Grade 5",
    subject: "English",
    source: "AKES,P — Second Term Pacing Guide, AY 2025-26 · Class V English (Oxford Discover)",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 65 },
      { id: "t2", name: "Second Term", from: 66, to: 69 }
    ],
    // Term 1 mapping arrives with the Term 1 scheme document.
    lessons: Object.assign(emptyRange(1, 65), lessonMap(G5_T2))
  },
  {
    id: "ak-g6-english",
    board: "Aga Khan",
    grade: "Grade 6",
    subject: "English",
    source: "AKES,P — English Grade 6, Second Term Pacing Guide (Oxford Progressive English)",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 65 },
      { id: "t2", name: "Second Term", from: 66, to: 107 }
    ],
    // Term 1 mapping arrives with the Term 1 scheme document.
    lessons: Object.assign(emptyRange(1, 65), lessonMap(G6_T2))
  },
  {
    id: "bisep-g9-english",
    board: "BISEP",
    grade: "Grade 9",
    subject: "English",
    source: "AKES,P — Scheme of Work, English Compulsory Grade IX, 2024-25 (BISEP board)",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 6 },
      { id: "t2", name: "Second Term", from: 7, to: 15 }
    ],
    lessons: lessonMap(G9_FULL)
  },
  {
    id: "bisep-g10-english",
    board: "BISEP",
    grade: "Grade 10",
    subject: "English",
    source: "AKES Chitral — Pacing Guide, English Grade 10 under BISE Peshawar, 2024-25",
    terms: [
      { id: "t1", name: "First Term", from: 1, to: 8 },
      { id: "t2", name: "Second Term", from: 9, to: 15 }
    ],
    lessons: lessonMap(G10_FULL)
  }
];
