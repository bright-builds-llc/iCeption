# Pitfalls Research

**Domain:** browser-native iPhone-like installed web app
**Researched:** 2026-03-31
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Designing for One Screenshot-Sized Device

**What goes wrong:**
The shell looks great on one reference iPhone and obviously wrong on others. Icons clip, dock spacing drifts, or the custom Home button collides with bottom insets.

**Why it happens:**
Developers chase visual parity from a single mock or screenshot and hard-code geometry instead of deriving layout from viewport and safe-area data.

**How to avoid:**
Create device-profile tokens derived from viewport width/height, display mode, and safe-area insets. Verify on several portrait iPhone sizes early.

**Warning signs:**
Different iPhone sizes need ad hoc CSS patches, or components own their own geometry math.

**Phase to address:**
Phase 1 or the first shell-foundation phase.

---

### Pitfall 2: Treating Browser Mode and Installed Mode as the Same Product Surface

**What goes wrong:**
The app feels compromised everywhere: browser mode is cluttered, installed mode is under-optimized, and onboarding is absent.

**Why it happens:**
The team tries to make one layout satisfy both browser-tab browsing and installed standalone mode without acknowledging they are different states.

**How to avoid:**
Make installed standalone mode the primary experience. Use browser mode as an onboarding shell that detects context and guides users into “Open as Web App”.

**Warning signs:**
Status-bar treatment is inconsistent, browser controls are visibly fighting the layout, or users are expected to “just know” how to install it.

**Phase to address:**
Phase 1 or the install/runtime bootstrap phase.

---

### Pitfall 3: Building a Calculator Demo Instead of an App Runtime

**What goes wrong:**
V1 ships faster, but every future app addition requires reworking shell, routing, icon metadata, and lifecycle assumptions.

**Why it happens:**
It is tempting to hard-code the first app and promise to generalize later.

**How to avoid:**
Start with a real app registry, app shell contract, and manifest-like metadata, even if only Calculator is fully implemented.

**Warning signs:**
App identity is encoded in component names or routes rather than registry data, or placeholder apps have no real app representation.

**Phase to address:**
Phase 1 or the runtime-foundation phase.

---

### Pitfall 4: Unstructured Motion and Touch Behavior

**What goes wrong:**
App open/dismiss transitions feel janky, inconsistent, or impossible to reverse. Tests become flaky because timing is implicit.

**Why it happens:**
Animation logic gets sprinkled through components as incidental CSS or DOM effects instead of following explicit shell states and timing tokens.

**How to avoid:**
Model launcher states explicitly, centralize motion tokens, prefer transform/opacity-based transitions, and make tests assert stable post-transition states.

**Warning signs:**
Animation timing changes require editing many files, or launch/dismiss paths behave differently after small refactors.

**Phase to address:**
Phase 2 or the shell-motion phase.

---

### Pitfall 5: Skipping Real Browser UI Tests

**What goes wrong:**
The project looks correct in local manual testing but regresses silently across WebKit, safe-area cases, or interactive calculator flows.

**Why it happens:**
Animation-heavy UI projects often defer testing because visual behavior seems “too hard” to automate.

**How to avoid:**
Add lightweight Playwright coverage for the non-negotiable flows: context detection, home screen render, app launch, app dismissal, and calculator basics.

**Warning signs:**
No stable selectors, no WebKit test project, or every regression requires a human to re-check on device.

