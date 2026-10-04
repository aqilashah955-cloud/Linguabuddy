// LinguaBuddy — 🌍 More International Tests: content banks.
// TOEFL iBT, PTE Academic, Cambridge B2/C1, TOEIC, OET starter.
// Bundled offline data (no API, no cost). Scores in the app are practice
// estimates, never official.

export const DATA_VERSION_MORETESTS = "1.0.0";

/* ==================== TOEFL iBT ==================== */
export const TOEFL = {
  reading: [
    {
      id: "urban-farming",
      title: "The Rise of Urban Farming",
      text: "Urban farming — the practice of growing food inside cities — has grown from a small movement into a global trend. On rooftops, in abandoned warehouses, and even underground, farmers are using new technology to grow fresh vegetables close to the people who will eat them.\n\nOne reason for this growth is efficiency. Traditional farming uses large amounts of land and water, and food often travels thousands of kilometers before it reaches a shop. Urban farms shorten this distance. Because the food is grown near consumers, it arrives fresher and requires less fuel for transport.\n\nTechnology has made city farming possible at a larger scale. Vertical farms stack plants in tall layers inside buildings, using LED lights instead of sunlight. Hydroponic systems grow plants in nutrient-rich water rather than soil, using up to 90 percent less water than traditional methods. Computers control temperature, light, and nutrients with great precision.\n\nCritics argue that urban farming cannot replace traditional agriculture. They point out that staple crops such as wheat, rice, and corn need huge fields and cannot be grown profitably indoors. Supporters agree but respond that city farms were never meant to replace field farming. Instead, they complement it by supplying fresh leafy greens and herbs — crops that spoil quickly during long transport.\n\nAs cities continue to grow, urban farming is likely to become an ordinary part of city life. What began as an experiment by environmental activists is becoming a practical answer to the question of how to feed billions of people living far from farmland.",
      questions: [
        { t: "The word “complement” in paragraph 4 is closest in meaning to", o: ["complete entirely", "add to or complete", "compete with", "replace fully"], a: 1 },
        { t: "According to paragraph 2, one advantage of urban farms is that they", o: ["use more land than traditional farms", "reduce the distance food travels", "grow food without any water", "employ more workers than field farms"], a: 1 },
        { t: "What can be inferred about staple crops such as wheat and rice?", o: ["They grow best indoors", "They are unsuitable for profitable indoor farming", "They need less water than leafy greens", "They spoil quickly during transport"], a: 1 },
        { t: "Hydroponic systems are mentioned as an example of", o: ["a farming method that saves water", "a way to grow wheat indoors", "a traditional farming technique", "a type of LED light"], a: 0 },
        { t: "The word “precision” in paragraph 3 is closest in meaning to", o: ["speed", "accuracy", "warmth", "brightness"], a: 1 },
        { t: "The author’s attitude toward urban farming is", o: ["strongly negative", "purely neutral", "generally positive", "completely uncertain"], a: 2 }
      ]
    },
    {
      id: "desert-life",
      title: "The Hidden Life of Deserts",
      text: "Deserts are often imagined as empty wastelands, but they are full of life that has adapted to extreme conditions. Although rainfall may be rare, desert plants and animals have developed remarkable strategies for finding and saving water.\n\nThe saguaro cactus of North America can store hundreds of liters of water in its thick stem. Its shallow roots spread widely just under the surface, ready to absorb rain the moment it falls. Other plants avoid the dry season entirely: their seeds lie dormant in the soil for years, waiting for a rare heavy rain before they sprout, flower, and produce new seeds within a few short weeks.\n\nAnimals have their own solutions. The fennec fox, with its enormous ears, releases body heat through the thin skin of its ears, helping it stay cool. Many desert animals are nocturnal, sleeping through the burning day in cool burrows and hunting at night. The kangaroo rat never needs to drink water at all — it produces all the water it needs from the dry seeds it eats.\n\nHuman visitors often underestimate the desert’s dangers. Temperatures can rise above 45 degrees Celsius by day and drop near freezing at night. Yet for the creatures that live there, the desert is not a wasteland at all. It is a finely balanced home, shaped over millions of years by the single greatest challenge of all: the scarcity of water.",
      questions: [
        { t: "The word “dormant” in paragraph 2 is closest in meaning to", o: ["dead", "inactive", "poisonous", "colorful"], a: 1 },
        { t: "The saguaro cactus survives dry periods by", o: ["growing very deep roots", "storing water in its stem", "flowering every night", "moving toward rainfall"], a: 1 },
        { t: "Why are many desert animals nocturnal?", o: ["To avoid the daytime heat", "To find more food", "To escape from predators", "To save water while sleeping"], a: 0 },
        { t: "The kangaroo rat is unusual because it", o: ["drinks only at night", "never needs to drink water", "stores water in its ears", "eats only cactus"], a: 1 },
        { t: "The word “underestimate” in paragraph 4 is closest in meaning to", o: ["wrongly judge as less dangerous", "study very carefully", "completely ignore", "strongly fear"], a: 0 },
        { t: "The main idea of the passage is that", o: ["deserts are dangerous for humans", "desert life has adapted brilliantly to dryness", "cacti are the most important desert plants", "deserts receive no rain at all"], a: 1 }
      ]
    }
  ],
  listening: [
    {
      id: "advisor",
      title: "Campus Conversation: Course Registration",
      kind: "conversation",
      script: "Advisor: Hi, come in. How can I help you?\nStudent: Hi, I'm trying to register for next semester, but the system won't let me add Biology 201.\nAdvisor: Let me check. Ah, I see the problem — Biology 201 requires Chemistry 101 as a prerequisite, and you haven't completed it yet.\nStudent: But I took chemistry in high school. Shouldn't that count?\nAdvisor: Unfortunately not. The department requires the college-level course. But there's good news: Chemistry 101 is offered this summer, and if you pass, you can take Biology 201 in the fall.\nStudent: The summer course — is it online or in person?\nAdvisor: It's hybrid. Lectures are online, but the lab sessions meet twice a week on campus.\nStudent: Hmm, I was planning to work full-time this summer. Are the labs in the evening?\nAdvisor: Yes, there's an evening section from six to nine. Many working students choose that one.\nStudent: That could work. How do I sign up?\nAdvisor: I'll send you the registration link right now. Just make sure to enroll before Friday — summer classes fill up fast.",
      questions: [
        { t: "Why does the student visit the advisor?", o: ["To drop a class", "Because she cannot register for a course", "To ask about graduation", "To complain about a professor"], a: 1 },
        { t: "Why can't the student take Biology 201?", o: ["She missed the deadline", "She lacks the prerequisite", "The class is full", "She failed a placement test"], a: 1 },
        { t: "What does the advisor suggest?", o: ["Taking Chemistry 101 in the summer", "Waiting a full year", "Choosing a different major", "Studying chemistry alone"], a: 0 },
        { t: "What can be inferred about the evening lab section?", o: ["It is designed for working students", "It is easier than the day section", "It costs extra money", "It is taught by the advisor"], a: 0 },
        { t: "What must the student do before Friday?", o: ["Pass an exam", "Enroll in the summer class", "Visit the advisor again", "Pay her tuition"], a: 1 }
      ]
    },
    {
      id: "stroop",
      title: "Lecture: The Stroop Effect",
      kind: "lecture",
      script: "Today we'll look at a famous psychology experiment called the Stroop effect. Imagine I show you the word BLUE printed in red ink, and I ask you to name the color of the ink — not the word. Most people hesitate. They want to say blue because reading is automatic, but the correct answer is red.\n\nThis delay happens because your brain processes two conflicting pieces of information at once: the meaning of the word and the color of the ink. The word meaning is processed faster since reading is such a practiced skill, so it interferes with the slower task of naming the color.\n\nPsychologists use the Stroop test to measure attention and mental flexibility. For example, it can help detect changes in brain function after an injury. Interestingly, the effect is weaker in people who are bilingual when tested in their second language — probably because reading is slightly less automatic for them.\n\nSo a simple color-naming game reveals something deep: that even basic mental tasks involve competition between different brain processes.",
      questions: [
        { t: "What is the main topic of the lecture?", o: ["A psychology experiment about conflicting information", "The history of color printing", "How bilingual people learn faster", "Treatment for brain injuries"], a: 0 },
        { t: "In the example, why do people hesitate?", o: ["They are color-blind", "Reading the word interferes with naming the ink color", "They don't know the word blue", "The ink is hard to see"], a: 1 },
        { t: "Why is the Stroop effect weaker in a second language?", o: ["Bilingual people are smarter", "Reading is less automatic in a second language", "The test is translated badly", "Second languages have fewer color words"], a: 1 },
        { t: "Psychologists use the Stroop test to", o: ["teach children to read", "measure attention and mental flexibility", "cure brain injuries", "test eyesight"], a: 1 },
        { t: "According to the lecture, reading is", o: ["a slow, deliberate process", "a highly practiced, automatic skill", "impossible under pressure", "unrelated to attention"], a: 1 }
      ]
    }
  ],
  speaking: [
    { id: "ind-1", kind: "independent", title: "Independent: Team or Alone?", prompt: "Some people prefer to work in a team, while others prefer to work alone. Which do you prefer, and why? Give reasons and examples.", prep: 15, talk: 45 },
    { id: "ind-2", kind: "independent", title: "Independent: A Skill to Learn", prompt: "Describe a skill you would like to learn. Explain why you want to learn it and how you would learn it.", prep: 15, talk: 45 },
    {
      id: "int-1", kind: "integrated", title: "Integrated: Library Hours",
      read: "The university plans to extend library hours during exam weeks. The announcement says the library will stay open until midnight, giving students a quiet place to study. Officials believe this will improve exam performance.",
      listen: "Student: Did you hear the library's extending hours? I'm not sure it helps. Most students study in their dorms anyway, and keeping the building open late costs a lot — they'd need extra security staff. I'd rather they spent the money on more online resources.",
      prompt: "The student expresses an opinion about the university's plan. State the opinion and explain the reasons given.",
      prep: 30, talk: 60
    },
    {
      id: "int-2", kind: "integrated", title: "Integrated: Life Without Sunlight",
      read: "Photosynthesis is the process by which plants convert sunlight into energy. Chlorophyll, the green pigment in leaves, captures light. The plant then uses this energy to turn carbon dioxide and water into glucose, releasing oxygen.",
      listen: "Professor: Researchers recently found that some deep-sea bacteria perform a similar process without sunlight, using chemical energy from ocean vents instead. Like plants, they convert simple molecules into food — showing that photosynthesis-like processes can occur even in total darkness.",
      prompt: "Explain how the bacteria described in the lecture are similar to plants, using points from both the reading and the lecture.",
      prep: 30, talk: 60
    }
  ],
  writing: [
    {
      id: "integrated-1", kind: "integrated", title: "Integrated: Bottled Water",
      read: "Bottled water is often presented as cleaner and healthier than tap water. Advertising suggests it comes from pure mountain springs, and many consumers believe it tastes better. In blind taste tests, however, most people cannot tell the difference. Moreover, producing plastic bottles consumes large amounts of oil and energy, and millions of bottles end up in landfills every year.",
      listen: "The bottled water industry is mostly marketing. Studies show tap water in developed countries is tested more strictly than bottled water. The word spring on the label is often just filtered municipal water. And the environmental cost is enormous — it takes three liters of water to produce one liter of bottled water. Consumers pay a thousand times more for a product that is no better.",
      prompt: "Summarize the points made in the lecture and explain how they cast doubt on the claims in the reading passage.",
      minutes: 20,
      criteria: ["Accurate summary of both sources", "Clear organization", "Language use: grammar and vocabulary"]
    },
    {
      id: "independent-1", kind: "independent", title: "Independent Essay",
      prompt: "Do you agree or disagree with the following statement? It is better to work for a large company than for a small one. Use specific reasons and examples to support your answer.",
      minutes: 30,
      criteria: ["Clear position and development", "Organization and coherence", "Language use: range and accuracy"]
    }
  ],
  tips: [
    "Reading: don't get stuck on one hard question — answer the easier ones first, then return.",
    "Listening: take short notes while the audio plays; one missed word won't ruin you.",
    "Speaking: keep talking — a filled pause is better than silence. Use the full time.",
    "Integrated Writing: let the LECTURE challenge the reading — examiners reward that contrast.",
    "Independent Writing: plan for 5 minutes first — a clear structure beats long rambling.",
    "All sections are timed in the real test. Practice with the timer on, every time."
  ]
};

