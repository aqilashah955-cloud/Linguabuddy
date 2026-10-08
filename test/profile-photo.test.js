// LinguaBuddy — profile photo feature unit tests.
// Plain node, no network, no DOM. Run: node test/profile-photo.test.js

import { readFileSync } from "fs";

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; }
  else { fail++; console.log("FAIL:", name); }
}

/* ---- storage.rules carries the profile-photos rule ---- */
const rules = readFileSync(new URL("../storage.rules", import.meta.url), "utf8");
ok("rules: profile-photos path", rules.indexOf("match /profile-photos/{uid}.jpg") >= 0);
ok("rules: owner-only writes", /profile-photos[\s\S]*?allow write: if signedIn\(\) && request\.auth\.uid == uid/.test(rules));
ok("rules: signed-in reads", /profile-photos[\s\S]*?allow read: if signedIn\(\)/.test(rules));
ok("rules: admin email set", rules.indexOf("nizarsyed74@gmail.com") >= 0);
ok("rules: no REPLACE_WITH_OWNER_EMAIL left", rules.indexOf("REPLACE_WITH_OWNER_EMAIL") < 0);

/* ---- firebase.js exports the uploader ---- */
const fbSrc = readFileSync(new URL("../js/firebase.js", import.meta.url), "utf8");
ok("firebase: uploadProfilePhoto exported", fbSrc.indexOf("export async function uploadProfilePhoto") >= 0);
ok("firebase: uploads to profile-photos/", fbSrc.indexOf('"profile-photos/" + uid + ".jpg"') >= 0);

/* ---- dashboard wires the photo UI ---- */
const dashSrc = readFileSync(new URL("../js/dashboard.js", import.meta.url), "utf8");
ok("dashboard: photoToSquareBlob", dashSrc.indexOf("function photoToSquareBlob") >= 0);
ok("dashboard: saves photoURL to user doc", dashSrc.indexOf("saveUserDoc(fb().user.uid, { photoURL: url })") >= 0);
ok("dashboard: shows photo in header", dashSrc.indexOf("S.profile.photoURL") >= 0);

/* ---- profile modal has the photo controls ---- */
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
ok("modal: photo preview img", html.indexOf('id="profPhotoPreview"') >= 0);
ok("modal: change-photo button", html.indexOf('id="profPhotoBtn"') >= 0);
ok("modal: hidden file input", html.indexOf('id="profPhotoInput"') >= 0);

/* ---- teacher roster shows photos ---- */
const teacherSrc = readFileSync(new URL("../js/teacher.js", import.meta.url), "utf8");
ok("teacher: resolveStudent carries photoURL", teacherSrc.indexOf("photoURL: (u && u.photoURL)") >= 0);
ok("teacher: roster renders photo", teacherSrc.indexOf("r.photoURL") >= 0);

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
