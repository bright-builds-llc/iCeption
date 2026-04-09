# Phase 5: Calculator App Fidelity - Research

**Researched:** 2026-04-04
**Domain:** portrait iPhone calculator behavior, display rules, key layout, and runtime verification
**Confidence:** HIGH

<user_constraints>
## User Constraints (from project and roadmap context)

### Locked Decisions
- Calculator is the first and only implemented app in V1.
- The phase should focus on the standard portrait calculator only.
- Visual and behavioral authenticity both matter; this is not a cosmetic stub.
- The shell/runtime and motion system already exist, so Calculator should fit into them rather than bypass them.
- Basic UI-level tests remain part of the project’s quality bar.

### Claude's Discretion
- Exact internal architecture of calculator state and operations, as long as behavior is explicit and testable.
- Exact CSS and layout token use for the calculator surface, as long as it stays faithful to the portrait iPhone calculator feel.
- Exact test split between unit and UI-level coverage, as long as core behavior and the launched-app path are both protected.

### Deferred Ideas (OUT OF SCOPE)
- Scientific landscape calculator
- Additional implemented apps
- Rich calculator history or memory features
- Anything beyond the standard portrait interaction model
</user_constraints>

<research_summary>
## Summary

Phase 5 should treat Calculator as a small domain model first and a UI second. The most reliable implementation is a pure calculator-state reducer or action engine that handles digit entry, operator selection, chaining, clear/all clear, sign toggle, percent, decimal input, equals, and display formatting. The UI can then become a thin view over that state machine, which aligns well with the repo’s functional-core guidance and makes calculator correctness cheap to test.

The iPhone portrait calculator’s feel depends on three things: the display update rules, the input edge cases around decimals/operators/clear behavior, and the visual/key layout. That means this phase should be split between a pure calculator engine with high unit coverage, a faithful calculator UI/layout pass, and end-to-end/browser verification that the app launches through the shell and is actually usable inside the app surface.

**Primary recommendation:** Implement the Calculator as a pure action-driven state machine with focused unit coverage, then build a dedicated portrait calculator UI on top of it, and finally add browser-level checks that prove the launched Calculator path works through the existing openOS shell.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | Calculator app UI and key interactions | The shell/runtime already route Calculator through React app surfaces. |
| TypeScript | 6.0.2 | Typed calculator actions, state, and formatting rules | Makes edge-case behavior explicit and testable. |
| Vitest | 4.1.2 | High-signal unit tests for calculator logic | Best fit for the pure calculator engine and display formatting rules. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Existing app-surface/runtime shell | Current repo code | Calculator launch path and app framing | Reuse the shared app surface rather than special-casing Calculator. |
| Existing browser UI test stack direction | Existing repo plan | Later end-to-end shell verification | Use the future browser test phase to deepen coverage, but this phase can still add the first calculator-specific UI checks if practical. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Pure reducer/state machine for calculator logic | Put all rules directly in button handlers | Faster initially, but much harder to verify edge cases or change safely. |
| Shared button layout with typed button metadata | Hard-code each key inline in JSX | Inline JSX is workable, but metadata-driven layout is easier to audit and test. |
| Reusing the existing app surface | Calculator-only shell that bypasses `AppSurface` | Would undermine the runtime work already completed in prior phases. |

**Installation:**
```bash
# No new runtime libraries are required by default
pnpm test
pnpm build
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```text
src/
├── features/apps/calculator/
│   ├── calculatorState.ts
│   ├── calculatorState.test.ts
│   ├── calculatorButtons.ts
│   ├── CalculatorApp.tsx
│   └── calculator.css
└── features/runtime/
    └── AppSurface.tsx
```

### Pattern 1: Action-driven calculator state
**What:** Treat every key press as an action against a typed calculator state object.
**When to use:** Immediately, before revising the UI.
**Example:**
```typescript
type CalculatorAction =
  | { kind: "digit"; value: string }
  | { kind: "operator"; value: "+" | "−" | "×" | "÷" }
  | { kind: "equals" }
  | { kind: "clear" };
