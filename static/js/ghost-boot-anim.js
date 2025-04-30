// static/js/ghost-boot-anim.js
(() => {
  const lines = [
    "Bootloader initializing...",
    "Establishing encrypted connection to Vault...",
    "🛰️ Live Vault Feed secured.",
    "Decrypting Ghost Mode payload...",
    "🧪 Injecting Neon Hacker DNA...",
    "🌌 CyberForge system calibration complete.",
    "🚀 Launching Vault Ghost Mode Sequence...",
    "👻 Ghost Mode Activated: Terminal Override Engaged.",
  ];

  function typeLine(line, container, delay = 50) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < line.length) {
        container.textContent += line[i];
        i++;
      } else {
        clearInterval(interval);
        container.insertAdjacentHTML('beforeend', '<br/>');
      }
    }, delay);
  }

  function startBootAnimation() {
    const bootScreen = document.createElement('div');
    bootScreen.id = 'bootScreen';
    bootScreen.className = 'fixed inset-0 z-[99999] flex flex-col justify-center items-center bg-black text-neonGreen text-mono text-sm p-6';
    bootScreen.innerHTML = `<pre id="bootLog" class="w-full max-w-2xl"></pre>`;
    document.body.appendChild(bootScreen);

    const bootLog = document.getElementById('bootLog');
    let idx = 0;

    function nextLine() {
      if (idx >= lines.length) {
        setTimeout(() => {
          bootScreen.remove();
        }, 1200);
        return;
      }
      typeLine(lines[idx], bootLog);
      idx++;
      setTimeout(nextLine, 1200);
    }

    nextLine();
  }

  // Only run if ghost mode activates
  if (localStorage.getItem('ghostMode') === '1') {
    document.addEventListener('DOMContentLoaded', startBootAnimation);
  }
})();
