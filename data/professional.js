// LinguaBuddy — Professionals data (Business English + career skills).
// Curated, bundled, offline. Versioned per project convention.

export const DATA_VERSION_PRO = "1.0.0";

/* ================= email scenarios ================= */
// template uses [bracket] blanks the learner fills in.

export const EMAIL_SCENARIOS = [
{
  id: "job-application",
  title: "📝 Job Application",
  emoji: "📝",
  context: "You are applying for a junior assistant post you saw advertised.",
  template:
    "Subject: [Application for the post of Junior Assistant]\n\n" +
    "Dear [Mr. Khan / Hiring Manager],\n\n" +
    "I am writing to apply for the post of [Junior Assistant] advertised on [the company website]. " +
    "I have [two years] of experience in [office work], and I believe my skills match your requirements.\n\n" +
    "Please find my CV attached. I would welcome the chance to discuss my application in an interview.\n\n" +
    "Thank you for your time and consideration.\n\n" +
    "Yours sincerely,\n[Your full name]\n[Your phone number]",
  toneTips: [
    "Use a clear subject line — it is the first thing the reader sees.",
    "“Yours sincerely” is formal; “Best regards” is fine for a first email.",
    "Never use slang or emojis in a job application."
  ],
  formalWords: [["gonna", "going to"], ["wanna", "want to"], ["thanks a lot", "thank you very much"], ["stuff", "matters"]]
},
{
  id: "leave-request",
  title: "🏖️ Leave Request",
  emoji: "🏖️",
  context: "You need two days off for a family event. Write to your manager.",
  template:
    "Subject: [Leave request — 12–13 October]\n\n" +
    "Dear [Ms. Ahmed],\n\n" +
    "I would like to request leave on [12 and 13 October] for [a family event]. " +
    "I have completed my urgent tasks, and [Ali] has kindly agreed to cover for me.\n\n" +
    "I would be grateful for your approval.\n\n" +
    "Kind regards,\n[Your name]",
  toneTips: [
    "Give the exact dates — managers should never have to guess.",
    "Show you arranged cover: it makes approval much more likely.",
    "“I would like to request” is more polite than “I want leave.”"
  ],
  formalWords: [["i want", "i would like"], ["gimme", "please grant me"], ["asap", "at your earliest convenience"]]
},
{
  id: "meeting-request",
  title: "📅 Meeting Request",
  emoji: "📅",
  context: "You want a 30-minute meeting with a client next week.",
  template:
    "Subject: [Request for a meeting — project update]\n\n" +
    "Dear [Mr. Raza],\n\n" +
    "I hope you are well. I would like to arrange a short meeting to discuss [the project update]. " +
    "Would [Tuesday at 11:00] suit you? I am also available on [Wednesday afternoon] if that is better.\n\n" +
    "Please let me know what works for you.\n\n" +
    "Best regards,\n[Your name]",
  toneTips: [
    "Suggest a specific time, but offer an alternative — it shows respect for their schedule.",
    "Keep it short: busy people skim emails.",
    "Always state the purpose of the meeting."
  ],
  formalWords: [["wanna meet", "would like to meet"], ["let me know", "please let me know"], ["cool", "suitable"]]
},
{
  id: "interview-followup",
  title: "🤝 Follow-Up After Interview",
  emoji: "🤝",
  context: "You had an interview yesterday. Thank the interviewer politely.",
  template:
    "Subject: [Thank you — interview on 10 October]\n\n" +
    "Dear [Ms. Tariq],\n\n" +
    "Thank you for taking the time to meet me yesterday. I enjoyed learning more about [the sales team] " +
    "and the role of [Sales Executive]. Our discussion confirmed my interest in joining your company.\n\n" +
    "Please let me know if you need any further information from me.\n\n" +
    "Kind regards,\n[Your name]",
  toneTips: [
    "Send it within 24 hours — speed shows enthusiasm.",
    "Mention one specific thing you discussed; it proves you listened.",
    "Keep the tone warm but professional."
  ],
  formalWords: [["it was nice", "I enjoyed"], ["hit me up", "contact me"], ["cheers", "kind regards"]]
},
{
  id: "polite-complaint",
  title: "📦 Polite Complaint",
  emoji: "📦",
  context: "An online order arrived damaged. Complain firmly but politely.",
  template:
    "Subject: [Damaged item — order #4821]\n\n" +
    "Dear Customer Service,\n\n" +
    "I am writing regarding order [4821], placed on [5 October]. Unfortunately, the [mixer] arrived " +
    "[with a cracked body] and does not work.\n\n" +
    "I would appreciate a replacement or a full refund at your earliest convenience. " +
    "I have attached photos of the damage.\n\n" +
    "Thank you for your attention to this matter.\n\n" +
    "Sincerely,\n[Your name]",
  toneTips: [
    "State facts (order number, date, problem) before feelings.",
    "Say exactly what you want: replacement or refund.",
    "Polite firmness works better than anger."
  ],
  formalWords: [["this is rubbish", "this is unacceptable"], ["do it now", "at your earliest convenience"], ["you guys", "your team"]]
},
{
  id: "resignation",
  title: "🚪 Resignation",
  emoji: "🚪",
  context: "You are leaving your job. Keep the door open — be gracious.",
  template:
    "Subject: [Resignation — Ali Raza]\n\n" +
    "Dear [Mr. Sheikh],\n\n" +
    "Please accept this email as formal notice of my resignation from the position of [Cashier], " +
    "effective [30 October] (two weeks' notice).\n\n" +
    "I am grateful for the opportunities I have had here, especially [learning customer service]. " +
    "I will do my best to hand over my duties smoothly.\n\n" +
    "Thank you again, and I wish the company every success.\n\n" +
    "Sincerely,\n[Your name]",
  toneTips: [
    "Give proper notice (usually two weeks) — it protects your reference.",
    "Thank them, even if you are unhappy. Bridges matter.",
    "Offer a smooth handover; it is the professional thing to do."
  ],
  formalWords: [["i quit", "I am resigning"], ["i'm out", "my last working day will be"], ["whatever", "thank you"]]
},
{
  id: "thank-you-note",
  title: "💌 Thank-You Note",
  emoji: "💌",
  context: "A colleague helped you finish a big report. Thank them properly.",
  template:
    "Subject: [Thank you!]\n\n" +
    "Dear [Sana],\n\n" +
    "Thank you so much for your help with [the quarterly report] yesterday. " +
    "Your [data checking] saved me hours, and I really appreciate it.\n\n" +
    "Please let me know if I can return the favour sometime.\n\n" +
    "Warm regards,\n[Your name]",
  toneTips: [
    "Name the specific help — generic thanks feel empty.",
    "Offer to return the favour; goodwill is a two-way street.",
    "Short and sincere beats long and stiff."
  ],
  formalWords: [["thx", "thank you"], ["you're a lifesaver!!", "I really appreciate it"], ["no worries", "you are welcome"]]
},
{
  id: "asking-for-raise",
  title: "💰 Asking for a Raise",
  emoji: "💰",
  context: "You have performed well for a year. Request a salary review.",
  template:
    "Subject: [Request for salary review]\n\n" +
    "Dear [Mr. Imran],\n\n" +
    "I would like to request a review of my salary. Over the past year, I have [increased sales in my area by 20%] " +
    "and [trained two new team members]. I believe my contributions now go beyond my current role.\n\n" +
    "I would welcome the chance to discuss this with you at a convenient time.\n\n" +
    "Thank you for considering my request.\n\n" +
    "Kind regards,\n[Your name]",
  toneTips: [
    "Lead with evidence (results, numbers), not feelings.",
    "Ask for a discussion, not a demand — negotiation needs dialogue.",
    "Pick a good moment: after a success, not during a crisis."
  ],
  formalWords: [["i deserve more", "I would like my salary reviewed"], ["pay me", "adjust my compensation"], ["or else", "I hope we can agree"]]
}
];

