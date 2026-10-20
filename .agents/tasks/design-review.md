# Design Review (Re-review) — Drone-Tech Portfolio ("Mission Control / HUD")

Reviewed document: `.agents/tasks/design.md` (revised)
Reviewer context: fresh read, verified against the actual scaffold and installed dependencies in the workspace (`package.json`, `node_modules`, `tailwind.config.js`, `src/`).

## Summary

This is the second pass over the revised design. All twelve findings from the prior review have been genuinely addressed in the design body itself (not merely logged as "addressed"): the Tailwind color group collision is gone (single `hud` group, text ramp folded in), the camelCase `cyanSoft`/`amberSoft` keys are removed from the color map and kept as raw hex, `StaticHudHero` and `CanvasErrorBoundary` are now first-class components in the tree with defined contracts, the telemetry reducer and `validateContact` have explicit, testable specifications, `useFocusTrap` and `useDeviceTier`/`computeTier` are specified with guards, and the scaffold rewrites are now called out explicitly in a dedicated §6. The gallery is uniform-grid, the CLASSIFIED chip color and VIEW LOG behavior are defined, and fonts moved from CSS `@import` to `<link>` preconnect.

I re-verified every load-bearing external assumption against the installed packages and the live scaffold. They all hold: stack versions match, drei `Float`/`Environment` exist in 9.122.0, `tabular-nums` exists in Tailwind 3.4, the scaffold is a blank starter, and `main.jsx` wraps in StrictMode.

The remaining issues are minor. I found no HIGH or MEDIUM blockers. Three NITs are noted below (resize re-tiering, a redundant-but-harmless backdrop class, and an unspecified "clock" source in the navbar). None of these would block a coder from producing a correct, complete implementation.

Verdict is mechanical: HIGH + MEDIUM finding count is zero → **APPROVED**.

---

## Findings

### 1. NIT — Device tier is computed once and never re-evaluated on resize/orientation change
**Where:** §3 "Device tiering" (`useDeviceTier` reads `window.innerWidth` once); §5 Tier 2 (`width<=768`).

**Problem:** `useDeviceTier` reads `window.innerWidth` at mount. A desktop user who narrows the window below 768px, or a tablet rotated between portrait/landscape, keeps the tier chosen at first render. Because the hero is decorative and the DPR/parallax deltas between tiers are subtle, this is not a correctness blocker — but a coder may wonder whether a resize listener is expected.

**Fix:** State explicitly that tiering is intentionally computed once at mount (no resize listener) for simplicity, OR add a debounced `resize` listener in `useDeviceTier` that recomputes `computeTier(...)`. Pick one and note it in §3 so the behavior is deliberate, e.g.:
> Tier is evaluated once at mount; the page is not expected to re-tier on resize (acceptable for a decorative hero).

### 2. NIT — Backdrop grid example markup double-specifies the background size
**Where:** §1 "Backdrop grid composition" example:
`<div class="... bg-grid-fine [background-size:40px_40px] animate-grid-drift ...">`

**Problem:** `theme.extend.backgroundSize['grid-fine']` already defines `40px 40px`, and Tailwind exposes it as the utility `bg-grid-fine` for size. The arbitrary `[background-size:40px_40px]` in the example duplicates that. It is harmless (same value), but it muddies the "the key `grid-fine` is both image and size" explanation the design is trying to make clear.

**Fix:** Either rely on the generated size utility (`bg-grid-fine` for the image + the dedicated size utility name) or keep only the arbitrary `[background-size:...]` — not both. Simplest: drop the arbitrary value and let the `backgroundSize` theme entry apply, or state in one line which utility sets the size.

### 3. NIT — Navbar "live clock / SYS NOMINAL" status chip has no defined data source or update rule
**Where:** §2 Navbar ("a live mono 'clock'/`SYS NOMINAL` status chip on the right").

**Problem:** The navbar describes a "live clock," but unlike the hero telemetry (which now has a full reducer contract), the clock's format (UTC vs local, `HH:MM:SS`, Zulu suffix) and update cadence are unspecified, and whether it must stop under reduced motion is not stated. A per-second `setInterval` is a motion/animation concern that the reduced-motion section does not mention. Minor, but a coder will guess.

**Fix:** Specify the clock format and cadence (e.g. `HH:MM:SS` local or `Z` UTC, updated every 1000ms via `setInterval`, cleared on unmount), and state that under `prefers-reduced-motion` it either freezes or renders a static `SYS NOMINAL` chip without a ticking time. One sentence in §2 resolves it.

---

## Verified Assumptions
Checked against the actual workspace and confirmed correct:

