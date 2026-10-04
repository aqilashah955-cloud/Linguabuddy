// LinguaBuddy — shared screen router + bottom-nav sync.
// Every module routes through showScreen() so the nav always reflects
// where the student is.

const NAVMAP = {
  "screen-home": "home",
  "screen-learn": "learn", "screen-lesson": "learn", "screen-remedy": "learn",
  "screen-browse": null, "screen-setup": null, "screen-attempt": null, "screen-result": null,
  "screen-school": null, "screen-ak": null, "screen-marks": null,
  "screen-library": "read", "screen-story": "read",
  "screen-vocab": "vocab", "screen-word": "vocab", "screen-flash": "vocab", "screen-vquiz": "vocab",
  "screen-progress": "progress",
  "screen-profile": "profile",
  "screen-games": "games",
  "screen-mywork": "mywork",
  "screen-kids": "kids",
  "screen-worksheets": "worksheets",
  "screen-daily": "daily",
  "screen-sayit": "sayit",
  "screen-parents": "parents",
  "screen-certs": "certs",
  "screen-testprep": "testprep",
  "screen-pro": "pro",
  "screen-moretests": "moretests",
  "screen-buddies": "buddies",
  "screen-auth": null, "screen-forgot": null,
  "screen-ob-name": null, "screen-ob-goals": null, "screen-ob-level": null, "screen-ob-age": null, "screen-ob-ready": null
};

export function showScreen(id, nav) {
  document.querySelectorAll(".screen").forEach(function (el) { el.classList.add("hidden"); });
  const el = document.getElementById(id);
  if (el) el.classList.remove("hidden");
  window.scrollTo(0, 0);
  const name = nav !== undefined ? nav : (NAVMAP[id] || null);
  document.querySelectorAll(".navbtn").forEach(function (b) {
    b.classList.toggle("active", b.getAttribute("data-nav") === name);
  });
  document.getElementById("bottomNav").classList.toggle("hidden", !name);
}
