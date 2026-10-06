// LinguaBuddy — 🎓 Find a Tutor marketplace: DATA + PURE LOGIC.
// DOM-free module: runs under plain node for unit tests. All DOM rendering
// lives in the UI layer, which consumes these exports.
//
// CRITICAL RULE — tutor curriculum tags reference REAL lessons only. Every
// tag is built with tag(schemeId, n), which looks up the real lesson in the
// scheme data and copies its actual title and SLO code. Lesson titles and
// SLO codes are NEVER invented here.

import { schemeById, lessonOf, lessonSlos, isLessonMapped } from "./scheme.js";
import { S, save } from "./store.js";
import { uid } from "./utils.js";

/* ================= curriculum tags (real lessons only) ================= */

// Build a curriculum tag from the REAL scheme data: copies the lesson's
// actual title and SLO code. Throws for unknown or unmapped lesson numbers
// so a bad tag can never silently ship invented content.
function tag(schemeId, n) {
  const scheme = schemeById(schemeId);
  const lesson = scheme ? lessonOf(scheme, n) : null;
  if (!lesson || !isLessonMapped(scheme, n)) {
    throw new Error("tutors.js: tag() — unknown or unmapped lesson " + schemeId + " L" + n);
  }
  return { schemeId: schemeId, n: n, title: lesson.title, code: lesson.code };
}

/* ================= seed data: 12 demo tutors ================= */

