// ghost-boot.js
(() => {
  if (!localStorage.getItem("ghost")) return;

  const boot = document.createElement("div");
  boot.id = "ghostBoot";
  document.body.appendChild(boot);

  const lines = [
    "🔓 Decrypting vault memory...",
    "🛰️ Initializing cybernetic operative link...",
    "✅ Connection stabilized.",
    "👻 Ghost Mode Activated. Welcome, Operative."
  ];

  let idx = 0;
  function nextLine() {
    if (idx >= lines.length) {
      setTimeout(() => boot.remove(), 1000); // smooth exit
      return;
    }
    const p = document.createElement("p");
    p.className = "ghost-line";
    p.style.animationDelay = `${idx * 0.8}s`;
    p.textContent = lines[idx++];
    boot.appendChild(p);
    setTimeout(nextLine, 800);
  }

  nextLine();
})();
