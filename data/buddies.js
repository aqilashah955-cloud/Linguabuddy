// LinguaBuddy — 💭 AI Buddies data (v1.0.0).
// Curated conversation content for the offline buddy engine.
// Characters, intents with per-character replies, topics, error patterns,
// smalltalk fallbacks, quick replies, and a new-words list.

export const DATA_VERSION_BUDDIES = "1.0.0";

/* ================= characters ================= */
export const CHARACTERS = [
  {
    id: "lingoo", name: "Lingoo", emoji: "🦉", tagline: "Your patient owl tutor", ageGroup: "All ages",
    voice: ["patient", "encouraging", "clear"],
    opener: "Hello! I'm Lingoo 🦉 Your English buddy. What's your name?",
    systemPrompt: "You are Lingoo, a patient and encouraging English tutor owl for learners of all ages in Pakistan. Keep replies short (1-3 sentences), ask follow-up questions, gently correct one grammar mistake at a time, and celebrate effort. Never write full essays for the learner — offer structure help instead."
  },
  {
    id: "maya", name: "Maya", emoji: "😎", tagline: "Your casual conversation friend", ageGroup: "Teens & adults",
    voice: ["casual", "fun", "friendly"],
    opener: "Heyy! I'm Maya 😎 Let's just chat like friends. So... what do you do for fun?",
    systemPrompt: "You are Maya, a casual friendly conversation partner for teens and adults learning English. Chat naturally about hobbies, travel, food, movies, music. Keep it fun and relaxed, use simple everyday English, occasionally teach a slang word or idiom with its meaning."
  },
  {
    id: "zara", name: "Coach Zara", emoji: "🎓", tagline: "Your exam coach", ageGroup: "Teens & adults",
    voice: ["motivating", "structured", "precise"],
    opener: "Hello, champion! I'm Coach Zara 🎓 Training for IELTS or Duolingo? Tell me your target band!",
    systemPrompt: "You are Coach Zara, an IELTS and Duolingo English Test coach. Give structured exam tips, band-focused feedback, and short practice drills. Be motivating and precise. Scores you mention are practice estimates, never official."
  },
  {
    id: "pip", name: "Pip", emoji: "🐣", tagline: "Your little playmate", ageGroup: "Kids 5-8",
    voice: ["playful", "simple", "sweet"],
    opener: "Hi hi! I'm Pip! 🐣🐥 Let's play and talk! What is your favourite animal?",
    systemPrompt: "You are Pip, a playful chick friend for children aged 5-8 learning English. Use VERY simple short sentences, lots of emoji, and a cheerful tone. Never correct harshly — only gently recast (repeat their sentence correctly with praise). Keep every reply under 25 words."
  },
  {
    id: "bennett", name: "Mr. Bennett", emoji: "🤵", tagline: "Your business English mentor", ageGroup: "Professionals",
    voice: ["formal", "polished", "respectful"],
    opener: "Good day. I am Mr. Bennett 🤵 I help professionals master business English. Shall we practise small talk, or perhaps interview skills?",
    systemPrompt: "You are Mr. Bennett, a formal business English mentor for professionals. Use polished, professional English. Teach formal vocabulary, meeting phrases, email etiquette and interview skills. Correct gently with brief explanations."
  }
];

export function characterById(id) {
  return CHARACTERS.find(function (c) { return c.id === id; }) || CHARACTERS[0];
}

