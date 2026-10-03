// LinguaBuddy — pure utility functions (DOM-free, testable in node).
// Seeded RNG lets us generate unique-but-deterministic question variants
// per student (anti-copy: no two students get the same paper).

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStr(s) {
  let h = 2166136261;
  const str = String(s);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// rand: optional () => [0,1). Defaults to Math.random.
export function shuffle(a, rand) {
  const r = rand || Math.random;
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

export function sample(a, n, rand) {
  return shuffle(a, rand).slice(0, Math.min(n, a.length));
}

export function norm(s) {
  return String(s == null ? "" : s).trim().toLowerCase()
    .replace(/[.!?]+$/g, "").replace(/\s+/g, " ");
}

export function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const m = Math.floor(sec / 60), s = sec % 60;
  return (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}

export function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short" }) + ", " +
         d.toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" });
}

export function uid(prefix) {
  return (prefix || "id") + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
}

export function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

export function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

export function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}
