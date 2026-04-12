# App Submissions

Phase `18` introduces the first repo-driven app submission contract for openOS. The goal is to let contributors define candidate apps through checked-in metadata now, validate that metadata in-repo, and keep the same source of truth available for the future in-product catalog.

## Workflow

1. Add a manifest JSON file under `src/features/platform/submitted-apps/`.
2. Keep the shared registry in [submittedAppManifests.ts](/Users/peterryszkiewicz/Repos/iCeption/src/features/platform/submittedAppManifests.ts) in sync with the manifest files on disk.
3. Run:

```bash
bun run submissions:check
bun run test -- src/features/platform/submittedAppManifests.test.ts
```

4. Include the manifest, any related docs, and passing validation in the pull request.

The validator now fails closed if the manifest files on disk and the shared registry diverge. That means:

- adding a new `*.json` file without updating the shared registry fails
- leaving a registry entry behind after deleting or renaming a manifest file also fails

## Contract

Each submitted app manifest currently provides:

- `id`: stable lowercase kebab-case identifier
- `label`, `summary`, `description`: catalog and review copy
- `developer.name`: contributor or team attribution
- `source.repositoryUrl`: checked-in repo URL for review
- `icon`: the same icon shape used by built-in runtime app definitions
- `runtime.launchId`, `runtime.settings`, `runtime.storage`: metadata aligned with the existing runtime/app-definition contract
- `catalog.status`, `catalog.category`, `catalog.tags`: catalog-facing metadata
- `review.submittedAt`, `review.reviewedAt`, `review.reviewNotes`: repo review state

Validation rules currently enforce:

- lowercase kebab-case submission ids
- HTTPS repository URLs
- icon tint colors as 6-digit hex values
- submitted app storage namespaces in the form `openos.apps.submitted.<id>`
- hidden Settings visibility until later install/catalog phases expand that contract
- `review.reviewedAt` for any `catalog-ready` submission

## Sample Path

The first sample submission lives at [studio-lab.json](/Users/peterryszkiewicz/Repos/iCeption/src/features/platform/submitted-apps/studio-lab.json).

It exists to prove the end-to-end repo workflow:

- checked-in manifest metadata
- repo-owned validation
- catalog-ready filtering for future Phase `19` work

## Commands

```bash
bun run submissions:check
bun run test
bun run build
```

`bun run submissions:check` is the first guardrail. It now verifies both:

1. the submitted manifest registry matches the JSON files present in `src/features/platform/submitted-apps/`
2. every registered manifest still passes the repo-owned content validation rules
