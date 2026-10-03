// LinguaBuddy — Kids Zone data (ages 5-8).
// Curated early-learning content: alphabet with phonics cues, sight words,
// picture vocabulary by category, rhyme families, and short illustrated
// stories. All offline, no API. Kid-safe words and emoji only.

export const DATA_VERSION_KIDS = "1.0.0";

/* ---------------- Alphabet: letter + keyword + emoji + phonics cue ---------------- */
export const ALPHABET = [
  { letter: "A", word: "Apple", emoji: "🍎", phonics: "ah" },
  { letter: "B", word: "Ball", emoji: "⚽", phonics: "buh" },
  { letter: "C", word: "Cat", emoji: "🐱", phonics: "kuh" },
  { letter: "D", word: "Dog", emoji: "🐶", phonics: "duh" },
  { letter: "E", word: "Elephant", emoji: "🐘", phonics: "eh" },
  { letter: "F", word: "Fish", emoji: "🐟", phonics: "fff" },
  { letter: "G", word: "Grapes", emoji: "🍇", phonics: "guh" },
  { letter: "H", word: "Hat", emoji: "🎩", phonics: "huh" },
  { letter: "I", word: "Ice Cream", emoji: "🍦", phonics: "ih" },
  { letter: "J", word: "Juice", emoji: "🧃", phonics: "juh" },
  { letter: "K", word: "Kite", emoji: "🪁", phonics: "kuh" },
  { letter: "L", word: "Lion", emoji: "🦁", phonics: "lll" },
  { letter: "M", word: "Mango", emoji: "🥭", phonics: "mmm" },
  { letter: "N", word: "Nose", emoji: "👃", phonics: "nnn" },
  { letter: "O", word: "Orange", emoji: "🍊", phonics: "oh" },
  { letter: "P", word: "Parrot", emoji: "🦜", phonics: "puh" },
  { letter: "Q", word: "Queen", emoji: "👸", phonics: "kwuh" },
  { letter: "R", word: "Rabbit", emoji: "🐰", phonics: "rrr" },
  { letter: "S", word: "Sun", emoji: "☀️", phonics: "sss" },
  { letter: "T", word: "Tiger", emoji: "🐯", phonics: "tuh" },
  { letter: "U", word: "Umbrella", emoji: "☂️", phonics: "uh" },
  { letter: "V", word: "Van", emoji: "🚐", phonics: "vvv" },
  { letter: "W", word: "Watch", emoji: "⌚", phonics: "wuh" },
  { letter: "X", word: "Xmas Tree", emoji: "🎄", phonics: "ks" },
  { letter: "Y", word: "Yo-Yo", emoji: "🪀", phonics: "yuh" },
  { letter: "Z", word: "Zebra", emoji: "🦓", phonics: "zzz" }
];

/* ---------------- 30 very common sight words ---------------- */
export const SIGHT_WORDS = [
  "I", "a", "the", "and", "is", "it", "in", "you", "we", "me",
  "my", "like", "see", "can", "go", "up", "down", "big", "red", "one",
  "two", "three", "mom", "dad", "cat", "dog", "sun", "day", "play", "look"
];

/* ---------------- Picture words by category (emoji <-> word) ---------------- */
export const PICTURE_WORDS = {
  animals: [
    { emoji: "🐱", word: "cat" }, { emoji: "🐶", word: "dog" },
    { emoji: "🦁", word: "lion" }, { emoji: "🐘", word: "elephant" },
    { emoji: "🐵", word: "monkey" }, { emoji: "🐔", word: "hen" },
    { emoji: "🐟", word: "fish" }, { emoji: "🦋", word: "butterfly" }
  ],
  food: [
    { emoji: "🍎", word: "apple" }, { emoji: "🍌", word: "banana" },
    { emoji: "🥛", word: "milk" }, { emoji: "🍞", word: "bread" },
    { emoji: "🥚", word: "egg" }, { emoji: "🍇", word: "grapes" },
    { emoji: "🍊", word: "orange" }, { emoji: "🍪", word: "biscuit" }
  ],
  colors: [
    { emoji: "🔴", word: "red" }, { emoji: "🔵", word: "blue" },
    { emoji: "🟡", word: "yellow" }, { emoji: "🟢", word: "green" },
    { emoji: "🟠", word: "orange" }, { emoji: "🟣", word: "purple" },
    { emoji: "⚫", word: "black" }, { emoji: "⚪", word: "white" }
  ],
  home: [
    { emoji: "🏠", word: "house" }, { emoji: "🛏️", word: "bed" },
    { emoji: "🪑", word: "chair" }, { emoji: "🚪", word: "door" },
    { emoji: "🪟", word: "window" }, { emoji: "🍽️", word: "plate" },
    { emoji: "🥄", word: "spoon" }, { emoji: "🕰️", word: "clock" }
  ]
};

export const PICTURE_CATS = [
  { id: "animals", emoji: "🐶", label: "Animals" },
  { id: "food", emoji: "🍎", label: "Food" },
  { id: "colors", emoji: "🎨", label: "Colors" },
  { id: "home", emoji: "🏠", label: "Home" }
];

/* ---------------- Rhyme families ---------------- */
export const RHYME_FAMILIES = [
  { family: "-at", words: ["cat", "hat", "mat", "sat", "rat"] },
  { family: "-an", words: ["man", "can", "pan", "ran", "fan"] },
  { family: "-og", words: ["dog", "fog", "log", "jog", "frog"] },
  { family: "-ed", words: ["bed", "red", "fed", "sled", "Ted"] },
  { family: "-in", words: ["pin", "win", "bin", "grin", "spin"] },
  { family: "-ug", words: ["bug", "hug", "mug", "rug", "tug"] }
];

/* ---------------- Short illustrated stories ----------------
 * art: one of sun|house|tree|cat|bird|pond|star|moon — js/kids.js draws a
 * tiny inline SVG scene from this keyword. */
export const KIDS_STORIES = [
  {
    id: "sunny-day",
    title: "Sunny Day",
    emoji: "☀️",
    pages: [
      { art: "sun", text: "The sun is up. It is a hot, sunny day. The sun smiles at us." },
      { art: "tree", text: "A big tree stands in the park. Its leaves are green. Birds sit on the tree." },
      { art: "bird", text: "A little bird sings. Tweet, tweet! The bird is happy." }
    ]
  },
  {
    id: "mimi-cat",
    title: "Mimi the Cat",
    emoji: "🐱",
    pages: [
      { art: "cat", text: "This is Mimi. Mimi is a little cat. She likes milk." },
      { art: "house", text: "Mimi lives in a red house. She naps on the mat. Shhh! Mimi is asleep." },
      { art: "moon", text: "At night, the moon is out. Mimi looks at the moon. Good night, Mimi!" }
    ]
  },
  {
    id: "little-pond",
    title: "The Little Pond",
    emoji: "💧",
    pages: [
      { art: "pond", text: "Look! A little pond. The water is blue. Ducks swim in the pond." },
      { art: "tree", text: "A tree grows by the pond. Frogs jump near the tree. Ribbit, ribbit!" },
      { art: "star", text: "Stars come out at night. One, two, three stars! The pond sleeps now." }
    ]
  }
];
