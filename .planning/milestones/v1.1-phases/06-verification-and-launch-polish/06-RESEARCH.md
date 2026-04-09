# Phase 6: Verification and Launch Polish - Research

**Researched:** 2026-04-04
**Domain:** browser-level shell verification, Playwright test infrastructure, and final launch-path polish
**Confidence:** HIGH

<user_constraints>
## User Constraints (from project and roadmap context)

### Locked Decisions
- Browser UI tests are part of the product quality bar.
- The main shell flow must be covered: onboarding/browser mode, home-screen render, implemented app launch, implemented app dismiss, and placeholder app launch.
- Calculator needs at least a basic happy-path browser test.
- The project is iPhone-first, so verification should prioritize the Safari/WebKit-like path while remaining practical for local development.

### Claude's Discretion
- Exact split between Playwright projects (for example, WebKit primary and any secondary smoke project).
- Exact test-file structure and fixture/helper organization.
- Exact stable selector strategy as long as the tests remain readable and resilient.
- Exact launch-polish fixes discovered while making tests reliable.

### Deferred Ideas (OUT OF SCOPE)
- Broad cross-browser matrix expansion beyond what materially helps V1.
- Large visual snapshot systems unless they are clearly needed.
- Deep end-to-end install/PWA automation that requires real platform installation flows beyond what current tooling can reliably simulate.
</user_constraints>

<research_summary>
## Summary

Phase 6 should introduce Playwright as the browser-level verification layer, with WebKit configured as the primary project because the product is explicitly iPhone/Safari-first. The most practical strategy is to test two launcher contexts: normal browser mode for onboarding and a deterministic standalone-mode simulation using the existing `openos-install-context=standalone` override. That gives the test suite a stable way to verify the “installed” path without depending on true iPhone web-app installation automation, which is not the right fit for this repo’s current local workflow.

The tests should stay high-signal and scenario-based rather than sprawling. One infrastructure/setup plan should add Playwright, config, stable selectors, and a reusable launcher fixture. Then one plan can cover the shell flow end to end, while another covers the Calculator path and any polish fixes that surface while making those tests reliable. This keeps the phase aligned with its roadmap goal: prove the core flow and clean up the rough edges that block trustworthy regression coverage.

**Primary recommendation:** Add `@playwright/test@1.59.1`, create a WebKit-first Playwright config with a mobile device profile, use browser mode plus the existing standalone override as the two verification contexts, and keep the test suite focused on the exact V1 launcher and Calculator journeys.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@playwright/test` | 1.59.1 | Browser-level regression coverage for shell and Calculator flows | Official Playwright test runner with WebKit support and mobile device emulation. |
| Existing React/Vite app | Current repo code | App under test | No new app framework is needed for this phase. |
| Existing Vitest suite | 4.1.2 | Unit-level confidence remains alongside browser tests | Playwright complements the current unit tests rather than replacing them. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| WebKit project/device emulation | Playwright built-in | Safari-like launcher verification | Use as the primary browser project. |
| Existing dev-only standalone override | Current repo code | Deterministic installed-path simulation | Use in tests for “installed app” behavior without real install automation. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright WebKit-first coverage | Chromium-only smoke coverage | Faster, but weaker fit for an iPhone/Safari-first product. |
| Standalone override for installed-mode verification | True local install/PWA automation | More “real,” but harder to make deterministic and not necessary for this repo’s current phase goals. |
| Narrow scenario tests | Large screenshot-heavy snapshot suite | Snapshots may help later, but this phase is more about functional launcher confidence than pixel baselines. |

**Installation:**
```bash
pnpm add -D @playwright/test@1.59.1
pnpm exec playwright install webkit
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
tests/
├── e2e/
│   ├── fixtures/
│   │   └── launcher.ts
│   ├── shell-flow.spec.ts
│   └── calculator.spec.ts
playwright.config.ts
```

### Pattern 1: Stable selector contract
**What:** Add explicit data attributes or other stable hooks for launcher icons, app surfaces, and key runtime controls.
**When to use:** Before writing browser tests, so shell markup changes do not constantly break tests.
**Example:**
```tsx
<button data-testid={`app-icon:${app.id}`} />
```

### Pattern 2: Context-specific launcher helpers
**What:** Centralize “browser mode” vs “standalone override” launch setup in reusable Playwright fixtures/helpers.
**When to use:** For all shell and Calculator browser tests.
**Example:**
```typescript
await page.goto("/?openos-install-context=standalone");
```

### Pattern 3: Scenario-based browser tests
**What:** Write a few complete user-path tests rather than many tiny implementation-detail tests.
**When to use:** For onboarding flow, placeholder launch, Calculator open/close, and Calculator input happy paths.
**Example:**
```typescript
test("launches calculator and returns home", async ({ page }) => { ... });
```

### Anti-Patterns to Avoid
- **Selector strategy based only on text content:** the shell uses lots of repeated labels and visual chrome.
- **Attempting true iPhone install automation first:** unnecessary flake and platform friction for this repo phase.
- **Huge cross-browser matrix before the suite is stable:** the phase goal is confidence, not maximum browser count.
- **Browser tests that duplicate unit coverage exactly:** Playwright should verify real launcher journeys, not reducer internals.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Browser automation harness | Custom Puppeteer or ad hoc scripts | Playwright test runner | Official support, WebKit project support, and built-in assertions. |
| Installed-mode test simulation | Complex fake browser state mocking | Existing `openos-install-context=standalone` override | The project already has the right deterministic hook. |
| Test retries/waits written manually everywhere | `setTimeout`-driven waits | Playwright locators/assertions and event-driven expectations | More resilient and less flaky. |

**Key insight:** The fastest path to trustworthy regression coverage is stable selectors plus a few end-to-end launcher scenarios, not a bespoke automation framework.
</dont_hand-roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Browser tests depend on unstable shell structure
**What goes wrong:** Small layout refactors constantly break the tests.
**Why it happens:** Tests use brittle CSS selectors or incidental text matching.
**How to avoid:** Add an explicit selector contract for app icons, app surfaces, Home pill, and Calculator keys.
**Warning signs:** Tests locate elements via long CSS chains or ambiguous text matches.

### Pitfall 2: Installed-path coverage is missing or flaky
**What goes wrong:** The suite only verifies browser onboarding or only verifies the standalone path intermittently.
**Why it happens:** The tests try to rely on real install behavior instead of the repo’s deterministic override.
**How to avoid:** Use browser mode and standalone override as the two stable contexts.
**Warning signs:** Tests require manual install steps or device-specific setup.

### Pitfall 3: Playwright tests are too broad for this phase
**What goes wrong:** The suite becomes slow and hard to trust before it proves the core flow.
**Why it happens:** Too many scenarios are added at once.
**How to avoid:** Focus on the exact roadmap requirements: onboarding/browser shell, placeholder app launch, Calculator launch/dismiss, Calculator happy path.
**Warning signs:** Lots of tests exist, but the core launcher journey is still hard to diagnose.

### Pitfall 4: Polishing happens outside the test-driven flow
**What goes wrong:** Final rough edges are “known” but not tied to repeatable verification.
**Why it happens:** Visual/runtime fixes are made ad hoc after the tests are written.
**How to avoid:** Let the browser scenarios drive the small polish fixes required for reliability and user-visible correctness.
**Warning signs:** Tests pass, but the live experience still feels obviously rough in the covered scenarios.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### WebKit device project
```typescript
projects: [{ name: "webkit-iphone", use: { ...devices["iPhone 13"] } }]
```

### Stable locator
```typescript
await page.getByTestId("app-icon:calculator").click();
```

### Standalone-path launch
```typescript
await page.goto("/?openos-install-context=standalone");
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| WebKit/Safari coverage often treated as secondary | WebKit can be a first-class Playwright project for mobile web verification | Current Playwright practice | Fits this repo’s iPhone-first target. |
| UI regression left to manual smoke checks | Add a focused browser scenario suite once the first real app exists | Current product-quality practice | This phase is the right point to lock launcher confidence. |
| E2E tests written around implementation details | Use user-path and stable locator-driven scenarios | Current Playwright guidance | Better resilience as the shell continues evolving. |