/* ==================== PTE Academic ==================== */
export const PTE = {
  readAloud: [
    "The development of renewable energy has accelerated in recent years. Solar panels are now cheaper than ever, and wind farms produce a growing share of the world's electricity. Many experts believe clean energy will dominate within two decades.",
    "Honeybees communicate the location of flowers through a special dance. By moving in a figure-eight pattern, a returning bee tells others the direction and distance of a rich food source. This remarkable behavior was decoded in the 1940s.",
    "Public libraries are changing. Once quiet rooms full of books, many now offer 3D printers, recording studios, and coding classes. Librarians say their role has shifted from guarding information to helping people create it. Membership remains free, welcoming everyone from toddlers to retirees.",
    "Sleep plays a vital role in memory. During deep sleep, the brain replays the day's experiences, strengthening important connections. Students who sleep well after studying consistently perform better on tests. Experts recommend seven to nine hours of sleep every night.",
    "The rise of remote work has transformed city centers. With fewer commuters, some business districts have grown quieter, while suburban towns have gained new cafes, shops, and co-working spaces. Employers now compete for talent by offering flexible schedules and home-office support.",
    "Coral reefs support a quarter of all marine life, yet they cover less than one percent of the ocean floor. Rising sea temperatures threaten these fragile ecosystems, making conservation efforts increasingly urgent. Protecting them means protecting the livelihoods of millions of people."
  ],
  fibRW: [
    { s: "She was ___ to finish the report before the deadline.", a: "determined" },
    { s: "The new policy will ___ into effect next month.", a: "come" },
    { s: "His argument was based on ___ evidence, not opinions.", a: "solid" },
    { s: "The museum's collection ___ over three thousand paintings.", a: "includes" },
    { s: "They had to ___ the meeting because the manager was ill.", a: "cancel" },
    { s: "The results were ___ than anyone had expected.", a: "better" },
    { s: "Regular reading ___ your vocabulary naturally.", a: "expands" },
    { s: "The engineer ___ the design three times before approving it.", a: "checked" }
  ],
  repeatSentence: [
    "The library will be closed for renovations next week.",
    "Students must submit their assignments by Friday afternoon.",
    "The professor explained the theory with a simple example.",
    "Economic growth slowed down in the last quarter.",
    "Please turn off your mobile phones during the lecture.",
    "The new hospital opens to the public in June.",
    "Climate change affects farming in many regions.",
    "She borrowed three books from the university library."
  ],
  describeImage: [
    { desc: "A bar chart showing the number of international tourists (in millions) visiting Paris, Tokyo, and New York from 2019 to 2023. Paris rises steadily and peaks in 2023; Tokyo dips in 2020 then recovers; New York stays roughly flat.", prompt: "Describe the chart in detail. You have 40 seconds to speak." },
    { desc: "A line graph showing average monthly temperature in two cities — Cairo and Oslo — across twelve months. Cairo stays warm year-round; Oslo swings from freezing winters to mild summers.", prompt: "Describe the main trends and differences. You have 40 seconds to speak." },
    { desc: "A pie chart of how students spend a 24-hour day: sleep 33%, classes 21%, study 17%, meals 12%, leisure 12%, other 5%.", prompt: "Describe the proportions shown. You have 40 seconds to speak." },
    { desc: "A process diagram showing how coffee is made: beans are grown, harvested, dried, roasted, ground, and brewed.", prompt: "Describe each stage of the process. You have 40 seconds to speak." }
  ],
  retellLecture: [
    "Today I want to talk about how trees communicate. Scientists have discovered that trees share nutrients through underground fungal networks, sometimes called the wood-wide web. When one tree is attacked by insects, it can send warning signals to nearby trees, which then produce defensive chemicals. Older, larger trees act as hubs, supporting younger saplings with extra carbon. This challenges the old idea of trees as solitary competitors and suggests forests behave more like cooperative communities. Gardeners can use this knowledge by planting young trees near healthy older ones, giving them a stronger start in life. What looks like a quiet forest is, in fact, a busy network of shared resources.",
    "Let's consider the placebo effect. In medical trials, patients who receive a sugar pill often improve, simply because they believe they are being treated. Brain scans show that expecting relief can trigger the release of natural painkillers. This doesn't mean the illness is imaginary — it shows how powerfully belief influences the body. Researchers must account for this effect when testing new drugs, which is why control groups are essential. Understanding the placebo effect helps doctors design better trials and give patients honest, effective care.",
    "Urbanization is changing the planet's surface. More than half of humanity now lives in cities, and the number keeps rising. Cities generate most of the world's wealth but also most of its waste and carbon emissions. Planners face a double challenge: accommodating growth while reducing environmental harm. Green roofs, efficient public transport, and compact neighborhoods are among the solutions being tested worldwide. The choices planners make today will shape the daily lives of billions of people tomorrow. Smart planning now can prevent decades of traffic, pollution, and wasted energy.",
    "Why do we yawn? One theory links yawning to brain cooling: the deep breath brings cooler air that lowers brain temperature and increases alertness. This may explain why we yawn when tired or bored — moments when focus drops. Interestingly, yawning is contagious; seeing someone yawn activates the same brain regions, possibly linked to empathy. So a simple yawn reveals a surprising amount about how our brains work. The next time a yawn escapes during a boring meeting, remember: your brain is simply trying to wake itself up."
  ],
  writeEssay: [
    "Some people think technology has made our lives better, while others believe it has caused more problems. Discuss both views and give your opinion. (200–300 words)",
    "The best way to learn a language is to live in a country where it is spoken. To what extent do you agree? (200–300 words)",
    "Should university education be free for all students? Discuss and give your opinion. (200–300 words)",
    "Climate change is the greatest challenge facing humanity today. Do you agree or disagree? (200–300 words)"
  ],
  tips: [
    "Read Aloud: stress the important words and pause at commas — rhythm matters as much as pronunciation.",
    "Fill in the Blanks: think in collocations — words that naturally go together.",
    "Repeat Sentence: break it into 3–4 chunks in your head as you listen.",
    "Describe Image: 40 seconds = overview, 2–3 key features, one concluding sentence.",
    "Write Essay: aim for 200–300 words with a clear 4-paragraph template.",
    "PTE is fully computer-scored — clear, steady speech beats fast mumbling."
  ]
};