/* ================= interview questions ================= */
// Each: group, q, starTip (how to structure), keywords (words a strong answer hits).

export const INTERVIEW_QS = [
{ group: "About you", q: "Tell me about yourself.",
  starTip: "Keep it to 2 minutes: present (your current role), past (key experience), future (why this job). End with enthusiasm.",
  keywords: ["experience", "skills", "role", "years"] },
{ group: "About you", q: "Why should we hire you?",
  starTip: "Match 2–3 of YOUR strengths to THEIR job ad. Use the formula: 'You need X — I have X, shown when I…'.",
  keywords: ["skills", "experience", "value", "team"] },
{ group: "About you", q: "What are your greatest strengths?",
  starTip: "Pick 2 strengths with a short proof each: 'I am organised — for example, I…'. Never list strengths without evidence.",
  keywords: ["organised", "reliable", "example", "results"] },
{ group: "About you", q: "What is your greatest weakness?",
  starTip: "Name a REAL but minor weakness + what you are doing to fix it. Never say 'I am a perfectionist' without a plan.",
  keywords: ["improve", "learning", "working on"] },
{ group: "About you", q: "Where do you see yourself in five years?",
  starTip: "Show ambition AND loyalty: growing skills, taking responsibility, staying in this field/company.",
  keywords: ["grow", "skills", "responsibility", "future"] },
{ group: "Motivation", q: "Why do you want this job?",
  starTip: "Show you researched the company: mention something specific about them, then connect it to your goals.",
  keywords: ["company", "role", "excited", "contribute"] },
{ group: "Motivation", q: "Why are you leaving your current job?",
  starTip: "Stay positive — talk about seeking growth, never complain about your boss or colleagues.",
  keywords: ["growth", "opportunity", "learn", "challenge"] },
{ group: "Motivation", q: "What do you know about our company?",
  starTip: "Mention 2 facts (products, values, recent news) + why they appeal to you. This question tests preparation.",
  keywords: ["company", "values", "products", "reputation"] },
{ group: "Teamwork", q: "Tell me about a time you worked in a team.",
  starTip: "Use STAR: Situation, Task, Action, Result. 'We had a deadline… my part was… we finished early.'",
  keywords: ["team", "together", "deadline", "result"] },
{ group: "Teamwork", q: "Describe a disagreement with a colleague. How did you handle it?",
  starTip: "Show calm communication: listened, discussed privately, found a compromise. End with what you learned.",
  keywords: ["listened", "discussed", "resolved", "respect"] },
{ group: "Teamwork", q: "Have you ever led a team or project?",
  starTip: "Even informal leadership counts: 'I coordinated three colleagues on…'. Focus on how you helped others succeed.",
  keywords: ["led", "coordinated", "responsible", "achieved"] },
{ group: "Pressure", q: "How do you handle pressure or tight deadlines?",
  starTip: "Give a real example: prioritised tasks, stayed calm, asked for help early. Employers want process, not just 'I cope'.",
  keywords: ["prioritise", "calm", "plan", "deadline"] },
{ group: "Pressure", q: "Tell me about a mistake you made at work.",
  starTip: "Pick a small, honest mistake. Spend 20% on the error, 80% on what you fixed and learned.",
  keywords: ["mistake", "learned", "fixed", "responsibility"] },
{ group: "Pressure", q: "Describe a difficult problem you solved.",
  starTip: "STAR again: the problem, your thinking steps, the action, the measurable result ('saved 2 hours a week').",
  keywords: ["problem", "solution", "result", "improved"] },
{ group: "Practical", q: "What salary are you expecting?",
  starTip: "Research the market rate first. Give a range, not one number: 'Based on my research, I am looking at…'.",
  keywords: ["range", "market", "experience", "fair"] },
{ group: "Practical", q: "Are you willing to work overtime or travel?",
  starTip: "Be honest but flexible: 'I can be flexible when the work needs it.' Don't promise what you can't deliver.",
  keywords: ["flexible", "willing", "occasionally"] },
{ group: "Practical", q: "When can you start?",
  starTip: "Know your notice period. 'I can start in two weeks' is standard and professional.",
  keywords: ["notice", "weeks", "available"] },
{ group: "Closing", q: "Do you have any questions for us?",
  starTip: "ALWAYS ask 2 questions: about the role ('What does success look like?') and growth ('What training is offered?'). Never say 'no'.",
  keywords: ["role", "team", "growth", "success"] },
{ group: "Closing", q: "Why do you think you are a good fit for our culture?",
  starTip: "Echo their values (from the website/job ad) with a personal example: 'You value teamwork — in my last job I…'.",
  keywords: ["values", "teamwork", "culture", "fit"] },
{ group: "Closing", q: "Is there anything else we should know?",
  starTip: "Your final pitch: one strong achievement or skill you haven't mentioned, tied to their needs.",
  keywords: ["achievement", "skills", "contribute", "excited"] }
];

