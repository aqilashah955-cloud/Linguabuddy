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
    "Use the English meaning, then try to use the word in your own sentence."
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
},
conditionals: {
  warmup: { q: "What is the difference between 'If it rains, we stay home' and 'If it rained, we would stay home'?", a: "The first is a real possibility; the second imagines an unreal situation — different conditional types." },
  objective: "Use zero, first, second and third conditionals to talk about facts, real futures, imaginary situations and past regrets.",
  keyPoints: [
    "Zero conditional = facts: If + present simple, present simple — 'If you heat water, it boils.'",
    "First conditional = real future: If + present simple, will + verb — 'If it rains, we will stay home.'",
    "Second conditional = unreal present: If + past simple, would + verb — 'If I were rich, I would travel.' (Use 'were' for every person.)",
    "Third conditional = unreal past: If + past perfect, would have + past participle — 'If I had studied, I would have passed.'",
    "'Unless' means 'if not': 'Unless you hurry, you will be late.' 'Had I known' is an inverted third conditional."
  ],
  examples: [
    { en: "If you mix red and yellow, you get orange.", note: "Zero — a fact." },
    { en: "If she calls, I will answer.", note: "First — a real future possibility." },
    { en: "If I won the lottery, I would build a school.", note: "Second — imaginary." },
    { en: "If he had left earlier, he would have caught the bus.", note: "Third — a past regret." }
  ],
  tip: "Match the 'if' clause to the main clause: present → will, past → would, past perfect → would have.",
  applyPrompt: "Write 4 sentences: one fact (zero), one plan (first), one dream (second), one regret (third)."
},
"modal-perfects": {
  warmup: { q: "What does 'You should have called' tell us — did the person call?", a: "No — it expresses regret or criticism about a past action that was not done." },
  objective: "Use modal + have + past participle to express regret, certainty and possibility about the past.",
  keyPoints: [
    "'Should/ought to have' + past participle = regret or unheeded advice: 'I should have studied.'",
    "'Must have' + past participle = strong certainty: 'She must have left early.'",
    "'Could/might/may have' + past participle = past possibility or a guess: 'He might have forgotten.'",
    "'Can't/couldn't have' + past participle = impossibility: 'He can't have said that!'",
    "'Needn't have' + past participle = an unnecessary past action: 'You needn't have cooked so much.'"
  ],
  examples: [
    { en: "You should have told me earlier.", note: "Regret — but you did not tell me." },
    { en: "The streets are wet; it must have rained.", note: "Strong certainty about the past." },
    { en: "He could have won if he had tried.", note: "A past possibility that never happened." }
  ],
  tip: "The structure never changes: modal + have + past participle — only the modal changes the meaning.",
  applyPrompt: "Write 3 sentences about yesterday: one regret (should have), one certainty (must have), one guess (might have)."
},
subjunctive: {
  warmup: { q: "Which is correct: 'I suggest he goes' or 'I suggest he go'?", a: "'I suggest he go' — after verbs of suggestion we use the base verb (the subjunctive)." },
  objective: "Use the subjunctive after verbs of suggestion, demand and necessity, and in wishes and unreal conditions.",
  keyPoints: [
    "After suggest, demand, insist, request, recommend: use the base verb — 'I suggest he go', not 'he goes'.",
    "After 'it is important/vital/necessary that': 'It is vital that she be here.'",
    "In unreal conditions and wishes, use 'were' for every person: 'If I were you...', 'I wish I were taller.'",
    "Fixed expressions keep the subjunctive: 'Long live the king!', 'God save us.'"
  ],
  examples: [
    { en: "The teacher demanded that he leave at once.", note: "Base verb 'leave' after 'demanded'." },
    { en: "If I were a bird, I would fly to the mountains.", note: "'Were' for unreal situations." },
    { en: "I wish I knew the answer.", note: "Past simple after 'wish' for present wishes." }
  ],
  tip: "If you see suggest/demand/insist/important + 'that', drop the -s: 'he go', 'she be'.",
  applyPrompt: "Write 3 recommendations for your school starting with 'I suggest that...' and 'It is important that...'."
},
inversion: {
  warmup: { q: "Which sounds more dramatic: 'I have never seen this' or 'Never have I seen this'?", a: "The second — inversion adds emphasis and formality." },
  objective: "Invert subject and verb after negative adverbials for emphasis in formal English.",
  keyPoints: [
    "After never, rarely, seldom, hardly, scarcely: auxiliary + subject — 'Never have I seen', 'Rarely does she complain.'",
    "'Not only... but also' inverts the first clause: 'Not only did he arrive late, but he also forgot his books.'",
    "'No sooner... than' and 'hardly/scarcely... when': 'No sooner had we sat down than the lights went out.'",
    "'Only' phrases invert too: 'Only after the rain stopped could we leave.'"
  ],
  examples: [
    { en: "Never have I tasted such delicious mangoes.", note: "Inversion after 'never'." },
    { en: "Hardly had I slept when the alarm rang.", note: "Inversion after 'hardly'." },
    { en: "Not only is she intelligent, but she is also kind.", note: "Paired inversion." }
  ],
  tip: "Inversion needs an auxiliary verb (do/have/had/was) before the subject — never invert with the main verb alone.",
  applyPrompt: "Rewrite with inversion: 'I have rarely met...', 'She seldom complains...', 'We had no sooner left...'."
},
"cleft-sentences": {
  warmup: { q: "In 'Ali broke the window', how would you stress that it was ALI and no one else?", a: "'It was Ali who broke the window.' — a cleft sentence puts the spotlight on Ali." },
  objective: "Use it-clefts and wh-clefts to emphasise exactly which part of a sentence matters.",
  keyPoints: [
    "It-cleft: It + be + emphasised part + who/that-clause — 'It was Sara who won.'",
    "The spotlight can fall on a person, thing, place or time: 'It was in Lahore that we met.'",
    "Wh-cleft (pseudo-cleft): What-clause + be + emphasis — 'What I need is more time.'",
    "'All' works like 'what': 'All I want is a little rest.'"
  ],
  examples: [
    { en: "It was the dog that broke the vase.", note: "Emphasis on 'the dog'." },
    { en: "What surprised me was his honesty.", note: "Wh-cleft emphasising 'his honesty'." },
    { en: "It was yesterday that the results came out.", note: "Emphasis on time." }
  ],
  tip: "Ask 'who?' or 'what?' about your sentence — the answer goes into the spotlight position.",
  applyPrompt: "Take 3 plain sentences and rewrite each as a cleft, emphasising a different word each time."
},
participles: {
  warmup: { q: "What is the difference between 'a boring book' and 'a bored reader'?", a: "'Boring' (-ing) describes the cause; 'bored' (-ed) describes the feeling." },
  objective: "Use -ing and -ed participles correctly and build participial phrases for richer sentences.",
  keyPoints: [
    "Present participle (-ing) = the CAUSE of a feeling: 'an exciting match', 'a tiring journey'.",
    "Past participle (-ed) = the one who FEELS: 'excited fans', 'tired travellers'.",
    "Perfect participle 'having + past participle' shows a finished action: 'Having finished his work, Ali went out.'",
    "Past participles work as adjectives too: 'a broken window', 'a worried mother'."
  ],
  examples: [
    { en: "The news was surprising; we were surprised.", note: "-ing for cause, -ed for feeling." },
    { en: "Having lived in Lahore, she knows the city well.", note: "Perfect participle phrase." },
    { en: "Frightened by the thunder, the child hid under the bed.", note: "Past participle phrase." }
  ],
  tip: "-ing describes the thing; -ed describes the person. 'I am bored' (feeling) — 'the movie is boring' (cause).",
  applyPrompt: "Describe your last trip using 3 -ing adjectives and 3 -ed adjectives correctly."
},
determiners: {
  warmup: { q: "What is the difference between 'few friends' and 'a few friends'?", a: "'Few' is negative (hardly any); 'a few' is positive (some). One tiny word changes everything." },
  objective: "Choose exact determiners and quantifiers — each/every, few/a few, much/many, all/both — before nouns.",
  keyPoints: [
    "'Each' stresses individuals, 'every' the whole group — both take singular verbs: 'Each student has a book.'",
    "'Few' = hardly any (negative); 'a few' = some (positive). Same with 'little' vs 'a little' for uncountables.",
    "'Much' + uncountable ('much water'); 'many' + countable ('many books').",
    "'Both' = two, 'all' = three or more; 'either/neither' for two, 'any/none' for larger groups."
  ],
  examples: [
    { en: "Each of the players received a medal.", note: "'Each' + singular verb." },
    { en: "I have a few close friends.", note: "'A few' = some (positive)." },
    { en: "Both brothers are engineers.", note: "'Both' for two people." }
  ],
  tip: "Countable or not? Countable → many/few; uncountable → much/little. That one test solves most errors.",
  applyPrompt: "Write 5 sentences about your classroom using: each, a few, much, both, every."
},
"modals": {
  warmup: { q: "Which is more polite: 'Give me your pen' or 'Can you give me your pen'? Why?", a: "'Can you give me your pen' — 'can' is a modal verb that turns a demand into a polite request." },
  keyPoints: [
    "can = ability: 'She can swim.' could = past ability: 'She could swim at five.'",
    "may = permission: 'May I come in?' must = strong obligation: 'You must wear a seatbelt.'",
    "must not = prohibition (not allowed): 'You must not run in the corridor.'",
    "will = polite request: 'Will you open the window?' might/may = possibility: 'It might rain.' shall = offer: 'Shall I help you?'"
  ],
  examples: [
    { en: "He can solve this puzzle.", note: "can — shows ability." },
    { en: "You must not run in the corridor.", note: "must not — prohibition, it is not allowed." },
    { en: "It might rain today.", note: "might — possibility, not certainty." }
  ],
  tip: "After a modal verb, always use the base verb: 'She can swim' — never 'She can swims' or 'She can to swim'.",
  applyPrompt: "Write 6 sentences: 2 showing ability (can), 2 asking permission (may), 1 obligation (must), and 1 prohibition (must not)."
},
"nouns": {
  warmup: { q: "Is 'water' countable? Can you say 'two waters'?", a: "No — water is uncountable. We say 'two glasses of water', not 'two waters'." },
  keyPoints: [
    "Collective nouns name a group: a flock of birds, a team of players, a herd of cows.",
    "Countable nouns take many/few and a/an: 'many books'. Uncountable nouns take much/little: 'much water', 'little sugar'.",
    "Abstract nouns name ideas, not things: honesty, courage, kindness. Make them from adjectives: honest → honesty.",
    "Irregular plurals don't add -s: child → children, ox → oxen. 'Sheep' stays 'sheep'. Some plurals change meaning: arm (body part) → arms (weapons)."
  ],
  examples: [
    { en: "A flock of birds flew across the sky.", note: "flock — collective noun for birds." },
    { en: "How much water is left in the bottle?", note: "much — water is uncountable, so never 'many water'." },
    { en: "Honesty is the best policy.", note: "honesty — abstract noun made from the adjective 'honest'." }
  ],
  tip: "If you can count it with numbers (one book, two books), it's countable. If not (water, rice, furniture), use much/little.",
  applyPrompt: "Write the plurals of: child, ox, sheep, tooth, foot. Then write 3 sentences: one with a collective noun, one with an abstract noun, one with an uncountable noun."
},
"questions": {
  warmup: { q: "What is wrong with 'Where you live?'", a: "The word order — English questions need a helping verb: 'Where do you live?'" },
  keyPoints: [
    "Wh-words ask for different things: who (person), where (place), when (time), why (reason), how (way), which (choice), whose (owner).",
    "Present questions use do/does: 'Does she like apples?' — 'does' with he/she/it, 'do' with I/you/we/they.",
    "Past questions use did: 'Did they play yesterday?' — the main verb stays in base form.",
    "Word order: Wh-word + helping verb + subject + verb → 'When does the school open?'"
  ],
  examples: [
    { en: "Where did you go after school?", note: "where (place) + did (past) + you + go." },
    { en: "Whose bag is this?", note: "whose — asks about the owner of the bag." },
    { en: "Which of these two shirts do you like?", note: "which — choosing between options." }
  ],
  tip: "After do/does/did, the main verb never takes -s or -ed: 'Did she go?' — never 'Did she went?'",
  applyPrompt: "Write 5 questions to interview a friend — use who, where, when, why, and which, one wh-word per question."
},
"sentence-types": {
  warmup: { q: "'Close the door.' Is that a statement or an order?", a: "An order — an imperative sentence. It tells someone to do something." },
  keyPoints: [
    "Declarative states a fact: 'She reads every night.' Interrogative asks: 'Did you call me?'",
    "Imperative gives an order or request: 'Please sit down.' Exclamatory shows strong feeling: 'What a lovely garden!'",
    "Simple = one clause: 'The baby slept.' Compound = two clauses joined by and/but/or: 'The baby slept, and the mother cooked.'",
    "Complex = main clause + dependent clause: 'Although I was tired, I finished the race.' To make a negative, add do/does not: 'He likes tea' → 'He does not like tea.'"
  ],
  examples: [
    { en: "What a beautiful rainbow!", note: "Exclamatory — strong feeling, ends with !." },
    { en: "The baby slept, and the mother cooked.", note: "Compound — two independent clauses joined by 'and'." },
    { en: "Can she swim?", note: "Interrogative — the helping verb 'can' moves to the front." }
  ],
  tip: "Count the clauses: one = simple; two joined by and/but/or = compound; one main + one starting with although/because/when = complex.",
  applyPrompt: "Write 4 sentences: one imperative, one exclamatory, one compound, and one complex. Label each one."
},
"verbals": {
  warmup: { q: "In 'He bought a pen', what receives the action?", a: "'A pen' — the verb 'bought' needs an object. That makes it a transitive verb." },
  keyPoints: [
    "Transitive verbs need an object: 'He bought a pen.' Intransitive verbs don't: 'The baby slept.'",
    "A gerund is verb-ing used as a noun: 'Swimming is good exercise.'",
    "An infinitive is 'to' + base verb: 'She decided to leave.'",
    "Some verbs take gerunds (enjoy playing), some take infinitives (want to go, promised to come, decided to leave)."
  ],
  examples: [
    { en: "They enjoy playing cricket.", note: "playing — gerund after 'enjoy'." },
    { en: "She wants to study abroad.", note: "to study — infinitive after 'wants'." },
    { en: "Waking early is a good habit.", note: "waking — gerund doing a noun's job as the subject." }
  ],
  tip: "If the -ing word is doing a noun's job (subject or object), it's a gerund. If it follows 'to', it's an infinitive.",
  applyPrompt: "Write 3 sentences with a gerund (use enjoy, like, or start) and 3 with an infinitive (use want, decide, or promise)."
},
"pronouns": {
  warmup: { q: "Which is correct: 'Her is my friend' or 'She is my friend'?", a: "'She is my friend' — use the subject pronoun (she) before the verb, not the object pronoun (her)." },
  keyPoints: [
    "Subject pronouns do the action: I, she, he, they. Object pronouns receive it: me, her, him, them — 'The teacher praised us.'",
    "Possessive pronouns stand alone: mine, yours, hers — 'This pen is mine.'",
    "Reciprocal pronouns show mutual action: 'They helped each other.' Indefinite pronouns are vague: somebody, anybody, nobody.",
    "Demonstratives point: this/that (one), these/those (many). 'Its' (no apostrophe) shows possession; 'it's' means 'it is'."
  ],
  examples: [
    { en: "The dog wagged its tail happily.", note: "its — possession, no apostrophe." },
    { en: "Which of these two books do you prefer?", note: "which — choosing between two; these — plural demonstrative." },
    { en: "Say 'He and I went to the market', not 'Me and him went'.", note: "Use subject pronouns as subjects." }
  ],
  tip: "Before the verb → subject pronoun (she, they, I). After the verb or preposition → object pronoun (her, them, me).",
  applyPrompt: "Rewrite correctly: 1) 'Him gave me a pen.' 2) 'The bag is my.' 3) 'Its raining outside.' Then write 2 sentences using 'each other'."
},
"adverbs": {
  warmup: { q: "She sings 'beautiful' or 'beautifully'?", a: "'Beautifully' — adverbs describe verbs, and most add -ly to the adjective." },
  keyPoints: [
    "Adverbs of manner tell how: slowly, beautifully, carefully — usually adjective + -ly.",
    "Adverbs of frequency tell how often: always, regularly, never — 'She regularly visits her grandmother.'",
    "Adverb clauses tell when or why: 'when I arrive' in 'I will call you when I arrive'.",
    "'Too' means 'more than enough': 'too hot to play'. 'Very' just adds strength: 'very hot'."
  ],
  examples: [
    { en: "The tortoise walks slowly.", note: "slowly — adverb of manner describing 'walks'." },
    { en: "Carefully, he crossed the busy road.", note: "carefully — describes how he crossed." },
    { en: "He left in a hurry because he was late.", note: "in a hurry — an adverb phrase of manner." }
  ],
  tip: "Adjective describes a noun (a beautiful song). Adverb describes a verb (she sings beautifully) — don't mix them.",
  applyPrompt: "Describe your morning routine in 5 sentences, using at least 4 adverbs of manner or frequency."
},
"adjectives": {
  warmup: { q: "In 'a red car', which word describes the car?", a: "'Red' — an adjective. It comes before the noun it describes." },
  keyPoints: [
    "Adjectives describe nouns: a tall building, the tired child. They usually come before the noun.",
    "Form adjectives with suffixes: danger → dangerous, care → careful, beauty → beautiful.",
    "Some adjectives come in phrases after the noun: 'the girl in red'.",
    "Use 'good' (adjective) with nouns and sense verbs: 'The food smells good' — not 'well'."
  ],
  examples: [
    { en: "She wore a beautiful dress to the party.", note: "beautiful — adjective before the noun 'dress'." },
    { en: "The story was very exciting.", note: "exciting — describes the story itself." },
    { en: "The girl in red won the first prize.", note: "in red — an adjective phrase after the noun." }
  ],
  tip: "If it answers 'what kind?' about a noun, it's an adjective. If it describes a verb, you need an adverb instead.",
  applyPrompt: "Describe your best friend in 5 sentences, using at least 5 different adjectives — include one formed with a suffix like -ful or -ous."
},
"syllables": {
  warmup: { q: "Clap the beats in 'beautiful'. How many?", a: "Three: beau-ti-ful. Each beat is a syllable." },
  keyPoints: [
    "A syllable is one beat of a word: bas-ket (2), ed-u-ca-tion (4).",
    "Silent letters are written but not heard: the k in knife, the w in write, the p in psychology.",
    "Prefixes go before the root and change meaning: un- and im- mean 'not' — 'impossible' means 'not possible'.",
    "Suffixes go after the root: -ful means 'full of' (hopeful). Find the root first: 'care' in 'carelessness'."
  ],
  examples: [
    { en: "beautiful = beau-ti-ful (3 syllables).", note: "Clap or tap each vowel beat to count." },
    { en: "knife — the k is silent.", note: "Say 'nife': you hear no k." },
    { en: "unhappy = un + happy.", note: "un- means 'not'; the root word is 'happy'." }
  ],
  tip: "Put your hand under your chin — each time your chin drops as you say a word is one syllable.",
  applyPrompt: "Divide into syllables: computer, banana, tomorrow. Then circle the silent letter in: know, half, wrong."
},
"sentence-patterns": {
    "warmup": {
      "q": "In “She gave me a pen”, who got the pen — and what was given?",
      "a": "“Me” got the pen (the receiver), and “a pen” was the thing given. English names these the indirect object and the direct object."
    },
    "keyPoints": [
      "SVOO = Subject + Verb + Indirect Object + Direct Object: “She gave me a pen.” The indirect object (me) is the receiver; the direct object (a pen) is the thing given.",
      "SVOC = Subject + Verb + Object + Complement: “We painted the wall blue.” The complement (blue) describes the object (the wall).",
      "Test for a complement: it renames or describes the object — “They elected him president” (president = what he became).",
      "Word order matters: the indirect object comes before the direct object — “She sent me a letter”, not “She sent a letter me”."
    ],
    "examples": [
      { "en": "He told her a story.", "note": "SVOO — her = indirect object, a story = direct object." },
      { "en": "The teacher called Ali a star.", "note": "SVOC — “a star” is the complement describing Ali." },
      { "en": "She made tea.", "note": "Simple SVO — “tea” is the direct object; no receiver, so no SVOO." }
    ],
    "tip": "Ask “to whom?” for the indirect object and “what?” for the direct object — the answers reveal the pattern.",
    "applyPrompt": "Label each sentence SVO, SVOO, or SVOC: 1) “I bought my mother flowers.” 2) “They named the baby Zara.” 3) “We watched a film.” Then write one SVOO and one SVOC sentence of your own."
  },
  "formal-letters": {
    "warmup": {
      "q": "Which greeting fits a letter to your principal: “Hi!” or “Dear Sir,”?",
      "a": "“Dear Sir,” — formal letters use respectful greetings, never casual ones like “Hi!”."
    },
    "keyPoints": [
      "Layout order: sender's address → date → greeting → body → closing. The date goes just below your own address.",
      "Greeting and closing match: “Dear Sir,” pairs with “Yours faithfully,”; a named person (“Dear Mr. Ahmed,”) pairs with “Yours sincerely,”. Unknown name → “Dear Sir/Madam,”.",
      "First paragraph states your purpose at once: “I am writing to apply for…” or “I am writing to complain about…”.",
      "Keep a formal tone: no short forms (write “do not”, not “don't”), be polite and clear, and give a formal email a clear subject line."
    ],
    "examples": [
      { "en": "Dear Sir, I am writing to complain about the faulty kettle I bought on Monday.", "note": "Formal complaint — respectful greeting, purpose stated at once." },
      { "en": "Subject: Request for three days' leave", "note": "A clear subject line tells the reader the topic before they open the email." },
      { "en": "Yours faithfully, Amina Khan", "note": "Correct closing when you began with “Dear Sir,” (no name used)." }
    ],
    "tip": "Read your letter back pretending you are the principal — if any line sounds rude or casual, rewrite it.",
    "applyPrompt": "Write a short formal letter (80–100 words) to your principal requesting leave for two days. Include the address, date, greeting, two body paragraphs, and a correct closing."
  },
  "past-tense": {
    "warmup": {
      "q": "Which is correct: “They goed to the park” or “They went to the park”?",
      "a": "“They went to the park” — “go” is irregular, so its past form is “went”, never “goed”."
    },
    "keyPoints": [
      "Regular verbs add -ed: walk → walked, play → played, watch → watched.",
      "Irregular verbs change form — learn them by heart: go → went, eat → ate, buy → bought, teach → taught, sing → sang, do → did.",
      "Negatives use “did not (didn't)” + base verb: “He didn't come yesterday” (not “didn't came”).",
      "Time words like “yesterday”, “last night”, and “this morning” signal the simple past."
    ],
    "examples": [
      { "en": "They played football yesterday.", "note": "Regular verb — play + -ed." },
      { "en": "She went to school late this morning.", "note": "Irregular verb — go → went." },
      { "en": "We watched a film yesterday.", "note": "Past simple with a finished-time word." }
    ],
    "tip": "If the verb doesn't take -ed naturally, it's probably irregular — check your irregular verb list.",
    "applyPrompt": "Write 5 sentences about what you did last Sunday. Use at least 3 irregular verbs (went, ate, saw, bought, did, sang) and one negative with “didn't”."
  },
  "skimming": {
    "warmup": {
      "q": "You have 2 minutes before a test to revise a 5-page chapter. Do you read every word?",
      "a": "No — you skim: read the title, headings, and first sentences to grab the main ideas fast."
    },
    "keyPoints": [
      "Skimming means reading quickly for the general idea — not every word. It answers: “What does this text mainly discuss?”",
      "Start with the title, then the first sentences of paragraphs — topic sentences often carry the main idea.",
      "To find the writer's purpose fast, skim the introduction and the conclusion.",
      "Skimming is for overviews: choosing a book, revising notes, or deciding if a text is useful — not for deep study."
    ],
    "examples": [
      { "en": "Read the title first.", "note": "Good skimming advice — the title previews the topic." },
      { "en": "The first sentence of each paragraph usually holds its main point.", "note": "Topic sentences guide a quick skim." },
      { "en": "Reading every word slowly and carefully.", "note": "That is careful reading — the opposite of skimming." }
    ],
    "tip": "Let your eyes move fast and only stop at names, dates, and repeated key words.",
    "applyPrompt": "Take any page from your English textbook. Skim it in 60 seconds, then write one sentence: what is this page mainly about? Check by reading it fully — were you right?"
  },
  "poetry": {
    "warmup": {
      "q": "Do “light” and “night” rhyme? What about “light” and “late”?",
      "a": "“Light” and “night” rhyme (same ending sound); “light” and “late” do not."
    },
    "keyPoints": [
      "Rhyme is matching end sounds (light/night); rhythm is the beat of the poem — repetition like “Run, run, run!” builds it.",
      "A stanza is a group of lines, like a paragraph in prose. A haiku is a tiny poem of exactly 3 lines.",
      "Simile compares with “like” or “as” (“brave as a lion”); metaphor says one thing IS another (“He is a rock”); personification gives human qualities to non-humans (“The moon smiled at me”).",
      "Imagery uses words that appeal to the senses — sight, sound, smell, taste, touch — to paint pictures in the reader's mind."
    ],
    "examples": [
      { "en": "The wind whispered softly.", "note": "Personification — wind cannot really whisper." },
      { "en": "The classroom was a zoo.", "note": "Metaphor — the classroom IS called a zoo (no “like”/“as”)." },
      { "en": "Brave as a lion.", "note": "Simile — comparison using “as”." }
    ],
    "tip": "Spot the trick: “like/as” → simile; “is” comparison → metaphor; human action on a thing → personification.",
    "applyPrompt": "Write a 4-line poem about rain. Include one simile, one example of personification, and one pair of rhyming lines. Underline each device and label it."
  },
  "connotation": {
    "warmup": {
      "q": "Which sounds kinder: calling someone “slim” or “skinny”?",
      "a": "“Slim” — both mean thin, but “slim” feels positive while “skinny” feels negative."
    },
    "keyPoints": [
      "Connotation is the feeling a word suggests beyond its dictionary meaning. “Childlike” feels sweet; “childish” feels rude — same idea, different feeling.",
      "Writers choose words for their connotation: “a bold plan” excites you, “a crazy scheme” makes you suspicious.",
      "Watch intensity too: “cold” and “freezing” both mean low temperature, but “freezing” is stronger.",
      "Strong verbs carry connotation: “glared” suggests anger where “glanced” is neutral."
    ],
    "examples": [
      { "en": "She is confident about her work.", "note": "Positive connotation — “arrogant” would say the same thing negatively." },
      { "en": "He is economical with money.", "note": "Positive; “stingy” would make the same habit sound bad." },
      { "en": "Words carry feelings too.", "note": "True — every word choice shades the reader's emotion." }
    ],
    "tip": "When two words mean the same, ask: “Would I be happy to be called this?” — the answer reveals the connotation.",
    "applyPrompt": "Rewrite these with a POSITIVE connotation: 1) “He is stubborn.” 2) “She is bossy.” 3) “It was a cheap hotel.” Then rewrite them with a NEGATIVE connotation."
  },
  "figurative": {
    "warmup": {
      "q": "If “it's raining cats and dogs”, should you look out for falling animals?",
      "a": "No! It means it is raining very heavily — the words don't mean exactly what they say."
    },
    "keyPoints": [
      "Literal meaning is the dictionary meaning (“cold” = low temperature). Figurative meaning is imaginative (“a cold person” = unfriendly).",
      "Figurative language does not mean exactly what the words say: “break the ice” literally means smash frozen water, but figuratively it means start a friendly conversation.",
      "An author's word choice shapes tone and meaning — “Time is money” suggests time is valuable.",
      "A dictionary gives literal meanings; the surrounding text gives the contextual (figurative) meaning."
    ],
    "examples": [
      { "en": "She has a heart of gold.", "note": "Figurative — she is kind, not made of metal." },
      { "en": "She is a bright student.", "note": "Figurative “bright” — clever, not giving off light." },
      { "en": "Break the ice at the party.", "note": "Figurative — start talking; literally it would mean smashing frozen water." }
    ],
    "tip": "If the literal meaning sounds silly or impossible, the writer means it figuratively.",
    "applyPrompt": "Mark each LITERAL or FIGURATIVE and explain: 1) “He kicked the bucket.” 2) “She kicked the ball.” 3) “My head is spinning.” 4) “The spinning top fell.”"
  },
  "descriptive-writing": {
    "warmup": {
      "q": "Which is more descriptive: “The garden was nice” or “The garden burst with red roses and the sweet smell of jasmine”?",
      "a": "The second — precise details and senses (sight, smell) make the reader see and feel the garden."
    },
    "keyPoints": [
      "Move from general to specific: start with the whole scene, then zoom into details.",
      "Use the five senses and precise adjectives — “enormous” paints more than “big”; “whispered” more than “said”.",
      "Show, don't just tell: include feelings and atmosphere, not only facts. Describing a person? Cover appearance, habits, and traits.",
      "Plan first: brainstorm and mind-map ideas, write a rough (first) draft, then polish."
    ],
    "examples": [
      { "en": "The garden burst with red roses and the sweet smell of jasmine.", "note": "Vivid — precise adjectives plus senses of sight and smell." },
      { "en": "Don't just tell, show.", "note": "Good writing advice — let details create the feeling." },
      { "en": "Her enormous dog snored softly on the rug.", "note": "“Enormous” is precise; sound (“snored”) adds life." }
    ],
    "tip": "After writing, circle every “nice”, “good”, “big” — replace each with a precise word.",
    "applyPrompt": "Describe your best friend in 8–10 sentences (appearance, habits, traits). Use at least 3 senses and 5 precise adjectives. Start general, end with one small specific detail."
  },
  "paraphrasing": {
    "warmup": {
      "q": "Is copying a sentence word-for-word the same as paraphrasing it?",
      "a": "No — copying is not paraphrasing. Paraphrasing keeps the meaning but changes the words."
    },
    "keyPoints": [
      "Paraphrasing = restating in your own words. Keep the original meaning, change the wording — it proves you understand the text.",
      "It is not translation into another language, and it is not copying, even with small changes.",
      "Swap in synonyms and reshape the sentence: “She speaks quickly” → “She talks fast.” / “It is raining heavily” → “It is pouring down.”",
      "Poem stanzas can be paraphrased too: restate each stanza's message in simple, correct prose."
    ],
    "examples": [
      { "en": "“The boy was very tired” → “The exhausted lad needed rest.”", "note": "Best paraphrase — meaning kept, words fully changed." },
      { "en": "“It is raining heavily” → “It is pouring down.”", "note": "Same meaning, fresh wording." },
      { "en": "Use your own words.", "note": "The golden rule of paraphrasing." }
    ],
    "tip": "Read, cover the text, then say it aloud as if explaining to a friend — write down what you said.",
    "applyPrompt": "Paraphrase these in your own words: 1) “The old man walked slowly to the market.” 2) “She was delighted with her exam results.” 3) Any 4-line stanza from a poem in your textbook."
  }

};
