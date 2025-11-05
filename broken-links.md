# Broken Links Analysis

This document contains a comprehensive analysis of all broken links found on the SDGF website.

## Summary

- **Total broken link references found:** 59 unique paths
- **Total HTML files checked:** 24
- **Analysis date:** 2025-11-05

## Categorization of Issues

### 1. Path Format Issues (Files Exist, But Wrong Path)

These files exist in the repository, but are referenced with incorrect absolute paths (using `/SDGF/` prefix instead of just `/`):

#### a) Next.js Static Assets (_next directory)
All these files exist in `_next/static/chunks/` but are referenced as `/SDGF/_next/static/chunks/`:

- `01bd51e4ce3f19a7.js` - Referenced from 24 pages
- `1110e28c3f48e641.js` - Referenced from 1 page (about.html)
- `112c3e4d3dcc3177.js` - Referenced from 1 page (resources/appendices.html)
- `14af91fd23c891f5.js` - Referenced from 1 page (resources/appendices.html)
- `17ff0df7bfe633ce.js` - Referenced from 1 page (resources/appendices/appendix10.html)
- `1f96a8b013336ba0.js` - Referenced from 11 pages (appendix pages)
- `243d9185eb7d32c6.js` - Referenced from 24 pages
- `299778cda4d3436c.css` - Referenced from 24 pages
- `2c485591558b26c5.js` - Referenced from 1 page (steps/1.html)
- `2cb176b3a63aeeba.js` - Referenced from 1 page (index.html)
- `2d8fb791d80d6fa6.js` - Referenced from 1 page (steps/4.html)
- `2e2f7cd895ed65d4.js` - Referenced from 1 page (steps/2.html)
- `3973aec7e61288c5.js` - Referenced from 1 page (resources/appendices/appendix5.html)
- `456a59e9b1856940.js` - Referenced from 1 page (resources.html)
- `4ab107c847781c2c.js` - Referenced from 13 pages (resources and appendices)
- `4c1f3ae1b9ef8789.js` - Referenced from 48 pages (appears twice in each of 24 pages)
- `58e45d4f177e378e.css` - Referenced from 24 pages
- `6556612df6967d9b.js` - Referenced from 5 pages (various appendices)
- `6aadb45547d565e7.js` - Referenced from 1 page (steps/5.html)
- `6dd2bba20f7960b1.js` - Referenced from 1 page (templates.html)
- `7ca67cfb09bbe012.js` - Referenced from 11 pages (appendix pages)
- `84ae0fd2faabcac7.js` - Referenced from 1 page (resources/appendices/appendix8.html)
- `926350dec3317ae7.js` - Referenced from 24 pages
- `95b6d9a5fbbfee0d.js` - Referenced from 1 page (steps/3.html)
- `9b1a4ff4eccd6d91.js` - Referenced from 1 page (resources/appendices/appendix6.html)
- `a65b62b03771e6a5.js` - Referenced from 1 page (resources/appendices/appendix11.html)
- `a6dad97d9634a72d.js` - Referenced from 24 pages
- `a74d986ac0d1bf77.js` - Referenced from 1 page (resources/appendices/appendix4.html)
- `acd9979166dcc7c7.js` - Referenced from 24 pages
- `b78daa7c04175b77.js` - Referenced from 1 page (admin.html)
- `c518a733bdcf3dee.js` - Referenced from 24 pages
- `f38a61675d3279d8.js` - Referenced from 1 page (resources.html)
- `ff1a16fafef87110.js` - Referenced from 22 pages
- `turbopack-4830fe6cc1073619.js` - Referenced from 24 pages

#### b) Next.js Static Font Assets
All these font files are referenced with `/SDGF/_next/static/media/` but should be `/_next/static/media/`:

- `68d403cf9f2c68c5-s.p.f9f15f61.woff2` - Referenced from 22 pages
- `797e433ab948586e-s.p.dbea232f.woff2` - Referenced from 22 pages
- `83afe278b6a6bb3c-s.p.3a6ba036.woff2` - Referenced from 22 pages
- `caa3a2e1cccd8315-s.p.853070df.woff2` - Referenced from 22 pages

