#!/bin/bash
mkdir -p static/audio static/sfx static/images/avatars
touch static/audio/keyboard-clack.mp3
touch static/sfx/vhs-{open,glitch,close}.mp3
cp static/images/og/main_vault_banner.png static/images/avatars/operative.jpg
echo 'self.addEventListener("install",e=>console.log("SW installed"))' > static/sw.js
git add static/
git commit -m "🛡️ Fix 404 assets: SFX, avatars, and service worker placeholder"
