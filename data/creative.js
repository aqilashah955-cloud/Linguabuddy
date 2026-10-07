// LinguaBuddy curated content — Creative Corner activities.
// Original prompts only. Versioned data module. Works offline; zero Firestore read costs.
// English only throughout.
export const DATA_VERSION_CREATIVE = "1.0.0";

export const CREATIVE_ACTIVITIES = [
{
  id: "finish-story", emoji: "✍️", title: "Finish the Story",
  desc: "Read a story starter, then write your own exciting ending.",
  tip: "A good ending answers the big question — but a great ending surprises the reader a little too.",
  prompts: [
    "The old clock in the hallway struck thirteen, and then the front door slowly opened by itself. No one was there — but something small and silver was lying on the doormat.",
    "Mina found a key under her desk at school with a tag that read “Room 404”. There was no Room 404 in the school. At least, not on any map she had ever seen.",
    "The parrot in the pet shop had been repeating the same phone number all week. On Friday, Daniyal finally dialled it — and someone answered on the first ring.",
    "Every night at exactly 11:11, the street lights on our road blinked twice. Last night, I decided to stay awake and find out why.",
    "The letter had no stamp and no address, yet it was sitting on my pillow when I woke up. Inside, in handwriting I almost recognised, were the words: “Do not trust the lighthouse.”",
    "When the science-fair volcano erupted, it was not red lava that came out — it was hundreds of tiny folded paper cranes, and each one had a name written on it.",
    "Grandmother's recipe book fell open to a page no one had ever seen before. The recipe was called “Memory Soup”, and the first ingredient was “one forgotten afternoon”.",
    "The new boy in class never spoke, but his drawings moved. Yesterday, during lunch break, I watched a bird he had drawn fly right off the page."
  ]
},
{
  id: "picture-prompt", emoji: "🖼️", title: "Picture Prompt",
  desc: "Read a vivid scene, then describe what you see, hear, and feel.",
  tip: "Great descriptions use the five senses: what do you see, hear, smell, taste, and touch?",
  prompts: [
    "A night market glowing with coloured lanterns. A fruit seller is laughing with a customer, steam rises from a food cart, and a small cat sleeps on a pile of warm bread.",
    "An empty classroom at sunset. Chalk dust floats in the golden light, a paper plane lies on the teacher's desk, and someone's forgotten lunchbox sits open on a back bench.",
    "A mountain lake so still it looks like glass. Snow peaks reflect in the water, a wooden boat drifts without a rower, and a single eagle circles high above.",
    "A busy railway platform in the rain. People hurry under umbrellas, a boy presses his face against a train window, and a vendor shouts about hot tea.",
    "An old library with ladders on wheels. Sunlight falls through tall windows onto dusty shelves, and a girl in the corner has fallen asleep with a book over her face.",
    "A desert at dawn. Long shadows stretch from the dunes, a camel caravan moves slowly toward the horizon, and the sky is painted pink and orange.",
    "A small fishing boat caught in a sudden storm. Waves splash over the sides, the fisherman grips the ropes tightly, and lightning brightens the dark clouds.",
    "A rooftop garden in the city. Potted plants line the walls, fairy lights are just turning on, and two friends share a pizza while the traffic hums below."
  ]
},
{
  id: "debate-club", emoji: "🎙️", title: "Debate Club",
  desc: "Pick a side on a fun topic and defend it with 3 strong reasons.",
  tip: "Strong reasons start with “because”. Example: “I agree because…” — then give a real-life example.",
  prompts: [
    { topic: "Should schools give homework every day?", sideA: "Yes — homework builds discipline and daily practice", sideB: "No — evenings should be for rest and family" },
    { topic: "Are mobile phones good for students?", sideA: "Yes — they are powerful tools for learning and safety", sideB: "No — they distract students and waste time" },
    { topic: "Should every child learn to cook?", sideA: "Yes — cooking is a basic life skill everyone needs", sideB: "No — children should focus on their studies" },
    { topic: "Is online learning better than classroom learning?", sideA: "Yes — it is flexible, comfortable, and saves travel time", sideB: "No — nothing beats a real teacher and classmates" },
    { topic: "Should school start later in the morning?", sideA: "Yes — young people need more sleep to learn well", sideB: "No — early starts teach discipline and routine" },
    { topic: "Are zoos good or cruel?", sideA: "Good — they protect endangered animals and teach us about them", sideB: "Cruel — animals belong free in the wild, not in cages" },
    { topic: "Should children get pocket money?", sideA: "Yes — it teaches children how to manage money", sideB: "No — it encourages wasteful spending habits" },
    { topic: "Is reading books better than watching videos?", sideA: "Yes — books build imagination, focus, and vocabulary", sideB: "No — videos are faster, clearer, and more fun" }
  ]
},
{
  id: "idiom-theater", emoji: "🎭", title: "Idiom Theater",
  desc: "Learn a colourful idiom, then write your own sentence using it.",
  tip: "Idioms are phrases with a hidden meaning — use the example as a model, then make the sentence your own.",
  prompts: [
    { idiom: "Break the ice", meaning: "To start a conversation in a friendly way", example: "He told a joke to break the ice at his new school." },
    { idiom: "Hit the books", meaning: "To study hard", example: "Exams are near, so I need to hit the books tonight." },
    { idiom: "Under the weather", meaning: "Feeling slightly sick", example: "She stayed home because she was feeling under the weather." },
    { idiom: "A piece of cake", meaning: "Something very easy", example: "The maths test was a piece of cake for her." },
    { idiom: "Spill the beans", meaning: "To reveal a secret", example: "Come on, spill the beans — what is the surprise?" },
    { idiom: "Once in a blue moon", meaning: "Very rarely", example: "We eat at a restaurant only once in a blue moon." },
    { idiom: "The ball is in your court", meaning: "It is your turn to take action", example: "I have done my part; the ball is in your court now." },
    { idiom: "Bite off more than you can chew", meaning: "To take on more than you can handle", example: "Do not bite off more than you can chew — finish one task first." },
    { idiom: "Let the cat out of the bag", meaning: "To reveal a secret by accident", example: "He let the cat out of the bag about the surprise party." },
    { idiom: "Rain on someone's parade", meaning: "To spoil someone's plans or joy", example: "I do not want to rain on your parade, but the match is cancelled." }
  ]
},
{
  id: "poetry-workshop", emoji: "🌸", title: "Poetry Workshop",
  desc: "Pick a theme and write your own 4-line poem.",
  tip: "Poems sound musical when line endings rhyme — use the hint pairs to get started, then find your own.",
  prompts: [
    { theme: "Rain", hint: "Try rhyming pairs like: rain / pain, sky / high" },
    { theme: "My Best Friend", hint: "Try rhyming pairs like: friend / end, true / you" },
    { theme: "The Sea", hint: "Try rhyming pairs like: deep / sleep, wave / brave" },
    { theme: "A Winter Morning", hint: "Try rhyming pairs like: cold / gold, white / light" },
    { theme: "My Dream", hint: "Try rhyming pairs like: fly / sky, star / far" },
    { theme: "The Old Tree", hint: "Try rhyming pairs like: tall / fall, green / serene" },
    { theme: "Festival Lights", hint: "Try rhyming pairs like: glow / flow, bright / night" },
    { theme: "Saying Goodbye", hint: "Try rhyming pairs like: away / day, tears / years" }
  ]
},
{
  id: "dialogue-builder", emoji: "💬", title: "Dialogue Builder",
  desc: "Read a situation, then write the full conversation between two characters.",
  tip: "Put each speaker on a new line with their name, like — Ali: Hello! Sara: Hi! — and let their personalities show.",
  prompts: [
    { situation: "Two friends meet after the summer holidays and share what they did.", charA: "Ali", charB: "Sara" },
    { situation: "A customer returns a torn shirt to a shopkeeper.", charA: "Customer", charB: "Shopkeeper" },
    { situation: "A student asks the teacher for one more day to submit homework.", charA: "Student", charB: "Teacher" },
    { situation: "Two siblings argue about whose turn it is to wash the dishes.", charA: "Brother", charB: "Sister" },
    { situation: "A tourist asks a local for directions to the museum.", charA: "Tourist", charB: "Local guide" },
    { situation: "A doctor calmly explains to a nervous patient that the injection will not hurt.", charA: "Doctor", charB: "Patient" },
    { situation: "Two teammates plan their strategy before the final cricket match.", charA: "Captain", charB: "Teammate" },
    { situation: "A child tries to convince a parent to adopt a stray kitten.", charA: "Child", charB: "Parent" }
  ]
}
];

export function activityOf(id) {
  return CREATIVE_ACTIVITIES.find(function (a) { return a.id === id; }) || null;
}
