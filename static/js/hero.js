document.addEventListener('DOMContentLoaded', () => {
  const heroEl      = document.getElementById('hero');
  const canvas      = document.getElementById('heroStarfield');
  const typerEl     = document.getElementById('heroTyper');
  const haloEl      = document.getElementById('heroHalo');
  const sparksEl    = document.getElementById('ghostSparks');
  const ghostMsgEl  = document.getElementById('ghostMsg');
  const searchBtn   = document.getElementById('searchBtn');
  const searchInput = document.getElementById('globalSearch');

  if (!heroEl) return;

  // ──────────────────────────────────────────────────────────────────────
  // 1️⃣ Inject Orbiting Particle Rings + Lens Flare + Glitch Text
  // ──────────────────────────────────────────────────────────────────────

  // A) Orbit Rings
  const orbitContainer = document.createElement('div');
  orbitContainer.className = 'orbit-container';
  ['small','med','large'].forEach(size => {
    const ring = document.createElement('div');
    ring.classList.add('orbit', `orbit--${size}`);
    orbitContainer.appendChild(ring);
  });
  heroEl.appendChild(orbitContainer);

  // B) Lens Flare
  const lensFlare = document.createElement('div');
  lensFlare.id = 'lensFlare';
  heroEl.appendChild(lensFlare);

  // C) Glitch-ify the hero title
  const heading = document.getElementById('hero-heading');
  if (heading) {
    const text = heading.textContent.trim();
    heading.textContent = '';
    const glitchSpan = document.createElement('span');
    glitchSpan.className = 'glitch';
    glitchSpan.dataset.text = text;
    glitchSpan.textContent = text;
    heading.appendChild(glitchSpan);
  }

  // ─── 2️⃣ Warp-in Entrance ─────────────────────────────────────────────
  heroEl.classList.add('opacity-0');
  requestAnimationFrame(() => {
    heroEl.classList.remove('opacity-0');
    heroEl.classList.add('animate-warpStabilize');
  });

  // ─── 3️⃣ Starfield FX ─────────────────────────────────────────────────
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let stars = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      stars = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        delta: Math.random() * 0.02 + 0.01,
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
        ctx.fillStyle = '#fff';
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  // ─── 4️⃣ Typewriter Effect ───────────────────────────────────────────
  if (typerEl) {
    const phrases = [
      '🔐 Zero-Day Archive Updating…',
      '💀 Ghosted but not gone.',
      '🛰️ Live Vault Feed: Stable.',
      '⚡ Stay Dangerous, Operative.',
    ];
    let idx = 0;
    const showNext = () => {
      typerEl.textContent = phrases[idx];
      typerEl.classList.remove('animate-typewriter');
      void typerEl.offsetWidth; // reflow
      typerEl.classList.add('animate-typewriter');
      idx = (idx + 1) % phrases.length;
    };
    showNext();
    setInterval(showNext, 4000);
  }

  // ─── 5️⃣ Ghost Mode FX ───────────────────────────────────────────────
  const ghostMode = document.body.dataset.ghostMode === 'true';
  if (ghostMode) {
    haloEl?.classList.add('opacity-100', 'animate-pulse');
    if (sparksEl) {
      sparksEl.classList.remove('hidden');
      setInterval(() => {
        const s = document.createElement('div');
        s.className = 'spark';
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 100}%`;
        s.style.animationDuration = `${2 + Math.random() * 2}s`;
        sparksEl.appendChild(s);
        setTimeout(() => s.remove(), 4000);
      }, 300);
    }
    ghostMsgEl?.classList.remove('hidden');
  }

  // ─── 6️⃣ CMD+K Global Search ─────────────────────────────────────────
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => searchInput.focus());
    document.addEventListener('keydown', e => {
      if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }
});

