# Phase 15: Platform Usage Truthfulness Cleanup - Research

**Researched:** 2026-04-08
**Domain:** shared platform-metadata consumption across `Settings`, `Notes`, and `Browser`
**Confidence:** HIGH

<current_state>
## Current State

- Phase 10 introduced shared built-in app definitions, settings participation, and storage namespace metadata.
- Phase 11 made `Settings` consume shared runtime metadata, but the app-management surface currently renders both `browser-grid` and dock `browser` as separate rows.
- Phase 12 implemented `Notes`, but [`NotesApp.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/notes/NotesApp.tsx) still reconstructs its storage namespace from a hardcoded app id instead of reading shared runtime metadata.
- Phase 13 implemented `Browser`, but [`BrowserApp.tsx`](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/browser/BrowserApp.tsx) is driven only by destination metadata and does not visibly consume its broader shared app definition.
- The `v1.1` audit therefore marked `PLAT-03` as partial in [.planning/v1.1-v1.1-MILESTONE-AUDIT.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/v1.1-v1.1-MILESTONE-AUDIT.md).
</current_state>

<research_summary>
## Summary

Phase 15 should not add new product breadth. It should close the truthfulness gap between what the platform layer claims to provide and what the milestone apps actually consume in app-side code.

The safest cleanup path is:

1. introduce one narrow runtime-level way to resolve canonical app metadata for app-side consumers
2. move `Notes` off its hardcoded storage namespace path onto that shared metadata
3. make `Browser` consume the same shared metadata layer in app code
4. make `Settings` use a deduped app-management selector so Browser appears once as one managed app, not twice as two launcher entries
5. tighten browser verification around fallback -> embedded switching while touching the same surface

**Primary recommendation:** add canonical runtime selectors keyed by the shared launch-surface/platform identity, then refactor `Notes`, `Browser`, and `Settings` to consume those selectors directly. This closes `PLAT-03` at the root instead of trying to paper over the audit gap with more tests alone.
</research_summary>

<platform_truth>
## Platform Truth

### Duplicate launcher entries are not the same as duplicate managed apps

`browser-grid` and dock `browser` are two launcher placements for one implemented Browser experience. The platform layer needs a canonical way to talk about that shared app identity when the question is app-side metadata consumption or settings management, not launcher placement.

Planning implication:
- do not remove the dual launcher entries
- do add a selector that can collapse them into one canonical managed-app view when appropriate

### App-side code should not reconstruct metadata the platform already owns

`NotesApp` currently calls `createAppStorageNamespace("notes")`, which duplicates information already declared in the shared app definition.

Planning implication:
- `Notes` should read its storage namespace through the runtime/platform layer
- future apps should have a clear pattern to follow instead of copying the same hardcoded namespace reconstruction

### Browser needs visible platform consumption, not just destination metadata

The destination registry is valid app-specific metadata, but it is not enough to prove that `Browser` itself consumes the shared platform layer. The Browser app should read at least its canonical app definition or derived runtime metadata in app-side code.

Planning implication:
- `BrowserApp` should resolve its shared app metadata through the runtime layer
- any small persisted or displayed app identity details should flow from that metadata rather than from ad hoc constants
</platform_truth>

<recommended_approach>
## Recommended Approach

### 1. Add canonical runtime selectors first

Create selectors that answer questions like:
- which runtime app definition is canonical for a launch surface
- which settings-managed apps should appear once per shared app experience
- how app-side code can resolve its storage namespace without hardcoding a launcher entry id

Why:
- it gives `Notes`, `Browser`, and `Settings` one shared consumption path
- it keeps the dedupe logic in the runtime/platform layer instead of scattering it through app components

### 2. Move Notes to platform-owned storage metadata

Refactor `NotesApp` so it resolves its namespace through the shared runtime metadata rather than recreating `openos.apps.notes` locally.

Why:
- directly closes the clearest audit finding
- proves the platform storage metadata is not just passive documentation

### 3. Make Browser consume canonical app metadata in app-side code

Refactor `BrowserApp` so it reads its app definition through the runtime layer and uses that metadata in a meaningful way inside the app surface.

Good examples:
- app identity or label
- storage namespace for small Browser-owned state
- a canonical Browser definition shared across grid/dock launch entry variants

Avoid:
- pretending destination metadata alone is enough to satisfy `PLAT-03`
- collapsing grid/dock entries in the launcher itself

### 4. Deduplicate Settings through a runtime selector

`Settings` should render one Browser management row backed by shared metadata, not two rows caused by launcher-placement duplication.

Why:
- fixes the adjacent audit debt while touching the same selector layer
- reinforces that managed-app views should be derived from canonical shared app identity, not raw launcher entries

### 5. Re-verify with browser-level evidence

Close the phase with targeted Playwright coverage that proves:
- Browser can switch from embedded -> fallback -> embedded again
- Settings shows one Browser management row
- the full repo verification set still passes
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: solving the audit gap with tests only

More tests alone would repeat the Phase 14 mistake. The plan needs real app-side adoption changes first.

### Pitfall 2: hardcoding Browser dedupe inside Settings

Filtering out one Browser row in `SettingsApp.tsx` would hide the symptom without creating a reusable runtime/platform truth.

### Pitfall 3: collapsing launcher placements into one app definition

The launcher still needs both Browser entries. The cleanup should add canonical managed-app selectors, not remove placement fidelity.

### Pitfall 4: broadening into new Browser or Notes features

This phase is a truthfulness cleanup, not a feature phase. Any persistence or UI additions should exist only if they directly support shared metadata consumption.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **Canonical selector foundation + Notes adoption**
   - runtime selector(s) for canonical app identity
   - Notes namespace wiring through shared metadata
   - focused regression coverage for the selector path

2. **Browser + Settings metadata adoption**
   - Browser app-side metadata consumption
   - deduped Settings managed-app selector/view
   - no launcher-placement regression

3. **Gap-closure verification**
   - Browser fallback -> embedded switching
   - Settings single Browser row
   - full repo verification pass for re-audit readiness

### Likely files

- `src/features/runtime/appRegistry.ts`
- `src/features/runtime/appRegistry.test.ts`
- `src/features/apps/notes/NotesApp.tsx`
- `src/features/apps/browser/BrowserApp.tsx`
- `src/features/apps/settings/SettingsApp.tsx`
- `tests/e2e/browser-app.spec.ts`
- `tests/e2e/settings.spec.ts`
</planning_implications>

<sources>
## Sources

- [.planning/ROADMAP.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/ROADMAP.md)
- [.planning/REQUIREMENTS.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/REQUIREMENTS.md)
- [.planning/STATE.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/STATE.md)
- [.planning/v1.1-v1.1-MILESTONE-AUDIT.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/v1.1-v1.1-MILESTONE-AUDIT.md)
- [appDefinitions.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/platform/appDefinitions.ts)
- [appRegistry.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts)
- [SettingsApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/settings/SettingsApp.tsx)
- [NotesApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/notes/NotesApp.tsx)
- [BrowserApp.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/browser/BrowserApp.tsx)
- [browser-app.spec.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/browser-app.spec.ts)
- [settings.spec.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/tests/e2e/settings.spec.ts)
</sources>
