import { useEffect, useRef, useState } from "react";
import type { ShellViewportMetrics } from "./createShellProfile";

type VisualViewportWithEvents = VisualViewport & {
  addEventListener: (
    type: "resize" | "scroll",
    listener: EventListener,
  ) => void;
  removeEventListener: (
    type: "resize" | "scroll",
    listener: EventListener,
  ) => void;
};

type ShellViewportState = {
  metrics: ShellViewportMetrics;
  prefersReducedMotion: boolean;
};

function parseSafeAreaValue(value: string): number {
  const parsedValue = Number.parseFloat(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return parsedValue;
}

function createShellViewportState(
  maybeSceneElement: HTMLElement | null,
): ShellViewportState {
  const maybeVisualViewport = window.visualViewport as VisualViewportWithEvents | undefined;
  const width = maybeVisualViewport?.width ?? window.innerWidth;
  const height = maybeVisualViewport?.height ?? window.innerHeight;
  const maybeStyles =
    maybeSceneElement === null ? null : window.getComputedStyle(maybeSceneElement);

  return {
    metrics: {
      width,
      height,
      safeArea: {
        top: parseSafeAreaValue(
          maybeStyles?.getPropertyValue("--shell-safe-area-top") ?? "",
        ),
        right: parseSafeAreaValue(
          maybeStyles?.getPropertyValue("--shell-safe-area-right") ?? "",
        ),
        bottom: parseSafeAreaValue(
          maybeStyles?.getPropertyValue("--shell-safe-area-bottom") ?? "",
        ),
        left: parseSafeAreaValue(
          maybeStyles?.getPropertyValue("--shell-safe-area-left") ?? "",
        ),
      },
    },
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
  };
}

export function useShellViewport() {
  const sceneRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<ShellViewportState>(() =>
    createShellViewportState(null),
  );

  useEffect(() => {
    const maybeVisualViewport = window.visualViewport as
      | VisualViewportWithEvents
      | undefined;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateViewportState = () => {
      setState(createShellViewportState(sceneRef.current));
    };

    updateViewportState();

    window.addEventListener("resize", updateViewportState);
    maybeVisualViewport?.addEventListener("resize", updateViewportState);
    motionQuery.addEventListener("change", updateViewportState);

    return () => {
      window.removeEventListener("resize", updateViewportState);
      maybeVisualViewport?.removeEventListener("resize", updateViewportState);
      motionQuery.removeEventListener("change", updateViewportState);
    };
  }, []);

  return {
    sceneRef,
    metrics: state.metrics,
    prefersReducedMotion: state.prefersReducedMotion,
  };
}
