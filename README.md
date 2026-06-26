# Professional Site — GitHub Pages Starter

This repo is a clean, static starter intended to deploy in minutes on GitHub Pages—no frameworks, no build step.

## Updating the CV

The CV has a verify-before-publish workflow designed for both humans and AI
agents.

Start with [docs/CV_UPDATE_WORKFLOW.md](docs/CV_UPDATE_WORKFLOW.md).

The short version:

```powershell
.\tools\preview_cv.ps1
```

Review the private local preview. After explicit approval:

```powershell
.\tools\publish_cv.ps1
```

The canonical sources are `cv.md`, `cv/publications.md`, and
`cv/presentations.md`. The browser-native two-page research resume is sourced
from `resume.md` and rendered at `/resume/`. Previewing never publishes.

Do not maintain generated CV, publication-list, presentation-list, or resume
PDFs. Use the browser's built-in print command when printed output is needed.

## Quick Deploy (GitHub Pages)

1. Create a new **public** repo on GitHub (or private with Pages allowed).
2. Push this folder to the repo as the `main` branch.
3. In **Settings → Pages**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`, folder `/ (root)`
4. (Optional) Add `CNAME` file in repo root with your domain (e.g., `www.example.com`).
5. Wait 1–2 minutes for Pages to provision SSL.

## Point Your Domain (Squarespace DNS)

In Squarespace **Domains → your domain → DNS** add/update:

- **www** (recommended canonical):  
  Type **CNAME** → Value: `<your-username>.github.io.`
- **Root/apex (@)**:  
  Type **A** → four records to:
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

Then, in this repo, ensure a `CNAME` file with your canonical host (e.g., `www.example.com`). GitHub will auto‑issue TLS for both `www` and the apex once DNS propagates.

### WWW vs Apex
Use `www` as primary (CNAME) and redirect apex to it in GitHub Pages settings (Enforce HTTPS + HTTPS‑only).

## Customize

- Replace text in `index.html` and the hero image (`/assets/img/hero-placeholder.png`).
- Update email in the Contact section.
- Add content sections as needed; styles live in `/css/styles.css`.

## No Duplicate CSS Blocks

All styling is in `/css/styles.css` and referenced once in `index.html`. No runtime CSS injection is used, preventing duplicate CSS when you add more pages.

## Optional: Actions Deployment

If you prefer GitHub Actions, enable the included workflow at `.github/workflows/pages.yml` or just use the branch deploy above.