```

### Pattern 2: Button metadata drives layout
**What:** Keep the button grid in metadata so the UI and tests can share a stable mapping of labels and roles.
**When to use:** For the portrait keypad layout and styling.
**Example:**
```typescript
const keypadRows = [
  ["AC", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
];
```

### Pattern 3: Thin UI over pure display state
**What:** The React component reads display text, active operator state, and button metadata from the calculator domain layer, then renders them.
**When to use:** To keep the calculator logic testable and the UI focused on fidelity/layout.
**Example:**
```tsx
const state = reduceCalculator(state, action);
return <CalculatorDisplay value={state.display} />;
```

### Anti-Patterns to Avoid
- **Putting all calculator rules in button click handlers:** makes correctness harder to verify.
- **Bypassing the app surface/runtime shell:** would undo earlier launcher/runtime work.
- **Over-scoping into scientific or history features:** Phase 5 is still portrait standard calculator only.
- **Treating Calculator as “good enough” visually after correctness lands:** this phase explicitly requires visual authenticity too.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Ad hoc string manipulation for every display update | Inline display tweaks per button | Central display formatting logic in the calculator state module | Keeps decimal/operator/clear behavior consistent. |
| Layout directly from repeated button JSX | Copy-paste keypad rows in component body | Button metadata array | Easier to maintain and verify. |
| App launch bypass for Calculator | Render Calculator outside runtime/app-surface path | Keep Calculator mounted through the shared runtime | Preserves shell consistency and Phase 4 motion behavior. |

**Key insight:** The Calculator phase is mainly about correctness and fidelity inside an already-working shell, so the highest leverage is a pure behavior core plus a faithful UI layer.
</dont_hand-roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Clear vs All Clear behavior is oversimplified
**What goes wrong:** The app always resets everything or never behaves like the real calculator.
**Why it happens:** Clear behavior is treated as one boolean branch.
**How to avoid:** Model whether the current entry is active and when AC should downgrade to C semantics.
**Warning signs:** Repeated clear taps never change behavior.

### Pitfall 2: Percent and sign-toggle act on the wrong value
**What goes wrong:** `%` or `+/-` mutates the whole equation incorrectly.
**Why it happens:** The logic doesn’t distinguish current entry vs accumulated result.
**How to avoid:** Keep explicit state for current input and pending operator/result.
**Warning signs:** `%` or `+/-` behaves strangely after choosing an operator.

### Pitfall 3: Visual fidelity stops at “calculator-shaped”
**What goes wrong:** The keys work, but the app doesn’t feel like iPhone Calculator.
**Why it happens:** Layout, spacing, typography, and color are treated as secondary.
**How to avoid:** Reserve a dedicated UI pass for portrait key sizes, display typography, and key color hierarchy.
**Warning signs:** The keypad feels like a generic web calculator rather than an OS app.

### Pitfall 4: Shell/runtime path is bypassed for convenience
**What goes wrong:** Calculator works but no longer proves the runtime architecture.
**Why it happens:** The component is rendered directly to simplify testing or layout.
**How to avoid:** Keep Calculator inside the same app-surface and launcher path used by any future app.
**Warning signs:** Calculator opens differently from `coming-soon` apps at the shell boundary.
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Stable action kind
```typescript
type CalculatorAction = { kind: "digit"; value: string };
```

### Unit-testable transition
```typescript
const nextState = reduceCalculator(currentState, action);
```

### Button metadata
```typescript
const keypadRows = [["7", "8", "9", "×"]];
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Treating app demo logic as UI-only | Separate pure behavior from view rendering | Current component/app best practice | Better fit for correctness-heavy app features like Calculator. |
| Using generic calculator layouts | Build the app to the host platform’s visual hierarchy | Current design best practice | Phase 5 should feel like an iPhone app, not just a working keypad. |
| Saving e2e verification for the very end | Add narrow browser checks once the first real app lands | Current quality practice | Calculator is the right point to start proving a real app path works through the shell. |

**New tools/patterns to consider:**
- High-signal domain tests for button/action sequences.
- Metadata-driven keypad rendering for stable shell/UI behavior.

**Deprecated/outdated:**
- Inline ad hoc calculator rules inside React event handlers.
- Treating Calculator as just a placeholder with better styling.
</sota_updates>

<open_questions>
## Open Questions

1. **Should Phase 5 already add browser UI tests for calculator behavior, or leave those entirely to Phase 6?**
   - What we know: the project’s overall quality bar includes browser-level tests.
   - What's unclear: how much to land now versus the later dedicated verification phase.
   - Recommendation: add narrow calculator path/browser checks now if they materially prove the real app path, but keep the broader regression suite in Phase 6.

2. **How exact should calculator display formatting be for long values?**
   - What we know: basic portrait fidelity matters now.
   - What's unclear: whether edge-case overflow/scientific formatting needs to be pixel-faithful in this phase.
   - Recommendation: get core operator and display behavior faithful first, and treat extreme overflow polish as secondary unless it blocks the main feel.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Roadmap phase goal and requirements](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/ROADMAP.md) - locked phase objective and requirements
- [Current Calculator component](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/apps/calculator/CalculatorApp.tsx) - current placeholder baseline
- [Current runtime/app surface](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/src/features/runtime/AppSurface.tsx) - shell integration point
- [Apple Support: Use Calculator on iPhone](https://support.apple.com/en-eg/guide/iphone/iph1ac0b5cc/ios) - current official user-facing calculator behavior guidance

### Secondary (MEDIUM confidence)
- [Project research summary](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/research/SUMMARY.md) - overall app/runtime direction
- [Phase 3 runtime outputs](/Users/peterryszkiewicz/.codex/worktrees/19d1/iCeption/.planning/phases/03-home-screen-runtime/03-VERIFICATION.md) - current launcher/runtime behavior
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: calculator behavior/state, keypad layout, shell integration
- Ecosystem: existing runtime and motion layers
- Patterns: action-driven calculator state, metadata-driven keypad, shell-native app path
- Pitfalls: clear/AC semantics, percent/sign toggle behavior, shell bypass

**Confidence breakdown:**
- Standard stack: HIGH - existing stack supports the phase directly
- Architecture: HIGH - aligns with current runtime and shell boundaries
- Pitfalls: HIGH - driven by known calculator fidelity failure modes
- Code examples: MEDIUM - intentionally repo-specific and implementation-ready rather than copied from external docs

**Research date:** 2026-04-04
**Valid until:** 2026-05-04
</metadata>

---
*Phase: 05-calculator-app-fidelity*
*Research completed: 2026-04-04*
*Ready for planning: yes*
