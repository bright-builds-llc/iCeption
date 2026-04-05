---
phase: 08-preview-install-ux-parity-cleanup
plan: "01"
subsystem: browser-entry
tags: [preview, registry, browser-mode, parity, vitest]
requires: []
provides:
  - Shared browser-preview selector grounded in the runtime app registry
  - PreviewShell rendering from derived preview app data
  - Focused selector coverage to prevent preview/runtime drift
affects: [browser-install-flow, phase-verification]
tech-stack:
  added: []
  patterns: [thin preview selector, registry-derived preview inventory, curated browser-only projection]
key-files:
  created:
    - src/features/install/browser/browserPreviewApps.ts
    - src/features/install/browser/browserPreviewApps.test.ts
  modified:
    - src/features/install/browser/PreviewShell.tsx
    - src/features/install/browser/browserInstall.css
key-decisions:
  - "Kept preview mode derived from the runtime registry without importing launcher behavior or runtime state."
  - "Allowed the preview to stay curated by IDs rather than mirroring the full launcher grid."
patterns-established:
  - "Browser preview identity now comes from a thin selector over the runtime registry."
requirements-completed: [HOME-02, HOME-03, RUNT-01]
duration: 4min
completed: 2026-04-05
---

# Phase 8 Plan 01 Summary

**Browser preview inventory now derives from the runtime registry instead of hardcoded labels, while staying lighter-weight than the real launcher**

## Accomplishments

- Added a thin `browserPreviewApps` selector for curated grid and dock preview content
- Rewired `PreviewShell` to render from shared preview app data instead of inline label constants
- Added focused unit coverage so preview/runtime drift is caught through the selector contract

## Verification

- `pnpm test`
- `npx tsc --noEmit`
- `pnpm build`

## Notes

- The preview remains browser-specific and curated; this plan only changed identity provenance, not install CTA behavior.