/* ================= meeting phrases ================= */

export const MEETING_PHRASES = [
{ group: "Opening", phrases: [
  "Let's get started, everyone.",
  "Thank you all for coming.",
  "The purpose of today's meeting is…",
  "Shall we begin with the first item?" ] },
{ group: "Agreeing", phrases: [
  "I completely agree.",
  "That's a good point.",
  "Exactly — that's what I was thinking.",
  "I am with you on that." ] },
{ group: "Disagreeing politely", phrases: [
  "I see your point, but…",
  "I am not sure I agree with that.",
  "Could I offer a different view?",
  "Let's look at it from another angle." ] },
{ group: "Interrupting politely", phrases: [
  "Sorry to interrupt, but…",
  "Could I just add something here?",
  "May I come in here?",
  "Before we move on, I'd like to say…" ] },
{ group: "Clarifying", phrases: [
  "Could you explain that in more detail?",
  "Do you mean…?",
  "Let me make sure I understand…",
  "Could you give an example?" ] },
{ group: "Suggesting", phrases: [
  "How about we try…?",
  "I suggest we…",
  "What if we…?",
  "One option would be to…",
  "I'd like to propose…" ] },
{ group: "Closing", phrases: [
  "Let's summarise what we agreed.",
  "So, the next steps are…",
  "Thank you all for your time.",
  "Let's meet again next week.",
  "I'll send the minutes after the meeting." ] }
];

