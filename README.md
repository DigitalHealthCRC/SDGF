# Synthetic Data Governance Framework Explorer

A public website for exploring the Synthetic Data Governance Framework (SynDGFM) so teams can plan, assess, and document the safe use of synthetic health data in Australia. The site distils the framework into guided workflows, resources, and downloadable templates that make governance tangible for data custodians, requestors, and reviewers.

- **Live site:** https://digitalhealthcrc.github.io/SDGF/
- **Maintained by:** Digital Health CRC / SynD program

## Purpose
- Provide a narrative overview of SynDGFM and who it serves.
- Step practitioners through the five governance stages with interactive checklists that persist progress locally.
- Centralise appendices, templates, and background resources that underpin each stage of the framework.
- (Future steps) Offer a lightweight admin surface for curating content before publishing to the static site.

## Highlights
- **Five-step governance journey** (`app/steps/[1-5]`) with contextual help, appendix links, completion tracking, and export options (print/save/download bundles via `JSZip`).
- **Resource and appendix library** (`app/resources/(appendices)`) that organises evidence, lawful pathways, and controls referenced throughout the framework.
- **Template catalogue** (`app/templates`) with ready-to-use documents for risk assessments, approvals, and implementation plans.
- **About & background** storytelling (`app/about`) to anchor the framework in policy, ethics, and SynD program goals.

## Chatbot Integration
The site includes an OpenAI ChatKit-powered AI assistant on all pages.

## Architecture & Tech Stack
- **Next.js 16 App Router** + **React 19** with **TypeScript** for type-safe, server/client component composition.
- **Tailwind CSS v4** + custom design tokens provide theming, while **Radix UI / shadcn** primitives ensure accessible interactions.
- **State & forms:** React Hook Form, Zod validation, and a custom `ProgressProvider` for per-step persistence.
- **Data visualisation & UX:** React Flow, Recharts, embla carousel, Radix navigation menus, Lucide icons, and aurora background effects.
- **Tooling:** ESLint v9, Vitest + Playwright-ready configs, and `patch-package` for post-install tweaks.
- **Static hosting:** `npm run build` executes `next build` followed by `scripts/post-export.mjs`, preparing the `/out` folder for GitHub Pages.

## Project Structure (excerpt)
```text
app/
  page.tsx             # Landing page & persona routing
  about/page.tsx       # Background on SynDGFM and its stakeholders
  steps/1-5/page.tsx   # Guided governance stages with saved checklists
  templates/page.tsx   # Template library with download helpers
  resources/(appendices)/page.tsx  # Appendix navigation and reference materials
src/
  components/          # Reusable UI (progress bars, layout shells, cards, accordions)
  content/             # JSON/MD data that powers each step and appendix
  lib/                 # Utilities (progress context, appendix labels, data mappers)
public/                # Static assets (logos, illustrations, pdfs)
scripts/post-export.mjs# Adjusts static export paths for GitHub Pages
.github/workflows/     # `deploy.yml` builds main and publishes /out to gh-pages
```

## Getting Started Locally
1. **Prerequisites:** Node 18.18+ (workflow uses Node 20) and npm 10.
2. **Install dependencies:** `npm install`
3. **Run locally:** `npm run dev` (served at `http://localhost:3000`, with hot reload + App Router).
4. **Lint:** `npm run lint`
5. **Test (optional):** add Vitest/Playwright suites under `src/` and run `npx vitest` or `npx vitest --browser`.

### Production Build & Export
```bash
npm run build
```
This runs `next build` then `scripts/post-export.mjs` to massage asset paths for GitHub Pages. The static artefacts land in `/out` and can be pushed to the `gh-pages` branch or served by any static host.

## Deployment Flow
- The **Deploy static Next.js site to GitHub Pages** workflow (`.github/workflows/deploy.yml`) triggers on pushes to `main` or via `workflow_dispatch`.
- It performs a clean install (`npm ci`), runs the static export, and publishes `/out` to the `gh-pages` branch using `peaceiris/actions-gh-pages@v3` with the repo-provided `GITHUB_TOKEN`.
- The published branch backs https://digitalhealthcrc.github.io/SDGF/ via GitHub Pages.

## Contributing
1. Create a feature branch from `main`.
2. Make changes with descriptive commits.
3. Run lint/build locally before opening a PR.
4. Use the PR template (if provided) to capture testing + screenshots so reviewers can validate UI updates quickly.

## Support & Feedback
Have questions about SynDGFM or the site? Raise an issue, or reach the SynD program team via the Digital Health CRC channels. Contributions that clarify the framework, add new templates, or improve the user journey are especially welcome.
