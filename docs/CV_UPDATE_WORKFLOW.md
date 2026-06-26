# CV Update Workflow

This is the canonical workflow for updating the CV published at
<https://www.tdawsonwoodrum.com/cv/>.

The governing sequence is:

> Edit → Test → Preview → Human approval → Commit → Push → Verify live

Publishing is never part of previewing. A human must review the rendered CV and
explicitly approve publication before any commit or push.

## Authoritative source files

Edit only the source file that owns the content:

- `cv.md` — profile, credentials, experience, teaching, professional
  development, memberships, and endorsements
- `cv/publications.md` — publication entries only; do not add a section heading
- `cv/presentations.md` — presentation entries only; do not add a section
  heading
- `resume.md` — browser-native two-page research resume

The CV initially displays the five most recent publications and presentations.
The complete canonical lists remain in the Markdown include files and can be
expanded in the browser. Printed CV output includes the complete lists.

The research resume is rendered at `/resume/`, uses an explicit print page
break, and is intended to be printed from the browser.

The live page at `cv/index.html` loads these Markdown sources in the browser.

## Files that are not CV sources

Do not hand-edit or commit generated CV artifacts, including:

- `_cv_expanded.md`
- `cv.html`
- `_cv_preview.html`
- PDFs generated from the CV

The old Pandoc build path is retired. Do not run Pandoc or wkhtmltopdf for the
CV or resume. If printed output is needed, open the rendered browser page and
use the browser's built-in print command. Do not generate or maintain separate
publication, presentation, CV, or resume PDFs.

## Human workflow

From the repository root:

1. Edit the appropriate Markdown source file.
2. Run:

   ```powershell
   .\tools\preview_cv.ps1
   ```

3. Review the browser preview at:

   <http://127.0.0.1:8000/cv/#cv>

4. Request any corrections and preview again.
5. Only after the preview is approved, run:

   ```powershell
   .\tools\publish_cv.ps1
   ```

6. Type `PUBLISH` at the confirmation prompt.
7. After GitHub Pages updates, verify:

   <https://www.tdawsonwoodrum.com/cv/#cv>

The preview script prints the local server process ID and a command for stopping
it.

## AI-agent workflow

An AI agent working on the CV must:

1. Read this file and `AGENTS.md` before editing.
2. Inspect the current Git status and preserve unrelated work.
3. Modify only the relevant authoritative CV source files.
4. Run `python run_tests.py`.
5. Run `.\tools\preview_cv.ps1` and present the preview for human review.
6. Stop and wait for explicit publication approval.
7. After approval, run `.\tools\publish_cv.ps1 -ConfirmPublish`.
8. Verify that local `HEAD` and `origin/main` match and confirm the updated
   source exists on GitHub.
9. Verify the public CV after GitHub Pages has refreshed.

An instruction to edit, improve, clean up, or preview the CV is not permission
to publish it. Publication requires a separate explicit instruction such as
“publish,” “commit and publish,” or “push it live.”

## Preview command

```powershell
.\tools\preview_cv.ps1
```

Useful options:

```powershell
.\tools\preview_cv.ps1 -Port 8080
.\tools\preview_cv.ps1 -NoOpen
```

The command:

- runs the repository integrity tests;
- starts a local UTF-8 web server;
- verifies that the CV page responds;
- opens the private local preview unless `-NoOpen` is supplied;
- does not stage, commit, push, or alter GitHub.

## Publish command

```powershell
.\tools\publish_cv.ps1
```

Optional commit message:

```powershell
.\tools\publish_cv.ps1 -CommitMessage "Update publications and presentations"
```

Safe validation without committing or pushing:

```powershell
.\tools\publish_cv.ps1 -DryRun
```

The publish command:

- refuses to run outside the `main` branch;
- refuses tracked changes outside the three authoritative CV source files;
- runs all repository tests;
- fetches `origin/main` and refuses divergent or stale branch state;
- shows the exact CV diff;
- requires the human to type `PUBLISH`, unless `-ConfirmPublish` was supplied
  by an agent after explicit approval;
- stages only the authoritative CV source files;
- commits and pushes directly to `origin/main`.

## Common updates

### Add a publication

Add one Markdown list item to `cv/publications.md`, newest first.

### Add a presentation

Add one Markdown list item to `cv/presentations.md`, newest first.

### Update employment, credentials, or biography

Edit `cv.md`. Preserve the existing heading hierarchy and concise bullet style.

### Update licensure

Verify the current license status and exact expiration date before changing
`cv.md`. Licensure is date-sensitive and should not be updated from memory.

## Troubleshooting

### Port 8000 is already in use

Use another port:

```powershell
.\tools\preview_cv.ps1 -Port 8080
```

### The preview shows old content

Refresh the page. The CV loader requests Markdown with browser caching disabled.
If necessary, stop the process printed by the preview script and run it again.

### GitHub push returns 403

Confirm GitHub CLI authentication and configure Git to use it:

```powershell
gh auth status
gh auth setup-git
```

Then rerun the publish script.

### The live site has not updated

GitHub Pages may take a few minutes. Confirm that the latest commit is present
on `main`, then refresh the public CV.
