# Architecture Research: v1.2 Notes, Browser & Platform Growth

**Researched:** 2026-04-09

## Recommended Build Order

1. Expand Notes first.
   - It already has a local repository layer and a real app route.
   - Search and organization can build on existing note storage without reopening platform or install surfaces.

2. Expand Browser second.
   - It already has a typed destination model and truthful fallback path.
   - URL entry and broader browsing should extend that model rather than replace it.

3. Build app-submission foundations third.
   - App distribution should reuse the Phase 10 platform contract instead of inventing parallel metadata.

4. Build the first catalog surface fourth.
   - The catalog should consume the same submission metadata that contributor workflows produce.

5. Finish with integrated verification.
   - Notes search/organization, Browser navigation truthfulness, and platform/catalog flows need one final end-to-end lock.

## Integration Points

- Notes:
  - `notesModel.ts`
  - `notesStorage.ts`
  - `NotesApp.tsx`
- Browser:
  - `browserDestinations.ts`
  - `BrowserApp.tsx`
  - runtime selectors in `appRegistry.ts`
- Platform:
  - `appDefinitions.ts`
  - `appRegistry.ts`
  - future app-manifest/catalog modules under platform/runtime features

## Architectural Rules

- Keep Notes local-first in `v1.2`.
- Keep Browser honest: broader navigation is allowed, but blocked sites still need truthful fallback.
- Keep submission/catalog work metadata-driven and internal-contract-first before installation mechanics.
- Keep verification launcher-path-based where behavior touches real app flows.
