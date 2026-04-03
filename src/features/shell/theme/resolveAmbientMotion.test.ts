import { describe, expect, it } from "vitest";
import { resolveAmbientMotion } from "./resolveAmbientMotion";

describe("resolveAmbientMotion", () => {
  it("returns reduced when the user prefers reduced motion", () => {
    // Arrange
    const prefersReducedMotion = true;

    // Act
    const result = resolveAmbientMotion(prefersReducedMotion);

    // Assert
    expect(result).toBe("reduced");
  });

  it("returns full when reduced motion is not requested", () => {
    // Arrange
    const prefersReducedMotion = false;

    // Act
    const result = resolveAmbientMotion(prefersReducedMotion);

    // Assert
    expect(result).toBe("full");
  });
});
