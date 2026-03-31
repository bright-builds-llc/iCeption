# Stack Research

**Domain:** high-fidelity mobile web app shell that imitates iPhone/iOS behavior
**Researched:** 2026-03-31
**Confidence:** MEDIUM

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.4 | Component UI for home screen, app chrome, status bar, and app surfaces | React is current, component-oriented, and well-suited for a runtime where apps, shell chrome, and placeholder states all need to compose cleanly. |
| TypeScript | 6.0.2 | Typed app manifests, launcher state, layout profiles, and motion contracts | The project needs illegal states to be harder to represent, especially around app registration, routeability, and shell state. |
| Vite | 8.0.3 | Frontend dev server, build pipeline, and asset handling | Vite is the current fast web build tool, works cleanly with React and TypeScript, and keeps iteration speed high for animation-heavy UI work. |
| Web App Manifest + Service Worker | Platform standard | Installed web-app behavior, home-screen install metadata, and offline shell capability | The primary product experience is an installed fullscreen web app on iPhone, so manifest-driven install behavior and service-worker support are core platform primitives, not optional extras. |
| Web platform layout primitives (`viewport`, `env()`, `display-mode`, `VisualViewport`) | Platform standard | Safe areas, fullscreen detection, orientation control, and keyboard/viewport adaptation | The illusion depends on correct handling of iPhone viewport behavior, safe insets, installed-mode branching, and visual viewport changes. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@vitejs/plugin-react` | 6.0.1 | React integration for Vite | Use by default with React on Vite. |
| `vite-plugin-pwa` | 1.2.0 | Manifest injection, service-worker integration, and PWA update ergonomics | Use if bootstrap validation confirms the plugin behavior matches the install/offline model you want; otherwise hand-roll manifest and service worker for tighter control. |
| Vitest | 4.1.2 | Fast unit tests for pure layout, manifest, and launcher logic | Use for functional-core coverage around app registry, layout profile selection, animation state derivation, and manifest/domain parsing. |
| `@playwright/test` | 1.58.2 | Browser UI tests across Chromium, Firefox, and WebKit with mobile Safari emulation | Use from the first milestone for the illusion-critical flows: install-mode branches, home screen rendering, app launch, dismiss, and calculator interactions. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm | Package management | Matches repo-level standards unless another lockfile exists; good default for a greenfield TypeScript repo. |
| Safari Web Inspector | Real-device debugging for iPhone viewport, installed mode, and touch behavior | Necessary once the illusion work reaches real iPhone testing. |
| Playwright HTML reports and traces | Regression debugging for UI behavior | Especially useful for animation timing drift and viewport-specific failures. |

## Installation

```bash
# Core
pnpm add react react-dom

# Supporting
pnpm add -D typescript vite @vitejs/plugin-react vitest @playwright/test

# Optional PWA integration helper
pnpm add -D vite-plugin-pwa

# Types and browsers
pnpm add -D @types/react @types/react-dom
pnpm exec playwright install --with-deps
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite | Next.js | Use Next.js only if the product quickly adds server-rendered marketing pages, authenticated backend workflows, or app-catalog APIs that justify the extra framework surface. |
| React | SvelteKit | Use SvelteKit if the team strongly prefers it and is willing to rework the ecosystem/testing guidance; otherwise React has the deepest tooling runway for a future UIKit-like component layer. |
| `vite-plugin-pwa` or hand-rolled manifest/SW | Fully hand-rolled manifest and service worker from day one | Use manual wiring if install/offline behavior needs very custom service-worker control or if plugin compatibility becomes uncertain during bootstrap. |
| Vitest | Jest | Use Jest only if a future shared toolchain mandates it; Vitest fits Vite better and keeps configuration thinner. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| SSR-first architecture for V1 | The first milestone is an installed client-side shell, not a server-heavy product, so SSR adds surface area before it buys meaningful value | Vite + client-rendered shell with room to add APIs later |
| Canvas/WebGL-first UI shell | This project needs DOM semantics, CSS safe-area behavior, accessible text/layout, and testable element-level interaction | DOM + CSS + React components |
| Hard-coded single-device pixel layouts | The product must adapt across portrait iPhone sizes, so one-device constants will break the illusion quickly | Layout profiles derived from viewport and safe-area measurements |
| Calculator-specific one-off routing | It solves the demo but fights the long-term open app runtime vision | Manifest-driven app registry and launcher model |

## Stack Patterns by Variant

**If V1 remains fully client-only:**
- Use Vite + React + TypeScript.
- Because the product is primarily an immersive shell and app runtime, not a backend-heavy application.

**If the project later adds a real app catalog, moderation, or authenticated publishing:**
- Keep the shell as a client application and add a separate backend or hosted API layer.
- Because the runtime and the app-store/governance layer evolve at different speeds and should not be tightly coupled too early.

**If installed-mode fidelity becomes the main differentiator:**
- Prefer manual manifest, icon, splash, and service-worker control over excessive abstractions.
- Because iPhone/PWA edge cases often need explicit tuning and real-device verification.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `react@19.2.4` | `@vitejs/plugin-react@6.0.1` | Current React + Vite plugin pairing is the default React-on-Vite path. |
| `vite@8.0.3` | `vitest@4.1.2` | Vitest explicitly supports unified configuration with Vite. |
| `@playwright/test@1.58.2` | Current Node LTS and WebKit/Chromium/Firefox browsers | Good fit for cross-browser browser automation, including WebKit for Safari-like behavior. |
| `vite-plugin-pwa@1.2.0` | Vite ecosystem | Validate during bootstrap if you choose the plugin path; otherwise fall back to explicit manifest/SW wiring. |

## Sources

- [Vite](https://vite.dev/) — verified current docs branch and Vite positioning as the current web build tool
- [React](https://react.dev/) — verified current major version and React’s component model
- [TypeScript docs](https://www.typescriptlang.org/docs/) — verified current TypeScript documentation surface
- [Playwright installation docs](https://playwright.dev/docs/intro) — verified cross-browser support, mobile Safari/WebKit coverage, and reporting workflow
- [Vitest guide](https://vitest.dev/guide/) — verified unified configuration with Vite
- [Apple Safari Web Content Guide: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) — verified standalone mode, status bar handling, and Apple touch icon behavior
- [Apple Safari Web Content Guide: Configuring the Viewport](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html) — verified `device-width` guidance for iPhone web apps
- [Apple Support: Turn a website into an app in Safari on iPhone](https://support.apple.com/en-bw/guide/iphone/iphea86e5236/26/ios/26) — verified current user-facing install flow and “Open as Web App”
- [MDN: `display` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display) — verified display-mode semantics and fallback behavior
- [MDN: `display-mode` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode) — verified detection of installed/standalone/fullscreen contexts
- [MDN: `orientation` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/orientation) — verified portrait preference behavior
- [MDN: `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env) — verified safe-area inset handling
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport) — verified viewport/keyboard adaptation primitives

---
*Stack research for: iPhone-like installed mobile web app shell*
*Researched: 2026-03-31*