/* ================= workplace role-plays ================= */
// Node trees like data/convo.js: { p, b: [[keywords, nextId]], f, end }.

export const WORKPLACE_SCENARIOS = [
{
  id: "client-call",
  title: "Client Call",
  emoji: "📞",
  setting: "You call an important client about a delayed delivery.",
  goal: "Apologise professionally, explain the new date, keep the client happy.",
  nodes: {
    start: { p: "Good morning, this is Mr. Farooq from City Traders. You said our order would arrive Monday — it's Wednesday!",
      b: [[["apologise", "apologize", "sorry", "regret"], "n1"]], f: "f1" },
    f1: { p: "I need an apology first, please. This delay cost us a sale.",
      b: [[["apologise", "apologize", "sorry"], "n1"]], f: "n1" },
    n1: { p: "Apology accepted. So when will it actually arrive?",
      b: [[["friday", "monday", "tomorrow", "arrive", "delivery", "deliver"], "n2"]], f: "f2" },
    f2: { p: "Give me a clear date, please — my customers are waiting.",
      b: [[["friday", "monday", "tomorrow", "date"], "n2"]], f: "n2" },
    n2: { p: "Alright. And what will you do to make up for this?",
      b: [[["discount", "free", "compensate", "offer", "refund"], "end1"]], f: "f3" },
    f3: { p: "I expect something for the trouble — a discount, perhaps?",
      b: [[["discount", "free", "offer"], "end1"]], f: "end1" },
    end1: { p: "That sounds fair. Thank you for handling this professionally. Goodbye!", end: true }
  }
},
{
  id: "team-meeting",
  title: "Team Meeting",
  emoji: "👥",
  setting: "Your manager asks for ideas to improve customer service.",
  goal: "Suggest one clear idea politely and support a colleague's point.",
  nodes: {
    start: { p: "Morning, team. Customer complaints are up. Any ideas to improve our service?",
      b: [[["suggest", "idea", "could", "should", "training", "survey", "feedback"], "n1"]], f: "f1" },
    f1: { p: "Don't be shy — even a small idea helps. What would you try?",
      b: [[["suggest", "idea", "could", "should", "training"], "n1"]], f: "n1" },
    n1: { p: "Interesting. Sana just suggested faster replies. What do you think of her idea?",
      b: [[["agree", "good", "yes", "right", "excellent"], "n2"]], f: "f2" },
    f2: { p: "It's fine to agree or disagree politely — what is your view on faster replies?",
      b: [[["agree", "good", "disagree", "however"], "n2"]], f: "n2" },
    n2: { p: "Good discussion. Can you take responsibility for one action this week?",
      b: [[["will", "yes", "can", "take", "responsible", "i'll", "i will"], "end1"]], f: "end1" },
    end1: { p: "Excellent — that's the spirit. Thanks, everyone!", end: true }
  }
},
{
  id: "salary-negotiation",
  title: "Salary Negotiation",
  emoji: "💰",
  setting: "Your manager offers a 5% raise. You hoped for 10%.",
  goal: "Negotiate politely using evidence of your results — no demands.",
  nodes: {
    start: { p: "Thanks for coming in. We'd like to offer you a 5% raise this year.",
      b: [[["thank", "grateful", "appreciate"], "n1"]], f: "f1" },
    f1: { p: "How do you feel about the 5%?",
      b: [[["thank", "grateful", "appreciate", "hoped", "expected"], "n1"]], f: "n1" },
    n1: { p: "I see. What makes you feel you deserve more?",
      b: [[["sales", "results", "increased", "trained", "achieved", "performance", "%", "percent"], "n2"]], f: "f2" },
    f2: { p: "Give me some evidence — results, numbers, achievements.",
      b: [[["sales", "results", "achieved", "increased"], "n2"]], f: "n2" },
    n2: { p: "Those are strong results. I can stretch to 8%. Can we agree on that?",
      b: [[["agree", "accept", "deal", "yes", "thank"], "end1"]], f: "f3" },
    f3: { p: "8% is my final offer today. Shall we shake on it?",
      b: [[["agree", "accept", "yes", "ok"], "end1"]], f: "end1" },
    end1: { p: "Done — 8%. Well negotiated, and well deserved!", end: true }
  }
},
{
  id: "customer-complaint",
  title: "Handling a Complaint",
  emoji: "😠",
  setting: "An angry customer says their bill is wrong.",
  goal: "Stay calm, listen, apologise, and offer a clear solution.",
  nodes: {
    start: { p: "This is ridiculous! My bill is double what it should be!",
      b: [[["understand", "sorry", "apologise", "apologize", "calm", "listen"], "n1"]], f: "f1" },
    f1: { p: "Are you even listening to me?!",
      b: [[["listening", "understand", "sorry", "help"], "n1"]], f: "n1" },
    n1: { p: "Fine. The bill says Rs 8,000 but I only used Rs 4,000 of services.",
      b: [[["check", "look", "review", "investigate", "verify"], "n2"]], f: "f2" },
    f2: { p: "So what will you DO about it?",
      b: [[["check", "correct", "refund", "fix", "adjust"], "n2"]], f: "n2" },
    n2: { p: "…You're right, there is an error. What is a fair solution?",
      b: [[["refund", "correct", "adjust", "credit", "fix"], "end1"]], f: "end1" },
    end1: { p: "Thank you for sorting it out calmly. I'll stay with your company.", end: true }
  }
},
{
  id: "networking",
  title: "Networking Event",
  emoji: "🤝",
  setting: "You meet a stranger at a business event.",
  goal: "Introduce yourself, ask about their work, exchange contacts politely.",
  nodes: {
    start: { p: "Hi! I don't think we've met. I'm Daniyal, from Bright Logistics.",
      b: [[["my name is", "i am", "i'm", "nice to meet"], "n1"]], f: "f1" },
    f1: { p: "Tell me a little about yourself — what do you do?",
      b: [[["work", "job", "teacher", "engineer", "manager", "student", "business"], "n1"]], f: "n1" },
    n1: { p: "Interesting! What brings you to this event?",
      b: [[["network", "meet", "learn", "business", "contacts", "clients"], "n2"]], f: "f2" },
    f2: { p: "Most people come to meet new contacts. How about you?",
      b: [[["network", "meet", "learn", "contacts"], "n2"]], f: "n2" },
    n2: { p: "Same here! Shall we exchange numbers and stay in touch?",
      b: [[["yes", "sure", "great", "definitely", "card", "number"], "end1"]], f: "end1" },
    end1: { p: "Wonderful meeting you. Let's definitely stay in touch!", end: true }
  }
},
{
  id: "performance-review",
  title: "Performance Review",
  emoji: "📊",
  setting: "Your manager reviews your year: good sales, but late reports.",
  goal: "Accept praise gracefully, own the weakness, propose improvement.",
  nodes: {
    start: { p: "Overall a good year — your sales were excellent. How do you feel it went?",
      b: [[["good", "well", "proud", "happy", "pleased", "great"], "n1"]], f: "f1" },
    f1: { p: "Come on, take some credit! How would you describe your year?",
      b: [[["good", "well", "proud", "successful"], "n1"]], f: "n1" },
    n1: { p: "Agreed. One concern: your monthly reports were often late. Your thoughts?",
      b: [[["sorry", "apologise", "apologize", "right", "improve", "accept"], "n2"]], f: "f2" },
    f2: { p: "It's important to own it. What happened with the reports?",
      b: [[["sorry", "busy", "improve", "plan", "will"], "n2"]], f: "n2" },
    n2: { p: "Fair enough. What will you change next year?",
      b: [[["will", "plan", "schedule", "reminder", "improve", "organise", "organize"], "end1"]], f: "end1" },
    end1: { p: "That's a solid plan. Keep up the great sales work!", end: true }
  }
}
];