export const TUTORS = [
  {
    id: "t1", name: "Ayesha Khan", demo: true, verified: true,
    subjects: ["Grammar"], grades: ["Grade 7"], aksYears: 6,
    lessons: [tag("ak-g7-english", 70), tag("ak-g7-english", 71), tag("ak-g7-english", 79), tag("ak-g7-english", 83)],
    modes: ["online", "inperson"], city: "Gilgit", feePKR: 800,
    rating: 4.8, reviewsCount: 4,
    seededReviews: [
      { name: "Shazia M.", stars: 5, text: "My daughter finally understands clauses — Ayesha explains grammar so simply. Worth every rupee." },
      { name: "Imtiaz", stars: 5, text: "Punctual and well-prepared. She follows the school scheme lessons exactly." },
      { name: "Noreen K.", stars: 5, text: "Very patient teacher. My son's test marks went from 55 to 82 in two months." },
      { name: "Tariq Aziz", stars: 4, text: "Good teacher, explains well. Sometimes the class runs a bit long." }
    ],
    slots: ["Mon 4:00 PM", "Wed 5:30 PM", "Sat 10:00 AM"],
    langs: ["English", "Urdu"],
    about: "AKS-trained English teacher with 6 years of classroom experience. Specializes in grammar — sentence patterns, clauses, pronouns and adverbs — following the Aga Khan scheme of work lesson by lesson."
  },
  {
    id: "t2", name: "Bilal Ahmed", demo: true, verified: false,
    subjects: ["Writing"], grades: ["Grade 7"], aksYears: 4,
    lessons: [tag("ak-g7-english", 72), tag("ak-g7-english", 74), tag("ak-g7-english", 88)],
    modes: ["online"], city: "Hunza", feePKR: 600,
    rating: 4.7, reviewsCount: 3,
    seededReviews: [
      { name: "Samina R.", stars: 5, text: "Bilal sir's letter-writing practice helped my son score full marks in the school test." },
      { name: "Fazal Karim", stars: 5, text: "Clear feedback on every paragraph. My daughter's writing structure improved a lot." },
      { name: "Nasreen B.", stars: 4, text: "Good sessions. A little strict about homework, but that is what we needed." }
    ],
    slots: ["Tue 5:00 PM", "Thu 5:00 PM"],
    langs: ["English", "Urdu", "Burushaski"],
    about: "Writing coach for middle schoolers. Focuses on formal letters, free-writing paragraphs and descriptive composition, with written feedback after every session."
  },
  {
    id: "t3", name: "Fatima Zahra", demo: true, verified: false,
    subjects: ["Reading"], grades: ["Prep 9"], aksYears: 3,
    lessons: [tag("ak-prep9-english", 77), tag("ak-prep9-english", 78), tag("ak-prep9-english", 94)],
    modes: ["online", "inperson"], city: "Chitral", feePKR: 500,
    rating: 4.3, reviewsCount: 3,
    seededReviews: [
      { name: "Javed Iqbal", stars: 5, text: "My daughter enjoys her reading sessions — the skimming techniques really helped." },
      { name: "Rukhsana", stars: 4, text: "Sincere teacher. Reading speed improved, still working on comprehension." },
      { name: "Aslam P.", stars: 4, text: "Decent teacher for the price. Communicates well." }
    ],
    slots: ["Mon 3:30 PM", "Fri 4:00 PM"],
    langs: ["English", "Urdu", "Khowar"],
    about: "Reading specialist who teaches skimming for the main idea and answering comprehension questions step by step. Good fit for students who read slowly or lose marks on unseen passages."
  },
  {
    id: "t4", name: "Imran Shah", demo: true, verified: true,
    subjects: ["Speaking", "Listening"], grades: ["Grade 7"], aksYears: 8,
    lessons: [tag("ak-g7-english", 66), tag("ak-g7-english", 67), tag("ak-g7-english", 95)],
    modes: ["online", "inperson"], city: "Gilgit", feePKR: 1000,
    rating: 4.8, reviewsCount: 5,
    seededReviews: [
      { name: "Gulnar", stars: 5, text: "My shy son now speaks English confidently. Amazing change in one term." },
      { name: "Sher Ali", stars: 5, text: "The listening practice with real audios is excellent." },
      { name: "Parveen", stars: 5, text: "Professional and caring. Highly recommended for speaking." },
      { name: "Didar Ali", stars: 5, text: "Worth it. My daughter led her class discussion last week." },
      { name: "Yasmin", stars: 4, text: "Very good, just wish he had weekend slots too." }
    ],
    slots: ["Tue 6:00 PM", "Sat 11:00 AM"],
    langs: ["English", "Urdu"],
    about: "8 years with Aga Khan schools. Runs discussion practice, listening exercises and confidence-building speaking sessions mapped to the oral lessons of the scheme."
  },
  {
    id: "t5", name: "Sana Tariq", demo: true, verified: false,
    subjects: ["Vocabulary"], grades: ["Prep 9"], aksYears: 3,
    lessons: [tag("ak-prep9-english", 68), tag("ak-prep9-english", 69), tag("ak-prep9-english", 87)],
    modes: ["online"], city: "Skardu", feePKR: 550,
    rating: 4.2, reviewsCount: 5,
    seededReviews: [
      { name: "Khadija", stars: 4, text: "Good vocabulary drills. My son learned prefixes properly for the first time." },
      { name: "Mehboob", stars: 4, text: "Friendly teacher. Classes are useful." },
      { name: "Zubaida", stars: 5, text: "She makes word games fun — my daughter looks forward to sessions." },
      { name: "Akbar", stars: 4, text: "Solid teacher for the fee." },
      { name: "Shabana R.", stars: 4, text: "Word meanings and figurative language are much clearer now." }
    ],
    slots: ["Wed 4:30 PM", "Sun 10:00 AM"],
    langs: ["English", "Urdu"],
    about: "Vocabulary tutor for Prep 9. Teaches syllables, silent letters, prefixes and suffixes, and guessing word meanings from context — with fun word games for practice."
  },
  {
    id: "t6", name: "Usman Raza", demo: true, verified: true,
    subjects: ["Grammar"], grades: ["Prep 9"], aksYears: 10,
    lessons: [tag("ak-prep9-english", 84), tag("ak-prep9-english", 85), tag("ak-prep9-english", 73)],
    modes: ["online"], city: "Islamabad", feePKR: 900,
    rating: 4.6, reviewsCount: 5,
    seededReviews: [
      { name: "Hina S.", stars: 5, text: "Prepositions finally make sense to my son. Great concept clarity." },
      { name: "Naveed", stars: 4, text: "Structured lessons, follows the AKS scheme. Slightly fast-paced." },
      { name: "Farah", stars: 4, text: "Good teacher, regular feedback to parents." },
      { name: "Rashid", stars: 5, text: "Punctuation and adjectives both improved a lot." },
      { name: "Saima", stars: 5, text: "My daughter scored 90 in her monthly grammar test." }
    ],
    slots: ["Mon 7:00 PM", "Thu 7:00 PM"],
    langs: ["English", "Urdu"],
    about: "Senior grammar teacher (10 years). Specializes in prepositions, adjectives and punctuation for Prep 9, with structured lessons and parent feedback after each session."
  },
  {
    id: "t7", name: "Hina Gul", demo: true, verified: true,
    subjects: ["Writing"], grades: ["Prep 9"], aksYears: 5,
    lessons: [tag("ak-prep9-english", 91), tag("ak-prep9-english", 92), tag("ak-prep9-english", 96)],
    modes: ["online", "inperson"], city: "Chitral", feePKR: 750,
    rating: 4.8, reviewsCount: 4,
    seededReviews: [
      { name: "Nighat", stars: 5, text: "Paraphrasing and summarizing taught so well — my son's exam answers are much better." },
      { name: "Qurban", stars: 5, text: "She checks every assignment herself. Very dedicated." },
      { name: "Salma", stars: 4, text: "Excellent writing coach. Online audio was patchy once." },
      { name: "Karim", stars: 5, text: "Formal letter format finally memorized properly!" }
    ],
    slots: ["Tue 4:00 PM", "Fri 5:30 PM", "Sun 12:00 PM"],
    langs: ["English", "Urdu", "Khowar"],
    about: "Writing coach for Prep 9 girls and boys. Teaches summarizing by paraphrasing and formal letters & emails, and personally checks every assignment."
  },
  {
    id: "t8", name: "Danish Ali", demo: true, verified: false,
    subjects: ["Reading"], grades: ["Grade 7"], aksYears: 2,
    lessons: [tag("ak-g7-english", 69), tag("ak-g7-english", 76), tag("ak-g7-english", 77)],
    modes: ["online"], city: "Lahore", feePKR: 650,
    rating: 4.5, reviewsCount: 4,
    seededReviews: [
      { name: "Bushra", stars: 5, text: "My son's comprehension answers are now to the point." },
      { name: "Arif", stars: 4, text: "Good teacher, uses the lesson audios well." },
      { name: "Shabana", stars: 4, text: "Helpful sessions. Reading fluency is improving." },
      { name: "Tariq M.", stars: 5, text: "Patient with slow readers. Recommended." }
    ],
    slots: ["Wed 6:00 PM", "Sat 9:30 AM"],
    langs: ["English", "Urdu"],
    about: "Young, energetic reading tutor. Works on fluent reading with expression, guessing word meanings, and skimming — patient with slow or reluctant readers."
  },
  {
    id: "t9", name: "Maria Bibi", demo: true, verified: false,
    subjects: ["Speaking"], grades: ["Prep 9"], aksYears: 7,
    lessons: [tag("ak-prep9-english", 90), tag("ak-prep9-english", 66), tag("ak-prep9-english", 89)],
    modes: ["inperson"], city: "Hunza", feePKR: 1200,
    rating: 4.4, reviewsCount: 5,
    seededReviews: [
      { name: "Razia", stars: 5, text: "Confident speaking practice — my daughter presented in assembly!" },
      { name: "Sultan", stars: 4, text: "Good sessions, my son is less nervous now." },
      { name: "Anita", stars: 4, text: "Professional. Timing is sometimes tight." },
      { name: "Farida", stars: 5, text: "Wonderful with teenagers." },
      { name: "Iqbal", stars: 4, text: "Effective, though a bit pricey." }
    ],
    slots: ["Thu 5:00 PM", "Sun 11:00 AM"],
    langs: ["English", "Urdu", "Burushaski"],
    about: "In-person speaking coach in Hunza (7 years). Builds confident speakers through role-plays, interviews and discussion practice — great for shy teenagers."
  },
  {
    id: "t10", name: "Kamran Hussain", demo: true, verified: true,
    subjects: ["Grammar"], grades: ["Grade 7"], aksYears: 12,
    lessons: [tag("ak-g7-english", 75), tag("ak-g7-english", 79), tag("ak-g7-english", 83), tag("ak-g7-english", 70)],
    modes: ["online"], city: "Karachi", feePKR: 2000,
    rating: 5.0, reviewsCount: 3,
    seededReviews: [
      { name: "Sadia", stars: 5, text: "The best grammar teacher we have found. Every concept crystal clear." },
      { name: "Faisal", stars: 5, text: "Worth the fee — my son topped his class in English grammar." },
      { name: "Mahnoor", stars: 5, text: "Past tense, pronouns, adverbs — all mastered in 8 weeks." }
    ],
    slots: ["Mon 8:00 PM", "Wed 8:00 PM"],
    langs: ["English", "Urdu"],
    about: "Premium grammar tutor with 12 years of experience. Intensive, exam-focused coaching on tenses, pronouns, adverbs and sentence patterns — for families who want the best."
  },
  {
    id: "t11", name: "Rabia Noor", demo: true, verified: false,
    subjects: ["Writing", "Vocabulary"], grades: ["Grade 7"], aksYears: 4,
    lessons: [tag("ak-g7-english", 88), tag("ak-g7-english", 86), tag("ak-g7-english", 80)],
    modes: ["online", "inperson"], city: "Peshawar", feePKR: 700,
    rating: 4.5, reviewsCount: 4,
    seededReviews: [
      { name: "Amina", stars: 5, text: "Descriptive writing improved so much — teacher gives great examples." },
      { name: "Khalid", stars: 4, text: "Good vocabulary practice too. My daughter enjoys it." },
      { name: "Robina", stars: 4, text: "Sincere and regular." },
      { name: "Shahid", stars: 5, text: "Poetry lessons were a bonus — lovely sessions." }
    ],
    slots: ["Tue 3:30 PM", "Sat 10:30 AM"],
    langs: ["English", "Urdu"],
    about: "Writing + vocabulary tutor. Teaches descriptive composition, connotations and shades of meaning, plus poetry — good for creative students."
  },
  {
    id: "t12", name: "Asad Mehmood", demo: true, verified: false,
    subjects: ["Reading", "Grammar"], grades: ["Prep 9"], aksYears: 6,
    lessons: [tag("ak-prep9-english", 81), tag("ak-prep9-english", 93), tag("ak-prep9-english", 86)],
    modes: ["online", "inperson"], city: "Gilgit", feePKR: 850,
    rating: 4.7, reviewsCount: 3,
    seededReviews: [
      { name: "Nusrat", stars: 5, text: "Skimming for the writer's purpose — a skill my son never had before." },
      { name: "Ghulam", stars: 5, text: "Text structure explained brilliantly." },
      { name: "Beena", stars: 4, text: "Very knowledgeable. Sessions run a little long sometimes." }
    ],
    slots: ["Fri 6:00 PM", "Sun 4:00 PM"],
    langs: ["English", "Urdu"],
    about: "Reading + grammar tutor with 6 years in AKS schools. Specializes in text structure, skimming for purpose, and connotations — ideal for board-exam preparation."
  }
];

