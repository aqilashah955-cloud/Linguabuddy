// LinguaBuddy curated content — SLO question banks (Middle, grades 6-8)
// Versioned data module. Works offline; zero Firestore read costs.
export const DATA_VERSION_SLOS = "1.3.0";

export const SLOS = [
{
  id: "tenses", title: "Tenses",
  expl: "Tenses tell us WHEN an action happens — in the past, present or future. Choosing the right verb form keeps your meaning clear.",
  questions: [
    { t: "mcq", q: "She ___ to school every day.", o: ["go", "goes", "going", "went"], a: 1 },
    { t: "mcq", q: "They ___ football yesterday.", o: ["play", "plays", "played", "playing"], a: 2 },
    { t: "mcq", q: "I ___ my homework tomorrow.", o: ["do", "did", "will do", "doing"], a: 2 },
    { t: "fib", q: "The baby ___ loudly right now. (cry)", a: ["is crying"] },
    { t: "fib", q: "We ___ our grandparents last Eid. (visit)", a: ["visited"] },
    { t: "tf", q: "\u201CShe has finished her work\u201D is in the present perfect tense.", a: true },
    { t: "mcq", q: "Which sentence is in the past continuous tense?", o: ["I was reading a book.", "I read a book.", "I will read a book.", "I have read a book."], a: 0 },
    { t: "fib", q: "By next year, they ___ the new school. (build, future perfect)", a: ["will have built"] },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["She", "has", "lived", "here", "since", "2010"], a: "She has lived here since 2010" },
    { t: "mcq", q: "He ___ in Karachi since 2015.", o: ["lives", "has lived", "is living", "live"], a: 1 }
  ]
},
{
  id: "sva", title: "Subject-Verb Agreement",
  expl: "The verb must agree with its subject: singular subjects take singular verbs, plural subjects take plural verbs. Watch out for tricky subjects!",
  questions: [
    { t: "mcq", q: "The boys ___ playing in the park.", o: ["is", "are", "was", "has"], a: 1 },
    { t: "mcq", q: "Each of the students ___ a uniform.", o: ["wear", "wears", "wearing", "wore"], a: 1 },
    { t: "fib", q: "Neither Ali nor his friends ___ late. (was / were)", a: ["were"] },
    { t: "tf", q: "\u201CThe news are good today\u201D is correct.", a: false },
    { t: "mcq", q: "Ten kilometres ___ a long distance.", o: ["are", "is", "were", "have"], a: 1 },
    { t: "fib", q: "Bread and butter ___ my usual breakfast. (is / are)", a: ["is"] },
    { t: "mcq", q: "She, along with her sisters, ___ going to Lahore.", o: ["are", "is", "were", "have"], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["The", "children", "are", "playing", "outside"], a: "The children are playing outside" },
    { t: "fib", q: "One of my friends ___ a new bicycle. (has / have)", a: ["has"] },
    { t: "mcq", q: "Neither the teacher nor the students ___ happy with the result.", o: ["was", "were", "is", "has"], a: 1 }
  ]
},
{
  id: "voice", title: "Active & Passive Voice",
  expl: "In active voice the subject DOES the action. In passive voice the subject RECEIVES the action. Both say the same thing in different ways.",
  questions: [
    { t: "mcq", q: "Passive form of \u201CAli wrote a letter.\u201D", o: ["A letter was written by Ali.", "A letter is written by Ali.", "A letter has been written by Ali.", "Ali was written a letter."], a: 0 },
    { t: "mcq", q: "Active form of \u201CThe cake was baked by mother.\u201D", o: ["Mother baked the cake.", "Mother bakes the cake.", "Mother has baked the cake.", "Mother is baking the cake."], a: 0 },
    { t: "fib", q: "The windows ___ every week. (clean — passive)", a: ["are cleaned"] },
    { t: "tf", q: "\u201CThe thief was caught by the police\u201D is in the passive voice.", a: true },
    { t: "mcq", q: "Passive form of \u201CShe is reading a novel.\u201D", o: ["A novel is being read by her.", "A novel was read by her.", "A novel is read by her.", "A novel has been read by her."], a: 0 },
    { t: "fib", q: "The road ___ last month. (repair — passive)", a: ["was repaired"] },
    { t: "mcq", q: "Which sentence is in the ACTIVE voice?", o: ["The ball was thrown by Ahmed.", "Ahmed threw the ball.", "The ball has been thrown.", "The ball is thrown daily."], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct passive sentence.", w: ["was", "The", "prize", "won", "by", "Sara"], a: "The prize was won by Sara" },
    { t: "fib", q: "English ___ in many countries. (speak — passive)", a: ["is spoken"] },
    { t: "mcq", q: "Active form of \u201CThe homework was completed by the students.\u201D", o: ["The students completed the homework.", "The students complete the homework.", "The students have completed the homework.", "The students are completing the homework."], a: 0 }
  ]
},
{
  id: "speech", title: "Direct & Indirect Speech",
  expl: "Direct speech repeats the exact words. Indirect (reported) speech reports what was said — pronouns and tenses usually shift back.",
  questions: [
    { t: "mcq", q: "He said, \u201CI am tired.\u201D \u2192 He said that ___.", o: ["he was tired", "he is tired", "I was tired", "he had been tired"], a: 0 },
    { t: "mcq", q: "She said, \u201CI will help you.\u201D \u2192 She said that ___.", o: ["she would help me", "she will help me", "I would help you", "she helps me"], a: 0 },
    { t: "fib", q: "He said, \u201CI play cricket.\u201D \u2192 He said that he ___ cricket.", a: ["played"] },
    { t: "tf", q: "In indirect speech, \u201Cyesterday\u201D changes to \u201Cthe previous day\u201D.", a: true },
    { t: "mcq", q: "They said, \u201CWe have finished our work.\u201D \u2192 They said that ___.", o: ["they had finished their work", "they have finished their work", "we had finished our work", "they finished their work"], a: 0 },
    { t: "fib", q: "She asked, \u201CWhere do you live?\u201D \u2192 She asked me where I ___.", a: ["lived"] },
    { t: "mcq", q: "\u201CAre you coming?\u201D he asked. \u2192 He asked if ___.", o: ["I was coming", "I am coming", "was I coming", "am I coming"], a: 0 },
    { t: "reorder", q: "Arrange the words into a correct reported sentence.", w: ["She", "said", "that", "she", "was", "busy"], a: "She said that she was busy" },
    { t: "fib", q: "The teacher said, \u201COpen your books.\u201D \u2192 The teacher told us ___ our books.", a: ["to open"] },
    { t: "mcq", q: "He said, \u201CI saw her yesterday.\u201D \u2192 He said that he had seen her ___.", o: ["the previous day", "yesterday", "the next day", "today"], a: 0 }
  ]
},
{
  id: "articles", title: "Articles (a, an, the)",
  expl: "Articles are tiny words with big jobs. Use \u201Ca\u201D before consonant sounds, \u201Can\u201D before vowel sounds, and \u201Cthe\u201D when talking about something specific.",
  questions: [
    { t: "mcq", q: "___ sun rises in the east.", o: ["A", "An", "The", "No article"], a: 2 },
    { t: "mcq", q: "She is ___ honest girl.", o: ["a", "an", "the", "no article"], a: 1 },
    { t: "fib", q: "He is ___ best student in the class.", a: ["the"] },
    { t: "tf", q: "We use \u201Can\u201D before words beginning with a vowel sound.", a: true },
    { t: "mcq", q: "I saw ___ owl sitting in the tree.", o: ["a", "an", "the", "no article"], a: 1 },
    { t: "fib", q: "She plays ___ piano very well.", a: ["the"] },
    { t: "mcq", q: "___ Mount Everest is the highest peak in the world.", o: ["A", "An", "The", "No article"], a: 2 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["She", "is", "an", "excellent", "teacher"], a: "She is an excellent teacher" },
    { t: "fib", q: "He gave me ___ useful piece of advice. (a / an)", a: ["a"] },
    { t: "mcq", q: "The children go to ___ school by bus. (in general)", o: ["a", "an", "the", "no article"], a: 3 }
  ]
},
{
  id: "prepositions", title: "Prepositions",
  expl: "Prepositions show relationships — where things are, when they happen: in, on, at, under, between, since, for. The right one changes the meaning.",
  questions: [
    { t: "mcq", q: "The cat is hiding ___ the table.", o: ["in", "on", "under", "at"], a: 2 },
    { t: "mcq", q: "She was born ___ 2012.", o: ["in", "on", "at", "from"], a: 0 },
    { t: "fib", q: "The meeting will start ___ 10 o\u2019clock.", a: ["at"] },
    { t: "tf", q: "\u201CHe is good in mathematics\u201D is correct.", a: false },
    { t: "mcq", q: "They have lived here ___ five years.", o: ["since", "for", "from", "by"], a: 1 },
    { t: "fib", q: "Please divide the cake ___ the two children.", a: ["between"] },
    { t: "mcq", q: "The train arrived ___ the station on time.", o: ["in", "at", "on", "to"], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["The", "book", "is", "on", "the", "table"], a: "The book is on the table" },
    { t: "fib", q: "She is afraid ___ dogs.", a: ["of"] },
    { t: "mcq", q: "He walked ___ the road carefully.", o: ["across", "between", "among", "beside"], a: 0 }
  ]
},
{
  id: "punct", title: "Punctuation & Capitalization",
  expl: "Full stops, question marks, commas and capital letters are the traffic signals of writing. They tell the reader where to pause, stop and pay attention.",
  questions: [
    { t: "mcq", q: "Choose the correctly punctuated sentence.", o: ["Where are you going.", "Where are you going?", "Where are you going!", "where are you going?"], a: 1 },
    { t: "mcq", q: "Which sentence uses capital letters correctly?", o: ["my friend ali lives in lahore.", "My friend Ali lives in Lahore.", "My Friend Ali Lives In Lahore.", "my Friend ali lives in Lahore."], a: 1 },
    { t: "fib", q: "Rewrite with correct punctuation: what a beautiful garden", a: ["What a beautiful garden!"] },
    { t: "tf", q: "We use an apostrophe in \u201Cdon\u2019t\u201D to show missing letters.", a: true },
    { t: "mcq", q: "Choose the correct sentence.", o: ["The boys\u2019 books are on the desk.", "The boys books are on the desk.", "The boy\u2019s books are on the desks.", "The boys books are on the desks."], a: 0 },
    { t: "fib", q: "Add the missing punctuation: Where is your school", a: ["Where is your school?"] },
    { t: "mcq", q: "Which is correct?", o: ["Its a sunny day.", "It\u2019s a sunny day.", "Its\u2019 a sunny day.", "It,s a sunny day."], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct question.", w: ["What", "is", "your", "name", "?"], a: "What is your name?" },
    { t: "fib", q: "Capitalize correctly: eid is celebrated in pakistan", a: ["Eid is celebrated in Pakistan"] },
    { t: "mcq", q: "Which sentence is correct?", o: ["He said \u201CI am busy\u201D.", "He said, \u201CI am busy.\u201D", "He said \u201Ci am busy\u201D.", "He said, i am busy."], a: 1 }
  ]
},
{
  id: "clauses", title: "Sentence Types & Clauses",
  expl: "Sentences come in types — statement, question, command, exclamation. Clauses are the building blocks: independent clauses stand alone, dependent ones need a partner.",
  questions: [
    { t: "mcq", q: "In \u201CAlthough it was raining, we went out\u201D, the clause \u201CAlthough it was raining\u201D is:", o: ["an independent clause", "a dependent clause", "a phrase", "the main clause"], a: 1 },
    { t: "mcq", q: "Which sentence is COMPOUND?", o: ["I like mangoes.", "I like mangoes, and she likes apples.", "Because I was hungry, I ate.", "Running fast, he won."], a: 1 },
    { t: "fib", q: "A ___ sentence has one independent clause and at least one dependent clause.", a: ["complex"] },
    { t: "tf", q: "\u201CShe sings beautifully\u201D is a simple sentence.", a: true },
    { t: "mcq", q: "Identify the sentence type: \u201CWhat a lovely day!\u201D", o: ["declarative", "interrogative", "exclamatory", "imperative"], a: 2 },
    { t: "fib", q: "\u201CClose the door.\u201D is an ___ sentence.", a: ["imperative"] },
    { t: "mcq", q: "Which is a COMPLEX sentence?", o: ["He came and sat down.", "When the bell rang, the students stood up.", "The sun is shining.", "Open the window."], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["I", "stayed", "home", "because", "I", "was", "ill"], a: "I stayed home because I was ill" },
    { t: "fib", q: "An ___ sentence asks a question.", a: ["interrogative"] },
    { t: "mcq", q: "\u201CThe boy who won the prize is my friend.\u201D The clause \u201Cwho won the prize\u201D is:", o: ["independent", "dependent", "a phrase", "the predicate"], a: 1 }
  ]
},
{
  id: "pronouns", title: "Pronouns",
  expl: "Pronouns take the place of nouns: I, you, he, she, it, we, they (personal); this, that, these, those (demonstrative); who, which (interrogative); each other (reciprocal); somebody, anyone (indefinite).",
  questions: [
    { t: "mcq", q: "___ is my best friend.", o: ["Her", "She", "Hers", "Her's"], a: 1 },
    { t: "mcq", q: "The teacher praised ___ for our hard work.", o: ["we", "us", "our", "ours"], a: 1 },
    { t: "mcq", q: "___ of these two books do you prefer?", o: ["What", "Which", "Whose", "Whom"], a: 1 },
    { t: "mcq", q: "The two brothers helped ___ with the homework.", o: ["one another only", "each other", "themselves", "itself"], a: 1 },
    { t: "fib", q: "This pen is ___. (my / mine)", a: ["mine"] },
    { t: "tf", q: "\u201CMe and him went to the market\u201D is correct.", a: false },
    { t: "mcq", q: "___ knocked at the door, but I could not see who it was.", o: ["Somebody", "Anybody", "Nobody", "Everybody"], a: 0 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["These", "are", "my", "books"], a: "These are my books" },
    { t: "mcq", q: "___ flowers in the garden are beautiful.", o: ["This", "That", "These", "This ones"], a: 2 },
    { t: "fib", q: "The dog wagged ___ tail happily. (its / it's)", a: ["its"] }
  ]
},
{
  id: "adverbs", title: "Adverbs",
  expl: "Adverbs describe verbs, adjectives or other adverbs — how, when, where or how often: slowly, very, yesterday, always. Many are formed by adding -ly to an adjective.",
  questions: [
    { t: "mcq", q: "She sings ___.", o: ["beautiful", "beautifully", "beauty", "beautify"], a: 1 },
    { t: "mcq", q: "The tortoise walks ___.", o: ["slow", "slowly", "slowness", "slowerly"], a: 1 },
    { t: "fib", q: "The baby slept ___ through the night. (peaceful / peacefully)", a: ["peacefully"] },
    { t: "mcq", q: "She ___ visits her grandmother on Sundays.", o: ["regular", "regularly", "regulation", "regulate"], a: 1 },
    { t: "tf", q: "\u201CHe runs very quick\u201D is correct.", a: false },
    { t: "mcq", q: "He left the room ___ because he was late.", o: ["in a hurry", "hurried", "hurry", "with hurry"], a: 0 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["She", "speaks", "English", "fluently"], a: "She speaks English fluently" },
    { t: "mcq", q: "In \u201CI will call you when I arrive\u201D, the adverb clause is:", o: ["I will call you", "when I arrive", "call you", "I arrive"], a: 1 },
    { t: "fib", q: "___ he crossed the busy road. (Careful / Carefully)", a: ["Carefully"] },
    { t: "mcq", q: "It was ___ hot to play outside in the afternoon.", o: ["very", "too", "so"], a: 1 }
  ]
},
{
  id: "adjectives", title: "Adjectives",
  expl: "Adjectives describe nouns: a tall building, the tired child. They usually come before the noun, can be formed from nouns and verbs (beauty \u2192 beautiful, excite \u2192 exciting), and work in phrases like \u201Cthe girl in red\u201D.",
  questions: [
    { t: "mcq", q: "She wore a ___ dress to the party.", o: ["beauty", "beautiful", "beautifully", "beautify"], a: 1 },
    { t: "mcq", q: "The ___ man helped the lost child.", o: ["kind", "kindly", "kindness", "kinderly"], a: 0 },
    { t: "fib", q: "Form an adjective from \u201Cdanger\u201D: ___", a: ["dangerous"] },
    { t: "mcq", q: "The story was very ___.", o: ["excite", "exciting", "excitedly", "excitement"], a: 1 },
    { t: "tf", q: "In \u201Ca red car\u201D, the adjective comes AFTER the noun.", a: false },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["She", "is", "a", "clever", "girl"], a: "She is a clever girl" },
    { t: "mcq", q: "The girl ___ won the first prize.", o: ["in red", "in redly", "redly in", "with redly"], a: 0 },
    { t: "fib", q: "The food smells ___. (good / well)", a: ["good"] },
    { t: "mcq", q: "\u201CThe tired children slept early.\u201D The adjective is:", o: ["children", "tired", "slept", "early"], a: 1 },
    { t: "mcq", q: "Form an adjective from \u201Ccare\u201D:", o: ["careful", "carely", "caringly", "cared"], a: 0 }
  ]
},
{
  id: "syllables", title: "Syllables & Word Parts",
  expl: "AK SLO E-07-B1-01: break words into syllables, hear vowel sounds, spot silent letters, and use prefixes, suffixes and root words to decode and pronounce new words.",
  questions: [
    { t: "mcq", q: "How many syllables are in \u201Cbeautiful\u201D?", o: ["2", "3", "4", "1"], a: 1 },
    { t: "mcq", q: "Which word has a silent letter?", o: ["knife", "book", "pen", "table"], a: 0 },
    { t: "fib", q: "The silent letter in \u201Cwrite\u201D is ___.", a: ["w"] },
    { t: "mcq", q: "The prefix in \u201Cunhappy\u201D means:", o: ["again", "not", "before", "with"], a: 1 },
    { t: "mcq", q: "Add a prefix to \u201Cpossible\u201D to mean \u201Cnot possible\u201D:", o: ["unpossible", "impossible", "dispossible", "nonpossible"], a: 1 },
    { t: "fib", q: "The root word in \u201Ccarelessness\u201D is ___.", a: ["care"] },
    { t: "mcq", q: "How many syllables are in \u201Ceducation\u201D?", o: ["3", "4", "5", "2"], a: 1 },
    { t: "tf", q: "\u201CPsychology\u201D starts with a silent \u2018p\u2019.", a: true },
    { t: "mcq", q: "Which shows the correct syllable division of \u201Cbasket\u201D?", o: ["ba-sket", "bas-ket", "bask-et", "b-asket"], a: 1 },
    { t: "mcq", q: "The suffix \u201C-ful\u201D in \u201Chopeful\u201D means:", o: ["without", "full of", "again", "not"], a: 1 }
  ]
},
{
  id: "sentence-patterns", title: "Sentence Patterns: SVOO & SVOC",
  expl: "AK SLO E-07-C5-02: English sentence patterns — SVO (She kicked the ball), SVOO with direct and indirect objects (She gave him a gift), SVOC with an object complement (They made him captain).",
  questions: [
    { t: "mcq", q: "In \u201CShe gave me a pen\u201D, the INDIRECT object is:", o: ["She", "gave", "me", "a pen"], a: 2 },
    { t: "mcq", q: "In \u201CShe gave me a pen\u201D, the DIRECT object is:", o: ["She", "gave", "me", "a pen"], a: 3 },
    { t: "mcq", q: "Which sentence follows the SVOO pattern?", o: ["He runs fast.", "She bought him a book.", "They are happy.", "The baby sleeps."], a: 1 },
    { t: "mcq", q: "In \u201CThey elected him president\u201D, \u201Cpresident\u201D is:", o: ["a direct object", "an indirect object", "an object complement", "the subject"], a: 2 },
    { t: "fib", q: "The pattern of \u201CHe told her a story\u201D is ___.", a: ["SVOO"] },
    { t: "tf", q: "In \u201CShe made tea\u201D, \u201Ctea\u201D is the direct object.", a: true },
    { t: "mcq", q: "Which sentence is SVOC?", o: ["She gave him flowers.", "We painted the wall blue.", "He eats rice.", "Birds fly."], a: 1 },
    { t: "reorder", q: "Arrange the words into an SVOO sentence.", w: ["She", "sent", "me", "a", "letter"], a: "She sent me a letter" },
    { t: "mcq", q: "In \u201CThe teacher called Ali a star\u201D, the complement describes:", o: ["the teacher", "called", "Ali", "a star"], a: 2 },
    { t: "fib", q: "SVOC stands for Subject-Verb-Object-___.", a: ["Complement", "complement"] }
  ]
},
{
  id: "formal-letters", title: "Formal Letters & Emails",
  expl: "AK SLO E-07-D4-07: write formal letters and emails (applications, complaints) — correct layout, greeting, clear paragraphs, polite tone and closing.",
  questions: [
    { t: "mcq", q: "Which greeting is correct for a formal letter?", o: ["Hi there!", "Dear Sir,", "Hey!", "Hello buddy,"], a: 1 },
    { t: "mcq", q: "Where does the date go in a formal letter?", o: ["at the very end", "below the sender's address", "in the middle", "no date is needed"], a: 1 },
    { t: "tf", q: "\u201CYours faithfully\u201D is a suitable closing for a formal letter.", a: true },
    { t: "mcq", q: "Which sentence fits a formal complaint letter?", o: ["Your product is trash, fix it!", "I am writing to complain about the faulty kettle I bought on Monday.", "Hey, your kettle broke lol.", "Give me my money back now!"], a: 1 },
    { t: "fib", q: "A formal email asking for leave should have a clear ___ line.", a: ["subject"] },
    { t: "mcq", q: "Which closing fits a formal application?", o: ["Cheers,", "Yours sincerely,", "See ya,", "Bye!"], a: 1 },
    { t: "mcq", q: "The first paragraph of an application letter should:", o: ["tell a joke", "state the purpose of writing", "list your hobbies", "ask about salary"], a: 1 },
    { t: "tf", q: "Short forms like \u201Cdon't\u201D and \u201Ccan't\u201D are fine in formal letters.", a: false },
    { t: "mcq", q: "Which is the correct order in a formal letter?", o: ["greeting \u2192 date \u2192 address", "sender's address \u2192 date \u2192 greeting \u2192 body \u2192 closing", "body \u2192 address \u2192 date", "closing \u2192 body \u2192 greeting"], a: 1 },
    { t: "fib", q: "When you don't know the name, begin with \u201CDear ___.\u201D", a: ["Sir", "Madam", "Sir/Madam"] }
  ]
},
{
  id: "past-tense", title: "Simple Past Tense",
  expl: "The simple past tells what already happened: regular verbs add -ed (walked), irregular verbs change form (went, ate, saw, bought).",
  questions: [
    { t: "mcq", q: "They ___ football yesterday.", o: ["play", "played", "plays", "playing"], a: 1 },
    { t: "mcq", q: "She ___ to school late this morning.", o: ["go", "goes", "went", "gone"], a: 2 },
    { t: "fib", q: "I ___ my homework last night. (do)", a: ["did"] },
    { t: "mcq", q: "Which sentence is in the simple past?", o: ["He eats rice.", "He ate rice.", "He is eating rice.", "He will eat rice."], a: 1 },
    { t: "tf", q: "\u201CThey goed to the park\u201D is correct.", a: false },
    { t: "mcq", q: "The past form of \u201Cbuy\u201D is:", o: ["buyed", "bought", "buys", "buying"], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["We", "watched", "a", "film", "yesterday"], a: "We watched a film yesterday" },
    { t: "fib", q: "She ___ a beautiful song at the party. (sing)", a: ["sang"] },
    { t: "mcq", q: "Choose the correct negative: \u201CHe ___ come yesterday.\u201D", o: ["didn't", "doesn't", "don't", "not"], a: 0 },
    { t: "mcq", q: "The past form of \u201Cteach\u201D is:", o: ["teached", "taught", "teaches", "teaching"], a: 1 }
  ]
},
{
  id: "skimming", title: "Skimming for Main Ideas",
  expl: "AK SLO E-07-B3-05: skim a text for its general idea — use the title, first lines and key words to grasp the writer's purpose and audience without reading every word.",
  questions: [
    { t: "mcq", q: "When you skim a text, you read to find:", o: ["every detail", "the general idea", "difficult words", "the author's name"], a: 1 },
    { t: "mcq", q: "Which part helps you skim first?", o: ["the middle paragraph", "the title and first sentences", "the last word", "the page number"], a: 1 },
    { t: "tf", q: "Skimming means reading every word slowly and carefully.", a: false },
    { t: "mcq", q: "To find the writer's purpose quickly, you should:", o: ["read the whole book", "skim the introduction and conclusion", "count the pages", "memorize the title"], a: 1 },
    { t: "fib", q: "Reading quickly for the main idea is called ___.", a: ["skimming"] },
    { t: "mcq", q: "Which question does skimming answer best?", o: ["What does this text mainly discuss?", "What is the 5th word in line 3?", "How many commas are there?", "When was the author born?"], a: 0 },
    { t: "tf", q: "Topic sentences often carry the main idea of a paragraph.", a: true },
    { t: "mcq", q: "Before a test, skimming your notes helps you:", o: ["learn nothing new", "recall the main points fast", "sleep better", "write neatly"], a: 1 },
    { t: "reorder", q: "Arrange the words into good skimming advice.", w: ["Read", "the", "title", "first"], a: "Read the title first" },
    { t: "mcq", q: "Skimming is most useful when you:", o: ["have plenty of time", "need a quick overview", "want to memorize", "read poetry aloud"], a: 1 }
  ]
},
{
  id: "poetry", title: "Poetry: Rhyme, Rhythm & Imagery",
  expl: "AK SLOs E-07-B3-15 / E-07-B3-07: read poems (rhymes, cinquains, haiku) — hear rhyme and rhythm, spot repetition, simile, metaphor, personification and sensory images.",
  questions: [
    { t: "mcq", q: "Which pair rhymes?", o: ["cat / dog", "light / night", "pen / book", "run / jump"], a: 1 },
    { t: "mcq", q: "\u201CThe moon smiled at me\u201D is an example of:", o: ["simile", "metaphor", "personification", "rhyme"], a: 2 },
    { t: "mcq", q: "\u201CBrave as a lion\u201D is a:", o: ["metaphor", "simile", "haiku", "stanza"], a: 1 },
    { t: "fib", q: "A comparison saying one thing IS another (e.g. \u201CHe is a rock\u201D) is a ___.", a: ["metaphor"] },
    { t: "mcq", q: "A haiku has:", o: ["4 lines", "3 lines", "14 lines", "2 lines"], a: 1 },
    { t: "tf", q: "A stanza is a group of lines in a poem, like a paragraph in prose.", a: true },
    { t: "mcq", q: "Which line uses repetition for rhythm?", o: ["Run, run, run to the sun!", "The table is brown.", "I like tea.", "Dogs bark loudly."], a: 0 },
    { t: "reorder", q: "Arrange the words into a poetic line.", w: ["The", "wind", "whispered", "softly"], a: "The wind whispered softly" },
    { t: "mcq", q: "\u201CThe classroom was a zoo\u201D is a:", o: ["simile", "metaphor", "personification", "alliteration"], a: 1 },
    { t: "fib", q: "Words that appeal to the senses (sight, sound, smell) create ___.", a: ["imagery"] }
  ]
},
{
  id: "connotation", title: "Connotations & Shades of Meaning",
  expl: "AK SLO E-07-C1-05: words with similar meanings feel different — \u2018slim\u2019 vs \u2018skinny\u2019, \u2018confident\u2019 vs \u2018arrogant\u2019. Connotation is the feeling a word carries.",
  questions: [
    { t: "mcq", q: "Which word has a positive connotation?", o: ["skinny", "slim", "bony", "thin"], a: 1 },
    { t: "mcq", q: "\u201CChildlike\u201D vs \u201Cchildish\u201D — which feels more positive?", o: ["childish", "childlike", "both feel the same", "neither"], a: 1 },
    { t: "tf", q: "\u201CEconomical\u201D and \u201Cstingy\u201D have the same connotation.", a: false },
    { t: "mcq", q: "He is ___ about his work. (pick the negative one)", o: ["confident", "proud", "arrogant", "sure"], a: 2 },
    { t: "fib", q: "The feeling a word suggests beyond its dictionary meaning is its ___.", a: ["connotation"] },
    { t: "mcq", q: "Which pair shows a difference in intensity?", o: ["big / large", "happy / glad", "cold / freezing", "run / walk"], a: 2 },
    { t: "mcq", q: "\u201CShe glared at the picture\u201D — \u201Cglared\u201D (not \u201Cglanced\u201D) suggests:", o: ["love", "anger", "joy", "fear"], a: 1 },
    { t: "tf", q: "\u201CStubborn\u201D and \u201Cdetermined\u201D feel exactly the same to most readers.", a: false },
    { t: "reorder", q: "Arrange the words into a true sentence.", w: ["Words", "carry", "feelings", "too"], a: "Words carry feelings too" },
    { t: "mcq", q: "Calling a plan \u201Ca crazy scheme\u201D instead of \u201Ca bold plan\u201D makes you feel:", o: ["excited", "suspicious", "happy", "calm"], a: 1 }
  ]
},
{
  id: "figurative", title: "Figurative Language",
  expl: "AK SLO E-07-B3-01: words don't always mean exactly what they say — tell literal meaning from figurative meaning, and see how word choice shapes tone.",
  questions: [
    { t: "mcq", q: "In \u201CIt's raining cats and dogs\u201D, the phrase means:", o: ["animals are falling", "it is raining heavily", "a pet shop", "a cloudy sky"], a: 1 },
    { t: "mcq", q: "The LITERAL meaning of \u201Cbreak the ice\u201D is:", o: ["start a conversation", "smash frozen water", "be rude", "feel cold"], a: 1 },
    { t: "tf", q: "Figurative language means exactly what the words say.", a: false },
    { t: "mcq", q: "\u201CShe has a heart of gold\u201D is figurative because:", o: ["hearts are red", "it means she is kind, not made of metal", "gold is expensive", "she is rich"], a: 1 },
    { t: "fib", q: "When \u201Ccold\u201D describes an unfriendly person, its meaning is ___. (literal / figurative)", a: ["figurative"] },
    { t: "mcq", q: "Which sentence uses \u201Cbright\u201D figuratively?", o: ["The bright sun hurt my eyes.", "She is a bright student.", "The bright lamp lit the room.", "Bright colors faded fast."], a: 1 },
    { t: "tf", q: "A dictionary always gives the contextual meaning of a word.", a: false },
    { t: "mcq", q: "An author's word choice affects the text's:", o: ["length", "tone and meaning", "page count", "font size"], a: 1 },
    { t: "mcq", q: "\u201CTime is money\u201D suggests time is:", o: ["coins", "valuable", "slow", "free"], a: 1 },
    { t: "fib", q: "The dictionary meaning of a word is its ___ meaning.", a: ["literal", "denotation"] }
  ]
},
{
  id: "descriptive-writing", title: "Descriptive Writing",
  expl: "AK SLO E-07-D4-04: write a descriptive composition — move from general to specific, use senses and precise adjectives, plan with brainstorming and drafts.",
  questions: [
    { t: "mcq", q: "A good description moves from:", o: ["specific to general", "general to specific", "end to start", "random order"], a: 1 },
    { t: "mcq", q: "Which sentence is most descriptive?", o: ["The garden was nice.", "The garden burst with red roses and the sweet smell of jasmine.", "I saw a garden.", "Gardens are green."], a: 1 },
    { t: "tf", q: "Using the five senses makes descriptions vivid.", a: true },
    { t: "mcq", q: "Before writing a description, you should:", o: ["start immediately", "brainstorm and mind-map ideas", "copy a friend", "skip planning"], a: 1 },
    { t: "fib", q: "A rough copy written before the final version is the ___ draft.", a: ["first", "rough"] },
    { t: "mcq", q: "Which adjective is most precise?", o: ["nice", "big", "enormous", "good"], a: 2 },
    { t: "tf", q: "A description should only list facts, never feelings.", a: false },
    { t: "mcq", q: "Describing a person, you might include:", o: ["only their name", "appearance, habits and traits", "their phone number", "nothing personal"], a: 1 },
    { t: "reorder", q: "Arrange into good writing advice.", w: ["Don't", "just", "tell,", "show"], a: "Don't just tell, show" },
    { t: "fib", q: "Precise ___ (describing words) make a description vivid.", a: ["adjectives"] }
  ]
},
{
  id: "paraphrasing", title: "Paraphrasing",
  expl: "AK SLOs E-07-B3-12 / E-07-D4-09: restate ideas — even poem stanzas — in your own simple, correct words. Keep the meaning, change the wording.",
  questions: [
    { t: "mcq", q: "Which is the best paraphrase of \u201CThe boy was very tired\u201D?", o: ["The boy was very tired.", "The exhausted lad needed rest.", "Boys get tired.", "Tired boy."], a: 1 },
    { t: "mcq", q: "When paraphrasing, you must:", o: ["copy word for word", "keep the meaning, change the words", "make it longer", "change the meaning"], a: 1 },
    { t: "tf", q: "Paraphrasing means translating into another language.", a: false },
    { t: "mcq", q: "Paraphrase: \u201CShe speaks quickly.\u201D \u2192", o: ["She talks fast.", "She speaks quickly.", "Quick speak she.", "She is quick."], a: 0 },
    { t: "fib", q: "Restating a poem's stanza in your own words is ___.", a: ["paraphrasing"] },
    { t: "mcq", q: "Which is NOT paraphrasing?", o: ["using synonyms", "changing sentence structure", "copying the sentence exactly", "simplifying the language"], a: 2 },
    { t: "tf", q: "A good paraphrase keeps the original meaning.", a: true },
    { t: "mcq", q: "Paraphrase: \u201CIt is raining heavily.\u201D \u2192", o: ["Rain, rain, go away.", "It is pouring down.", "I like rain.", "Heavy is the rain."], a: 1 },
    { t: "reorder", q: "Arrange into good paraphrasing advice.", w: ["Use", "your", "own", "words"], a: "Use your own words" },
    { t: "fib", q: "Paraphrasing shows you ___ the text.", a: ["understand", "understood"] }
  ]
},
{
  id: "synant", title: "Synonyms & Antonyms",
  expl: "Synonyms are words with the SAME meaning; antonyms have OPPOSITE meanings. A rich vocabulary makes your speaking and writing stronger.",
  questions: [
    { t: "mcq", q: "Synonym of \u201Cbrave\u201D:", o: ["cowardly", "courageous", "weak", "afraid"], a: 1, hint: "Think: not afraid, showing courage." },
    { t: "mcq", q: "Antonym of \u201Cancient\u201D:", o: ["old", "modern", "historic", "aged"], a: 1, hint: "Think: very old, from long ago." },
    { t: "fib", q: "Write any synonym of \u201Chappy\u201D.", a: ["glad", "joyful", "cheerful", "delighted", "pleased", "merry"] },
    { t: "tf", q: "\u201CGenerous\u201D and \u201Cselfish\u201D are antonyms.", a: true },
    { t: "match", q: "Match each word with its synonym.", pairs: [["rapid", "fast"], ["tiny", "small"], ["wealthy", "rich"], ["begin", "start"]] },
    { t: "mcq", q: "Antonym of \u201Cvictory\u201D:", o: ["success", "defeat", "prize", "glory"], a: 1, hint: "Think: winning; the opposite of defeat." },
    { t: "fib", q: "Write the antonym of \u201Chonest\u201D.", a: ["dishonest"] },
    { t: "mcq", q: "Synonym of \u201Cenormous\u201D:", o: ["tiny", "huge", "small", "little"], a: 1, hint: "Think: extremely large, like an elephant." },
    { t: "tf", q: "\u201CExpand\u201D and \u201Ccontract\u201D are synonyms.", a: false },
    { t: "fib", q: "The antonym of \u201Cpolite\u201D is ___.", a: ["rude", "impolite"] }
  ]
},
{
  id: "vocab", title: "Prefixes, Suffixes & Vocabulary",
  expl: "Prefixes attach to the FRONT of words (un-happy) and suffixes to the END (hope-ful). Learning them helps you decode hundreds of new words.",
  questions: [
    { t: "mcq", q: "The prefix in \u201Cunhappy\u201D means:", o: ["again", "not", "before", "very"], a: 1 },
    { t: "mcq", q: "Add a prefix to \u201Cpossible\u201D to mean \u201Cnot possible\u201D:", o: ["impossible", "dispossible", "unpossible", "nonpossible"], a: 0 },
    { t: "fib", q: "The suffix in \u201Ccareless\u201D is ___.", a: ["less", "-less"] },
    { t: "tf", q: "The suffix \u201C-ful\u201D in \u201Chopeful\u201D means \u201Cfull of\u201D.", a: true },
    { t: "mcq", q: "Choose the correct word: \u201CThe ___ boy shared his lunch.\u201D (kind)", o: ["kindness", "kindly", "kind", "unkind"], a: 2 },
    { t: "fib", q: "Make a noun from \u201Cdecide\u201D using a suffix: ___.", a: ["decision"] },
    { t: "mcq", q: "\u201CThe exam was difficult, but she remained ___.\u201D (calm)", o: ["calm", "calmly", "calmness", "calmed"], a: 0 },
    { t: "match", q: "Match each affix with its meaning.", pairs: [["re-", "again"], ["un-", "not"], ["-ness", "state of being"], ["-ful", "full of"]] },
    { t: "fib", q: "Add the correct prefix: ___behave (to behave badly)", a: ["mis"] },
    { t: "mcq", q: "In \u201Cpreview\u201D, the prefix \u201Cpre-\u201D means:", o: ["after", "before", "again", "not"], a: 1 }
  ]
},
{
  id: "reading", title: "Reading Comprehension",
  expl: "Good readers read carefully and find answers IN the text. Read each short passage, then answer the question about it.",
  questions: [
    { t: "passage", passage: "Ahmed lives in a small village. Every morning he wakes up early, offers his prayers, and helps his father feed the hens. Then he walks to school with his friends. He likes mathematics the most.", q: "What does Ahmed do right after waking up?", o: ["He walks to school", "He offers his prayers", "He plays with friends", "He feeds the hens first"], a: 1 },
    { t: "passage", passage: "The Indus is the longest river of Pakistan. It starts in the mountains, flows through Punjab and Sindh, and finally joins the Arabian Sea. Farmers depend on its water for their crops.", q: "Where does the Indus river end?", o: ["In the mountains", "In Punjab", "In the Arabian Sea", "In a lake"], a: 2 },
    { t: "passage", passage: "Last Sunday, the boys of Street 4 played a cricket match against Street 5. Bilal scored 30 runs, but it was Daniyal\u2019s last over that won the game. Street 4 celebrated with pakoras and cold drinks.", q: "Who won the cricket match?", o: ["Street 5", "Street 4", "Nobody", "The umpire"], a: 1 },
    { t: "passage", passage: "Our body needs energy to work and play. Foods like rice, bread and potatoes give us energy. Milk and eggs make our bones strong, while fruits and vegetables protect us from illness.", q: "Which foods give us energy?", o: ["Milk and eggs", "Fruits and vegetables", "Rice, bread and potatoes", "Sweets and chips"], a: 2 },
    { t: "passage", passage: "On the school trip to the zoo, the children saw lions, monkeys and a tall giraffe. But everyone\u2019s favourite was the baby elephant, who waved its trunk and made the whole class laugh.", q: "Which animal did the children like most?", o: ["The lion", "The monkey", "The giraffe", "The baby elephant"], a: 3 },
    { t: "passage", passage: "It rained heavily all afternoon. The streets filled with water, so the children could not go out to play. Instead, they stayed indoors and read storybooks with their grandmother.", q: "Why did the children stay indoors?", o: ["They were ill", "The streets were flooded with rainwater", "Their grandmother was busy", "They had homework"], a: 1 },
    { t: "passage", passage: "Our school library has more than two thousand books. Every student may borrow two books for one week. Sara loves the story section and finishes one book every week.", q: "How many books may a student borrow at a time?", o: ["One", "Two", "Five", "Ten"], a: 1 },
    { t: "passage", passage: "When the new neighbours moved in, Ammi sent them a plate of fresh samosas. The neighbour\u2019s children were delighted, and soon both families became good friends.", q: "What did Ammi send the new neighbours?", o: ["A book", "A plate of fresh samosas", "Some money", "A toy"], a: 1 },
    { t: "passage", passage: "The family packed their bags and boarded the morning train to Lahore. The children pressed their faces to the window, watching green fields and buffaloes rush past for three happy hours.", q: "Where was the family going?", o: ["To Karachi", "To Lahore", "To the village", "To school"], a: 1 },
    { t: "passage", passage: "On Tree Plantation Day, every student planted one sapling in the school garden. The teacher explained that trees clean the air, give shade, and bring rain. The children promised to water their plants daily.", q: "What did each student plant?", o: ["A flower", "One sapling", "A vegetable", "Grass"], a: 1 }
  ]
},
{
  id: "writing", title: "Paragraph Writing",
  expl: "A good paragraph has 4\u20135 clear sentences about ONE topic. Write in your own words — the checker looks for key ideas and shows you a model answer.",
  questions: [
    { t: "short", q: "Write 4\u20135 sentences about your best friend.", keys: ["friend", "name", "school", "play", "kind"], model: "My best friend\u2019s name is Ali. He studies with me in school. We play cricket together every evening. He is kind and always helps me with homework. I am lucky to have such a good friend." },
    { t: "short", q: "Write a short paragraph about your favourite season.", keys: ["season", "weather", "like", "summer", "winter"], model: "My favourite season is winter. The weather is cool and pleasant. I like wearing warm sweaters and drinking hot tea. We sit in the sunshine and eat peanuts. Winter evenings with my family are the best." },
    { t: "short", q: "Describe your school in 4\u20135 sentences.", keys: ["school", "teachers", "class", "students", "playground"], model: "My school is a large building near my house. The teachers are kind and teach us well. My classroom is bright and clean. There are many students in our school. We play football in the big playground during break." },
    { t: "short", q: "Write about a visit to a park or a zoo.", keys: ["went", "saw", "enjoyed", "family", "day"], model: "Last month I went to the zoo with my family. I saw lions, monkeys and a tall giraffe. We enjoyed eating ice cream near the lake. It was a happy day. I want to visit again soon." },
    { t: "short", q: "Write 4\u20135 sentences about your daily routine.", keys: ["morning", "school", "homework", "play", "sleep"], model: "I wake up early in the morning and offer my prayers. After breakfast I go to school. In the evening I do my homework and then play with my friends. I have dinner with my family. I sleep early at night." },
    { t: "short", q: "Describe your favourite book or story.", keys: ["book", "story", "like", "read", "interesting"], model: "My favourite book is a collection of short stories. I like the story of the honest woodcutter the most. I read it many times. It is interesting and teaches a good lesson. Reading books is my favourite hobby." },
    { t: "short", q: "Write about how you help your family at home.", keys: ["help", "mother", "home", "work", "family"], model: "I help my family at home every day. I help my mother set the table before meals. I keep my room clean and tidy. I also help my younger brother with his homework. Helping my family makes me happy." },
    { t: "short", q: "Write a short paragraph about Pakistan.", keys: ["pakistan", "country", "people", "beautiful", "live"], model: "Pakistan is my beautiful country. I live here with my family. The people of Pakistan are kind and brave. Our country has tall mountains, green fields and long rivers. I love Pakistan very much." },
    { t: "short", q: "Describe the happiest day of your life.", keys: ["happy", "day", "enjoyed", "family", "remember"], model: "The happiest day of my life was last Eid. My whole family gathered at our house. We enjoyed delicious food and wore new clothes. I received Eidi from my elders. I will remember that happy day forever." },
    { t: "short", q: "Write 4\u20135 sentences about what you want to become in life.", keys: ["want", "become", "doctor", "study", "help"], model: "I want to become a doctor when I grow up. I will study hard to achieve my goal. Doctors help sick people and save lives. I want to serve my country. My parents support my dream fully." }
  ]
},
{
  id: "conditionals", title: "Conditionals",
  expl: "Conditionals are 'if' sentences. The zero conditional states facts (If you heat water, it boils); the first predicts real futures (If it rains, we will stay home); the second imagines unreal presents (If I were rich, I would travel); the third regrets unreal pasts (If I had studied, I would have passed).",
  questions: [
    { t: "mcq", q: "If you heat ice, it ___.", o: ["melts", "will melt", "would melt", "would have melted"], a: 0, hint: "A scientific fact — which conditional states facts?" },
    { t: "mcq", q: "If it rains tomorrow, we ___ at home.", o: ["stay", "will stay", "would stay", "stayed"], a: 1 },
    { t: "mcq", q: "If I ___ rich, I would travel the world.", o: ["am", "will be", "were", "had been"], a: 2, hint: "Unreal present — 'were' works for every person." },
    { t: "mcq", q: "If she had studied harder, she ___ the exam.", o: ["would pass", "will pass", "passes", "would have passed"], a: 3 },
    { t: "fib", q: "If I ___ you, I would apologise at once. (be — unreal present)", a: ["were"] },
    { t: "tf", q: "In formal English, \u201CIf I was you\u201D is the correct second-conditional form.", a: false },
    { t: "mcq", q: "___ you hurry, you will miss the bus.", o: ["Unless", "If", "If only", "Had"], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct third-conditional sentence.", w: ["we", "If", "left", "earlier", "had", "would", "caught", "the", "have", "bus"], a: "If we had left earlier we would have caught the bus" },
    { t: "match", q: "Match each conditional type with its example.", pairs: [["Zero conditional", "If you mix red and blue, you get purple"], ["First conditional", "If she calls, I will answer"], ["Second conditional", "If I won, I would share it"], ["Third conditional", "If he had run, he would have won"]] },
    { t: "fib", q: "Had I known the answer, I ___ told you. (would)", a: ["would have"] }
  ]
},
{
  id: "modal-perfects", title: "Modals in the Past",
  expl: "Modal + have + past participle talks about the past: 'should have studied' (regret), 'must have been' (strong certainty), 'could have won' (past possibility), 'might have forgotten' (a guess), 'needn't have hurried' (an unnecessary action).",
  questions: [
    { t: "mcq", q: "You look exhausted. You ___ to bed earlier.", o: ["should go", "must go", "should have gone", "will go"], a: 2, hint: "Regret about last night — which form looks back?" },
    { t: "mcq", q: "The lights were on when I passed. They ___ at home.", o: ["must have been", "must be", "should have been", "could be"], a: 0 },
    { t: "mcq", q: "He ___ the match if he had trained harder.", o: ["could win", "must win", "should win", "could have won"], a: 3 },
    { t: "fib", q: "I ___ locked the door, but I cannot remember. (might)", a: ["might have locked"] },
    { t: "tf", q: "\u201CShe needn't have cooked so much\u201D means she cooked a lot, but it was unnecessary.", a: true },
    { t: "mcq", q: "The road was wet this morning. It ___ during the night.", o: ["must rain", "must have rained", "should rain", "can rain"], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["You", "have", "told", "should", "me", "earlier"], a: "You should have told me earlier" },
    { t: "mcq", q: "He was lucky \u2014 he ___ badly hurt.", o: ["could have been", "must have been", "should have been", "would have been"], a: 0 },
    { t: "match", q: "Match each modal-perfect with its meaning.", pairs: [["should have studied", "regret / advice not followed"], ["must have left", "strong certainty about the past"], ["could have helped", "past possibility not used"], ["might have forgotten", "uncertain guess about the past"]] },
    { t: "fib", q: "You ___ worried \u2014 everything turned out fine. (needn't)", a: ["needn't have worried"] }
  ]
},
{
  id: "subjunctive", title: "Subjunctive Mood",
  expl: "The subjunctive uses the base verb after verbs of suggestion, demand or necessity: 'I suggest he go', 'It is vital that she be on time'. It also appears in wishes and unreal situations: 'If I were you', 'I wish I knew'.",
  questions: [
    { t: "mcq", q: "The teacher suggested that he ___ harder.", o: ["studies", "study", "studied", "studying"], a: 1, hint: "After 'suggest that', drop the -s." },
    { t: "mcq", q: "It is important that she ___ on time.", o: ["be", "is", "was", "being"], a: 0 },
    { t: "mcq", q: "If I ___ you, I would accept the offer.", o: ["am", "was", "were", "be"], a: 2 },
    { t: "fib", q: "I demand that he ___ this room at once. (leave)", a: ["leave"] },
    { t: "tf", q: "\u201CThe doctor insisted that the patient rests\u201D uses the subjunctive correctly.", a: false },
    { t: "mcq", q: "She requested that the meeting ___ postponed.", o: ["is", "was", "being", "be"], a: 3 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["He", "that", "insisted", "quiet", "we", "stay"], a: "He insisted that we stay quiet" },
    { t: "mcq", q: "I wish I ___ how to swim.", o: ["know", "knew", "known", "knowing"], a: 1 },
    { t: "match", q: "Match each sentence with its subjunctive use.", pairs: [["I suggest he go", "after a verb of suggestion"], ["If I were rich", "in an unreal condition"], ["Long live the king!", "fixed expression"], ["It is vital that she be here", "after necessity"]] },
    { t: "fib", q: "The committee recommended that the plan ___ approved. (be)", a: ["be"] }
  ]
},
{
  id: "inversion", title: "Inversion",
  expl: "Inversion flips the normal word order for emphasis, usually after negative adverbials: 'Never have I seen such beauty', 'Not only did he arrive late, but he also forgot his books'. It follows 'hardly', 'scarcely', 'no sooner' and 'only' too.",
  questions: [
    { t: "mcq", q: "___ have I seen such a beautiful sunset.", o: ["Ever", "Never", "Always", "Often"], a: 1, hint: "Only a negative opener triggers inversion." },
    { t: "mcq", q: "Not only did she sing, ___ she danced.", o: ["and also", "but too", "but also", "and too"], a: 2 },
    { t: "mcq", q: "Hardly ___ down when the phone rang.", o: ["I had sat", "had I sat", "did I sat", "have I sat"], a: 1 },
    { t: "fib", q: "___ had the match started when it began to rain. (scarcely)", a: ["Scarcely"] },
    { t: "tf", q: "\u201CNo sooner he arrived than it started raining\u201D is correct.", a: false },
    { t: "mcq", q: "Only after the rain stopped ___ go outside.", o: ["we could", "we can", "did we could", "could we"], a: 3 },
    { t: "reorder", q: "Arrange the words into a correct inverted sentence.", w: ["have", "Never", "seen", "I", "such", "courage"], a: "Never have I seen such courage" },
    { t: "mcq", q: "Choose the correctly inverted sentence.", o: ["Rarely she comes late.", "Rarely she does come late.", "Rarely does she come late.", "Rarely comes she late."], a: 2 },
    { t: "match", q: "Match each opener with its inversion pattern.", pairs: [["Never have I...", "after 'never'"], ["Not only... but also", "paired inversion structure"], ["Hardly had I...", "after 'hardly'"], ["Only then did...", "after 'only'"]] },
    { t: "fib", q: "___ did they reach home than the lights went out. (no sooner)", a: ["No sooner"] }
  ]
},
{
  id: "cleft-sentences", title: "Cleft Sentences",
  expl: "Cleft sentences split one idea into two parts to emphasise a word: 'It was Ali who broke the window' (not someone else). Wh-clefts do the same job: 'What I need is more time'. They answer the silent question 'who?' or 'what?' with stress.",
  questions: [
    { t: "mcq", q: "___ was Sara who won the prize.", o: ["That", "It", "This", "There"], a: 1, hint: "It-clefts always begin with the same word." },
    { t: "mcq", q: "What I need ___ a good night's sleep.", o: ["is", "are", "were", "be"], a: 0 },
    { t: "mcq", q: "\u201CAli broke the window.\u201D Now emphasise ALI:", o: ["It was the window that Ali broke.", "What broke was Ali.", "It was Ali who broke the window.", "It broke Ali the window."], a: 2 },
    { t: "fib", q: "It was ___ that we first met. (emphasise the place: in Lahore)", a: ["in Lahore"] },
    { t: "tf", q: "\u201CWhat broke the window was Ali\u201D is a correct pseudo-cleft sentence.", a: true },
    { t: "mcq", q: "\u201CShe bought a car.\u201D Now emphasise the CAR:", o: ["It was she who bought a car.", "What she bought was car.", "It bought she a car.", "It was a car that she bought."], a: 3 },
    { t: "reorder", q: "Arrange the words into a correct cleft sentence.", w: ["What", "is", "want", "I", "peace", "quiet", "and"], a: "What I want is peace and quiet" },
    { t: "mcq", q: "Which sentence is a cleft sentence?", o: ["The dog barked loudly.", "It was the dog that barked loudly.", "Dogs bark loudly.", "The loud dog barked."], a: 1 },
    { t: "match", q: "Match each cleft with its type.", pairs: [["It was Ali who...", "it-cleft emphasising the person"], ["What I need is time", "wh-cleft (pseudo-cleft)"], ["It was yesterday that...", "it-cleft emphasising time"], ["All I want is rest", "pseudo-cleft with 'all'"]] },
    { t: "fib", q: "___ I dislike is his rude behaviour. (what)", a: ["What"] }
  ]
},
{
  id: "participles", title: "Participles & Participial Phrases",
  expl: "Present participles (-ing) describe what CAUSES a feeling: 'a boring lecture'. Past participles (-ed) describe who FEELS it: 'bored students'. Participial phrases add detail: 'Having finished his work, Ali went out to play.'",
  questions: [
    { t: "mcq", q: "The lecture was ___, so the students felt ___.", o: ["bored / boring", "boring / bored", "bored / bored", "boring / boring"], a: 1, hint: "-ing is the cause, -ed is the feeling." },
    { t: "mcq", q: "___ his homework, Daniyal went out to play.", o: ["Having finished", "Having been finished", "Finished", "Finishing by"], a: 0 },
    { t: "mcq", q: "The ___ news made everyone happy.", o: ["excited", "excite", "exciting", "excitement"], a: 2 },
    { t: "fib", q: "___ in Lahore, she knows the city well. (Having lived)", a: ["Having lived"] },
    { t: "tf", q: "\u201CThe tired players\u201D and \u201Cthe tiring players\u201D mean the same thing.", a: false },
    { t: "mcq", q: "___ by the thunder, the child hid under the bed.", o: ["Frightening", "Frighten", "Fright", "Frightened"], a: 3 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["in", "Walking", "saw", "the", "I", "an", "old", "park", "friend"], a: "Walking in the park I saw an old friend" },
    { t: "mcq", q: "Choose the correct sentence.", o: ["I was interested in the story.", "I was interesting in the story.", "The story was interested.", "I was interest in the story."], a: 0 },
    { t: "match", q: "Match each participle with its role.", pairs: [["boring", "-ing: describes the cause"], ["bored", "-ed: describes the feeling"], ["Having eaten", "perfect participle phrase"], ["broken window", "past participle as adjective"]] },
    { t: "fib", q: "The ___ parents waited anxiously outside the school. (worry)", a: ["worried"] }
  ]
},
{
  id: "determiners", title: "Determiners & Quantifiers",
  expl: "Determiners come before nouns and tell us WHICH or HOW MANY: articles, demonstratives, possessives, and quantifiers like 'each', 'every', 'few', 'a few', 'much', 'many', 'all' and 'both'. The right one makes your meaning exact.",
  questions: [
    { t: "mcq", q: "___ student must bring their own pen.", o: ["Every students", "Each", "All", "Both"], a: 1, hint: "Only one option takes a singular noun correctly." },
    { t: "mcq", q: "There are ___ books on the shelf; borrow any one.", o: ["a few", "few", "little", "much"], a: 0 },
    { t: "mcq", q: "___ of the two brothers is a doctor.", o: ["Every", "All", "Each", "None"], a: 2 },
    { t: "fib", q: "She has ___ friends in the new city, so she feels lonely. (few \u2014 hardly any)", a: ["few"] },
    { t: "tf", q: "\u201CMuch students attended the seminar\u201D is correct.", a: false },
    { t: "mcq", q: "___ the players were tired after the match.", o: ["Every", "Each", "Much", "All"], a: 3 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["Both", "parents", "my", "teachers", "are"], a: "Both my parents are teachers" },
    { t: "mcq", q: "I don't have ___ money left.", o: ["many", "much", "few", "several"], a: 1 },
    { t: "match", q: "Match each quantifier with its rule.", pairs: [["few", "hardly any (negative)"], ["a few", "some (positive)"], ["much", "with uncountable nouns"], ["many", "with countable nouns"]] },
    { t: "fib", q: "___ child deserves love and care. (every)", a: ["Every"] }
  ]
}
,
{
  id: "modals", title: "Modal Verbs",
  expl: "Modal verbs are special helper verbs like can, may, must and should. They add meanings such as ability, permission, obligation, prohibition, requests and possibility to the main verb.",
  questions: [
    { t: "mcq", q: "She ___ swim very well.", o: ["can", "must", "should", "might"], a: 0 },
    { t: "mcq", q: "___ I go to the playground, mother?", o: ["Must", "May", "Should", "Will"], a: 1 },
    { t: "fib", q: "You ___ wear a seatbelt in the car. (obligation)", a: ["must"] },
    { t: "tf", q: "\u201CYou must not run in the corridor\u201D is a prohibition.", a: true },
    { t: "mcq", q: "___ you open the window, please?", o: ["Will", "Shall", "Must", "May"], a: 0 },
    { t: "fib", q: "It is cloudy. It ___ rain today. (possibility)", a: ["might", "may"] },
    { t: "mcq", q: "___ I help you carry your bag?", o: ["Shall", "Must", "May", "Should"], a: 0 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["You", "must", "finish", "your", "homework"], a: "You must finish your homework" },
    { t: "tf", q: "\u201CShe can sing beautifully\u201D shows ability.", a: true },
    { t: "mcq", q: "He ___ be at home; the lights are off.", o: ["might not", "must", "should", "can"], a: 0 }
  ]
},
{
  id: "nouns", title: "Nouns",
  expl: "Nouns name people, places, things and ideas. Some nouns are countable, some are uncountable, and some change their spelling \u2014 or even their meaning \u2014 in the plural.",
  questions: [
    { t: "mcq", q: "A ___ of birds flew across the sky.", o: ["flock", "herd", "pack", "team"], a: 0 },
    { t: "mcq", q: "How ___ water is left in the bottle?", o: ["many", "much", "few", "a"], a: 1 },
    { t: "fib", q: "___ is the best policy. (honest \u2192 noun form)", a: ["Honesty", "honesty"] },
    { t: "tf", q: "\u201CFurniture\u201D is an uncountable noun, so we say \u201Cmuch furniture\u201D.", a: true },
    { t: "mcq", q: "The plural of \u201Cchild\u201D is ___.", o: ["childs", "children", "childes", "childrens"], a: 1 },
    { t: "fib", q: "The ___ are grazing in the field. (ox \u2192 plural)", a: ["oxen"] },
    { t: "mcq", q: "\u201CArm\u201D means a part of the body, but \u201Carms\u201D can mean ___.", o: ["sleeves", "weapons", "hands", "gloves"], a: 1 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["A", "team", "of", "players", "won", "the", "match"], a: "A team of players won the match" },
    { t: "tf", q: "\u201CSheeps\u201D is the correct plural of \u201Csheep\u201D.", a: false },
    { t: "mcq", q: "Which noun is COUNTABLE?", o: ["milk", "rice", "book", "sugar"], a: 2 }
  ]
},
{
  id: "questions", title: "Asking Questions",
  expl: "Wh-words like who, what, where, when, why and how help us ask questions. In English questions, the helping verb (do, does, did) usually comes before the subject.",
  questions: [
    { t: "mcq", q: "___ is your best friend?", o: ["What", "Who", "Where", "When"], a: 1 },
    { t: "mcq", q: "___ did you go after school?", o: ["Who", "What", "Where", "Whose"], a: 2 },
    { t: "fib", q: "___ do birds fly to warm places? (why)", a: ["why"] },
    { t: "tf", q: "\u201CWhose bag is this?\u201D asks about the owner of the bag.", a: true },
    { t: "mcq", q: "___ she like apples?", o: ["Does", "Do", "Is", "Are"], a: 0 },
    { t: "mcq", q: "___ they play cricket yesterday?", o: ["Do", "Does", "Did", "Are"], a: 2 },
    { t: "fib", q: "___ old are you? (how)", a: ["how"] },
    { t: "tf", q: "\u201CWhere you live?\u201D is a correctly formed question.", a: false },
    { t: "reorder", q: "Arrange the words into a correct question.", w: ["When", "does", "the", "school", "open"], a: "When does the school open" },
    { t: "mcq", q: "___ of these two shirts do you like?", o: ["What", "Which", "Who", "Whose"], a: 1 }
  ]
},
{
  id: "sentence-types", title: "Sentence Types",
  expl: "Sentences have jobs: statements declare, questions ask, orders command, and exclamations show strong feeling. They also have shapes: simple (one idea), compound (two ideas joined), and complex (one main idea with a supporting part).",
  questions: [
    { t: "mcq", q: "Which sentence is declarative?", o: ["Close the door.", "She reads every night.", "What a lovely garden!", "Did you call me?"], a: 1 },
    { t: "mcq", q: "Which sentence is imperative?", o: ["Please sit down.", "She sat down.", "Did she sit down?", "How quietly she sat!"], a: 0 },
    { t: "tf", q: "\u201CWhat a beautiful rainbow!\u201D is an exclamatory sentence.", a: true },
    { t: "mcq", q: "Which sentence is complex?", o: ["I ran fast.", "I ran fast, and I won the race.", "Although I was tired, I finished the race.", "Run fast!"], a: 2 },
    { t: "fib", q: "A ___ sentence has two independent clauses joined by \u2018and\u2019, \u2018but\u2019 or \u2018or\u2019. (compound)", a: ["compound"] },
    { t: "tf", q: "\u201CShe opened the window and the fresh air came in\u201D is a simple sentence.", a: false },
    { t: "mcq", q: "Interrogative form of \u201CShe can swim.\u201D", o: ["Can she swim?", "She can swim?", "Does she can swim?", "Swim she can?"], a: 0 },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["This", "is", "a", "simple", "sentence"], a: "This is a simple sentence" },
    { t: "fib", q: "He likes tea. \u2192 He ___ like tea. (negative)", a: ["does not", "doesn't", "doesnt"] },
    { t: "mcq", q: "Which is a compound sentence?", o: ["The baby slept.", "The baby slept, and the mother cooked.", "When the baby slept, the mother cooked.", "Sleep, baby!"], a: 1 }
  ]
},
{
  id: "verbals", title: "Transitive Verbs, Infinitives & Gerunds",
  expl: "A transitive verb needs an object (She kicked the ball). An infinitive is \u2018to\u2019 + verb (to learn). A gerund is verb-ing used as a noun (Swimming is fun). Some verbs take only one of them, so learn which goes with which.",
  questions: [
    { t: "mcq", q: "Which verb is transitive in its sentence?", o: ["She laughed loudly.", "He bought a pen.", "The baby slept.", "Birds fly."], a: 1 },
    { t: "tf", q: "In \u201CShe gave him a gift\u201D, the verb \u2018gave\u2019 takes an object.", a: true },
    { t: "mcq", q: "Choose the sentence with a gerund:", o: ["I want to swim.", "Swimming is good exercise.", "She swims well.", "They will swim."], a: 1 },
    { t: "mcq", q: "Choose the sentence with an infinitive:", o: ["He enjoys reading.", "Reading is fun.", "She decided to leave.", "Leaving early helped."], a: 2 },
    { t: "fib", q: "She wants ___ abroad. (to study)", a: ["to study"] },
    { t: "tf", q: "In \u201CThey enjoy playing cricket\u201D, \u2018playing\u2019 is a gerund.", a: true },
    { t: "mcq", q: "He promised ___ on time.", o: ["coming", "to come", "come", "comes"], a: 1 },
    { t: "fib", q: "___ early is a good habit. (wake)", a: ["waking"] },
    { t: "reorder", q: "Arrange the words into a correct sentence.", w: ["I", "want", "to", "learn", "English"], a: "I want to learn English" },
    { t: "tf", q: "An infinitive is formed with \u2018to\u2019 + the base verb.", a: true }
  ]
}
];
