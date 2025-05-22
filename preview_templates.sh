#!/bin/bash

# Array of template files to find and preview
templates=("base.html" "index.html" "home.html")

for tpl in "${templates[@]}"; do
  echo "=============================================="
  echo "Searching for: $tpl"
  files_found=$(find templates -type f -name "$tpl")
  
  if [[ -z "$files_found" ]]; then
    echo "❌ No files named '$tpl' found."
    continue
  fi

  while IFS= read -r file; do
    echo "Found: $file"
    echo "------ Preview first 40 lines of $file ------"
    head -n 40 "$file"
    echo
  done <<< "$files_found"
done