/* ================= business vocabulary ================= */
// casual → formal, with an example sentence.

export const BUSINESS_VOCAB = [
{ casual: "get", formal: "obtain", example: "We obtained approval from the head office." },
{ casual: "buy", formal: "purchase", example: "The company purchased new computers." },
{ casual: "ask for", formal: "request", example: "I would like to request a meeting." },
{ casual: "tell", formal: "inform", example: "Please inform me of your decision." },
{ casual: "start", formal: "commence", example: "The project will commence in June." },
{ casual: "end", formal: "conclude", example: "Let us conclude this discussion." },
{ casual: "help", formal: "assist", example: "How may I assist you?" },
{ casual: "need", formal: "require", example: "This task requires your attention." },
{ casual: "give", formal: "provide", example: "We provide free delivery." },
{ casual: "talk about", formal: "discuss", example: "We need to discuss the budget." },
{ casual: "sorry I'm late", formal: "apologise for the delay", example: "I apologise for the delay in replying." },
{ casual: "thanks", formal: "thank you", example: "Thank you for your email." },
{ casual: "a lot of", formal: "numerous / a great deal of", example: "We received numerous applications." },
{ casual: "stuff", formal: "materials / matters", example: "Please send the materials by Friday." },
{ casual: "thing", formal: "matter / item", example: "We will look into this matter." },
{ casual: "gonna", formal: "going to", example: "We are going to launch soon." },
{ casual: "wanna", formal: "want to", example: "I want to apply for this role." },
{ casual: "ok", formal: "acceptable / satisfactory", example: "The proposal is acceptable." },
{ casual: "big", formal: "significant", example: "We saw a significant increase in sales." },
{ casual: "small", formal: "minor", example: "There was a minor delay." },
{ casual: "bad", formal: "unsatisfactory", example: "The service was unsatisfactory." },
{ casual: "good", formal: "satisfactory / excellent", example: "Your performance has been excellent." },
{ casual: "check", formal: "verify", example: "Please verify the figures." },
{ casual: "fix", formal: "rectify / resolve", example: "We will resolve this issue today." },
{ casual: "show", formal: "demonstrate", example: "The report demonstrates clear growth." },
{ casual: "use", formal: "utilise", example: "We utilise the latest software." },
{ casual: "make sure", formal: "ensure", example: "Please ensure the doors are locked." },
{ casual: "find out", formal: "ascertain", example: "We need to ascertain the cause." },
{ casual: "put off", formal: "postpone", example: "We had to postpone the meeting." },
{ casual: "go up", formal: "increase", example: "Prices will increase next month." },
{ casual: "go down", formal: "decrease", example: "Costs decreased by 10%." },
{ casual: "deal with", formal: "handle", example: "She handles customer complaints." },
{ casual: "look into", formal: "investigate", example: "We are investigating the problem." },
{ casual: "come up with", formal: "propose", example: "He proposed a new marketing plan." },
{ casual: "cut", formal: "reduce", example: "We must reduce expenses." },
{ casual: "quit", formal: "resign", example: "He resigned last month." },
{ casual: "fire someone", formal: "terminate employment", example: "The company terminated his employment." },
{ casual: "pay rise", formal: "salary increase", example: "She received a salary increase." },
{ casual: "time off", formal: "leave", example: "I would like to request annual leave." },
{ casual: "boss", formal: "manager / supervisor", example: "My supervisor approved the plan." }
];

