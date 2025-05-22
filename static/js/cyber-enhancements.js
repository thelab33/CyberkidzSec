document.addEventListener('DOMContentLoaded', () => {
  // ─── 1️⃣ Warp Overlay Injection ───
  const overlay = document.createElement('div');
  overlay.id = 'warp-overlay';
  document.body.prepend(overlay);

  // ─── 2️⃣ AOS Init ───
  if (window.AOS) {
    AOS.init({ offset: 120, delay: 100, duration: 600, easing: 'ease-in-out', once: true, mirror: false });
  }

  // ─── 3️⃣ Scroll Progress & Header Shrink ───
  const progressEl = document.getElementById('scrollProgress');
  const headerEl = document.getElementById('siteHeader');
  const updateScroll = throttle(() => {
    const scrollY = window.scrollY;
    const docH = document.body.scrollHeight - window.innerHeight;
    if (progressEl) progressEl.style.transform = `scaleX(${docH > 0 ? scrollY / docH : 0})`;
    if (headerEl) headerEl.classList.toggle('scrolled', scrollY > 50);
  }, 16);
  document.addEventListener('scroll', updateScroll);
  updateScroll();

  // ─── 4️⃣ Audio FX ───
  const audio = {
    click: new Audio('/static/sfx/keyboard-clack.mp3'),
    unlock: new Audio('/static/static/sfx/vhs-unlock.mp3'),
    swoosh: new Audio('/static/sfx/swoosh.mp3'),
    breach: new Audio('/static/sfx/breach.mp3'),
  };
  Object.values(audio).forEach(a => a.volume = 0.15);

  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('.vault-popup-trigger')) audio.unlock.play();
    else if (t.matches('a, .report-card, button')) audio.click.play();
    else if (t.closest('#themeToggle')) audio.swoosh.play();
  });
// ─── 5️⃣ Theme & Ghost Mode ───
const themeBtn = document.getElementById('themeToggle');
const html = document.documentElement;
const body = document.body;

// ✅ Updated: Now stores "true" / "false" in dataset
const applyTheme = (mode) => {
  html.dataset.theme = mode;
  localStorage.setItem('theme', mode);
};

const applyGhost = (enabled) => {
  const value = enabled ? 'true' : 'false'; // 🔄 Now string "true"/"false"
  html.dataset.ghostMode = value;
  body.dataset.ghostMode = value;
  localStorage.setItem('ghost', value); // Stored for consistency
};

// ✅ Read from localStorage using updated string
applyTheme(localStorage.getItem('theme') || 'dark');
applyGhost(localStorage.getItem('ghost') === 'true');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'm') {
      const mode = prompt('Enter theme mode (dark, light, ghost, infrared):');
      if (mode) {
        if (mode === 'ghost') {
          applyGhost(true);
        } else {
          applyGhost(false);
          mode === 'infrared' ? applyTheme('infrared') : applyTheme(mode);
        }
      }
    }
  });
}

  // ─── 6️⃣ WebSocket Vault Feed ───
  const statusEl = document.getElementById('vaultStatusLive');
  if (statusEl && location.protocol.startsWith('http')) {
    let ws;
    const connectWS = () => {
      const proto = location.protocol === 'https:' ? 'wss' : 'ws';
      ws = new WebSocket(`${proto}://${location.host}/ws/status`);
      ws.onmessage = ({ data }) => {
        statusEl.textContent = `Vault: ${data}`;
        statusEl.classList.toggle('bg-green-600', data === 'LIVE');
        statusEl.classList.toggle('bg-red-600', data !== 'LIVE');
      };
      ws.onclose = () => {
        statusEl.textContent = 'Disconnected';
        statusEl.classList.remove('bg-green-600');
        statusEl.classList.add('bg-red-600');
        setTimeout(connectWS, 3000); // reconnect
      };
    };
    connectWS();
  }

  // ─── 7️⃣ Bootloader System ───
  const boot = document.getElementById('bootloader');
  const bootLinesEl = document.getElementById('bootLines');
  if (boot && bootLinesEl) {
    const bootLines = [
      `[0.00] Initializing CYBERKIDZSEC Vault System...`,
      `[0.21] Engaging Ghost Mode Subsystems...`,
      `[0.34] ⚠️ Memory Leak Detected in Sector 7G`,
      `[0.42] HUD Interface Compiled.`,
      `#!@% Error: /dev/null overflow`,
      `[0.73] Authenticating Operative: 🧠 Codebreaker`,
      `[0.91] 🚨 Subspace Trace Signal Detected`,
      `[1.04] Neural Sync Lock Established.`,
      `SYSTEM: Breach Protocols Engaged...`,
      `[1.48] Vault Stability: ✔ Stable`,
      `[2.00] ✅ WARP MODE Online — Stay Ghosted. 💀`
    ];

    const classifyLine = (text) => {
      if (text.includes('ERROR') || text.includes('⚠️') || text.includes('Trace')) return 'error';
      if (text.includes('#!@%') || text.includes('Breach')) return 'glitch';
      if (text.includes('✔') || text.includes('✅')) return 'success';
      return '';
    };

    bootLinesEl.innerHTML = '';
    bootLines.forEach((line, i) => {
      const span = document.createElement('span');
      span.textContent = line;
      span.classList.add('line');
      const type = classifyLine(line);
      if (type) span.classList.add(type);
      setTimeout(() => bootLinesEl.appendChild(span), i * 300);
    });

    const totalDelay = bootLines.length * 300 + 1000;
    setTimeout(() => {
      boot.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      showPostBootCursor();
    }, totalDelay);

    boot.addEventListener('click', () => {
      boot.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      showPostBootCursor();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        boot.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        showPostBootCursor();
      }
    });

    function showPostBootCursor() {
      const cursor = document.createElement('div');
      cursor.className = 'post-boot-cursor';
      cursor.textContent = '~$';
      document.body.appendChild(cursor);
    }
  }

  // ─── 8️⃣ Breach Glitch Alert ───
  const breachEl = document.getElementById('ghostBreachWarning');
  const footer = document.getElementById('footer');
  if (breachEl && footer) {
    const stability = parseInt(footer.dataset.vaultStability || '100', 10);
    const ghostMode = document.body.dataset.ghostMode === 'true';
    if (ghostMode && stability < 50) {
      breachEl.style.display = 'block';
      audio.breach.play().catch(() => {});
      document.body.classList.add('glitch');
      setTimeout(() => document.body.classList.remove('glitch'), 2000);
    }
  }

  // ─── 9️⃣ Utility: Throttle ───
  function throttle(fn, wait) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last > wait) {
        last = now;
        fn(...args);
      }
    };
  }
});

const initStarfield = () => {
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animationFrame;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const numStars = Math.floor((canvas.width * canvas.height) / 8000);
    stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random(),
      delta: Math.random() * 0.02 + 0.005,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.alpha += star.delta;
      if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;

      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener('resize', resize);

  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
  };
};

