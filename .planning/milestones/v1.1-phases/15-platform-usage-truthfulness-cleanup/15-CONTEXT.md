---
generated_by: gsd-discuss-phase
lifecycle_mode: interactive
phase_lifecycle_id: 15-2026-04-08T22-43-32Z
generated_at: 2026-04-08T22:43:32.271Z
---

# Phase 15: Platform Usage Truthfulness Cleanup - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning
**Mode:** Interactive

<domain>
## Phase Boundary

Close the remaining `v1.1` milestone truthfulness gap around shared platform-metadata usage. This phase covers canonical runtime selectors for shared app identity, app-side adoption in `Notes` and `Browser`, deduped Browser management rows in `Settings`, and the narrow verification needed to prove the cleanup. It does not add new app breadth, change launcher placement behavior, or reopen the broader `v1.1` feature scope.

</domain>

<decisions>
## Implementation Decisions

### Platform truthfulness
- **D-01:** Fix the real `PLAT-03` gap in app-side code, not by adding tests alone.
- **D-02:** Treat grid and dock Browser entries as launcher placements for one Browser experience when the question is managed-app identity.
- **D-03:** Keep the shared runtime/platform layer as the source of truth for canonical app identity, settings participation, and storage namespace metadata.

### Notes and Browser adoption
- **D-04:** `Notes` should resolve its storage namespace through shared runtime/platform metadata instead of hardcoding `createAppStorageNamespace("notes")`.
- **D-05:** `Browser` should visibly consume shared runtime/platform metadata in app code, not only destination metadata.
- **D-06:** Do not broaden the phase into new Notes persistence features or new Browser capabilities beyond what is needed to prove shared metadata consumption.

### Settings and verification
- **D-07:** `Settings` should show one Browser management row backed by canonical shared metadata, not duplicate rows for `browser-grid` and `browser`.
- **D-08:** Verification should prove Browser switching in both directions: embedded -> fallback -> embedded.

### the agent's Discretion
- Exact selector names and API shape for canonical shared app identity.
- Exact way Browser app metadata is surfaced inside the app as long as it is meaningfully driven by the shared runtime/platform layer.
- Exact verification assertions as long as they stay deterministic and tied to the real launcher/runtime path.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone scope and audit source of truth
- `.planning/ROADMAP.md` — Phase 15 goal, scope, and success criteria.
- `.planning/REQUIREMENTS.md` — `PLAT-03` traceability and milestone requirement status.
- `.planning/STATE.md` — current project focus and remaining blocker context.
- `.planning/v1.1-v1.1-MILESTONE-AUDIT.md` — exact gap statement and adjacent low-risk debt that this phase closes.

### Shared platform/runtime layer
- `src/features/platform/appDefinitions.ts` — built-in app definitions, launcher placement, settings participation, and storage metadata.
- `src/features/runtime/appRegistry.ts` — runtime selectors that should become the canonical app-side access path.
- `src/features/platform/appStorage.ts` — storage namespace conventions that `Notes` should consume via shared metadata.
- `src/features/platform/appSettings.ts` — settings participation rules that inform the deduped managed-app view.

### App surfaces touched by this phase
- `src/features/apps/notes/NotesApp.tsx` — current hardcoded Notes namespace path.
- `src/features/apps/browser/BrowserApp.tsx` — current Browser app path that needs visible runtime metadata consumption.
- `src/features/apps/settings/SettingsApp.tsx` — current duplicated Browser management rows.
- `tests/e2e/browser-app.spec.ts` — focused Browser verification to extend.
- `tests/e2e/settings.spec.ts` — Settings management surface verification.
- `tests/e2e/app-integration.spec.ts` — integrated launcher-path verification that must remain valid.

</canonical_refs>

<specifics>
## Specific Ideas

- The cleanup should make the platform layer obviously real from inside the milestone apps, not just from runtime tests.
- The deduped Browser row in `Settings` should come from a reusable selector, not a component-level exception.
- The phase should leave `v1.1` ready for re-audit immediately after verification passes.

</specifics>

<deferred>
## Deferred Ideas

- Any generalization toward public app catalogs or marketplace concepts.
- Any Browser feature work beyond truthful managed-destination behavior.
- Any Notes feature work beyond the shared metadata adoption needed for `PLAT-03`.

</deferred>

---
*Phase: 15-platform-usage-truthfulness-cleanup*
*Context gathered: 2026-04-08*
