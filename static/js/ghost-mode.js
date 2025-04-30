<script>
(() => {
  const html = document.documentElement;
  const ghostKey = "vaultGhostMode";

  /* Enable hacker mode */
  function activateGhost() {
    html.dataset.ghostMode = "true";
    localStorage.setItem(ghostKey, "1");
  }

  /* Disable hacker mode */
  function deactivateGhost() {
    delete html.dataset.ghostMode;
    localStorage.removeItem(ghostKey);
  }

  /* Check saved */
  if (localStorage.getItem(ghostKey) === "1") {
    activateGhost();
  }

  /* Listen for secret unlock: ghost + enter */
  let keys = [];
  window.addEventListener("keydown", (e) => {
    keys.push(e.key.toLowerCase());
    if (keys.join("").includes("ghost")) {
      activateGhost();
      spawnConfetti();
    }
    if (keys.length > 10) keys.shift();
  });

  /* Neon Confetti on Unlock */
  function spawnConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 2 + 1,
      color: '#00FF00'
    }));

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.speedY;
        if (p.y > window.innerHeight) p.y = 0;
      });
      requestAnimationFrame(render);
    }
    render();
    setTimeout(() => canvas.remove(), 4000);
  }
})();
</script>

