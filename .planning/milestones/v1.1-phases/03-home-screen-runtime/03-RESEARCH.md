# Phase 3: Home Screen Runtime - Research

**Researched:** 2026-04-03
**Domain:** home-screen launcher runtime, app manifests, pressed-state interaction, and placeholder app surfaces
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Every app should have a stable runtime identity with `id`, `label`, `icon`, `placement`, `availability`, and `launch surface`.
- For this phase, `availability` should be only `implemented` or `coming-soon`.
- Dock membership should be explicit in the app model, not inferred from layout.
- Do not add badges, notification counts, folders, categories, or other richer shell metadata in this phase.
- Unimplemented apps should open as a true full-screen app surface, not a modal or card.
- The placeholder surface should feel calm and polished: app name, `Coming Soon`, one short utility sentence, and an intentional empty state.
- Placeholder apps should use the same shell framing as real apps so they already feel like part of the system.
- Placeholder apps should behave like any other app surface once opened, even before motion and Home-button behavior are implemented in later phases.
- Every visible icon should be launchable.
- No visible icons should have dead taps or disabled states in this phase.
- Taps should give a short pressed response first, then open immediately into either the implemented app or the placeholder app surface.
- Do not add long-press, edit mode, jiggle mode, drag-and-drop, or context menus in this phase.
- Calculator should be the only `implemented` app in Phase 3.
- Calculator should stay in the main grid, not the dock.
- The dock should be explicitly curated as `Phone`, `Browser`, `Messages`, and `Music`, even if those apps are still `coming-soon`.
- The rest of the visible home-screen apps remain `coming-soon`.
- The runtime-enabled home screen should feel intentionally composed rather than randomly filled.

### Claude's Discretion
- Exact shape of the runtime type definitions as long as the locked fields and semantics are preserved.
- Exact pressed-state visuals and timing for icon taps as long as they stay brief and immediate.
- Exact wording of the placeholder utility sentence.
- Exact visual composition of the empty state as long as it stays calm and polished.

### Deferred Ideas (OUT OF SCOPE)
- Home-button return behavior.
- App open/close motion transitions.
- Multiple implemented apps beyond Calculator.
- Badges, folders, edit mode, long-press interactions, or icon rearrangement.
</user_constraints>

<research_summary>
## Summary

Phase 3 should treat the existing home-screen icon data as the seed for a real app registry instead of replacing it with a second source of truth. The cleanest approach is to split runtime app definitions from shell presentation data just enough to make launch behavior explicit: a typed app manifest model, a small runtime state machine for `home` vs `open-app`, and a mapping layer that feeds the existing home-screen/dock presentation from runtime metadata rather than hard-coded arrays.

Because motion and Home-button return are explicitly deferred, the runtime surface in this phase should be intentionally simple: short pressed feedback, immediate state transition into a full-screen app surface, and a shared app-shell wrapper that can host both the implemented Calculator app and placeholder apps. The placeholder path should not be a modal or overlay; it should use the same full-screen route/surface shape the real app will use so Phase 4 can add motion without restructuring the runtime.

**Primary recommendation:** Build Phase 3 around a typed app registry plus a minimal launcher state model, reuse the current icon inventory as seeded runtime metadata, and introduce a shared app-surface wrapper that renders either Calculator or a polished `Coming Soon` full-screen placeholder.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Home-screen interaction and runtime surface composition | Existing shell and install flow are already React-based and componentized. |
| TypeScript | 6.0.2 | Typed app manifests and launcher state | Prevents ad hoc availability/placement state from spreading through the UI. |
| Vitest | 4.1.2 | Unit tests for runtime state and manifest helpers | Cheap way to verify app lookup, availability rules, and launch-state transitions. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Existing shell components | Current repo code | Shell presentation foundation | Reuse and refactor, do not rebuild the shell from scratch. |
| Existing icon data module | Current repo code | Seed app registry input | Use as a migration path into explicit runtime manifests. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Typed app registry + runtime state | Ad hoc booleans inside shell components | Faster initially, but becomes brittle before motion and multiple apps arrive. |
| Shared full-screen app wrapper | Separate one-off screens per app type | One-offs make Phase 4 motion and future apps harder to integrate. |
| Pressed-state interaction at the icon component level | Global click routing without local feedback | Global routing is simpler, but loses the intentional app-launch feel requested for this phase. |