/* ==================== Cambridge B2 First / C1 Advanced ==================== */
export const CAMBRIDGE = {
  b2: {
    mcCloze: [
      { s: "She has worked here ___ 2019.", o: ["since", "for", "from", "by"], a: 0 },
      { s: "The movie was ___ boring that we left early.", o: ["so", "such", "too", "very"], a: 0 },
      { s: "If I ___ more time, I would learn another language.", o: ["have", "had", "will have", "would have"], a: 1 },
      { s: "He apologised ___ being late.", o: ["for", "of", "to", "about"], a: 0 },
      { s: "This is the house ___ I grew up.", o: ["where", "which", "whose", "whom"], a: 0 },
      { s: "___ you hurry, you'll miss the bus.", o: ["Unless", "If", "When", "As"], a: 0 },
      { s: "She's interested ___ photography.", o: ["on", "at", "in", "for"], a: 2 },
      { s: "The thief was caught ___ the police.", o: ["from", "with", "by", "at"], a: 2 }
    ],
    openCloze: [
      { s: "He is taller ___ his brother.", a: "than" },
      { s: "I haven't seen her ___ Monday.", a: "since" },
      { s: "It was ___ a good film that we watched it twice.", a: "such" },
      { s: "She asked me ___ I wanted some tea.", a: "if" },
      { s: "___ spite of the rain, we went out.", a: "In" },
      { s: "He has been working here ___ five years.", a: "for" },
      { s: "The bag was too heavy for him ___ carry.", a: "to" },
      { s: "I look forward ___ hearing from you.", a: "to" }
    ],
    wordFormation: [
      { s: "Her ___ was obvious to everyone.", root: "happy", a: "happiness" },
      { s: "He is a very ___ driver.", root: "care", a: "careful" },
      { s: "The ___ was difficult.", root: "decide", a: "decision" },
      { s: "It was an ___ experience.", root: "forget", a: "unforgettable" },
      { s: "She spoke with great ___.", root: "confident", a: "confidence" },
      { s: "The movie was really ___.", root: "bore", a: "boring" },
      { s: "He gave an ___ presentation.", root: "impress", a: "impressive" },
      { s: "___, the train was on time.", root: "luck", a: "Luckily" }
    ]
  },
  c1: {
    mcCloze: [
      { s: "The committee reached a ___ after hours of debate.", o: ["verdict", "decision", "conclusion", "resolution"], a: 3 },
      { s: "His speech ___ a great impression on the audience.", o: ["did", "made", "gave", "took"], a: 1 },
      { s: "The new law came ___ force in January.", o: ["to", "into", "in", "at"], a: 1 },
      { s: "She has a ___ for languages.", o: ["gift", "talent", "skill", "ability"], a: 0 },
      { s: "The project was called ___ due to lack of funding.", o: ["off", "out", "away", "over"], a: 0 },
      { s: "He ___ his success to hard work.", o: ["attributes", "contributes", "refers", "relates"], a: 0 }
    ],
    openCloze: [
      { s: "___ far as I know, the meeting is cancelled.", a: "As" },
      { s: "She takes ___ her mother in appearance.", a: "after" },
      { s: "Hardly had he arrived ___ the phone rang.", a: "when" },
      { s: "The report was ___ short that it surprised everyone.", a: "so" },
      { s: "He denied ___ taken the money.", a: "having" },
      { s: "___ you need any help, just ask.", a: "Should" }
    ],
    wordFormation: [
      { s: "The ___ lasted for hours.", root: "argue", a: "argument" },
      { s: "She has great ___ of character.", root: "strong", a: "strength" },
      { s: "His behaviour was completely ___.", root: "accept", a: "unacceptable" },
      { s: "The scientist made a ___ discovery.", root: "signify", a: "significant" },
      { s: "There was a ___ about the dates.", root: "misunderstand", a: "misunderstanding" },
      { s: "The climb required great ___.", root: "endure", a: "endurance" }
    ]
  },
  gappedText: [
    {
      id: "old-buildings",
      title: "A Second Life for Old Buildings",
      headings: ["A creative solution appears", "The problem of empty offices", "From shops to homes", "Challenges remain", "A win for the environment", "The human stories", "Cheaper than new builds"],
      paragraphs: [
        "In many cities, office buildings stand half empty. Since remote work became common, companies need less space, and landlords struggle to find tenants for floors that once buzzed with activity.",
        "Architects have proposed an imaginative answer: turn these offices into apartments. The buildings already have elevators, plumbing, and strong structures — everything homes need.",
        "The idea is not limited to offices. Old shopping centres, banks, and even churches have been converted into housing, giving historic buildings a second life.",
        "For residents, the change can be dramatic. Maria, a teacher, moved into a converted bank: “I live where the vault used to be. My bedroom walls are a metre thick!”",
        "Reusing buildings also helps the planet. Demolishing a structure and building a new one creates huge amounts of carbon; conversion avoids most of that.",
        "There are still obstacles. Offices have deep floor plans with little natural light in the middle, and changing the legal use of a building can take years."
      ],
      answers: [1, 0, 2, 5, 4, 3]
    },
    {
      id: "collecting",
      title: "Why We Collect Things",
      headings: ["It starts early", "The thrill of the hunt", "More than money", "When collecting goes too far", "A social hobby", "What science says", "Collections of the future"],
      paragraphs: [
        "Collecting often begins in childhood. A child who lines up toy cars or keeps every shell from the beach is following an instinct that is thousands of years old.",
        "Part of the pleasure is the search. Finding a rare item after months of looking gives a rush that psychologists compare to the excitement of a treasure hunt.",
        "Brain scans suggest why: completing a set activates reward centres in the brain, releasing chemicals linked to pleasure and satisfaction.",
        "For most collectors, the value is emotional rather than financial. A ticket stub from a memorable concert can matter more than an expensive painting.",
        "Collecting is also social. Clubs, fairs, and online groups let enthusiasts share knowledge, trade items, and make friends who share their passion.",
        "Occasionally, however, collecting becomes a problem. When possessions fill every room and cause distress, experts say it may have crossed into hoarding, which needs professional help."
      ],
      answers: [0, 1, 5, 2, 4, 3]
    }
  ],
  tips: [
    "Multiple-choice cloze: read the whole sentence — collocations (words that go together) decide most answers.",
    "Open cloze: only ONE word fits. If two seem possible, re-read for grammar clues.",
    "Word formation: first decide the word class (noun? adjective? adverb?), then add the ending.",
    "Gapped text: match linking words (however, for example, this) between paragraphs and headings.",
    "Cambridge rewards range — in writing, show off complex sentences you can control."
  ]
};

