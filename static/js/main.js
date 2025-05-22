// static/js/main.js — Starforge Unified Main Script

// Utility: Throttle function
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

// 0. Skip-Nav Integration
function initSkipNav() {
  const skipBar  = document.getElementById('skipBar');
  const warpText = document.getElementById('warpText');
  const closeBtn = document.getElementById('skipBarClose');
  let confetti;

  function showSkipBar() {
    skipBar.classList.add('visible');
    warpText.classList.add('opacity-100', 'scale-100', 'translate-y-0');
    warpText.classList.remove('opacity-0', 'scale-90', '-translate-y-1/2');
    if (window.ConfettiGenerator) {
      confetti = new ConfettiGenerator({ target: 'confettiCanvas', max: 80 });
      confetti.render();
    }
  }

  function hideSkipBar() {
    skipBar.classList.remove('visible');
    warpText.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
    warpText.classList.add('opacity-0', 'scale-90', '-translate-y-1/2');
    if (confetti) confetti.clear();
  }

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowUp') {
      e.preventDefault();
      showSkipBar();
    }
    if (e.key === 'Escape') hideSkipBar();
  });
  closeBtn?.addEventListener('click', hideSkipBar);
}

// 1. Warp Overlay Injection (only once, into the #hero)
function initWarpOverlay() {
  const hero = document.getElementById('hero');
  if (!hero || hero.querySelector('#warp-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'warp-overlay';
  hero.prepend(overlay);
}

// 2. AOS Init
function initAOS() {
  if (window.AOS) {
    AOS.init({ offset: 120, delay: 100, duration: 600, easing: 'ease-in-out', once: true, mirror: false });
  }
}

// 3. Scroll Progress & Header Shrink
function initScrollHeader() {
  const progressEl = document.getElementById('scrollProgress');
  const headerEl   = document.getElementById('siteHeader');
  const update = throttle(() => {
    const y = window.scrollY;
    const max = document.body.scrollHeight - window.innerHeight;
    if (progressEl) progressEl.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (headerEl) headerEl.classList.toggle('scrolled', y > 50);
  }, 16);
  document.addEventListener('scroll', update);
  update();
}

// 4. Audio FX
function initAudioFX() {
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
  return audio;
}

// 5. Theme & Ghost Mode
function initThemeGhost(audio) {
  const themeBtn = document.getElementById('themeToggle');
  const html = document.documentElement;
  const body = document.body;

  const applyTheme = mode => {
    html.dataset.theme = mode;
    localStorage.setItem('theme', mode);
  };
  const applyGhost = enabled => {
    const val = enabled ? 'true' : 'false';
    html.dataset.ghostMode = val;
    body.dataset.ghostMode = val;
    localStorage.setItem('ghost', val);
  };

  applyTheme(localStorage.getItem('theme') || 'dark');
  applyGhost(localStorage.getItem('ghost') === 'true');

  themeBtn?.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
  window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'm') {
      const mode = prompt('Enter theme mode (dark, light, ghost, infrared):');
      if (!mode) return;
      if (mode === 'ghost') applyGhost(true);
      else {
        applyGhost(false);
        mode === 'infrared' ? applyTheme('infrared') : applyTheme(mode);
      }
    }
  });
}