/* ================= persistence (defensive) ================= */

// All user tutoring data lives under S.tutoring. Old saves won't have it,
// so every accessor creates the shape if missing (never throws).
function tutoring() {
  if (!S.tutoring || typeof S.tutoring !== "object") {
    S.tutoring = { bookings: [], threads: {}, reviews: {}, reports: [], notes: [], verif: [] };
  } else {
    if (!Array.isArray(S.tutoring.bookings)) S.tutoring.bookings = [];
    if (!S.tutoring.threads || typeof S.tutoring.threads !== "object") S.tutoring.threads = {};
    if (!S.tutoring.reviews || typeof S.tutoring.reviews !== "object") S.tutoring.reviews = {};
    if (!Array.isArray(S.tutoring.reports)) S.tutoring.reports = [];
    if (!Array.isArray(S.tutoring.notes)) S.tutoring.notes = [];
    if (!Array.isArray(S.tutoring.verif)) S.tutoring.verif = [];
  }
  return S.tutoring;
}

/* ================= tutor lookup & discovery ================= */

export function getTutor(id) {
  return TUTORS.filter(function (t) { return t.id === id; })[0] || null;
}

// [{schemeId, n, title, code}] — titles/codes copied from the real scheme.
export function tutorTags(t) {
  return (t.lessons || []).map(function (l) {
    return { schemeId: l.schemeId, n: l.n, title: l.title, code: l.code };
  });
}