**Phase to address:**
Phase 2 or the first feature-delivery phase, not after launch.

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hard-coded per-device CSS constants | Faster first demo | Layout drift and maintenance pain across devices | Only for throwaway spikes, not committed architecture |
| One global shell state blob with implicit meanings | Quick initial wiring | Impossible-to-reason-about transitions and invalid states | Never; use explicit state variants |
| Placeholder icons that do nothing | Fast visual fill | Users lose trust immediately | Never; use a “Coming Soon” app surface |
| No real-device Safari verification | Faster local iteration | Viewport and install-mode bugs escape early | Only before the first shell checkpoint, not beyond it |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Manifest/display mode | Assuming requested display mode always equals actual mode | Check actual runtime via `display-mode` and handle fallbacks |
| iPhone install flow | Expecting browser users to auto-install like other platforms | Provide explicit onboarding and “Add to Home Screen” guidance |
| Service worker | Treating cache rules as an afterthought | Keep the shell predictable and verify update behavior early |
| WebKit testing | Relying on Chromium-only automation | Run Playwright with WebKit because Safari parity is central |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Layout-driven animations | Stutter during app open/dismiss | Favor transform/opacity and isolate geometry computation | Breaks visibly on mobile as soon as transitions stack |
| Oversized wallpaper/icon assets | Slow first render and jank on home screen | Optimize assets and preload only what the shell needs | Breaks on slower networks and repeated cold launches |
| Recomputing layout in many components | Inconsistent spacing and extra re-renders | Centralize device-profile derivation | Breaks as soon as more apps and shell variants exist |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Planning future arbitrary app installs without sandbox boundaries | Later remote code or trust issues become hard to unwind | Keep escape-hatch installs explicitly future-scope and design clear app boundaries first |
| Injecting untrusted app content directly into the shell | Cross-app contamination and XSS risk | Treat future third-party apps as isolated modules or sandboxed surfaces |
| Using trademark-heavy assets casually | Legal/IP pressure distracts from product progress | Keep visual inspiration high, but Apple marks out |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Browser-mode experience looks broken instead of transitional | Users bounce before installing | Make browser mode a deliberate onboarding surface |
| Custom Home button obscures calculator controls | Core interaction feels fake | Reserve bottom safe area for it and test on real iPhone sizes |
| Placeholder apps feel like bugs | Home screen stops feeling intentional | Give every unimplemented app a polished destination |
| Status bar treatment is ignored | The illusion collapses immediately | Treat the status bar as part of the product shell, not incidental chrome |

## "Looks Done But Isn't" Checklist

- [ ] **Home screen:** works on more than one portrait iPhone size — verify dock, safe areas, and icon spacing
- [ ] **Install flow:** browser users know how to add the app to the home screen — verify onboarding in Safari
- [ ] **Launch motion:** open and dismiss transitions are reversible and deterministic — verify with Playwright and manual mobile checks
- [ ] **Calculator:** layout survives keyboard/viewport changes and bottom safe area — verify on real mobile Safari/WebKit
- [ ] **Placeholder apps:** every tappable icon leads somewhere intentional — verify no dead taps remain
- [ ] **Tests:** WebKit coverage exists for the main flow — verify it runs in CI or local verification

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| One-device layout assumptions | MEDIUM | Introduce layout profiles, refactor geometry out of components, re-baseline snapshots/tests |
| Calculator-first architecture | HIGH | Extract app registry and shell contract, migrate existing app into it, then add tests |
| Motion drift | MEDIUM | Centralize timing/state, simplify transitions, add stable end-state assertions |
| Missing UI tests | LOW | Add selectors, write core Playwright flow tests, and keep the scope narrow |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| One-device layout assumptions | Phase 1 | Shell verified across multiple portrait iPhone sizes |
| Browser/install-mode confusion | Phase 1 | Browser onboarding and standalone shell both intentionally handled |
| Calculator demo architecture | Phase 1 | App registry exists before second app work begins |
| Motion drift | Phase 2 | Launch/dismiss states are explicit and tested |
| Missing UI tests | Phase 2 | Playwright covers main shell and calculator flows |

## Sources

- [Apple Support: Turn a website into an app in Safari on iPhone](https://support.apple.com/en-bw/guide/iphone/iphea86e5236/26/ios/26)
- [Apple Safari Web Content Guide: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Apple Safari Web Content Guide: Configuring the Viewport](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)
- [MDN: `display-mode` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode)
- [MDN: `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)
- [MDN: VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)
- [Playwright installation docs](https://playwright.dev/docs/intro)
- [PROJECT.md](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/PROJECT.md)

---
*Pitfalls research for: browser-native iPhone shell*
*Researched: 2026-03-31*
