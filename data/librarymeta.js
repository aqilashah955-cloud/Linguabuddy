// LinguaBuddy curated content — digital library metadata: genre, SLOs, prediction, vocab, inference, writing
export const DATA_VERSION_LIBRARYMETA = "1.0.0";
export const LIBRARYMETA = {
  "lost-in-the-hills": {
    genre: "Adventure",
    sloIds: ["reading"],
    prediction: "What do you think will happen to the two children in the hills?",
    vocab: [
      { word: "hills", def: "Small mountains; raised land." },
      { word: "path", def: "A way to walk from one place to another." },
      { word: "afraid", def: "Feeling fear." }
    ],
    inference: { q: "Why was Ali not afraid when they lost the path?", o: ["He knew how to use the sun to find the way", "He had a map in his pocket", "He was not really lost", "His mother was walking with them"], a: 0 },
    writing: "Write about a time you lost your way \u2014 or what you would do if it happened to you."
  },
  "cave-of-echoes": {
    genre: "Adventure",
    sloIds: ["reading"],
    prediction: "What do you think the Cave of Echoes sounds like?",
    vocab: [
      { word: "echo", def: "A sound that comes back after hitting a wall." },
      { word: "shouted", def: "Said something very loudly." },
      { word: "grandfather", def: "The father of your father or mother." }
    ],
    inference: { q: "Why did the cave 'answer' Daniyal?", o: ["A person was hiding inside", "His grandfather was copying him", "The wind was blowing hard", "His voice bounced off the back wall"], a: 3 },
    writing: "Describe a place near your home where you could hear an echo. What would you shout there?"
  },
  "storm-over-k2": {
    genre: "Adventure",
    sloIds: ["reading"],
    prediction: "What dangers might climbers face on K2?",
    vocab: [
      { word: "storm", def: "Very bad weather with strong wind and snow or rain." },
      { word: "climbers", def: "People who climb mountains." },
      { word: "brave", def: "Not afraid; showing courage." }
    ],
    inference: { q: "Why did Captain Rashid turn the team back even though some wanted to continue?", o: ["He was too tired to climb", "He had lost the map", "He believed safety mattered more than reaching the top", "The team voted to stop"], a: 2 },
    writing: "Write a diary entry as one of the climbers on the night of the storm."
  },
  "missing-school-bell": {
    genre: "Mystery",
    sloIds: ["reading"],
    prediction: "Where do you think the school bell could be?",
    vocab: [
      { word: "bell", def: "A metal object that rings to give a signal." },
      { word: "assembly", def: "When all students gather together in school." },
      { word: "repair", def: "To fix something that is broken." }
    ],
    inference: { q: "How did Ayesha find the bell?", o: ["She followed a soft sound to the music room", "She asked the head teacher", "She saw it lying in the garden", "Uncle Kareem told her where it was"], a: 0 },
    writing: "Write about a small mystery you once solved at home or at school."
  },
  "footprints-in-the-snow": {
    genre: "Mystery",
    sloIds: ["reading"],
    prediction: "Who do you think walked in the garden at night?",
    vocab: [
      { word: "snow", def: "Soft white flakes that fall in cold weather." },
      { word: "footprints", def: "Marks left by feet on the ground." },
      { word: "mystery", def: "Something strange that is hard to explain." }
    ],
    inference: { q: "Why did the grandfather go to the shed so early in the morning?", o: ["To hide from Hina", "To meet a friend", "To sleep there quietly", "To fetch dry wood before the snow melted"], a: 3 },
    writing: "Write what Hina and her grandfather do together the next morning."
  },
  "the-locked-library": {
    genre: "Mystery",
    sloIds: ["reading"],
    prediction: "What do you think is inside the locked room?",
    vocab: [
      { word: "locked", def: "Shut with a key so it cannot be opened." },
      { word: "library", def: "A room or building full of books." },
      { word: "treasure", def: "Valuable things like gold or jewels." }
    ],
    inference: { q: "Why does the writer call the diaries the 'true treasure'?", o: ["They were worth a lot of money", "They were made of gold", "They held the real stories of children like them", "They were the oldest books in the room"], a: 2 },
    writing: "Imagine you find a 90-year-old diary in your school. Write what its first page might say."
  },
  "why-sky-blue": {
    genre: "Science",
    sloIds: ["reading"],
    prediction: "Why do you think the sky looks blue?",
    vocab: [
      { word: "sky", def: "The space above the Earth where clouds are." },
      { word: "sunlight", def: "Light that comes from the sun." },
      { word: "rainbow", def: "Colors seen in the sky after rain." }
    ],
    inference: { q: "Why do we see blue and not the other colors of sunlight?", o: ["The other colors are hidden by clouds", "Our eyes cannot see other colors", "The sun only sends blue light", "Tiny bits of air scatter blue light in all directions"], a: 3 },
    writing: "Explain to a younger child why the sky is blue, using your own words."
  },
  "journey-of-a-raindrop": {
    genre: "Science",
    sloIds: ["reading"],
    prediction: "Where do you think a raindrop travels?",
    vocab: [
      { word: "raindrop", def: "A single drop of rain." },
      { word: "journey", def: "A long trip from one place to another." },
      { word: "cloud", def: "White or grey mass of tiny water drops in the sky." }
    ],
    inference: { q: "Why did Tip have to 'go down' from the cloud?", o: ["The wind pushed him down", "He was tired of flying", "The cloud grew heavy and cold", "The sun called him back"], a: 2 },
    writing: "Write Tip's next adventure \u2014 what happens on an even hotter day?"
  },
  "honeybee-city": {
    genre: "Science",
    sloIds: ["reading"],
    prediction: "What jobs do you think bees have inside a hive?",
    vocab: [
      { word: "honey", def: "Sweet food made by bees." },
      { word: "queen", def: "The female bee that lays eggs." },
      { word: "dance", def: "To move the body in a pattern or rhythm." }
    ],
    inference: { q: "Why is the waggle dance important for the hive?", o: ["It tells other bees where to find flowers", "It entertains the queen", "It keeps the hive warm", "It scares enemies away"], a: 0 },
    writing: "Describe a day in the life of a worker bee, from morning to night."
  },
  "volcano-birth": {
    genre: "Science",
    sloIds: ["reading"],
    prediction: "How do you think a volcano is formed?",
    vocab: [
      { word: "volcano", def: "A mountain that throws out lava and ash." },
      { word: "magma", def: "Hot melted rock under the Earth." },
      { word: "eruption", def: "When a volcano throws out lava and ash." }
    ],
    inference: { q: "Why can a destructive eruption also be a beginning?", o: ["It makes the land richer for farming only", "It moves the tectonic plates", "It brings heavy rain", "Cooled lava builds new land where life can start"], a: 3 },
    writing: "Imagine you are a scientist visiting Surtsey. Describe what you see."
  },
  "edhi-sahib": {
    genre: "Biography",
    sloIds: ["reading"],
    prediction: "What kind of person do you think Edhi was?",
    vocab: [
      { word: "ambulance", def: "A van that carries sick people to hospital." },
      { word: "simple", def: "Not fancy; plain." },
      { word: "orphanages", def: "Homes for children without parents." }
    ],
    inference: { q: "Why did people trust Edhi with their money?", o: ["He was already rich", "He was famous on television", "He lived simply and used everything to help others", "The government ordered them to"], a: 2 },
    writing: "Write three ways you can help people in your own neighborhood."
  },
  "marie-curie": {
    genre: "Biography",
    sloIds: ["reading"],
    prediction: "What do you think Marie Curie discovered?",
    vocab: [
      { word: "scientist", def: "A person who studies science." },
      { word: "prize", def: "Something given to a winner." },
      { word: "laboratory", def: "A room where scientists work." }
    ],
    inference: { q: "Why was it remarkable that she won two Nobel Prizes?", o: ["She was the first woman to win, and won in two different sciences", "She was very young", "She won them in the same year", "She shared them only with her husband"], a: 0 },
    writing: "Write a short speech praising a scientist you admire."
  },
  "ibn-battuta": {
    genre: "Biography",
    sloIds: ["reading"],
    prediction: "How far do you think one man could travel 700 years ago?",
    vocab: [
      { word: "journey", def: "A long trip from one place to another." },
      { word: "judge", def: "A person who decides cases in a court." },
      { word: "pilgrimage", def: "A journey to a holy place." }
    ],
    inference: { q: "Why is the Rihla valuable to us today?", o: ["It is made of gold", "It has maps of the future", "It is the longest book ever written", "It lets us see the medieval world through his eyes"], a: 3 },
    writing: "Write a page from your own travel diary about a place you visited."
  },
  "morning-song": {
    genre: "Poetry",
    sloIds: ["reading"],
    prediction: "What sounds do you hear in the morning?",
    vocab: [
      { word: "morning", def: "The early part of the day." },
      { word: "birds", def: "Small animals with wings that can fly." },
      { word: "joy", def: "Great happiness." }
    ],
    inference: { q: "What feeling does the poem give about mornings?", o: ["Sadness", "Fear", "Joy and freshness", "Boredom"], a: 2 },
    writing: "Write four more lines to continue the poem."
  },
  "my-little-boat": {
    genre: "Poetry",
    sloIds: ["reading"],
    prediction: "Where will the little boat sail?",
    vocab: [
      { word: "boat", def: "A small vehicle that travels on water." },
      { word: "paper", def: "Thin material used for writing." },
      { word: "float", def: "To stay on top of water." }
    ],
    inference: { q: "Why does the poet ask the boat to come back before moonrise?", o: ["So it returns safely before night", "The moon will break it", "The ducks sleep at night", "Paper melts in moonlight"], a: 0 },
    writing: "Write a short poem about your own paper boat."
  },
  "the-monsoon": {
    genre: "Poetry",
    sloIds: ["reading"],
    prediction: "What does the monsoon bring?",
    vocab: [
      { word: "monsoon", def: "The season of heavy rain." },
      { word: "puddles", def: "Small pools of rainwater." },
      { word: "farmers", def: "People who grow crops." }
    ],
    inference: { q: "Why do the farmers smile in the poem?", o: ["The rain will help their crops grow", "They like dancing in rain", "They enjoy the puddles", "The summer is finally over"], a: 0 },
    writing: "Describe the first rain of the monsoon in your own words."
  },
  "mountains-are-calling": {
    genre: "Poetry",
    sloIds: ["reading"],
    prediction: "What would you do in the mountains?",
    vocab: [
      { word: "mountains", def: "Very high land; big hills." },
      { word: "brave", def: "Not afraid; showing courage." },
      { word: "dreaming", def: "Thinking of pleasant things; having dreams." }
    ],
    inference: { q: "What does the poet want the reader to feel?", o: ["Fear of heights", "Excitement and courage to explore", "Sadness", "Tiredness"], a: 1 },
    writing: "Write a short poem inviting a friend to visit your favorite place."
  },
  "city-of-mohenjodaro": {
    genre: "History",
    sloIds: ["reading"],
    prediction: "What would a 4,500-year-old city look like?",
    vocab: [
      { word: "ancient", def: "Very, very old." },
      { word: "streets", def: "Roads in a town or city." },
      { word: "archaeologists", def: "People who dig up old things to study history." }
    ],
    inference: { q: "What shows that Mohenjo-daro was a planned, advanced city?", o: ["It had gold everywhere", "Straight streets, drains, wells, and the Great Bath", "It was very small", "Kings lived in tents there"], a: 1 },
    writing: "Imagine you live in Mohenjo-daro. Describe your house and your street."
  },
  "truck-art-pakistan": {
    genre: "History",
    sloIds: ["reading"],
    prediction: "Why would someone paint a whole truck?",
    vocab: [
      { word: "decorated", def: "Made beautiful with colors and designs." },
      { word: "pride", def: "The feeling of being proud." },
      { word: "patterns", def: "Repeated pretty designs." }
    ],
    inference: { q: "Why do drivers decorate their trucks so richly?", o: ["To drive faster", "It is their pride and second home", "It is required by law", "To hide damage"], a: 1 },
    writing: "Design your own truck: what would you paint on it, and why?"
  },
  "the-silk-road": {
    genre: "History",
    sloIds: ["reading"],
    prediction: "What traveled on the Silk Road besides silk?",
    vocab: [
      { word: "silk", def: "A soft, smooth cloth." },
      { word: "traders", def: "People who buy and sell goods." },
      { word: "routes", def: "Ways or paths for travel." }
    ],
    inference: { q: "Why does the writer say a road can carry ideas?", o: ["Roads are made of ideas", "Traders shared news, foods, and inventions as they traveled", "Ideas are light to carry", "Books were invented there"], a: 1 },
    writing: "You are a trader on the Silk Road. Write a letter home describing your journey."
  },
  "parrot-who-lied": {
    genre: "Humor",
    sloIds: ["reading"],
    prediction: "What funny things might the parrot say?",
    vocab: [
      { word: "parrot", def: "A colorful bird that can copy sounds." },
      { word: "copy", def: "To do the same as another." },
      { word: "guests", def: "People invited to visit." }
    ],
    inference: { q: "Why did everyone laugh instead of getting angry at Mithu?", o: ["The parrot was wrong but harmless and funny", "They did not hear him", "The teacher told them to laugh", "Parrots can never be wrong"], a: 0 },
    writing: "Write a funny scene where Mithu says the wrong thing at a wedding."
  },
  "backwards-day": {
    genre: "Humor",
    sloIds: ["reading"],
    prediction: "What would you do on a backwards day?",
    vocab: [
      { word: "backwards", def: "In the opposite direction." },
      { word: "announcement", def: "Something told to everyone." },
      { word: "tradition", def: "Something a family does again and again." }
    ],
    inference: { q: "Why did the family enjoy Backwards Day even though normal days are easier?", o: ["They like breaking the rules just once in a while", "They won a prize", "Guests joined them", "It rained all day"], a: 0 },
    writing: "Plan your own Backwards Day \u2014 list five backwards things you would do."
  },
  "the-talking-lamp": {
    genre: "Fantasy",
    sloIds: ["reading"],
    prediction: "What stories could an old lamp tell?",
    vocab: [
      { word: "lamp", def: "An object that gives light." },
      { word: "brass", def: "A yellow metal." },
      { word: "trunk", def: "A big box for keeping things." }
    ],
    inference: { q: "How did the lamp 'know' all the stories of the house?", o: ["It was truly magic", "Grandmother had lived through them all and was telling them", "Ayesha dreamed the whole thing", "The trunk whispered to the lamp"], a: 1 },
    writing: "If an old object in your home could talk, what story would it tell?"
  },
  "dragon-of-the-glacier": {
    genre: "Fantasy",
    sloIds: ["reading"],
    prediction: "Do you think the dragon is real?",
    vocab: [
      { word: "glacier", def: "A huge river of ice." },
      { word: "dragon", def: "A large fire-breathing animal in stories." },
      { word: "curious", def: "Wanting to know more." }
    ],
    inference: { q: "Why did Karim keep the shiny stone even after learning the truth?", o: ["He wanted to sell it", "A small part of him still loved the wonder of the legend", "He forgot to throw it away", "He thought it was valuable"], a: 1 },
    writing: "Write a legend about a strange sound in your own area."
  }
};
