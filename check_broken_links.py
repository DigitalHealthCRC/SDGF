#!/usr/bin/env python3
"""
Script to check all HTML files for broken internal links
"""
import os
import re
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from collections import defaultdict

class LinkExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'a' and 'href' in attrs_dict:
            self.links.append(('href', attrs_dict['href']))
        elif tag == 'link' and 'href' in attrs_dict:
            self.links.append(('link-href', attrs_dict['href']))
        elif tag in ['img', 'script'] and 'src' in attrs_dict:
            self.links.append((f'{tag}-src', attrs_dict['src']))

def get_all_html_files(root_dir):
    """Get all HTML files in the directory"""
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        # Skip hidden directories and _next directory
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != '_next']
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def extract_links(html_file):
    """Extract all links from an HTML file"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        parser = LinkExtractor()
        parser.feed(content)
        return parser.links
    except Exception as e:
        print(f"Error reading {html_file}: {e}")
        return []

def normalize_path(base_file, link):
    """Normalize a link path relative to the base file"""
    # Skip external URLs, anchors, mailto, tel, etc.
    if link.startswith(('http://', 'https://', 'mailto:', 'tel:', '//', '#')):
        return None

    # Remove anchor fragments
    link = link.split('#')[0]
    if not link:
        return None

    base_dir = os.path.dirname(base_file)

    # Handle absolute paths (starting with /)
    if link.startswith('/'):
        normalized = os.path.normpath(os.path.join('/home/user/SDGF', link.lstrip('/')))
    else:
        # Handle relative paths
        normalized = os.path.normpath(os.path.join(base_dir, link))

    return normalized

def check_link_exists(file_path):
    """Check if a file exists, trying both exact path and with .html extension"""
    if os.path.exists(file_path):
        return True

    # Try adding .html if it's a directory-like path
    if not file_path.endswith('.html'):
        html_path = file_path + '.html'
        if os.path.exists(html_path):
            return True

        # Try index.html in directory
        index_path = os.path.join(file_path, 'index.html')
        if os.path.exists(index_path):
            return True

    return False

def main():
    root_dir = '/home/user/SDGF'
    html_files = get_all_html_files(root_dir)

    print(f"Found {len(html_files)} HTML files to check\n")

    broken_links = defaultdict(list)  # {target_file: [(source_file, link_text)]}
    all_internal_links = set()

    for html_file in html_files:
        links = extract_links(html_file)

        for link_type, link in links:
            normalized = normalize_path(html_file, link)

            if normalized:
                all_internal_links.add(normalized)

                if not check_link_exists(normalized):
                    rel_source = os.path.relpath(html_file, root_dir)
                    broken_links[normalized].append((rel_source, link))

    # Print results
    print("=" * 80)
    print("BROKEN LINKS FOUND")
    print("=" * 80)

    if broken_links:
        # Sort by target path for easier reading
        for target in sorted(broken_links.keys()):
            sources = broken_links[target]
            rel_target = os.path.relpath(target, root_dir)
            print(f"\n❌ Missing: {rel_target}")
            print(f"   Referenced from {len(sources)} page(s):")
            for source, original_link in sources:
                print(f"   - {source} → {original_link}")
    else:
        print("\n✅ No broken internal links found!")

    print(f"\n" + "=" * 80)
    print(f"Total broken links: {len(broken_links)}")
    print(f"Total HTML files checked: {len(html_files)}")
    print("=" * 80)

    # Write to file
    output_file = os.path.join(root_dir, 'broken-links-report.txt')
    with open(output_file, 'w') as f:
        f.write("BROKEN LINKS REPORT\n")
        f.write("=" * 80 + "\n\n")

        if broken_links:
            for target in sorted(broken_links.keys()):
                sources = broken_links[target]
                rel_target = os.path.relpath(target, root_dir)
                f.write(f"\nMissing: {rel_target}\n")
                f.write(f"Referenced from {len(sources)} page(s):\n")
                for source, original_link in sources:
                    f.write(f"  - {source} → {original_link}\n")
        else:
            f.write("No broken internal links found!\n")

        f.write(f"\nTotal broken links: {len(broken_links)}\n")
        f.write(f"Total HTML files checked: {len(html_files)}\n")

    print(f"\nReport written to: {output_file}")

if __name__ == '__main__':
    main()
