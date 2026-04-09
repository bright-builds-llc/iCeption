---
phase: 07-real-installed-boundary-verification
verified: 2026-04-05T09:24:58Z
status: passed
score: 15/15 must-haves verified
---

# Phase 7: Real Installed-Boundary Verification Report

**Phase Goal:** Prove the real installed-PWA/display-mode launch boundary end to end instead of relying on the dev-only standalone override in browser verification.  
**Verified:** 2026-04-05T09:24:58Z  
**Status:** passed

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | The browser harness no longer depends on the dev-only standalone query override. | ✓ VERIFIED | [`tests/e2e/fixtures/launcher.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/fixtures/launcher.ts) now enters installed context through browser signals instead of `openos-install-context=standalone`. |
| 2 | Playwright now runs against a production-like preview server instead of the Vite dev server. | ✓ VERIFIED | [`playwright.config.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/playwright.config.ts) now uses `pnpm build && pnpm exec vite preview ...`. |
| 3 | App bootstrap tests explicitly protect non-dev `display-mode` and legacy standalone semantics. | ✓ VERIFIED | [`createAppContext.test.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/app/bootstrap/createAppContext.test.ts) now covers `display-mode` and `legacy-standalone` with `isDev: false`. |
| 4 | Browser entry and installed-context entry are proven as separate automated paths. | ✓ VERIFIED | [`installed-boundary.spec.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/installed-boundary.spec.ts) verifies onboarding for browser mode and standalone shell entry with `data-install-source="display-mode"`. |
| 5 | Shell-flow and Calculator regressions remain green on the new installed-context harness. | ✓ VERIFIED | [`shell-flow.spec.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/shell-flow.spec.ts) and [`calculator.spec.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/calculator.spec.ts) now use the installed-context helper and pass in WebKit. |
| 6 | The phase leaves honest evidence distinguishing automated proof from literal installed-container proof. | ✓ VERIFIED | [`07-UAT.md`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/07-real-installed-boundary-verification/07-UAT.md) and the updated [v1-v1-MILESTONE-AUDIT.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/v1-v1-MILESTONE-AUDIT.md) record the remaining manual step explicitly. |
| 7 | Literal Home Screen installed-web-app launch has been observed and recorded. | ✓ VERIFIED | [`07-UAT.md`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/07-real-installed-boundary-verification/07-UAT.md) now records a user-confirmed PASS for Safari onboarding, Home Screen launch into standalone entry, and Calculator open/home return. |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| Production-like Playwright server path | Preview/build-backed server | ✓ EXISTS + VERIFIED | `playwright.config.ts` uses `vite preview` after `pnpm build`. |
| Installed-context launcher helper | No dev-only query override | ✓ EXISTS + VERIFIED | `gotoInstalledContextMode()` in `launcher.ts` uses browser signals. |
| Install-context unit coverage | Non-dev installed-boundary semantics | ✓ EXISTS + VERIFIED | `createAppContext.test.ts` covers non-dev display-mode and legacy standalone. |
| Installed-boundary browser spec | Browser vs installed-context proof | ✓ EXISTS + VERIFIED | `tests/e2e/installed-boundary.spec.ts` exists and passes. |
| Migrated shell-flow and Calculator specs | Reused new boundary harness | ✓ EXISTS + VERIFIED | `shell-flow.spec.ts` and `calculator.spec.ts` pass on the new helper path. |
| Manual installed-boundary artifact | Literal Home Screen confirmation checklist | ✓ EXISTS + VERIFIED | `07-UAT.md` records a completed PASS result from manual Safari/Home Screen verification. |

**Artifacts:** 6/6 verified

## Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| `INST-02`: User can launch the installed web app from the iPhone Home Screen and enter the experience in standalone app mode. | ✓ SATISFIED | User-confirmed Phase 7 UAT records successful Safari install and Home Screen standalone launch. |
| `QUAL-01`: Automated browser UI tests verify the main shell flow: onboarding/browser mode, home-screen render, implemented app launch, implemented app dismiss, and placeholder app launch. | ✓ SATISFIED | - |
| `QUAL-02`: Automated browser UI tests verify the main Calculator happy-path interactions at a basic level. | ✓ SATISFIED | - |

## Human Verification Required

Completed. [`07-UAT.md`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/07-real-installed-boundary-verification/07-UAT.md) records a user-confirmed PASS for the literal Home Screen installed-boundary check.

## Verification Metadata

**Automated checks passed:** `pnpm test`, `pnpm test:e2e --project=webkit-iphone`, `npx tsc --noEmit`, `pnpm build`  
**Manual confirmation:** user-reported PASS recorded in `07-UAT.md`  
**Verifier judgment:** the automated harness and literal installed-boundary confirmation together satisfy the Phase 7 goal

---
*Verified: 2026-04-05T09:24:58Z*  
*Verifier: Codex orchestrator*
