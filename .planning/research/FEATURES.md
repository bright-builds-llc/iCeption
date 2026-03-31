# Feature Research

**Domain:** browser-native iPhone-like home-screen and app runtime
**Researched:** 2026-03-31
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Fullscreen install/onboarding flow | The illusion is much weaker if users stay inside normal browser chrome | MEDIUM | Use browser mode as onboarding shell and installed mode as the primary experience |
| Convincing home screen shell | The project starts on the home screen, so icon grid, wallpaper, dock, and status bar are the first trust test | HIGH | Must adapt across portrait iPhone sizes |
| App launch and dismiss motion | iOS-like motion is part of the product promise, not cosmetic polish | HIGH | Needs deterministic timing, reversible states, and touch responsiveness |
| Working portrait Calculator | Users immediately judge authenticity when interacting with the only real app in V1 | HIGH | Behavior matters as much as visuals |
| Safe-area aware layout | Notches, bottom insets, and viewport changes are impossible to ignore in this product | MEDIUM | Required for dock, status bar, and custom Home control |
| Placeholder behavior for unimplemented apps | A realistic home screen with dead icons feels broken | MEDIUM | Full-screen “Coming Soon” states preserve the illusion |
| Basic browser UI tests | The user explicitly wants proof that critical flows keep working | MEDIUM | Playwright should cover launch, dismiss, and calculator basics |

### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Extensible internal app runtime | Prevents the project from becoming a one-off Calculator demo | HIGH | Enables app registry, future app store, and third-party app surfaces |
| UIKit-like web component layer | Lets future apps share consistent shell, motion, and layout primitives | HIGH | Should emerge from the shell/runtime instead of being bolted on later |
| Repo-driven app distribution model | Creates an open ecosystem story distinct from Apple’s walled garden | HIGH | Future milestone; not needed to validate V1 |
| Escape hatch for arbitrary virtual apps | Makes the platform materially more open than native iOS | HIGH | Strong sandboxing and trust decisions needed later |
| Size-flexible iPhone fidelity | Supporting many portrait iPhone sizes without losing the illusion is itself a differentiator | HIGH | Requires device profiles and responsive tokens rather than fixed comps |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Landscape mode in V1 | Seems like “completeness” | Doubles layout and calculator surface area before the core illusion is proven | Lock V1 to portrait and revisit after the shell feels authentic |
| Literal Apple branding/logos | Feels more authentic at first glance | Raises avoidable IP/trademark pressure without improving core interaction fidelity | Use close interaction patterns without Apple marks |
| Dead placeholder icons | Quick way to fill the grid | Breaks trust immediately when tapped | Show a polished “Coming Soon” full-screen app state |
| Calculator-only architecture | Fastest demo path | Guarantees a rewrite once the second app arrives | Start with an app registry and app shell contract |
| Overly broad V1 system surface | Tempting when imitating an OS | Widgets, lock screen, notifications, and pages dilute the first milestone | Home screen + runtime + Calculator first |

## Feature Dependencies

```text
Installed fullscreen mode
    └──requires──> Manifest + icon + onboarding flow
                           └──requires──> Browser-mode detection

App runtime
    └──requires──> App registry + shell state
                           ├──requires──> Home screen launcher
                           └──requires──> Placeholder app surface

Calculator authenticity
    └──requires──> Stable app shell + input handling + responsive metrics

Basic UI tests
    └──requires──> Deterministic selectors + stable motion states
```

### Dependency Notes

- **Installed fullscreen mode requires manifest, icon, and onboarding flow:** the illusion depends on users entering through the installed-web-app path.
- **App runtime requires an app registry and shell state:** future extensibility is a requirement, so the launcher cannot just push one hard-coded screen.
- **Calculator authenticity requires a stable app shell:** if launch/dismiss mechanics are wrong, the app never feels like part of an OS.
- **Basic UI tests require deterministic selectors and motion states:** flaky animation-driven tests will be ignored and lose value.

## MVP Definition

### Launch With (v1)

- [ ] Installed-web-app onboarding and standalone-mode detection — essential because fullscreen usage is the primary experience
- [ ] Realistic home screen with full app grid, dock, wallpaper feel, and status bar treatment — essential because it is the first thing users judge
- [ ] Extensible app registry/runtime — essential because the project’s purpose is larger than one app
- [ ] App launch/dismiss motion and custom Home control — essential because shell interaction is the product
- [ ] Working portrait Calculator — essential because it validates both fidelity and extensibility
- [ ] Polished “Coming Soon” screen for unimplemented apps — essential because placeholder taps must still feel intentional
- [ ] Basic Playwright UI tests for core flows — essential because fidelity regressions will otherwise accumulate silently

### Add After Validation (v1.x)

- [ ] More built-in apps — add once the runtime and shell patterns are stable
- [ ] Multi-page home screen behavior — add once one-page launch/dismiss mechanics feel authentic
- [ ] Better onboarding, tips, and install education — add after first real-user feedback
- [ ] More precise motion tuning and haptics-inspired feedback — add once baseline behavior is correct

### Future Consideration (v2+)

- [ ] UIKit-like public component/runtime layer — defer until the shell primitives settle
- [ ] Repo-submitted app catalog / “App Store” workflow — defer until the app model proves itself internally
- [ ] Escape hatch for arbitrary virtual apps — defer until trust, sandbox, and packaging boundaries are better understood
- [ ] Notifications, lock screen, widgets, and broader system surfaces — defer until the core home-screen/app-shell illusion is validated

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Fullscreen onboarding + installed mode | HIGH | MEDIUM | P1 |
| Responsive home screen shell | HIGH | HIGH | P1 |
| Extensible app runtime | HIGH | HIGH | P1 |
| App motion + Home control | HIGH | HIGH | P1 |
| Working portrait Calculator | HIGH | HIGH | P1 |
| “Coming Soon” placeholder apps | MEDIUM | LOW | P1 |
| Basic Playwright UI tests | HIGH | MEDIUM | P1 |
| Multi-page home screen | MEDIUM | MEDIUM | P2 |
| More built-in apps | MEDIUM | MEDIUM | P2 |
| Repo-driven app catalog | HIGH | HIGH | P3 |
| Escape-hatch app installs | HIGH | HIGH | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Installed experience | iOS native apps launch from the home screen with app identity and no browser chrome | Typical mobile websites stay inside the browser tab | Treat installed standalone mode as the real product and browser mode as onboarding |
| Home screen realism | iOS home screen is cohesive and immediately legible | Many web “OS demos” look like themed websites rather than system shells | Prioritize layout, dock feel, safe areas, and motion before adding more apps |
| App extensibility | Native iOS has a real app runtime and catalog | Most web demos hard-code one or two experiences | Start with an app registry and shell contract from V1 |
| Quality verification | Native system apps benefit from mature platform QA | Many demos have no regression protection for motion or viewport behavior | Add lightweight browser UI tests from the first milestone |

## Sources

- [Apple Support: Turn a website into an app in Safari on iPhone](https://support.apple.com/en-bw/guide/iphone/iphea86e5236/26/ios/26)
- [Apple Safari Web Content Guide: Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Apple Safari Web Content Guide: Configuring the Viewport](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)
- [MDN: `display` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/display)
- [MDN: `display-mode` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode)
- [MDN: `orientation` manifest member](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/orientation)
- User-provided product direction from PROJECT.md

---
*Feature research for: browser-native iPhone shell*
*Researched: 2026-03-31*
