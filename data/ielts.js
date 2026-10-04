// LinguaBuddy curated content — IELTS test prep.
// Versioned data module. Works offline; zero Firestore read costs.
// Question types: tfng (True/False/Not Given), mcq, heading (match heading to paragraph).
// a: for tfng is "T" | "F" | "NG"; for mcq/heading it is the option index.
// ref: paragraph letter proving the answer. why: short explanation shown after marking.
export const DATA_VERSION_IELTS = "1.0.0";

export const IELTS_READING = [
{
  id: "sleep", title: "The Science of Sleep",
  paras: [
    { h: "A", text: "For centuries, sleep was seen as a passive state — the brain simply switching off for the night. Modern research has overturned this idea completely. We now know that the sleeping brain is highly active, sorting the day's experiences, strengthening important memories and clearing out waste products that build up while we are awake. Scientists believe that without this nightly maintenance, the brain would quickly become overloaded and inefficient." },
    { h: "B", text: "Sleep unfolds in repeating cycles of about ninety minutes, moving between two main types: non-REM and REM sleep. Non-REM sleep has three stages, from light drowsiness to deep, slow-wave sleep, during which the body repairs tissue and releases growth hormone. REM — rapid eye movement — sleep follows, and this is when most vivid dreaming occurs. The brain replays the day's learning during REM, which is why a full night of unbroken cycles matters more than simply the total hours slept." },
    { h: "C", text: "Modern life, however, constantly disrupts these cycles. The blue light from phones and laptops tricks the brain into thinking it is still daytime, delaying the release of melatonin, the hormone that signals sleepiness. Caffeine blocks the brain's tiredness signals for up to eight hours, while irregular bedtimes confuse the body's internal clock. Studies show that people who stare at screens late at night take significantly longer to fall asleep and spend less time in deep sleep." },
    { h: "D", text: "Fortunately, small changes can greatly improve sleep quality. Experts recommend keeping the bedroom cool, dark and quiet, avoiding caffeine after midday, and going to bed at the same time every day — even on weekends. Short naps of twenty minutes can boost alertness without causing grogginess, but longer daytime naps may steal sleep from the coming night. Above all, treating sleep as a priority rather than a luxury may be one of the simplest ways to protect both memory and health." }
  ],
  questions: [
    { t: "tfng", q: "Scientists once believed the brain was inactive during sleep.", ref: "A", a: "T",
      why: "Paragraph A says sleep was seen as the brain 'simply switching off' — now known to be wrong." },
    { t: "tfng", q: "Deep, slow-wave sleep happens during REM sleep.", ref: "B", a: "F",
      why: "Paragraph B places deep slow-wave sleep in non-REM; REM is when vivid dreaming occurs." },
    { t: "tfng", q: "Caffeine blocks tiredness signals for exactly eight hours.", ref: "C", a: "F",
      why: "Paragraph C says 'up to eight hours' — not exactly eight." },
    { t: "mcq", q: "What does the sleeping brain do with waste products?", ref: "A",
      o: ["It stores them until morning", "It clears them out", "It converts them into energy", "It moves them to the body"], a: 1,
      why: "Paragraph A: the brain is 'clearing out waste products that build up while we are awake'." },
    { t: "mcq", q: "Why is unbroken sleep important?", ref: "B",
      o: ["It increases total dreaming time", "It allows complete sleep cycles", "It lowers body temperature", "It shortens each cycle"], a: 1,
      why: "Paragraph B: 'a full night of unbroken cycles matters more than simply the total hours slept'." },
    { t: "mcq", q: "According to the passage, a twenty-minute nap…", ref: "D",
      o: ["causes grogginess", "can boost alertness", "replaces a night's sleep", "improves memory directly"], a: 1,
      why: "Paragraph D: 'Short naps of twenty minutes can boost alertness without causing grogginess'." },
    { t: "heading", para: "B", q: "Which heading best fits paragraph B?", ref: "B",
      heads: ["A nightly cleaning process", "The stages of a sleep cycle", "Modern threats to healthy sleep", "Simple steps for better rest", "Why we dream at night"], a: 1,
      why: "Paragraph B describes the repeating cycles of non-REM and REM sleep." },
    { t: "heading", para: "C", q: "Which heading best fits paragraph C?", ref: "C",
      heads: ["A nightly cleaning process", "The stages of a sleep cycle", "Modern threats to healthy sleep", "Simple steps for better rest", "Why we dream at night"], a: 2,
      why: "Paragraph C is about screens, caffeine and irregular bedtimes disrupting sleep." }
  ]
},
{
  id: "bees", title: "Urban Beekeeping",
  paras: [
    { h: "A", text: "On rooftops in London, Paris and New York, thousands of beehives now hum above the traffic. Urban beekeeping — keeping honeybee colonies in cities — has grown rapidly over the past two decades. What began as a hobby for a few enthusiasts has become a movement, with city councils in many countries relaxing old bans on keeping bees within city limits." },
    { h: "B", text: "Surprisingly, cities can be excellent places for bees. Urban gardens, parks and even window boxes provide flowers for much of the year, giving bees a more varied diet than the single-crop fields of the countryside. Cities are also warmer than surrounding areas, which extends the foraging season, and many urban gardeners avoid the pesticides that are widely used on farms. As a result, city hives often produce more honey than rural ones." },
    { h: "C", text: "The trend is not without problems. When too many hives crowd into one area, bees compete for limited flowers, and weaker colonies may starve. Swarms — when a colony splits and thousands of bees cluster in a public place — can alarm residents, although swarming bees are generally calm. Most cities therefore require beekeepers to complete training and register their hives, and some limit the number of hives per neighbourhood." },
    { h: "D", text: "Supporters argue the benefits outweigh the difficulties. Beyond the honey harvest, urban bees pollinate city gardens and parks, improving local food growing. Community apiaries — shared hives managed by volunteers — have brought neighbours together and taught children where food comes from. For many keepers, the greatest reward is simply watching a thriving colony against the unlikely backdrop of the city skyline." }
  ],
  questions: [
    { t: "tfng", q: "Keeping bees was once banned in some cities.", ref: "A", a: "T",
      why: "Paragraph A mentions councils 'relaxing old bans on keeping bees within city limits'." },
    { t: "tfng", q: "City bees have a less varied diet than countryside bees.", ref: "B", a: "F",
      why: "Paragraph B says city flowers give bees 'a more varied diet than the single-crop fields of the countryside'." },
    { t: "tfng", q: "Swarming bees are usually aggressive.", ref: "C", a: "F",
      why: "Paragraph C says 'swarming bees are generally calm'." },
    { t: "mcq", q: "Why do city hives often produce more honey than rural ones?", ref: "B",
      o: ["City bees work longer hours", "Flowers are available for more of the year", "There are fewer beekeepers in cities", "Urban honey contains more sugar"], a: 1,
      why: "Paragraph B: varied flowers, a longer foraging season and fewer pesticides help city hives." },
    { t: "mcq", q: "What do most cities require of beekeepers?", ref: "C",
      o: ["Payment of a large annual fee", "Training and hive registration", "At least five years of experience", "Weekly government inspections"], a: 1,
      why: "Paragraph C: 'require beekeepers to complete training and register their hives'." },
    { t: "mcq", q: "What is described as the greatest reward for many keepers?", ref: "D",
      o: ["Selling honey at high prices", "Teaching children about food", "Watching a thriving colony in the city", "Winning beekeeping competitions"], a: 2,
      why: "Paragraph D: 'the greatest reward is simply watching a thriving colony against the unlikely backdrop of the city skyline'." },
    { t: "heading", para: "A", q: "Which heading best fits paragraph A?", ref: "A",
      heads: ["A surprising home for bees", "Rules for city beekeepers", "The rise of a city hobby", "Comparing honey harvests", "Bees bring neighbours together"], a: 2,
      why: "Paragraph A describes how urban beekeeping grew from a hobby into a movement." },
    { t: "heading", para: "D", q: "Which heading best fits paragraph D?", ref: "D",
      heads: ["A surprising home for bees", "Rules for city beekeepers", "The rise of a city hobby", "Comparing honey harvests", "Bees bring neighbours together"], a: 4,
      why: "Paragraph D focuses on pollination, community apiaries and neighbours coming together." }
  ]
},
{
  id: "paper", title: "The History of Paper",
  paras: [
    { h: "A", text: "Long before paper existed, humans recorded information on whatever materials they could find. The ancient Sumerians pressed symbols into clay tablets, while the Egyptians wrote on papyrus — sheets made by pressing together strips of a river reed. Both materials worked, but clay was heavy and fragile, and papyrus was expensive and cracked easily when folded." },
    { h: "B", text: "True paper was invented in China around 105 AD, traditionally credited to a court official named Cai Lun. He discovered that bark, rags and old fishing nets, soaked and pounded into a pulp, could be spread thin and dried into light, flexible sheets. The Chinese government quickly recognised the value of the invention: paper was cheaper than silk, which had also been used for writing, and far more practical than heavy bamboo strips." },
    { h: "C", text: "For centuries, China guarded the secret of papermaking, but knowledge gradually travelled west along the Silk Road. By the 8th century, paper mills operated in the Arab world, where scholars used the cheap new material to copy books on medicine, mathematics and astronomy. Paper reached Europe much later — the first European mills appeared in Spain in the 12th century — and it played a vital role in the spread of printing after Gutenberg's press was invented." },
    { h: "D", text: "The final revolution came in the 19th century, when inventors learned to make paper from wood pulp instead of rags. Rag supplies could never have met the demands of newspapers and mass education, but wood was abundant and cheap. Within decades, giant paper machines were producing rolls of paper at astonishing speed, turning what had once been a precious craft material into one of the most ordinary objects in daily life." }
  ],
  questions: [
    { t: "tfng", q: "Papyrus was made from a plant that grew near rivers.", ref: "A", a: "T",
      why: "Paragraph A: papyrus was made from 'strips of a river reed'." },
    { t: "tfng", q: "Cai Lun invented paper using only tree bark.", ref: "B", a: "F",
      why: "Paragraph B lists 'bark, rags and old fishing nets' — not bark alone." },
    { t: "tfng", q: "Wood-pulp paper was more expensive to make than rag paper.", ref: "D", a: "F",
      why: "Paragraph D: 'wood was abundant and cheap'." },
    { t: "mcq", q: "Why did the Chinese government value paper?", ref: "B",
      o: ["It lasted longer than stone tablets", "It was cheaper than silk and more practical than bamboo", "It could be produced without water", "It was decorated with beautiful colours"], a: 1,
      why: "Paragraph B: 'paper was cheaper than silk … and far more practical than heavy bamboo strips'." },
    { t: "mcq", q: "What did Arab scholars use paper for?", ref: "C",
      o: ["Wrapping goods for trade", "Copying books on medicine, mathematics and astronomy", "Building lightweight houses", "Making sails for ships"], a: 1,
      why: "Paragraph C: scholars 'used the cheap new material to copy books on medicine, mathematics and astronomy'." },
    { t: "mcq", q: "When did the first European paper mills appear?", ref: "C",
      o: ["The 8th century", "The 10th century", "The 12th century", "The 15th century"], a: 2,
      why: "Paragraph C: 'the first European mills appeared in Spain in the 12th century'." },
    { t: "heading", para: "B", q: "Which heading best fits paragraph B?", ref: "B",
      heads: ["Writing before paper", "A Chinese breakthrough", "Paper travels west", "The wood-pulp revolution", "Paper meets the printing press"], a: 1,
      why: "Paragraph B describes Cai Lun's invention of true paper in China." },
    { t: "heading", para: "D", q: "Which heading best fits paragraph D?", ref: "D",
      heads: ["Writing before paper", "A Chinese breakthrough", "Paper travels west", "The wood-pulp revolution", "Paper meets the printing press"], a: 3,
      why: "Paragraph D is about 19th-century paper made from wood pulp." }
  ]
}
];

