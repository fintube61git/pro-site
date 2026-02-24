# ExistenzPsych.com — Webflow Retirement & Domain Authority

## TL;DR FOR AGENTS (READ FIRST)

- **existenzpsych.com is retired from Webflow permanently**
- **Do NOT reconnect Webflow**
- **Do NOT attempt to “fix” domain warnings**
- All traffic must 301 → https://tdawsonwoodrum.com/practice/
- Cloudflare is authoritative for redirects
- Squarespace is registrar/DNS only
- This decision is final unless explicitly reversed by the owner

If your task involves existenzpsych.com and suggests Webflow, publishing, or domain repair:
👉 STOP. Read this document fully.

---

## Status

**COMPLETE — LOCKED — DO NOT RE-DERIVE**

Decision date: **2026-02-24**  
Owner: **T. Dawson Woodrum**

---

## Executive Summary

The domain **existenzpsych.com** has been permanently retired from Webflow.
All clinical content has been migrated and consolidated under:

> **https://tdawsonwoodrum.com/practice/**

The domain now functions **only as a permanent redirect**.
No content is hosted, published, or managed on Webflow.

---

## Final Architecture (Authoritative)

### Domain
- **existenzpsych.com**
- Registrar & DNS manager: **Squarespace**
- Purpose: legacy clinical entry point → redirect only

### Edge / Redirect Layer
- **Cloudflare**
- Redirect type: **HTTP 301 (Permanent)**
- Implemented via **Page Rules**
- Rules (both enabled):
  - `existenzpsych.com/* → https://tdawsonwoodrum.com/practice/`
  - `www.existenzpsych.com/* → https://tdawsonwoodrum.com/practice/`

### Destination Site
- **tdawsonwoodrum.com**
- Hosting: GitHub Pages (auto-deploy on push)
- Clinical content path: `/practice/`
- Clinical / professional separation enforced by path, not domain

---

## Webflow Status (Explicit)

- Webflow **hosting canceled**
- Site downgraded to **Starter (free)**
- Payment method **removed**
- No future billing possible
- Prepaid CMS period expires naturally:
  - **Oct 6, 2026**
- After expiration, site remains unpublished / archived

⚠️ Webflow warnings such as “Update domains” are EXPECTED  
⚠️ These warnings must be IGNORED  
⚠️ Domains must NOT be reconnected to Webflow

---

## Account Ownership & Separation (CRITICAL)

To avoid future confusion:

### Squarespace / Registrar Accounts

- **existenzpsych.com**
  - Managed in Squarespace
  - Logged in via **iwillnotcomply@gmail.com** (Google account)

- **Other domains (e.g.)**
  - `tdawsonwoodrum.com`
  - `ip-mapper.com`
  - `ip-journal.live`
  - and related projects  
  - Managed under **tdawsonwoodrum@gmail.com** (Google account)

These accounts are intentionally separate.
Do NOT attempt to consolidate or “clean up” across accounts.

---

## Explicit Non-Actions (By Design)

The following were intentionally NOT done and must not be added later:

- ❌ No Webflow export
- ❌ No registrar-level forwarding
- ❌ No HTML bridge pages
- ❌ No meta refresh redirects
- ❌ No SEO experiments or optimization
- ❌ No content duplication
- ❌ No Webflow domain fixes

Cloudflare 301 redirects are the **single source of truth**.

---

## Verification

- 301 redirects verified live
- Cloudflare reports domain as active & protected
- DNS records no longer point to Webflow
- Webflow receives **zero production traffic**
- Billing cannot resume

---

## Future Guidance (Human or Agent)

If touching this domain in the future:

- **DO NOT** reconnect Webflow
- **DO NOT** publish or edit Webflow content
- **DO NOT** attempt to resolve Webflow domain warnings
- **DO NOT** move the redirect target without explicit intent

If Cloudflare is ever removed, equivalent **301 redirects must be recreated**
before any DNS or hosting changes.

---

## Canonical Clinical Location

All clinical material lives at:

> **https://tdawsonwoodrum.com/practice/**

This is the sole authoritative clinical endpoint.

---

## End of Record