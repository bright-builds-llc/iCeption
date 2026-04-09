# Phase 14: Verification and App Integration - Research

**Researched:** 2026-04-07  
**Domain:** cross-app integration proof, final milestone verification, and platform-usage lock-in  
**Confidence:** HIGH

<current_state>
## Current State

- Phase 9 delivered page-aware launcher state and paged home-shell UI.
- Phase 10 delivered shared app definitions, settings participation, and storage namespace primitives.
- Phase 11 delivered `Settings` with a real shared preference store and app-management surface.
- Phase 12 delivered `Notes` with repository-backed local persistence and no-sync messaging.
- Phase 13 delivered a managed-iframe `Browser` with curated destinations and explicit external fallback.
- Each app has focused verification, but the milestone still needs a final proof that:
  - the platform primitives are actually used across all three apps
  - multi-page launch/return behavior works for all implemented apps
  - Notes and Browser milestone-specific behaviors remain intact in the integrated product
</current_state>

<research_summary>
## Summary

Phase 14 should be an integration-and-verification phase, not a new feature phase. The core work is:

1. make the shared platform usage explicit and testable across `Settings`, `Notes`, and `Browser`
2. add browser-level cross-app scenarios that cover launch/return from the correct home page for all three apps
3. run the final narrow regression suite for the milestone and fix only small integration issues exposed by that suite

The highest-signal evidence for `PLAT-03` is not more abstraction. It is proof that:
- `Settings` consumes settings-participation metadata for app management
- `Notes` consumes the storage namespace convention for local persistence
- `Browser` consumes the same shared app-definition/platform layer while remaining truthful about destination modes

**Primary recommendation:** keep this phase mostly test- and contract-driven. Add only the small code changes needed to expose/assert shared platform usage, then write one focused integration Playwright suite that exercises `Settings`, `Notes`, and `Browser` from the real paged launcher, including return-home page restoration and app-specific milestone behaviors.
</research_summary>

<recommended_approach>
## Recommended Approach

### 1. Lock platform usage with focused integration assertions

Use unit/integration-level checks to prove the platform layer is real:
- implemented-app set includes all milestone apps
- settings-visible app management includes the intended apps
- storage namespaces exist where expected
- Browser definitions explicitly express embedded vs fallback behavior through typed metadata

### 2. Add a multi-app launcher integration suite

Use Playwright to prove:
- navigate to the right home-screen page
- open `Settings`, `Notes`, and `Browser`
- return home to the same page
- key app-specific milestone behaviors still work

This is the clearest proof of `QUAL-03`.

### 3. Reuse existing focused tests for app-specific behaviors

Do not replace the dedicated Notes or Browser tests.
Instead:
- keep them
- add a thin integration layer above them
- run the whole final suite together

This is the clearest proof of `QUAL-04`.
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: broadening Phase 14 into more feature work
If this phase starts adding app features, it will stop being an integration lock phase and become a stealth scope expansion.

### Pitfall 2: duplicating all app tests instead of adding integration tests
This will make the suite noisy without increasing confidence much.

### Pitfall 3: proving platform usage only by code inspection
The phase should leave executable evidence, not just plausible architecture.

### Pitfall 4: under-testing page-return behavior across all three apps
The milestone requires the new page-aware launcher to work beyond one demo app.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **Platform-usage contract lock**
   - tighten selectors/contracts/assertions around shared platform usage
   - add any small missing integration helpers/tests

2. **Cross-app launcher integration suite**
   - multi-page launch/return for `Settings`, `Notes`, and `Browser`
   - keep browser assertions behavior-focused

3. **Final milestone verification lock**
   - run baseline plus focused app/browser suites together
   - fix only narrow integration issues exposed by the final run

### Likely files

- `src/features/platform/appDefinitions.ts`
- `src/features/platform/appDefinitions.test.ts`
- `src/features/runtime/appRegistry.ts`
- `src/features/runtime/appRegistry.test.ts`
- `tests/e2e/fixtures/launcher.ts`
- new integration-focused Playwright spec(s)
- possibly small app-surface test id additions if needed for stable assertions
</planning_implications>

<sources>
## Sources

- [appDefinitions.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appDefinitions.ts)
- [appRegistry.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts)
- [SettingsApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/settings/SettingsApp.tsx)
- [NotesApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/notes/NotesApp.tsx)
- [BrowserApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/browser/BrowserApp.tsx)
- [home-pages.spec.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/home-pages.spec.ts)
- [settings.spec.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/settings.spec.ts)
- [notes.spec.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/notes.spec.ts)
- [browser-app.spec.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/browser-app.spec.ts)
</sources>
