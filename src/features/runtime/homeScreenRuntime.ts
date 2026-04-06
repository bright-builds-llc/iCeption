import {
  getRuntimeGridPageCount,
  getRuntimeApp,
  type RuntimeApp,
  type RuntimeAppAvailability,
} from "./appRegistry";
import {
  beginClosingNavigation,
  beginOpeningNavigation,
  createInitialHomeNavigationState,
  finishClosingNavigation,
  finishOpeningNavigation,
  getActiveNavigationAppId,
  syncHomeNavigationPreferences,
  type HomeNavigationPreferences,
  type HomeNavigationState,
  type MotionRect,
} from "../motion/homeNavigationMotion";

export type HomeScreenRuntimeState = HomeNavigationState & {
  activePage: number;
  originPage: number | null;
};

export const PRESSED_ICON_DURATION_MS = 120;

const defaultPreferences: HomeNavigationPreferences = {
  prefersReducedMotion: false,
  supportsViewTransitions: false,
};

export function createInitialHomeScreenRuntimeState(
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  return {
    ...createInitialHomeNavigationState(preferences),
    activePage: 0,
    originPage: null,
  };
}

export function isRuntimeAppLaunchable(
  availability: RuntimeAppAvailability,
): boolean {
  return availability === "implemented" || availability === "coming-soon";
}

export function openRuntimeApp(
  appId: string,
  maybeApps: RuntimeApp[],
  currentState: HomeScreenRuntimeState,
  originRect: MotionRect | null = null,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  const maybeApp = getRuntimeApp(appId, maybeApps);

  if (maybeApp === null || !isRuntimeAppLaunchable(maybeApp.availability)) {
    return currentState;
  }

  const originPage =
    currentState.originPage ?? currentState.activePage;

  return {
    ...beginOpeningNavigation(appId, originRect, preferences),
    activePage: originPage,
    originPage,
  };
}

export function getOpenRuntimeApp(
  state: HomeScreenRuntimeState,
  maybeApps: RuntimeApp[],
): RuntimeApp | null {
  const maybeAppId = getActiveNavigationAppId(state);

  if (maybeAppId === null) {
    return null;
  }

  return getRuntimeApp(maybeAppId, maybeApps);
}

export function closeRuntimeApp(
  currentState: HomeScreenRuntimeState,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  const nextState = beginClosingNavigation(currentState, preferences);

  if (nextState.kind === currentState.kind) {
    return currentState;
  }

  return {
    ...nextState,
    activePage: currentState.activePage,
    originPage: currentState.originPage,
  };
}

export function completeRuntimeTransition(
  currentState: HomeScreenRuntimeState,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  if (currentState.kind === "opening") {
    return {
      ...finishOpeningNavigation(currentState),
      activePage: currentState.activePage,
      originPage: currentState.originPage,
    };
  }

  if (currentState.kind === "closing") {
    return {
      ...finishClosingNavigation(currentState, preferences),
      activePage: currentState.originPage ?? currentState.activePage,
      originPage: null,
    };
  }

  return currentState;
}

export function syncRuntimeMotionPreferences(
  currentState: HomeScreenRuntimeState,
  preferences: HomeNavigationPreferences = defaultPreferences,
): HomeScreenRuntimeState {
  return {
    ...syncHomeNavigationPreferences(currentState, preferences),
    activePage: currentState.activePage,
    originPage: currentState.originPage,
  };
}

export function setActiveHomeScreenPage(
  currentState: HomeScreenRuntimeState,
  nextPage: number,
  maybePageCount = Number.POSITIVE_INFINITY,
): HomeScreenRuntimeState {
  if (currentState.kind !== "home") {
    return currentState;
  }

  const cappedPageCount = Math.max(1, maybePageCount);
  const activePage = Math.min(
    Math.max(0, nextPage),
    cappedPageCount - 1,
  );

  return {
    ...currentState,
    activePage,
    originPage: null,
  };
}

export function getHomeScreenPageCount(
  maybeApps: RuntimeApp[] = [],
): number {
  return getRuntimeGridPageCount(maybeApps);
}