// Unique SLO ids across all of a tutor's tagged lessons (real scheme lookup).
export function tutorSloIds(t) {
  const out = [];
  tutorTags(t).forEach(function (tg) {
    const scheme = schemeById(tg.schemeId);
    if (!scheme) return;
    lessonSlos(scheme, tg.n).forEach(function (id) {
      if (out.indexOf(id) < 0) out.push(id);
    });
  });
  return out;
}

// Filter by subject/grade/mode/maxFee/verifiedOnly/minRating, and by
// schemeId+lessonN ("teaches my child's current lesson"). All optional.
export function filterTutors(opts) {
  opts = opts || {};
  return TUTORS.filter(function (t) {
    if (opts.subject && t.subjects.indexOf(opts.subject) < 0) return false;
    if (opts.grade && t.grades.indexOf(opts.grade) < 0) return false;
    if (opts.mode && t.modes.indexOf(opts.mode) < 0) return false;
    if (opts.maxFee != null && t.feePKR > Number(opts.maxFee)) return false;
    if (opts.verifiedOnly && !t.verified) return false;
    if (opts.minRating != null && tutorAvgRating(t) < Number(opts.minRating)) return false;
    if (opts.lessonN != null) {
      const n = Number(opts.lessonN);
      const hit = tutorTags(t).some(function (tg) {
        return tg.n === n && (!opts.schemeId || tg.schemeId === opts.schemeId);
      });
      if (!hit) return false;
    }
    return true;
  });
}

