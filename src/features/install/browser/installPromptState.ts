export const INSTALL_PROMPT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type InstallPromptMode = "takeover" | "persistent";

export type InstallPromptState = {
  mode: InstallPromptMode;
  maybeDismissedAt: number | null;
};

type CreateInstallPromptStateInput = {
  nowMs: number;
  maybeDismissedAt: number | null;
  ttlMs?: number;
};

export function createInstallPromptState(
  input: CreateInstallPromptStateInput,
): InstallPromptState {
  const ttlMs = input.ttlMs ?? INSTALL_PROMPT_TTL_MS;

  if (input.maybeDismissedAt === null) {
    return {
      mode: "takeover",
      maybeDismissedAt: null,
    };
  }

  if (input.nowMs - input.maybeDismissedAt >= ttlMs) {
    return {
      mode: "takeover",
      maybeDismissedAt: null,
    };
  }

  return {
    mode: "persistent",
    maybeDismissedAt: input.maybeDismissedAt,
  };
}

export function dismissInstallPrompt(nowMs: number): InstallPromptState {
  return {
    mode: "persistent",
    maybeDismissedAt: nowMs,
  };
}

export function showInstallTakeover(
  maybeDismissedAt: number | null,
): InstallPromptState {
  return {
    mode: "takeover",
    maybeDismissedAt,
  };
}
