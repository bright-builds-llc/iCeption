---
phase: 03-home-screen-runtime
plan: "03"
subsystem: ui
tags: [launcher, calculator, app-icons, pressed-state, runtime]
requires:
  - phase: 03-01
    provides: registry and launcher runtime
provides:
  - Shared launchable icon-button interaction path
  - Calculator-specific implemented app surface
  - Runtime-backed opening for every visible icon
affects: [motion-phase, calculator-fidelity]
tech-stack:
  added: []
  patterns: [shared icon-button interaction, implemented-vs-placeholder app branching, startTransition-backed launch open]
key-files:
  created:
    - src/features/apps/calculator/CalculatorApp.tsx
    - src/features/shell/components/AppIconButton.tsx
  modified:
    - src/features/runtime/AppSurface.tsx
    - src/features/runtime/runtimeShell.css
    - src/features/shell/components/HomeScreenGrid.tsx
    - src/features/shell/components/Dock.tsx
    - src/features/shell/layout/homeScreenLayout.css
    - src/features/shell/AdaptiveShellFoundation.tsx
key-decisions:
  - "Calculator uses the shared app-surface path instead of bypassing the runtime."
  - "Pressed-state interaction is brief and local, with immediate runtime open behavior and no motion orchestration."
patterns-established:
  - "Every visible icon launches through one shared icon-button path."
  - "Implemented and placeholder apps share the same shell wrapper but diverge in content."
requirements-completed: [HOME-03, HOME-04, RUNT-02]
duration: 2min
completed: 2026-04-04
---

# Phase 3: Home Screen Runtime Summary

**Every visible icon now launches through one runtime path, with Calculator as the only implemented app and all other apps routed to shell-native placeholders**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-03T20:45:39-05:00
- **Completed:** 2026-04-04T01:45:46Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- Added a shared icon-button interaction path with brief pressed feedback
- Added a distinct Calculator app surface so the implemented app path is not the same as `Coming Soon`
- Made every visible icon launch through the runtime instead of leaving dead taps in the shell

## Task Commits

The three launcher-interaction tasks were completed in the same combined Wave 2 runtime commit because they shared the same app-surface and shell-routing files:

1. **Task 1: Create a shared launchable icon-button component** - `7151966` (feat)
2. **Task 2: Add the implemented Calculator app path** - `7151966` (feat)
3. **Task 3: Wire all visible icons into runtime-backed app opening** - `7151966` (feat)

## Files Created/Modified
- `src/features/apps/calculator/CalculatorApp.tsx` - first implemented app surface for the runtime
- `src/features/shell/components/AppIconButton.tsx` - shared shell icon interaction component
- `src/features/shell/AdaptiveShellFoundation.tsx` - runtime branch now chooses between home shell, placeholder surface, and implemented Calculator surface

## Decisions Made
- Kept the pressed-state interaction short and local, without borrowing from the motion phase
- Used the same app-surface wrapper for Calculator and placeholder apps so the runtime shape stays consistent

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Auto-grouped tightly coupled work] Combined the three launcher-interaction tasks into the same runtime commit as Plan 03-02**
- **Found during:** Wave 2 execution
- **Issue:** The placeholder-surface work and the launchable-icon/Calculator path shared the same `AdaptiveShellFoundation`, `AppSurface`, and shell component files
- **Fix:** Executed the overlapping runtime work together in one cohesive launcher commit
- **Files modified:** `src/features/apps/calculator/CalculatorApp.tsx`, `src/features/shell/components/AppIconButton.tsx`, `src/features/runtime/AppSurface.tsx`, `src/features/runtime/runtimeShell.css`, `src/features/shell/components/HomeScreenGrid.tsx`, `src/features/shell/components/Dock.tsx`, `src/features/shell/layout/homeScreenLayout.css`, `src/features/shell/AdaptiveShellFoundation.tsx`
- **Verification:** `npx tsc --noEmit`, `pnpm build`, and `pnpm test` all passed after the combined runtime pass
- **Committed in:** `7151966`

---

**Total deviations:** 1 auto-fixed (wave-2 launcher work grouped intentionally)
**Impact on plan:** No scope change; grouping avoided splitting one shared runtime boundary across artificial commits.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 4 can now focus purely on motion and Home-button behavior because the launcher and app-surface boundaries already exist
- Phase 5 can deepen Calculator fidelity on top of a real implemented app path instead of introducing the runtime for the first time

---
*Phase: 03-home-screen-runtime*
*Completed: 2026-04-04*