// Seeded reviews + parent reviews left in the app, oldest first.
export function tutorReviews(t) {
  const local = (tutoring().reviews[t.id] || []).slice();
  return (t.seededReviews || []).concat(local);
}

// Average rating over seeded + local reviews (1 decimal). t.rating holds the
// seeded-only average; this converges to it and updates as reviews arrive.
export function tutorAvgRating(t) {
  const all = tutorReviews(t);
  if (!all.length) return 0;
  const sum = all.reduce(function (a, r) { return a + (Number(r.stars) || 0); }, 0);
  return Math.round((sum / all.length) * 10) / 10;
}

/* ================= weak-SLO tie-in ================= */

// Unique weak SLOs (pct < 60) from auto-remedial plans + past attempt
// per-SLO scores, worst first. {sloId, title, pct}
export function weakSloSummary() {
  const seen = {};
  function add(id, title, pct) {
    if (!id || id === "story" || typeof pct !== "number" || pct >= 60) return;
    const prev = seen[id];
    if (!prev || pct < prev.pct) seen[id] = { sloId: id, title: title || id, pct: pct };
  }
  (S.remedialPlans || []).forEach(function (p) {
    (p.slos || []).forEach(function (s) { add(s.id, s.title, s.pct); });
  });
  (S.attempts || []).forEach(function (a) {
    Object.keys(a.perSlo || {}).forEach(function (id) {
      const p = a.perSlo[id] || {};
      const pct = p.total ? Math.round(p.score / p.total * 100) : 0;
      add(id, p.title, pct);
    });
  });
  return Object.keys(seen).map(function (k) { return seen[k]; })
    .sort(function (a, b) { return a.pct - b.pct; });
}

// Tutors whose tagged lessons' SLOs intersect the child's weak SLOs,
// each with the matched weak SLOs. [{tutor, matched:[{sloId,title,pct}]}]
export function tutorsForWeakSlos() {
  const weak = weakSloSummary();
  if (!weak.length) return [];
  return TUTORS.map(function (t) {
    const slos = tutorSloIds(t);
    const matched = weak.filter(function (w) { return slos.indexOf(w.sloId) >= 0; });
    return matched.length ? { tutor: t, matched: matched } : null;
  }).filter(Boolean);
}

/* ================= bookings ================= */

export function myBookings() {
  return tutoring().bookings.slice().sort(function (a, b) { return b.created - a.created; });
}

export function getBooking(id) {
  return tutoring().bookings.filter(function (b) { return b.id === id; })[0] || null;
}

export function createBooking(opts) {
  opts = opts || {};
  const t = getTutor(opts.tutorId);
  if (!t) throw new Error("createBooking: unknown tutor " + opts.tutorId);
  if (!opts.slot || t.slots.indexOf(opts.slot) < 0) {
    throw new Error("createBooking: slot not available for " + (t ? t.name : opts.tutorId) + " — " + opts.slot);
  }
  if (!String(opts.parentName || "").trim()) {
    throw new Error("createBooking: parent/guardian name is required — bookings must be parent-mediated");
  }
  const b = {
    id: uid("tb"), tutorId: t.id, slot: opts.slot,
    parentName: String(opts.parentName).trim(), status: "requested",
    created: Date.now(), paid: false
  };
  tutoring().bookings.push(b);
  save();
  return b;
}

export function cancelBooking(id) {
  const b = getBooking(id);
  if (!b) return null;
  b.status = "cancelled";
  save();
  return b;
}

export function rescheduleBooking(id, slot) {
  const b = getBooking(id);
  if (!b) return null;
  const t = getTutor(b.tutorId);
  if (t && t.slots.indexOf(slot) < 0) throw new Error("rescheduleBooking: slot not available — " + slot);
  b.slot = slot;
  save();
  return b;
}

export function markPaid(id, paid) {
  const b = getBooking(id);
  if (!b) return null;
  b.paid = !!paid;
  save();
  return b;
}

/* ================= messaging ================= */

