import {
  ambientPalettes,
  defaultAmbientPalette,
  getAmbientPalette,
  type AmbientPalette,
} from "../shell/theme/ambientPalette";

export type SettingsStorageLike = Pick<Storage, "getItem" | "setItem">;

export type OpenOsThemePreset = AmbientPalette["id"];

export type OpenOsMotionPreference = "system" | "full" | "reduced";

export type OpenOsSettings = {
  motionPreference: OpenOsMotionPreference;
  themePreset: OpenOsThemePreset;
};

export const OPENOS_SETTINGS_STORAGE_KEY = "openos.settings";

export const availableThemePresets = ambientPalettes.map(
  (palette) => palette.id,
);

export const defaultOpenOsSettings: OpenOsSettings = {
  motionPreference: "system",
  themePreset: defaultAmbientPalette.id,
};

type WindowLike = {
  addEventListener: (
    name: string,
    listener: EventListener,
  ) => void;
  dispatchEvent: (event: Event) => boolean;
  removeEventListener: (
    name: string,
    listener: EventListener,
  ) => void;
};

const SETTINGS_CHANGED_EVENT = "openos:settings-changed";

function isThemePreset(
  value: string,
): value is OpenOsThemePreset {
  return availableThemePresets.includes(value as OpenOsThemePreset);
}

function isMotionPreference(
  value: string,
): value is OpenOsMotionPreference {
  return value === "system" || value === "full" || value === "reduced";
}

function parseOpenOsSettings(
  value: string | null,
): OpenOsSettings {
  if (value === null) {
    return defaultOpenOsSettings;
  }

  try {
    const maybeParsed = JSON.parse(value) as Partial<OpenOsSettings>;
    const maybeMotionPreference = maybeParsed.motionPreference;
    const maybeThemePreset = maybeParsed.themePreset;

    let motionPreference = defaultOpenOsSettings.motionPreference;

    if (
      typeof maybeMotionPreference === "string" &&
      isMotionPreference(maybeMotionPreference)
    ) {
      motionPreference = maybeMotionPreference;
    }

    let themePreset = defaultOpenOsSettings.themePreset;

    if (
      typeof maybeThemePreset === "string" &&
      isThemePreset(maybeThemePreset)
    ) {
      themePreset = maybeThemePreset;
    }

    return {
      motionPreference,
      themePreset,
    };
  } catch {
    return defaultOpenOsSettings;
  }
}

export function readOpenOsSettings(
  storage: SettingsStorageLike,
): OpenOsSettings {
  return parseOpenOsSettings(
    storage.getItem(OPENOS_SETTINGS_STORAGE_KEY),
  );
}

export function writeOpenOsSettings(
  storage: SettingsStorageLike,
  settings: OpenOsSettings,
  maybeWin?: WindowLike,
): void {
  storage.setItem(
    OPENOS_SETTINGS_STORAGE_KEY,
    JSON.stringify(settings),
  );
  maybeWin?.dispatchEvent(new Event(SETTINGS_CHANGED_EVENT));
}

export function resolveAmbientPalette(
  settings: OpenOsSettings,
): AmbientPalette {
  return getAmbientPalette(settings.themePreset);
}

export function resolveMotionPreference(
  settings: OpenOsSettings,
  systemPrefersReducedMotion: boolean,
): boolean {
  if (settings.motionPreference === "system") {
    return systemPrefersReducedMotion;
  }

  return settings.motionPreference === "reduced";
}

export function subscribeToOpenOsSettings(
  win: WindowLike,
  callback: () => void,
): () => void {
  const handleChange: EventListener = () => {
    callback();
  };

  win.addEventListener(SETTINGS_CHANGED_EVENT, handleChange);

  return () => {
    win.removeEventListener(SETTINGS_CHANGED_EVENT, handleChange);
  };
}
