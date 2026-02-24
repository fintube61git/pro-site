# Domain Authority Map — Registrar, DNS, Hosting (LOCKED)

## TL;DR FOR HUMANS AND AGENTS

- Domains are intentionally split across **two Squarespace accounts**
- This split is **by design** and must not be “cleaned up”
- DNS, hosting, and redirect behavior differ per domain
- Always read this file before proposing domain, DNS, or hosting changes

If a task suggests consolidating accounts, reconnecting Webflow, or “fixing”
domain warnings → **STOP** and re-read this document.

---

## Purpose

This file is the single source of truth for:

- Domain ownership
- Squarespace account boundaries
- DNS authority
- Hosting targets
- Redirect-only domains

It exists to prevent accidental breakage, billing mistakes, and agent drift.

---

## Squarespace Accounts (INTENTIONAL SEPARATION)

### Account A — Legacy / Redirect-Only
- **Google login:** `iwillnotcomply@gmail.com`
- **Purpose:** legacy clinical domain management only

**Domains in this account:**
- `existenzpsych.com`

Special handling:
- Redirect-only
- Cloudflare authoritative
- Webflow permanently retired  
- See: `EXISTENZPSYCH_WEBFLOW_RETIREMENT.md`

---

### Account B — Active Projects (PRIMARY)
- **Google login:** `tdawsonwoodrum@gmail.com`
- **Purpose:** all active professional and app domains

**Domains in this account:**
- `tdawsonwoodrum.com` (pro-site)
- `ip-mapper.com`
- `ip-journal.live`
- (any future active domains)

These domains are intentionally co-located and should remain so.

---

## Per-Domain Authority Details

### existenzpsych.com
- Registrar: Squarespace (Account A)
- Nameservers: Cloudflare
- DNS authority: Cloudflare
- Function: Redirect-only
- Redirect (301):
  - `existenzpsych.com/*`
  - `www.existenzpsych.com/*`
  → `https://tdawsonwoodrum.com/practice/`
- Legacy host: Webflow (retired; billing canceled)
- Canonical record: `EXISTENZPSYCH_WEBFLOW_RETIREMENT.md`

---

### tdawsonwoodrum.com
- Registrar: Squarespace (Account B)
- DNS authority: Squarespace
- Hosting: GitHub Pages
- Function: Professional site + clinical content
- Clinical content path: `/practice/`
- Notes:
  - Clinical/professional separation enforced by path, not domain
  - Do not relocate `/practice/` without explicit intent

---

### ip-mapper.com
- Registrar: Squarespace (Account B)
- DNS authority: Squarespace
- Hosting: (current production host; do not change without approval)
- Function: Parts Mapper application
- Notes:
  - No redirects unless explicitly specified
  - Treat as active application domain

---

### ip-journal.live
- Registrar: Squarespace (Account B)
- DNS authority: Squarespace
- Hosting: (current production host; do not change without approval)
- Function: Parts Journal application
- Notes:
  - No redirects unless explicitly specified
  - Treat as active application domain

---

## Explicit Non-Actions (GLOBAL)

Unless explicitly authorized by the owner, **do not**:

- Move domains between Squarespace accounts
- Consolidate Google logins
- Reconnect Webflow domains
- Add registrar-level forwarding
- Add SEO “fixes” or experiments
- Change nameservers casually

Document first. Propose second. Act last.

---

## Ownership

Domain owner: **T. Dawson Woodrum**  
Last verified: **2026-02-24**  
Status: **LOCKED / AUTHORITATIVE**