{# Updated skip_nav.html #}
<div id="skipBar"
     class="fixed inset-x-0 top-0 z-[9998] flex items-center justify-between
            bg-gradient-to-r from-green-400 via-cyan-400 to-green-400
            p-3 text-black font-mono text-sm uppercase tracking-wider shadow-xl
            transform -translate-y-full transition-transform duration-500 ease-out pointer-events-none"
     role="navigation"
     aria-label="Skip links (Press ⌘↑)">
  <div id="warpText"
       class="absolute inset-x-0 -translate-y-1/2 text-center text-lg font-black mix-blend-difference
              text-green-400 opacity-0 scale-90 transition-all duration-500 glitch-flicker shake-on-show"
       aria-hidden="true">
    WARP MODE ENGAGED
  </div>

  <div class="flex gap-6">
    <a href="#main"
       class="hover:underline focus-visible:ring-2 focus-visible:ring-black rounded px-2 py-1"
       title="Skip to main content">
      Skip to Main
    </a>
    <a href="#footer"
       class="hover:underline focus-visible:ring-2 focus-visible:ring-black rounded px-2 py-1"
       title="Skip to footer">
      Skip to Footer
    </a>
  </div>

  <button id="skipBarClose"
          class="rounded-full bg-black text-green-400 hover:bg-green-400 hover:text-black transition p-2 focus-visible:ring-2 focus-visible:ring-black"
          aria-label="Close skip navigation">
    ✖️
  </button>

  <canvas id="confettiCanvas" class="absolute inset-0 pointer-events-none"></canvas>
</div>

<script>
(() => {
  const skipBar = document.getElementById("skipBar");
  const warpText = document.getElementById("warpText");
  const closeBtn = document.getElementById("skipBarClose");
  let confetti;

  function showSkipBar() {
    skipBar.classList.remove("-translate-y-full", "pointer-events-none");
    skipBar.classList.add("translate-y-0", "pointer-events-auto");

    warpText.classList.replace("opacity-0", "opacity-100");
    warpText.classList.replace("scale-90", "scale-100");

    // optional sound
    new Audio('/static/audio/warp-sound.mp3').play().catch(() => {});

    // optional confetti
    if (window.ConfettiGenerator) {
      confetti = new ConfettiGenerator({ target: "confettiCanvas", max: 80 });
      confetti.render();
    }

    setTimeout(() => {
      warpText.classList.replace("opacity-100", "opacity-0");
      warpText.classList.replace("scale-100", "scale-90");
    }, 1500);

    setTimeout(() => document.querySelector("#skipBar a")?.focus(), 400);
  }

  function hideSkipBar() {
    skipBar.classList.add("-translate-y-full", "pointer-events-none");
    skipBar.classList.remove("translate-y-0");
    if (confetti) confetti.clear();
  }

  window.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "ArrowUp") {
      e.preventDefault();
      showSkipBar();
    }
    if (e.key === "Escape") {
      hideSkipBar();
    }
  });
  closeBtn.addEventListener("click", hideSkipBar);
})();
</script>

<style>
  @keyframes cyberpunkFlicker { /* unchanged */ }
  .glitch-flicker { animation: cyberpunkFlicker 2.5s infinite alternate; }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-4px); }
    40%, 80% { transform: translateX(4px); }
  }
  .shake-on-show { animation: shake 0.6s ease-in-out; }
  canvas#confettiCanvas { z-index: 9997; pointer-events: none; }
</style>

