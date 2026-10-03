// LinguaBuddy — Writing Lab prompts (Part 2).
// Each prompt: id, level (sentence → paragraph → text), kind, title,
// instructions, minWords target, keywords the writing should include,
// and tips. The Writing Lab NEVER rewrites the student's text — it
// highlights issues by category, explains, and gives hints.

export const DATA_VERSION_WRITING = "1.0.0";

export const WRITING_PROMPTS = [
{
  id: "w1", level: "Sentence", kind: "sentence",
  title: "Three Sentences About Your Best Friend",
  prompt: "Write three complete sentences about your best friend. Say who they are, what they look like, and why you like them.",
  minWords: 20, keywords: ["friend"],
  tips: ["Start every sentence with a capital letter.", "End every sentence with a full stop.", "Use 'is' with he/she: 'She is kind.'"]
},
{
  id: "w2", level: "Sentence", kind: "sentence",
  title: "My Daily Routine in Five Sentences",
  prompt: "Write five sentences about your daily routine. Use the present simple tense (I wake up, I eat, I go…).",
  minWords: 35, keywords: ["morning", "school"],
  tips: ["Present simple for routines: 'I brush my teeth.'", "Add time words: 'first', 'then', 'after that'."]
},
{
  id: "w3", level: "Paragraph", kind: "descriptive",
  title: "Describe Your Classroom",
  prompt: "Write one paragraph (5–7 sentences) describing your classroom. Mention the size, the furniture, the walls, and how it feels to sit there.",
  minWords: 60, keywords: ["classroom", "desk", "teacher"],
  tips: ["Use adjectives: big, bright, clean, noisy.", "One paragraph = one main idea.", "Present tense for descriptions."]
},
{
  id: "w4", level: "Paragraph", kind: "narrative",
  title: "A Memorable Day",
  prompt: "Write one paragraph about the most memorable day of your life. What happened? Where were you? How did you feel?",
  minWords: 70, keywords: ["day", "happy"],
  tips: ["Past tense for finished events: 'We went…', 'I felt…'.", "Order events with first, then, finally."]
},
{
  id: "w5", level: "Paragraph", kind: "letter",
  title: "Letter to a Friend",
  prompt: "Write a short letter to a friend who moved to another city. Ask how they are, share your news, and invite them to visit.",
  minWords: 80, keywords: ["dear", "friend", "visit"],
  tips: ["Start with 'Dear ___,'.", "End with 'Your friend,' and your name.", "Letters use a friendly tone."]
},
{
  id: "w6", level: "Text", kind: "email",
  title: "Email to Your Teacher",
  prompt: "Write a polite email to your teacher asking for one extra day to finish your science project. Explain the reason briefly.",
  minWords: 70, keywords: ["respected", "kindly", "project"],
  tips: ["Subject line first, e.g. 'Request for one extra day'.", "Polite words: 'kindly', 'please', 'I would be grateful'.", "Keep it short and respectful."]
},
{
  id: "w7", level: "Text", kind: "story",
  title: "Finish the Story",
  prompt: "One rainy evening, Ali found a small wooden box under the old banyan tree. Inside was a folded letter… Continue the story in 8–10 sentences. What did the letter say? What did Ali do?",
  minWords: 100, keywords: ["box", "letter"],
  tips: ["Past tense for stories.", "Build excitement: use 'suddenly', 'just then'.", "Give your story an ending."]
},
{
  id: "w8", level: "Text", kind: "descriptive",
  title: "My Village / My City",
  prompt: "Write two paragraphs describing your village or city. Paragraph 1: what it looks like. Paragraph 2: the people and daily life.",
  minWords: 120, keywords: ["people", "market"],
  tips: ["Two paragraphs = two main ideas.", "Use adjectives and the senses: sights, sounds, smells."]
},
{
  id: "w9", level: "Text", kind: "narrative",
  title: "The Day I Helped Someone",
  prompt: "Write a narrative (10–12 sentences) about a day you helped someone. What was the problem? What did you do? How did it end?",
  minWords: 130, keywords: ["helped"],
  tips: ["Show feelings: 'I felt proud when…'.", "Use dialogue if you like: She said, 'Thank you!'."]
},
{
  id: "w10", level: "Text", kind: "essay",
  title: "Why Reading Books Is Important",
  prompt: "Write a short essay (3 paragraphs): introduction, two reasons with examples, and a conclusion.",
  minWords: 150, keywords: ["reading", "books", "important"],
  tips: ["Introduction: state your opinion.", "Each reason gets its own paragraph.", "Conclusion: repeat your opinion in new words."]
}
];
