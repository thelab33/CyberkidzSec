#!/usr/bin/env python3

"""
combine-js.py
────────────────────────────────────────────────────
Combines + minifies your JS files into static/js/app.min.js
for blazing-fast frontend performance (CyberKidzSec Vault 🚀)
────────────────────────────────────────────────────
"""

import os
from pathlib import Path

# 📁 Where your raw JS lives
STATIC_JS_DIR = Path(__file__).resolve().parent / "static" / "js"
OUTPUT_FILE = STATIC_JS_DIR / "app.min.js"

# ✏️ Files to combine (order matters if dependent)
FILES_TO_COMBINE = [
    "back_to_top.js",
    "header.js",
    "hero.js",
    "search.js",
    "search.worker.js",
    "vault-utils.js",
]

def combine_and_minify():
    combined_code = ""
    for filename in FILES_TO_COMBINE:
        filepath = STATIC_JS_DIR / filename
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                code = f.read()
                # Quick minification: remove comments and extra whitespace
                code = "\n".join(line for line in code.splitlines() if not line.strip().startswith("//"))
                combined_code += code + "\n"
        else:
            print(f"⚠️  Warning: {filename} not found, skipping.")
    
    OUTPUT_FILE.write_text(combined_code.strip(), encoding="utf-8")
    print(f"✅ Minified JS created: {OUTPUT_FILE.relative_to(Path.cwd())}")

if __name__ == "__main__":
    combine_and_minify()

