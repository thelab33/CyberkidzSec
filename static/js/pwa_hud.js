if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(reg => {
    setInterval(() => {
      if (reg.active) reg.active.postMessage({ type: 'PING_HUD' });
    }, 8000);
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data && e.data.type === 'HUD_STATUS') {
        document.getElementById('pwa-hud').style.display = 'block';
        document.getElementById('hud-online').textContent =
          `🛰️ Vault: ${e.data.vault} · ${e.data.online ? "Online" : "Offline"} · 👻 Ghost: ${e.data.ghost ? "ON" : "OFF"}`;
      }
    });
  });
}
