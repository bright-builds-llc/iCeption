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

export const defaultAmbientPalette: AmbientPalette = {
  id: "laguna",
  backgroundTop: "#182a5f",
  backgroundBottom: "#040814",
  primaryGlow: "rgba(154, 148, 255, 0.42)",
  secondaryGlow: "rgba(78, 216, 198, 0.34)",
  tertiaryGlow: "rgba(255, 170, 119, 0.18)",
  dockGlassTop: "rgba(255, 255, 255, 0.18)",
  dockGlassBottom: "rgba(255, 255, 255, 0.08)",
  shellText: "#f4f8ff",
};
