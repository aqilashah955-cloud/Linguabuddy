# LinguaBuddy — *Your AI companion for better English*

Part 1 of 2: student app + Firebase foundation. A warm, mobile-friendly English
learning app built on a strict SLO learning cycle:

**TEACH → PRACTICE → ASSESS → CHECK → REMEDIATE → REASSESS → READ**

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

## SLOs (12 × 10 questions)

1. Parts of Speech — 2. Subject-Verb Agreement — 3. Tenses — 4. Articles —
5. Prepositions — 6. Sentence Structure — 7. Punctuation — 8. Vocabulary in
Context — 9. Synonyms & Antonyms — 10. Active & Passive Voice —
11. Direct & Indirect Speech — 12. Paragraph Writing.

Question types across banks: `mcq`, `fill`, `truefalse`, `order`, `reorder`,
`match`, `write`.

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

`npm run check` runs `node --check` on every JS file. Unit tests cover:
login-ID→email resolution (stubbed), the mastery engine (one good question ≠
Mastered; 3+ evidences at ≥80% → Mastered), remediation never reusing the
original questions, and no-Firebase graceful degradation.

## Part 2 (deferred)

Teacher dashboard (classes, assignments, analytics), admin panel, gamification
(XP/badges UI — data fields exist), grammar/writing labs, conversation
practice, AI-teacher chat. The old teacher panel from the previous app was
dropped in favor of a proper Part-2 dashboard. Teachers can already sign up
with the `teacher` role; their profile stores it.