/* ==================== TOEIC ==================== */
export const TOEIC = {
  photo: [
    { photo: "Two people shaking hands in an office.", s: ["The man is sitting at a desk.", "The people are shaking hands.", "The woman is holding a phone.", "They are eating lunch."], a: 1 },
    { photo: "A chef chopping vegetables in a kitchen.", s: ["The chef is chopping vegetables.", "The man is driving a car.", "The food is on the table.", "The chef is washing dishes."], a: 0 },
    { photo: "Passengers boarding an airplane.", s: ["The passengers are boarding the plane.", "The plane is taking off.", "A man is buying a ticket.", "The luggage is on the carousel."], a: 0 },
    { photo: "A woman typing on a laptop in a café.", s: ["She is drinking coffee.", "She is typing on a laptop.", "She is talking on the phone.", "The café is closed."], a: 1 },
    { photo: "Workers loading boxes onto a truck.", s: ["The workers are loading boxes.", "The truck is parked inside.", "A man is driving away.", "The boxes are empty."], a: 0 },
    { photo: "A meeting in a conference room with a presentation on screen.", s: ["Everyone is leaving the room.", "A presentation is shown on the screen.", "The lights are off.", "People are having lunch."], a: 1 },
    { photo: "A man fixing a bicycle in a shop.", s: ["The man is riding a bicycle.", "The shop is crowded.", "The man is repairing a bicycle.", "A woman is paying."], a: 2 },
    { photo: "Children playing football in a park.", s: ["The children are playing football.", "It is raining.", "They are sitting on a bench.", "A dog is sleeping."], a: 0 },
    { photo: "A receptionist answering the phone at a hotel desk.", s: ["The receptionist is answering the phone.", "Guests are checking out.", "The lobby is empty.", "She is writing a letter."], a: 0 },
    { photo: "A train arriving at a station platform.", s: ["The train is leaving the station.", "Passengers are waiting on the platform.", "The train is arriving at the platform.", "It is midnight."], a: 2 }
  ],
  response: [
    { q: "When does the meeting start?", o: ["At 3 o'clock.", "In the conference room.", "With my manager."], a: 0 },
    { q: "Who left the keys on the desk?", o: ["I did, sorry.", "On the desk.", "At noon."], a: 0 },
    { q: "Would you like some coffee?", o: ["Yes, please.", "In the kitchen.", "I like tea shops."], a: 0 },
    { q: "How did you get to work today?", o: ["By bus.", "At 8 a.m.", "Very well."], a: 0 },
    { q: "Has the report been finished?", o: ["Not yet, almost done.", "On the second floor.", "Yes, I like reports."], a: 0 },
    { q: "Where is the nearest bank?", o: ["Next to the post office.", "At 5 p.m.", "I don't have money."], a: 0 },
    { q: "Why was the flight delayed?", o: ["Because of the storm.", "At gate 12.", "A window seat."], a: 0 },
    { q: "Could you send me the file?", o: ["I'll email it now.", "It's a large file.", "In my office."], a: 0 },
    { q: "When will the new store open?", o: ["Next Monday.", "On Main Street.", "It's very big."], a: 0 },
    { q: "Do you need help with your luggage?", o: ["Yes, thank you.", "It's blue.", "At the airport."], a: 0 }
  ],
  incomplete: [
    { s: "Please ___ the attached form before Friday.", o: ["complete", "completion", "completed", "completing"], a: 0 },
    { s: "The manager will review the proposal ___ Monday morning.", o: ["at", "in", "on", "for"], a: 2 },
    { s: "Our new product is ___ popular than expected.", o: ["much", "more", "most", "many"], a: 1 },
    { s: "She has worked for this company ___ ten years.", o: ["since", "for", "from", "during"], a: 1 },
    { s: "The meeting was postponed ___ the bad weather.", o: ["because", "due to", "although", "despite"], a: 1 },
    { s: "All employees ___ attend the training session.", o: ["must", "can to", "should to", "have"], a: 0 },
    { s: "The ___ report will be published next week.", o: ["annual", "annually", "year", "years"], a: 0 },
    { s: "If you need assistance, please ___ our support team.", o: ["contact", "contacting", "to contact", "contacted"], a: 0 },
    { s: "The package arrived ___ than we expected.", o: ["early", "earlier", "earliest", "most early"], a: 1 },
    { s: "He is responsible ___ managing the budget.", o: ["for", "of", "to", "with"], a: 0 },
    { s: "The conference room ___ cleaned every evening.", o: ["is", "are", "be", "been"], a: 0 },
    { s: "We offer a wide ___ of services.", o: ["range", "arrange", "rank", "rate"], a: 0 },
    { s: "___ the rain, the event was a success.", o: ["Despite", "Although", "Because", "Unless"], a: 0 },
    { s: "The new employee started work ___ Monday.", o: ["in", "at", "on", "for"], a: 2 },
    { s: "Please let me know if you ___ any questions.", o: ["have", "has", "having", "will have had"], a: 0 }
  ],
  textCompletion: [
    {
      title: "Office Memo: Parking",
      text: "To: All Staff\nFrom: HR Department\nSubject: New Parking Policy\n\nPlease note that starting next month, the parking lot will be __1__ for construction. During this time, employees should park in the __2__ lot across the street. We apologize for any __3__ this may cause. The work is expected to be __4__ by the end of June. Thank you for your __5__.",
      blanks: [
        { o: ["closed", "close", "closing", "closes"], a: 0 },
        { o: ["near", "nearby", "nearly", "nearness"], a: 1 },
        { o: ["inconvenient", "inconvenience", "inconveniently", "inconveniencing"], a: 1 },
        { o: ["complete", "completed", "completing", "completes"], a: 1 },
        { o: ["cooperate", "cooperation", "cooperative", "cooperating"], a: 1 }
      ]
    },
    {
      title: "Job Advertisement",
      text: "We are looking for a __1__ sales assistant to join our team. The ideal candidate will have at least two years of __2__ in retail. Duties include helping customers, managing inventory, and __3__ the cash register. We offer competitive pay and opportunities for __4__. Interested applicants should send their résumé to jobs@example.com by May 30. Only shortlisted candidates will be __5__.",
      blanks: [
        { o: ["motivate", "motivated", "motivation", "motivating"], a: 1 },
        { o: ["experience", "experiment", "expert", "experiencing"], a: 0 },
        { o: ["operate", "operating", "operation", "operated"], a: 1 },
        { o: ["advance", "advanced", "advancement", "advancing"], a: 2 },
        { o: ["contact", "contacted", "contacting", "contacts"], a: 1 }
      ]
    }
  ],
  tips: [
    "Photographs: eliminate the obviously wrong statements first — usually two are easy to remove.",
    "Question–Response: listen to the FIRST word (when/where/who/how) — it tells you what kind of answer fits.",
    "Incomplete sentences: grammar first — the sentence structure usually reveals the answer.",
    "Text completion: read the whole text before answering; later sentences give clues.",
    "TOEIC is a race — if a question takes more than 30 seconds, guess and move on."
  ]
};

