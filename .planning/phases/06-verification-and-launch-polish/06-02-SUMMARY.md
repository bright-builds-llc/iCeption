---
phase: 06-verification-and-launch-polish
plan: "02"
subsystem: shell-verification
tags: [playwright, shell, onboarding, standalone, navigation]
requires:
  - phase: 06-01
    provides: Playwright infrastructure and launcher selector contract
provides:
  - Browser-mode onboarding coverage
  - Standalone home-screen and navigation coverage
  - Stable shell-flow verification through the real runtime path
affects: [qual-01, launcher-regressions]
tech-stack:
  added: []
  patterns: [shared launcher helper, scenario-based browser verification]
key-files:
  created:
    - tests/e2e/shell-flow.spec.ts
  modified:
    - tests/e2e/fixtures/launcher.ts
    - playwright.config.ts
key-decisions:
  - "Kept shell coverage scenario-based instead of snapshot-heavy so the suite verifies behavior instead of paint details."
  - "Moved Playwright onto a dedicated high port and disabled blind server reuse after an unrelated local server polluted the first run."
patterns-established:
  - "Browser mode and deterministic standalone mode are both exercised through the same launcher helper."
requirements-completed: [QUAL-01]
duration: 12min
completed: 2026-04-04
---

# Phase 6 Wave 2 Summary

**The core shell journey is now browser-verified in both browser and standalone contexts**

## Accomplishments

- Added a browser-mode onboarding scenario that proves the product stays in install-first preview mode
- Added standalone scenarios for home render, Calculator launch/dismiss, and placeholder-app launch
- Hardened the Playwright server configuration so the suite always targets this repo instead of an arbitrary local process

## Verification

- `pnpm test:e2e -- tests/e2e/shell-flow.spec.ts --project=webkit-iphone`

## Code Commit

- `147f049` `test(06): cover shell flow and calculator`

## Notes

- The only shell-flow issue exposed by the first run was infrastructure-level: Playwright reused another project already serving `127.0.0.1:4173`.
- No product-behavior changes were needed in the shell/runtime path once the suite was isolated to the correct Vite server.
