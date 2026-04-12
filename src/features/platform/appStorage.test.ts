import { describe, expect, it } from "vitest";
import {
  createAppStorageMetadata,
  createAppStorageNamespace,
  getAppStorageNamespace,
  listStorageManagedApps,
} from "./appStorage";
import { builtInAppDefinitions } from "./appDefinitions";

describe("appStorage", () => {
  it("creates a stable openOS namespace for an app id", () => {
    // Arrange

    // Act
    const result = createAppStorageNamespace("notes");

    // Assert
    expect(result).toBe("openos.apps.notes");
  });

  it("creates storage metadata from an app id", () => {
    // Arrange

    // Act
    const result = createAppStorageMetadata("browser");

    // Assert
    expect(result).toEqual({
      namespace: "openos.apps.browser",
    });
  });

  it("can alias one launcher entry onto another app namespace", () => {
    // Arrange

    // Act
    const result = createAppStorageMetadata(
      "browser-grid",
      "browser",
    );

    // Assert
    expect(result).toEqual({
      namespace: "openos.apps.browser",
    });
  });

  it("lists apps with storage namespaces", () => {
    // Arrange

    // Act
    const result = listStorageManagedApps(builtInAppDefinitions).length;

    // Assert
    expect(result).toBe(builtInAppDefinitions.length);
  });

  it("looks up the namespace for an app from the built-in definitions", () => {
    // Arrange

    // Act
    const result = getAppStorageNamespace(
      "settings",
      builtInAppDefinitions,
    );

    // Assert
    expect(result).toBe("openos.apps.settings");
  });
});
