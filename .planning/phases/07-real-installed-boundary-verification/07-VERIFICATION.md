---
phase: 07-real-installed-boundary-verification
verified: 2026-04-05T01:37:05Z
status: human_needed
score: 14/15 must-haves verified
---

# Phase 7: Real Installed-Boundary Verification Report

**Phase Goal:** Prove the real installed-PWA/display-mode launch boundary end to end instead of relying on the dev-only standalone override in browser verification.  
**Verified:** 2026-04-05T01:37:05Z  
**Status:** human_needed

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
| 7 | Literal Home Screen installed-web-app launch has been observed and recorded. | ⚠ HUMAN NEEDED | The checklist exists in [`07-UAT.md`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/07-real-installed-boundary-verification/07-UAT.md), but it has not been executed yet. |

**Score:** 6/7 truths verified, 1 pending human confirmation

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| Production-like Playwright server path | Preview/build-backed server | ✓ EXISTS + VERIFIED | `playwright.config.ts` uses `vite preview` after `pnpm build`. |
| Installed-context launcher helper | No dev-only query override | ✓ EXISTS + VERIFIED | `gotoInstalledContextMode()` in `launcher.ts` uses browser signals. |
| Install-context unit coverage | Non-dev installed-boundary semantics | ✓ EXISTS + VERIFIED | `createAppContext.test.ts` covers non-dev display-mode and legacy standalone. |
| Installed-boundary browser spec | Browser vs installed-context proof | ✓ EXISTS + VERIFIED | `tests/e2e/installed-boundary.spec.ts` exists and passes. |
| Migrated shell-flow and Calculator specs | Reused new boundary harness | ✓ EXISTS + VERIFIED | `shell-flow.spec.ts` and `calculator.spec.ts` pass on the new helper path. |
| Manual installed-boundary artifact | Literal Home Screen confirmation checklist | ✓ EXISTS + PENDING HUMAN RUN | `07-UAT.md` exists but is not yet completed. |

**Artifacts:** 5/6 verified, 1 pending human confirmation

## Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| `INST-02`: User can launch the installed web app from the iPhone Home Screen and enter the experience in standalone app mode. | ⚠ PARTIAL RE-VERIFICATION | Production-like browser proof is green, but literal Home Screen installed-launch confirmation still needs the manual UAT run. |
| `QUAL-01`: Automated browser UI tests verify the main shell flow: onboarding/browser mode, home-screen render, implemented app launch, implemented app dismiss, and placeholder app launch. | ✓ SATISFIED | - |
| `QUAL-02`: Automated browser UI tests verify the main Calculator happy-path interactions at a basic level. | ✓ SATISFIED | - |

## Human Verification Required

Complete the checklist in [`07-UAT.md`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/07-real-installed-boundary-verification/07-UAT.md):

1. Open the app in Safari browser mode and confirm onboarding is shown.
2. Add the app to the Home Screen.
3. Launch it from the Home Screen rather than the browser tab.
4. Confirm installed launch enters the standalone intro and adaptive home screen.
5. Open Calculator and return home with the Home pill.
6. Record PASS / FAIL / BLOCKED and notes in `07-UAT.md`.

## Verification Metadata

**Automated checks passed:** `pnpm test`, `pnpm test:e2e --project=webkit-iphone`, `npx tsc --noEmit`, `pnpm build`  
**Remaining work:** literal Home Screen installed-web-app confirmation  
**Verifier judgment:** the code and automated proof are ready; phase closeout depends on the pending manual UAT result

---
*Verified: 2026-04-05T01:37:05Z*  
*Verifier: Codex orchestrator*
