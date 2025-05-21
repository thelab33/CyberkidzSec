#!/bin/bash

set -euo pipefail

INDEX_FILE="index.html"
COMPONENTS_DIR="templates/components"
NEW_INDEX="index.sectionified.html"

# 1. Section map: key = new partial filename, value = section label comment as appears in index.html
declare -A SECTION_LABELS=(
  ["intro_layer"]="🌌 HERO + CONSOLE + INTRO"
  ["status_strip"]="🚨 STATUS STRIP"
  ["vault_overview_section"]="🔐 OVERVIEW, XP, BLOG, ABOUT, BANNERS"
  ["vault_feed"]="📂 REPORTS, FILTERS, SIDEBARS, CHARTS, TAGS"
  ["hacker_playground_section"]="🎮 HACKER PLAYGROUND & HUD"
  ["utility_modals"]="🧩 UTILITIES & POPUPS"
  ["hidden_extras"]="🏷️ DEBUG / ADDITIONAL PARTIALS (HIDDEN)"
)

echo "🌟 [Starforge Sectionify] Starting..."

mkdir -p "$COMPONENTS_DIR"

# 2. Extract content for each section
SECTION_KEYS=(${!SECTION_LABELS[@]})
NUM_SECTIONS=${#SECTION_KEYS[@]}

for ((i=0; i<$NUM_SECTIONS; i++)); do
  PARTIAL="${SECTION_KEYS[$i]}"
  LABEL="${SECTION_LABELS[$PARTIAL]}"
  LABEL_COMMENT="<!-- $LABEL -->"

  # Determine the next section's comment
  if [[ $i -lt $((NUM_SECTIONS-1)) ]]; then
    NEXT_LABEL="${SECTION_LABELS[${SECTION_KEYS[$((i+1))]}]}"
    NEXT_COMMENT="<!-- $NEXT_LABEL -->"
  else
    NEXT_COMMENT="EOF-STARFORGE"
  fi

  # Use awk to extract the section (non-greedy, exclusive of next section marker)
  awk -v start="$LABEL_COMMENT" -v end="$NEXT_COMMENT" '
    $0 ~ start {flag=1; next}
    $0 ~ end {flag=0}
    flag' "$INDEX_FILE" > "$COMPONENTS_DIR/$PARTIAL.html"

  echo "  [+] Created: $COMPONENTS_DIR/$PARTIAL.html"
done

# 3. Create new modular index.html
cat > "$NEW_INDEX" <<'EOF'
{% extends "base.html" %}
{% block title %}Home · CYBERKIDZSEC Vault{% endblock %}

{% block head_extra %}
  {{ super() }}
  {# ... keep your existing style includes here ... #}
{% endblock %}

{% block content %}
  {% include "components/intro_layer.html" %}
  {% include "components/status_strip.html" %}
  {% include "components/vault_overview_section.html" %}
  {% include "components/vault_feed.html" %}
  {% include "components/hacker_playground_section.html" %}
  {% include "components/utility_modals.html" %}
  {% include "components/hidden_extras.html" %}
{% endblock %}

{% block scripts %}
  {{ super() }}
  <script type="module">
    document.getElementById('featuredSkeleton')?.addEventListener('skeleton-visible', async () => {
      const start = performance.now();
      const html = await fetch('/fragment/featured').then(r => r.text());
      document.getElementById('reportsHolder').innerHTML = html.trim();
      document.getElementById('featuredSkeleton').done();
      navigator.sendBeacon('/api/analytics/skeleton', `section=featured&ms=${Math.round(performance.now() - start)}`);
    });
  </script>
{% endblock %}
EOF

echo "✨ Sectionify complete!"
echo "  ➤ All sections extracted to $COMPONENTS_DIR/"
echo "  ➤ New modular index at $NEW_INDEX"
echo ""
echo "Review $NEW_INDEX, then replace your original index.html when ready!"

