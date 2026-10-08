// LinguaBuddy — Firebase layer (Auth + Firestore).
// Graceful degradation: if window.FB_CONFIG still has PASTE_ME values,
// FB.ready stays false and the app runs 100% locally on localStorage.
// Nothing here ever bricks the app when Firebase is unavailable.

const FB = {
  ready: false,
  auth: null,
  db: null,
  user: null,       // firebase user object when signed in
  fns: null         // loaded SDK functions
};

function cfg() { return (typeof window !== "undefined" && window.FB_CONFIG) || {}; }
export function isConfigured() {
  const c = cfg();
  return !!(c.apiKey && c.apiKey !== "PASTE_ME" && c.projectId && c.projectId !== "PASTE_ME");
}

export async function initFirebase() {
  if (!isConfigured()) return FB; // local mode
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import("firebase/app"), import("firebase/auth"), import("firebase/firestore")
    ]);
    const c = cfg();
    const app = appMod.initializeApp({
      apiKey: c.apiKey, authDomain: c.authDomain, projectId: c.projectId,
      storageBucket: c.storageBucket, messagingSenderId: c.messagingSenderId, appId: c.appId
    });
    FB.fns = { appMod: appMod, authMod: authMod, fsMod: fsMod };
    FB.auth = authMod.getAuth(app);
    FB.db = fsMod.getFirestore(app);
    FB.ready = true;
  } catch (e) {
    FB.ready = false; // stay in local mode
  }
  return FB;
}

export function fb() { return FB; }

// Resolve a login ID (or email) to an email address for sign-in.
export async function resolveEmail(loginIdOrEmail) {
  const v = String(loginIdOrEmail || "").trim();
  if (!v) throw new Error("Enter your login ID or email.");
  if (v.indexOf("@") >= 0) return v.toLowerCase();
  if (!FB.ready) throw new Error("Login IDs need the online version. Use your name to continue locally.");
  const id = v.toLowerCase();
  const { fsMod } = FB.fns;
  const snap = await fsMod.getDoc(fsMod.doc(FB.db, "loginIds", id));
  if (!snap.exists()) throw new Error("No account found for this login ID.");
  return snap.data().email;
}

const LOGINID_RE = /^[a-z0-9_]{3,20}$/;
export function validLoginId(id) { return LOGINID_RE.test(String(id || "").toLowerCase()); }

export async function signUp(opts) {
  // opts: {name, loginId, email, password, ageGroup, level, goals, role}
  if (!FB.ready) throw new Error("Sign-up needs the online version.");
  const loginId = String(opts.loginId || "").toLowerCase().trim();
  if (!validLoginId(loginId)) throw new Error("Login ID: 3–20 characters, lowercase letters, numbers or _ only.");
  const { authMod, fsMod } = FB.fns;
  // 1. claim the login ID (fails cleanly if taken)
  const idRef = fsMod.doc(FB.db, "loginIds", loginId);
  const idSnap = await fsMod.getDoc(idRef);
  if (idSnap.exists()) throw new Error("That login ID is taken. Try another one.");
  // 2. create the auth user
  const cred = await authMod.createUserWithEmailAndPassword(FB.auth, opts.email.trim().toLowerCase(), opts.password);
  const uid = cred.user.uid;
  const now = Date.now();
  // 3. write loginIds mapping + user doc
  await fsMod.setDoc(idRef, { email: opts.email.trim().toLowerCase(), uid: uid, createdAt: now });
  await fsMod.setDoc(fsMod.doc(FB.db, "users", uid), {
    name: opts.name.trim(), loginId: loginId, email: opts.email.trim().toLowerCase(),
    role: opts.role === "teacher" ? "teacher" : "student",
    ageGroup: opts.ageGroup || "", level: opts.level || "Beginner",
    goals: opts.goals || [], streak: 0, xp: 0, badges: [], createdAt: now
  });
  FB.user = cred.user;
  return cred.user;
}

export async function signIn(loginIdOrEmail, password) {
  if (!FB.ready) throw new Error("Sign-in needs the online version.");
  const email = await resolveEmail(loginIdOrEmail);
  const { authMod } = FB.fns;
  const cred = await authMod.signInWithEmailAndPassword(FB.auth, email, password);
  FB.user = cred.user;
  return cred.user;
}

export async function signOut() {
  if (FB.ready && FB.auth) {
    try { await FB.fns.authMod.signOut(FB.auth); } catch (e) {}
  }
  FB.user = null;
}

export async function resetPassword(email) {
  if (!FB.ready) throw new Error("Password reset needs the online version.");
  await FB.fns.authMod.sendPasswordResetEmail(FB.auth, String(email).trim().toLowerCase());
}

