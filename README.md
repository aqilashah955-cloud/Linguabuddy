# LinguaBuddy — *Your AI companion for better English*

A warm, mobile-friendly English learning app built on a strict SLO learning
cycle:

**TEACH → PRACTICE → ASSESS → ANALYZE → REMEDIATE → READ → REASSESS**

Part 1 (student app + Firebase foundation) and Part 2 (teacher/admin systems +
advanced student features) are both built.

## Contents

```
~/workspace/english-teacher/
├── index.html            # all screens (auth, onboarding, home, learn, lesson,
│                         # browse, setup, attempt, result, remedy, library,
│                         # story, vocab, word, flashcards, quizzes, progress,
│                         # profile, grammar, writing, convo, ask, teacher,
│                         # class, admin, gate) + bottom nav + modal + toast
├── styles.css            # warm cream / ink-blue / marigold theme
├── firebase-config.js    # window.FB_CONFIG (PASTE_ME until configured),
│                         # window.OWNER_EMAIL, window.APP_NAME
├── firestore.rules       # rules_version '2' — paste into Firebase console
├── package.json          # {"type":"module"} so node --check treats js/ as ESM
├── data/
│   ├── slos.js           # 12 SLOs × 10 questions (verbatim, versioned)
│   ├── stories.js        # 8 stories × 5 quiz questions (verbatim, versioned)
│   ├── lessons.js        # per-SLO lesson: objective, warm-up, key points,
│   │                     # examples, remediation tip, application prompt
│   ├── words.js          # vocabulary bank (word, POS, def, synonyms,
│   │                     # antonyms, example, Urdu gloss)
│   ├── storymeta.js      # per-story: prediction Q, vocab support, inference
│   │                     # question, writing extension, genre, related SLOs
│   ├── writing.js        # 10 writing prompts (sentence → paragraph → text)
│   └── convo.js          # 7 conversation role-play scripts (node trees)
└── js/
    ├── app.js            # boot, router go(), bottom nav, profile screen
    │                     # (+ badges), role-gated nav
    ├── ui.js             # showScreen + nav sync
    ├── firebase.js       # init, login-ID resolution, signup, login, logout,
    │                     # reset password, Firestore read/write helpers,
    │                     # saveSubmission attaches teacherIds for the inbox
    ├── auth.js           # auth UI: login (ID or email), signup, forgot, logout
    ├── onboarding.js     # name → goals → level (+ 15-Q placement test) →
    │                     # "Your personalized learning path is ready!"
    ├── dashboard.js      # home (Continue Learning, Today's English, bars,
    │                     # streak, counts, My Assignments) + progress screen
    │                     # (+ full progress report with recommendations)
    ├── learn.js          # lesson view, practice/assess setup, finishAssessment,
    │                     # remediation flow, reading recommendation (+ XP/badges)
    ├── assess.js         # attempt runner (timer, anti-copy, tab counter),
    │                     # result screen with per-question explanations,
    │                     # attemptActive() lock, summarizeResults()
    ├── reading.js        # library with filters, story view (before/during/
    │                     # after), story quizzes, next-reading suggestions
    ├── vocab.js          # my vocabulary, add-word, flashcards, matching &
    │                     # fill-blank quizzes (+ XP per word)
    ├── gamify.js         # XP table, awardXP, badges, earn toasts, checkBadges
    ├── grammar.js        # Grammar Lab: topic index → standard lesson cycle
    ├── writing.js        # Writing Lab: rule-based feedback, NEVER rewrites
    ├── convo.js          # Conversation practice: scripted role-plays +
    │                     # supportive feedback
    ├── ask.js            # AI-teacher Q&A from the curated knowledge base
    │                     # (+ LLM plug-in point, assessment lock)
    ├── teacher.js        # teacher dashboard: classes, assignments, inbox,
    │                     # analytics, per-student reports (+ role guards)
    ├── admin.js          # admin panel: users, role changes, platform counts
    ├── store.js          # localStorage state + best-effort Firestore mirror
    └── engine.js         # pure engine: buildItems, gradeItem, explainItem,
                          # mastery, adaptive difficulty, remediation,
                          # reassessment, placement, recommendations,
                          # class analytics + progress reports (Part 2)
```

