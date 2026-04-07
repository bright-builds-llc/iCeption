export type AmbientPalette = {
  id: string;
  backgroundTop: string;
  backgroundBottom: string;
  primaryGlow: string;
  secondaryGlow: string;
  tertiaryGlow: string;
  dockGlassTop: string;
  dockGlassBottom: string;
  shellText: string;
};

export const ambientPalettes: AmbientPalette[] = [
  {
    id: "laguna",
    backgroundTop: "#182a5f",
    backgroundBottom: "#040814",
    primaryGlow: "rgba(154, 148, 255, 0.42)",
    secondaryGlow: "rgba(78, 216, 198, 0.34)",
    tertiaryGlow: "rgba(255, 170, 119, 0.18)",
    dockGlassTop: "rgba(255, 255, 255, 0.18)",
    dockGlassBottom: "rgba(255, 255, 255, 0.08)",
    shellText: "#f4f8ff",
  },
  {
    id: "midnight",
    backgroundTop: "#141b35",
    backgroundBottom: "#02050d",
    primaryGlow: "rgba(116, 135, 255, 0.36)",
    secondaryGlow: "rgba(87, 154, 255, 0.24)",
    tertiaryGlow: "rgba(120, 208, 255, 0.16)",
    dockGlassTop: "rgba(255, 255, 255, 0.14)",
    dockGlassBottom: "rgba(255, 255, 255, 0.06)",
    shellText: "#edf4ff",
  },
];

export const defaultAmbientPalette: AmbientPalette = {
  ...ambientPalettes[0],
};

export function getAmbientPalette(
  id: AmbientPalette["id"],
): AmbientPalette {
  return ambientPalettes.find((palette) => palette.id === id)
    ?? defaultAmbientPalette;
}
