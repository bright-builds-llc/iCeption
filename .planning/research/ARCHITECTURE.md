# Architecture Research

**Domain:** browser-native iPhone-like app shell and extensible app runtime
**Researched:** 2026-03-31
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                     │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ HomeScreen │ │ Status Bar │ │ App Shell  │ │ Onboard  │ │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └────┬─────┘ │
│        │              │              │              │       │
├────────┴──────────────┴──────────────┴──────────────┴───────┤
│                         Runtime Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐  │
│  │ App Registry + Launcher State + Motion Orchestrator  │  │
│  └───────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                     Platform/Domain Layer                   │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐ │
│  │ Metrics  │ │ PWA Context  │ │ App Manifests │ │ Tests │ │
│  └──────────┘ └──────────────┘ └──────────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Home screen shell | Renders wallpaper, dock, app grid, icon labels, placeholder apps | React components + CSS tokens + app registry lookups |
| App registry | Defines what apps exist, how they launch, and what metadata they expose | TypeScript domain objects and manifest-style config |
| Launcher state machine | Owns whether the user is on the home screen, opening an app, inside an app, or dismissing back home | Pure state transitions plus a thin imperative animation shell |
| Device metrics service | Normalizes viewport, safe-area, and display-mode information | Browser adapters wrapping `VisualViewport`, media queries, and CSS env values |
| App shell | Provides shared chrome such as the custom Home button, sizing, and lifecycle hooks | Reusable React shell around individual apps |
| Calculator app | First concrete app implementation validating the runtime contract | App module that consumes shell/runtime APIs and owns calculator behavior |

## Recommended Project Structure

```text
src/
├── app-shell/          # Shared phone shell, status bar, home control, app frame
│   ├── components/     # Presentational shell pieces
│   └── state/          # Shell state adapters
├── home-screen/        # Wallpaper, dock, icon grid, placeholder app entrypoints
├── apps/               # Individual app modules
│   ├── calculator/     # Working portrait calculator
│   └── coming-soon/    # Placeholder app surface
├── runtime/            # App registry, launch contracts, manifest parsing, routing
├── platform/           # Display mode, viewport, safe area, touch/device services
├── motion/             # Motion tokens, transition plans, timing helpers
├── styles/             # Design tokens, device profiles, global CSS
├── test-support/       # Shared selectors, fixtures, deterministic test helpers
└── main.tsx            # Bootstrap
```

### Structure Rationale

- **`runtime/`:** isolates the long-term platform concern from any one app implementation.
- **`platform/`:** keeps browser-specific APIs at the edges and leaves the core logic testable.
- **`motion/`:** avoids burying critical animation behavior inside random components.
- **`apps/`:** makes future built-in or contributed apps easy to reason about as modules.
- **`test-support/`:** creates stable selectors and helpers so Playwright coverage stays maintainable.

## Architectural Patterns

### Pattern 1: Manifest-Driven App Registry

**What:** Represent each app as metadata plus a render contract rather than wiring app launches with ad hoc conditionals.
**When to use:** Immediately from V1, because extensibility is a product requirement.
**Trade-offs:** Slightly more setup now, much less rewrite risk later.

**Example:**
```typescript
type AppId = "calculator" | "camera" | "messages";

type AppManifest = {
  id: AppId;
  label: string;
  iconAsset: string;
  availability: "ready" | "coming-soon";
  render: () => JSX.Element;
};
```

### Pattern 2: Functional Core, Imperative Shell

**What:** Keep layout selection, app transition decisions, and shell-state transitions pure; keep browser APIs and animation drivers in thin adapters.
**When to use:** For display-mode branching, viewport profile selection, and launch/dismiss state changes.
**Trade-offs:** Requires a little more discipline up front but makes the illusion-critical behavior testable.

**Example:**
```typescript
type ShellState =
  | { kind: "home" }
  | { kind: "opening"; appId: string }
  | { kind: "app"; appId: string }
  | { kind: "closing"; appId: string };

function launchApp(current: ShellState, appId: string): ShellState {
  if (current.kind !== "home") {
    return current;
  }

  return { kind: "opening", appId };
}
```

### Pattern 3: Derived Device Profile Tokens

