/* ---------------------------------------------------------
   Header behaviour — vanilla port of React logic
--------------------------------------------------------- */
(() => {
  const header       = document.getElementById("siteHeader");
  const progressBar  = document.getElementById("scrollProgress");
  const menuToggle   = document.getElementById("menuToggle");
  const mobileNav    = document.getElementById("mobileNav");
  const themeToggle  = document.getElementById("themeToggle");
  const ghostBadge   = document.getElementById("ghostBadge");

  /* ---------- theme persistence ---------- */
  const applyTheme = t =>
    document.documentElement.classList.toggle("dark", t === "dark");

  let theme = localStorage.getItem("theme") || "dark";
  applyTheme(theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";

  themeToggle.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    localStorage.setItem("theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  });

  /* ---------- scroll progress + hide-on-scroll ---------- */
  let last = 0;
  window.addEventListener("scroll", () => {
    // progress bar
    const max   = document.body.scrollHeight - innerHeight;
    const ratio = Math.min(1, scrollY / max);
    progressBar.style.transform = `scaleX(${ratio})`;

    // hide header when scrolling downward
    header.style.transform =
      scrollY > last && scrollY > 100 ? "translateY(-80px)"
                                      : "translateY(0)";
    last = scrollY;
  });

  /* ---------- mobile menu ---------- */
  menuToggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("hidden");
    menuToggle.textContent = open ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", open);
    // optional analytics ping
    // fetch('/api/log?vault_nav_opened');
  });

  /* ---------- ghost-mode easter egg ("g" then "h") ---------- */
  const keys = [];
  window.addEventListener("keydown", e => {
    keys.push(e.key.toLowerCase());
    keys.splice(0, keys.length - 2);
    if (keys.join("") === "gh") {
      ghostBadge.classList.remove("hidden");
      setTimeout(() => ghostBadge.classList.add("hidden"), 4000);
      keys.length = 0;
    }
  });
})();

