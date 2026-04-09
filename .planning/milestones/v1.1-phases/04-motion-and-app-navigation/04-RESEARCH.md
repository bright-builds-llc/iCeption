# Phase 4: Motion and App Navigation - Research

**Researched:** 2026-04-04
**Domain:** same-document app-launch transitions, icon-origin animation, home-return navigation, and reduced-motion fallbacks
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Use a near-literal iOS-style zoom-open transition rather than a stylized custom animation.
- The transition should start from the tapped icon’s position and scale into the full-screen app surface.
- Keep the timing fast and calm, roughly `220–260ms` on open and slightly quicker on close.
- The existing pressed-state feedback should remain and hand off immediately into the open transition.
- Use a small centered pill above the bottom safe area, not a large or loud button.
- Show the Home button only while an app is open.
- Keep it visually restrained and glass-like: clearly tappable but secondary to app content.
- Tapping it should reverse the app-open transition back to the home screen rather than hard-cutting away.
- Use one shared outer container transition system for Calculator and `Coming Soon` apps.
- The outer open/close motion should be identical regardless of app type.
- Any differences between app types should stay inside the app content after the container opens, not in the launcher transition itself.
- Do not add app-specific transition exceptions in this phase.
- Respect `prefers-reduced-motion` automatically.
- Replace the zooming transition with a very short fade or minimal opacity/scale shift.
- Keep navigation behavior identical; only simplify the visual travel.
- The Home button should still appear and disappear, but without noticeable flourish.

### Claude's Discretion
- Exact easing curves within the approved near-literal iOS direction.
- Exact timing split between pressed-state handoff and container transition.
- Exact styling of the Home pill as long as it stays restrained and centered.
- Exact reduced-motion fallback values as long as the result is clearly gentler than the default path.

### Deferred Ideas (OUT OF SCOPE)
- Gesture-driven home swipe or edge-swipe navigation.
- App-specific transition styles.
- Long-press, edit mode, or other secondary shell interactions.
- Any richer motion choreography inside apps beyond the shared container transition.
</user_constraints>

<research_summary>
## Summary

Phase 4 should use a shared transition controller rather than burying motion state inside individual icon or app components. The best-fit implementation on the current stack is a hybrid approach: use the View Transition API when it is available, because it is now baseline-new and same-document view transitions are supported in modern Safari/WebKit, but keep a deterministic fallback path based on local runtime state and CSS `transform`/`opacity` transitions so the app still behaves correctly when view transitions are unavailable or when reduced motion is requested.

The key technical requirement is capturing the tapped icon’s geometry at the moment of interaction. `getBoundingClientRect()` is the simplest reliable primitive for that, and it lets the runtime store enough source metadata to animate from the icon’s position into the full-screen app surface. Since the existing shell already has a short pressed-state delay, the motion layer should piggyback on that handoff rather than introduce a second staged interaction system.

The Home pill should live in the shared app-surface wrapper, not in individual apps, so every app closes through the same boundary. Reduced motion should not change navigation semantics; it should only replace the zoom travel with a much gentler fade/minimal-scale transition. That means the runtime should resolve a motion mode before any navigation begins and use the same state machine for both normal and reduced-motion paths.

**Primary recommendation:** Build a shared motion/navigation state layer that stores source icon geometry and motion mode, use `document.startViewTransition()` when available with a CSS fallback, and put the Home pill in the shared app surface so open and close both use one reversible system.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Shared transition/controller state and app-surface composition | The shell/runtime already lives in React; state transitions are local and UI-driven. |
| TypeScript | 6.0.2 | Typed motion state, source geometry, and reduced-motion resolution | Prevents ad hoc transition flags from spreading through the UI. |
| View Transition API | Platform standard | Same-document SPA transitions when supported | Baseline-new in 2025 and supported in modern Safari/WebKit, which aligns with the iPhone-first target. |
| CSS transitions/transforms | Platform standard | Deterministic fallback for open/close motion | Reliable fallback path and still appropriate for reduced-motion behavior. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `getBoundingClientRect()` | Platform standard | Capture tapped icon origin geometry | Use at interaction time to anchor transitions from the icon’s viewport rect. |
| `prefers-reduced-motion` | Platform standard | Motion accessibility | Resolve motion mode before navigation and simplify travel when needed. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Shared motion controller + View Transition/fallback hybrid | CSS-only class toggles everywhere | Simpler at first, but too brittle for reversible open/close transitions and icon-origin metadata. |
| View Transition API with fallback | Introduce a dedicated animation library | A library could help later, but current shell/runtime complexity does not require one for this phase. |
| Shared Home pill in app surface | Per-app close buttons | Per-app buttons would fragment the navigation model before Calculator fidelity work. |

