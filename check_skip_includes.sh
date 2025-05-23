#!/bin/bash
# file: scripts/check_skip_includes.sh
set -e

# Should only be in base.html:
if grep -r 'skip-link' templates/ | grep -v 'base.html'; then
  echo "❌ Extra skip-link found!"
  exit 1
fi

if grep -r 'skip_nav.html' templates/ | grep -v 'base.html'; then
  echo "❌ Extra skip_nav.html include found!"
  exit 1
fi

echo "✅ Skip nav includes are clean!"

