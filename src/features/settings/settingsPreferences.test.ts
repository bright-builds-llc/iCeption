import { describe, expect, it, vi } from "vitest";
import {
  defaultOpenOsSettings,
  OPENOS_SETTINGS_STORAGE_KEY,
  readOpenOsSettings,
  resolveAmbientPalette,
  resolveMotionPreference,
  subscribeToOpenOsSettings,
  writeOpenOsSettings,
} from "./settingsPreferences";

function createStorage(): Storage {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  } as Storage;
}

describe("settingsPreferences", () => {
  it("returns defaults when no settings have been stored", () => {
    // Arrange
    const storage = createStorage();

    // Act
    const result = readOpenOsSettings(storage);

    // Assert
    expect(result).toEqual(defaultOpenOsSettings);
  });

  it("persists and reads stored settings", () => {
    // Arrange
    const storage = createStorage();

    // Act
    writeOpenOsSettings(storage, {
      motionPreference: "reduced",
      themePreset: "midnight",
    });
    const result = readOpenOsSettings(storage);

    // Assert
    expect(result).toEqual({
      motionPreference: "reduced",
      themePreset: "midnight",
    });
  });

  it("falls back to defaults for invalid stored values", () => {
    // Arrange
    const storage = createStorage();
    storage.setItem(
      OPENOS_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        motionPreference: "wild",
        themePreset: "unknown",
      }),
    );

    // Act
    const result = readOpenOsSettings(storage);

    // Assert
    expect(result).toEqual(defaultOpenOsSettings);
  });

  it("resolves theme presets through the ambient palette registry", () => {
    // Arrange
    const settings = {
      motionPreference: "system",
      themePreset: "midnight",
    } as const;

    // Act
    const result = resolveAmbientPalette(settings);

    // Assert
    expect(result.id).toBe("midnight");
  });

  it("resolves motion preference overrides against the system preference", () => {
    // Arrange
    const settings = {
      motionPreference: "full",
      themePreset: "laguna",
    } as const;

    // Act
    const result = resolveMotionPreference(settings, true);

    // Assert
    expect(result).toBe(false);
  });

  it("notifies listeners when settings are written", () => {
    // Arrange
    const storage = createStorage();
    const callback = vi.fn();
    const listeners = new Map<string, EventListener>();
    const win = {
      addEventListener: (
        name: string,
        listener: EventListener,
      ) => {
        listeners.set(name, listener);
      },
      removeEventListener: (
        name: string,
        listener: EventListener,
      ) => {
        const existingListener = listeners.get(name);

        if (existingListener !== listener) {
          return;
        }

        listeners.delete(name);
      },
      dispatchEvent: (event: Event) => {
        const listener = listeners.get(event.type);
        listener?.(event);
        return true;
      },
    };

    // Act
    const unsubscribe = subscribeToOpenOsSettings(win, callback);
    writeOpenOsSettings(storage, defaultOpenOsSettings, win);
    unsubscribe();

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