**Installation:**
```bash
# No new runtime libraries required by default for this phase
pnpm test
pnpm build
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
src/
├── features/runtime/
│   ├── appRegistry.ts
│   ├── appRegistry.test.ts
│   ├── homeScreenRuntime.ts
│   ├── homeScreenRuntime.test.ts
│   ├── AppSurface.tsx
│   └── ComingSoonApp.tsx
├── features/shell/
│   ├── AdaptiveShellFoundation.tsx
│   ├── components/
│   │   ├── HomeScreenGrid.tsx
│   │   ├── Dock.tsx
│   │   └── AppIconButton.tsx
│   └── data/
│       └── homeScreenIcons.ts
└── features/apps/
    └── calculator/
        └── CalculatorApp.tsx
```

### Pattern 1: Registry-backed shell presentation
**What:** Keep a typed runtime registry as the source of truth, then derive grid/dock presentation from it.
**When to use:** Immediately, so shell layout and launchability stay in sync.
**Example:**
```typescript
type AppAvailability = "implemented" | "coming-soon";

type RuntimeApp = {
  id: string;
  label: string;
  placement: "grid" | "dock";
  availability: AppAvailability;
};
```

### Pattern 2: Minimal launcher state machine
**What:** Represent just enough launcher state for this phase: `home` or `open-app`.
**When to use:** Before motion exists, to keep runtime transitions explicit and testable.
**Example:**
```typescript
type LauncherState =
  | { kind: "home" }
  | { kind: "open-app"; appId: string };
```

### Pattern 3: Shared app-surface wrapper
**What:** Render both real apps and placeholder apps through the same full-screen shell surface.
**When to use:** Immediately, so Phase 4 can add motion and Home-button behavior to one shared boundary.
**Example:**
```tsx
<AppSurface app={app}>
  {app.availability === "implemented" ? <CalculatorApp /> : <ComingSoonApp app={app} />}
</AppSurface>
```

### Anti-Patterns to Avoid
- **Using the current icon arrays and a separate runtime registry independently:** that creates drift between visible icons and launch behavior.
- **Opening placeholder apps as modals or cards:** the user explicitly wants full-screen app surfaces.
- **Hiding non-implemented icons or making them inert:** the user explicitly wants all visible icons launchable.
- **Introducing motion logic early:** Phase 4 owns motion and Home-button return behavior.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Runtime identity in separate UI arrays and booleans | Duplicate state in grid/dock components | Single typed app registry | Keeps launch behavior and shell presentation aligned. |
| Placeholder app as a one-off overlay | Modal/overlay system for `Coming Soon` | Shared full-screen app surface wrapper | Matches the future app-runtime shape better. |
| Pressed-state timing scattered across components | Arbitrary CSS classes and timers everywhere | Small explicit icon-interaction state helper | Easier to keep the feedback brief and consistent. |

**Key insight:** The runtime should be explicit enough to support future apps, but still minimal enough that Phase 3 does not accidentally absorb Phase 4 motion or Phase 5 Calculator work.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Two sources of truth for app identity
**What goes wrong:** Shell layout and runtime launch behavior drift apart.
**Why it happens:** The home-screen icon arrays remain separate from the runtime registry.
**How to avoid:** Derive shell app rendering from the registry or a single seed that becomes the registry.
**Warning signs:** The grid shows icons the runtime does not know about, or vice versa.

### Pitfall 2: Placeholder apps feel like hacks
**What goes wrong:** The `Coming Soon` screens read as temporary overlays instead of legitimate app surfaces.
**Why it happens:** Placeholders are rendered as modals or ad hoc empty cards.
**How to avoid:** Route them through the same full-screen surface boundary as the real app.
**Warning signs:** Placeholder content visually floats above the shell instead of feeling like a launched app.