## Part 2 — what was added

**Teacher dashboard** (`js/teacher.js`, role-gated: only when the signed-in
user's profile has `role == "teacher"`):
- **Classes** — create classes, add students by Login ID (resolved via
  `loginIds/{loginId}` online; by name offline), per-student mastery chips.
- **Assignments** — pick SLOs + question count + due date → writes
  `assignments/{id}`. Students see "My Assignments" on Home; one attempt each.
- **Submissions inbox** — every graded attempt is mirrored to Firestore
  `submissions/{id}` with `teacherIds` attached, so each teacher reads only
  their own students' work. Per-question answers + auto-check results expand
  inline.
- **Class analytics** — SLO × (Mastered / Developing / Needs Practice) counts.
  Clicking an SLO shows students needing support, most-missed question types,
  class average, and a suggested intervention (+ one-tap remediation
  assignment). Per-student detail is private to the teacher — nothing is
  publicly ranked.
- **Progress reports** — per-student report (level, strengths, areas to
  improve, SLO progress bars, recommended next steps), also used for the
  student's own "My Progress" report with clickable recommendations.

**Admin panel** (`js/admin.js`, only when `users/{uid}.email == OWNER_EMAIL`):
user list (first 200), role changes (student/teacher; owner keeps full rights),
platform counts (users, classes, assignments, submissions). Kept light.

**Gamification UI** (`js/gamify.js`): XP table (correct answer 10, partial 4,
assessment 50, story+quiz 70, word 15, writing feedback 25, conversation 30,
lesson opened 20, streak day 25…), badges (First Lesson, 7-Day Streak, Story
Reader, Word Collector, Writing Star, SLO Master, Game Night) with earn toasts, streak +
XP on the profile, badge shelf. No competitive leaderboards.

**Game Arcade** (`js/games.js`, route `games`, nav 🎮): six 60-second arcade
rounds, all offline from bundled data — Word Scramble (typed unscramble with
Urdu hint), Hangman (definition clue, 6 misses), Speed Match (word↔definition
tapping with streak bonus), Error Detective (tap the grammar mistake, then
pick the fix; 13 curated error sentences across tenses/SVA/articles/
prepositions/voice/speech/punctuation/clauses, several derived from real bank
stems), Sentence Sprint (reorder shuffled bank sentences), Synonym Showdown
(alternating synonym/antonym rounds from the WORDS bank). Scores convert to
XP (`xpForScore` = score/10, min 1), each round is recorded as a practice
attempt (keeps streaks working, visible in the teacher submissions inbox) and
counts toward the "Game Night" badge (3 rounds). Pure helpers
(`scrambleWord`, hangman state machine, `calcMatchScore`, `pickErrorItems`,
`makeSynAntRound`) are exported for tests in `test/games.test.js`.

**Grammar Lab** (`js/grammar.js`): topic index from the SLO banks (parts of
speech → punctuation), each topic opens the standard learning cycle
(Explain → Example → Guided Practice → Independent Practice → Assessment →
Remediation) via `learn.js` — no duplicated flow.

**Writing Lab** (`js/writing.js`): sentence → paragraph → descriptive /
narrative / letter / email / story / essay prompts. `analyzeWriting()`
highlights issues by category (grammar, vocabulary, organization, spelling,
punctuation), explains each, gives a hint, and asks the learner to correct —
it **never rewrites the text**. Rule/keyword-based, so it catches common
learner errors, not every possible mistake (documented limitation).

**Conversation practice** (`js/convo.js`): 7 guided role-plays (introductions,
classroom, shopping, travel, interviews, storytelling…) from curated node
trees (`data/convo.js`); the partner follows keyword branches with supportive
fallbacks; feedback after each role-play leads with strengths, then ≤2 next
steps.

**AI-teacher "Ask"** (`js/ask.js`): `askTeacher(question)` answers from the
curated knowledge base (SLO explanations, vocabulary bank, grammar rules).
Hints-first: while an assessment attempt is active (`attemptActive()`), it
refuses direct answers and gives only hints.

### LLM plug-in point

To connect a real AI tutor later, open `js/ask.js` and find the marked
`─── LLM PLUG-IN POINT ───` comment inside `askTeacher()`: replace the
`answerFromKB(question)` call with an async call to your LLM endpoint (pass
the question + the learner's level as context). Keep the `attemptActive()`
check **before** the LLM call so the tutor can never leak answers during a
test.

## Teacher guide (quick start)

1. Sign up with the **Teacher** role (or ask the admin to set it).
2. Open **🎓 Teacher** → **🏫 Classes** → **+ New Class**.
3. Open the class → add students by their Login ID.
4. **📝 Assignments** → pick SLOs, question count, due date → Create.
5. **📥 Inbox** shows each student's answers and scores as they submit.
6. **📊 Analytics** shows SLO × mastery counts; tap a row for the detail view
   (students needing support, common errors, intervention suggestion).
7. Students see their assignments on **Home → My Assignments**.

## Admin guide

Set `window.OWNER_EMAIL` in `firebase-config.js` to the owner's email. That
account sees **⚙️ Admin** in the nav: user list, role changes (student ⇄
teacher), and platform counts. The Firestore rules also let only the owner
change the `role` field — a user can never promote themselves (see
`firestore.rules`).

## Architecture decisions

1. **Curated content is bundled, not in Firestore.** `data/*.js` ship with the
   app as versioned modules (`DATA_VERSION_SLOS`, `DATA_VERSION_STORIES`).
   This means the app works fully offline and costs **zero Firestore reads**.
   Firestore holds only user/instance data (profiles, loginIds, classes,
   assignments, submissions, vocabulary, reading progress).
2. **Graceful degradation.** If `firebase-config.js` still contains the
   `PASTE_ME` placeholders, `initFirebase()` returns `{ready:false}` and the
   app runs 100% locally on `localStorage` (`english_teacher_v1`) — it is never
   bricked by a missing backend. Login-ID features are online-only. Teacher
   classes/assignments/inbox also work offline on the same device.
3. **Login IDs.** Signup writes `loginIds/{loginId}` → `{email, uid}` before
   creating the Auth user (fail-closed: if the doc is taken, signup stops).
   The login screen resolves Login ID → email → Firebase sign-in.
4. **Mastery from multiple evidence points.** `calculateSLOMastery()` weights
   the last ≤5 evidence points (recent counts more); *Mastered* requires ≥3
   evidence points AND ≥80% average — never from a single question or attempt.
   ≥50% → Developing, else Needs Practice.
5. **Adaptive difficulty, 5 levels per SLO** (L1 choose-the-correct-form →
   L2 correct-the-sentence → L3 complete-the-paragraph → L4 write-sentences →
   L5 creative application); `adjustLevel()` moves ±1 on ≥80% / <50%.
6. **Anti-copy assessments.** Timer, selection/copy/paste disabled, tab-switch
   counter, one attempt per worksheet (locked in localStorage), and question
   order/options shuffled with a seeded RNG keyed by user id — every student
   gets a unique variant.
7. **Remediation never repeats the original worksheet.** `generateRemediation()`
   excludes the failed question `bankKey`s (`"sloId:bankIndex"`) and targets the
   missed question types; `generateReassessment()` draws fresh items from the
   remaining bank (supplements other SLOs if a bank runs dry).
8. **Submissions carry `teacherIds`.** `saveSubmission()` attaches the uids of
   the student's class teachers (read from the student's own classes, which
   the rules let them read). The rules grant a teacher read access only to
   submissions whose `teacherIds` include them — no cross-class snooping.
9. **No public ranking.** Analytics are aggregate; per-student detail is
   visible only to that student's teacher. No leaderboards anywhere.

## SLOs (12 × 10 questions)

1. Tenses — 2. Subject-Verb Agreement — 3. Active & Passive Voice —
4. Direct & Indirect Speech — 5. Articles (a, an, the) — 6. Prepositions —
7. Punctuation & Capitalization — 8. Sentence Types & Clauses —
9. Synonyms & Antonyms — 10. Prefixes, Suffixes & Vocabulary —
11. Reading Comprehension — 12. Paragraph Writing.

Question types across banks: `mcq`, `fill`, `truefalse`, `order`, `reorder`,
`match`, `write`.

## Firebase setup (owner)

1. Create a free project at console.firebase.google.com (Spark plan is enough).
2. Enable **Authentication → Email/Password**; create a **Firestore** database.
3. Project settings → Web app → copy values into `firebase-config.js`.
4. Paste `firestore.rules` into Firestore → Rules → Publish
   (replace `REPLACE_WITH_OWNER_EMAIL` with the admin's email).
5. Serve locally: `python3 -m http.server` in this folder (ES modules need
   http://, not file://). Enable GitHub Pages (Settings → Pages → main →
   /(root)) to go live.

## Verification

`npm run check` runs `node --check` on every JS file. Unit tests:
- `node test/engine.test.js` — login-ID→email resolution (stubbed), mastery
  engine (one good question ≠ Mastered; 3+ evidences at ≥80% → Mastered),
  remediation never reusing the original questions, no-Firebase degradation.
- `node test/part2.test.js` — teacher analytics math from fake submissions,
  role gating (teacher/admin guards, incl. unconfigured OWNER_EMAIL),
  writing-lab never emitting a rewrite, `askTeacher` refusing answers during an
  active assessment, gamification XP math + badge idempotency, conversation
  feedback shape.
- `node test/games.test.js` — arcade helpers: scramble keeps letters, hangman
  state machine (win/lose/repeat), match deck + streak-bonus scoring, every
  error item marks exactly one mistake, reorder permutation, synonym/antonym
  round options, XP conversion, Game Night badge registration.

## Contents

```
~/workspace/english-teacher/
├── index.html            # all screens (auth, onboarding, home, learn, lesson,
│                         # browse, setup, attempt, result, remedy, library,
│                         # story, vocab, word, flashcards, quizzes, progress,
│                         # profile) + bottom nav + Firebase importmap
├── styles.css            # warm cream / ink-blue / marigold theme
├── firebase-config.js    # window.FB_CONFIG (PASTE_ME until configured),
│                         # window.OWNER_EMAIL, window.APP_NAME
├── firestore.rules       # rules_version '2' — paste into Firebase console
├── package.json          # {"type":"module"} so node --check treats js/ as ESM
├── data/
│   ├── slos.js           # 12 SLOs × 10 questions (verbatim, versioned)
│   ├── stories.js        # 8 stories × 5 quiz questions (verbatim, versioned)
│   ├── lessons.js        # per-SLO lesson: objective, warm-up, key points,
│   │                     # examples, remediation tip, application prompt
│   ├── words.js          # vocabulary bank (word, POS, def, synonyms,
│   │                     # antonyms, example, Urdu gloss)
│   └── storymeta.js      # per-story: prediction Q, vocab support, inference
│                         # question, writing extension, genre, related SLOs
└── js/
    ├── app.js            # boot, router go(), bottom nav, profile screen
    ├── ui.js             # showScreen + nav sync
    ├── firebase.js       # init, login-ID resolution, signup, login, logout,
    │                     # reset password, Firestore read/write helpers
    ├── auth.js           # auth UI: login (ID or email), signup, forgot, logout
    ├── onboarding.js     # name → goals → level (+ 15-Q placement test) →
    │                     # "Your personalized learning path is ready!"
    ├── dashboard.js      # home (Continue Learning, Today's English, bars,
    │                     # streak, counts) + progress screen
    ├── learn.js          # lesson view, practice/assess setup, finishAssessment,
    │                     # remediation flow, reading recommendation
    ├── assess.js         # attempt runner (timer, anti-copy, tab counter),
    │                     # result screen with per-question explanations
    ├── reading.js        # library with filters, story view (before/during/
    │                     # after), story quizzes, next-reading suggestions
    ├── vocab.js          # my vocabulary, add-word, flashcards, matching &
    │                     # fill-blank quizzes
    ├── store.js          # localStorage state + best-effort Firestore mirror
    └── engine.js         # pure engine: buildItems, gradeItem, explainItem,
                          # mastery, adaptive difficulty, remediation,
                          # reassessment, placement, recommendations
```

## Architecture decisions

1. **Curated content is bundled, not in Firestore.** `data/*.js` ship with the
   app as versioned modules (`DATA_VERSION_SLOS`, `DATA_VERSION_STORIES`).
   This means the app works fully offline and costs **zero Firestore reads**.
   Firestore holds only user/instance data (profiles, loginIds, submissions,
   vocabulary, reading progress).
2. **Graceful degradation.** If `firebase-config.js` still contains the
   `PASTE_ME` placeholders, `initFirebase()` returns `{ready:false}` and the
   app runs 100% locally on `localStorage` (`english_teacher_v1`) — it is never
   bricked by a missing backend. Login-ID features are online-only.
3. **Login IDs.** Signup writes `loginIds/{loginId}` → `{email, uid}` before
   creating the Auth user (fail-closed: if the doc is taken, signup stops).
   The login screen resolves Login ID → email → Firebase sign-in.
4. **Mastery from multiple evidence points.** `calculateSLOMastery()` weights
   the last ≤5 evidence points; *Mastered* requires ≥3 evidence points AND ≥80%
   average — never from a single question or attempt. ≥50% → Developing, else
   Needs Practice.
5. **Adaptive difficulty, 5 levels per SLO** (L1 choose-the-correct-form →
   L2 correct-the-sentence → L3 complete-the-paragraph → L4 write-sentences →
   L5 creative application); `adjustLevel()` moves ±1 on ≥80% / <50%.
6. **Anti-copy assessments.** Timer, selection/copy/paste disabled, tab-switch
   counter, one attempt per worksheet (locked in localStorage), and question
   order/options shuffled with a seeded RNG keyed by user id — every student
   gets a unique variant.
7. **Remediation never repeats the original worksheet.** `generateRemediation()`
   excludes the failed question `bankKey`s (`"sloId:bankIndex"`) and targets the
   missed question types; `generateReassessment()` draws fresh items from the
   remaining bank (supplements other SLOs if a bank runs dry).

## Firebase setup (owner)

1. Create a free project at console.firebase.google.com (Spark plan is enough).
2. Enable **Authentication → Email/Password**; create a **Firestore** database.
3. Project settings → Web app → copy values into `firebase-config.js`.
4. Paste `firestore.rules` into Firestore → Rules → Publish
   (replace `REPLACE_WITH_OWNER_EMAIL` with the admin's email).
5. Serve locally: `python3 -m http.server` in this folder (ES modules need
   http://, not file://). Then create a GitHub repo named **linguabuddy**,
   grant the GitHub App access, and push.

## Verification

`npm run check` runs `node --check` on every JS file. Unit tests:
- `node test/engine.test.js` — login-ID→email resolution (stubbed), mastery
  engine (one good question ≠ Mastered; 3+ evidences at ≥80% → Mastered),
  remediation never reusing the original questions, no-Firebase degradation.
- `node test/part2.test.js` — teacher analytics math from fake submissions,
  role gating (teacher/admin guards, incl. unconfigured OWNER_EMAIL),
  writing-lab never emitting a rewrite, `askTeacher` refusing answers during an
  active assessment, gamification XP math + badge idempotency, conversation
  feedback shape.
