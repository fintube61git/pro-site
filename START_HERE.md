# Start Here

This is the plain-English guide for small website updates.

You do not need to remember the commands. Start a Codex chat in this folder and
paste this:

```text
Help me update my PROSITE repo. Read START_HERE.md, AGENTS.md, and
docs/CV_UPDATE_WORKFLOW.md first. Do not push or publish anything until tests
pass and I explicitly approve. The change I need is: [say the change].
```

## What To Change

There are three parts of the site. The main public pages are:

- Home
- About
- Apps
- Contact

Those are the labels to use when you ask for help. You can say "update the
Apps page" or "change the Contact page" and Codex should find the file.

Behind the scenes, those pages live here:

- Main professional site: `index.html`, `about.html`, `apps.html`,
  `contact.html`, `privacy.html`
- CV and resume: `cv.md`, `cv/publications.md`, `cv/presentations.md`,
  `resume.md`
- Practice site pages: everything under `practice/`

| If you need to update... | Usually edit... |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| Apps | `apps.html` |
| Contact | `contact.html` |
| Privacy text | `privacy.html` |
| Publication list | `cv/publications.md` |
| Presentation list | `cv/presentations.md` |
| CV jobs, roles, education, licensure, or professional development | `cv.md` |
| Two-page research resume | `resume.md` |
| Practice home page | `practice/index.html` |
| Practice approach page | `practice/approach.html` |
| Practice services page | `practice/services.html` |
| Practice fees and policies | `practice/fees-policies.html` |
| Practice FAQ | `practice/faq.html` |
| Practice contact page | `practice/contact.html` |
| Practice privacy page | `practice/privacy.html` |
| Practice phone or practice email | `practice/contact.html` plus the JSON contact blocks in `practice/*.html` |
| Anything that appears in Google search snippets | the visible page plus its `<title>`, description meta tag, and sometimes `sitemap.xml` |
| Navigation or links between pages | the page with the link, related tests under `tests/e2e/`, and possibly `sitemap.xml` |

If you are unsure, do not hunt through the repo. Ask Codex to find the right
file and show the proposed diff.

It is fine to say this in normal words:

```text
I need to update the fees page.
```

```text
I need to change the phone number everywhere it appears.
```

```text
I need the apps page to mention a new tool.
```

Codex should search the repo, make the edit, run the checks, and show you the
diff before anything goes live.

## Safe Update Flow

1. Make the small edit.
2. Run the local checks.
3. Preview the site or CV locally.
4. Review the diff.
5. Only after you approve, commit and push.

Previewing does not publish. Editing does not publish. Pushing to `main` is the
thing that makes the public site update.

## Checks

For most changes:

```powershell
python run_tests.py
```

For CV or resume changes:

```powershell
.\tools\preview_cv.ps1 -NoOpen
```

For navigation, contact, CV/resume rendering, practice pages, or anything that
could break the website in a browser:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run test:e2e
```

## Publishing

Do not publish until the tests pass and the diff looks right.

When you are ready to publish, say:

```text
The preview and tests look good. Commit this and push it live.
```

The site is a static GitHub Pages site. Squarespace is only part of the domain
setup. The practical rule is simple: a push to `main` updates the live site
after GitHub Pages finishes.