/* ================= intents ================= */
// match: array of lowercase substrings or RegExp (tested against lowercased text).
// replies: per-character arrays. {name} and {topic} are filled at reply time.
export const INTENTS = [
  {
    id: "bye",
    match: ["bye", "goodbye", "see you", "good night", "goodnight", "take care", "got to go", "gotta go", "allah hafiz", "khuda hafiz"],
    replies: {
      lingoo: ["Goodbye, {name}! 🌟 You did great today. Come back soon!", "Bye bye! Keep practising a little every day. 🦉"],
      maya: ["Byee! This was fun 😎 Catch you later!", "Later! Go enjoy your day! ✌️"],
      zara: ["Well done today, champion! 🎓 Rest well — consistency wins.", "Goodbye! Remember: 20 minutes of practice daily beats 3 hours once a week."],
      pip: ["Bye bye! 🐣💛 You are a star!", "See you soon! Pip will miss you! 🐥"],
      bennett: ["Goodbye. It was a pleasure speaking with you. 🤵", "Until next time. Keep refining your professional English."]
    }
  },
  {
    id: "thanks",
    match: ["thank", "thx", "shukria", "shukriya", "thanks a lot", "thankyou"],
    replies: {
      lingoo: ["You're very welcome, {name}! 🌟", "Anytime! Helping you learn makes me happy. 🦉"],
      maya: ["No worries at all! 😎", "Anytime, friend!"],
      zara: ["You're welcome! That's what coaches are for. 🎓", "My pleasure. Now let's keep that momentum going!"],
      pip: ["You are welcome! 🐣💛", "Yay! Pip is happy! 🌈"],
      bennett: ["You're most welcome. 🤵", "It was my pleasure entirely."]
    }
  },
  {
    id: "joke",
    match: ["joke", "funny", "make me laugh", "latifa"],
    replies: {
      lingoo: ["Why did the student bring a ladder to class? Because they wanted to go to HIGH school! 😄", "What do you call a fish with no eyes? A fsh! 🐟 Get it — no 'i'!"],
      maya: ["Why don't scientists trust atoms? Because they make up everything! 😂", "I told my suitcase there'd be no vacation this year... now I'm dealing with emotional baggage! 😎"],
      zara: ["Why did the IELTS candidate bring a pencil to the speaking test? Just in case they needed to draw a conclusion! 🎓😄", "What is an exam's favourite music? Test... tunes! Keep smiling, stress lowers your band!"],
      pip: ["Why did the chicken cross the road? To say hello to YOU! 🐣", "What do you call a happy cow? Moo-dy! 🐮😄", "Knock knock! Who's there? Banana! 🍌"],
      bennett: ["A clean one for the office: I asked my colleague for a raise, and he said the budget was... under the weather. 🤵😄", "Why did the manager bring a ladder to the meeting? To take the discussion to the next level!"]
    }
  },
  {
    id: "help",
    match: ["help", "i need help", "can you help", "madad"],
    replies: {
      lingoo: ["Of course, {name}! 🌟 Tell me what you want to practise — speaking, grammar, or vocabulary?", "I'm here to help! We can chat, I can teach you new words, or we can play with sentences. What sounds good?"],
      maya: ["Got you! 😎 What do you want to talk about or practise?", "Sure thing! Pick a topic — hobbies, movies, travel — and let's go!"],
      zara: ["Absolutely. Tell me your goal: IELTS band, Duolingo score, or just better English? I'll make a plan. 🎓", "Let's diagnose first: which part feels hardest — reading, writing, listening, or speaking?"],
      pip: ["Pip helps! 🐣 Do you want animals, colours, or a story?", "I am here! 🌈 Let's learn something fun together!"],
      bennett: ["Certainly. Are we working on emails, interviews, meetings, or presentations today? 🤵", "Of course. Tell me your professional goal and I shall guide you."]
    }
  },
  {
    id: "confused",
    match: ["i don't understand", "i dont understand", "dont understand", "confusing", "confused", "what do you mean", "samajh nahi", "samajh nahin"],
    replies: {
      lingoo: ["No problem at all! 🌟 Let me say it more simply: just tell me anything about your day, and I'll keep the chat going.", "That's okay! Learning takes time. Try answering with one short sentence — like \"I like cricket.\""],
      maya: ["No stress! 😎 Let's restart easy: what did you do today?", "Haha all good! Just say anything — even one word works!"],
      zara: ["Perfectly fine — confusion is part of learning. 🎓 Let's try a tiny drill: complete this — \"My favourite food is ___.\"", "No worries. Simpler question: what is one English word you learned this week?"],
      pip: ["It's okay! 🐣 Pip will be super simple! Do you like cats? 🐱", "No worry! 🌈 Say: I like apples! 🍎"],
      bennett: ["Quite alright. Let us simplify: how was your day at work, in one sentence? 🤵", "No concern at all. Shall we practise something concrete — for example, introducing yourself?"]
    }
  },
  {
    id: "correctionThanks",
    match: ["thanks for correct", "thank you for the correction", "thanks for the correction", "thanks for correcting"],
    replies: {
      lingoo: ["You're welcome! Noticing corrections is how you improve. 🌟", "My pleasure! Every correction makes your English stronger."],
      maya: ["Anytime! You're levelling up fast 😎", "Of course! That's what friends are for!"],
      zara: ["Exactly the right attitude — top scorers love feedback. 🎓", "You're welcome. Corrections today, band 7 tomorrow!"],
      pip: ["Yay! You are so smart! 🐣🌟", "Pip is proud of you! 💛"],
      bennett: ["You're welcome. Attention to detail is a professional strength. 🤵", "My pleasure. Precision in language is precision in business."]
    }
  },
  {
    id: "nameAsk",
    match: ["your name", "who are you", "what is your name", "tumhara naam", "aap ka naam"],
    replies: {
      lingoo: ["I'm Lingoo, your owl tutor! 🦉 And you are...?", "My name is Lingoo! I love helping friends learn English. What's your name?"],
      maya: ["I'm Maya! 😎 Your chat buddy. What's your name?", "Maya's the name, chatting's the game! 😄 You?"],
      zara: ["I'm Coach Zara 🎓 — your exam trainer. And you are?", "Coach Zara, at your service! What's your name, champion?"],
      pip: ["I'm Pip! 🐣🐥 What is YOUR name?", "Pip! Pip! 🐥 Tell me your name!"],
      bennett: ["I am Mr. Bennett 🤵 — mentor in business English. May I know your name?", "Mr. Bennett, pleased to meet you. And you are?"]
    }
  },
  {
    id: "userNameTell",
    match: [], // detected only via the name-capture special case in detectIntent (stoplist-aware)
    nameCapture: true,
    replies: {
      lingoo: ["What a lovely name, {name}! 🌟 Great to meet you! What do you like doing?", "Nice to meet you, {name}! 🦉 Tell me — what's your favourite hobby?"],
      maya: ["Awesome name, {name}! 😎 So tell me, what do you do for fun?", "Hey {name}! Love it! What kind of movies do you like?"],
      zara: ["Wonderful to meet you, {name}! 🎓 What's your English goal?", "Hello {name}! A pleasure. Are you preparing for a test, or learning for work?"],
      pip: ["Hello {name}! 🐣🌈 Pip likes you! Do you like ice cream? 🍦", "Yay {name}! 🐥 Let's be friends! What is your favourite colour?"],
      bennett: ["A pleasure to meet you, {name}. 🤵 What line of work are you in?", "Delighted, {name}. Tell me — what brings you to business English?"]
    }
  },
  {
    id: "greeting",
    match: ["hello", "hi", "hey", "salam", "assalam", "aoa", "good morning", "good afternoon", "good evening", "adab"],
    replies: {
      lingoo: ["Hello, {name}! 🦉 Lovely to see you! How are you today?", "Hi hi! 🌟 Ready for some English fun? How are you?", "Hey {name}! Great to see you! What's new?"],
      maya: ["Heyyy {name}! 😎 What's up?", "Hiii! How's your day going?", "Yo {name}! Good to see you! What's new?"],
      zara: ["Hello {name}! 🎓 Ready to train today?", "Good day! How is your exam preparation going?", "Hi {name}! Let's make today count — what shall we practise?"],
      pip: ["Hi hi! 🐣🌈 Pip is so happy!", "Helloooo! 🐥💛 Let's play!", "Hey {name}! 🐣 Do you want a story?"],
      bennett: ["Good day, {name}. 🤵 How are you?", "Hello. I trust you're well today?", "Good to see you, {name}. How may I assist your English today?"]
    }
  },
  {
    id: "howru",
    match: ["how are you", "how r u", "how are u", "how's it going", "hows it going", "how do you do", "kia haal", "kya haal"],
    replies: {
      lingoo: ["I'm wonderful, thank you! 🦉 Especially when I chat with you! How are YOU?", "Doing great! 🌟 Every chat with you makes my day. How about you?", "I'm fantastic! Ready to help you learn. How are you feeling today?"],
      maya: ["I'm awesome! 😎 Just chilling and chatting. You?", "Pretty great! Had my virtual coffee already ☕ How about you?", "All good here! What's happening with you?"],
      zara: ["Excellent — and even better when my students show up! 🎓 How is your preparation?", "I'm well, thank you. More importantly — how is YOUR English journey going?", "Motivated and ready! How are you feeling about your goals today?"],
      pip: ["Pip is super happy! 🐣🌈 Are YOU happy?", "I am great! 🐥💛 How are you?", "Yay! I am wonderful! 🌟 And you?"],
      bennett: ["I am very well, thank you for asking. 🤵 And yourself?", "Quite well, thank you. How are you today?", "Excellent, thank you. I hope your day is productive so far."]
    }
  },
  {
    id: "age",
    match: ["how old are you", "your age", "what is your age"],
    replies: {
      lingoo: ["I'm as old as all the books in the library! 🦉📚 How old are you?", "Age is just a number — but I'm timeless! How about you?"],
      maya: ["Haha, a lady never tells! 😎 I'm forever young. You?", "Old enough to give great advice, young enough to be fun! How old are you?"],
      zara: ["Old enough to have coached hundreds of students to band 7+! 🎓 How old are you?", "Let's say... experienced! 😄 What about you?"],
      pip: ["Pip is a baby chick! 🐣🐥 How old are YOU?", "I am little! Like you! 🌈"],
      bennett: ["A gentleman doesn't disclose his age, but let's say distinguished. 🤵 And you?", "Old enough to know the value of good English! Yourself?"]
    }
  },
  {
    id: "hobbies",
    match: ["hobby", "hobbies", "free time", "pass time", "do for fun", "pastime"],
    replies: {
      lingoo: ["Hobbies are wonderful! 🌟 I love reading and teaching. What do YOU love doing, {name}?", "Great topic! My hobby is collecting new English words! What's yours?", "Tell me about your hobby — and I'll teach you English words for it! What do you enjoy?"],
      maya: ["Ooh I love this topic! 😎 I'm into music and weekend trips. What about you?", "Hobbies make life fun! I like photography 📸 What's your thing?", "Mine? Dancing badly and singing loudly! 😂 What do YOU do for fun?"],
      zara: ["Excellent — hobbies give us great speaking practice! 🎓 Describe your hobby in 3 sentences. I'll give feedback!", "Good! For IELTS Part 1, hobby questions are very common. Tell me about yours in detail!", "Hobbies reveal personality — examiners love them. What is yours, and why?"],
      pip: ["Pip loves playing! 🐣⚽ Do YOU like playing?", "Yay hobbies! 🌈 I like singing! La la la! 🎵 What do you like?", "Fun fun! 🐥 Do you like drawing? 🎨"],
      bennett: ["Splendid topic for small talk. 🤵 I enjoy reading and chess. What are your interests, {name}?", "Interests make excellent conversation. I favour literature and long walks. Yourself?"]
    }
  },
  {
    id: "family",
    match: ["family", "mother", "father", "mom", "dad", "brother", "sister", "parents", "ami", "abu", "walid"],
    replies: {
      lingoo: ["Family is precious! 🌟 Tell me about your family, {name}.", "I'd love to hear about your family! Who do you live with?"],
      maya: ["Aww, family! 😎 I have a little brother who steals my snacks! Tell me about yours!", "Family time is the best! Who's in your family?"],
      zara: ["Good topic — 'describe a family member' is a classic IELTS cue card! 🎓 Tell me about someone in your family.", "Family questions appear in every speaking test. Describe one family member in detail!"],
      pip: ["Pip loves family! 🐣💛 Do you have brothers or sisters?", "Yay! 🌈 Tell Pip about your mama!"],
      bennett: ["Family is the foundation of a balanced life. 🤵 Tell me a little about yours, if you don't mind.", "How lovely. Do you have a large family, {name}?"]
    }
  },
  {
    id: "food",
    match: ["food", "eat", "biryani", "pizza", "hungry", "breakfast", "lunch", "dinner", "khana", "cooking", "recipe"],
    replies: {
      lingoo: ["Yum! 🍽️ My favourite topic! What's your favourite food, {name}?", "Food brings people together! 🌟 Tell me — what did you eat today?", "Ooh! I love learning food words! What's the most delicious dish you know?"],
      maya: ["FOOD! My favourite subject 😎🍕 I'm craving pizza right now. What's your comfort food?", "Yesss! I could talk about biryani ALL day! 🍛 What's your number one dish?", "Foodie alert! 🚨 What's the best thing you've eaten this week?"],
      zara: ["Food is a top IELTS topic! 🎓 Describe your favourite dish — its taste, how it's made, and why you love it.", "Excellent practice material! For Part 2: 'Describe a traditional meal in your country.' Give it a try!", "Let's build vocabulary: give me 5 adjectives to describe your favourite food!"],
      pip: ["Yummy yummy! 🐣🍎 Pip loves apples! What do YOU like?", "Nom nom! 🐥🍌 Bananas are the best! Your favourite food?", "Ice cream! 🍦🌈 Do you like ice cream?"],
      bennett: ["A refined topic — dining etiquette matters in business. 🤵 What cuisine do you prefer, {name}?", "Indeed, food is universal small talk. Do you enjoy cooking, or dining out?"]
    }
  },
  {
    id: "travel",
    match: ["travel", "travelling", "trip", "vacation", "holiday", "visit", "tour", "journey", "murree", "naran", "abroad"],
    replies: {
      lingoo: ["Wanderlust! ✈️🌟 Where would you love to travel, {name}?", "Travelling teaches so much! Tell me about a trip you enjoyed.", "If you could visit anywhere in the world, where would you go?"],
      maya: ["TRAVEL! My dream! 😎✈️ I want to see northern Pakistan — those mountains! Where have you been?", "Ooh, let's plan a dream trip together! 🗺️ Beach or mountains?", "Best trip ever? Mine was... actually I need to travel more! 😂 What's yours?"],
      zara: ["Travel is a goldmine for IELTS! 🎓 Describe a memorable journey — where, when, who with, and why it mattered.", "Perfect Part 2 practice: 'Describe a place you would like to visit.' Go!", "Let's learn travel vocabulary: give me 3 words for describing beautiful places!"],
      pip: ["Wheee! 🐣✈️ Pip wants to fly! Where do YOU want to go?", "Travel! 🌈🚗 Do you like the mountains? 🏔️", "Zoom zoom! 🐥 Let's go on an adventure!"],
      bennett: ["Travel broadens the mind — and the network. 🤵 Do you travel for business, {name}?", "Excellent. Have you attended any conferences abroad?"]
    }
  }
];

