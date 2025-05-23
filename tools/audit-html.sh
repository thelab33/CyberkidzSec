#!/bin/bash

echo "🔍 Running HTML Audit on base.html and index.html..."

echo -e "\n🧩 Checking {% include ... %} files:"
grep -rhoP '{%\s*include\s+"components/[^"]+' templates/base.html templates/index.html \
  | sort | uniq | while read inc; do
  f="templates/${inc##*\"}"
  [ -f "$f" ] && echo "✅ $f" || echo "❌ $f missing!"
done

echo -e "\n🎨 Checking static CSS file references:"
grep -oP "url_for\('static', filename='[^']+'" templates/*.html \
  | cut -d"'" -f4 | grep -E '\.css$' | sort | uniq | while read path; do
  [ -f "static/$path" ] && echo "✅ static/$path" || echo "❌ static/$path missing!"
done

echo -e "\n📜 Checking static JS file references:"
grep -oP "url_for\('static', filename='[^']+'" templates/*.html \
  | cut -d"'" -f4 | grep -E '\.js$' | sort | uniq | while read path; do
  [ -f "static/$path" ] && echo "✅ static/$path" || echo "❌ static/$path missing!"
done

echo -e "\n🧱 Checking block structure:"
grep -r '{% *block' templates/base.html templates/index.html
grep -r '{% *endblock' templates/base.html templates/index.html

echo -e "\n✅ Audit Complete!"