// 6. WebSocket Vault Feed
function initVaultFeed() {
  const statusEl = document.getElementById('vaultStatusLive');
  if (!statusEl || !location.protocol.startsWith('http')) return;

  const connect = () => {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${location.host}/ws/status`);
    ws.onmessage = ({ data }) => {
      statusEl.textContent = `Vault: ${data}`;
      statusEl.classList.toggle('bg-green-600', data === 'LIVE');
      statusEl.classList.toggle('bg-red-600', data !== 'LIVE');
    };
    ws.onclose = () => {
      statusEl.textContent = 'Disconnected';
      statusEl.classList.replace('bg-green-600', 'bg-red-600');
      setTimeout(connect, 3000);
    };
  };
  connect();
}

// 7. Bootloader System
function initBootloader() {
  const boot   = document.getElementById('bootloader');
  const logEl  = document.getElementById('bootLines');
  if (!boot || !logEl) return;
  const lines = [
    '[0.00] Initializing CYBERKIDZSEC Vault System...',
    '[0.21] Engaging Ghost Mode Subsystems...',
    '[0.34] ⚠️ Memory Leak Detected in Sector 7G',
    '[0.42] HUD Interface Compiled.',
    '#!@% Error: /dev/null overflow',
    '[0.73] Authenticating Operative: 🧠 Codebreaker',
    '[0.91] 🚨 Subspace Trace Signal Detected',
    '[1.04] Neural Sync Lock Established.',
    'SYSTEM: Breach Protocols Engaged...',
    '[1.48] Vault Stability: ✔ Stable',
    '[2.00] ✅ WARP MODE Online — Stay Ghosted. 💀'
  ];
  const classify = t => t.match(/ERROR|⚠️|Trace/) ? 'error' : t.match(/#!@%|Breach/) ? 'glitch' : t.match(/✔|✅/) ? 'success' : '';
  logEl.innerHTML = '';
  lines.forEach((ln, i) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.textContent = ln;
      span.classList.add('line', classify(ln));
      logEl.appendChild(span);
    }, i * 300);
  });
  setTimeout(() => hideBoot(), lines.length * 300 + 1000);
  function hideBoot() {
    boot.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    showCursor();
  }
  boot.addEventListener('click', hideBoot);
  document.addEventListener('keydown', e => e.key === 'Escape' && hideBoot());
  function showCursor() {
    const cur = document.createElement('div');
    cur.className = 'post-boot-cursor';
    cur.textContent = '~$';
    document.body.appendChild(cur);
  }
}

// 8. Breach Glitch Alert
function initBreachAlert(audio) {
  const breachEl = document.getElementById('ghostBreachWarning');
  const footer   = document.getElementById('footer');
  if (!breachEl || !footer) return;
  const stab = parseInt(footer.dataset.vaultStability || '100', 10);
  const ghost= document.body.dataset.ghostMode === 'true';
  if (ghost && stab < 50) {
    breachEl.style.display = 'block';
    audio.breach.play().catch(() => {});
    document.body.classList.add('glitch');
    setTimeout(() => document.body.classList.remove('glitch'), 2000);
  }
}

// 9. Starfield initializer (returns cleanup)
function initStarfield(canvasId) {
  console.log('[🌠 initStarfield] Running on:', canvasId);
  const canvas = document.getElementById(canvasId);
  console.log('[🌌 canvas]', canvas);
  if (!canvas || !canvas.getContext) return null;

  const ctx = canvas.getContext('2d');
  let stars = [], af;

  function resize() {
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
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.alpha += s.delta;
      if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
      ctx.globalAlpha = s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff'; // 💫 Bright white glow
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    af = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);

  return () => {
    cancelAnimationFrame(af);
    window.removeEventListener('resize', resize);
  };
}

// 10. Filters + Sort + Persistence + AI Hook
function initFilters() {
  const tags = ["XSS", "Injection", "Misconfig", "Race Condition", "Other"];
  const tagFilters = document.getElementById("tagFilters");
  const sortSelect = document.getElementById("sortSelect");

  // Restore state
  const savedTag = localStorage.getItem("activeTag");
  const savedSort = localStorage.getItem("sortOrder");

  // Tag Buttons
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = `#${tag}`;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");
    btn.className = "px-3 py-1 rounded-md border border-orangeLuxe text-orangeLuxe hover:bg-orangeLuxe hover:text-black text-xs transition";
    if (savedTag === tag) btn.classList.add("bg-orangeLuxe", "text-black");

    btn.addEventListener("click", () => {
      tagFilters.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", "false"));
      btn.setAttribute("aria-checked", "true");

      localStorage.setItem("activeTag", tag);
      document.querySelectorAll(".report-card").forEach(card => {
        const match = card.dataset.tags?.toLowerCase().includes(tag.toLowerCase());
        card.style.display = match ? "" : "none";
      });

      window.forgeToast(`🔍 Filtered by #${tag}`, "info");
      // Hook: AI Summarizer Ready
      console.log(`[🧠 GPT] Filtered by tag: ${tag}`);
    });

    tagFilters.appendChild(btn);
  });

  // Sort Select
  if (sortSelect && savedSort) sortSelect.value = savedSort;
  sortSelect?.addEventListener("change", () => {
    const val = sortSelect.value;
    localStorage.setItem("sortOrder", val);
    // TODO: Custom sort logic can be plugged here
    window.forgeToast(`🧮 Sorted: ${val}`, "info");
    console.log(`[📊 SORT] Active sort: ${val}`);
  });
}
// Hook this inside tag click logic
const summaryBox = document.getElementById("aiSummaryBox");
if (summaryBox) {
  summaryBox.textContent = `🧠 GPT summary: Here’s what we know about #${tag}…`; // Replace with actual AI call
}
initFilters();
// 🧠 Starfield Boot (on page load)
document.addEventListener('DOMContentLoaded', () => {
  initStarfield('heroStarfield');
});



