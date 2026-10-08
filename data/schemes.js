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
  L(66, "Unit 7 & 8 — Pronouns: indefinite, relative & reciprocal", "Grammar", "E-05-C2-04", "Second Term", ["pronouns"]),
  L(67, "Unit 7 & 8 — Prefixes & suffixes: word building", "Grammar", "E-04-C1-07", "Second Term", ["vocab"]),
  L(68, "Unit 7 & 8 — Word building: new words in speech & writing", "Vocabulary", "", "Second Term", ["vocab"]),
  L(69, "Unit 7 & 8 — Speaking: engage in conversation, take turns", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about art: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about art. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(70, "Unit 7 & 8 — Future tense: will / shall / be going to", "Grammar", "E-03-C4-06", "Second Term", ["tenses"]),
  L(71, "Unit 7 & 8 — Listening: audio CD, new words", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about art aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(72, "Unit 7 & 8 — Reading: locate specific information", "Reading", "", "Second Term", ["reading"]),
  L(73, "Unit 7 & 8 — Articles: a / an / the / zero article", "Grammar", "E-04-C2-06", "Second Term", ["articles"]),
  L(74, "Unit 7 & 8 — Speaking: agree / disagree politely", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ With a partner, practise polite agreement and disagreement about art: one person gives an opinion with a reason; the other replies ‘I agree because...’ or ‘I disagree because...’. Then swap roles.",
    "🎙️ Speak for 1 minute: give your own opinion about art and support it with two reasons."
  ]),
  L(75, "Unit 7 & 8 — Dictation: Vocab Champ wordlist", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Dictation: ask a partner or family member to read 10 words aloud from your word list, one by one. Write each word, then check the spelling together.",
    "🎧 Say-spell-say: pick 10 words. Read each word aloud, spell it letter by letter, then use it in a short sentence of your own."
  ]),
  L(76, "Unit 7 & 8 — Writing: organize ideas (mind maps etc.)", "Writing", "", "Second Term", ["writing"]),
  L(77, "Unit 7 & 8 — Writing: guided paragraph", "Writing", "", "Second Term", ["writing"]),
  L(78, "Unit 7 & 8 — Writing: revise (spelling, punctuation, agreement, layout)", "Writing", "", "Second Term", ["punct"]),
  L(79, "Unit 7 & 8 — Writing: opinion pieces", "Writing", "E-04-D4-03", "Second Term", ["writing"]),
  L(80, "Unit 9 & 10 — Listening & speaking: conversation, turns, lead & follow", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Lead a short discussion about cities and city life: ask your group 3 questions, make sure everyone gets a turn to speak, then sum up what the group said.",
    "🎙️ As a group member, answer with reasons and build on what others say (‘I agree with... and I would add...’)."
  ]),
  L(81, "Unit 9 & 10 — Word building: new words in speech & writing", "Vocabulary", "", "Second Term", ["vocab"]),
  L(82, "Unit 9 & 10 — Reading: pre-reading strategies (guess meaning from context)", "Reading", "", "Second Term", ["skimming"]),
  L(83, "Unit 9 & 10 — Reading: question-comprehension strategies", "Reading", "", "Second Term", ["reading"]),
  L(84, "Unit 9 & 10 — Reading: locate specific information", "Reading", "", "Second Term", ["reading"]),
  L(85, "Unit 9 & 10 — Simple present: habits, universal truths, facts", "Grammar", "E-04-C4-01", "Second Term", ["tenses"]),
  L(86, "Unit 9 & 10 — Present continuous", "Grammar", "E-04-C4-02", "Second Term", ["tenses"]),
  L(87, "Unit 9 & 10 — Listening & speaking: comprehend; express opinion with reasons", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about cities and city life aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(88, "Unit 9 & 10 — Speaking: agree / disagree politely", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ With a partner, practise polite agreement and disagreement about cities and city life: one person gives an opinion with a reason; the other replies ‘I agree because...’ or ‘I disagree because...’. Then swap roles.",
    "🎙️ Speak for 1 minute: give your own opinion about cities and city life and support it with two reasons."
  ]),
  L(89, "Unit 9 & 10 — Grammar: indefinite pronouns", "Grammar", "", "Second Term", ["pronouns"]),
  L(90, "Unit 9 & 10 — Word building: new words in speech & writing", "Vocabulary", "", "Second Term", ["vocab"]),
  L(91, "Unit 9 & 10 — Dictation: paragraph/text; word wall, bank, journal", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Dictation: ask a partner or family member to read 10 words aloud from your word list, one by one. Write each word, then check the spelling together.",
    "🎧 Say-spell-say: pick 10 words. Read each word aloud, spell it letter by letter, then use it in a short sentence of your own."
  ]),
  L(92, "Unit 9 & 10 — Reading & speaking: conversation, take turns", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about cities and city life: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about cities and city life. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(93, "Unit 9 & 10 — Listening: listen and match", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about cities and city life aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(94, "Unit 9 & 10 — Connectors: addition, reason, sequence", "Writing", "E-04-C2-12", "Second Term", ["clauses"]),
  L(95, "Unit 9 & 10 — Writing: pre-writing - gather & organize ideas", "Writing", "", "Second Term", ["writing"]),
  L(96, "Unit 9 & 10 — Writing: guided paragraph", "Writing", "", "Second Term", ["writing"]),
  L(97, "Unit 9 & 10 — Writing: opinion pieces", "Writing", "E-04-D4-03", "Second Term", ["writing"]),
  L(98, "Unit 11 — Word building: new words in speech & writing", "Vocabulary", "", "Second Term", ["vocab"]),
  L(99, "Unit 11 — Reading: pre-reading, locate info, question strategies", "Reading", "", "Second Term", ["reading"]),
  L(100, "Unit 11 — Reading: question-comprehension strategies", "Reading", "", "Second Term", ["reading"]),
  L(101, "Unit 11 — Listening & speaking: listen and match", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about how our bodies work aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(102, "Unit 11 — Writing: expository paragraphs", "Writing", "", "Second Term", ["writing"]),
  L(103, "Unit 11 — Writing: narrative paragraphs", "Writing", "", "Second Term", ["writing"]),
  L(104, "Unit 11 — Writing: descriptive paragraphs", "Writing", "", "Second Term", ["descriptive-writing"]),
  L(105, "Unit 12 — Word building: new words in speech & writing", "Vocabulary", "", "Second Term", ["vocab"]),
  L(106, "Unit 12 — Reading: engage in conversation, take turns", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about how our bodies work: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about how our bodies work. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(107, "Unit 12 — Prepositions: position, time, movement, direction", "Grammar", "E-04-C2-12", "Second Term", ["prepositions"]),
  L(108, "Unit 12 — Past simple: completed & regular past actions", "Grammar", "E-05-C4-04", "Second Term", ["past-tense"]),
  L(109, "Unit 12 — Listening: listen and match", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about how our bodies work aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(110, "Unit 12 — Reading: question-comprehension strategies", "Reading", "", "Second Term", ["reading"]),
  L(111, "Unit 12 — Writing: descriptive, narrative & expository paragraphs", "Writing", "", "Second Term", ["writing"]),
  L(112, "Unit 12 — Modal verbs: can, could, may, might, must, shall, should, will, would", "Grammar", "E-04-C2-10", "Second Term", ["modals"]),
  L(113, "Unit 12 — Simple present (revision): habits, truths, facts", "Grammar", "E-04-C4-01", "Second Term", ["tenses"]),
  L(114, "Unit 12 — Writing: opinion pieces", "Writing", "E-04-D4-03", "Second Term", ["writing"]),
];

const G5_T2 = [
  L(66, "Unit 8: How do animals communicate? — Vocabulary Building", "Vocabulary", "", "Second Term", ["vocab"]),
  L(67, "Unit 8: How do animals communicate? — Reading", "Reading", "", "Second Term", ["reading"]),
  L(68, "Unit 8: How do animals communicate? — Speaking", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about how animals communicate: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about how animals communicate. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(69, "Unit 8: How do animals communicate? — Listening & Dictation", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Dictation: ask a partner or family member to read 10 words aloud from your word list, one by one. Write each word, then check the spelling together.",
    "🎧 Say-spell-say: pick 10 words. Read each word aloud, spell it letter by letter, then use it in a short sentence of your own."
  ]),
  L(70, "Unit 8: How do animals communicate? — Word Study: suffixes", "Vocabulary", "E-05-C1-07", "Second Term", ["vocab"]),
  L(71, "Unit 8: How do animals communicate? — Grammar: adverbs", "Grammar", "E-05-C2-09", "Second Term", ["adverbs"]),
  L(72, "Unit 8: How do animals communicate? — Grammar: adverbs connecting clauses/sentences", "Grammar", "E-05-C2-ADD", "Second Term", ["adverbs"]),
  L(73, "Unit 8: How do animals communicate? — Grammar: adverb phrases", "Grammar", "E-05-C2-11", "Second Term", ["adverbs"]),
  L(74, "Unit 8: How do animals communicate? — Writing: descriptive paragraphs", "Writing", "E-05-D4-04", "Second Term", ["descriptive-writing"]),
  L(75, "Unit 8: How do animals communicate? — Grammar: reported speech", "Grammar", "E-05-C5-06", "Second Term", ["speech"]),
  L(76, "Unit 9: What do different cultures give to the world? — Reading", "Reading", "", "Second Term", ["reading"]),
  L(77, "Unit 9: What do different cultures give to the world? — Listening", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about what different cultures give to the world aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(78, "Unit 9: What do different cultures give to the world? — Speaking", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about what different cultures give to the world: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about what different cultures give to the world. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(79, "Unit 9: What do different cultures give to the world? — Grammar: wh-questions", "Grammar", "E-05-C5-04", "Second Term", ["questions"]),
  L(80, "Unit 9: What do different cultures give to the world? — Writing: descriptive paragraphs", "Writing", "E-05-D4-04", "Second Term", ["descriptive-writing"]),
  L(81, "Unit 10: What do different cultures give to the world? — Reading", "Reading", "", "Second Term", ["reading"]),
  L(82, "Unit 10: What do different cultures give to the world? — Listening", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about what different cultures give to the world aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(83, "Unit 10: What do different cultures give to the world? — Speaking", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about what different cultures give to the world: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about what different cultures give to the world. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(84, "Unit 10: What do different cultures give to the world? — Word Study: suffixes", "Vocabulary", "E-05-C1-07", "Second Term", ["vocab"]),
  L(85, "Unit 11: Why are mountains important? — Reading", "Reading", "", "Second Term", ["reading"]),
  L(86, "Unit 11: Why are mountains important? — Listening for Facts", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about why mountains are important aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(87, "Unit 11: Why are mountains important? — Speaking", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about why mountains are important: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about why mountains are important. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(88, "Unit 11: Why are mountains important? — Grammar: articles", "Grammar", "E-05-C2-06", "Second Term", ["articles"]),
  L(89, "Unit 12: Why are mountains important? — Vocabulary Building", "Vocabulary", "", "Second Term", ["vocab"]),
  L(90, "Unit 12: Why are mountains important? — Reading", "Reading", "", "Second Term", ["reading"]),
  L(91, "Unit 12: Why are mountains important? — Listening", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about why mountains are important aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(92, "Unit 12: Why are mountains important? — Speaking", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about why mountains are important: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about why mountains are important. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(93, "Unit 13: Why do we use money? — Vocabulary Building", "Vocabulary", "", "Second Term", ["vocab"]),
  L(94, "Unit 13: Why do we use money? — Reading", "Reading", "", "Second Term", ["reading"]),
  L(95, "Unit 13: Why do we use money? — Word Study", "Vocabulary", "", "Second Term", ["vocab"]),
  L(96, "Unit 13: Why do we use money? — Speaking", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about why we use money: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about why we use money. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(97, "Unit 13: Why do we use money? — Writing: narratives", "Writing", "E-05-D4-01", "Second Term", ["writing"]),
  L(98, "Unit 13: Why do we use money? — Writing: narratives (detailed)", "Writing", "E-05-D4-01", "Second Term", ["writing"]),
  L(99, "Unit 5 — The wheel — describing its uses in daily life orally (5+ sentences)", "Reading", "", "Second Term", ["skimming"]),
  L(100, "The wheel (contd.) — read; wheel & transport vocabulary; thinking questions on wheel invention", "Reading", "", "Second Term", ["reading"]),
  L(101, "‘The London Eye’ — model reading & explanation,; homework: write about favourite vehicle", "Reading", "", "Second Term", ["reading"]),
  L(102, "Early wheels and machines —", "Reading", "", "Second Term", ["reading"]),
  L(103, "Pronunciation & syllables (obedient, fortunate, tedious, fragile, determined, daring, thrilling)", "Vocabulary", "", "Second Term", ["syllables"]),
  L(104, "Story ‘Planet SinRota’ — pair reading , chart; syllable-breaking of mispronounced words", "Reading", "", "Second Term", ["reading"]),
  L(105, "Planet SinRota (contd.) — read-aloud , picture questions; homework: read ‘Olivia’s Invention’", "Reading", "", "Second Term", ["reading"]),
  L(106, "Planet SinRota (contd.) — read-aloud & circle reading; pair exercises", "Reading", "", "Second Term", ["reading"]),
  L(107, "Read-aloud fluency — multi-syllable words with syllable blending (comfortable, remarkable, innovative…)", "Vocabulary", "", "Second Term", ["syllables"]),
  L(108, "Making predictions —; predict theme from titles/pictures , 92-93", "Reading", "", "Second Term", ["reading"]),
  L(109, "‘will’ vs ‘going to’ — future plans/predictions/facts", "Grammar", "", "Second Term", ["tenses"]),
  L(110, "‘will’/‘going to’ practice —; writing future predictions", "Grammar", "", "Second Term", ["tenses"]),
  L(111, "Modal auxiliaries can/may/should — permission, prohibition, doubt, obligation; oral sentence formation", "Grammar", "", "Second Term", ["modals"]),
  L(112, "Modals practice —", "Grammar", "", "Second Term", ["modals"]),
  L(113, "Present simple tense — usage & sentence formation (positive/negative/interrogative); daily-routine writing", "Grammar", "", "Second Term", ["tenses"]),
  L(114, "Present continuous tense — usage & sentence formation; TV-programme description homework", "Grammar", "", "Second Term", ["tenses"]),
  L(115, "Guided paragraph writing — brainstorming ‘A good friend’; , 137 exercise B; favourite personality", "Writing", "", "Second Term", ["writing"]),
  L(116, "Listening dictation — paragraph about a tiger; MCQs on the lost-puppy listening story", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about the topic aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(117, "Listening for main idea —; scientific-method worksheet MCQs; main idea of", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about the topic aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(118, "Pronouncing 12 new words — read sentences aloud in context", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Read 5 sentences aloud, slowly and clearly. Ask a partner to listen and raise a hand each time a word is mispronounced.",
    "🎧 Pronunciation check: listen to each new word said aloud (by your teacher or a partner), repeat it, then use it in a sentence of your own."
  ]),
  L(119, "Group conversation with connectors (first, after that, then, finally) — plan a school trip", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(120, "Paragraph writing — brainstorm & outline ‘My school’; independent paragraph on ‘Computer’/‘My family’", "Writing", "", "Second Term", ["writing"]),
  L(121, "Paragraph writing — brainstorm & outline ‘Facebook’; topic sentences (‘My father…’, ‘Trees are useful…’)", "Writing", "", "Second Term", ["writing"]),
  L(122, "Informal invitations — conventions (purpose, date, time, venue); birthday party & wedding invitations; write own invitation", "Writing", "", "Second Term", ["formal-letters"]),
  L(123, "Formal letter of application — conventions; model application for summer homework copy; sports-permission & wedding-leave applications", "Writing", "", "Second Term", ["formal-letters"]),
  L(124, "Informal letter writing — reply to a friend’s letter; model invitation letter; write about attending sibling’s wedding", "Writing", "", "Second Term", ["formal-letters"]),
  L(125, "Pronouncing new words — read sentences aloud in context; exercises B-C; dictionary meanings", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Read 5 sentences aloud, slowly and clearly. Ask a partner to listen and raise a hand each time a word is mispronounced.",
    "🎧 Pronunciation check: listen to each new word said aloud (by your teacher or a partner), repeat it, then use it in a sentence of your own."
  ]),
  L(126, "Speaking with ‘should’/‘why don’t’ — dialogue; group discussion on COVID SOPs", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(127, "Practicing a dialogue using agreement and disagreement; group discussion on how to enhance oral communication in English", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(128, "Practicing a childhood-memories dialogue in pairs; using should and why don't while talking about COVID SOPs", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(129, "Listening to a; using clarification questions in pairs", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(130, "Practicing WH-questions for oral communication through picture reading in groups", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(131, "Listening to a video (humpback whales) and sharing main points; dictation of sentences and words", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about the topic aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(132, "Unit 8 — Talking about animals in the unit — sharing facts about how animals communicate", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(133, "Demonstrating an interview using questions and expressions; listening to a", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(134, "Listening comprehension test: teacher reads a passage about a lost puppy; students answer 15 questions", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about the topic aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(135, "Pre-reading strategies: guessing word meaning from context and scanning a text for specific information", "Reading", "", "Second Term", ["vocab"]),
  L(136, "Generating questions to understand a text; describing the characters in a short story", "Reading", "", "Second Term", ["reading"]),
  L(137, "Skimming graphical features (pictures, tables, illustrations) to aid understanding; identifying story setting and characters", "Reading", "", "Second Term", ["skimming"]),
  L(138, "Reading for comprehension; differentiating between character and setting; describing story characters", "Reading", "", "Second Term", ["reading"]),
  L(139, "Silent reading for comprehension; guessing word meaning from context (animal communication text)", "Reading", "", "Second Term", ["reading"]),
  L(140, "Answering factual, interpretive, inferential, personal-response and open-ended questions about animal communication", "Reading", "", "Second Term", ["reading"]),
  L(141, "Skimming/scanning and answering varied question types about animal communication (continued)", "Reading", "", "Second Term", ["reading"]),
  L(142, "Guessing meaning of difficult words from context; word-usage exercises (workbook pages 62-63)", "Reading", "", "Second Term", ["vocab"]),
  L(143, "Answering varied question types about a narrative text (dolphins/fishing); skimming and scanning", "Reading", "", "Second Term", ["reading"]),
  L(144, "Guessing word meaning from context; crossword puzzle and word-usage exercises (workbook pages 70-71)", "Reading", "", "Second Term", ["vocab"]),
  L(145, "Answering varied question types after prediction, choral reading and read-aloud (workbook pages 72-73)", "Reading", "", "Second Term", ["reading"]),
  L(146, "Dictation of a paragraph; listening to an audio script (page 116) to identify key words and fill in information", "Speaking & Listening", "", "Second Term", [], [
    "🎧 Listening: ask someone to read a short paragraph about the topic aloud. Listen for 3 important details, then say them back without looking.",
    "🎧 Listen again and write down the key words you hear. Compare your list with a partner and discuss what you both caught."
  ]),
  L(147, "Classifying adjectives of quantity, quality, size, shape, colour and origin; arranging adjective phrases in order", "Grammar", "", "Second Term", ["adjectives"]),
  L(148, "Ordering adjectives correctly in sentences; degrees of regular adjectives", "Grammar", "", "Second Term", ["adjectives"]),
  L(149, "Differentiating regular and irregular verbs; using past and past participle forms in sentences", "Grammar", "", "Second Term", ["past-tense"]),
  L(150, "Writing past and past participle forms of verbs; using past forms in", "Grammar", "", "Second Term", ["past-tense"]),
  L(151, "Guided paragraph writing: recognizing paragraph structure (topic sentence, supporting sentences) via brainstorming", "Writing", "", "Second Term", ["writing"]),
  L(152, "Brainstorming and mind mapping to organize ideas; model writing to compose a coherent paragraph", "Writing", "", "Second Term", ["writing"]),
  L(153, "Shared writing and guided writing process: brainstorming, organizing ideas, composing paragraphs", "Writing", "", "Second Term", ["writing"]),
  L(154, "Interactive and independent paragraph writing: brainstorming on topics and developing coherent paragraphs", "Writing", "", "Second Term", ["writing"]),
  L(155, "Analyzing paragraph components (topic sentence, supporting sentences and details); paragraph-writing wrap-up", "Writing", "", "Second Term", ["writing"]),
  L(156, "Writing practice: write simple paragraphs and revise work for layout, grammar, vocabulary", "Writing", "", "Second Term", ["writing"]),
  L(157, "Writing practice: paragraph writing; revise for spelling, punctuation, subject-verb agreement, tenses", "Writing", "", "Second Term", ["writing"]),
  L(158, "Writing practice: paragraph writing with focus on subject-verb agreement", "Grammar", "", "Second Term", ["sva"]),
  L(159, "Speaking: pair conversations asking for and giving advice , audio script)", "Speaking & Listening", "", "Second Term", [], [
    "🎙️ Talk with a partner about the topic: take turns, about one minute each. Keep eye contact, speak loudly enough to be heard, and stay on the topic.",
    "🎙️ On your own: speak for 1 minute about the topic. If you can, record yourself on a phone and listen back — did you stay on topic?"
  ]),
  L(160, "Speaking: practicing WH questions about classroom behaviour (homework: write 10 WH questions)", "Speaking & Listening", "", "Second Term", ["questions"]),
  L(161, "Reading aloud with correct pronunciation and intonation", "Reading", "", "Second Term", ["reading"]),
  L(162, "Using a dictionary: alphabetical order, multisyllabic words, word meanings", "Vocabulary", "", "Second Term", ["vocab"]),
  L(163, "Silent reading for comprehension; story elements; guessing word meaning from context", "Reading", "", "Second Term", ["reading"]),
  L(164, "Story elements: setting and characters; homework: 10 sentences about Akiko)", "Reading", "", "Second Term", ["reading"]),
  L(165, "Story elements: setting and characters", "Reading", "", "Second Term", ["reading"]),
  L(166, "Writing: compose a short story (fable) using story elements", "Writing", "", "Second Term", ["writing"]),
  L(167, "Reading comprehension: factual/interpretive/inferential/personal-response questions; skimming", "Reading", "", "Second Term", ["reading"]),
  L(168, "Reading comprehension: cause and effect", "Reading", "", "Second Term", ["reading"]),
  L(169, "Grammar: prepositions of time and position (oral sentence practice)", "Grammar", "", "Second Term", ["prepositions"]),
  L(170, "Grammar: prepositions of movement and direction (written sentences)", "Grammar", "", "Second Term", ["prepositions"]),
  L(171, "Grammar: adverbs of manner, time and frequency (presentation + group work)", "Grammar", "", "Second Term", ["adverbs"]),
  L(172, "Grammar: adverbs of manner, time and frequency (practice exercises + worksheet)", "Grammar", "", "Second Term", ["adverbs"]),
  L(173, "Reading comprehension: question types; skimming", "Reading", "", "Second Term", ["reading"]),
  L(174, "Reading comprehension: cause and effect", "Reading", "", "Second Term", ["reading"]),
  L(175, "Reading: retell and summarize the story 'The Mystery of Castle'", "Reading", "", "Second Term", ["reading"]),
  L(176, "Reading: retell and summarize the story", "Reading", "", "Second Term", ["reading"]),
  L(177, "Grammar: articles a, an, the , exercise E)", "Grammar", "", "Second Term", ["articles"]),
  L(178, "Grammar: definite vs indefinite articles", "Grammar", "", "Second Term", ["articles"]),
  L(179, "Punctuation and capitalization in own sentences; descriptive passage writing", "Grammar", "", "Second Term", ["punct"]),
  L(180, "Word study: compound words", "Vocabulary", "", "Second Term", ["vocab"]),
  L(181, "Word study: prefixes, suffixes, affixes", "Vocabulary", "", "Second Term", ["vocab"]),
  L(182, "Punctuation: using the colon before a series of items", "Grammar", "", "Second Term", ["punct"]),
  L(183, "Revision: compound words", "Vocabulary", "", "Second Term", ["vocab"]),
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
      { id: "t2", name: "Second Term", from: 66, to: 114 }
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
      { id: "t2", name: "Second Term", from: 66, to: 183 }
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
