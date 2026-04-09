---
phase: 10-app-platform-primitives
plan: "01"
subsystem: platform
tags: [app-definitions, runtime-registry, platform, metadata, vitest]
requires: []
provides:
  - Shared built-in app-definition layer
  - Runtime registry backed by platform definitions
  - Focused tests for the app-definition primitive
affects: [settings-participation, storage-namespaces, future-app-phases]
tech-stack:
  added: []
  patterns: [internal app-definition primitive, registry-as-adapter, compatibility re-export]
key-files:
  created:
    - src/features/platform/appDefinitions.ts
    - src/features/platform/appDefinitions.test.ts
  modified:
    - src/features/runtime/appRegistry.ts
key-decisions:
  - "Kept the platform primitive internal-first and small by making `appRegistry` an adapter over shared built-in definitions rather than inventing a broad new framework."
  - "Re-exported the existing placement/availability/launch-surface types from `appRegistry` so current consumers stayed compatible while the new platform layer became the source of truth."
patterns-established:
  - "Built-in apps are now defined through a shared platform primitive before later phases add settings and storage metadata."
requirements-completed: [PLAT-01]
duration: 5min
completed: 2026-04-06
---

# Phase 10 Plan 01 Summary

**The app registry now sits on top of a shared internal app-definition layer instead of duplicating built-in app metadata inline**

## Accomplishments

- Added a shared `appDefinitions` module as the source of truth for built-in apps
- Refactored `appRegistry` into a runtime adapter over those shared definitions
- Added focused tests that lock the new definition layer without changing current launcher behavior
- Preserved existing imports by re-exporting the compatibility types from `appRegistry`

## Verification

- `pnpm test`
- `npx tsc --noEmit`
- `pnpm build`

## Notes

- The platform layer is now real in the shipped runtime path, but Phase 10 still stops short of settings UI, storage namespaces, or app-management surfaces.