### Pitfall 3: Pressed feedback gets coupled to future motion
**What goes wrong:** Phase 3 interaction logic becomes entangled with transitions that are supposed to land in Phase 4.
**Why it happens:** The implementation tries to preview motion too early.
**How to avoid:** Keep Phase 3 pressed-state feedback short and local, with immediate open behavior.
**Warning signs:** Launch timing depends on transition orchestration that does not exist yet.

### Pitfall 4: Calculator gets special-cased again
**What goes wrong:** The runtime exists in name only because Calculator bypasses it.
**Why it happens:** The team wires Calculator directly rather than through the shared app surface and registry.
**How to avoid:** Make Calculator the first `implemented` app in the same runtime model as every placeholder app.
**Warning signs:** Calculator paths or shell behavior live outside the app registry and shared surface.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Minimal launcher-state transition
```typescript
type LauncherState =
  | { kind: "home" }
  | { kind: "open-app"; appId: string };
```

### Registry lookup for launchability
```typescript
function getLaunchableApp(apps: RuntimeApp[], appId: string): RuntimeApp | null {
  return apps.find((app) => app.id === appId) ?? null;
}
```

### Pressed-state-only interaction window
```typescript
const pressedDurationMs = 120;
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Treating shell layout and app identity as separate concerns | Unify presentation data and runtime metadata early | Current component/runtime best practice | Helps future launcher and motion work avoid refactors. |
| Letting empty-state placeholders be one-off overlays | Use shared surfaces for implemented and placeholder states | Current app-shell design practice | Keeps runtime shape stable as features deepen. |
| Using heavy router abstractions for tiny local runtimes | Keep launcher state local and explicit first | Current UI runtime practice | This phase does not yet need a larger routing layer. |

**New tools/patterns to consider:**
- Small typed state machines for launcher/runtime transitions.
- Derived icon-button presentation from runtime metadata instead of separate arrays.

**Deprecated/outdated:**
- Dead shell icons in interactive product demos.
- Ad hoc placeholder screens that do not use the same shell as real app surfaces.
</sota_updates>

<open_questions>
## Open Questions

1. **Should Phase 3 persist the last opened app?**
   - What we know: the user did not ask for persistence; the runtime only needs launch/open state in this phase.
   - What's unclear: whether restoring state across refresh would help or complicate the shell.
   - Recommendation: do not persist app-open state in Phase 3; keep runtime state session-local until motion and Home return behavior exist.

2. **How much shell chrome should the app surface include before Phase 4?**
   - What we know: placeholder and implemented apps should use the same full-screen framing.
   - What's unclear: whether the Phase 3 wrapper should show any top chrome beyond app identity.
   - Recommendation: keep the app surface calm and minimal, with just enough app identity to feel intentional, and defer additional shell controls to Phase 4.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Phase 3 context](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/03-home-screen-runtime/03-CONTEXT.md) - locked product/runtime decisions for this phase
- [Phase 2 shell implementation](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/shell/AdaptiveShellFoundation.tsx) - current shell scene and composition boundaries
- [Home-screen icon data](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/shell/data/homeScreenIcons.ts) - current shell content source

### Secondary (MEDIUM confidence)
- [Project research summary](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/SUMMARY.md) - prior architecture guidance on runtime boundaries
- [Phase 2 research](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/02-adaptive-shell-foundation/02-RESEARCH.md) - current shell composition assumptions
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: launcher runtime state, typed app registry, placeholder app surfaces
- Ecosystem: existing shell code, no new libraries required by default
- Patterns: registry-backed shell, shared app surface, minimal launcher state
- Pitfalls: dead taps, special-cased Calculator, overlay-based placeholders

**Confidence breakdown:**
- Standard stack: HIGH - existing React/TypeScript stack already supports this phase
- Architecture: HIGH - directly aligned with locked phase decisions and current shell code
- Pitfalls: HIGH - driven by the phase boundary and user requirements
- Code examples: MEDIUM - simple runtime patterns derived from current repo direction

**Research date:** 2026-04-03
**Valid until:** 2026-05-03
</metadata>

---
*Phase: 03-home-screen-runtime*
*Research completed: 2026-04-03*
*Ready for planning: yes*
