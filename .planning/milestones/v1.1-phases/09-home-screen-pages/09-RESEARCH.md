# Phase 9: Home Screen Pages - Research

**Researched:** 2026-04-06  
**Domain:** multi-page home-screen behavior, page-return semantics, and page-aware launcher/runtime state  
**Confidence:** HIGH

<current_state>
## Current State

- The current home screen is a single-page grid plus dock.
- `appRegistry.ts` only distinguishes `grid` vs `dock` placement; there is no page placement concept.
- `homeScreenRuntime.ts` and `homeNavigationMotion.ts` model only home/opening/open-app/closing app state and do not track a home page index.
- `AdaptiveShellFoundation.tsx` renders one `HomeScreenGrid` from `getHomeScreenIcons(appRegistry)` with no page container or page indicators.
- Existing shell/browser tests cover onboarding and app open/close, but not page navigation.
</current_state>

<research_summary>
## Summary

Phase 9 should introduce multi-page home screens by extending the shared runtime/app model rather than layering pages in CSS only. The correct architecture is:

1. make app metadata page-aware
2. make the home/runtime state page-aware
3. render a paged home-screen container with indicators
4. ensure app launch captures the active home page so returning home lands back on that page

The dock should remain global/non-paged. Page behavior belongs to the grid/launcher surface only.

**Primary recommendation:** add an explicit `page` concept to grid apps in the runtime model, introduce a page-aware home-state model that preserves `activePage` through app open/close, render the home grid through a paged container with page indicators, and add a focused browser-level shell test that proves “launch from page 2 → return home to page 2.”
</research_summary>

<recommended_approach>
## Recommended Approach

### 1. Page-aware runtime/app model

Add explicit page placement for grid apps. Keep dock apps outside page indexing.

Why:
- avoids treating pagination as presentation-only
- lets future app phases place new apps intentionally
- keeps return-home semantics grounded in runtime state

### 2. Page-aware home state

Extend the “home” side of launcher state with an `activePage` field and persist that field through:
- idle home state
- opening state
- open-app state
- closing state

Why:
- returning home to the same page is a runtime requirement, not merely an animation detail

### 3. Paged shell container

Render grid apps in a paged container:
- one page at a time in the visible viewport
- page indicators below/near the grid
- dock remains fixed/global

Navigation can be phase-appropriate:
- swipe/drag or paged scrolling for authenticity
- indicator tap or programmatic change where helpful

For this phase, the important outcome is believable page navigation, not full edit-mode/folder behavior.

### 4. Narrow verification

Add focused verification for:
- page partitioning from the registry
- active page changes
- launch from non-default page
- return-home to same page

This can include unit coverage for runtime selectors/state and a narrow Playwright shell-flow extension for page return semantics.
</recommended_approach>

<pitfalls>
## Pitfalls

### Pitfall 1: pages implemented only in CSS
If page state does not live in runtime/navigation state, returning home to the same page will be fragile or impossible.

### Pitfall 2: dock accidentally paged
The dock should remain fixed and global; only the grid pages should paginate.

### Pitfall 3: page count inferred from layout side effects
Page partitioning should come from explicit metadata/selectors, not from “whatever overflows the grid.”

### Pitfall 4: opening an app loses page origin
If the app-open path does not remember the launching page, close-to-home will snap to page 1 or stale state.

### Pitfall 5: overbuilding gesture complexity
This phase should deliver believable page navigation, not the full complexity of folders, jiggle mode, drag-reorder, or widget surfaces.
</pitfalls>

<planning_implications>
## Planning Implications

### Recommended plan split

1. **Runtime/page foundations**
   - page-aware app model
   - page selectors
   - page-aware home state and tests

2. **Paged shell UI**
   - paged grid container
   - page indicators
   - dock remains fixed
   - active-page navigation behavior

3. **Focused verification/polish**
   - narrow shell/browser verification for page navigation and return-home semantics
   - only small stabilization fixes if needed

### Likely files

- `src/features/runtime/appRegistry.ts`
- `src/features/runtime/homeScreenRuntime.ts`
- `src/features/runtime/homeScreenRuntime.test.ts`
- `src/features/shell/data/homeScreenIcons.ts`
- `src/features/shell/AdaptiveShellFoundation.tsx`
- `src/features/shell/components/HomeScreenGrid.tsx`
- likely a new home-pages component or selector module
- `src/features/shell/layout/homeScreenLayout.css`
- `tests/e2e/shell-flow.spec.ts` or a narrow new home-pages spec
</planning_implications>

<sources>
## Sources

- [AdaptiveShellFoundation.tsx](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/shell/AdaptiveShellFoundation.tsx)
- [homeScreenRuntime.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/homeScreenRuntime.ts)
- [homeNavigationMotion.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/motion/homeNavigationMotion.ts)
- [appRegistry.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/appRegistry.ts)
- [homeScreenIcons.ts](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/shell/data/homeScreenIcons.ts)
- [v1.1 research summary](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/SUMMARY.md)
</sources>
