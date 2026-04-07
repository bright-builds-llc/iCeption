import type { CSSProperties } from "react";
import type { ShellProfileKind } from "../profile/createShellProfile";
import type { AmbientPalette } from "../theme/ambientPalette";
import { resolveAmbientMotion } from "../theme/resolveAmbientMotion";
import "../theme/shellTheme.css";

type AmbientBackgroundProps = {
  palette: AmbientPalette;
  profileKind: ShellProfileKind;
  prefersReducedMotion: boolean;
};

type AmbientBackgroundStyle = CSSProperties & Record<`--${string}`, string>;

export function AmbientBackground({
  palette,
  profileKind,
  prefersReducedMotion,
}: AmbientBackgroundProps) {
  const motionMode = resolveAmbientMotion(prefersReducedMotion);
  const paletteStyle = {
    "--ambient-background-top": palette.backgroundTop,
    "--ambient-background-bottom": palette.backgroundBottom,
    "--ambient-primary-glow": palette.primaryGlow,
    "--ambient-secondary-glow": palette.secondaryGlow,
    "--ambient-tertiary-glow": palette.tertiaryGlow,
    "--dock-glass-top": palette.dockGlassTop,
    "--dock-glass-bottom": palette.dockGlassBottom,
    "--shell-text-color": palette.shellText,
  } as AmbientBackgroundStyle;

  return (
    <div
      aria-hidden="true"
      className="ambient-background"
      data-motion={motionMode}
      data-palette={palette.id}
      data-profile={profileKind}
      style={paletteStyle}
    >
      <div className="ambient-background__wash" />
      <div className="ambient-background__layer ambient-background__layer--one" />
      <div className="ambient-background__layer ambient-background__layer--two" />
      <div className="ambient-background__layer ambient-background__layer--three" />
    </div>
  );
}