/* ================= IELTS LISTENING =================
   Scripts are read aloud by the device TTS (▶ Play audio, one replay).
   fill: type the missing word — answers list accepted alternatives. */
export const IELTS_LISTENING = [
{
  id: "library", title: "Joining the City Library",
  kind: "conversation",
  script: "Librarian: Good morning! How can I help you? Student: Hi, I'd like to join the library, please. Librarian: Of course. Are you a student here in the city? Student: Yes, I'm studying engineering at the City University. My name is Daniel Park. Librarian: Welcome, Daniel. Membership is free for students. Can I have your address? Student: It's 14 River Road, Apartment 5. Librarian: And a phone number? Student: 07700 900461. Librarian: Great. Now, the library is open from 8 a.m. to 10 p.m. on weekdays, and 9 a.m. to 6 p.m. on Saturdays. We're closed on Sundays. Student: Can I borrow DVDs as well as books? Librarian: Yes — you can borrow up to six items at a time, including DVDs, for three weeks. If you're late returning them, there's a fine of 50 cents per day. Student: And is there free Wi-Fi? Librarian: Yes, throughout the building. The password changes every month — it's written on the notice board near the entrance. Student: Perfect. Thank you!",
  questions: [
    { t: "mcq", q: "What is Daniel studying?",
      o: ["Medicine", "Engineering", "Law", "Architecture"], a: 1,
      why: "He says: 'I'm studying engineering at the City University.'" },
    { t: "fill", q: "Daniel's address is 14 ______ Road.", a: ["river"],
      why: "'It's 14 River Road, Apartment 5.'" },
    { t: "fill", q: "The library closes at ______ p.m. on weekdays.", a: ["10", "ten"],
      why: "'open from 8 a.m. to 10 p.m. on weekdays'." },
    { t: "mcq", q: "How many items can Daniel borrow at one time?",
      o: ["Three", "Four", "Six", "Eight"], a: 2,
      why: "'you can borrow up to six items at a time'." },
    { t: "fill", q: "The fine for late returns is ______ cents per day.", a: ["50", "fifty"],
      why: "'there's a fine of 50 cents per day'." },
    { t: "mcq", q: "Where can Daniel find the Wi-Fi password?",
      o: ["On the library website", "On the notice board near the entrance", "At the front desk", "In a welcome email"], a: 1,
      why: "'it's written on the notice board near the entrance'." }
  ]
},
{
  id: "museum", title: "Museum Audio Guide",
  kind: "monologue",
  script: "Welcome to the City Museum of Natural History. You are standing in the Dinosaur Gallery, our most popular room. The skeleton in front of you is a Tyrannosaurus rex, discovered in Montana in 1990. It is 12 metres long and around 67 million years old. Please do not touch the exhibits. Photography is allowed, but flash is not, because bright light can damage the fossils. The museum café on the ground floor is open from 10 a.m. to 4 p.m. and serves hot meals and drinks. The gift shop next to the café sells books, posters and model dinosaurs. Guided tours in English leave from the main entrance every hour, starting at 11 a.m. Tours last about 45 minutes and are free with your ticket. Before you leave, don't miss the Ocean Hall on the second floor, where you can see a life-size model of a blue whale — the largest animal that has ever lived.",
  questions: [
    { t: "mcq", q: "Where was the Tyrannosaurus rex discovered?",
      o: ["Texas", "Montana", "Arizona", "Canada"], a: 1,
      why: "'discovered in Montana in 1990'." },
    { t: "fill", q: "The skeleton is ______ metres long.", a: ["12", "twelve"],
      why: "'It is 12 metres long'." },
    { t: "mcq", q: "Why is flash photography not allowed?",
      o: ["It disturbs other visitors", "Bright light can damage the fossils", "It drains the camera battery", "It is against museum policy only"], a: 1,
      why: "'flash is not [allowed], because bright light can damage the fossils'." },
    { t: "fill", q: "The museum café is open until ______ p.m.", a: ["4", "four"],
      why: "'open from 10 a.m. to 4 p.m.'" },
    { t: "mcq", q: "How often do the guided tours leave?",
      o: ["Every 30 minutes", "Every hour", "Every two hours", "Twice a day"], a: 1,
      why: "'Guided tours in English leave from the main entrance every hour'." },
    { t: "fill", q: "The Ocean Hall is on the ______ floor.", a: ["second", "2nd"],
      why: "'the Ocean Hall on the second floor'." }
  ]
},
{
  id: "tides", title: "The Power of Tides",
  kind: "academic talk",
  script: "Good afternoon, everyone. In today's environmental science lecture, we'll look at tidal energy — electricity made from the rise and fall of ocean tides. Unlike solar or wind power, tides are completely predictable. We know exactly when high and low tide will occur, years in advance, because they are caused by the gravitational pull of the moon. This reliability is tidal energy's greatest advantage. However, there are challenges. Building tidal power stations is very expensive, and suitable locations are limited to coastal areas with a large difference between high and low tide — at least five metres. There are also concerns about the effect on marine life, as underwater turbines can disturb fish and mammals. Despite these problems, several countries are investing heavily. South Korea opened one of the world's largest tidal power plants in 2011, and projects are underway in France and the United Kingdom. Engineers believe that as technology improves, costs will fall significantly over the next twenty years. So, to summarise: tidal energy is clean, reliable but costly. Whether it becomes a major energy source will depend on future innovation.",
  questions: [
    { t: "mcq", q: "What causes the tides?",
      o: ["Wind patterns", "The gravitational pull of the moon", "Ocean currents", "Underwater earthquakes"], a: 1,
      why: "'they are caused by the gravitational pull of the moon'." },
    { t: "mcq", q: "What is described as tidal energy's greatest advantage?",
      o: ["It is very cheap", "It is completely predictable", "It works anywhere", "It needs no maintenance"], a: 1,
      why: "'This reliability is tidal energy's greatest advantage.'" },
    { t: "fill", q: "Suitable locations need a tide difference of at least ______ metres.", a: ["five", "5"],
      why: "'at least five metres'." },
    { t: "mcq", q: "What is a concern about underwater turbines?",
      o: ["They are too noisy", "They can disturb fish and mammals", "They block shipping routes", "They rust too quickly"], a: 1,
      why: "'underwater turbines can disturb fish and mammals'." },
    { t: "fill", q: "South Korea opened a large tidal power plant in ______.", a: ["2011"],
      why: "'South Korea opened one of the world's largest tidal power plants in 2011'." },
    { t: "mcq", q: "What does the speaker say about future costs?",
      o: ["They will rise sharply", "They will stay the same", "They will fall significantly", "They cannot be predicted"], a: 2,
      why: "'as technology improves, costs will fall significantly over the next twenty years'." }
  ]
}
];

