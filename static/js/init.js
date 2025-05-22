document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animations
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 120,
    });
  }

  // Initialize Starfield background if available
  if (window.initStarfieldCoreCore) {
    window.initStarfieldCoreCore("bg-starfield");
  }

  // Fade-in page overlay (optional)
  const overlay = document.getElementById("page-fade-overlay");
  if (overlay) {
    overlay.classList.remove("opacity-0");
    overlay.classList.add("opacity-0");
    setTimeout(() => overlay.remove(), 500);
  }

  // Focus management for search (Cmd+K)
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const cmdPalette = document.getElementById("command-palette");
      if (cmdPalette) cmdPalette.classList.remove("hidden");
    }
  });

  // Scroll progress bar update
  window.addEventListener("scroll", () => {
    const sp = document.getElementById("scrollProgress");
    if (sp) {
      const h = document.documentElement,
        b = document.body;
      const st = h.scrollTop || b.scrollTop,
        sh = h.scrollHeight - h.clientHeight;
      sp.style.width = sh ? (st / sh) * 100 + "%" : "0%";
    }
  });

  // Cmd+K hint on desktop only
  if (window.matchMedia("(hover: hover)").matches) {
    const hint = document.createElement("div");
    hint.textContent = "⌘ Cmd + K — Search";
    hint.className =
      "fixed bottom-2 right-4 z-[999] text-xs text-orange-400 font-mono animate-pulse";
    document.body.appendChild(hint);
    setTimeout(() => hint.remove(), 4000);
  }
});
// init logic placeholder
