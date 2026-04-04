export type RuntimeAppPlacement = "grid" | "dock";

export type RuntimeAppAvailability = "implemented" | "coming-soon";

export type RuntimeAppLaunchSurface = "calculator" | "coming-soon";

export type RuntimeAppIcon = {
  glyph: string;
  tintStart: string;
  tintEnd: string;
};

export type RuntimeApp = {
  id: string;
  label: string;
  icon: RuntimeAppIcon;
  placement: RuntimeAppPlacement;
  availability: RuntimeAppAvailability;
  launchSurface: RuntimeAppLaunchSurface;
};

export const appRegistry: RuntimeApp[] = [
  {
    id: "calendar",
    label: "Calendar",
    icon: { glyph: "17", tintStart: "#fff1f2", tintEnd: "#ef4444" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "photos",
    label: "Photos",
    icon: { glyph: "✿", tintStart: "#fbbf24", tintEnd: "#ec4899" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "camera",
    label: "Camera",
    icon: { glyph: "◉", tintStart: "#111827", tintEnd: "#6b7280" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "weather",
    label: "Weather",
    icon: { glyph: "☼", tintStart: "#38bdf8", tintEnd: "#2563eb" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "clock",
    label: "Clock",
    icon: { glyph: "◔", tintStart: "#0f172a", tintEnd: "#475569" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "maps",
    label: "Maps",
    icon: { glyph: "⌖", tintStart: "#34d399", tintEnd: "#0ea5e9" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "notes",
    label: "Notes",
    icon: { glyph: "☰", tintStart: "#fde68a", tintEnd: "#facc15" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "health",
    label: "Health",
    icon: { glyph: "♥", tintStart: "#fb7185", tintEnd: "#f43f5e" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "calculator",
    label: "Calculator",
    icon: { glyph: "＋", tintStart: "#111827", tintEnd: "#fb923c" },
    placement: "grid",
    availability: "implemented",
    launchSurface: "calculator",
  },
  {
    id: "music-grid",
    label: "Music",
    icon: { glyph: "♫", tintStart: "#ec4899", tintEnd: "#8b5cf6" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "mail",
    label: "Mail",
    icon: { glyph: "✉", tintStart: "#60a5fa", tintEnd: "#2563eb" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "files",
    label: "Files",
    icon: { glyph: "▣", tintStart: "#ffffff", tintEnd: "#cbd5e1" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "journal",
    label: "Journal",
    icon: { glyph: "✎", tintStart: "#c4b5fd", tintEnd: "#7c3aed" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "messages-grid",
    label: "Messages",
    icon: { glyph: "◌", tintStart: "#4ade80", tintEnd: "#16a34a" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: { glyph: "▤", tintStart: "#60a5fa", tintEnd: "#111827" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "settings",
    label: "Settings",
    icon: { glyph: "⚙", tintStart: "#cbd5e1", tintEnd: "#64748b" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "browser-grid",
    label: "Browser",
    icon: { glyph: "◍", tintStart: "#60a5fa", tintEnd: "#0f172a" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "voice",
    label: "Voice",
    icon: { glyph: "◠", tintStart: "#f9a8d4", tintEnd: "#db2777" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "studio",
    label: "Studio",
    icon: { glyph: "◆", tintStart: "#f97316", tintEnd: "#7c2d12" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "library",
    label: "Library",
    icon: { glyph: "◎", tintStart: "#7dd3fc", tintEnd: "#14b8a6" },
    placement: "grid",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "phone",
    label: "Phone",
    icon: { glyph: "◐", tintStart: "#4ade80", tintEnd: "#16a34a" },
    placement: "dock",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "browser",
    label: "Browser",
    icon: { glyph: "◍", tintStart: "#60a5fa", tintEnd: "#2563eb" },
    placement: "dock",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "messages",
    label: "Messages",
    icon: { glyph: "◌", tintStart: "#4ade80", tintEnd: "#16a34a" },
    placement: "dock",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
  {
    id: "music",
    label: "Music",
    icon: { glyph: "♫", tintStart: "#ec4899", tintEnd: "#8b5cf6" },
    placement: "dock",
    availability: "coming-soon",
    launchSurface: "coming-soon",
  },
];

export function getRuntimeApp(
  appId: string,
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp | null {
  return maybeApps.find((app) => app.id === appId) ?? null;
}

export function listRuntimeAppsByPlacement(
  placement: RuntimeAppPlacement,
  maybeApps: RuntimeApp[] = appRegistry,
): RuntimeApp[] {
  return maybeApps.filter((app) => app.placement === placement);
}
