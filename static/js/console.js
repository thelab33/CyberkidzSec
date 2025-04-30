// static/js/console.js

window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('vault-loader');
  const btn = document.getElementById('loaderClose');

  if (loader) {
    // Auto-hide after 2 seconds
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2000);

    // Manual ✖️ close support
    if (btn) {
      btn.addEventListener('click', () => {
        loader.classList.add('hidden');
      });
    }
  }
});

