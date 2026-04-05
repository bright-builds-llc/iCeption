---
phase: 07-real-installed-boundary-verification
plan: "02"
subsystem: boundary-proof
tags: [playwright, install-boundary, shell-flow, calculator, display-mode]
requires:
  - phase: 07-01
    provides: production-like boundary harness and installed-context helper
provides:
  - Explicit installed-boundary browser proof
  - Shell-flow coverage migrated onto the installed-context helper
  - Calculator coverage kept on the same boundary path
affects: [phase-7-verification, milestone-audit]
tech-stack:
  added: []
  patterns: [boundary-focused browser scenario, helper-driven entry semantics]
key-files:
  created:
    - tests/e2e/installed-boundary.spec.ts
  modified:
    - tests/e2e/shell-flow.spec.ts
    - tests/e2e/calculator.spec.ts
key-decisions:
  - "Added one explicit boundary spec instead of overloading shell-flow to carry all install-boundary truth."
  - "Migrated downstream coverage by helper name so the new installed-context path is obvious in the spec surface."
patterns-established:
  - "Browser entry and installed-context entry are now tested as separate, deliberate proof paths."
requirements-completed: []
duration: 0min
completed: 2026-04-04
---

# Phase 7 Wave 2 Summary

**The milestone blocker now has an explicit browser proof path, and the existing shell/Calculator regressions ride on the same installed-context harness**

## Accomplishments

- Added a dedicated installed-boundary spec for browser vs installed-context entry behavior
- Migrated shell-flow coverage onto the installed-context helper by name
- Kept Calculator on the same installed-entry path instead of silently relying on old helper semantics

## Verification

- `pnpm test:e2e -- tests/e2e/installed-boundary.spec.ts tests/e2e/shell-flow.spec.ts tests/e2e/calculator.spec.ts --project=webkit-iphone`
- `npx tsc --noEmit`
- `pnpm build`

## Notes

- This wave proves browser entry versus installed-context entry through `display-mode` semantics inside the production-like harness.
- It still does not claim literal Home Screen launch automation; Phase 7 Wave 3 will lock the verification evidence around that distinction.
