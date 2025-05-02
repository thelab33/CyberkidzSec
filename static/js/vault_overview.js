// static/js/vault_overview.js

document.addEventListener('DOMContentLoaded', () => {
  const target = Number('{{ vault_xp_percentage }}');
  const numEl = document.getElementById('vaultXpNum');
  const fillEl = document.getElementById('vaultXpFill');

  let current = 0;
  // Spread across ~60 frames
  const step = Math.max(1, Math.ceil(target / 60));

  function animate() {
    if (current < target) {
      current = Math.min(current + step, target);
      numEl.textContent = current;
      fillEl.style.width = `${current}%`;
      requestAnimationFrame(animate);
    }
  }

  animate();
});

