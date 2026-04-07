import { describe, expect, it } from "vitest";
import {
  appRegistry,
  getRuntimeApp,
  listRuntimeAppsByPlacement,
  getRuntimeAppStorageNamespace,
  listRuntimeAppsForSettings,
  listRuntimeStorageManagedApps,
} from "./appRegistry";

describe("appRegistry", () => {
  it("marks the implemented app set explicitly", () => {
    // Arrange
    const implementedApps = appRegistry.filter(
      (app) => app.availability === "implemented",
    );

    // Act
    const result = implementedApps.map((app) => app.id);

    // Assert
    expect(result).toEqual([
      "notes",
      "calculator",
      "settings",
      "browser-grid",
      "browser",
    ]);
  });

  it("uses explicit dock placement for the curated dock apps", () => {
    // Arrange
    const dockApps = listRuntimeAppsByPlacement("dock");

    // Act
    const result = dockApps.map((app) => app.id);

    // Assert
    expect(result).toEqual(["phone", "browser", "messages", "music"]);
  });

  it("returns null for unknown app ids", () => {
    // Arrange
    const missingAppId = "unknown-app";

    // Act
    const result = getRuntimeApp(missingAppId);

    // Assert
    expect(result).toBeNull();
  });

  it("returns runtime metadata for a known app id", () => {
    // Arrange
    const appId = "calculator";

    // Act
    const result = getRuntimeApp(appId);

    // Assert
    expect(result?.availability).toBe("implemented");
    expect(result?.launchSurface).toBe("calculator");
    expect(result?.placement).toBe("grid");
  });

  it("exposes settings-visible milestone apps through runtime selectors", () => {
    // Arrange

    // Act
    const result = listRuntimeAppsForSettings(appRegistry).map(
      (app) => app.id,
    );

    // Assert
    expect(result).toEqual([
      "notes",
      "calculator",
      "settings",
      "browser-grid",
      "browser",
    ]);
  });

  it("exposes storage-managed milestone apps through runtime selectors", () => {
    // Arrange

    // Act
    const result = listRuntimeStorageManagedApps(appRegistry)
      .filter((app) =>
        ["settings", "notes", "browser-grid", "browser"].includes(app.id),
      )
      .map((app) => app.id);

    // Assert
    expect(result).toEqual([
      "notes",
      "settings",
      "browser-grid",
      "browser",
    ]);
  });

  it("resolves runtime storage namespaces for milestone apps", () => {
    // Arrange

    // Act
    const result = [
      getRuntimeAppStorageNamespace("notes"),
      getRuntimeAppStorageNamespace("settings"),
      getRuntimeAppStorageNamespace("browser-grid"),
      getRuntimeAppStorageNamespace("browser"),
    ];

    // Assert
    expect(result).toEqual([
      "openos.apps.notes",
      "openos.apps.settings",
      "openos.apps.browser-grid",
      "openos.apps.browser",
    ]);
  });
});
