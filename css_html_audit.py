import re
import os

HTML_DIRS = ["templates", "static", "src", "app"]  # Adjust if needed
CSS_DIR = "static/css"

def find_files(dirs, exts):
    files = []
    for d in dirs:
        for root, _, filenames in os.walk(d):
            for f in filenames:
                if f.endswith(exts):
                    files.append(os.path.join(root, f))
    return files

def extract_html_selectors(html_files):
    id_re = re.compile(r'id="([^"]+)"')
    class_re = re.compile(r'class="([^"]+)"')
    ids, classes = set(), set()
    for file in html_files:
        try:
            with open(file, encoding='utf-8') as f:
                content = f.read()
            ids.update(id_re.findall(content))
            for cls in class_re.findall(content):
                classes.update(cls.replace('\n', ' ').split())
        except Exception as e:
            print(f"Error reading {file}: {e}")
    return ids, classes

def extract_css_selectors(css_files):
    id_re = re.compile(r'#([\w\-]+)')
    class_re = re.compile(r'\.([\w\-]+)')
    ids, classes = set(), set()
    for file in css_files:
        try:
            with open(file, encoding='utf-8') as f:
                content = f.read()
            ids.update(id_re.findall(content))
            classes.update(class_re.findall(content))
        except Exception as e:
            print(f"Error reading {file}: {e}")
    return ids, classes

def main():
    print("🔍 Scanning HTML and CSS…")
    html_files = find_files(HTML_DIRS, (".html", ".jinja", ".htm"))
    css_files = find_files([CSS_DIR], (".css",))
    html_ids, html_classes = extract_html_selectors(html_files)
    css_ids, css_classes = extract_css_selectors(css_files)

    print(f"\nFound {len(html_ids)} unique HTML IDs, {len(html_classes)} unique HTML classes")
    print(f"Found {len(css_ids)} unique CSS IDs, {len(css_classes)} unique CSS classes\n")

    orphan_css_ids = css_ids - html_ids
    orphan_css_classes = css_classes - html_classes
    unstyled_html_ids = html_ids - css_ids
    unstyled_html_classes = html_classes - css_classes

    print("🟡 IDs/classes in CSS but not in HTML (Orphaned selectors):")
    print("IDs:", sorted(orphan_css_ids))
    print("Classes:", sorted(orphan_css_classes))

    print("\n🔴 IDs/classes used in HTML but missing in CSS (Unstyled):")
    print("IDs:", sorted(unstyled_html_ids))
    print("Classes:", sorted(unstyled_html_classes))

    print("\n✅ Overlapping (both defined and used):")
    print("IDs:", sorted(css_ids & html_ids))
    print("Classes:", sorted(css_classes & html_classes))

if __name__ == "__main__":
    main()