/* ---- more intents (appended) ---- */
INTENTS.push(
  {
    id: "work",
    match: ["work", "job", "office", "boss", "colleague", "salary", "naukri", "business", "career"],
    replies: {
      lingoo: ["Work talk! 💼 What do you do, {name}?", "Tell me about your job — I'll teach you useful work words!", "Work is a great topic! What does a normal day look like for you?"],
      maya: ["Work work work 😎 What do you do? I 'work' as a professional chatter!", "Ooh, what's your job like? Fun colleagues?", "9-to-5 or something cooler? Tell me!"],
      zara: ["Work experience is great IELTS material! 🎓 Describe your job — duties, challenges, what you enjoy.", "For Part 1: 'Do you work or study?' — answer in 3-4 sentences!", "Let's practise: explain your job to a 10-year-old. Simple words, clear ideas!"],
      pip: ["Work? 🐣 Pip's work is playing! 😄 What do grown-ups do?", "Do you like your work? 🌈"],
      bennett: ["A subject close to my heart. 🤵 What is your role, {name}?", "Indeed. Tell me about your industry — I may have useful vocabulary for it."]
    }
  },
  {
    id: "school",
    match: ["school", "college", "university", "study", "studying", "teacher", "class", "exam", "test", "homework", "parhai", "madrasa"],
    replies: {
      lingoo: ["School days! 📚 What do you study, {name}?", "Learning is my favourite thing! What's your favourite subject?", "Tell me about your school — I want to hear everything!"],
      maya: ["School/uni life! 😎 Best days, right? What are you studying?", "Ooh, favourite subject? Mine was... lunch break! 😂 Yours?", "Exams coming up? You've got this! 💪"],
      zara: ["Perfect — you're already training! 🎓 Which exam are you preparing for?", "Study talk! Tell me your routine — I'll help you optimise it.", "For IELTS: 'Do you prefer studying alone or with others?' — answer me!"],
      pip: ["School! 🐣📚 Pip loves school! Do YOU?", "Yay! 🌈 What did you learn today?", "ABC! 123! 🎵 Do you like rhymes?"],
      bennett: ["Education is the finest investment. 🤵 What did you study, {name}?", "Quite right to prioritise learning. Are you pursuing any certifications?"]
    }
  },
  {
    id: "sports",
    match: ["sport", "cricket", "football", "hockey", "game", "match", "play", "babar azam", "psl", "exercise", "gym", "khel"],
    replies: {
      lingoo: ["Sports! ⚽ I love the energy! Which sport do you play or watch, {name}?", "Game on! 🏏 Tell me your favourite team!", "Sports teach teamwork — and great English words! What's your favourite sport?"],
      maya: ["SPORTS! 😎 I'm team cricket all the way! 🏏 Babar Azam fan?", "Football or cricket? Choose wisely! 😂", "Do you play anything? I'm terrible at sports but great at cheering! 📣"],
      zara: ["Sports = excellent speaking topic! 🎓 'Describe a sport you enjoy' — give me 4-5 sentences!", "For Part 3: 'Do you think children should play more sports?' — argue both sides!", "Vocabulary challenge: 5 words related to cricket!"],
      pip: ["Yay sports! 🐣⚽ Pip loves running! Do you?", "Ball! 🏀🌈 Catch! Do you like games?", "Wheee! 🐥 Let's play!"],
      bennett: ["Sport is splendid for networking — golf courses close deals! 🤵 Do you play any, {name}?", "Indeed. Cricket seems to unite the entire nation, doesn't it?"]
    }
  },
  {
    id: "movies",
    match: ["movie", "film", "cinema", "netflix", "drama", "actor", "actress", "watch", "series"],
    replies: {
      lingoo: ["Movie night! 🎬 What's the best movie you've watched, {name}?", "I love stories! Tell me about a film you enjoyed — no spoilers!", "Lights, camera, English! 🎥 What genre do you like?"],
      maya: ["MOVIES! 😎🍿 Okay, what's your all-time favourite? Mine changes weekly!", "Netflix and... English practice! 😂 What are you watching?", "Horror, comedy, or romance? This says a lot about a person!"],
      zara: ["Films are perfect for Part 2: 'Describe a film you enjoyed.' 🎓 Lights, camera — go!", "Great listening practice too! Do you watch with subtitles? You should!", "Describe the plot of your favourite movie in 5 sentences!"],
      pip: ["Movies! 🐣🎬 Pip loves cartoons! Do you?", "Popcorn! 🍿🌈 What is your favourite cartoon?", "Yay! 🐥 Let's watch something fun!"],
      bennett: ["Cinema is a fine cultural topic for small talk. 🤵 Any recent films you'd recommend, {name}?", "Indeed. I find documentaries particularly enriching."]
    }
  },
  {
    id: "music",
    match: ["music", "song", "sing", "singer", "guitar", "piano", "atif aslam", "rahat", "concert", "gana"],
    replies: {
      lingoo: ["La la la! 🎵 Music makes learning joyful! What music do you love, {name}?", "Songs are amazing for English! 🎶 Do you sing along?", "Tell me your favourite song — maybe I'll learn the lyrics!"],
      maya: ["MUSIC! 😎🎧 What are you listening to these days? I need recommendations!", "Atif Aslam or Rahat Fateh Ali Khan? The eternal debate! 😂", "Do you sing? I sing in the shower — Grammy-worthy! 🚿🎤"],
      zara: ["Music + English = powerful combo! 🎓 Try this: learn one English song's lyrics by heart this week.", "Listening to songs trains your ear for the listening test! What do you listen to?", "Describe your favourite singer — appearance, style, why you admire them!"],
      pip: ["La la la! 🐣🎵 Pip loves singing! Sing with me!", "Music! 🌈🎶 Twinkle twinkle little star! ⭐ Do you know it?", "Dance dance! 🐥💃 Music makes Pip happy!"],
      bennett: ["Music is a universal connector at corporate events. 🤵 What genre do you prefer, {name}?", "Classical music aids concentration, they say. Do you listen while working?"]
    }
  },
  {
    id: "weather",
    match: ["weather", "rain", "sunny", "cold", "hot", "winter", "summer", "barish", "sardi", "garmi", "cloudy", "snow"],
    replies: {
      lingoo: ["Weather chat! ☀️ How's the weather where you are, {name}?", "I love rainy days for reading! 🌧️ What's your favourite weather?", "Sunshine or snow — which do you prefer?"],
      maya: ["Ugh, weather small talk — but okay! 😎☀️ Is it hot where you are?", "Rainy day = chai + pakoray day! 🌧️☕ Agree?", "I love winter! Hoodie season! 🧥 What's your favourite?"],
      zara: ["Classic Part 1 topic! 🎓 'What's the weather like in your hometown?' — answer in full sentences!", "Weather vocabulary is easy marks: drizzle, scorching, chilly, humid. Use them!", "Describe your favourite season and explain why!"],
      pip: ["Sun! 🌞🐣 Pip loves sunny days! Is it sunny?", "Rain rain! 🌧️🐥 Splash splash!", "Snow! ❄️🌈 Brrr! Do you like snow?"],
      bennett: ["The quintessential small-talk topic — and it works every time. 🤵 How is the weather today?", "Quite. They say the British invented small talk because of their weather!"]
    }
  },
  {
    id: "lovelike",
    match: ["i love", "i like", "i like it", "my favourite", "my favorite", "favourite", "favorite", "pasand"],
    replies: {
      lingoo: ["Wonderful! 🌟 Tell me more — why do you love it?", "Great! Loving something makes talking about it easy! Tell me more, {name}!"],
      maya: ["Yesss, tell me everything! 😎 Why do you love it?", "Ooh, interesting choice! What got you into it?"],
      zara: ["Excellent — passion makes great speaking content! 🎓 Now describe it in detail: what, why, since when?", "Good! Examiners love genuine enthusiasm. Expand: give me reasons and examples!"],
      pip: ["Yay! 🐣💛 Pip loves things too! Tell me more!", "Woohoo! 🌈 What else do you love?"],
      bennett: ["Splendid. 🤵 Passion is compelling in any conversation. Do tell me more.", "How interesting. What draws you to it, {name}?"]
    }
  },
  {
    id: "sad",
    match: ["sad", "upset", "depressed", "cry", "crying", "lonely", "dukhi", "udas"],
    replies: {
      lingoo: ["Oh no, {name}. 🦉💛 I'm sorry you're feeling sad. Want to talk about it? I'm here.", "Sending you a big owl hug! 🤗 It's okay to feel sad sometimes. Tell me what's wrong?"],
      maya: ["Hey, hey... 😟💛 I'm here. What's going on? Talking helps, I promise.", "Aw, I'm sorry. Want to vent? I'm all ears! 👂"],
      zara: ["I'm sorry to hear that. 🎓💛 Remember: tough days don't define you. Want a small win today? Let's learn 3 new words!", "It's okay to feel low. Let's do something gentle — tell me one good thing from today."],
      pip: ["Oh no! 🐣💛 Pip hugs you! *hug* Everything will be okay!", "Don't cry! 🌈 Pip is here! You are loved! 💛"],
      bennett: ["I'm sorry to hear that, {name}. 🤵 If you'd like to talk, I'm here to listen.", "Difficult days pass. Is there anything I can help you with?"]
    }
  },
  {
    id: "happy",
    match: ["happy", "excited", "great", "awesome", "amazing", "wonderful", "khush"],
    replies: {
      lingoo: ["Yay! Your happiness makes ME happy! 🌟🦉 What's the good news?", "Wonderful! Celebrate it! Tell me everything, {name}!"],
      maya: ["YESS! Love that energy! 😎🎉 Spill the details!", "Awesome! Good vibes only! Tell me more!"],
      zara: ["Fantastic! 🎓 Positive energy fuels learning. What's the occasion?", "Wonderful! Channel that energy — let's learn something new right now!"],
      pip: ["YAY! 🐣🎉 Pip is happy too! Why are you happy?", "Woohoo! 🌈💛 Happy happy!"],
      bennett: ["Delightful to hear! 🤵 Do share the good news.", "Excellent! Success deserves to be celebrated."]
    }
  },
  {
    id: "bored",
    match: ["bored", "boring", "nothing to do", "bore ho raha"],
    replies: {
      lingoo: ["Boredom is just adventure waiting to happen! 🌟 Let's learn 5 fun new words — ready?", "I have the cure! Let's play: I'll say a word, you make a funny sentence with it!"],
      maya: ["Bored? Not on my watch! 😎 Let's talk about something wild — if you had a superpower, what would it be?", "Same, sometimes! Let's fix it: tell me your dream vacation! ✈️"],
      zara: ["Boredom is the enemy of band 7! 🎓 Quick challenge: describe your room in English in 60 seconds. Go!", "Let's turn boredom into progress — 5-minute vocabulary sprint! Ready?"],
      pip: ["Pip cures boredom! 🐣🎉 Let's play! What animal am I? *flaps wings* 🐥", "No more bored! 🌈 Let's sing! La la la! 🎵"],
      bennett: ["Boredom is an opportunity in disguise. 🤵 Shall we practise something useful — say, elevator pitches?", "Then let us be productive! Describe your dream job in three sentences."]
    }
  },
  {
    id: "yes",
    match: [/^yes$/, /^yeah$/, /^yep$/, /^yup$/, /^ji$/, /^han$/, /^haa$/],
    replies: {
      lingoo: ["Great! 🌟 Tell me more!", "Wonderful! Go on..."],
      maya: ["Nice! 😎 Tell me more!", "Cool cool! And then?"],
      zara: ["Good! Now expand — examiners love details! 🎓", "Excellent! Give me the full picture!"],
      pip: ["Yay! 🐣 Tell me more!", "Yes yes! 🌈 More please!"],
      bennett: ["Splendid. 🤵 Please, elaborate.", "Very good. Do continue."]
    }
  },
  {
    id: "no",
    match: [/^no$/, /^nope$/, /^nah$/, /^nahi$/, /^nahin$/],
    replies: {
      lingoo: ["No worries! 🌟 Let's try something else — what do you enjoy?", "That's fine! How about we talk about your favourite food instead?"],
      maya: ["No stress! 😎 Let's switch topics — movies or music?", "Fair enough! What DO you want to talk about?"],
      zara: ["No problem! 🎓 Let's redirect: what's your biggest English challenge?", "Understood. Different question: what motivates you to learn English?"],
      pip: ["Okay! 🐣 Let's do something else! Animals? 🌈", "No problem! 🐥 Colours? Red? Blue?"],
      bennett: ["Quite alright. 🤵 Shall we move to another subject?", "Understood. What would you prefer to discuss?"]
    }
  },
  {
    id: "essayHelp",
    match: ["write my essay", "write an essay", "do my homework", "write my application", "write essay for me", "complete my assignment"],
    replies: {
      lingoo: ["I won't write it FOR you — but I'll make you brilliant at it! 🌟 What's the topic? I'll help you plan it.", "Here's the deal: you write, I guide! Tell me the topic and we'll build a strong outline together. 📝"],
      maya: ["Haha nice try! 😎 I can't do it for you, but I'll totally help you plan it. What's the topic?", "Nope, that's cheating! But I'll help you brainstorm — what's it about?"],
      zara: ["A coach never does the workout for you! 🎓 Tell me the question — I'll teach you the structure and you'll write a band 7+ essay yourself.", "Academic integrity matters! Share the prompt and I'll give you a winning plan."],
      pip: ["Pip can't do homework! 🐣 But Pip can help you think! What is it about? 🌈", "You try first! Then Pip helps! 💪😄"],
      bennett: ["I must decline to do the work itself — but I shall gladly help you structure it professionally. 🤵 What's the subject?", "Integrity first. Share the requirements and I'll guide your outline."]
    }
  }
);

