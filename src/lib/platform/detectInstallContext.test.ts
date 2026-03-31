import { describe, expect, it } from "vitest";
import { detectInstallContext } from "./detectInstallContext";

describe("detectInstallContext", () => {
  it("prefers the explicit dev override when provided", () => {
    // Arrange
    const input = {
      displayModeStandalone: false,
      maybeLegacyStandalone: false,
      maybeOverride: "standalone" as const,
    };

    // Act
    const result = detectInstallContext(input);

    // Assert
    expect(result).toEqual({
      kind: "standalone",
      source: "dev-override",
    });
  });

  it("uses display mode when the app is running standalone", () => {
    // Arrange
    const input = {
      displayModeStandalone: true,
      maybeLegacyStandalone: false,
      maybeOverride: null,
    };

    // Act
    const result = detectInstallContext(input);

    // Assert
    expect(result).toEqual({
      kind: "standalone",
      source: "display-mode",
    });
  });

  it("falls back to the legacy iOS standalone signal", () => {
    // Arrange
    const input = {
      displayModeStandalone: false,
      maybeLegacyStandalone: true,
      maybeOverride: null,
    };

    // Act
    const result = detectInstallContext(input);

    // Assert
    expect(result).toEqual({
      kind: "standalone",
      source: "legacy-standalone",
    });
  });

  it("defaults to browser mode when no standalone signal exists", () => {
    // Arrange
    const input = {
      displayModeStandalone: false,
      maybeLegacyStandalone: null,
      maybeOverride: null,
    };

    // Act
    const result = detectInstallContext(input);

    // Assert
    expect(result).toEqual({
      kind: "browser",
      source: "default-browser",
    });
  });
});
