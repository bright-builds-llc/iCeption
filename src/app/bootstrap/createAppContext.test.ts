import { describe, expect, it } from "vitest";
import { createAppContext } from "./createAppContext";

function createWindowLike(
  search: string,
  maybeOptions?: {
    displayModeStandalone?: boolean;
    maybeLegacyStandalone?: boolean;
  },
) {
  return {
    location: { search },
    matchMedia: () => ({
      matches: maybeOptions?.displayModeStandalone ?? false,
    }),
    navigator: {
      standalone: maybeOptions?.maybeLegacyStandalone,
    } as Navigator & { standalone?: boolean },
  };
}

describe("createAppContext", () => {
  it("uses the new openos install-context override in dev mode", () => {
    // Arrange
    const win = createWindowLike("?openos-install-context=standalone");

    // Act
    const result = createAppContext(win, { isDev: true });

    // Assert
    expect(result.installContext).toEqual({
      kind: "standalone",
      source: "dev-override",
    });
  });

  it("supports the legacy iception install-context override during the transition window", () => {
    // Arrange
    const win = createWindowLike("?iception-install-context=browser");

    // Act
    const result = createAppContext(win, { isDev: true });

    // Assert
    expect(result.installContext).toEqual({
      kind: "browser",
      source: "dev-override",
    });
  });

  it("ignores query overrides outside dev mode", () => {
    // Arrange
    const win = createWindowLike("?openos-install-context=standalone");

    // Act
    const result = createAppContext(win, { isDev: false });

    // Assert
    expect(result.installContext).toEqual({
      kind: "browser",
      source: "default-browser",
    });
  });

  it("uses display-mode standalone when not in dev mode", () => {
    // Arrange
    const win = createWindowLike("", { displayModeStandalone: true });

    // Act
    const result = createAppContext(win, { isDev: false });

    // Assert
    expect(result.installContext).toEqual({
      kind: "standalone",
      source: "display-mode",
    });
  });

  it("falls back to legacy standalone when display-mode is unavailable", () => {
    // Arrange
    const win = createWindowLike("", { maybeLegacyStandalone: true });

    // Act
    const result = createAppContext(win, { isDev: false });

    // Assert
    expect(result.installContext).toEqual({
      kind: "standalone",
      source: "legacy-standalone",
    });
  });
});
