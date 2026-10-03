// LinguaBuddy — Lingoo the owl mascot + tiny dependency-free confetti.
// Everything here is DOM-free except confettiBurst() (guarded), so the
// module imports cleanly in node tests.

export const MASCOT_MOODS = ["wave", "happy", "thinking", "celebrate", "sleep"];

/**
 * Return an inline SVG string of Lingoo, a cute cartoon owl with a
 * graduation cap. mood: "wave" (default) | "happy" | "thinking" |
 * "celebrate" | "sleep". Compact (<60 elements) but charming.
 */
export function mascotSVG(mood) {
  mood = MASCOT_MOODS.indexOf(mood) >= 0 ? mood : "wave";

  // ---- eyes vary by mood ----
  var eyes;
  if (mood === "happy") {
    // closed happy arcs ^ ^
    eyes = '<path d="M62 96 q12 -14 24 0" stroke="#2b2b3a" stroke-width="6" fill="none" stroke-linecap="round"/>' +
           '<path d="M114 96 q12 -14 24 0" stroke="#2b2b3a" stroke-width="6" fill="none" stroke-linecap="round"/>';
  } else if (mood === "sleep") {
    // sleepy lines - -
    eyes = '<line x1="60" y1="98" x2="86" y2="98" stroke="#2b2b3a" stroke-width="6" stroke-linecap="round"/>' +
           '<line x1="114" y1="98" x2="140" y2="98" stroke="#2b2b3a" stroke-width="6" stroke-linecap="round"/>';
  } else {
    // big open eyes; pupils shift for "thinking"
    var px = mood === "thinking" ? -6 : 0, py = mood === "thinking" ? -5 : 0;
    eyes = '<g class="lingoo-eyes">' +
      '<circle cx="73" cy="98" r="17" fill="#ffffff" stroke="#2b2b3a" stroke-width="3"/>' +
      '<circle cx="127" cy="98" r="17" fill="#ffffff" stroke="#2b2b3a" stroke-width="3"/>' +
      '<circle cx="' + (73 + px) + '" cy="' + (100 + py) + '" r="7" fill="#2b2b3a"/>' +
      '<circle cx="' + (127 + px) + '" cy="' + (100 + py) + '" r="7" fill="#2b2b3a"/>' +
      '<circle cx="' + (76 + px) + '" cy="' + (97 + py) + '" r="2.5" fill="#ffffff"/>' +
      '<circle cx="' + (130 + px) + '" cy="' + (97 + py) + '" r="2.5" fill="#ffffff"/>' +
      '</g>';
  }

  // ---- beak: open smile for happy/celebrate, small triangle otherwise ----
  var beak = (mood === "happy" || mood === "celebrate")
    ? '<ellipse cx="100" cy="122" rx="11" ry="9" fill="#f59e0b" stroke="#2b2b3a" stroke-width="3"/>'
    : '<path d="M90 116 L110 116 L100 128 Z" fill="#f59e0b" stroke="#2b2b3a" stroke-width="3" stroke-linejoin="round"/>';

  // ---- wings: wave raises the right wing, celebrate raises both ----
  var wingL = '<ellipse cx="44" cy="140" rx="14" ry="30" fill="#6d5ff2" stroke="#2b2b3a" stroke-width="3" transform="rotate(12 44 140)"/>';
  var wingR;
  if (mood === "celebrate") {
    wingR = '<ellipse cx="156" cy="100" rx="14" ry="30" fill="#6d5ff2" stroke="#2b2b3a" stroke-width="3" transform="rotate(-150 156 100)"/>' +
            '<ellipse cx="44" cy="100" rx="14" ry="30" fill="#6d5ff2" stroke="#2b2b3a" stroke-width="3" transform="rotate(150 44 100)"/>';
    wingL = ""; // both wings drawn in wingR for celebrate
  } else if (mood === "wave") {
    wingR = '<ellipse cx="156" cy="100" rx="14" ry="30" fill="#6d5ff2" stroke="#2b2b3a" stroke-width="3" transform="rotate(-135 156 100)"/>' +
            '<path d="M160 62 q6 -8 12 0 M166 56 q6 -8 12 0" stroke="#2b2b3a" stroke-width="3" fill="none" stroke-linecap="round"/>';
  } else if (mood === "thinking") {
    // wing resting near chin
    wingR = '<ellipse cx="140" cy="140" rx="12" ry="26" fill="#6d5ff2" stroke="#2b2b3a" stroke-width="3" transform="rotate(-35 140 140)"/>';
  } else {
    wingR = '<ellipse cx="156" cy="140" rx="14" ry="30" fill="#6d5ff2" stroke="#2b2b3a" stroke-width="3" transform="rotate(-12 156 140)"/>';
  }

  // ---- mood extras ----
  var extra = "";
  if (mood === "thinking") {
    extra = '<text x="162" y="60" font-size="34" fill="#2b2b3a" font-weight="bold">?</text>';
  } else if (mood === "sleep") {
    extra = '<text x="150" y="52" font-size="26" fill="#7c6ff0" font-weight="bold">Z</text>' +
            '<text x="166" y="34" font-size="20" fill="#9b8ffa" font-weight="bold">z</text>' +
            '<text x="178" y="20" font-size="14" fill="#b8aefc" font-weight="bold">z</text>';
  } else if (mood === "celebrate") {
    extra = '<g fill="#fbbf24" stroke="#b45309" stroke-width="1.5">' +
      '<polygon points="30,40 34,50 44,50 36,56 39,66 30,60 21,66 24,56 16,50 26,50"/>' +
      '<polygon points="170,36 173,43 181,43 175,48 177,56 170,51 163,56 165,48 159,43 167,43"/>' +
      '<polygon points="150,170 152,175 158,175 153,179 155,185 150,181 145,185 147,179 142,175 148,175"/>' +
      '</g>';
  }

  return '<svg viewBox="0 0 200 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lingoo the owl mascot" class="lingoo lingoo-' + mood + '">' +
    // body + belly
    '<ellipse cx="100" cy="125" rx="58" ry="66" fill="#7c6ff0" stroke="#2b2b3a" stroke-width="4"/>' +
    '<ellipse cx="100" cy="142" rx="36" ry="42" fill="#ede9fe"/>' +
    wingL + wingR +
    eyes + beak +
    // feet
    '<rect x="72" y="184" width="22" height="10" rx="5" fill="#f59e0b" stroke="#2b2b3a" stroke-width="3"/>' +
    '<rect x="106" y="184" width="22" height="10" rx="5" fill="#f59e0b" stroke="#2b2b3a" stroke-width="3"/>' +
    // graduation cap: board + band + tassel
    '<polygon points="100,6 158,30 100,54 42,30" fill="#1e3a8a" stroke="#2b2b3a" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M76 44 L76 62 q24 14 48 0 L124 44" fill="#274690" stroke="#2b2b3a" stroke-width="3"/>' +
    '<line x1="158" y1="30" x2="158" y2="58" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="158" cy="62" r="6" fill="#fbbf24" stroke="#b45309" stroke-width="2"/>' +
    extra +
    '</svg>';
}

/**
 * Tiny dependency-free canvas confetti burst (~80 particles, ~2.6s,
 * then the canvas removes itself). Safe no-op outside a browser.
 */
export function confettiBurst() {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  var c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;";
  document.body.appendChild(c);
  c.width = window.innerWidth; c.height = window.innerHeight;
  var ctx = c.getContext("2d");
  var colors = ["#7c6ff0", "#fbbf24", "#34d399", "#f472b6", "#60a5fa", "#f87171"];
  var ps = [];
  for (var i = 0; i < 80; i++) {
    ps.push({
      x: c.width / 2 + (Math.random() - 0.5) * 120,
      y: c.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 10 - 4,
      w: 5 + Math.random() * 5, h: 8 + Math.random() * 6,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      col: colors[i % colors.length]
    });
  }
  var t0 = Date.now();
  function tick() {
    var el = Date.now() - t0;
    ctx.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (el < 2600) {
      requestAnimationFrame(tick);
    } else if (c.parentNode) {
      c.parentNode.removeChild(c);
    }
  }
  tick();
}