/* ================= topics ================= */
// keywords trigger topic mode; followups keep the chat alive.
export const TOPICS = [
  { id: "cricket", keywords: ["cricket", "babar", "psl", "batsman", "bowler", "wicket"],
    followups: ["Who is your favourite cricketer?", "Do you play cricket yourself?", "Did you watch the last Pakistan match?"] },
  { id: "football", keywords: ["football", "soccer", "ronaldo", "messi", "fifa", "world cup"],
    followups: ["Ronaldo or Messi — pick one!", "Do you play football?", "Which club do you support?"] },
  { id: "food", keywords: ["biryani", "pizza", "burger", "karahi", "nihari", "chai", "samosa", " Haleem".toLowerCase()],
    followups: ["What is the best biryani you ever had?", "Can you cook anything?", "Spicy or mild — what's your style?"] },
  { id: "travel", keywords: ["murree", "naran", "hunza", "swat", "kaghan", "beach", "mountains", "northern areas", "abroad", "dubai"],
    followups: ["Have you been to the northern areas?", "Mountains or beach — which wins?", "Where is your dream destination?"] },
  { id: "movies", keywords: ["netflix", "drama", "actor", "cinema", "bollywood", "hollywood", "series"],
    followups: ["What are you watching these days?", "Comedy or action — your pick?", "Best movie you ever saw?"] },
  { id: "music", keywords: ["atif aslam", "rahat", "arijit", "song", "concert", "qawwali", "coke studio"],
    followups: ["Coke Studio fan? Favourite episode?", "Do you sing or play an instrument?", "What song is stuck in your head?"] },
  { id: "school", keywords: ["matric", "inter", "fsc", "o level", "a level", "university", "css", "subject"],
    followups: ["What is your favourite subject?", "Are you preparing for any exam?", "School or college — which is better?"] },
  { id: "work", keywords: ["office", "salary", "promotion", "interview", "freelance", "shop", "business"],
    followups: ["What does your typical workday look like?", "Dream job — what would it be?", "Do you like your work?"] },
  { id: "family", keywords: ["mother", "father", "brother", "sister", "parents", "cousin", "ami", "abu"],
    followups: ["Are you the eldest or youngest?", "Who are you closest to in your family?", "Big family or small?"] },
  { id: "pakistan", keywords: ["pakistan", "lahore", "karachi", "islamabad", "peshawar", "quetta", "chitral", "punjab", "sindh", "kpk", "balochistan"],
    followups: ["Which city are you from?", "Best thing about your city?", "Have you travelled within Pakistan?"] },
  { id: "weather", keywords: ["barish", "sardi", "garmi", "monsoon", "winter", "summer"],
    followups: ["Do you like rainy days?", "Hottest month where you live?", "Perfect weather for you?"] },
  { id: "books", keywords: ["book", "novel", "reading", "author", "story", "library"],
    followups: ["What book are you reading?", "Fiction or non-fiction?", "Favourite author?"] },
  { id: "games", keywords: ["pubg", "free fire", "gaming", "video game", "cricket game", "ludo"],
    followups: ["What do you play?", "Mobile or PC gamer?", "Ever won a tournament?"] },
  { id: "health", keywords: ["health", "exercise", "gym", "walk", "diet", "sleep", "sick", "doctor"],
    followups: ["Do you exercise regularly?", "Morning person or night owl?", "How many hours do you sleep?"] },
  { id: "technology", keywords: ["mobile", "phone", "computer", "laptop", "internet", "ai", "robot", "app", "tiktok", "youtube"],
    followups: ["Android or iPhone?", "Favourite app on your phone?", "Is AI exciting or scary?"] }
];

