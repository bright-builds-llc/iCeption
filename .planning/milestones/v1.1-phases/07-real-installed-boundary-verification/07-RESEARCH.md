# Phase 7: Real Installed-Boundary Verification - Research

**Researched:** 2026-04-04  
**Domain:** installed-PWA boundary verification, Playwright/WebKit limits, and trustworthy standalone-entry proof  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from roadmap and milestone audit)

### Locked Decisions
- This phase exists to close the milestone audit blocker, not to broaden product scope.
- The blocker is specifically about proof of the installed/display-mode boundary, not about launcher/runtime behavior after entry.
- The product remains iPhone-first and Safari/WebKit-oriented.
- Phase 6 browser tests already cover the launcher/runtime path after standalone entry; the missing proof is the boundary itself.

### Scope Guardrails
- Do not reopen unrelated shell, Calculator, or motion work.
- Keep the fix verification-heavy and narrowly targeted at entry semantics.
- Optional browser-preview cleanup belongs to Phase 8, not here.
</user_constraints>

<research_summary>
## Summary

The current gap is real: the shipped app detects standalone mode from browser signals, but the Playwright suite reaches that branch through the dev-only `openos-install-context=standalone` override in [`createAppContext.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/app/bootstrap/createAppContext.ts), while [`playwright.config.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/playwright.config.ts) serves the app in dev mode. That means the suite proves the launcher/runtime path after standalone entry, but not the installed/display-mode boundary that a real installed web app uses.

The key technical constraint is that Playwright WebKit does not provide a first-class “install this PWA and launch it as an installed app” workflow for iPhone-style standalone mode in this repo’s current setup. The most trustworthy practical substitute is:

1. run the app in a production-like runtime instead of `pnpm dev`
2. remove the dev-only query override from the end-to-end harness
3. enter standalone through the same shipped detection path the app uses in production, by controlling browser APIs at context-init time rather than through app-specific dev parameters
4. clearly distinguish what is automated proof versus what still requires manual real-device validation, if any

That means Phase 7 should not attempt full native-style iPhone install automation first. It should instead create a production-mode installed-context verification harness that exercises `detectInstallContext()` through `display-mode`/legacy standalone signals, prove browser mode still stays in onboarding, and then re-run the existing shell/Calculator scenarios on top of that harness. If true install automation remains out of reach, the phase should add explicit manual verification evidence so the milestone audit no longer overclaims what the browser suite proves.

**Primary recommendation:** Replace the dev-only standalone query shortcut with a production-like installed-context Playwright harness that drives the shipped install-context detection path, then pair that with an explicit manual/acceptance verification artifact if needed to cover the last inch of true installed-PWA proof.
</research_summary>

<current_state>
## Current State

### What the app does today
- [`detectInstallContext.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/lib/platform/detectInstallContext.ts) chooses between:
  - `dev-override`
  - `display-mode`
  - `legacy-standalone`
  - `default-browser`
- [`createAppContext.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/app/bootstrap/createAppContext.ts) only honors the query-string override in dev builds.
- [`AppRoot.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/app/AppRoot.tsx) branches cleanly between:
  - browser onboarding via [`BrowserInstallFlow.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/browser/BrowserInstallFlow.tsx)
  - standalone shell entry via [`StandaloneEntry.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/install/standalone/StandaloneEntry.tsx)
- [`manifest.webmanifest`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/public/manifest.webmanifest) requests `display: "standalone"`, which only matters when the app is actually installed.

### What the Phase 6 test harness does today
- [`playwright.config.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/playwright.config.ts) launches `pnpm dev`.
- [`tests/e2e/fixtures/launcher.ts`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/fixtures/launcher.ts) enters standalone by navigating to `/?openos-install-context=standalone`.
- The shell and Calculator specs therefore prove the open-app/runtime path, but the standalone entry source is `dev-override`, not `display-mode` or `legacy-standalone`.
</current_state>

<technical_findings>
## Core Findings

### Finding 1: the audit gap is about entry semantics, not downstream shell behavior
The launcher, Home pill, placeholder apps, and Calculator are already browser-verified after entry. Phase 7 only needs to replace the way tests enter standalone and tighten the proof around the boundary.

### Finding 2: manifest `display: standalone` does not make normal browser tabs behave standalone
MDN documents that manifest display modes only apply when the app is installed. A normal browser page load cannot prove installed behavior just by serving the manifest.

### Finding 3: Playwright provides strong browser automation, but not turnkey iPhone PWA install automation for this repo
Playwright can:
- launch isolated/persistent browser contexts
- serve dev or preview builds
- mock browser APIs early with `addInitScript`

Playwright does not, in this repo’s current setup, provide a straightforward official path to “install this web app to an iPhone home screen and relaunch it as an installed standalone web app” under WebKit emulation.

