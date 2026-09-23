# AGENTS.md

## CV Workflow (Non-Negotiable)

- Read `docs/CV_UPDATE_WORKFLOW.md` before changing CV content.
- Canonical CV is website-rendered Markdown.
- Authoritative sources are `cv.md`, `cv/publications.md`, and
  `cv/presentations.md`.
- Use `tools/preview_cv.ps1` for tests and human review.
- Editing or previewing is not permission to publish.
- Stop after preview and wait for explicit publication approval.
- Only after explicit approval, use `tools/publish_cv.ps1` or
  `tools/cv-tool.ps1 publish`, and require the typed `PUBLISH` confirmation.
- Never stage or commit local preview artifacts.
- Do NOT use pandoc or wkhtmltopdf as a CV PDF pipeline.
- The browser-native two-page resume is `resume.md` rendered at `/resume/`.
- If printed output is needed, open the CV or resume page in a browser and use
  the browser's built-in print command.
- Do not troubleshoot PDF toolchains unless Dawson explicitly reverses this decision in the current session.

## Deployment Preference (Dawson)

- Use PowerShell git commands to merge to `main` and push directly for go-live.
- Avoid GitHub web merge UI unless Dawson explicitly requests it.

---

# CROSS-PROJECT STANDING RULES — ruled by Dawson 23 Sep 2026, apply in every project

## AI use in Dawson's scholarship is DECLARED, DEFENDED, AND NOT A LIABILITY

Dawson uses Claude (and earlier ChatGPT) as a drafting, editing, organisational and coding assistant,
under written specifications, automated tests and governance standards he designed and enforces. Every
design decision, analysis, argument and claim is specified, reviewed and verified by him, and he takes
sole responsibility. No generative AI produces, alters or fabricates data. That is the whole position,
it is written into every manuscript's declaration, and it is a strength of the work, not a risk.

- **Never treat a journal's or venue's AI-disclosure requirement as a "gate", "risk", "flag" or reason to
  rank it down.** Disclosure is what Dawson does anyway. Only an outright *ban* on AI-assisted
  authorship excludes a venue, and it is stated as a ban with the policy quoted, not inferred.
- **Never propose rewording a declaration to conceal or minimise.** Reword only to state the actual
  process accurately.
- **Never raise "reviewers/readers may distrust AI-assisted work."** It has been raised, answered, and
  he is sick of hearing it. If an expert seat says it, strike it before it reaches him.
- **Never ask him to justify, explain or re-defend his AI use.** Quote the paragraph above.
- The one live obligation is that each declaration accurately matches what was done. Check that only.

## No article processing charges — EVER. "I'll NEVER pay NEVER."

Any venue whose only route is a paid APC (Frontiers, MDPI, PLOS, Sage Open, BMC, any gold-OA-only
journal) is off every list before ranking begins. Do not list it "in case", do not rank it with an
"if willing to pay" note, do not ask. Hybrid journals are fine on the subscription route.

## Git: the session does all of it, and Dawson never sees a git error — ruled 23 Sep 2026

Dawson does not commit, push, pull, or resolve anything in git. He also does not want to be told about
git mechanics; "I do not understand push … every time I get git pushback I freak out." So:

- **Pull before editing.** The session's first act in a repo is `git pull --rebase --autostash origin main`
  (natively, in the RStudio Terminal or the project's own terminal). This brings down what GitHub has and
  puts any local commits on top. It deletes nothing: git keeps every commit, and uncommitted edits are set
  aside and restored by `--autostash`.
- **Push after committing.** Every commit is followed by a bare `git push` on its own line. **A session
  never ends with unpushed commits.** Confirm the push by reading the terminal output, not by assuming.
- **A rejected push is the session's problem, not Dawson's.** "Updates were rejected … fetch first" means
  GitHub has commits this machine lacks. Run the pull above, then push again. Do not report the rejection
  to Dawson as a problem; report the outcome ("pushed, N remote commits integrated").
- **A conflict (both sides changed the same lines) is the only thing that reaches Dawson,** and it reaches
  him as a one-line choice — "GitHub's version or ours for these lines?" — never as git output.
- **Never `git reset --hard`, `git checkout -- <file>`, `git clean`, `git push --force`, or delete a
  branch** without Dawson saying so in as many words. Those are the only commands that lose work.
- Typing into a terminal via computer use: **one plain git command per line.** Compound lines (loops,
  pipes) containing `git push` are blocked by the app's safety classifier; a bare `git push` is not.