// ── Confetti Burst Helper ──
window.confettiBurst=function(target,n=18){const b=document.createElement("div");b.className="confetti-burst";for(let i=0;i<n;i++){const d=document.createElement("span");d.style.left=50+30*Math.cos(2*Math.PI*i/n)+"%";d.style.top=50+30*Math.sin(2*Math.PI*i/n)+"%";b.appendChild(d)}(target||document.body).appendChild(b),setTimeout(()=>b.remove(),1200)};

// ── Toast Notification Helper ──
window.forgeToast=function(msg,type="info",timeout=2800){const t=document.createElement("div");t.className=`toast toast--${type}`;t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.classList.add("hide"),timeout-400);setTimeout(()=>t.remove(),timeout)};


// ── Command Palette Helper (Forge) ──
window.forgePalette=(opts={})=>{let e=document.getElementById("forge-command-palette");if(!e){e=document.createElement("div"),e.id="forge-command-palette",e.innerHTML=`<div class="fixed inset-0 z-[9999] bg-black/70 backdrop-blur flex items-start justify-center pt-32 transition-all"><div class="bg-zinc-900 border border-orangeLuxe/40 rounded-2xl shadow-xl w-full max-w-md mx-auto"><input autofocus id="forge-cmd-in" type="text" autocomplete="off" placeholder="Type a command…" class="w-full px-5 py-4 bg-zinc-900/80 text-lg text-orange-200 outline-none rounded-t-2xl font-mono tracking-wide"/><ul id="forge-cmd-list" class="divide-y divide-zinc-800"></ul><div class="text-xs p-3 text-zinc-400 font-mono text-center border-t border-orangeLuxe/10">ESC to close • ↑↓ to move • Enter to run</div></div></div>`,document.body.appendChild(e)}const t=e.querySelector("#forge-cmd-in"),n=e.querySelector("#forge-cmd-list"),o=opts.items||[{label:"Home",action:()=>window.location.href="/"},{label:"Search",action:()=>document.getElementById("searchBtn")?.click()},{label:"Toggle Theme",action:()=>document.getElementById("themeToggle")?.click()},{label:"Ghost Mode",action:()=>window.dispatchEvent(new KeyboardEvent("keydown",{ctrlKey:!0,key:"m"}))},{label:"Dashboard",action:()=>window.location.href="/dashboard"},{label:"Playground",action:()=>window.location.href="/playground"}];let l=o,s=0;function d(){n.innerHTML="",l.forEach((e,t)=>{const o=document.createElement("li");o.textContent=e.label,o.className="px-5 py-3 cursor-pointer "+(t===s?"bg-orangeLuxe/20 text-orange-300":"hover:bg-zinc-800"),o.onclick=()=>{e.action(),c()},n.appendChild(o)})}function c(){e.remove()}function a(e){l=o.filter(t=>t.label.toLowerCase().includes(e.toLowerCase())),s=0,d()}t.oninput=e=>a(e.target.value),t.onkeydown=e=>{"ArrowDown"===e.key?(s=(s+1)%l.length,d()):"ArrowUp"===e.key?(s=(s-1+l.length)%l.length,d()):"Enter"===e.key?(l[s]?.action(),c()):"Escape"===e.key&&c()},d(),t.focus()};window.addEventListener("keydown",e=>{(e.ctrlKey||e.metaKey)&&"k"===e.key.toLowerCase()&&(e.preventDefault(),window.forgePalette())});

