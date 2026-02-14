# CV Workflow (Canonical)

This repo’s CV pipeline is source-driven. You only edit the source markdown files. Everything else is generated.

## Authoritative source files (EDIT ONLY THESE)

- cv.md
- cv/publications.md (list only — NO header)
- cv/presentations.md (list only — NO header)

## Generated artifacts (NEVER hand-edit, NEVER commit)

- _cv_expanded.md
- cv.html
- Any PDFs derived from cv.html

## The build script (mandatory)

- tools/build_cv_html.ps1

Includes MUST be expanded by the build script first.
Do NOT run Pandoc directly on cv.md.

## The ONLY valid build command (from repo root)

powershell -ExecutionPolicy Bypass -File .\tools\build_cv_html.ps1

## What must never be done

- Do NOT run: pandoc cv.md ...
- Do NOT edit: _cv_expanded.md or cv.html
- Do NOT commit generated CV artifacts
