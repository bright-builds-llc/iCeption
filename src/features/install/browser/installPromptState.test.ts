import { describe, expect, it } from "vitest";
import {
  INSTALL_PROMPT_TTL_MS,
  createInstallPromptState,
  dismissInstallPrompt,
  showInstallTakeover,
} from "./installPromptState";

describe("installPromptState", () => {
  it("shows the takeover when there is no dismissal record", () => {
    // Arrange
    const input = {
      nowMs: 10_000,
      maybeDismissedAt: null,
    };

    // Act
    const result = createInstallPromptState(input);

    // Assert
    expect(result).toEqual({
      mode: "takeover",
      maybeDismissedAt: null,
    });
  });

  it("shows the persistent prompt while the dismissal is still fresh", () => {
    // Arrange
    const input = {
      nowMs: INSTALL_PROMPT_TTL_MS - 1,
      maybeDismissedAt: 0,
    };

    // Act
    const result = createInstallPromptState(input);

    // Assert
    expect(result).toEqual({
      mode: "persistent",
      maybeDismissedAt: 0,
    });
  });

  it("restores the takeover after the dismissal TTL expires", () => {
    // Arrange
    const input = {
      nowMs: INSTALL_PROMPT_TTL_MS + 1,
      maybeDismissedAt: 0,
    };

    // Act
    const result = createInstallPromptState(input);

    // Assert
    expect(result).toEqual({
      mode: "takeover",
      maybeDismissedAt: null,
    });
  });

  it("records a persistent state when the prompt is dismissed", () => {
    // Arrange
    const nowMs = 42_000;

    // Act
    const result = dismissInstallPrompt(nowMs);

    // Assert
    expect(result).toEqual({
      mode: "persistent",
      maybeDismissedAt: nowMs,
    });
  });

  it("can re-open the takeover without losing the dismissal timestamp", () => {
    // Arrange
    const maybeDismissedAt = 42_000;

    // Act
    const result = showInstallTakeover(maybeDismissedAt);

    // Assert
    expect(result).toEqual({
      mode: "takeover",
      maybeDismissedAt,
    });
  });
});
