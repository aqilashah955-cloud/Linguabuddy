// LinguaBuddy curated content — reading resources: genre guide + reading strategies
export const DATA_VERSION_READGUIDE = "1.0.0";

// Every genre in the library: what it is + how to read it well.
export const GENRE_GUIDE = [
  { genre: "Adventure", icon: "🧭", blurb: "Exciting stories of journeys, danger and brave choices.", tip: "Follow the action: who wants what, and what stands in their way?" },
  { genre: "Mystery", icon: "🔎", blurb: "Puzzles and secrets that you solve along with the characters.", tip: "Collect the clues as you read — guess the answer before the ending." },
  { genre: "Science", icon: "🔬", blurb: "Explains how the world works, step by step.", tip: "Slow down for new ideas. Picture each step in your mind." },
  { genre: "Biography", icon: "👤", blurb: "The true life story of a real person.", tip: "Notice the challenges they faced and the choices they made." },
  { genre: "Poetry", icon: "🎵", blurb: "Feelings and pictures painted with rhythm and rhyme.", tip: "Read it aloud — poems are written to be heard, not just seen." },
  { genre: "History", icon: "🏛️", blurb: "True stories from the past: people, places and events.", tip: "Ask: what was life like then, and what changed since?" },
  { genre: "Humor", icon: "😄", blurb: "Stories written to make you laugh.", tip: "Enjoy the funny moments — then notice how the writer created them." },
  { genre: "Fantasy", icon: "🐉", blurb: "Magical worlds where impossible things happen.", tip: "Accept the magic rules of the world and follow the quest." },
  { genre: "Fable", icon: "🦊", blurb: "Short animal stories that teach a lesson (the moral).", tip: "Read to the end — the moral is the real point of the story." },
  { genre: "Folk Tale", icon: "🏮", blurb: "Old stories passed down by grandparents and storytellers.", tip: "Look for repeating patterns of three — three wishes, three tries, three brothers." },
  { genre: "Drama", icon: "🎭", blurb: "A play written to be acted: mostly dialogue with stage directions.", tip: "Read each character in a different voice — hear the play in your head." },
  { genre: "Myth & Legend", icon: "⚡", blurb: "Ancient-style tales that explain the world or honor heroes.", tip: "Ask: what natural thing or human truth is this story explaining?" },
  { genre: "Short Story", icon: "📖", blurb: "A complete realistic story, shorter than a novel.", tip: "Watch one character change from the beginning to the end." },
  { genre: "Essay", icon: "💡", blurb: "A writer's thoughtful ideas about one topic.", tip: "Find the main idea first, then the reasons that support it." },
  { genre: "Speech", icon: "🎤", blurb: "Words written to be spoken to an audience, to persuade or inspire.", tip: "Imagine the speaker's voice — where would they pause or speak loudly?" },
  { genre: "Letter", icon: "✉️", blurb: "A personal or formal message from one person to another.", tip: "Notice the greeting and closing — they show the relationship." },
  { genre: "Diary", icon: "📓", blurb: "Private, dated thoughts — like peeking into someone's day.", tip: "Feel the writer's mood: happy, worried, excited? What caused it?" },
  { genre: "News Report", icon: "📰", blurb: "Facts about something that happened: who, what, when, where, why.", tip: "Check the 5 Ws — a good report answers all of them." },
  { genre: "Travelogue", icon: "🧳", blurb: "A traveller's own story of a journey: places, people, food.", tip: "Travel with the writer — picture every new place described." },
  { genre: "Interview", icon: "🎙️", blurb: "Questions and answers with a real (or imagined) person.", tip: "The questions shape the answers — notice which questions get the best replies." },
  { genre: "Review", icon: "⭐", blurb: "One person's opinion of a book, film or show — good and bad points.", tip: "Separate facts about the work from the reviewer's opinions." },
  { genre: "Opinion", icon: "⚖️", blurb: "An argument for one side of a question, with reasons.", tip: "List the reasons for and against — then decide what YOU think." },
  { genre: "Description", icon: "🎨", blurb: "Word-paintings of a person, place or thing using the senses.", tip: "Close your eyes after reading — can you still see, hear and smell it?" }
];

// Practical reading strategies: before, during, after.
export const READING_STRATEGIES = [
  {
    when: "Before Reading 🔮",
    points: [
      "Look at the title and genre. Predict what the piece will be about.",
      "Ask yourself: what do I already know about this topic?",
      "Set a purpose: 'I want to find out why...' or 'I want to enjoy the story.'"
    ]
  },
  {
    when: "During Reading 👀",
    points: [
      "Read in chunks — one paragraph at a time, not the whole page at once.",
      "When you meet a new word, guess its meaning from the sentence first.",
      "Picture the scene like a film playing in your head.",
      "If you get lost, go back one paragraph and read it slowly."
    ]
  },
  {
    when: "After Reading ✅",
    points: [
      "Retell the piece in 3-4 sentences, in your own words.",
      "Ask: what was the main idea? What surprised me?",
      "Connect it to your life: did it remind you of anything?",
      "Save new words to your vocabulary and use each in a sentence."
    ]
  }
];

// Skimming vs scanning: two speed-reading skills, explained simply.
export const SPEED_READING = [
  { skill: "Skimming 🏃", what: "Reading quickly to get the main idea.", how: "Read the title, first and last paragraph, and the first sentence of each paragraph." },
  { skill: "Scanning 🔍", what: "Running your eyes over the text to find one specific fact.", how: "Know what you are looking for (a name, date, number), then sweep the text until you spot it." }
];
