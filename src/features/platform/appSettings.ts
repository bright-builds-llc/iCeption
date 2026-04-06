import type { RuntimeAppDefinition } from "./appDefinitions";

export type AppSettingsVisibility = "hidden" | "app-list";

export type AppSettingsParticipation = {
  visibility: AppSettingsVisibility;
};

type SettingsAwareApp = {
  settings: AppSettingsParticipation;
};

export function createAppSettingsParticipation(
  visibility: AppSettingsVisibility = "hidden",
): AppSettingsParticipation {
  return {
    visibility,
  };
}

export function listSettingsVisibleApps<
  TApp extends SettingsAwareApp,
>(
  maybeApps: TApp[],
): TApp[] {
  return maybeApps.filter(
    (app) => app.settings.visibility !== "hidden",
  );
}

export function participatesInSettings(
  app: SettingsAwareApp,
): boolean {
  return app.settings.visibility !== "hidden";
}