/* ================= IELTS WRITING =================
   Charts/processes are described IN WORDS (no images in the app).
   structure: paragraph-by-paragraph plan. We never write a model answer —
   the learner writes, and analyzeWriting() gives criteria-mapped feedback. */
export const IELTS_WRITING = [
{ id: "t1-internet", task: 1, minWords: 150, timeMin: 20,
  prompt: "The chart below shows the percentage of households in three countries (Country A, Country B and Country C) with internet access between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  structure: ["Paragraph 1 — Introduction: paraphrase the prompt in your own words (what, where, when).", "Paragraph 2 — Overview: the big picture WITHOUT numbers. E.g. which country started highest, which grew fastest, and where they ended up.", "Paragraph 3 — Details 2000–2010: report key figures and compare the three countries.", "Paragraph 4 — Details 2010–2020: report key figures; note any country that overtook another."],
  lang: ["the percentage rose steadily", "overtook", "remained stable", "in contrast", "while"] },
{ id: "t1-coffee", task: 1, minWords: 150, timeMin: 20,
  prompt: "The diagram below shows the stages in the production of coffee, from growing the beans to packaging the final product. Summarise the information by selecting and reporting the main features.",
  structure: ["Paragraph 1 — Introduction: paraphrase what the diagram shows.", "Paragraph 2 — Overview: how many stages there are, and the start/end points — without details.", "Paragraph 3 — First half of the process: growing, picking, drying the beans. Use passive voice and sequencing words.", "Paragraph 4 — Second half: roasting, grinding, packaging."],
  lang: ["is harvested", "are dried", "firstly / secondly / finally", "at this stage", "the beans are then…"] },
{ id: "t1-rainfall", task: 1, minWords: 150, timeMin: 20,
  prompt: "The bar chart below compares average monthly rainfall (in millimetres) in two cities, Karachi and London, over a twelve-month period. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  structure: ["Paragraph 1 — Introduction: paraphrase (what is compared, units, time period).", "Paragraph 2 — Overview: the main contrast — e.g. one city has most rain in summer, the other in winter — without numbers.", "Paragraph 3 — Details for Karachi: wettest/driest months with figures.", "Paragraph 4 — Details for London: wettest/driest months with figures; direct comparisons."],
  lang: ["in comparison", "by contrast", "the wettest month", "fluctuated", "reached a peak of"] },
{ id: "t1-tourists", task: 1, minWords: 150, timeMin: 20,
  prompt: "The line graph below shows the number of international tourists visiting a country each year from 1990 to 2020. Summarise the information by selecting and reporting the main features.",
  structure: ["Paragraph 1 — Introduction: paraphrase the graph's subject and time span.", "Paragraph 2 — Overview: the overall trend (e.g. steady rise, a sharp fall, recovery) — no numbers yet.", "Paragraph 3 — Details 1990–2005: key figures and turning points.", "Paragraph 4 — Details 2005–2020: key figures, the biggest change, and where the line ends."],
  lang: ["increased dramatically", "levelled off", "a sharp decline", "recovered to", "over the period"] },
{ id: "t1-jobs", task: 1, minWords: 150, timeMin: 20,
  prompt: "The table below shows the percentage of workers employed in three sectors — agriculture, industry and services — in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  structure: ["Paragraph 1 — Introduction: paraphrase what the table shows.", "Paragraph 2 — Overview: the main shifts (e.g. services grew strongly, agriculture fell) — without numbers.", "Paragraph 3 — Details for 2000: compare the three sectors with figures.", "Paragraph 4 — Details for 2020: compare again; highlight the biggest change over the twenty years."],
  lang: ["accounted for", "made up", "a significant shift", "whereas", "doubled / halved"] },
{ id: "t1-recycle", task: 1, minWords: 150, timeMin: 20,
  prompt: "The diagram below shows how recycled paper is made from used paper. Summarise the information by selecting and reporting the main features.",
  structure: ["Paragraph 1 — Introduction: paraphrase what the diagram shows.", "Paragraph 2 — Overview: number of stages, from collection to finished rolls — no details.", "Paragraph 3 — Collection to pulp: collecting, sorting, soaking and cleaning.", "Paragraph 4 — Pulp to paper: pressing, drying, rolling. Use passive voice throughout."],
  lang: ["is collected", "is then soaked", "after that", "finally", "the resulting pulp"] },
{ id: "t2-freeuni", task: 2, minWords: 250, timeMin: 40,
  prompt: "Some people believe that university education should be free for all students. To what extent do you agree or disagree?",
  structure: ["Paragraph 1 — Introduction: paraphrase the statement + your thesis (e.g. 'I largely agree because…').", "Paragraph 2 — Main argument 1: your strongest reason, with an example.", "Paragraph 3 — Main argument 2 (or a counter-argument you then answer): show balance.", "Paragraph 4 — Conclusion: restate your opinion clearly; no new ideas."],
  lang: ["it is often argued that", "on the other hand", "for instance", "in conclusion", "in my opinion"] },
{ id: "t2-traffic", task: 2, minWords: 250, timeMin: 40,
  prompt: "Many cities face serious traffic congestion. What are the causes of this problem, and what solutions can you suggest?",
  structure: ["Paragraph 1 — Introduction: paraphrase + outline (this essay will discuss causes and solutions).", "Paragraph 2 — Causes: two causes, each explained with an example.", "Paragraph 3 — Solutions: two solutions, each linked to a cause above.", "Paragraph 4 — Conclusion: summarise causes + solutions."],
  lang: ["one major cause is", "this leads to", "to tackle this", "for example", "as a result"] },
{ id: "t2-language", task: 2, minWords: 250, timeMin: 40,
  prompt: "Some people think that children should begin learning a foreign language in primary school rather than secondary school. Do the advantages of this outweigh the disadvantages?",
  structure: ["Paragraph 1 — Introduction: paraphrase + thesis (advantages outweigh / do not outweigh).", "Paragraph 2 — Advantages: two benefits with examples.", "Paragraph 3 — Disadvantages: one or two drawbacks — then explain why they are less important.", "Paragraph 4 — Conclusion: clear answer to the question."],
  lang: ["an obvious advantage is", "however, it could be argued that", "nevertheless", "overall", "outweigh"] },
{ id: "t2-remote", task: 2, minWords: 250, timeMin: 40,
  prompt: "With remote work becoming common, some people say that offices will disappear in the future. Discuss both views and give your own opinion.",
  structure: ["Paragraph 1 — Introduction: paraphrase + 'this essay will discuss both views before giving my opinion'.", "Paragraph 2 — View 1: why offices may disappear, with reasons/examples.", "Paragraph 3 — View 2: why offices will survive, with reasons/examples.", "Paragraph 4 — Conclusion: your own opinion + brief reason."],
  lang: ["on the one hand", "on the other hand", "supporters of this view argue", "while it is true that", "personally, I believe"] },
{ id: "t2-ads", task: 2, minWords: 250, timeMin: 40,
  prompt: "Advertising encourages people to buy things they do not need. To what extent do you agree or disagree?",
  structure: ["Paragraph 1 — Introduction: paraphrase + thesis.", "Paragraph 2 — Agree side: how advertising creates unnecessary wants, with examples.", "Paragraph 3 — Disagree side (or qualification): advertising also informs; consumers have choice.", "Paragraph 4 — Conclusion: restate your position."],
  lang: ["to a large extent", "it is undeniable that", "admittedly", "for example", "in conclusion"] },
{ id: "t2-crime", task: 2, minWords: 250, timeMin: 40,
  prompt: "Some people believe the best way to reduce crime is to give longer prison sentences. Discuss both views and give your own opinion.",
  structure: ["Paragraph 1 — Introduction: paraphrase + essay plan sentence.", "Paragraph 2 — View 1: why longer sentences might deter crime.", "Paragraph 3 — View 2: why prevention/rehabilitation works better, with examples.", "Paragraph 4 — Conclusion: your opinion with a balanced final thought."],
  lang: ["those who support… claim that", "in contrast", "a more effective approach would be", "evidence suggests", "to conclude"] },
{ id: "t2-transport", task: 2, minWords: 250, timeMin: 40,
  prompt: "Some people think that public transport should be free of charge. Do the advantages of this outweigh the disadvantages?",
  structure: ["Paragraph 1 — Introduction: paraphrase + thesis.", "Paragraph 2 — Advantages: more users, less traffic and pollution.", "Paragraph 3 — Disadvantages: cost to government, overcrowding — then weigh them.", "Paragraph 4 — Conclusion: direct answer."],
  lang: ["the main benefit would be", "a significant drawback is", "despite this", "on balance", "outweigh"] },
{ id: "t2-climate", task: 2, minWords: 250, timeMin: 40,
  prompt: "Climate change is the greatest problem facing the world today. What measures can governments and individuals take to tackle it?",
  structure: ["Paragraph 1 — Introduction: paraphrase + outline (government and individual measures).", "Paragraph 2 — Government measures: two policies, explained.", "Paragraph 3 — Individual measures: two actions, explained.", "Paragraph 4 — Conclusion: summarise; restate that both levels must act."],
  lang: ["one effective measure would be", "in addition", "individuals can also", "if governments…, then…", "in conclusion"] }
];