**What:** Convert viewport and safe-area readings into a small set of layout tokens instead of scattering device math throughout components.
**When to use:** For dock spacing, icon sizes, grid density, status-bar spacing, and bottom Home-button placement.
**Trade-offs:** Requires an early profile model, but it prevents one-off per-component geometry hacks.

## Data Flow

### Request Flow

```text
[User Tap]
    ↓
[Home Screen Icon]
    ↓
[Launcher Action]
    ↓
[Runtime State Transition]
    ↓
[Motion Orchestrator]
    ↓
[App Shell Render]
    ↓
[App Module]
```

### State Management

```text
[Platform adapters]
    ↓
[Derived device profile]
    ↓
[Runtime/store]
    ↓
[Shell + Home Screen + App modules]
    ↺
[User actions update runtime/store]
```

### Key Data Flows

1. **Install-context flow:** browser launch → display-mode detection → onboarding or standalone shell.
2. **Launch flow:** icon tap → app registry lookup → launch state transition → animation → app shell mounted.
3. **Dismiss flow:** Home button tap → closing transition → home screen restored.
4. **Viewport flow:** viewport/safe-area update → device profile recomputed → shell layout tokens updated.
5. **Test flow:** Playwright action → stable selector → observable shell/runtime state → assertion.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users / 1-5 apps | Static hosting and a single client app are fine |
| 1k-100k users / 5-50 apps | Split app manifests from app implementations, enforce build validation, optimize asset loading |
| 100k+ users / 50+ apps | Add app-catalog APIs, contributor pipelines, stronger sandboxing, and more explicit runtime boundaries |

### Scaling Priorities

1. **First bottleneck:** visual fidelity maintenance across device sizes — fix with device profiles and regression tests.
2. **Second bottleneck:** app extensibility drift — fix with manifest contracts, runtime boundaries, and contributor validation.

## Anti-Patterns

### Anti-Pattern 1: One-Off Demo Wiring

**What people do:** Hard-code Calculator into the home screen and let components decide navigation ad hoc.
**Why it's wrong:** It makes the second app a rewrite and fights the project’s stated purpose.
**Do this instead:** Introduce an app registry and shell runtime now.

### Anti-Pattern 2: Geometry Logic Buried in Components

**What people do:** Compute safe-area, device, and icon spacing values inside arbitrary JSX files.
**Why it's wrong:** Responsive fidelity becomes impossible to reason about or test.
**Do this instead:** Centralize viewport and device-profile derivation in platform/domain modules.

### Anti-Pattern 3: Animation as Unstructured Side Effects

**What people do:** Attach transitions directly to DOM nodes without explicit runtime states.
**Why it's wrong:** Reversible app launch/dismiss behavior becomes flaky and hard to test.
**Do this instead:** Model transitions in state first, then let the shell animate that state.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Web App Manifest | Static manifest served with app | Controls installed-mode preferences and orientation hints |
| Service Worker | Build-time generated or manually authored | Supports installed-shell reliability and future offline behavior |
| Playwright | External browser automation against local/dev/preview builds | Must include WebKit runs because Safari parity is central |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `platform ↔ runtime` | Typed derived inputs | Keep browser APIs out of runtime logic |
| `runtime ↔ app-shell` | Explicit shell/app state | Avoid implicit UI-only routing |
| `runtime ↔ apps` | Manifest and lifecycle contracts | Future third-party or repo-submitted apps depend on this seam |
| `motion ↔ app-shell` | Transition plans and timing tokens | Prevent animation drift across the UI |

## Sources

- [PROJECT.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/PROJECT.md) — product constraints and long-term direction
- [Bright Builds core architecture standard](https://github.com/bright-builds-llc/coding-and-architecture-requirements/blob/main/standards/core/architecture.md) — functional core / imperative shell guidance
- [Bright Builds core code shape standard](https://github.com/bright-builds-llc/coding-and-architecture-requirements/blob/main/standards/core/code-shape.md) — structure and module-splitting guidance
- [Apple Safari Web Content Guide: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Apple Safari Web Content Guide: Configuring the Viewport](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [MDN: `display-mode` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode)

---
*Architecture research for: browser-native iPhone shell*
*Researched: 2026-03-31*