**New tools/patterns to consider:**
- Playwright device emulation for a WebKit iPhone profile
- Built-in tracing/screenshots for failure diagnosis if the first suite needs debugging

**Deprecated/outdated:**
- Ad hoc shell verification via manual clicks only
- Browser-automation plans that ignore the primary target engine
</sota_updates>

<open_questions>
## Open Questions

1. **Should a secondary Chromium smoke project land in this phase?**
   - What we know: the product is iPhone/Safari-first, but the browser onboarding path also matters in Chrome-like engines.
   - What's unclear: whether the phase should include multi-engine smoke coverage or stay tightly WebKit-focused.
   - Recommendation: make WebKit the required project, and only add a Chromium smoke project if it comes nearly free once selectors and helpers exist.

2. **Should the first browser tests assert visual polish via screenshots?**
   - What we know: final quality passes matter, but the current requirements are functional and scenario-based.
   - What's unclear: whether adding screenshot assertions now improves confidence or only adds churn.
   - Recommendation: avoid screenshot assertions in this phase unless a specific visual regression risk proves too hard to catch with functional checks.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Roadmap phase goal and requirements](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/ROADMAP.md) - locked phase objective and coverage requirements
- [Current runtime shell and motion path](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/shell/AdaptiveShellFoundation.tsx) - actual launcher surface under test
- [Playwright docs: test configuration](https://playwright.dev/docs/test-configuration) - project setup guidance
- [Playwright docs: emulation](https://playwright.dev/docs/emulation) - device/project guidance
- [Playwright docs: locators](https://playwright.dev/docs/locators) - selector best practices
- [Playwright docs: assertions](https://playwright.dev/docs/test-assertions) - resilient assertion patterns

### Secondary (MEDIUM confidence)
- [Current package/tooling state](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/package.json) - current test/build scripts
- [Phase 5 verification](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/05-calculator-app-fidelity/05-VERIFICATION.md) - current Calculator and shell readiness
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Playwright integration and browser-level launcher verification
- Ecosystem: WebKit device emulation, stable locators, launcher helpers
- Patterns: context fixtures, scenario-based tests, selector contracts
- Pitfalls: brittle selectors, flaky installed-path tests, oversized browser matrix

**Confidence breakdown:**
- Standard stack: HIGH - Playwright is the clear fit for this phase
- Architecture: HIGH - current shell/runtime path is ready for scenario-based tests
- Pitfalls: HIGH - driven by common browser automation failure modes
- Code examples: HIGH - directly aligned with official Playwright guidance

**Research date:** 2026-04-04
**Valid until:** 2026-05-04
</metadata>

---
*Phase: 06-verification-and-launch-polish*
*Research completed: 2026-04-04*
*Ready for planning: yes*