/* ================= CV builder ================= */

export const CV_SECTIONS = [
{ id: "personal", title: "Personal Details", fields: [
  { id: "fullName", label: "Full name", ph: "e.g. Amina Khan" },
  { id: "jobTitle", label: "Job title you want", ph: "e.g. Sales Assistant" },
  { id: "phone", label: "Phone", ph: "e.g. 0300 1234567" },
  { id: "email", label: "Email", ph: "e.g. amina@email.com" },
  { id: "city", label: "City", ph: "e.g. Lahore" }
] },
{ id: "summary", title: "Professional Summary", fields: [
  { id: "summary", label: "2–3 lines about you", ph: "Hardworking graduate with…", textarea: true }
] },
{ id: "experience", title: "Work Experience", fields: [
  { id: "exp1", label: "Most recent job (title — company — years)", ph: "Cashier — City Mart — 2022–2024", textarea: true },
  { id: "exp2", label: "Previous job (optional)", ph: "", textarea: true }
] },
{ id: "education", title: "Education", fields: [
  { id: "edu1", label: "Highest qualification", ph: "B.A. English — Punjab University — 2022", textarea: true }
] },
{ id: "skills", title: "Skills", fields: [
  { id: "skills", label: "Key skills (comma separated)", ph: "MS Office, customer service, English communication", textarea: true }
] }
];