/* ================= IELTS SPEAKING ================= */
export const IELTS_SPEAKING = {
  part1: [
    "Let's talk about your hometown. Where are you from?",
    "Do you live in a house or a flat? Can you describe it?",
    "What do you study? Why did you choose this subject?",
    "What do you do in your free time?",
    "What kind of food do you enjoy eating?",
    "How is the weather in your city at this time of year?",
    "Do you enjoy listening to music? What kind?",
    "Do you play any sports? Why or why not?",
    "Have you travelled to another city or country? Tell me about it.",
    "How much time do you spend on your phone each day?",
    "Do you prefer spending time with friends or family?",
    "What do you usually do at the weekend?"
  ],
  part2: [
    { topic: "Describe a book you enjoyed reading.",
      bullets: ["What the book was", "When you read it", "What it was about", "Why you enjoyed it"] },
    { topic: "Describe a place you would like to visit in the future.",
      bullets: ["Where the place is", "How you know about it", "What you would do there", "Why you want to visit it"] },
    { topic: "Describe a person who has had a strong influence on you.",
      bullets: ["Who the person is", "How you know them", "What they have done", "Why they influenced you"] },
    { topic: "Describe a skill you would like to learn.",
      bullets: ["What the skill is", "Why you want to learn it", "How you would learn it", "How it would help you"] },
    { topic: "Describe a memorable meal you have had.",
      bullets: ["When and where it was", "Who you were with", "What you ate", "Why it was memorable"] },
    { topic: "Describe a piece of technology you find useful.",
      bullets: ["What it is", "How you use it", "How long you have used it", "Why it is useful to you"] }
  ],
  part3: [
    "How has education changed in your country in recent years?",
    "Do you think technology has improved our lives overall? Why?",
    "What environmental problems does your country face?",
    "Is it important to protect traditional culture? Why or why not?",
    "How do you think the way people work will change in the future?",
    "What can governments do to encourage healthy lifestyles?",
    "Do you think cities are better places to live than the countryside?",
    "What skills will young people need most in the future?"
  ]
};

