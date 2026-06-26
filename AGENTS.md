# AGENTS.md

## CV Workflow (Non-Negotiable)

- Read `docs/CV_UPDATE_WORKFLOW.md` before changing CV content.
- Canonical CV is website-rendered Markdown.
- Authoritative sources are `cv.md`, `cv/publications.md`, and
  `cv/presentations.md`.
- Use `tools/preview_cv.ps1` for tests and human review.
- Editing or previewing is not permission to publish.
- Stop after preview and wait for explicit publication approval.
- Only after explicit approval, use `tools/publish_cv.ps1 -ConfirmPublish`.
- Never stage or commit local preview artifacts.
- Do NOT use pandoc or wkhtmltopdf as a CV PDF pipeline.
- The browser-native two-page resume is `resume.md` rendered at `/resume/`.
- If printed output is needed, open the CV or resume page in a browser and use
  the browser's built-in print command.
- Do not troubleshoot PDF toolchains unless Dawson explicitly reverses this decision in the current session.

## Deployment Preference (Dawson)

- Use PowerShell git commands to merge to `main` and push directly for go-live.
- Avoid GitHub web merge UI unless Dawson explicitly requests it.
