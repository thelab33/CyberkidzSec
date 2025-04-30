#!/usr/bin/env bash

# ─── 🧠 New Report Creator ───────────────────────────────
# Usage:
# ./bin/new-report.sh "Title Here" --tags xss,rce --cvss 9.8 --date 2025-04-30

title="$1"
shift

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tags) tags="$2"; shift 2 ;;
    --cvss) cvss="$2"; shift 2 ;;
    --date) date="$2"; shift 2 ;;
    *) shift ;;
  esac
done

slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g')"
filename="static/data/reports/${slug}.mdx"

mkdir -p static/data/reports

cat <<EOF > "$filename"
---
title: "$title"
type: "Injection"
cvss: ${cvss:-0.0}
severity: High
status: Published
date: "${date:-$(date +%F)}"
tags: [${tags:-"xss"}]
---

## 🔍 Summary

Describe the bug here.

---

## 🧪 Proof of Concept

\`\`\`js
// example payload
\`\`\`

---

## ✅ Recommendation

Sanitize input and encode output.
EOF

echo "✅ Created $filename"

# ─── Rebuild reports.json ───────────────────────────────
echo "🧠 Rebuilding reports.json..."
python3 <<EOF
import os, frontmatter, json
reports = []
folder = 'static/data/reports'
for f in os.listdir(folder):
    if f.endswith('.mdx'):
        post = frontmatter.load(os.path.join(folder, f))
        post['slug'] = f.replace('.mdx', '')
        reports.append(post.metadata)
with open('static/data/reports.json', 'w') as out:
    json.dump(reports, out, indent=2)
EOF

echo "✅ Updated static/data/reports.json"

# ─── Git Add (Optional) ───────────────────────────────
git add "$filename" static/data/reports.json
git commit -m "➕ New report: $title" && echo "✅ Git commit created"
