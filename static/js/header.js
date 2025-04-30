// main.js
document.addEventListener('DOMContentLoaded', () => {
  initSkipNav();
  initHeaderBehavior();    // ← new unified header logic
  initHUDToolbarDrag();
  initHeroTyper();
  initConfetti();
  initVaultBreachCheck();
});


// ---------------------------------------------------------
// Header behaviour — vanilla port of React logic
// ---------------------------------------------------------
function initHeaderBehavior() {
  const header      = document.getElementById("siteHeader");
  const progressBar = document.getElementById("scrollProgress");
  const menuToggle  = document.getElementById("menuToggle");
  const mobileNav   = document.getElementById("mobileNav");
  const themeToggle = document.getElementById("themeToggle");
  const ghostBadge  = document.getElementById("ghostMsg"); // assuming you renamed ghostBadge→ghostMsg
  const keys        = [];

  // ── Theme Persistence & Toggle ──
  const applyTheme = t => document.documentElement.classList.toggle("dark", t === "dark");
  let theme = localStorage.getItem("theme") || "dark";
  applyTheme(theme);
  // if you use an icon inside the button rather than text:
  // themeToggle.querySelector("i").className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  themeToggle.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    // update icon/text here if needed
  });

  // ── Scroll Progress & Auto-Hide Header ──
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.pageYOffset;
    // progress bar
    const max = document.body.scrollHeight - window.innerHeight;
    const pct = Math.min(1, y / max);
    progressBar.style.transform = `scaleX(${pct})`;

    // hide header when scrolling down past 100px
    header.style.transform = (y > lastY && y > 100)
      ? "translateY(-100%)"
      : "translateY(0)";
    lastY = y;
  });

  // ── Mobile Menu Toggle ──
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("translate-y-0");
    mobileNav.classList.toggle("-translate-y-full", !isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen);
    // swap icon if you're using text:
    // menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // ── Ghost-Mode Easter Egg (“g” then “h”) ──
  window.addEventListener("keydown", e => {
    keys.push(e.key.toLowerCase());
    if (keys.length > 2) keys.shift();
    if (keys.join("") === "gh") {
      ghostBadge.classList.remove("hidden");
      setTimeout(() => ghostBadge.classList.add("hidden"), 4000);
      keys.length = 0;
    }
  });
}

