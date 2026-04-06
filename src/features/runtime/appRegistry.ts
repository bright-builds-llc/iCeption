import {
  builtInAppDefinitions,
  type RuntimeAppAvailability,
  type RuntimeAppDefinition,
  type RuntimeAppLaunchSurface,
  type RuntimeAppPlacement,
} from "../platform/appDefinitions";

export type {
  RuntimeAppAvailability,
  RuntimeAppLaunchSurface,
  RuntimeAppPlacement,
} from "../platform/appDefinitions";

export type RuntimeApp = RuntimeAppDefinition;

export const appRegistry: RuntimeApp[] = builtInAppDefinitions;

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
