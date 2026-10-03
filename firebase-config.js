// LinguaBuddy — Firebase web config.
// 1. Create a free Firebase project (Spark plan) at console.firebase.google.com.
// 2. Enable Email/Password sign-in, create a Firestore database, publish firestore.rules.
// 3. Project settings → Your apps → Web → copy the config values below.
// Until the real values are pasted in, the app runs fully offline on localStorage.
window.FB_CONFIG = {
  apiKey: "PASTE_ME",
  authDomain: "PASTE_ME",
  projectId: "PASTE_ME",
  storageBucket: "PASTE_ME",
  messagingSenderId: "PASTE_ME",
  appId: "PASTE_ME"
};
// Owner's email — the admin role. Full read access in firestore.rules.
window.OWNER_EMAIL = "REPLACE_WITH_OWNER_EMAIL";
window.APP_NAME = "LinguaBuddy";
