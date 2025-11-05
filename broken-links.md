# Broken Links Status

Checked 5 November 2025.

- All static assets now exist under `out/SDGF/...` after the export copy step (`scripts/post-export.mjs`).
- Current build produces new chunk names, so previously reported hashed filenames are obsolete.
- Chatbot bundle now loads from `https://cdn.platform.openai.com/deployments/chatkit/chatkit.js`; the old jsDelivr URL is no longer referenced.

No broken links are currently known. Re-run `npm run build` to regenerate the export and refresh the copied assets before deploying.
