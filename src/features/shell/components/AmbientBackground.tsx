import type { CSSProperties } from "react";
import type { ShellProfileKind } from "../profile/createShellProfile";
import { defaultAmbientPalette } from "../theme/ambientPalette";
import "../theme/shellTheme.css";

type AmbientBackgroundProps = {
  profileKind: ShellProfileKind;
  prefersReducedMotion: boolean;
};

type AmbientBackgroundStyle = CSSProperties & Record<`--${string}`, string>;

export function AmbientBackground({
  profileKind,
  prefersReducedMotion,
}: AmbientBackgroundProps) {
  const paletteStyle = {
    "--ambient-background-top": defaultAmbientPalette.backgroundTop,
    "--ambient-background-bottom": defaultAmbientPalette.backgroundBottom,
    "--ambient-primary-glow": defaultAmbientPalette.primaryGlow,
    "--ambient-secondary-glow": defaultAmbientPalette.secondaryGlow,
    "--ambient-tertiary-glow": defaultAmbientPalette.tertiaryGlow,
    "--dock-glass-top": defaultAmbientPalette.dockGlassTop,
    "--dock-glass-bottom": defaultAmbientPalette.dockGlassBottom,
    "--shell-text-color": defaultAmbientPalette.shellText,
  } as AmbientBackgroundStyle;

  return (
    <div
      aria-hidden="true"
      className="ambient-background"
      data-motion={prefersReducedMotion ? "reduced" : "full"}
      data-profile={profileKind}
      style={paletteStyle}
    >
      <div className="ambient-background__layer ambient-background__layer--one" />
      <div className="ambient-background__layer ambient-background__layer--two" />
      <div className="ambient-background__layer ambient-background__layer--three" />
    </div>
  );
}
