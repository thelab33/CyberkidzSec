// static/js/ghost-mode.js
(() => {
  const GHOST_KEY = 'vaultGhostMode';
  const html      = document.documentElement;
  let   keyBuffer = [];

  // ── Boot Animation Messages ──
  const bootLines = [
    'Bootloader initializing...',
    'Decrypting vault memory...',
    'Establishing encrypted connection to Vault...',
    '🛰️ Live Vault Feed secured.',
    'Decrypting Ghost Mode payload...',
    '🧪 Injecting Neon Hacker DNA...',
    '🌌 CyberForge system calibration complete.',
    '🚀 Launching Vault Ghost Mode Sequence...',
    '👻 Ghost Mode Activated: Terminal Override Engaged.'
  ];

  // ── Utility: Typewriter for a line ──
  function typeLine(line, container, delay = 50) {
    let i = 0;
    const iv = setInterval(() => {
      container.textContent += line[i++] || '';
      if (i > line.length) {
        clearInterval(iv);
        container.insertAdjacentHTML('beforeend', '<br>');
      }
    }, delay);
  }

  // ── Start Full‐Screen Boot Animation ──
  function startBootAnimation() {
    if (document.getElementById('ghostBootScreen')) return;
    const screen = document.createElement('div');
    screen.id = 'ghostBootScreen';
    screen.className = 'fixed inset-0 z-[99999] bg-black text-neonGreen font-mono text-sm p-6 overflow-auto';
    const log = document.createElement('pre');
    log.id = 'ghostBootLog';
    screen.appendChild(log);
    document.body.appendChild(screen);

    let idx = 0;
    const next = () => {
      if (idx >= bootLines.length) {
        setTimeout(() => screen.remove(), 1200);
      } else {
        typeLine(bootLines[idx++], log);
        setTimeout(next, 1200);
      }
    };
    next();
  }

  // ── Spawn Neon Confetti ──
  function spawnNeonConfetti() {
    import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js')
      .then(({ default: confetti }) => {
        confetti({ particleCount: 200, spread: 100, decay: 0.9, gravity: 0.3, origin: { y: 0.3 } });
      });
  }

  // ── Activate Ghost Mode ──
  function activateGhostMode() {
    html.dataset.ghostMode = 'true';
    localStorage.setItem(GHOST_KEY, '1');
    spawnNeonConfetti();
    startBootAnimation();
    // Optional: show any ghost‐badge overlay
    document.getElementById('ghostMsg')?.classList.remove('hidden');
  }

  // ── Init on Page Load ──
  function initGhostMode() {
    // If already unlocked, fire animation immediately
    if (localStorage.getItem(GHOST_KEY) === '1') {
      activateGhostMode();
    }
    // Listen for typing “ghost”
    window.addEventListener('keydown', e => {
      keyBuffer.push(e.key.toLowerCase());
      if (keyBuffer.length > 5) keyBuffer.shift();
      if (keyBuffer.join('') === 'ghost') {
        activateGhostMode();
        keyBuffer = [];
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initGhostMode);
})();