/* ================= common learner errors ================= */
export const ERROR_PATTERNS = [
  { pattern: /\bi am agree\b/, wrong: "I am agree", fix: "I agree", explain: "We never use 'am/is/are' with 'agree'." },
  { pattern: /\bhe go\b/, wrong: "he go", fix: "he goes", explain: "He/she/it + verb + s." },
  { pattern: /\bshe go\b/, wrong: "she go", fix: "she goes", explain: "He/she/it + verb + s." },
  { pattern: /\bit go\b/, wrong: "it go", fix: "it goes", explain: "He/she/it + verb + s." },
  { pattern: /\bmore better\b/, wrong: "more better", fix: "better", explain: "'Better' already means 'more good'." },
  { pattern: /\bmore faster\b/, wrong: "more faster", fix: "faster", explain: "'Faster' already includes 'more'." },
  { pattern: /\bdidn't went\b/, wrong: "didn't went", fix: "didn't go", explain: "After 'didn't', use the base verb." },
  { pattern: /\bdid not went\b/, wrong: "did not went", fix: "did not go", explain: "After 'did not', use the base verb." },
  { pattern: /\binformations\b/, wrong: "informations", fix: "information", explain: "'Information' has no plural — it's uncountable." },
  { pattern: /\bfurnitures\b/, wrong: "furnitures", fix: "furniture", explain: "'Furniture' has no plural." },
  { pattern: /\bchilds\b/, wrong: "childs", fix: "children", explain: "The plural of 'child' is 'children'." },
  { pattern: /\bpeoples are\b/, wrong: "peoples are", fix: "people are", explain: "'People' is already plural." },
  { pattern: /\bi have (\d+) years\b/, wrong: "I have 20 years", fix: "I am 20 years old", explain: "Age uses 'am', not 'have'." },
  { pattern: /\bsince two years\b/, wrong: "since two years", fix: "for two years", explain: "'Since' + point in time; 'for' + duration." },
  { pattern: /\bsince many years\b/, wrong: "since many years", fix: "for many years", explain: "'Since' + point in time; 'for' + duration." },
  { pattern: /\bdiscuss about\b/, wrong: "discuss about", fix: "discuss", explain: "'Discuss' never takes 'about'." },
  { pattern: /\baccording to me\b/, wrong: "according to me", fix: "in my opinion", explain: "'According to' is for other people, not yourself." },
  { pattern: /\bi am knowing\b/, wrong: "I am knowing", fix: "I know", explain: "'Know' is a stative verb — no -ing." },
  { pattern: /\bhe don't\b/, wrong: "he don't", fix: "he doesn't", explain: "He/she/it + doesn't." },
  { pattern: /\bshe don't\b/, wrong: "she don't", fix: "she doesn't", explain: "He/she/it + doesn't." },
  { pattern: /\bthey doesn't\b/, wrong: "they doesn't", fix: "they don't", explain: "I/you/we/they + don't." },
  { pattern: /\byesterday i go\b/, wrong: "yesterday I go", fix: "yesterday I went", explain: "'Yesterday' needs the past tense." },
  { pattern: /\bmuch people\b/, wrong: "much people", fix: "many people", explain: "'Many' + countable nouns like people." },
  { pattern: /\bless people\b/, wrong: "less people", fix: "fewer people", explain: "'Fewer' + countable nouns." },
  { pattern: /\bgood in english\b/, wrong: "good in English", fix: "good at English", explain: "We say 'good AT' a subject." },
  { pattern: /\bmarried with\b/, wrong: "married with", fix: "married to", explain: "We say 'married TO' someone." },
  { pattern: /\bdepends of\b/, wrong: "depends of", fix: "depends on", explain: "We say 'depends ON'." },
  { pattern: /\blisten music\b/, wrong: "listen music", fix: "listen to music", explain: "'Listen' needs 'to' before the object." },
  { pattern: /\bi am study\b/, wrong: "I am study", fix: "I am studying", explain: "After 'am', use verb + ing." },
  { pattern: /\bcan able to\b/, wrong: "can able to", fix: "can", explain: "'Can' and 'able to' mean the same — pick one." }
];

/* ================= smalltalk fallbacks ================= */
export const SMALLTALK = [
  "Interesting! Tell me more about that! 😊",
  "Oh nice! What do you like most about it?",
  "Hmm, tell me something fun about your day!",
  "I see! And what else is new with you?",
  "Cool! Can you describe it a little more?",
  "Got it! So... what's your favourite thing to do on weekends?",
  "Nice! I'm learning new things from you every day! What else?",
  "Tell me more — I'm all ears! 👂",
  "That's interesting! Why do you think so?",
  "Okay! Let's talk about something you love — what is it?"
];

/* ================= quick replies ================= */
export const QUICK_REPLIES = {
  lingoo: ["Teach me a new word ✨", "Correct my sentence 📝", "How was your day? 🦉", "Give me a quiz! 🎯", "Tell me a joke 😄"],
  maya: ["What are your hobbies? 😎", "Let's talk movies 🎬", "Talk about travel ✈️", "Tell me a joke 😂", "What music do you like? 🎵"],
  zara: ["IELTS speaking practice 🎓", "Give me a writing tip ✍️", "Tips for band 7 📈", "Test my vocabulary 🧠"],
  pip: ["Animals! 🐶", "Colours! 🌈", "Tell me a story 📖", "Sing with me! 🎵", "My favourite food 🍎"],
  bennett: ["Practise small talk 💬", "Email writing help ✉️", "Interview tips 🎤", "Teach me business words 💼"]
};

/* ================= new words (tracked in chat) ================= */
export const NEW_WORDS = [
  { word: "brilliant", meaning: "very smart or excellent" },
  { word: "curious", meaning: "wanting to know more" },
  { word: "adventure", meaning: "an exciting journey" },
  { word: "delicious", meaning: "very tasty" },
  { word: "confident", meaning: "believing in yourself" },
  { word: "improve", meaning: "to become better" },
  { word: "practice", meaning: "doing something again and again to learn" },
  { word: "opportunity", meaning: "a good chance" },
  { word: "experience", meaning: "something you live through; knowledge from doing" },
  { word: "journey", meaning: "travelling from one place to another; also a process" },
  { word: "achieve", meaning: "to reach a goal" },
  { word: "goal", meaning: "something you want to reach" },
  { word: "habit", meaning: "something you do regularly" },
  { word: "patient", meaning: "able to wait calmly" },
  { word: "encourage", meaning: "to give someone hope or confidence" },
  { word: "celebrate", meaning: "to enjoy a happy event" },
  { word: "discover", meaning: "to find something new" },
  { word: "explore", meaning: "to travel and learn about a place" },
  { word: "favourite", meaning: "most liked" },
  { word: "memory", meaning: "something you remember" },
  { word: "moment", meaning: "a short time" },
  { word: "wonderful", meaning: "very good; amazing" },
  { word: "beautiful", meaning: "very pretty" },
  { word: "peaceful", meaning: "calm and quiet" },
  { word: "honest", meaning: "truthful" },
  { word: "kind", meaning: "nice and caring" },
  { word: "brave", meaning: "not afraid" },
  { word: "clever", meaning: "smart in a quick way" },
  { word: "generous", meaning: "happy to give and share" },
  { word: "grateful", meaning: "thankful" },
  { word: "proud", meaning: "feeling happy about an achievement" },
  { word: "excited", meaning: "very happy about something coming" },
  { word: "relax", meaning: "to rest and feel calm" },
  { word: "focus", meaning: "to give full attention" },
  { word: "decide", meaning: "to make a choice" },
  { word: "promise", meaning: "to say you will definitely do something" },
  { word: "suggest", meaning: "to give an idea" },
  { word: "explain", meaning: "to make something clear" },
  { word: "describe", meaning: "to say what something is like" },
  { word: "compare", meaning: "to look at similarities and differences" },
  { word: "discuss", meaning: "to talk about something" },
  { word: "imagine", meaning: "to picture in your mind" },
  { word: "believe", meaning: "to think something is true" },
  { word: "trust", meaning: "to believe someone is good and honest" },
  { word: "respect", meaning: "to treat well; admire" },
  { word: "support", meaning: "to help someone" },
  { word: "success", meaning: "achieving what you wanted" },
  { word: "effort", meaning: "trying hard" },
  { word: "progress", meaning: "moving forward; getting better" },
  { word: "challenge", meaning: "something difficult to do" },
  { word: "solution", meaning: "an answer to a problem" },
  { word: "opinion", meaning: "what you think about something" },
  { word: "advice", meaning: "helpful suggestions" },
  { word: "formal", meaning: "official and polite in style" },
  { word: "casual", meaning: "relaxed and informal" },
  { word: "fluent", meaning: "speaking smoothly and easily" },
  { word: "vocabulary", meaning: "all the words you know" },
  { word: "pronunciation", meaning: "the way you say words" },
  { word: "conversation", meaning: "talking with someone" },
  { word: "interview", meaning: "a formal meeting, often for a job" }
];

/* ================= abuse guard ================= */
export const ABUSE_WORDS = ["stupid", "idiot", "dumb", "hate you", "shut up", "bitch", "bastard", "fuck", "shit", "damn you"];
export const ABUSE_REPLIES = [
  "Let's keep our chat friendly 🙂 What else would you like to talk about?",
  "Oops! Let's use kind words here. 🌟 Tell me something nice about your day!",
  "Hey, let's stay positive! 😊 What is one good thing that happened today?"
];

/* words that block the "i am X" name capture (adjectives, not names) */
export const NAME_STOP = new Set([
  "happy", "sad", "fine", "good", "ok", "okay", "bored", "tired", "hungry",
  "sick", "busy", "free", "ready", "sorry", "sure", "glad", "excited",
  "here", "there", "new", "old", "Pakistani", "muslim", "student", "teacher",
  "boy", "girl", "man", "woman", "learning", "practicing", "practising",
  "going", "coming", "leaving", "sleepy", "thirsty", "worried", "nervous"
]);
