---
phase: 06-verification-and-launch-polish
plan: "03"
subsystem: calculator-verification
tags: [playwright, calculator, launcher, vitest, regression]
requires:
  - phase: 06-01
    provides: Playwright infrastructure and launcher selector contract
  - phase: 06-02
    provides: Stable standalone shell coverage
provides:
  - Calculator browser happy-path coverage
  - Final verification-layer compatibility between Vitest and Playwright
  - Locked phase-end regression suite for the V1 launch path
affects: [qual-02, calculator-regressions]
tech-stack:
  added: []
  patterns: [real-launch calculator scenario, test-runner separation]
key-files:
  created:
    - tests/e2e/calculator.spec.ts
  modified:
    - tests/e2e/fixtures/launcher.ts
    - vite.config.ts
key-decisions:
  - "Kept the Calculator browser spec narrow and launcher-driven instead of re-testing all arithmetic logic already covered by unit tests."
  - "Explicitly excluded `tests/e2e/**` from Vitest so unit and browser suites can coexist without glob collisions."
patterns-established:
  - "Browser-level app tests launch through the same shell/runtime path as users instead of rendering app components directly."
requirements-completed: [QUAL-02]
duration: 10min
completed: 2026-04-04
---

# Phase 6 Wave 3 Summary

**Calculator now has browser-level happy-path coverage through the real openOS launcher, and the repo’s verification layers no longer interfere with each other**

## Accomplishments

- Added a Calculator Playwright scenario that launches from the home screen, performs a basic `7 + 8 = 15` path, and returns home
- Kept the coverage focused on the user-visible launcher/runtime path instead of duplicating unit-level arithmetic assertions
- Fixed the repo-level test-runner overlap so `pnpm test` ignores Playwright specs while `pnpm test:e2e` owns `tests/e2e/**`

## Verification

- `pnpm test:e2e -- tests/e2e/calculator.spec.ts --project=webkit-iphone`
- `pnpm test`
- `pnpm test:e2e --project=webkit-iphone`
- `npx tsc --noEmit`
- `pnpm build`

## Code Commit

- `147f049` `test(06): cover shell flow and calculator`

## Notes

- No Calculator production-code changes were required; the existing Phase 5 implementation already satisfied the browser happy path once the shell and test runners were wired correctly.
