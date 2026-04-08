import {
  builtInAppDefinitions,
  type AppSettingsParticipation,
  type AppStorageMetadata,
  type RuntimeAppAvailability,
  type RuntimeAppDefinition,
  type RuntimeAppLaunchSurface,
  type RuntimeAppPlacement,
} from "../platform/appDefinitions";
import { listSettingsVisibleApps } from "../platform/appSettings";
import {
  getAppStorageNamespace,
  listStorageManagedApps,
} from "../platform/appStorage";

export type {
  AppSettingsParticipation,
  AppStorageMetadata,
  RuntimeAppAvailability,
  RuntimeAppLaunchSurface,
  RuntimeAppPlacement,
} from "../platform/appDefinitions";

export type RuntimeApp = RuntimeAppDefinition;

export const appRegistry: RuntimeApp[] = builtInAppDefinitions;

function getCanonicalRuntimeAppKey(
  app: RuntimeApp,
): string {
  return app.launchSurface === "coming-soon"
    ? app.id
    : app.launchSurface;
}

export function getRuntimeApp(
  appId: string,
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp | null {
  return maybeApps.find((app) => app.id === appId) ?? null;
}

export function listRuntimeAppsByPlacement(
  placement: RuntimeAppPlacement,
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return maybeApps.filter((app) => app.placement === placement);
}

export function listRuntimeGridAppsByPage(
  page: number,
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return maybeApps.filter(
    (app) => app.placement === "grid" && (app.page ?? 0) === page,
  );
}

export function getRuntimeGridPageCount(
  maybeApps: RuntimeApp[] = appRegistry,
): number {
  const pages = maybeApps
    .filter((app) => app.placement === "grid")
    .map((app) => app.page ?? 0);

  if (pages.length === 0) {
    return 0;
  }

  return Math.max(...pages) + 1;
}

export function listRuntimeAppsForSettings(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return listSettingsVisibleApps(maybeApps);
}

export function listCanonicalRuntimeApps(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  const seenKeys = new Set<string>();

  return maybeApps.filter((app) => {
    const key = getCanonicalRuntimeAppKey(app);

    if (seenKeys.has(key)) {
      return false;
    }

    seenKeys.add(key);
    return true;
  });
}

export function getCanonicalRuntimeAppForLaunchSurface(
  launchSurface: RuntimeAppLaunchSurface,
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp | null {
  return (
    listCanonicalRuntimeApps(maybeApps).find(
      (app) => app.launchSurface === launchSurface,
    ) ?? null
  );
}

export function listCanonicalRuntimeAppsForSettings(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return listCanonicalRuntimeApps(
    listRuntimeAppsForSettings(maybeApps),
  );
}

export function listRuntimeStorageManagedApps(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return listStorageManagedApps(maybeApps);
}

export function getRuntimeAppStorageNamespace(
  appId: string,
  maybeApps: RuntimeApp[] = appRegistry,
): string | null {
  return getAppStorageNamespace(appId, maybeApps);
}

export function getCanonicalRuntimeAppStorageNamespace(
  launchSurface: RuntimeAppLaunchSurface,
  maybeApps: RuntimeApp[] = appRegistry,
): string | null {
  return getCanonicalRuntimeAppForLaunchSurface(
    launchSurface,
    maybeApps,
  )?.storage.namespace ?? null;
}
