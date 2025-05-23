#!/bin/bash
# ──── Forgemaster UI/UX Doctor for CYBERKIDZSEC Vault ────
# Cleans skip nav includes, removes old skip-links, kills rogue <br> tags, trims accidental spacing,
# and checks for key accessibility/pro polishes in your Flask Jinja template set.

set -e
ROOT="templates"
COMPONENTS="$ROOT/components"
BASE="$ROOT/base.html"
SKIP_NAV="$COMPONENTS/skip_nav.html"
LOG="forgemaster_uiux_$(date +%Y%m%d%H%M%S).log"

echo "[FORGEMASTER] UI/UX Repair started at $(date)" | tee "$LOG"

# 1. Remove legacy skip-link anchors (should only be in base.html, if anywhere)
echo "→ Removing legacy <a href=\"#main\" class=\"skip-link ...\"> from base.html"
sed -i '/<a href="#main" class="skip-link/d' "$BASE"

# 2. Remove skip_nav.html includes from all templates except base.html
echo "→ Removing rogue skip_nav.html includes outside base.html"
find "$ROOT" -type f -name '*.html' ! -name 'base.html' \
  -exec sed -i '/skip_nav.html/d' {} +

# 3. Remove ALL <br> and dummy spacers (let your CSS/Tailwind handle spacing!)
echo "→ Removing all <br> tags in templates..."
find "$ROOT" -type f -name '*.html' -exec sed -i '/<br[ ]*\/?>/Id' {} +

# 4. Audit for accidental top/bottom margin/padding on header, main, hero, or skip nav
echo "→ Checking for excessive margin/padding on header, main, hero, skip nav..."
grep -E --color=always 'mt-[0-9]+|pt-[0-9]+|mb-[0-9]+|pb-[0-9]+' $ROOT/*/*.html $BASE \
  | tee -a "$LOG"

# 5. Enforce only 1 skip nav at top of body in base.html
echo "→ Ensuring skip_nav.html is included at top of <body> in base.html"
awk '/<body/ { print; print "  {% include \"components/skip_nav.html\" %}"; next } 1' "$BASE" > "$BASE.tmp" && mv "$BASE.tmp" "$BASE"

# 6. Quick Accessibility Boost: add lang, ARIA, role, and color-scheme to <html> and <main>
echo "→ Ensuring <html> and <main> tags have ARIA and color-scheme attributes"
sed -i 's/<html /<html lang="en" data-theme="dark" /' "$BASE"
sed -i 's/<main /<main role="main" tabindex="-1" /' "$BASE"

# 7. [Optional] Rebuild CSS if using Tailwind (uncomment if needed)
# echo "→ Rebuilding Tailwind CSS"
# npm run build:css

echo -e "\n[FORGEMASTER] UI/UX repair complete! Review $LOG for margin/padding audits and visually verify in browser."
echo "[FORGEMASTER] 🚀 Stay ghosted. Your UI/UX is now clean and elite."

