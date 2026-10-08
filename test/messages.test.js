// LinguaBuddy — student ↔ teacher messaging unit tests.
// Plain node, no network, no DOM. Run: node test/messages.test.js

import { readFileSync } from "fs";
import { threadId } from "../js/messages.js";

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; }
  else { fail++; console.log("FAIL:", name); }
}

/* ---- thread id: deterministic, one per pair ---- */
ok("threadId joins with _", threadId("t1", "s1") === "t1_s1");
ok("threadId is order-sensitive", threadId("t1", "s1") !== threadId("s1", "t1"));
ok("threadId stable", threadId("abc", "xyz") === threadId("abc", "xyz"));

/* ---- firestore.rules carries the threads rules ---- */
const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
ok("rules: threads match", rules.indexOf("match /threads/{tid}") >= 0);
ok("rules: messages subcollection", rules.indexOf("match /threads/{tid}/messages/{mid}") >= 0);
ok("rules: isThreadParty helper", rules.indexOf("function isThreadParty(tid)") >= 0);
ok("rules: student creates thread", /match \/threads\/\{tid\}[\s\S]*?allow create: if signedIn\(\)\s*\n?\s*&& request\.resource\.data\.studentId == request\.auth\.uid/.test(rules));
ok("rules: message length cap", rules.indexOf("text.size() <= 2000") >= 0);
ok("rules: no message edits", /messages\/\{mid\}[\s\S]*?allow update, delete: if false/.test(rules));

/* ---- app router ---- */
const appSrc = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
ok("app: teachers route", appSrc.indexOf('case "teachers": renderTeachers();') >= 0);
ok("app: messages setGo wired", appSrc.indexOf("setMsgGo") >= 0);

/* ---- dashboard tile ---- */
const dashSrc = readFileSync(new URL("../js/dashboard.js", import.meta.url), "utf8");
ok("dashboard: Teachers tile", dashSrc.indexOf('{ e: "👩‍🏫", t: "Teachers", d: "teachers" }') >= 0);

/* ---- teacher messages tab ---- */
const teacherSrc = readFileSync(new URL("../js/teacher.js", import.meta.url), "utf8");
ok("teacher: Messages tab", teacherSrc.indexOf('["messages", "💬 Messages"]') >= 0);
ok("teacher: renders inbox", teacherSrc.indexOf("renderTeacherInbox(body)") >= 0);

/* ---- screen exists ---- */
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
ok("html: screen-teachers", html.indexOf('id="screen-teachers"') >= 0);
ok("html: msgBody", html.indexOf('id="msgBody"') >= 0);

/* ---- safety banner ---- */
const msgSrc = readFileSync(new URL("../js/messages.js", import.meta.url), "utf8");
ok("messages: safety banner", msgSrc.indexOf("never share phone numbers") >= 0);
ok("messages: unread counters", msgSrc.indexOf("unreadTeacher") >= 0 && msgSrc.indexOf("unreadStudent") >= 0);

console.log(pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
