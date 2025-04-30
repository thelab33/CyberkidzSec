// 🌟 Starforge Main Script for CyberKidzSec Vault

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAutoHideHeader();
  initScrollProgress();
  initHUDToolbarDrag();
  initThemeToggle();
  initGhostEasterEgg();
  initHeroTyper();
  initConfetti();
  initVaultBreachCheck(); // ← 🆕 This line added
});

// 1. Mobile Menu
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  let isOpen = false;
  menuToggle?.addEventListener('click', () => {
    isOpen = !isOpen;
    mobileNav?.classList.toggle('-translate-y-full', !isOpen);
    mobileNav?.classList.toggle('translate-y-0', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
  });
}

// 2. Auto-Hide Header on Scroll
function initAutoHideHeader() {
  const header = document.getElementById('siteHeader');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > lastScroll && currentScroll > 100) {
      header?.classList.add('-translate-y-full');
    } else {
      header?.classList.remove('-translate-y-full');
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
  });
}

// 3. Scroll Progress
function initScrollProgress() {
  const progress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const percent = (scrollTop / docHeight) * 100;
    progress.style.transform = `scaleX(${percent / 100})`;
  });
}

// 4. HUD Toolbar Drag
function initHUDToolbarDrag() {
  const hud = document.getElementById('hudToolbar');
  if (!hud) return;
  let isDragging = false, startX, startY, offsetX = 0, offsetY = 0;
  
  hud.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    hud.style.cursor = 'grabbing';
  });
  
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    hud.style.transform = `translate(${offsetX + (e.clientX - startX)}px, ${offsetY + (e.clientY - startY)}px)`;
  });
  
  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    offsetX += e.clientX - startX;
    offsetY += e.clientY - startY;
    hud.style.cursor = 'grab';
    isDragging = false;
  });
}

// 5. Theme Toggle (Dark/Light Mode Persistence)
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (!themeToggle) return;
  
  const current = localStorage.getItem('theme') || 'dark';
  if (current === 'light') html.classList.remove('dark');
  else html.classList.add('dark');
  
  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });
}

// 6. Ghost Mode Easter Egg
function initGhostEasterEgg() {
  const ghostMsg = document.getElementById('ghostMsg');
  let buffer = [];
  window.addEventListener('keydown', e => {
    buffer.push(e.key.toLowerCase());
    buffer = buffer.slice(-2);
    if (buffer.join('') === 'gh') {
      ghostMsg?.classList.remove('hidden');
    }
  });
}

// 7. Hero Typing Animation
function initHeroTyper() {
  const typer = document.getElementById('heroTyper');
  if (!typer) return;
  
  const lines = [
    "🔐 Zero-Day Archive Updating…",
    "💀 Ghosted but not gone.",
    "🛰️ Live Vault Feed: Stable.",
    "⚡ Stay Dangerous, Operative."
  ];
  let idx = 0;
  
  function typeNext() {
    typer.textContent = lines[idx];
    typer.classList.remove('animate-typewriter');
    void typer.offsetWidth;
    typer.classList.add('animate-typewriter');
    idx = (idx + 1) % lines.length;
  }
  
  typeNext();
  setInterval(typeNext, 3000);
}

// 8. Confetti After Hacking Vault (Bonus)
function initConfetti() {
  const hackButton = document.querySelector('#playground .btn--primary');
  if (!hackButton) return;

  hackButton.addEventListener('click', () => {
    import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js').then(({ default: confetti }) => {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    });
  });
}

// 9. Vault Breach Auto-Alert (Ghost Mode only)
function initVaultBreachCheck() {
  const breachEl = document.getElementById('ghostBreachWarning');
  const footer = document.getElementById('footer');

  if (!footer || !breachEl) return;

  const stability = parseInt(footer.dataset.vaultStability || '100', 10);
  const isGhostMode = document.body.dataset.ghostMode === 'true';

  if (isGhostMode && stability < 50) {
    breachEl.style.display = 'block';
  }
}


