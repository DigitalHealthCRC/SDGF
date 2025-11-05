#!/usr/bin/env python3
"""
Script to fix broken links by removing /SDGF/ prefix from paths
"""
import os
import re
from pathlib import Path

def fix_sdgf_prefix(html_content):
    """
    Replace /SDGF/ prefix with / in href and src attributes
    """
    # Pattern to match /SDGF/ at the beginning of paths in href and src attributes
    # This handles: href="/SDGF/..." and src="/SDGF/..."

    # Fix href="/SDGF" (without trailing slash - home page link)
    html_content = re.sub(r'href="/SDGF"', r'href="/"', html_content)

    # Fix href="/SDGF/..."
    html_content = re.sub(r'href="/SDGF/', r'href="/', html_content)

    # Fix src="/SDGF/..."
    html_content = re.sub(r'src="/SDGF/', r'src="/', html_content)

    return html_content

def get_all_html_files(root_dir):
    """Get all HTML files in the directory"""
    html_files = []
    for root, dirs, files in os.walk(root_dir):
        # Skip hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    return html_files

def main():
    root_dir = '/home/user/SDGF'
    html_files = get_all_html_files(root_dir)

    print(f"Found {len(html_files)} HTML files to process\n")

    total_changes = 0
    files_modified = 0

    for html_file in html_files:
        try:
            # Read the file
            with open(html_file, 'r', encoding='utf-8') as f:
                original_content = f.read()

            # Fix the content
            fixed_content = fix_sdgf_prefix(original_content)

            # Check if anything changed
            if original_content != fixed_content:
                # Count changes
                href_changes = (original_content.count('href="/SDGF"') +
                               original_content.count('href="/SDGF/') +
                               original_content.count("href='/SDGF/"))
                src_changes = original_content.count('src="/SDGF/') + original_content.count("src='/SDGF/")
                file_changes = href_changes + src_changes

                # Write the fixed content
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)

                rel_path = os.path.relpath(html_file, root_dir)
                print(f"✓ Fixed {file_changes} links in {rel_path}")
                total_changes += file_changes
                files_modified += 1

        except Exception as e:
            rel_path = os.path.relpath(html_file, root_dir)
            print(f"✗ Error processing {rel_path}: {e}")

    print(f"\n" + "=" * 80)
    print(f"Summary:")
    print(f"  Files modified: {files_modified}/{len(html_files)}")
    print(f"  Total link fixes: {total_changes}")
    print("=" * 80)

if __name__ == '__main__':
    main()
