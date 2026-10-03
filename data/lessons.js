// LinguaBuddy — per-SLO lesson content (Middle, grades 6-8).
// Authored lesson extras keyed by SLO id: warm-up, key teaching points,
// worked examples, a one-line remediation tip, and an application prompt
// used by the remediation engine. Versioned alongside the banks.
export const DATA_VERSION_LESSONS = "1.0.0";

export const LESSONS = {
tenses: {
  warmup: { q: "Which is correct: 'She go to school' or 'She goes to school'? Why?", a: "'She goes to school' — with he/she/it we add -s to the verb in the present simple." },
  keyPoints: [
    "Present simple for habits: 'She reads daily.' Past simple for finished actions: 'She read yesterday.'",
    "Use 'will' for the future: 'She will read tomorrow.'",
    "Continuous tenses use be + -ing: 'She is reading now.' / 'She was reading at 5.'",
    "Present perfect connects past and present: 'She has read three books this week.'"
  ],
  examples: [
    { en: "They play cricket every Friday.", note: "Present simple — a habit." },
    { en: "They played cricket last Friday.", note: "Past simple — finished." },
    { en: "They are playing cricket right now.", note: "Present continuous — happening now." }
  ],
  tip: "Match the verb to the time word: 'yesterday' → past, 'every day' → present, 'tomorrow' → future.",
  applyPrompt: "Write 3 sentences about what you did yesterday (past tense), 3 about your daily routine (present), and 3 about your plans for tomorrow (future)."
},
sva: {
  warmup: { q: "Which is correct: 'The boys is playing' or 'The boys are playing'?", a: "'The boys are playing' — a plural subject needs a plural verb." },
  keyPoints: [
    "Singular subject → singular verb: 'The boy runs.' Plural subject → plural verb: 'The boys run.'",
    "He/She/It takes -s in the present: 'She writes.' I/You/We/They do not: 'They write.'",
    "Phrases like 'along with' or 'as well as' do NOT change the subject: 'Ali, along with his friends, is coming.'",
    "'Each', 'every', 'neither', 'either' take singular verbs: 'Each student has a book.'"
  ],
  examples: [
    { en: "She goes to school daily.", note: "Singular subject 'she' → 'goes'." },
    { en: "They go to school daily.", note: "Plural subject 'they' → 'go'." },
    { en: "Bread and butter is my breakfast.", note: "One idea → singular verb." }
  ],
  tip: "Find the real subject first — ignore extra phrases between the subject and the verb.",
  applyPrompt: "Look around your room. Write 5 sentences about what you see, making sure every verb agrees with its subject."
},
voice: {
  warmup: { q: "Who does the action in 'The ball was kicked by Ali' — Ali or the ball?", a: "Ali does the action. The ball receives it — that is the passive voice." },
  keyPoints: [
    "Active: subject DOES the action — 'Ali kicked the ball.'",
    "Passive: subject RECEIVES the action — 'The ball was kicked by Ali.'",
    "Passive uses be + past participle: is/are/was/were + done, written, cleaned.",
    "Use passive when the doer is unknown or unimportant: 'The road was repaired.'"
  ],
  examples: [
    { en: "Mother baked a cake. → The cake was baked by mother.", note: "Active becomes passive." },
    { en: "They clean the room daily. → The room is cleaned daily.", note: "Present simple passive." },
    { en: "She is writing a letter. → A letter is being written by her.", note: "Continuous passive uses 'being'." }
  ],
  tip: "To make a passive sentence: object first, then the right form of 'be', then the past participle.",
  applyPrompt: "Write 3 active sentences about your home, then rewrite each one in the passive voice."
},
speech: {
  warmup: { q: "Ali said, 'I am hungry.' How would you report this to a friend?", a: "Ali said that he was hungry. — pronouns and tenses shift back." },
  keyPoints: [
    "Direct speech repeats exact words in quotes: She said, 'I am tired.'",
    "Indirect speech reports: She said that she was tired.",
    "Present → past when reporting: 'I play' → 'he played'. 'Will' → 'would'.",
    "Questions use 'asked' + if/whether: 'Are you coming?' → He asked if I was coming."
  ],
  examples: [
    { en: "He said, 'I will come.' → He said that he would come.", note: "'will' becomes 'would'." },
    { en: "'Where do you live?' → She asked where I lived.", note: "Question word kept, tense shifted." },
    { en: "'Open the door.' → He told me to open the door.", note: "Commands use 'told + to'." }
  ],
  tip: "Step the tense one step back when you report: present → past, past → past perfect, will → would.",
  applyPrompt: "Imagine your teacher gave you three instructions today. Report them in indirect speech."
},
articles: {
  warmup: { q: "Which is correct: 'a apple' or 'an apple'? Why?", a: "'an apple' — 'an' comes before vowel SOUNDS." },
  keyPoints: [
    "Use 'a' before consonant sounds: a book, a university (sounds like 'yu').",
    "Use 'an' before vowel sounds: an apple, an honest boy (the 'h' is silent).",
    "Use 'the' for something specific or already mentioned: 'I saw a dog. The dog was black.'",
    "No article for general plurals: 'Dogs are loyal.' or proper names like 'Lahore'."
  ],
  examples: [
    { en: "She is an engineer.", note: "'an' before a vowel sound." },
    { en: "The sun rises in the east.", note: "'the' for unique things." },
    { en: "He gave me a useful tip.", note: "'a' — 'useful' starts with a 'yu' sound." }
  ],
  tip: "Listen to the first SOUND, not the first letter: 'an hour', 'a university'.",
  applyPrompt: "Write 5 sentences about your classroom, using 'a', 'an' and 'the' correctly at least once each."
},
prepositions: {
  warmup: { q: "Which is correct: 'good in English' or 'good at English'?", a: "'Good at English' — some prepositions just go with certain words. Learn them as pairs." },
  keyPoints: [
    "'In' for months/years/places: in June, in 2012, in Karachi.",
    "'On' for days and surfaces: on Monday, on the table.",
    "'At' for exact times and points: at 5 o'clock, at the door.",
    "'Since' = from a point in time; 'for' = a length of time: since 2020 / for five years."
  ],
  examples: [
    { en: "She was born in 2012.", note: "'in' with years." },
    { en: "The meeting is at 10 o'clock.", note: "'at' with clock time." },
    { en: "They have lived here for five years.", note: "'for' with a duration." }
  ],
  tip: "Learn prepositions in pairs: good AT, afraid OF, divide BETWEEN two, arrive AT a station.",
  applyPrompt: "Describe your route from home to school in 4 sentences, using in, on, at, and between."
},
punct: {
  warmup: { q: "Fix it: 'where are you going' — what is missing?", a: "A capital W and a question mark: 'Where are you going?'" },
  keyPoints: [
    "Every sentence starts with a capital letter and ends with . ? or !",
    "Use ? for questions, ! for strong feelings, . for statements.",
    "Apostrophes show missing letters (don't = do not) or possession (Ali's book).",
    "Its = belonging to it. It's = it is. They are never interchangeable."
  ],
  examples: [
    { en: "Where are you going?", note: "Question mark for a question." },
    { en: "My friend Ali lives in Lahore.", note: "Capitals for names and places." },
    { en: "It's a sunny day.", note: "Apostrophe for 'it is'." }
  ],
  tip: "Read your sentence aloud: a full stop is a full pause, a comma is a short breath.",
  applyPrompt: "Write 4 sentences about your best friend with perfect punctuation and capitals — then check each one."
},
clauses: {
  warmup: { q: "Is 'Because I was hungry' a complete sentence? Why not?", a: "No — it is a dependent clause. It needs a main clause: 'Because I was hungry, I ate.'" },
  keyPoints: [
    "Simple sentence = one independent clause: 'She sings.'",
    "Compound = two independent clauses joined: 'She sings, and he dances.'",
    "Complex = independent + dependent: 'When the bell rang, we stood up.'",
    "Dependent clauses start with words like because, although, when, who, which."
  ],
  examples: [
    { en: "I like tea, and she likes coffee.", note: "Compound — two full ideas." },
    { en: "Although it rained, we played.", note: "Complex — 'although' clause depends on the rest." },
    { en: "Close the door.", note: "Imperative — gives a command." }
  ],
  tip: "Ask: can this part stand alone? If not, it is dependent and needs a partner clause.",
  applyPrompt: "Write one simple, one compound and one complex sentence about your school."
},
synant: {
  warmup: { q: "If 'brave' means بہادر, what is its opposite?", a: "Cowardly (بزدل). Opposites are called antonyms." },
  keyPoints: [
    "Synonyms = same meaning: happy → glad, joyful, cheerful.",
    "Antonyms = opposite meaning: brave → cowardly, ancient → modern.",
    "Learn words in pairs or families — they stick better together.",
    "Use the Urdu hint, then try to use the English word in your own sentence."
  ],
  examples: [
    { en: "rapid = fast", note: "Synonym pair." },
    { en: "victory ↔ defeat", note: "Antonym pair." },
    { en: "generous ↔ selfish", note: "Antonym pair." }
  ],
  tip: "When you learn a new word, always learn one synonym and one antonym with it.",
  applyPrompt: "Pick 5 adjectives. For each, write one synonym, one antonym, and use the original word in a sentence."
},
vocab: {
  warmup: { q: "In 'unhappy', what does 'un-' do to 'happy'?", a: "It flips the meaning to 'not happy'. 'un-' is a prefix." },
  keyPoints: [
    "Prefixes go at the FRONT: un-, re-, pre-, mis-, dis- (unhappy, rewrite, preview).",
    "Suffixes go at the END: -ful, -less, -ness, -ly (hopeful, careless, kindness).",
    "-ful = full of, -less = without: careful vs careless.",
    "Guess new words by splitting them: 'mis' + 'behave' = behave badly."
  ],
  examples: [
    { en: "impossible = im + possible", note: "'im-' means 'not' here." },
    { en: "kindness = kind + ness", note: "'-ness' makes a noun: the state of being kind." },
    { en: "quickly = quick + ly", note: "'-ly' often makes an adverb." }
  ],
  tip: "Split unknown words into parts — the prefix or suffix often gives the meaning away.",
  applyPrompt: "Take the words 'happy', 'care', 'help', 'hope'. Add a prefix or suffix to each and use the new words in sentences."
},
reading: {
  warmup: { q: "Before answering, what should you do with a comprehension passage?", a: "Read it fully once — answers are always IN the text." },
  keyPoints: [
    "Read the whole passage first; then read the question.",
    "Find the exact lines that answer the question — underline them in your mind.",
    "For 'why' questions, look for because/so/since in the text.",
    "Do not guess from outside knowledge — the passage is the boss."
  ],
  examples: [
    { en: "Q: Where does the Indus end? → Scan for 'joins the Arabian Sea'.", note: "Answer sits in the text." },
    { en: "Q: Why did the children stay inside? → 'The streets filled with water'.", note: "The reason is stated." }
  ],
  tip: "If two options look right, pick the one the passage actually says — not the one you think is true.",
  applyPrompt: "Read any story in the Reading Library and write 3 of your own questions about it — then answer them."
},
writing: {
  warmup: { q: "What makes a paragraph different from 5 random sentences?", a: "A paragraph is about ONE topic, with sentences linked in order." },
  keyPoints: [
    "One paragraph = one topic. Start with a clear opening sentence.",
    "Write 4–5 sentences in a sensible order.",
    "Use linking words: first, then, also, finally.",
    "Check at the end: capitals, full stops, spelling."
  ],
  examples: [
    { en: "Topic sentence: 'My school is a happy place.'", note: "Tells the reader the topic." },
    { en: "Supporting: 'The teachers are kind. We play in the big ground.'", note: "Details about the topic." },
    { en: "Closing: 'I love my school.'", note: "A neat ending." }
  ],
  tip: "Say it aloud before you write it — if it sounds clear when spoken, it will read clearly.",
  applyPrompt: "Write a paragraph about your favourite festival. Then check it against the 4 key points above."
}
};
