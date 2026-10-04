// LinguaBuddy curated content — SLO question banks (Middle, grades 6-8)
// Versioned data module. Works offline; zero Firestore read costs.
export const DATA_VERSION_SLOS = "1.1.0";

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
  id: "synant", title: "Synonyms & Antonyms",
  expl: "Synonyms are words with the SAME meaning; antonyms have OPPOSITE meanings. A rich vocabulary makes your speaking and writing stronger. Urdu hints are given to help you.",
  questions: [
    { t: "mcq", q: "Synonym of \u201Cbrave\u201D:", o: ["cowardly", "courageous", "weak", "afraid"], a: 1, hint: "Urdu: \u0628\u06C1\u0627\u062F\u0631" },
    { t: "mcq", q: "Antonym of \u201Cancient\u201D:", o: ["old", "modern", "historic", "aged"], a: 1, hint: "Urdu: \u0642\u062F\u06CC\u0645" },
    { t: "fib", q: "Write any synonym of \u201Chappy\u201D. (Urdu: \u062E\u0648\u0634)", a: ["glad", "joyful", "cheerful", "delighted", "pleased", "merry"] },
    { t: "tf", q: "\u201CGenerous\u201D and \u201Cselfish\u201D are antonyms. (Urdu: \u0633\u062E\u06CC / \u062E\u0648\u062F\u063A\u0631\u0636)", a: true },
    { t: "match", q: "Match each word with its synonym.", pairs: [["rapid", "fast"], ["tiny", "small"], ["wealthy", "rich"], ["begin", "start"]] },
    { t: "mcq", q: "Antonym of \u201Cvictory\u201D:", o: ["success", "defeat", "prize", "glory"], a: 1, hint: "Urdu: \u0641\u062A\u062D" },
    { t: "fib", q: "Write the antonym of \u201Chonest\u201D. (Urdu: \u0627\u06CC\u0645\u0627\u0646\u062F\u0627\u0631)", a: ["dishonest"] },
    { t: "mcq", q: "Synonym of \u201Cenormous\u201D:", o: ["tiny", "huge", "small", "little"], a: 1, hint: "Urdu: \u0628\u06C1\u062A \u0628\u0691\u0627" },
    { t: "tf", q: "\u201CExpand\u201D and \u201Ccontract\u201D are synonyms. (Urdu: \u067E\u06BE\u06CC\u0644\u0627\u0646\u0627 / \u0633\u06A9\u06CC\u0691\u0646\u0627)", a: false },
    { t: "fib", q: "The antonym of \u201Cpolite\u201D (Urdu: \u0634\u0627\u0626\u0633\u062A\u06C1) is ___.", a: ["rude", "impolite"] }
  ]
},
{
  id: "vocab", title: "Prefixes, Suffixes & Vocabulary",
  expl: "Prefixes attach to the FRONT of words (un-happy) and suffixes to the END (hope-ful). Learning them helps you decode hundreds of new words. Urdu hints are given to help you.",
  questions: [
    { t: "mcq", q: "The prefix in \u201Cunhappy\u201D (Urdu: \u0646\u0627\u062E\u0648\u0634) means:", o: ["again", "not", "before", "very"], a: 1 },
    { t: "mcq", q: "Add a prefix to \u201Cpossible\u201D to mean \u201Cnot possible\u201D:", o: ["impossible", "dispossible", "unpossible", "nonpossible"], a: 0 },
    { t: "fib", q: "The suffix in \u201Ccareless\u201D (Urdu: \u0628\u06D2 \u067E\u0631\u0648\u0627) is ___.", a: ["less", "-less"] },
    { t: "tf", q: "The suffix \u201C-ful\u201D in \u201Chopeful\u201D means \u201Cfull of\u201D.", a: true },
    { t: "mcq", q: "Choose the correct word: \u201CThe ___ boy shared his lunch.\u201D (kind)", o: ["kindness", "kindly", "kind", "unkind"], a: 2 },
    { t: "fib", q: "Make a noun from \u201Cdecide\u201D using a suffix: ___.", a: ["decision"] },
    { t: "mcq", q: "\u201CThe exam was difficult, but she remained ___.\u201D (calm)", o: ["calm", "calmly", "calmness", "calmed"], a: 0 },
    { t: "match", q: "Match each affix with its meaning.", pairs: [["re-", "again"], ["un-", "not"], ["-ness", "state of being"], ["-ful", "full of"]] },
    { t: "fib", q: "Add the correct prefix: ___behave (to behave badly)", a: ["mis"] },
    { t: "mcq", q: "In \u201Cpreview\u201D (Urdu: \u067E\u06CC\u0634 \u0646\u0638\u0627\u0631\u06C1), the prefix \u201Cpre-\u201D means:", o: ["after", "before", "again", "not"], a: 1 }
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
}
];