/* ==================== OET (starter) ==================== */
export const OET = {
  overview: {
    who: "The Occupational English Test is for healthcare professionals — nurses, doctors, dentists, pharmacists and others — who need English for registration in the UK, Australia, New Zealand, Ireland and more.",
    subtests: [
      { name: "Listening", desc: "3 parts: patient consultations, workplace talks, and professional presentations (about 40 minutes)." },
      { name: "Reading", desc: "3 parts: fast workplace reading, then careful reading of longer healthcare texts (60 minutes)." },
      { name: "Writing", desc: "Profession-specific: write a referral, transfer, or discharge letter from case notes (45 minutes)." },
      { name: "Speaking", desc: "Two role-plays: you are the professional, the interlocutor plays the patient or carer (about 20 minutes)." }
    ]
  },
  tips: [
    "Writing: SELECT from the case notes — include only information relevant to the letter's purpose.",
    "Writing: state the PURPOSE in the first paragraph (referral, discharge, follow-up).",
    "Tone: professional and polite; avoid jargon when the reader is a patient, keep clinical terms for colleagues.",
    "Speaking: build rapport first — a greeting and one warm sentence before clinical questions.",
    "Listening: in consultations, listen for empathy cues — patients often hint at worries indirectly.",
    "Reading Part A: it's a SPEED task — skim the four texts first, then match the questions."
  ],
  letters: [
    {
      id: "referral-wound",
      title: "Referral: Post-Surgical Wound Care",
      scenario: "You are a ward nurse. Mr James Carter, 68, had a left knee replacement 5 days ago. The wound shows mild redness; he needs dressing changes, physiotherapy, and teaching for his blood-thinner injections. Write a referral letter to the district nurse.",
      notes: ["68-year-old man, total left knee replacement, day 5 post-op", "Wound: mild redness, no discharge; sutures intact", "Mobile with walking frame; physiotherapy must continue", "Lives alone; daughter visits at weekends", "On paracetamol; needs teaching for anticoagulant injections"],
      structure: ["Opening: purpose of letter + patient identity", "Background: surgery and current clinical status", "Current needs: wound care, physiotherapy, medication teaching", "Social context: lives alone — relevant to planning", "Closing: requested actions + offer to discuss"]
    },
    {
      id: "discharge-gp",
      title: "Discharge Letter to GP",
      scenario: "You are a ward nurse. Mrs Aisha Khan, 54, was admitted with a chest infection, treated with antibiotics for 6 days, and is now stable for discharge. Her GP needs a summary and the follow-up plan. Write the discharge letter.",
      notes: ["54-year-old woman admitted with community-acquired chest infection", "Treated with oral antibiotics, 6-day course completed", "Chest X-ray improving; oxygen levels normal for 48 hours", "Smoker (10/day) — advised to quit, given leaflet", "Follow-up: GP review in 1 week; repeat X-ray in 6 weeks if cough persists"],
      structure: ["Opening: reason for writing + admission summary", "Treatment given and response", "Condition at discharge", "Follow-up plan with clear timeframes", "Closing: contact details for questions"]
    },
    {
      id: "urgent-stroke",
      title: "Urgent Referral: Suspected Stroke",
      scenario: "You are an emergency nurse. Mr David Osei, 71, arrived with sudden left-sided weakness and slurred speech starting 90 minutes ago. Write an URGENT referral to the stroke team.",
      notes: ["71-year-old man, sudden left-sided weakness + slurred speech, onset 90 min ago", "Blood pressure 190/110; blood sugar normal", "No head injury; no known bleeding disorders", "On aspirin; allergy to penicillin", "CT head requested; patient anxious, wife present"],
      structure: ["Opening: URGENT + suspected diagnosis + time of onset", "Key observations: vitals and neurological signs", "Relevant history and medications", "Actions already taken", "Closing: request immediate review"]
    },
    {
      id: "transfer-agedcare",
      title: "Transfer: Aged-Care Facility",
      scenario: "You are a hospital nurse. Mrs Elena Rossi, 82, is medically stable after a fall and hip fracture repair, but needs ongoing rehabilitation. Write a transfer letter to the aged-care facility.",
      notes: ["82-year-old woman, hip fracture repaired surgically 10 days ago", "Medically stable; wound healing well", "Needs daily physiotherapy + assistance with mobility", "Mild confusion at night; reassured by familiar routine", "Daughter is main contact; visits daily"],
      structure: ["Opening: purpose — transfer for rehabilitation", "Medical background and current stability", "Care needs: physio, mobility, wound monitoring", "Cognitive/social notes relevant to settling in", "Closing: family contact + thanks"]
    }
  ]
};