**Installation:**
```bash
# No new dependencies required by default
pnpm test
pnpm build
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
src/
├── features/motion/
│   ├── homeNavigationMotion.ts
│   ├── homeNavigationMotion.test.ts
│   ├── supportsViewTransitions.ts
│   ├── MotionLayer.tsx
│   └── motionNavigation.css
├── features/runtime/
│   ├── AppSurface.tsx
│   └── runtimeShell.css
├── features/shell/
│   ├── AdaptiveShellFoundation.tsx
│   └── components/
│       ├── AppIconButton.tsx
│       └── HomePill.tsx
```

### Pattern 1: Explicit navigation-motion state
**What:** Extend runtime state with the minimum motion-specific states required for Phase 4: opening, open, and closing.
**When to use:** Before adding any real transition visuals, so open and close stay reversible and consistent.
**Example:**
```typescript
type MotionState =
  | { kind: "home" }
  | { kind: "opening"; appId: string; sourceRect: DOMRectReadOnly | null }
  | { kind: "open-app"; appId: string }
  | { kind: "closing"; appId: string; targetRect: DOMRectReadOnly | null };
```

### Pattern 2: View Transition API when available, CSS fallback otherwise
**What:** Use `document.startViewTransition()` for browsers that support it, and fall back to explicit CSS transform/opacity state when they do not.
**When to use:** For the shared container open/close transition.
**Example:**
```typescript
if (document.startViewTransition) {
  document.startViewTransition(updateDomState);
} else {
  updateDomState();
}
```

### Pattern 3: Shared app-surface chrome
**What:** Put the Home pill and outer transition shell in the shared app-surface wrapper instead of inside Calculator or placeholder content.
**When to use:** Immediately, so all app types share the same navigation affordance.
**Example:**
```tsx
<AppSurface app={app} onHome={closeApp}>
  {children}
</AppSurface>
```

### Anti-Patterns to Avoid
- **App-specific transition branches:** the outer container motion must be the same for Calculator and `Coming Soon`.
- **Hard cut close behavior:** Phase 4 explicitly requires a reverse-to-home close motion.
- **Motion state buried in AppIconButton:** icon interaction should trigger motion, not own the navigation system.
- **Reduced motion as a separate navigation path:** keep the same open/close state machine and only reduce the visual travel.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Browser support guesswork for view transitions | UA parsing or hand-maintained browser lists | Feature detection with `document.startViewTransition` | The feature presence is what matters, not guessed browser identity. |
| Source icon geometry from hard-coded layout math | Derive origin from profile constants | `getBoundingClientRect()` at interaction time | Actual DOM geometry is more reliable than reconstructing it. |
| Separate reduced-motion navigation stack | Forked open/close implementation | Shared state machine with motion-mode resolution | Keeps behavior consistent while simplifying the visuals only. |

**Key insight:** The motion phase should add a reversible transition layer on top of the existing launcher, not rewrite the launcher around animation assumptions.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Icon-origin motion not actually coming from the tapped icon
**What goes wrong:** The app still opens from a generic center zoom, which breaks the illusion.
**Why it happens:** The implementation does not capture the tapped icon’s DOM rect at interaction time.
**How to avoid:** Capture the source rect from the icon element and pass it into the transition controller.
**Warning signs:** Every app opens from the same place regardless of which icon was tapped.

### Pitfall 2: Close transition implemented as a hard state reset
**What goes wrong:** Opening feels premium but closing feels like a route change.
**Why it happens:** The Home button bypasses the motion controller.
**How to avoid:** Use the same transition controller for open and close, with the close path explicitly reversing the home/app swap.
**Warning signs:** The Home button instantly resets the shell with no reversible transition.

