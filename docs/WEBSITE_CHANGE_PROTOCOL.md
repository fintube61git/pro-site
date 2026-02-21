# Website Change Protocol (MANDATORY)

This repository uses a **verify-first workflow** for ANY change that affects website behavior.

This rule exists to prevent silent breakage, visual guesswork, and regression drift.

────────────────────────────────
SCOPE (WHEN THIS APPLIES)
────────────────────────────────

This protocol is REQUIRED for:
- Navigation changes
- Link targets
- Anchors / IDs
- Page routing
- Generated artifacts consumed by the site
- Any change that affects what a user can click, load, or navigate

────────────────────────────────
REQUIRED FLOW (NO EXCEPTIONS)
────────────────────────────────

Every website functionality change MUST follow this order:

1) EVALUATE (READ-ONLY)
   - Locate existing behavior/pattern in the repo
   - Identify canonical implementation (paths + snippet)
   - Do NOT change files yet

2) IMPLEMENT (MINIMAL)
   - Modify ONLY what is necessary
   - Match existing conventions exactly
   - Never invent new patterns unless explicitly approved

3) VERIFY (AUTOMATED)
   - Run deterministic checks (builds, searches, string matches)
   - Prove the change exists where expected
   - Fail loudly if verification does not pass

4) COMMIT
   - Commit ONLY after verification succeeds
   - Commit message must reflect the functional change

5) STOP
   - Do not proceed to follow-on work without approval

────────────────────────────────
CODEx / AGENTIC REQUIREMENT
────────────────────────────────

When using Codex or other agentic tooling:
- Evaluation and verification steps MUST be included in the prompt
- The agent must STOP if verification fails
- Generated artifacts must never be edited directly

────────────────────────────────
NON-NEGOTIABLES
────────────────────────────────

- No visual-only verification
- No “seems fine”
- No skipped verification
- No silent fixes

If this protocol is violated, STOP and correct before continuing.
