// LinguaBuddy curated content — short-story reading library
// Versioned data module. Works offline; zero Firestore read costs.
export const DATA_VERSION_STORIES = "1.0.0";

export const STORIES = [
{
  id: "thirsty-crow", title: "The Thirsty Crow", difficulty: "Easy", minutes: 2,
  moral: "Where there is a will, there is a way.",
  text: "One hot summer day, a crow was flying across the fields. The sun was burning in the sky, and the poor crow was very, very thirsty. His throat was dry, and he could not fly much longer.\n\n\u201CWater! Water! I must find water,\u201D he cried. He looked left and right, but there was no pond and no river nearby. At last, far away, he saw a garden. He flew to it with his last bit of strength. There, under a tree, stood a tall pot.\n\nThe crow was delighted. He flew down and looked inside the pot. There was some water at the bottom \u2014 but the pot was tall and the water was very low. The crow put his beak inside, but he could not reach the water. He tried again and again, but it was no use. Just then, an old farmer walking by saw the thirsty bird and smiled kindly. \u201CPoor fellow! I would gladly help you, but my hands are full of tools,\u201D he said. The crow cawed softly, as if to thank him, and kept thinking hard.\n\nThe clever crow did not give up. He looked around and saw many small stones lying on the ground. An idea came into his mind. He picked up the stones one by one in his beak and dropped them into the pot. Slowly, slowly, the water began to rise. Higher and higher it came, until at last the crow could drink.\n\nHe drank the cool water happily and flew away, singing a sweet song. His hard work and clever thinking had saved his life.",
  quiz: [
    { q: "Why was the crow in trouble?", o: ["He was hungry", "He was thirsty", "He was lost", "He was hurt"], a: 1 },
    { q: "Why could the crow not drink the water at first?", o: ["The pot was empty", "The water was dirty", "The pot was tall and the water was low", "The pot was broken"], a: 2 },
    { q: "What did the crow drop into the pot?", o: ["Leaves", "Small stones", "Bread", "Sand"], a: 1 },
    { q: "What happened when the stones went into the pot?", o: ["The pot broke", "The water rose up", "The water disappeared", "Nothing happened"], a: 1 },
    { q: "What is the moral of the story?", o: ["Be greedy", "Where there is a will, there is a way", "Never drink water", "Fly high"], a: 1 }
  ]
},
{
  id: "tortoise-hare", title: "The Tortoise and the Hare", difficulty: "Easy", minutes: 3,
  moral: "Slow and steady wins the race.",
  text: "In a green forest, there lived a hare who was very proud of his speed. He always laughed at the slow tortoise. \u201CYou walk so slowly!\u201D he would say. \u201CI can run ten times faster than you.\u201D\n\nOne day, the tortoise said quietly, \u201CLet us have a race. We shall see who wins.\u201D The hare laughed loudly, but he agreed. All the animals of the forest gathered to watch the great race.\n\nThe fox marked the starting line and the finish line near the big banyan tree. \u201CReady\u2026 steady\u2026 GO!\u201D shouted the fox. The hare shot forward like an arrow. In a few seconds, he was far ahead. The tortoise started walking slowly, step by step, never stopping.\n\nSoon the hare was so far ahead that he could not even see the tortoise. \u201CI have plenty of time,\u201D he thought. \u201CLet me take a short nap under this tree.\u201D He lay down in the cool shade and fell fast asleep.\n\nMeanwhile, the tortoise kept walking \u2014 slowly, slowly, but steadily. He passed the sleeping hare without making a sound. Step by step, he moved closer to the finish line.\n\nAt last, the hare woke up. He looked around and ran as fast as he could. But it was too late! The tortoise had already crossed the finish line. All the animals cheered for the tortoise. The hare hung his head in shame. He had learned that being proud and lazy brings defeat, while patience and hard work bring victory. The story of this famous race is still told to children all over the world today.",
  quiz: [
    { q: "Why did the hare laugh at the tortoise?", o: ["The tortoise was rude", "The tortoise walked slowly", "The tortoise was ugly", "The tortoise was old"], a: 1 },
    { q: "Where was the finish line?", o: ["Near the river", "Near the big banyan tree", "On the hill", "In the cave"], a: 1 },
    { q: "What did the hare do during the race?", o: ["He kept running", "He took a nap under a tree", "He helped the tortoise", "He went home"], a: 1 },
    { q: "How did the tortoise win?", o: ["He ran fast", "He cheated", "He walked slowly but never stopped", "The hare let him win"], a: 2 },
    { q: "What is the moral of the story?", o: ["Slow and steady wins the race", "Never race", "Hares are bad", "Sleep is good"], a: 0 }
  ]
},
{
  id: "boy-wolf", title: "The Boy Who Cried Wolf", difficulty: "Easy", minutes: 2,
  moral: "Nobody believes a liar, even when he tells the truth.",
  text: "There was once a young shepherd boy who looked after his sheep on a green hill near his village. His work was boring, and he wanted some fun. One day, he had a naughty idea.\n\nHe ran towards the village, shouting at the top of his voice, \u201CWolf! Wolf! A wolf is attacking my sheep!\u201D The villagers heard his cries. They grabbed their sticks and ran up the hill to help him. But when they arrived, there was no wolf at all. The boy laughed and laughed. \u201CI was only joking!\u201D he said. The villagers were angry, but they went back home.\n\nA few days later, the boy played the same trick again. \u201CWolf! Wolf!\u201D he cried. Once more the villagers ran up the hill, and once more there was no wolf. The boy laughed even harder. The villagers warned him, \u201CDo not cry wolf when there is no wolf. One day no one will believe you.\u201D\n\nThen, one evening, a real wolf really did come. It jumped among the sheep, and the frightened boy cried with all his might, \u201CWolf! Wolf! Please help! It is real this time!\u201D But the villagers thought he was joking again. Nobody came. The wolf killed several sheep and ran away. The villagers shook their heads sadly as they walked back down the hill. \u201CWe will never trust his cries again,\u201D they said to one another.\n\nThe boy sat on the hill and wept. He had learned a painful lesson: nobody believes a liar, even when he speaks the truth.",
  quiz: [
    { q: "What was the boy's job?", o: ["He was a farmer", "He was a shepherd", "He was a shopkeeper", "He was a student"], a: 1 },
    { q: "Why did the boy cry \u201Cwolf\u201D the first time?", o: ["A wolf really came", "He wanted fun", "He was afraid", "He lost a sheep"], a: 1 },
    { q: "What did the villagers do when they heard him?", o: ["They laughed", "They ran up the hill to help", "They ignored him", "They called the police"], a: 1 },
    { q: "What happened when a real wolf came?", o: ["The villagers saved the sheep", "Nobody came to help", "The boy killed the wolf", "The sheep ran away"], a: 1 },
    { q: "What is the moral of the story?", o: ["Wolves are dangerous", "Nobody believes a liar, even when he tells the truth", "Sheep are silly", "Villages are safe"], a: 1 }
  ]
},
{
  id: "honest-woodcutter", title: "The Honest Woodcutter", difficulty: "Medium", minutes: 3,
  moral: "Honesty is the best policy.",
  text: "Long ago, in a village near a thick forest, there lived a poor woodcutter named Rahim. Every morning he walked into the forest with his old axe, cut wood, and sold it in the market to feed his family. He was poor, but he was honest and hardworking.\n\nOne day, as Rahim was cutting a tree near the river, his axe slipped from his hands and fell deep into the water with a loud splash. Rahim sat on the riverbank and began to cry. \u201CMy axe! My only axe! How will I earn my living now?\u201D\n\nSuddenly, the water began to shine, and a beautiful fairy rose from the river. \u201CWhy are you crying, good man?\u201D she asked kindly. Rahim told her about his lost axe. The fairy dived into the water and came up holding a shining golden axe. \u201CIs this your axe?\u201D she asked. \u201CNo,\u201D said Rahim honestly, \u201Cmine was an old iron axe.\u201D\n\nThe fairy dived again and brought up a silver axe. \u201CIs this yours?\u201D \u201CNo, kind fairy,\u201D said Rahim. \u201CMine was only an old iron axe.\u201D The fairy smiled and dived a third time. This time she brought up his old, rusty iron axe. \u201CYes! This is mine!\u201D cried Rahim joyfully.\n\nThe fairy was pleased with his honesty. \u201CYou are a truthful man,\u201D she said. \u201CKeep your iron axe, and take the golden and silver axes too, as a reward for your honesty.\u201D Rahim thanked her with folded hands and went home a happy, thankful man.",
  quiz: [
    { q: "What was Rahim's work?", o: ["He was a farmer", "He was a woodcutter", "He was a fisherman", "He was a trader"], a: 1 },
    { q: "Where did his axe fall?", o: ["In the forest", "In a well", "In the river", "In the market"], a: 2 },
    { q: "What did the fairy first bring up?", o: ["An iron axe", "A silver axe", "A golden axe", "A wooden axe"], a: 2 },
    { q: "Why did the fairy reward Rahim?", o: ["He was strong", "He was honest", "He was rich", "He was clever"], a: 1 },
    { q: "What is the moral of the story?", o: ["Honesty is the best policy", "Gold is precious", "Never cry", "Fairies are kind"], a: 0 }
  ]
},
{
  id: "ant-grasshopper", title: "The Ant and the Grasshopper", difficulty: "Easy", minutes: 2,
  moral: "Work hard today to enjoy tomorrow.",
  text: "It was the middle of summer. The sun shone brightly, and the fields were full of ripe grain. A little ant was working hard from morning till evening. She carried heavy grains of wheat, one by one, to her underground home to store for the winter.\n\nA grasshopper sat on a leaf nearby, playing his violin and singing happily. He laughed at the ant. \u201CWhy do you work so hard, little ant?\u201D he said. \u201CCome and sing with me! Summer is for enjoying!\u201D The ant replied politely, \u201CI am storing food for winter. You should do the same.\u201D But the grasshopper only laughed and kept on singing.\n\nDays passed, and autumn arrived. The leaves turned yellow and fell. The ant\u2019s store-room was now full of grain, but the grasshopper had stored nothing. He was still singing, though his songs were not as cheerful as before.\n\nThen winter came with cold winds and falling snow. The fields were empty and white. The grasshopper was hungry and shivering. He had no food at all. At last, he knocked at the ant\u2019s door. \u201CPlease, dear ant, give me something to eat. I am starving!\u201D\n\nThe kind ant shared some of her grain with him, but she said gently, \u201CRemember, my friend: work hard today so that you can enjoy tomorrow.\u201D The grasshopper nodded sadly. He had learned his lesson. All winter long he thought about the ant\u2019s wise words, and when spring arrived, he began to work beside her \u2014 and never wasted a summer again.",
  quiz: [
    { q: "What was the ant doing in summer?", o: ["Singing", "Sleeping", "Storing grain for winter", "Playing"], a: 2 },
    { q: "What did the grasshopper do all summer?", o: ["Worked hard", "Played music and sang", "Built a house", "Stored food"], a: 1 },
    { q: "What happened in winter?", o: ["The grasshopper had plenty of food", "The grasshopper was hungry", "The ant was hungry", "It rained"], a: 1 },
    { q: "How did the ant help the grasshopper?", o: ["She gave him money", "She shared her grain", "She sang for him", "She ignored him"], a: 1 },
    { q: "What is the moral of the story?", o: ["Work hard today to enjoy tomorrow", "Singing is bad", "Winter is cold", "Ants are small"], a: 0 }
  ]
},
{
  id: "greedy-dog", title: "The Greedy Dog", difficulty: "Easy", minutes: 2,
  moral: "Greed leads to loss. Be content with what you have.",
  text: "There was once a greedy dog who was never satisfied with what he had. One afternoon, he stole a large, juicy bone from a butcher\u2019s shop and ran off happily. \u201CWhat a fine bone!\u201D he thought. \u201CI will enjoy it all alone.\u201D\n\nOn his way home, the dog had to cross a narrow wooden bridge over a stream. The water below was clear and still, like a mirror. As the dog walked across the bridge, he happened to look down into the water.\n\nIn the water, he saw another dog \u2014 holding a bone that looked much bigger than his own! The greedy dog\u2019s eyes grew wide. \u201CThat dog\u2019s bone is bigger than mine!\u201D he thought. \u201CI want that bone too!\u201D\n\nForgetting that it was only his own reflection, the greedy dog opened his mouth wide to snatch the other bone. The moment he opened his mouth, his own bone slipped out and fell into the stream with a splash. It sank deep into the water and was lost forever.\n\nThe foolish dog stood on the bridge, staring at the empty water. Now he had nothing \u2014 no big bone, no small bone. A wise old cat sitting nearby watched everything and shook her head. \u201CThat foolish dog lost a good meal because of greed,\u201D she purred. \u201CI am glad I am content with my small fish.\u201D The dog walked home sadly, with an empty mouth and a heavy heart. His greed had cost him the fine bone he already had.",
  quiz: [
    { q: "Where did the dog get the bone?", o: ["He bought it", "He stole it from a butcher's shop", "A friend gave it", "He found it in the forest"], a: 1 },
    { q: "What did the dog see in the water?", o: ["A fish", "His own reflection with a bone", "A real dog", "A crocodile"], a: 1 },
    { q: "Why did the dog open his mouth?", o: ["To bark", "To drink water", "To snatch the bigger-looking bone", "To eat his bone"], a: 2 },
    { q: "What happened to his bone?", o: ["He ate it", "It fell into the stream", "He gave it away", "It broke"], a: 1 },
    { q: "What is the moral of the story?", o: ["Dogs cannot swim", "Greed leads to loss", "Bridges are dangerous", "Water is clear"], a: 1 }
  ]
},
{
  id: "unity-strength", title: "Unity is Strength", difficulty: "Medium", minutes: 3,
  moral: "United we stand, divided we fall.",
  text: "In a tall, leafy tree near a quiet lake, there lived a flock of pigeons. Every morning they flew together to the fields, ate grains, and returned home happily in the evening. They were united, and no hunter could ever catch them.\n\nOne day, a cruel hunter came to the forest. He had watched the pigeons for many days. He spread a large net on the ground and scattered sweet grains over it. Then he hid behind a bush and waited.\n\nWhen the pigeons flew down to eat the grains, the net suddenly closed over them. \u201CHelp! Help!\u201D they cried, flapping their wings in fear. But the more they struggled alone, the more tightly the net held them.\n\nThen the oldest and wisest pigeon spoke calmly. \u201CListen to me, friends. If we struggle separately, we will all be caught. But if we fly up TOGETHER at the same time, we can lift this net and escape.\u201D\n\nAll the pigeons agreed. \u201COne\u2026 two\u2026 three\u2026 FLY!\u201D they cried together. With one great effort, the whole flock rose into the sky, carrying the heavy net with them. The hunter could only stare in amazement as his net disappeared into the clouds.\n\nThe pigeons flew to their friend, the mouse, who nibbled the net into pieces with his sharp teeth. They were free at last. The hunter returned home empty-handed that evening, and no hunter ever troubled those clever pigeons again. From that day, the pigeons never forgot the lesson: united we stand, divided we fall.",
  quiz: [
    { q: "Where did the pigeons live?", o: ["In a cave", "In a tall tree near a lake", "In a house", "On a mountain"], a: 1 },
    { q: "How did the hunter trap them?", o: ["With a cage", "With a net and grains", "With a dog", "With fire"], a: 1 },
    { q: "Whose idea saved the pigeons?", o: ["The youngest pigeon", "The hunter", "The oldest and wisest pigeon", "The mouse"], a: 2 },
    { q: "Who cut the net into pieces?", o: ["The pigeons", "The mouse", "The hunter", "The farmer"], a: 1 },
    { q: "What is the moral of the story?", o: ["United we stand, divided we fall", "Nets are strong", "Mice are helpful", "Hunters are cruel"], a: 0 }
  ]
},
{
  id: "clever-rabbit", title: "The Clever Rabbit and the Lion", difficulty: "Medium", minutes: 3,
  moral: "Wisdom is stronger than strength.",
  text: "Long ago, a fierce lion lived in a dense jungle. Every day he hunted and killed many animals, just for fun. The animals of the jungle were terrified. At last, they held a meeting.\n\n\u201CO mighty king,\u201D said the old elephant, \u201Cplease do not kill us all. We will send you one animal every day for your meal. Then you need never hunt again.\u201D The lion agreed, and from that day one animal walked to the lion\u2019s den daily.\n\nOne morning, it was the turn of a small rabbit. The clever rabbit did not want to die, so he made a plan. He walked very, very slowly and reached the lion\u2019s den only in the evening.\n\nThe hungry lion roared in anger. \u201CWhy are you so late? And why have they sent only a tiny rabbit?\u201D The rabbit bowed low and said, \u201CO king, forgive me. Six rabbits were sent for your meal, but on the way, another lion stopped us. He ate five rabbits and said HE is the real king of the jungle, not you!\u201D\n\nThe lion\u2019s eyes burned with rage. \u201CShow me this other lion at once!\u201D he thundered. The clever rabbit led him to a deep, old well. \u201CLook inside, O king. He is hiding down there.\u201D The lion peered into the well and saw his own reflection in the water. Thinking it was the other lion, he roared loudly. The echo roared back. In a fury, the lion jumped into the well to fight \u2014 and drowned.\n\nAll the animals celebrated. The tiny rabbit\u2019s wisdom had saved the whole jungle, proving that wisdom is stronger than strength.",
  quiz: [
    { q: "Why were the animals afraid of the lion?", o: ["He was loud", "He killed animals for fun", "He was ugly", "He stole food"], a: 1 },
    { q: "What deal did the animals make with the lion?", o: ["They would leave the jungle", "They would send one animal daily", "They would fight him", "They would hide"], a: 1 },
    { q: "Why was the rabbit late?", o: ["He was lost", "It was part of his plan", "He was lazy", "He was sick"], a: 1 },
    { q: "What did the lion see in the well?", o: ["Another lion", "His own reflection", "The rabbit", "Water only"], a: 1 },
    { q: "What is the moral of the story?", o: ["Wisdom is stronger than strength", "Lions are foolish", "Wells are deep", "Rabbits are fast"], a: 0 }
  ]
}
];
