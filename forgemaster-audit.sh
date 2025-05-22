#!/bin/bash
# forgemaster-audit.sh — Elite full-project audit
echo "🛠️ Running Forgemaster Audit..."

echo "🔁 Checking duplicate {% include %} usage..."
grep -rHo '{% include' templates/ | cut -d: -f2 | sort | uniq -d

echo -e "\n🧱 Templates missing {% block content %}..."
grep -L '{% block content %}' templates/**/*.html

echo -e "\n🎨 Unused CSS on disk (not referenced in templates)..."
comm -23 \
  <(find static/css -type f -printf "%f\n" | sort) \
  <(grep -rhoP 'css/\K[^"\']+' templates/ | sort | uniq)

echo -e "\n🔗 Broken internal links (href)..."
grep -rEo 'href="[^"]+"' templates/ | grep -vE 'https?://|mailto:' | cut -d'"' -f2 |
while read -r path; do
  [[ "$path" =~ ^({{|#|/|$) ]] && continue
  [ ! -e "static/$path" ] && echo "Broken: $path"
done

echo -e "\n📦 Empty or <20B files (html/js/css)..."
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" \) -size -20c

echo -e "\n🚧 TODO / FIXME / PLACEHOLDER markers..."
grep -rni 'TODO\|FIXME\|PLACEHOLDER' templates static src || echo "✅ None found!"

echo -e "\n📜 Duplicate <script> tags..."
grep -rh '<script ' templates/ | sort | uniq -d

echo -e "\n🧪 Audit complete. Review issues above."