/* ================= career tips ================= */

export const TIPS = [
{ emoji: "📧", title: "The subject line is half the email",
  text: "Busy managers decide in 3 seconds whether to open your email. Write a clear subject: “Leave request — 12 October”, not “Hi” or “Important!!”." },
{ emoji: "🤝", title: "STAR your interview answers",
  text: "Situation → Task → Action → Result. A 60-second story with a result (“sales rose 20%”) beats five minutes of adjectives." },
{ emoji: "🗣️", title: "Disagree like a professional",
  text: "“I see your point, but…” keeps the discussion open. “You're wrong” closes it — and the door to your promotion." },
{ emoji: "📝", title: "One page CV for under 10 years' experience",
  text: "Recruiters spend about 30 seconds on a first scan. Keep it to one page, newest job first, no photos, no fancy fonts." },
{ emoji: "⏰", title: "Reply within 24 hours",
  text: "Even a short “Received — I will reply properly tomorrow” builds a reputation for reliability." },
{ emoji: "🔤", title: "Formal words, friendly tone",
  text: "Use formal vocabulary (“request”, “inform”) but keep sentences warm and short. Formal does not mean cold." },
{ emoji: "🎯", title: "Prepare 2 questions for every interview",
  text: "“What does success look like in this role?” shows you think like an employee already." },
{ emoji: "📞", title: "Answer the phone professionally",
  text: "“Good morning, Bright Traders, Ali speaking. How may I help you?” — 5 seconds that shape a company's image." }
];