### Pitfall 3: Reduced motion accidentally changes behavior
**What goes wrong:** Users with reduced motion get different navigation semantics, not just softer animation.
**Why it happens:** Reduced motion is implemented as a separate code path instead of a motion-mode input to the same state machine.
**How to avoid:** Keep state transitions identical and reduce only the visual effects.
**Warning signs:** Reduced-motion mode skips steps or changes which UI appears when.

### Pitfall 4: Home pill becomes too prominent
**What goes wrong:** The workaround control dominates the app surface and breaks the illusion.
**Why it happens:** The button is styled like a primary action instead of secondary shell chrome.
**How to avoid:** Keep it small, centered, translucent, and always subordinate to app content.
**Warning signs:** The Home pill visually competes with app headers or content.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### View Transition feature detection
```typescript
if (document.startViewTransition) {
  document.startViewTransition(() => {
    // update DOM state
  });
}
```

### Source icon geometry capture
```typescript
const rect = element.getBoundingClientRect();
```

### Reduced-motion CSS branch
```css
@media (prefers-reduced-motion: reduce) {
  .transition-layer {
    transition-duration: 120ms;
    transform: none;
  }
}
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Build all SPA transitions manually | Use View Transition API when available and keep a fallback | Baseline 2025 | Shared open/close transitions can be simpler and more native-feeling on modern browsers. |
| Treat Safari/WebKit as lacking same-document view transitions | Same-document view transitions shipped in Safari 18.0 | WebKit Interop 2025 work | The primary platform can use native transitions when available. |
| Motion accessibility added after animations exist | Resolve `prefers-reduced-motion` upfront | Current accessibility baseline | Reduced-motion fallback should be designed in, not patched on later. |

**New tools/patterns to consider:**
- `document.startViewTransition()` for same-document transitions.
- Typed transition `kind`s/`types` if different open/close styling needs to be distinguished later.

**Deprecated/outdated:**
- Assuming iPhone Safari cannot do same-document view transitions.
- Treating all SPA motion as manual CSS-only work by default.
</sota_updates>

<open_questions>
## Open Questions

1. **Should Phase 4 keep the app surface mounted during close until motion completes?**
   - What we know: reverse motion feels best if the app surface remains present until the transition ends.
   - What's unclear: whether the implementation will prefer DOM continuity or a simpler state swap plus view-transition fallback.
   - Recommendation: plan for DOM continuity through the close transition so the reverse motion can feel intentional.

2. **How should the Home pill behave during reduced motion?**
   - What we know: it should still appear/disappear without flourish.
   - What's unclear: whether the best reduced-motion behavior is a near-instant fade or a minimal opacity/scale transition.
   - Recommendation: use a very short fade with little or no scale change.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Phase 4 context](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/04-motion-and-app-navigation/04-CONTEXT.md) - locked product decisions for this phase
- [MDN: `Document.startViewTransition()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) - same-document transition API and fallback pattern
- [MDN: `ViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition) - active transition lifecycle and control surface
- [WebKit: Interop 2025 review](https://webkit.org/blog/17808/interop-2025-review/) - Safari same-document View Transition support context
- [MDN: `Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) - icon-origin geometry capture
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) - motion accessibility behavior
- [MDN: `transform`](https://developer.mozilla.org/docs/Web/CSS/transform) - transform-based fallback motion primitives
- [MDN: `transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition) - CSS transition fallback primitives

### Secondary (MEDIUM confidence)
- [Current shell/runtime code](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/shell/AdaptiveShellFoundation.tsx) - current launcher structure and interaction timing
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: launcher open/close transitions and reversible app navigation
- Ecosystem: View Transition API, CSS transform/opacity fallback, reduced-motion behavior
- Patterns: icon-origin geometry capture, shared Home pill, reversible transition controller
- Pitfalls: hard-cut close, generic center zoom, reduced-motion behavior drift

**Confidence breakdown:**
- Standard stack: HIGH - no new dependency is required
- Architecture: HIGH - directly aligned with current runtime boundaries
- Pitfalls: HIGH - driven by the phase goal and current launcher shape
- Code examples: HIGH - based on current official web platform APIs

**Research date:** 2026-04-04
**Valid until:** 2026-05-04
</metadata>

---
*Phase: 04-motion-and-app-navigation*
*Research completed: 2026-04-04*
*Ready for planning: yes*