export function onAuthChange(cb) {
  if (!FB.ready) return function () {};
  return FB.fns.authMod.onAuthStateChanged(FB.auth, function (u) {
    FB.user = u || null;
    cb(u || null);
  });
}

// ---- Firestore user data (best-effort; never throws) ----
async function safe(promise) { try { return await promise; } catch (e) { return null; } }

export async function getUserDoc(uid) {
  if (!FB.ready || !uid) return null;
  const { fsMod } = FB.fns;
  const snap = await safe(fsMod.getDoc(fsMod.doc(FB.db, "users", uid)));
  return snap && snap.exists() ? snap.data() : null;
}

export async function saveUserDoc(uid, data) {
  if (!FB.ready || !uid) return;
  const { fsMod } = FB.fns;
  await safe(fsMod.setDoc(fsMod.doc(FB.db, "users", uid), data, { merge: true }));
}

export async function saveSubmission(uid, sub) {
  if (!FB.ready || !uid) return;
  const { fsMod } = FB.fns;
  const payload = Object.assign({ studentId: uid }, sub);
  // Attach the student's teachers' uids so class teachers can read this
  // submission (see firestore.rules). The student can read their own
  // classes via the studentIds membership rule.
  try {
    const cq = fsMod.query(fsMod.collection(FB.db, "classes"),
      fsMod.where("studentIds", "array-contains", uid));
    const snap = await fsMod.getDocs(cq);
    const tids = [];
    snap.docs.forEach(function (d) {
      const t = d.data().teacherId;
      if (t && tids.indexOf(t) < 0) tids.push(t);
    });
    payload.teacherIds = tids;
  } catch (e) { payload.teacherIds = []; }
  await safe(fsMod.setDoc(fsMod.doc(FB.db, "submissions", sub.id), payload));
}

export async function saveVocabWord(uid, word) {
  if (!FB.ready || !uid) return;
  const { fsMod } = FB.fns;
  await safe(fsMod.setDoc(fsMod.doc(FB.db, "vocabulary", uid, "words", word.word.toLowerCase()), word));
}

export async function saveReadingProgress(uid, readingId, prog) {
  if (!FB.ready || !uid) return;
  const { fsMod } = FB.fns;
  await safe(fsMod.setDoc(fsMod.doc(FB.db, "readingProgress", uid, readingId), prog));
}

// ---- "My Work" photo uploads (js/mywork.js) ----
// The Firestore doc holds ONLY the Storage download URL — never photo
// bytes. teacherIds mirrors saveSubmission so each class teacher reads
// only their own students' work.
export async function saveWorkUpload(uid, docId, meta) {
  if (!FB.ready || !uid) return;
  const { fsMod } = FB.fns;
  const payload = Object.assign({ studentId: uid }, meta);
  try {
    const cq = fsMod.query(fsMod.collection(FB.db, "classes"),
      fsMod.where("studentIds", "array-contains", uid));
    const snap = await fsMod.getDocs(cq);
    const tids = [];
    snap.docs.forEach(function (d) {
      const t = d.data().teacherId;
      if (t && tids.indexOf(t) < 0) tids.push(t);
    });
    payload.teacherIds = tids;
  } catch (e) { payload.teacherIds = []; }
  await safe(fsMod.setDoc(fsMod.doc(FB.db, "writingUploads", docId), payload));
}

// Upload a handwritten-work photo to Firebase Storage.
// Lazily imports firebase/storage so local/offline mode never pays for it.
export async function uploadWorkPhoto(uid, docId, blob) {
  if (!FB.ready || !uid || !blob) return null;
  try {
    const stMod = await import("firebase/storage");
    const storage = stMod.getStorage();
    const ref = stMod.ref(storage, "writing/" + uid + "/" + docId + ".jpg");
    await stMod.uploadBytes(ref, blob, { contentType: "image/jpeg" });
    return await stMod.getDownloadURL(ref);
  } catch (e) { return null; }
}

// Save a student's profile photo as a data URL (stored in their Firestore
// user doc by the caller). No Firebase Storage: Storage now requires a paid
// Blaze plan, and a 256px JPEG (~30KB) fits easily in the 1MB Firestore
// document limit.
export async function uploadProfilePhoto(uid, blob) {
  if (!uid || !blob) return null;
  try {
    const dataUrl = await new Promise(function (resolve, reject) {
      const r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = function () { reject(new Error("read failed")); };
      r.readAsDataURL(blob);
    });
    if (typeof dataUrl !== "string" || dataUrl.indexOf("data:image/") !== 0) return null;
    if (dataUrl.length > 900000) return null; // keep well under the 1MB doc limit
    return dataUrl;
  } catch (e) { return null; }
}
