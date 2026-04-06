import { describe, expect, it } from "vitest";
import { appRegistry } from "./appRegistry";
import {
  createInitialHomeScreenRuntimeState,
  getHomeScreenPageCount,
  getOpenRuntimeApp,
  openRuntimeApp,
  PRESSED_ICON_DURATION_MS,
  setActiveHomeScreenPage,
  completeRuntimeTransition,
  closeRuntimeApp,
} from "./homeScreenRuntime";

describe("homeScreenRuntime", () => {
  it("starts on the home screen", () => {
    // Arrange
    // No arrange needed.

    // Act
    const result = createInitialHomeScreenRuntimeState();

    // Assert
    expect(result).toEqual({
      kind: "home",
      motionMode: "full",
      driver: "css",
      activePage: 0,
      originPage: null,
    });
  });

  it("opens a known launchable app", () => {
    // Arrange
    const currentState = createInitialHomeScreenRuntimeState();

    // Act
    const result = openRuntimeApp("calculator", appRegistry, currentState);

    // Assert
    expect(result).toEqual({
      kind: "opening",
      appId: "calculator",
      originRect: null,
      motionMode: "full",
      driver: "css",
      activePage: 0,
      originPage: 0,
    });
  });

  it("does not change state for an unknown app", () => {
    // Arrange
    const currentState = createInitialHomeScreenRuntimeState();

    // Act
    const result = openRuntimeApp("missing", appRegistry, currentState);

    // Assert
    expect(result).toEqual(currentState);
  });

  it("returns the currently open app metadata", () => {
    // Arrange
    const state = {
      kind: "open-app" as const,
      appId: "messages",
      originRect: null,
      motionMode: "full" as const,
      driver: "css" as const,
      activePage: 1,
      originPage: 1,
    };

    // Act
    const result = getOpenRuntimeApp(state, appRegistry);

    // Assert
    expect(result?.label).toBe("Messages");
    expect(result?.availability).toBe("coming-soon");
  });

  it("can switch the active home page while on the home screen", () => {
    // Arrange
    const currentState = createInitialHomeScreenRuntimeState();

    // Act
    const result = setActiveHomeScreenPage(currentState, 1, 2);

    // Assert
    expect(result.kind).toBe("home");
    expect(result.activePage).toBe(1);
    expect(result.originPage).toBeNull();
  });

  it("restores the launching page after closing an app", () => {
    // Arrange
    const preferences = {
      prefersReducedMotion: false,
      supportsViewTransitions: false,
    };
    const pageState = setActiveHomeScreenPage(
      createInitialHomeScreenRuntimeState(),
      1,
      2,
    );
    const openingState = openRuntimeApp(
      "calculator",
      appRegistry,
      pageState,
      null,
      preferences,
    );
    const openState = completeRuntimeTransition(openingState, preferences);
    const closingState = closeRuntimeApp(openState, preferences);

    // Act
    const result = completeRuntimeTransition(closingState, preferences);

    // Assert
    expect(result.kind).toBe("home");
    expect(result.activePage).toBe(1);
    expect(result.originPage).toBeNull();
  });

  it("keeps the dock outside page partitioning", () => {
    // Arrange
    // No arrange needed.

    // Act
    const result = getHomeScreenPageCount(appRegistry);

    // Assert
    expect(result).toBe(2);
  });

  it("keeps the pressed icon duration brief and explicit", () => {
    // Arrange
    // No arrange needed.

    // Act
    const result = PRESSED_ICON_DURATION_MS;

    // Assert
    expect(result).toBe(120);
  });
});
