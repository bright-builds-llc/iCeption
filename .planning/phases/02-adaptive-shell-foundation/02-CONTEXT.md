# Phase 2: Adaptive Shell Foundation - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the portrait iPhone shell primitives that let the home screen size and render convincingly across supported devices. This phase covers responsive shell geometry, status-bar treatment, home-screen composition, dock placement, wallpaper/material direction, and one default animated ambient background. It does not add app launching, runtime behavior, or user-selectable theme controls.

</domain>

<decisions>
## Implementation Decisions

### Viewport adaptation
- Use a hybrid sizing model: a small set of portrait iPhone layout profiles with light interpolation inside each profile.
- Treat safe areas and notch/home-indicator space as first-class layout inputs everywhere.
- Optimize for cross-device illusion over exact single-device pixel matching.
- On unusual portrait aspect ratios, compress spacing first, then adjust icon size slightly, and only reduce row density as a last resort.

### Status bar treatment
- Use a high-fidelity but not literal iPhone-like status bar.
- Show the familiar essentials only: time, signal/Wi-Fi style indicators, and battery indicator.
- Treat the status bar as part of the shell and integrate it visually with wallpaper and safe-area layout.
- Keep the status bar mostly presentational in this phase rather than dynamic.

### Home screen composition
- Use a classic iPhone-style app grid with fixed columns and stable row rhythm, not a loose responsive gallery.
- Keep icon labels always visible, centered, and restrained.
- Prioritize consistent rhythm over maximizing icon count.
- Treat the dock as a distinct material layer with its own spacing and safe-area-aware placement.
- Keep this phase focused on static shell composition only: grid, labels, dock, wallpaper relationship, status-bar alignment, and responsive spacing rules.

### Wallpaper and visual tone
- Use an original wallpaper and shell tone that feels premium, luminous, and iPhone-like without deriving from Apple artwork.
- Use restrained glass/frosted materials for shell surfaces such as the dock.
- Lean toward cool, cinematic tones that preserve strong icon and label legibility.
- The shell should feel like a believable operating-system surface, not a one-off landing page aesthetic.
- Phase 2 should ship one default animated ambient background.
- That background should feel slow, fluid, drifting, and nebula-like with no sharp pulses or obvious loops.
- Animation should stay subtle and continuous, with no device-motion parallax or touch-driven interaction in this phase.
- Respect reduced-motion preferences.

### Claude's Discretion
- Exact profile breakpoints and interpolation values for the hybrid layout model.
- Exact icon, label, dock, and spacing measurements within the approved adaptation rules.
- Exact visual styling of the non-literal status indicators.
- Exact implementation technique for the animated background, as long as the motion stays subtle and performant.
- Exact default palette choice for the first animated background.

</decisions>

<specifics>
## Specific Ideas

- The shell should feel convincingly iPhone-like across the portrait iPhone range rather than perfectly matching one screenshot-sized device.
- The status bar may visually clash with native iOS standalone status content, so this phase should explicitly research and validate that interaction before treating the status treatment as final.
- Ambient background directions the user likes: lavender, orange, and blue-green.
- The animated background should feel liquid or nebula-like rather than geometric or obviously looped.

</specifics>

<deferred>
## Deferred Ideas

- User-selectable ambient background presets — future phase.
- User-customizable background palette derived from a chosen anchor color — future phase.
- Multiple animated ambient backgrounds active in the product at once — future phase beyond the single default background for Phase 2.

</deferred>

---
*Phase: 02-adaptive-shell-foundation*
*Context gathered: 2026-04-03*