- **Stack versions match the install.** `package.json`: react 18.3.1, react-dom 18.3.1, vite 5.4.21, tailwindcss 3.4.19, framer-motion 11.18.2, @react-three/fiber 8.18.0, @react-three/drei 9.122.0, three 0.169.0 — all consistent with the "locked" stack in the Overview. No new runtime dependencies are introduced by the revision (focus trap, error boundary, and tiering are all hand-rolled).
- **drei `Float` and `Environment` both exist** in the installed 9.122.0 (`node_modules/@react-three/drei/core/Float.js`, `Environment.js`). The design uses `Float` for idle bob and deliberately avoids `Environment` to stay offline/asset-free — valid.
- **`tabular-nums` / `fontVariantNumeric` exists** in Tailwind 3.4 core (`node_modules/tailwindcss/lib/corePlugins.js`). The telemetry `tabular-nums` typography rule is implementable as written.
- **Scaffold is a blank Vite+React starter.** `tailwind.config.js` `theme.extend` is `{}`, `src/index.css` contains only the three `@tailwind` directives, and `App.jsx` is a placeholder — so §1/§2 are net-new work exactly as §6 now states. The revision's "Scaffold state (verified)" paragraph matches reality.
- **`main.jsx` uses `<React.StrictMode>`.** Confirmed. R3F 8 is StrictMode-compatible; the design's requirement to clean up the telemetry interval and listeners on unmount (dev double-invoke) is the correct mitigation.
- **No test runner is installed** (no vitest/jest in `node_modules/.bin`). The design's "integration tests only if a runner is added later — none installed now" statement is accurate; the pure `lib/` units (`computeTier`, `telemetryReducer`, `validateContact`) are structured to be testable once a runner is added.
- **`@react-three/postprocessing` is not installed**, matching the design's "no post-processing" constraint.

### Resolution of prior findings (all verified addressed in the design body)
- **1 & 2 (HIGH, color namespace + camelCase):** `theme.extend.colors` now contains only the `hud` group with the text ramp folded in (`hi/mid/dim` → `text-hud-hi/-mid/-dim`); `cyanSoft`/`amberSoft` are no longer in the color map and appear only as raw hex in `boxShadow`/`backgroundImage`/`@layer`. The design states the utility-vs-CSS split explicitly. Resolved.
- **3 (HIGH, StaticHudHero):** Now in the tree at `components/three/StaticHudHero.jsx` with defined inline-SVG silhouette, props `{identity, telemetry}`, reduced-motion behavior, and its role as the single shared fallback. Resolved.
- **4 (HIGH, error boundary):** `CanvasErrorBoundary.jsx` added as a class component with `getDerivedStateFromError`/`componentDidCatch`, plus a `detectWebGL()` pre-mount feature detect. The wrapping contract and the "Suspense catches load, not runtime" rationale are spelled out. Resolved.
- **5 (MEDIUM, telemetry):** Full `telemetryReducer(state,{type,rng})` contract with per-field clamp ranges, monotonic battery floor, static signal/gps, 1200ms interval, injectable rng, and reduced-motion no-op. Resolved.
- **6 (MEDIUM, validateContact):** Pure helper with field rules, email regex, length bounds, trim, return shape, and ARIA/submit-blocking wiring. Resolved.
- **7 (MEDIUM, focus trap):** Dependency-free `useFocusTrap(ref, active)` with first-focus, Tab/Shift+Tab cycle, Esc-close with focus restore, and `inert`/`aria-hidden` on background. Resolved.
- **8 (MEDIUM, useDeviceTier):** Added `hooks/useDeviceTier.js` + pure `lib/deviceTier.js` `computeTier(...)` returning `{tier,dpr,parallax,rotorSpeed}`, with explicit undefined-signal guard so `cores`/`memory` never downgrade on their own. Resolved.
- **9 (MEDIUM, scaffold rewrites):** New §6 enumerates wholesale replacement of `tailwind.config.js theme.extend`, rewrite of `index.css`, `index.html` font `<link>` + later title/favicon step, and `App.jsx` replacement. Fonts moved off CSS `@import`. Resolved.
- **10, 11, 12 (NITs):** Backdrop markup example added; "masonry" dropped for uniform `aspect-[4/3]` grid; CLASSIFIED → `hud.dim` with lock glyph and `VIEW LOG` inline-expand (disabled `ACCESS DENIED` for CLASSIFIED). Resolved.

## Unverified / Wrong Assumptions
- **UNVERIFIED — exact WCAG contrast ratios** (≈16:1 / 8:1 / 10:1) stated in §5. Not independently recomputed here. The hex values are plausibly AA-passing and the design correctly notes full WCAG conformance needs manual AT testing. Treated as a reasonable claim, not independently verified.
- **UNVERIFIED — Google Fonts network availability at runtime.** The design loads JetBrains Mono + Space Grotesk over the network via `<link>`; offline fallback stacks are defined, so this is acceptable, but actual font delivery was not tested (no network check performed). Non-blocking because the fallback stacks are specified.
- **NOT A BUG — `#1C2A3640` 8-digit hex in the `grid-fine` gradient.** This is valid CSS (RRGGBBAA, ~25% alpha). Verified as syntactically correct, not an error.

---

## Verdict
HIGH findings: 0. MEDIUM findings: 0. NIT: 3 (items 1, 2, 3).
HIGH + MEDIUM = 0 → **APPROVED**.
