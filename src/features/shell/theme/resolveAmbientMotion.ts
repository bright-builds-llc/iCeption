export type AmbientMotionMode = "full" | "reduced";

export function resolveAmbientMotion(
  prefersReducedMotion: boolean,
): AmbientMotionMode {
  if (prefersReducedMotion) {
    return "reduced";
  }

  return "full";
}