### Finding 4: a production-like installed-context harness is meaningfully stronger than the current dev override
If the suite runs against a preview/production build and enters standalone by manipulating browser signals before app bootstrap, then:
- `isDev` becomes false
- the app cannot rely on the query override
- `detectInstallContext()` is exercised through the shipped detection path
- tests can assert `data-install-source="display-mode"` or `legacy-standalone"` instead of `dev-override`

That does not equal literal real-device install automation, but it is a much more truthful proof boundary than the current setup.
</technical_findings>

<recommended_approach>
## Recommended Approach

### Recommended Phase Shape

**Plan A: Production-like installed-context harness**
- Move Playwright from `pnpm dev` to a production-like server path such as `pnpm preview` after build or another static preview route.
- Introduce a test harness that sets standalone browser signals before the app bootstraps, using browser-level mocking/init-script patterns rather than app-specific query params.
- Keep browser-mode coverage untouched as the control path.

**Plan B: Boundary-focused scenario rewrite**
- Replace `gotoStandaloneMode()` so it no longer uses the query override.
- Add explicit assertions around `data-install-context` and `data-install-source` to prove:
  - browser mode -> `browser` / onboarding
  - installed-context harness -> `standalone` / shipped signal source
- Re-run the existing shell-flow and Calculator scenarios on the new harness.

**Plan C: Truthful verification evidence**
- If full literal installed-PWA automation is still not feasible, add a narrow manual verification artifact or explicit verification note that records real-device/install confirmation separately from Playwright.
- The phase should make the milestone audit honest: no more implying the browser suite proved something it did not.
</recommended_approach>

<alternatives>
## Alternatives Considered

### 1. Keep the current dev-only query override
Rejected. This is the exact audit gap.

### 2. Try to automate true iPhone Home Screen install first
Rejected as the default plan. High friction, higher flake risk, and not obviously supported as a first-class Playwright/WebKit path in this repo.

### 3. Mock app internals instead of browser signals
Rejected. That would only move the fake boundary around and would still fail the audit’s intent.

### 4. Change the audit to accept the current suite
Rejected. The audit is correct that the current suite overstates what it proves.
</alternatives>

<pitfalls>
## Pitfalls

### Pitfall 1: replacing the dev override with a different app-specific test hook
If the new harness still depends on app-only branching, the phase will not materially close the audit gap.

### Pitfall 2: using production preview without changing the standalone entry signal
Switching to `pnpm preview` alone does not solve the problem; a normal browser tab will still not become standalone.

### Pitfall 3: rewriting too much of Phase 6
This phase should preserve the existing shell/Calculator specs wherever possible and only replace the entry harness and related assertions.

### Pitfall 4: claiming “real installed” proof when the harness is still simulated
If the final implementation uses browser API mocking, the verification docs must say so clearly and, if needed, pair it with manual real-device evidence.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended number of plans
**2 or 3 plans**, sequential:

1. **Installed-context harness**  
   Production-like server, standalone browser-signal harness, and supporting tests around install-context detection.

2. **Boundary-driven browser verification**  
   Rewrite/extend Phase 6 shell-flow and Calculator helpers/specs to use the new harness and assert the shipped source path.

3. **Verification evidence closeout**  
   Re-run the narrow suite, update verification/audit evidence, and add manual evidence if true install automation remains outside Playwright’s reach.

### Files likely involved
- `playwright.config.ts`
- `tests/e2e/fixtures/launcher.ts`
- `tests/e2e/shell-flow.spec.ts`
- `tests/e2e/calculator.spec.ts`
- possibly a new Playwright/global setup/helper file for standalone signal injection
- `src/app/bootstrap/createAppContext.test.ts`
- Phase 7 planning/verification docs

### Verification bar
At minimum the phase should end with:
- `pnpm test`
- `pnpm test:e2e --project=webkit-iphone`
- `npx tsc --noEmit`
- `pnpm build`

And the verification report must explicitly state whether the installed boundary is:
- automated via a production-like browser-signal harness
- manually confirmed on a true installed web app path
- or both
</planning_implications>

<sources>
## Sources

### Primary repo sources
- [App bootstrap and context creation](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/App.tsx)
- [Install-context bootstrap adapter](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/app/bootstrap/createAppContext.ts)
- [Install-context core detection](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/lib/platform/detectInstallContext.ts)
- [Manifest](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/public/manifest.webmanifest)
- [Current Playwright config](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/playwright.config.ts)
- [Current launcher fixture](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/fixtures/launcher.ts)
- [Phase 6 research](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/06-verification-and-launch-polish/06-RESEARCH.md)
- [Milestone audit](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/v1-v1-MILESTONE-AUDIT.md)

### External primary sources
- [Playwright BrowserType.launchPersistentContext docs](https://playwright.dev/docs/api/class-browsertype)
- [Playwright webServer docs](https://playwright.dev/docs/test-webserver)
- [Playwright mock browser APIs docs](https://playwright.dev/docs/next/mock-browser-apis)
- [MDN: Create a standalone app](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app)
</sources>
