// LinguaBuddy curated content — Duolingo English Test prep.
// Versioned data module. Works offline; zero Firestore read costs.
// FAKE words are phonotactically English but not real words.
export const DATA_VERSION_DUOLINGO = "1.0.0";

/* 60 real English words, simple → advanced */
export const DET_READ_SELECT_REAL = [
  "cat", "happy", "run", "book", "water", "friend", "house", "eat", "sun", "play",
  "journey", "decide", "weather", "comfortable", "invite", "market", "careful", "dream", "price", "smile",
  "brave", "calm", "eager", "gentle", "vivid", "witty", "sturdy", "noble", "brisk", "candid",
  "achieve", "benefit", "curious", "efficient", "generous", "honest", "improve", "knowledge", "patient", "reliable",
  "ambiguous", "compassionate", "diligent", "eloquent", "feasible", "humble", "innovative", "keen", "loyal", "modest",
  "meticulous", "ephemeral", "pragmatic", "resilient", "skeptical", "tenacious", "versatile", "wary", "zenith", "accolade"
];

/* 40 plausible non-words — none of these is a real English word */
export const DET_READ_SELECT_FAKE = [
  "florp", "blorp", "snorp", "quorp",
  "flimble", "drimble", "skimble", "primble",
  "snazzle", "quazzle", "brazzle", "drazle",
  "plinket", "brinket", "clinket", "flinket",
  "morble", "sorble", "torble", "worble",
  "crindle", "frindle", "prindle", "grindle",
  "shump", "blump", "flump", "glump",
  "sneeble", "queeble", "meeble", "teeble",
  "zorp", "vorp", "yorp", "xorp",
  "thwock", "smibble", "clibble", "yizzle"
];

/* Read & Complete: first letters shown, endings hidden with ___.
   answers: full words in blank order. */
export const DET_READ_COMPLETE = [
{
  id: "det-rc1", title: "New Schools",
  text: "The governm___ annou___ new plans to bui___ more schools in rural areas. Offi___ said the proj___ will create thousands of jobs and impr___ education for children who curr___ travel long distances to class.",
  answers: ["government", "announced", "build", "Officials", "project", "improve", "currently"]
},
{
  id: "det-rc2", title: "A New Frog",
  text: "Scient___ have discov___ a new species of frog in the Amazon rainf___. The tiny amph___ is only two centim___ long and has bright green skin. Resea___ believe hundreds more species are still undisc___ in the region.",
  answers: ["Scientists", "discovered", "rainforest", "amphibian", "centimetres", "Researchers", "undiscovered"]
},
{
  id: "det-rc3", title: "Smartphones",
  text: "Smartph___ have changed the way people communi___. Twenty years ago, most conver___ happened face to face or by landl___. Today, billions of mess___ are sent every day through apps and social media platf___.",
  answers: ["Smartphones", "communicate", "conversations", "landline", "messages", "platforms"]
},
{
  id: "det-rc4", title: "Ocean Plastic",
  text: "Plastic pollu___ is one of the biggest threats to ocean life. Every year, mill___ of tonnes of plastic waste enter the sea, harm___ turtles, seabirds and fish. Many count___ are now bann___ single-use plastic bags to redu___ the damage.",
  answers: ["pollution", "millions", "harming", "countries", "banning", "reduce"]
}
];

/* Listen & Type: 20 sentences, simple → complex */
export const DET_LISTEN_TYPE = [
  "The cat is sleeping.",
  "She likes to read books.",
  "We went to the market yesterday.",
  "The children are playing in the park.",
  "He will travel to Lahore next week.",
  "My grandmother cooks delicious food.",
  "The train arrives at half past six.",
  "They have lived here since 2015.",
  "Learning English takes time and practice.",
  "The weather is getting colder every day.",
  "She asked me whether I had finished my homework.",
  "Despite the rain, the match continued as planned.",
  "The museum, which opened last year, attracts thousands of visitors.",
  "If I had more time, I would learn another language.",
  "He was promoted because of his hard work and dedication.",
  "The committee will announce its decision tomorrow morning.",
  "Having finished her degree, she started her own business.",
  "The results were far better than anyone had expected.",
  "Not only did he win the race, but he also broke the record.",
  "Whatever challenges arise, we must remain calm and focused."
];

/* Interactive Writing: 5-minute prompts */
export const DET_WRITING = [
  { id: "det-w1", prompt: "Describe a tradition in your country. Why is it important?", minWords: 50, timeMin: 5 },
  { id: "det-w2", prompt: "What is the most useful thing you have learned in school? Explain with an example.", minWords: 50, timeMin: 5 },
  { id: "det-w3", prompt: "Describe your ideal weekend. What would you do and why?", minWords: 50, timeMin: 5 },
  { id: "det-w4", prompt: "Do you prefer city life or countryside life? Give reasons for your choice.", minWords: 50, timeMin: 5 },
  { id: "det-w5", prompt: "Write about a time you helped someone. What happened and how did you feel?", minWords: 50, timeMin: 5 },
  { id: "det-w6", prompt: "What skill would you like to learn in the future? Why would it be useful?", minWords: 50, timeMin: 5 }
];

/* Speaking Sample: 30s prep + 90s talk */
export const DET_SPEAKING = [
  { id: "det-s1", prompt: "Describe a photo that is important to you. What is in it and why does it matter?" },
  { id: "det-s2", prompt: "Talk about a goal you have for this year and how you plan to achieve it." },
  { id: "det-s3", prompt: "Describe the best teacher you ever had. What made them special?" },
  { id: "det-s4", prompt: "What does friendship mean to you? Give an example from your life." },
  { id: "det-s5", prompt: "Describe a challenge you overcame and what you learned from it." },
  { id: "det-s6", prompt: "Talk about a place that makes you feel calm. Describe it in detail." }
];

/* DET-specific exam tips */
export const DET_TIPS = [
  "The test is adaptive — questions get harder as you do well. Difficult questions are a good sign!",
  "Read & Select gives you 60 seconds: trust your first instinct about each word.",
  "In Read & Complete, use the first letters plus grammar clues (verb endings, articles).",
  "No headphones allowed — use your device speakers and microphone.",
  "Keep your eyes on the screen; looking away often can invalidate your test.",
  "Speak for the full time in speaking tasks — long silences lower your score.",
  "The test takes about 1 hour. Sit in a quiet, well-lit room, alone, with a clear desk.",
  "You get 3 plays in Listen & Type here; in the real test, listen carefully the first time."
];
