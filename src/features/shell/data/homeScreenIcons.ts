import {
  appRegistry,
  getRuntimeGridPageCount,
  listRuntimeGridAppsByPage,
  listRuntimeAppsByPlacement,
  type RuntimeApp,
} from "../../runtime/appRegistry";

export type ShellIcon = RuntimeApp;
export type HomeScreenPage = {
  index: number;
  apps: RuntimeApp[];
};

export function getHomeScreenIcons(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return listRuntimeAppsByPlacement("grid", maybeApps);
}

export function getDockIcons(
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return listRuntimeAppsByPlacement("dock", maybeApps);
}

export function getHomeScreenPages(
  maybeApps: RuntimeApp[] = appRegistry,
): HomeScreenPage[] {
  const pageCount = getRuntimeGridPageCount(maybeApps);

  return Array.from({ length: pageCount }, (_, index) => ({
    index,
    apps: listRuntimeGridAppsByPage(index, maybeApps),
  })).filter((page) => page.apps.length > 0);
}