/* ================= IELTS TIPS ================= */
export const IELTS_TIPS = {
  reading: [
    "Skim first: read the questions before the passage so you know what to look for.",
    "For True/False/Not Given: match the statement's meaning, not just its words.",
    "'Not Given' means the passage neither confirms nor denies it — don't guess from general knowledge.",
    "Matching headings: read the first and last sentence of each paragraph first.",
    "Watch the clock: 20 minutes per passage is the safe pace in the real test.",
    "Spelling counts in short answers — copy words exactly as they appear."
  ],
  listening: [
    "Read the questions BEFORE the audio starts and underline key words.",
    "You hear each recording only once in the real test — stay focused.",
    "For fill-in-the-blank: check grammar — the word must fit the sentence.",
    "Write numbers as figures when you can; spelling still counts.",
    "If you miss an answer, move on immediately — don't lose the next one.",
    "Use the 30 seconds after each section to check and predict the next."
  ],
  writing: [
    "Task 2 is worth twice as much as Task 1 — spend 40 minutes on it.",
    "Always write a short plan before you start (2–3 minutes).",
    "Task 1 needs an overview sentence with NO numbers in it.",
    "Leave 3–5 minutes to check: articles, verb tenses, spelling.",
    "Never go under the word count (150 / 250) — it directly lowers your score.",
    "Learn 10–15 linking phrases and use them naturally, not in every sentence."
  ],
  speaking: [
    "Part 2: use the full minute to plan — write 4–5 key words, not sentences.",
    "Speak for the full 2 minutes in Part 2; stopping early loses marks.",
    "It's fine to correct yourself once — it shows control of language.",
    "Give extended answers in Part 1: answer + reason + example.",
    "In Part 3, discuss ideas generally, not just your personal experience.",
    "Pronunciation matters more than accent — speak clearly and stress key words."
  ]
};

/* ================= BAND TABLES (approximate) =================
   [minimum raw score out of 40, band]. Standard IELTS approximations. */
export const BAND_LISTENING = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
  [23, 6], [16, 5.5], [13, 4.5], [10, 4], [6, 3.5], [4, 3], [2, 2], [1, 1]
];
export const BAND_READING = [
  [39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5],
  [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [2, 2], [1, 1]
];