#### c) Chatbot Assets
These files exist in `assets/chatbot/` but are referenced as `/SDGF/assets/chatbot/`:

- `chatbot-theme.css` - Referenced from 48 pages (appears twice in each of 24 pages)
- `chatkit.js` - Referenced from 24 pages

#### d) Root Assets
These files exist in the root but are referenced as `/SDGF/`:

- `favicon.png` - Referenced from 48 pages (appears twice in each of 24 pages)
- `logo.png` - Referenced from 12 pages (appears twice in each of 6 appendix pages)
- `print.css` - Referenced from 48 pages (appears twice in each of 24 pages)

#### e) Navigation Links (HTML pages without .html extension)
These are links to existing HTML pages but referenced without the `.html` extension:

- `/SDGF/about` → should be `/about.html` or `/about/` (about.html exists)
  - Referenced from 6 pages (various appendix pages)
- `/SDGF/resources` → should be `/resources.html` or `/resources/` (resources.html exists)
  - Referenced from 7 pages (appendices pages)
- `/SDGF/templates` → should be `/templates.html` or `/templates/` (templates.html exists)
  - Referenced from 6 pages (various appendix pages)

### 2. Actual Missing Files/Pages

#### a) Missing Root-Level Directory Reference
- `/SDGF` - Referenced from 12 pages (various appendix pages as a link back to home)
  - Should likely be `/` or `/index.html`

#### b) Missing Appendix Navigation Links
These appendix pages exist as `.html` files but are being referenced without the extension:

- `/SDGF/resources/appendices` → should be `/resources/appendices.html` or auto-redirect
  - Referenced from 11 pages
- `/SDGF/resources/appendices/appendix1` → appendix1.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix2` → appendix2.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix3` → appendix3.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix4` → appendix4.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix5` → appendix5.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix6` → appendix6.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix7` → appendix7.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix8` → appendix8.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix9` → appendix9.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix10` → appendix10.html exists
  - Referenced from resources/appendices.html
- `/SDGF/resources/appendices/appendix11` → appendix11.html exists
  - Referenced from resources/appendices.html

## Root Cause

The primary issue is that all links are using absolute paths with the `/SDGF/` prefix. This appears to be a base path configuration issue, likely from:

1. **Next.js configuration**: The `basePath` in `next.config.js` might be set to `/SDGF` for deployment
2. **Build process**: The static export is adding the `/SDGF` prefix to all absolute URLs

## Recommendations

1. **For deployment on a subdirectory** (e.g., `example.com/SDGF/`):
   - Keep the `/SDGF/` prefix in the links
   - Ensure proper server configuration to serve files from this subdirectory
   - Configure web server rewrites/redirects for extensionless URLs

2. **For deployment on root domain** (e.g., `example.com/`):
   - Remove the `/SDGF/` prefix from all links
   - Update Next.js `basePath` configuration
   - Rebuild the static export

3. **Fix extensionless URL references**:
   - Either add `.html` extensions to all links
   - Or configure server-side rewrites to handle extensionless URLs
   - Or convert to proper directory-based routing with index.html files

## Files Affected by Category

- **JavaScript files**: 35 unique files in `_next/static/chunks/`
- **CSS files**: 2 unique files (`299778cda4d3436c.css`, `58e45d4f177e378e.css`)
- **Font files**: 4 woff2 files in `_next/static/media/`
- **Chatbot assets**: 2 files (chatbot-theme.css, chatkit.js)
- **Root assets**: 3 files (favicon.png, logo.png, print.css)
- **HTML navigation links**: 15 extensionless page references

## Next Steps

1. Determine the intended deployment path (root vs. subdirectory)
2. Update Next.js configuration accordingly
3. Rebuild the static export with correct base path
4. Configure web server for proper URL handling