const AUTO_REPLIES = [
  "Thanks for your message! I'll go through it and reply properly after my current class — usually within a few hours.",
  "Noted! Could you share which lesson your child is on this week? Then I can plan the session around it.",
  "Sure — I'm available at my listed slots. Send me a booking request and we'll fix a time 🙂"
];

// Pick the auto-reply by message context: booking/slot questions get the
// scheduling reply, lesson/performance questions get the lesson reply.
function autoReplyFor(text) {
  const s = (text || "").toLowerCase();
  if (/(book|slot|time|when|available|schedule|fee)/.test(s)) return AUTO_REPLIES[2];
  if (/(lesson|weak|test|practice|exam|mark|grade|score|homework)/.test(s)) return AUTO_REPLIES[1];
  return AUTO_REPLIES[0];
}

function welcomeMsg(t) {
  return {
    from: "tutor",
    text: "Assalam-o-Alaikum! This is " + t.name + ". I teach " + t.subjects.join(" & ") +
      " for " + t.grades.join("/") + ". Tell me what your child is working on this week 🙂",
    ts: Date.now()
  };
}

// [{from:"parent"|"tutor", text, ts}] — auto-creates a welcome message from
// the tutor on first open. Unknown tutor -> [].
export function threadFor(tutorId) {
  const store = tutoring();
  if (!store.threads[tutorId]) {
    const t = getTutor(tutorId);
    if (!t) return [];
    store.threads[tutorId] = [welcomeMsg(t)];
    save();
  }
  return store.threads[tutorId];
}

// Parent message + one canned tutor auto-reply. Returns the full thread.
export function sendMessage(tutorId, text) {
  const t = getTutor(tutorId);
  if (!t) throw new Error("sendMessage: unknown tutor " + tutorId);
  const clean = (text || "").trim();
  if (!clean) throw new Error("sendMessage: message text is empty");
  const thread = threadFor(tutorId);
  thread.push({ from: "parent", text: clean, ts: Date.now() });
  thread.push({ from: "tutor", text: autoReplyFor(clean), ts: Date.now() });
  save();
  return thread;
}

/* ================= reviews ================= */

export function addReview(tutorId, r) {
  r = r || {};
  const t = getTutor(tutorId);
  if (!t) throw new Error("addReview: unknown tutor " + tutorId);
  const stars = Number(r.stars);
  if (!(stars >= 1 && stars <= 5)) throw new Error("addReview: stars must be 1–5, got " + r.stars);
  const text = (r.text || "").trim();
  if (!text) throw new Error("addReview: review text is empty");
  const rev = { name: (r.name || "").trim() || "Anonymous", stars: stars, text: text, ts: Date.now() };
  const store = tutoring();
  (store.reviews[tutorId] = store.reviews[tutorId] || []).push(rev);
  save();
  return rev;
}

/* ================= tutor-side progress notes ================= */

export function addProgressNote(bookingId, text, sloIds) {
  const b = getBooking(bookingId);
  if (!b) throw new Error("addProgressNote: unknown booking " + bookingId);
  const clean = (text || "").trim();
  if (!clean) throw new Error("addProgressNote: note text is empty");
  const note = { bookingId: bookingId, tutorId: b.tutorId, text: clean, sloIds: sloIds || [], ts: Date.now() };
  tutoring().notes.push(note);
  save();
  return note;
}

export function notesForBooking(bookingId) {
  return tutoring().notes
    .filter(function (n) { return n.bookingId === bookingId; })
    .sort(function (a, b) { return b.ts - a.ts; });
}

/* ================= safety ================= */

export function reportTutor(tutorId, reason) {
  const t = getTutor(tutorId);
  if (!t) throw new Error("reportTutor: unknown tutor " + tutorId);
  const rep = { id: uid("rep"), tutorId: tutorId, reason: (reason || "").trim(), status: "open", ts: Date.now() };
  tutoring().reports.push(rep);
  save();
  return rep;
}

export function requestVerification(tutorId) {
  const t = getTutor(tutorId);
  if (!t) throw new Error("requestVerification: unknown tutor " + tutorId);
  const v = { id: uid("ver"), tutorId: tutorId, status: "pending", ts: Date.now() };
  tutoring().verif.push(v);
  save();
  return v;
}

export const SAFETY = {
  chat: "Keep all communication inside LinguaBuddy — never share phone numbers, addresses, CNIC or bank details.",
  pay: "Never pay outside the agreed method. LinguaBuddy never asks for your bank details."
};
