// LinguaBuddy — per-story learning extras, keyed by story id.
// prediction: a "before reading" question. vocab: "during reading" support
// (word, simple English definition). inference: one deeper MCQ asked
// after the standard quiz. writing: a writing-extension prompt.
// genre + sloIds feed the filters and the reading-recommendation engine.
export const DATA_VERSION_STORYMETA = "1.0.0";

export const STORYMETA = {
"thirsty-crow": {
  genre: "Fable",
  sloIds: ["reading", "synant"],
  prediction: "Look at the title 'The Thirsty Crow'. What problem do you think the crow will face, and how might it solve it?",
  vocab: [
    { word: "thirsty", def: "Needing water to drink." },
    { word: "delighted", def: "Very happy." },
    { word: "clever", def: "Quick to understand; smart." }
  ],
  inference: { q: "The crow did not wait for help. What does this tell us about its character?", o: ["It was lazy", "It was patient and clever", "It was afraid", "It was rude"], a: 1 },
  writing: "Write 5 sentences about a time you solved a problem by thinking cleverly, like the crow."
},
"tortoise-hare": {
  genre: "Fable",
  sloIds: ["reading", "tenses"],
  prediction: "A fast hare races a slow tortoise. Predict: who will win, and why?",
  vocab: [
    { word: "proud", def: "Thinking too highly of yourself." },
    { word: "steadily", def: "Without stopping; at an even pace." },
    { word: "shame", def: "Feeling bad about a wrong action." }
  ],
  inference: { q: "Why did the hare lose even though he was faster?", o: ["He was ill", "He was overconfident and lazy", "The tortoise cheated", "The race was too short"], a: 1 },
  writing: "Write a paragraph: 'Slow and steady wins the race.' Give an example from your own life."
},
"boy-wolf": {
  genre: "Fable",
  sloIds: ["reading", "speech"],
  prediction: "A boy keeps shouting 'Wolf!' for fun. What do you think will happen one day?",
  vocab: [
    { word: "shepherd", def: "A person who looks after sheep." },
    { word: "naughty", def: "Behaving badly." },
    { word: "frightened", def: "Very afraid." }
  ],
  inference: { q: "The villagers did not come the third time. What lesson does this teach?", o: ["Wolves are scary", "Liars lose trust", "Villagers are unkind", "Sheep are helpless"], a: 1 },
  writing: "The boy says sorry to the villagers. Write what he says, in 4–5 sentences."
},
"honest-woodcutter": {
  genre: "Folk Tale",
  sloIds: ["reading", "articles"],
  prediction: "A poor woodcutter loses his axe in a river. A fairy appears. What do you think she will do?",
  vocab: [
    { word: "honest", def: "Truthful; not cheating." },
    { word: "reward", def: "Something given for good work." },
    { word: "joyfully", def: "With great happiness." }
  ],
  inference: { q: "Rahim refused the golden axe. What does this show?", o: ["He was foolish", "He was honest and content", "He disliked gold", "He was afraid"], a: 1 },
  writing: "Imagine YOU found the golden axe. Write 5 sentences about what you would do — honestly."
},
"ant-grasshopper": {
  genre: "Fable",
  sloIds: ["reading", "prepositions"],
  prediction: "An ant works all summer while a grasshopper sings. What will happen in winter?",
  vocab: [
    { word: "store", def: "To keep something for later use." },
    { word: "starving", def: "Suffering from lack of food." },
    { word: "gently", def: "In a soft, kind way." }
  ],
  inference: { q: "The ant shared food even though the grasshopper had laughed at her. What does this show?", o: ["She was weak", "She was kind", "She had too much food", "She was afraid"], a: 1 },
  writing: "Write 4–5 sentences: how do YOU prepare for exams — like the ant or like the grasshopper?"
},
"greedy-dog": {
  genre: "Fable",
  sloIds: ["reading", "sva"],
  prediction: "A greedy dog with a bone sees a 'bigger bone' in the water. Predict what he will do.",
  vocab: [
    { word: "greedy", def: "Wanting more than you need." },
    { word: "reflection", def: "The image seen in water or a mirror." },
    { word: "content", def: "Happy with what you have." }
  ],
  inference: { q: "The dog lost his bone because of greed. What should he have done?", o: ["Run faster", "Been content with his bone", "Bitten the other dog", "Thrown the bone away"], a: 1 },
  writing: "Write about a time someone's greed caused a loss — from a story, film, or real life."
},
"unity-strength": {
  genre: "Fable",
  sloIds: ["reading", "clauses"],
  prediction: "Pigeons are caught in a hunter's net. How could small birds possibly escape?",
  vocab: [
    { word: "flock", def: "A group of birds." },
    { word: "amazement", def: "Great surprise." },
    { word: "nibbled", def: "Bit off in small pieces." }
  ],
  inference: { q: "Why did the pigeons succeed only when they flew together?", o: ["The net was weak", "Combined strength lifted the net", "The hunter helped", "The mouse flew"], a: 1 },
  writing: "Write a paragraph about a time teamwork helped you or your class achieve something."
},
"clever-rabbit": {
  genre: "Folk Tale",
  sloIds: ["reading", "voice"],
  prediction: "A tiny rabbit must face a fierce lion. How can the rabbit possibly survive?",
  vocab: [
    { word: "fierce", def: "Very strong and frightening." },
    { word: "rage", def: "Extreme anger." },
    { word: "wisdom", def: "The quality of being wise." }
  ],
  inference: { q: "The rabbit used the lion's pride against him. What is the smartest part of the plan?", o: ["Walking slowly", "Making the lion look into the well", "Bowing low", "Talking loudly"], a: 1 },
  writing: "Retell the ending of the story in your own words: how the lion fell into the well."
}
};
