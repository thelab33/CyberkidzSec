#!/bin/bash
# forgemaster-fix.sh — Auto-fix common template issues

echo "🧼 Fixing JS string interpolation bugs..."
find templates -name "*.html" -exec sed -i 's/\${r.slug}/{{ r.slug }}/g' {} +

echo "🧹 Removing nested {% extends 'base.html' %} from partials..."
grep -rl '{% extends "base.html" %}' templates/components | while read f; do
  sed -i '/{% extends "base.html" %}/d' "$f"
  echo "Cleaned extends from $f"
done

echo "🧯 Removing duplicate or empty href values like {{ href }}..."
grep -rl '{{ href }}' templates/ | while read f; do
  sed -i 's|{{ href }}|#|g' "$f"
  echo "Fixed unresolved href in $f"
done

echo "🧪 Fixing CTA unresolved {{ cta.href }} links..."
grep -rl '{{ cta.href }}' templates/ | while read f; do
  sed -i 's|{{ cta.href }}|#|g' "$f"
  echo "Fixed CTA href in $f"
done

echo "🧼 Removing redundant data-aos attributes..."
grep -rl 'data-aos="fade-up" data-aos="fade-up"' templates | while read f; do
  sed -i 's/data-aos="fade-up" data-aos="fade-up"/data-aos="fade-up"/g' "$f"
  echo "Cleaned duplicate data-aos in $f"
done

echo "✅ All fixes applied."

