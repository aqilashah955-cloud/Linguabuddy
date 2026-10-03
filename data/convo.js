// LinguaBuddy — Conversation practice role-play scripts (Part 2).
// Curated multi-turn scripts. Each role-play: id, title, emoji, setting,
// goal, and a node tree. Nodes: { p: partner line, b: [[keywords, nextId]],
// f: fallback node id, end: true }. Matching is keyword-based (normalized,
// substring). Fallbacks keep the conversation supportive, never stuck.

export const DATA_VERSION_CONVO = "1.0.0";

export const ROLEPLAYS = [
{
  id: "greetings", title: "Meeting Someone New", emoji: "👋",
  setting: "You meet a new student at school.",
  goal: "Greet politely, introduce yourself, and ask friendly questions.",
  nodes: {
    start: { p: "Hi! I am Sara. I just joined this school. What is your name?",
      b: [[["my name is", "i am", "i'm"], "n1"]], f: "f1" },
    f1: { p: "Nice to meet you! Tell me your name — for example, 'My name is Ali.'",
      b: [[["my name is", "i am", "i'm", "ali", "ahmed", "fatima"], "n1"]], f: "n1" },
    n1: { p: "Great! Which class are you in?",
      b: [[["class", "grade", "5", "6", "7", "8", "five", "six", "seven", "eight"], "n2"]], f: "f2" },
    f2: { p: "Tell me your class — for example, 'I am in class 6.'",
      b: [[["class", "6", "7", "8", "six"], "n2"]], f: "n2" },
    n2: { p: "Wonderful. What is your favourite subject?",
      b: [[["english", "math", "science", "urdu", "favourite", "favorite"], "n3"]], f: "f3" },
    f3: { p: "Everyone has a favourite! Mine is English. What is yours?",
      b: [[["english", "math", "science", "urdu"], "n3"]], f: "n3" },
    n3: { p: "Lovely chatting with you! Would you like to be friends?",
      b: [[["yes", "sure", "ok", "like"], "end1"], [["no", "not"], "end2"]], f: "end1" },
    end1: { p: "Yay! See you in class. Have a great day!", end: true },
    end2: { p: "No problem at all. Maybe we will talk again soon. Bye!", end: true }
  }
},
{
  id: "classroom", title: "Asking the Teacher", emoji: "🏫",
  setting: "You are in class and did not understand the homework.",
  goal: "Ask politely for help and explain what confuses you.",
  nodes: {
    start: { p: "Good morning, class! Do you all understand today's homework?",
      b: [[["no", "not", "don't", "confuse", "understand"], "n1"], [["yes"], "n1b"]], f: "f1" },
    f1: { p: "Answer honestly — for example, 'No, I did not understand question 3.'",
      b: [[["no", "question", "understand", "confuse"], "n1"]], f: "n1" },
    n1b: { p: "Excellent! Can you help a classmate who is confused? What would you tell them?",
      b: [[["help", "explain", "show", "tell"], "end1"]], f: "end1" },
    n1: { p: "Thank you for telling me. Which part confuses you the most?",
      b: [[["tense", "verb", "grammar", "vocabulary", "word", "sentence", "question"], "n2"]], f: "f2" },
    f2: { p: "Name the topic — for example, 'The past tense confuses me.'",
      b: [[["tense", "verb", "grammar", "word"], "n2"]], f: "n2" },
    n2: { p: "Good — now I know how to help. I will explain it again slowly after class. Is that okay?",
      b: [[["yes", "ok", "sure", "thank"], "end1"], [["no"], "end2"]], f: "end1" },
    end1: { p: "Perfect. Remember: asking questions is how good learners grow!", end: true },
    end2: { p: "Alright. My door is open whenever you are ready. Keep trying!", end: true }
  }
},
{
  id: "shopping", title: "At the Shop", emoji: "🛒",
  setting: "You are buying fruit at a market shop.",
  goal: "Ask prices, compare, and complete a polite purchase.",
  nodes: {
    start: { p: "Assalam-o-Alaikum! Welcome to my fruit shop. What would you like?",
      b: [[["apple", "banana", "orange", "mango", "fruit", "grapes"], "n1"]], f: "f1" },
    f1: { p: "We have apples, bananas, oranges and mangoes. Which fruit do you want?",
      b: [[["apple", "banana", "orange", "mango", "grapes"], "n1"]], f: "n1" },
    n1: { p: "Good choice! How many kilos do you want?",
      b: [[["one", "two", "1", "2", "kilo", "kg", "half"], "n2"]], f: "f2" },
    f2: { p: "Tell me the amount — for example, 'Two kilos, please.'",
      b: [[["kilo", "kg", "one", "two", "1", "2"], "n2"]], f: "n2" },
    n2: { p: "That will be 400 rupees. Would you like a bag with that?",
      b: [[["yes", "please", "sure"], "n3"], [["no"], "n3b"]], f: "n3" },
    n3b: { p: "No problem! Here is your fruit. That is 400 rupees, please.",
      b: [[["thank", "here", "400", "take"], "end1"]], f: "end1" },
    n3: { p: "Here you are — fresh fruit in a bag. Anything else today?",
      b: [[["no", "that's all", "that is all", "nothing"], "end1"], [["yes"], "end2"]], f: "end1" },
    end1: { p: "Shukriya! Come again soon!", end: true },
    end2: { p: "Take your time and look around. Just call me when you are ready!", end: true }
  }
},
{
  id: "travel", title: "At the Bus Station", emoji: "🚌",
  setting: "You need to catch a bus to Lahore.",
  goal: "Ask about times, platforms, and tickets politely.",
  nodes: {
    start: { p: "Hello! Welcome to City Bus Station. Where are you travelling today?",
      b: [[["lahore", "karachi", "islamabad", "peshawar", "multan"], "n1"]], f: "f1" },
    f1: { p: "Which city? For example, 'I want to go to Lahore.'",
      b: [[["lahore", "karachi", "islamabad", "go"], "n1"]], f: "n1" },
    n1: { p: "Lahore — great! The next bus leaves at 3 o'clock from platform 4. Would you like a ticket?",
      b: [[["yes", "ticket", "please", "one"], "n2"], [["time", "when", "platform"], "n1b"]], f: "n2" },
    n1b: { p: "It leaves at 3 o'clock, platform 4. Shall I make you a ticket?",
      b: [[["yes", "please", "ticket"], "n2"]], f: "n2" },
    n2: { p: "One ticket to Lahore — 850 rupees. Window or aisle seat?",
      b: [[["window"], "end1"], [["aisle"], "end2"]], f: "end1" },
    end1: { p: "Window seat it is! Have a safe and pleasant journey!", end: true },
    end2: { p: "Aisle seat booked. Have a safe and pleasant journey!", end: true }
  }
},
{
  id: "interview", title: "School Interview", emoji: "🎤",
  setting: "You are being interviewed for the school debate team.",
  goal: "Answer clearly, give reasons, and stay confident.",
  nodes: {
    start: { p: "Welcome! Please introduce yourself in two or three sentences.",
      b: [[["my name", "i am", "i'm", "class", "school"], "n1"]], f: "f1" },
    f1: { p: "Start with your name and class — for example, 'My name is Ali. I am in class 7.'",
      b: [[["my name", "i am", "class"], "n1"]], f: "n1" },
    n1: { p: "Nice. Why do you want to join the debate team?",
      b: [[["speak", "confident", "learn", "like", "love", "enjoy", "interesting"], "n2"]], f: "f2" },
    f2: { p: "Give one reason — for example, 'I want to become confident.'",
      b: [[["confident", "speak", "learn", "want"], "n2"]], f: "n2" },
    n2: { p: "Good reason. Tell me about a time you spoke in front of people.",
      b: [[["class", "stage", "presentation", "once", "never", "morning", "assembly"], "n3"]], f: "f3" },
    f3: { p: "Any example is fine — a class presentation, morning assembly, anything.",
      b: [[["class", "assembly", "presentation", "spoke"], "n3"]], f: "n3" },
    n3: { p: "Thank you! Final question: what will you do if you feel nervous?",
      b: [[["breathe", "deep", "practice", "calm", "prepare"], "end1"]], f: "end1" },
    end1: { p: "Excellent answers — confident and honest. We will announce results tomorrow. Well done!", end: true }
  }
},
{
  id: "introductions", title: "Introducing Your Family", emoji: "👨‍👩‍👧",
  setting: "A guest asks about your family.",
  goal: "Describe family members and what they do.",
  nodes: {
    start: { p: "Your family sounds lovely! How many people are in your family?",
      b: [[["four", "five", "six", "three", "4", "5", "6", "members", "people"], "n1"]], f: "f1" },
    f1: { p: "Count them — for example, 'There are five people in my family.'",
      b: [[["five", "four", "six", "5", "4", "people"], "n1"]], f: "n1" },
    n1: { p: "Wonderful. What does your father do?",
      b: [[["teacher", "doctor", "farmer", "shop", "driver", "engineer", "work", "job", "business"], "n2"]], f: "f2" },
    f2: { p: "Tell me his work — for example, 'He is a teacher.'",
      b: [[["teacher", "doctor", "farmer", "is a", "works"], "n2"]], f: "n2" },
    n2: { p: "And your mother?",
      b: [[["teacher", "housewife", "doctor", "home", "nurse", "is a", "works"], "n3"]], f: "f3" },
    f3: { p: "For example: 'She is a teacher' or 'She looks after our home.'",
      b: [[["teacher", "home", "housewife", "she is"], "n3"]], f: "n3" },
    n3: { p: "Lovely family! Who do you spend the most time with?",
      b: [[["mother", "father", "brother", "sister", "friend", "grandmother"], "end1"]], f: "end1" },
    end1: { p: "Family time is precious. Thank you for sharing — you described them beautifully!", end: true }
  }
},
{
  id: "storytelling", title: "Tell Me a Story", emoji: "📖",
  setting: "Tell your partner a short story about a brave act.",
  goal: "Narrate past events in order with feeling.",
  nodes: {
    start: { p: "I love stories! Tell me about a time someone was brave. Who was it?",
      b: [[["my", "father", "mother", "friend", "brother", "i", "boy", "girl", "man"], "n1"]], f: "f1" },
    f1: { p: "Start with who — for example, 'My uncle was very brave.'",
      b: [[["uncle", "father", "friend", "i", "he", "she"], "n1"]], f: "n1" },
    n1: { p: "Good start! What happened first?",
      b: [[["once", "one day", "then", "was", "were", "happened"], "n2"]], f: "f2" },
    f2: { p: "Use the past tense — for example, 'One day he saw a fire.'",
      b: [[["one day", "once", "saw", "was"], "n2"]], f: "n2" },
    n2: { p: "Exciting! What did they do next?",
      b: [[["then", "after", "next", "ran", "helped", "called", "saved"], "n3"]], f: "f3" },
    f3: { p: "Continue with 'then' — for example, 'Then he called for help.'",
      b: [[["then", "helped", "called", "ran"], "n3"]], f: "n3" },
    n3: { p: "And how did it end? How did everyone feel?",
      b: [[["happy", "safe", "proud", "end", "finally", "thank"], "end1"]], f: "end1" },
    end1: { p: "What a wonderful story — a clear beginning, middle and end. You are a natural storyteller!", end: true }
  }
}
];
