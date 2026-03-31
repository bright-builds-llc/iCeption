export type InstallContextKind = "browser" | "standalone";

export type InstallContextSource =
  | "default-browser"
  | "display-mode"
  | "legacy-standalone"
  | "dev-override";

export type InstallContext = {
  kind: InstallContextKind;
  source: InstallContextSource;
};

export type DetectInstallContextInput = {
  displayModeStandalone: boolean;
  maybeLegacyStandalone: boolean | null;
  maybeOverride: InstallContextKind | null;
};

export function detectInstallContext(
  input: DetectInstallContextInput,
): InstallContext {
  if (input.maybeOverride !== null) {
    return {
      kind: input.maybeOverride,
      source: "dev-override",
    };
  }

  if (input.displayModeStandalone) {
    return {
      kind: "standalone",
      source: "display-mode",
    };
  }

  if (input.maybeLegacyStandalone === true) {
    return {
      kind: "standalone",
      source: "legacy-standalone",
    };
  }

  return {
    kind: "browser",
    source: "default-browser",
  };
}
