#!/usr/bin/env bun

import { readdirSync } from "node:fs";
import path from "node:path";
import {
  detectSubmittedAppManifestRegistryDrift,
  listCatalogReadySubmittedApps,
  listSubmittedAppValidationResults,
} from "../src/features/platform/submittedAppManifests";

const submittedAppsDirectory = path.resolve(
  import.meta.dir,
  "../src/features/platform/submitted-apps",
);
const discoveredManifestFiles = readdirSync(
  submittedAppsDirectory,
).filter((file) => file.endsWith(".json"));
const registryDrift = detectSubmittedAppManifestRegistryDrift(
  discoveredManifestFiles,
);

if (
  registryDrift.unregisteredOnDisk.length > 0 ||
  registryDrift.registeredMissingFile.length > 0
) {
  console.error(
    "Submission manifest registry drift detected:",
  );

  for (const file of registryDrift.unregisteredOnDisk) {
    console.error(
      `- unregistered_on_disk: ${file} is present on disk but missing from submittedAppManifests.ts`,
    );
  }

  for (const file of registryDrift.registeredMissingFile) {
    console.error(
      `- registered_missing_file: ${file} is registered in submittedAppManifests.ts but missing on disk`,
    );
  }

  process.exit(1);
}

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
