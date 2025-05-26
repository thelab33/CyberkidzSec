#!/usr/bin/env bash
# forge_upgrade.sh ──────────────────────────────────────────────
# Run from repo root with an *activated* Python venv.
# Re‑applies the “Forgemaster” UI/UX + backend upgrades.
set -euo pipefail

echo "🛠  Forge‑Upgrade — CYBERKIDZSEC Vault"

# ── 0 · Paths ──────────────────────────────────────────────────
JS_DIR="static/js"
CSS_DIR="static/css"
TPL="templates/base.html"
VENV_PY="$(which python)"
[[ -z "$VENV_PY" ]] && { echo "❌  Activate your venv first."; exit 1; }

# ── 1 · Get front‑end libs if missing ─────────────────────────
mkdir -p "$JS_DIR"
download_if_absent () {
  local url="$1" dest="$2"
  [[ -f "$dest" ]] || { echo "⬇️  $dest"; curl -sSL "$url" -o "$dest"; }
}
download_if_absent "https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"            "$JS_DIR/gsap.min.js"
download_if_absent "https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"   "$JS_DIR/ScrollTrigger.min.js"
download_if_absent "https://cdn.jsdelivr.net/npm/@lit-labs/motion@2/dist/index.umd.js" \
                   "$JS_DIR/view-transition-polyfill.js"

# Parallax helper
PARA="$JS_DIR/parallax-banners.js"
if ! grep -q "Parallax banners" "$PARA" 2>/dev/null; then
cat > "$PARA" <<'EOF'
/* Parallax banners powered by GSAP + ScrollTrigger */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".parallax-banner").forEach(el => {
    const img = el.querySelector("img");
    img && gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: .3 }
    });
  });
});
EOF
echo "🖼  Added $PARA"
fi

# ── 2 · Patch base.html (inject scripts, drop AOS) ────────────
if grep -q "aos@2" "$TPL"; then
  sed -i '/aos@2\.3\.4/d;/AOS.init/d;/aos-init/d' "$TPL"
  echo "✂️  Removed AOS includes"
fi

# Inject new scripts once
if ! grep -q "view-transition-polyfill.js" "$TPL"; then
  sed -i "/<\/body>/i \
<script defer src=\"{{ url_for('static', filename='js/view-transition-polyfill.js') }}\"></script>\n\
<script defer src=\"{{ url_for('static', filename='js/gsap.min.js') }}\"></script>\n\
<script defer src=\"{{ url_for('static', filename='js/ScrollTrigger.min.js') }}\"></script>\n\
<script defer src=\"{{ url_for('static', filename='js/parallax-banners.js') }}\"></script>" "$TPL"
  echo "➕  Injected polyfill & GSAP scripts"
fi

# Point core scripts at dist/ once
sed -Ei 's#static/js/(main|ghost-mode|cyber-enhancements|init).js#static/js/dist/\1.js#g' "$TPL"

# Preconnect to fonts.gstatic once
grep -q 'fonts.gstatic.com' "$TPL" || \
  sed -i '/fonts.googleapis.com/i <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' "$TPL"

# ── 3 · Add VT CSS if missing ─────────────────────────────────
VT_CSS="$CSS_DIR/cyber-enhancements.css"
grep -q "view-transition-name" "$VT_CSS" 2>/dev/null || cat >> "$VT_CSS" <<'EOF'

/* View‑transition helpers */
.vt-fade,
.vt-fade-up { view-transition-name: fade; contain: paint; }
::view-transition-old(fade),
::view-transition-new(fade) { animation: fade 400ms ease; }
@keyframes fade { from { opacity:0; transform:translateY(1rem);} }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*), ::view-transition-new(*) { animation:none!important; }
}
EOF

# ── 4 · Backend hardening (Talisman + Compress) ───────────────
APP_PY="src/app.py"
if ! grep -q "from flask_talisman import Talisman" "$APP_PY"; then
  sed -i "/from flask_compress import/a from flask_talisman import Talisman" "$APP_PY"
  sed -i "/Compress(app)/a\    Talisman(app, content_security_policy=None)" "$APP_PY"
  echo "🔒  Added Talisman to app factory"
fi
if ! grep -q "Compress(app)" "$APP_PY"; then
  sed -i "/migrate.init_app/a\    from flask_compress import Compress\n    Compress(app)" "$APP_PY"
fi
# static_url helper (cache‑buster)
grep -q "def static_url" "$APP_PY" || \
  sed -i "/def create_app/a\n# cache‑busting helper\ndef static_url(filename):\n    from flask import url_for\n    from pathlib import Path\n    f = Path(app.static_folder) / filename\n    v = int(f.stat().st_mtime) if f.exists() else 0\n    return url_for('static', filename=filename, v=v)\n" "$APP_PY"

# ── 5 · Node deps & asset build ───────────────────────────────
npm pkg get devDependencies.tailwindcss >/dev/null 2>&1 || npm i -D tailwindcss esbuild

echo "🔧  Rebuilding front‑end assets"
npx esbuild "$JS_DIR"/{main,ghost-mode,cyber-enhancements,init}.js \
  --bundle --target=es2017 --minify --sourcemap --outdir="$JS_DIR/dist"
npx tailwindcss -c tailwind.config.js -i src/app/globals.css -o "$CSS_DIR/app.min.css" --minify

# ── 6 · Service‑worker (Workbox) ──────────────────────────────
[[ -f workbox-config.cjs ]] || cat > workbox-config.cjs <<'CJS'
module.exports = {
  globDirectory: 'static/',
  globPatterns: ['**/*.{css,js,woff2,png,svg,jpg,mp3,json}'],
  swDest: 'sw.js',
  clientsClaim: true,
  skipWaiting: true,
};
CJS
npx workbox-cli generateSW workbox-config.cjs >/dev/null
mv -f sw.js static/

# ── 7 · Final notes ───────────────────────────────────────────
echo "✅  Forge‑Upgrade complete!"
echo "   • Restart gunicorn:  gunicorn 'src.app:create_app()' -k gevent -w 3 -b 0.0.0.0:8000"
echo "   • Commit changes:     git add . && git commit -m 'forge: UI/UX + security upgrades'"

