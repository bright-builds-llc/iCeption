#!/usr/bin/env bun

import {
  listCatalogReadySubmittedApps,
  listSubmittedAppValidationResults,
} from "../src/features/platform/submittedAppManifests";

const validationResults =
  listSubmittedAppValidationResults();

if (validationResults.length === 0) {
  console.error(
    "No submitted app manifests were found. Add a manifest before running submission validation.",
  );
  process.exit(1);
}

const invalidResults = validationResults.filter(
  (result) => result.issues.length > 0,
);

if (invalidResults.length > 0) {
  console.error(
    `Submission validation failed for ${invalidResults.length} manifest(s):`,
  );

  for (const result of invalidResults) {
    console.error(`- ${result.manifest.id}`);

    for (const issue of result.issues) {
      console.error(`  - ${issue.field}: ${issue.message}`);
    }
  }

  process.exit(1);
}

const catalogReadyCount =
  listCatalogReadySubmittedApps().length;

console.log(
  `Validated ${validationResults.length} submitted app manifest(s).`,
);
console.log(
  `${catalogReadyCount} manifest(s) are catalog-ready for future app catalog work.`,
);
