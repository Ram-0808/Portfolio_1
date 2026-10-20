# Implementation Plan — Drone-Tech Portfolio ("Mission Control / HUD")

Grounded in the approved design (`.agents/tasks/design.md`) and the verified scaffold:
React 18.3 + Vite 5.4 + Tailwind 3.4 + Framer Motion 11 + @react-three/fiber 8.18 /
@react-three/drei 9.122 / three 0.169. `node_modules` is installed; baseline
`npm run build` is green. No test runner is installed, so the primary verification
command for every item is `npm run build` (must exit 0), plus `npm run dev` for a
visual/interaction smoke check. All paths are relative to the project root
`/Users/raghu/Desktop/Portfolio` (the cwd). No new runtime dependencies. No external
`.glb`. Placeholders are inline-SVG / CSS gradients only — never broken local image
paths and never remote image services.

The design (§6) is explicit that `tailwind.config.js` `theme.extend` and `src/index.css`
are REWRITTEN wholesale, `index.html` gets font `<link>`s, and `App.jsx` is replaced.
Follow §1–§6 of the design for exact values (color hex, keyframes, reducer contracts,
validation rules, tier thresholds). This plan sequences that work; it does not restate
every constant.

Ordering principle: the visual foundation + data + pure logic + UI primitives come first
(everything imports them), then the 3D hero subsystem (self-contained, lazy), then the
content sections (consume primitives + data), then the nav/footer/App composition that
wires it together. Each item leaves the build green.

---

- [ ] 1. Establish the Tailwind theme, global CSS, and font loading (visual foundation).
      Replace `theme.extend` in `tailwind.config.js` wholesale with the design §1 block
      (the single `hud` color group incl. the hi/mid/dim text ramp, mono/sans fontFamily,
      hud-xs/hud-sm fontSize, glow boxShadows, grid-fine/scanlines/radial-fade
      backgroundImage + backgroundSize, and all keyframes/animations). Rewrite
      `src/index.css` keeping the three `@tailwind` directives first, then add base rules
      (`scroll-behavior`, `scroll-padding-top`, `body @apply bg-hud-void text-hud-mid
      font-sans`), `::selection` + scrollbar styling, the `@layer components` primitives
      (`.hud-label`, `.hud-corner`, `.glass`, `.text-glow` using cyanSoft/amberSoft as raw
      hex), and the `prefers-reduced-motion` block. Add the Google Fonts `<link rel=
      "preconnect">` + stylesheet `<link ... display=swap>` for JetBrains Mono + Space
      Grotesk to `index.html` (NOT a CSS `@import`).
      Files: tailwind.config.js, src/index.css, index.html
      Verify: `npm run build` exits 0; the emitted CSS compiles with the new utilities
      (no "class does not exist"/PostCSS errors). `npm run dev` shows the dark void
      background and mono/sans fonts applied.

- [ ] 2. Create the single dummy-data source `src/data/portfolio.js`.
      Default-export the object from design §4 verbatim in shape (identity, hero.telemetry
      seeds, about, skillGroups, experience, projects, gallery, certifications, contact,
      nav) with the swap-in header comments and per-field guidance (image:null → gradient
      placeholder with alt="", real image → set path + descriptive alt). This is the only
      place content strings live; later items import from here.
      Files: src/data/portfolio.js
      Verify: `npm run build` exits 0 (module parses and is importable). A scratch import
      in App (or a dev run after item 11) renders no undefined-key errors.

- [ ] 3. Create the pure logic modules under `src/lib/` (no React/DOM).
      One item, three files: `telemetry.js` (initial-state builder + pure
      `telemetryReducer(state,{type:'tick',rng})` with the §2 clamp ranges, battery
      monotonic floor 60 every 5th tick, static signal/gps, tickCount); `validateContact.js`
      (pure `validateContact({name,email,message})` with the §2.8 rules, email regex,
      length bounds, trimming, `{valid,errors}` shape); `deviceTier.js` (`detectWebGL()`
      and pure `computeTier({width,cores,memory,reducedMotion,webglOk})` returning
      `{tier,dpr,parallax,rotorSpeed}` with the undefined-signal guard so undefined
      cores/memory never downgrade on their own).
      Files: src/lib/telemetry.js, src/lib/validateContact.js, src/lib/deviceTier.js
      Verify: `npm run build` exits 0. (These are imported by items 7, 8, 10; correctness
      of the reducer/validator/tier is exercised visually when those items run.)

- [ ] 4. Create the React hooks under `src/hooks/`.
      One item, six files, each a small hook: `useReducedMotion.js` (matchMedia wrapper,
      SSR/StrictMode-safe, cleans up listener); `useActiveSection.js` (IntersectionObserver
      → active nav id); `useMousePosition.js` (normalized -1..1 pointer, rAF-throttled,
      cleans up); `useDeviceTier.js` (reads window/navigator + useReducedMotion +
      detectWebGL, calls computeTier); `useFocusTrap.js` (focus first element on activate,
      Tab/Shift+Tab cycle, Esc closes + restores focus to prior element, aria-hidden/inert
      on siblings); `useTelemetry.js` (seeds state from data, 1200ms setInterval dispatching
      the reducer, interval cleared on unmount, never started under reduced motion).
      Files: src/hooks/useReducedMotion.js, src/hooks/useActiveSection.js,
      src/hooks/useMousePosition.js, src/hooks/useDeviceTier.js, src/hooks/useFocusTrap.js,
      src/hooks/useTelemetry.js
      Verify: `npm run build` exits 0. Effect cleanup confirmed by reading each hook
      (no leaked intervals/listeners under StrictMode double-invoke).

- [ ] 5. Create the shared UI primitives under `src/components/ui/`.
      One item, the atomic HUD building blocks each in its own file: `CornerBrackets.jsx`
      (4 L-shaped cyan brackets, aria-hidden, reused by frame/card/tile), `HudFrame.jsx`
      (bordered region + animated corner brackets + top-left `.hud-label` id),
      `HudCard.jsx` (`.glass` card + brackets, used by Skills/Missions), `Crosshair.jsx`
      (center + tracking variant, aria-hidden), `TelemetryReadout.jsx` (mono label+value,
      tabular-nums, optional ticking display), `SectionHeading.jsx` (mono kicker + `<h2>`
      + Framer Motion reveal gated by useReducedMotion), `StatusChip.jsx` (dot + mono text;
      explicit COMPLETE→green / ACTIVE→amber / CLASSIFIED→dim lookup + nominal/fault),
      `Tag.jsx` (tech pill), `SignalBars.jsx` (5-bar meter for skill level / hero SIG).
      Files: src/components/ui/CornerBrackets.jsx, src/components/ui/HudFrame.jsx,
      src/components/ui/HudCard.jsx, src/components/ui/Crosshair.jsx,
      src/components/ui/TelemetryReadout.jsx, src/components/ui/SectionHeading.jsx,
      src/components/ui/StatusChip.jsx, src/components/ui/Tag.jsx,
      src/components/ui/SignalBars.jsx
      Verify: `npm run build` exits 0. Primitives import cleanly (no circular imports);
      brackets/labels render when dropped into a scratch section.

- [ ] 6. Create the fixed decorative `Backdrop` and the non-WebGL hero fallback.
      `src/components/layout/Backdrop.jsx`: fixed `inset-0 z-[-1] pointer-events-none
      aria-hidden` layer composing the animated fine grid (`bg-grid-fine
      [background-size:40px_40px] animate-grid-drift opacity-[0.15]` per §1 finding 10),
      one slow scanline bar, radial-fade top glow, and the radar-sweep motif — all
      disabled/instant under reduced motion via CSS. `src/components/three/StaticHudHero.jsx`:
      inline-SVG top-down quadcopter silhouette (center body + 4 arms + 4 rotor circles,
      stroke=hud.cyan, fill none, static under reduced motion, faint glow-pulse only when
      motion allowed), rendering the SAME telemetry cluster + name/role/CTA overlay as the
      live Hero inside `HudFrame`; props `{identity, telemetry}`.
      Files: src/components/layout/Backdrop.jsx, src/components/three/StaticHudHero.jsx
      Verify: `npm run build` exits 0. `StaticHudHero` renders standalone (temporarily in
      App) showing the SVG drone + telemetry + overlay with no console errors.

- [ ] 7. Build the R3F 3D drone scene components under `src/components/three/`.
      `Rotor.jsx` (spinning blade via `useFrame`, speed from `rotorSpeed` prop),
      `Drone.jsx` (procedural assembly: rounded box/cylinder body, 4 thin-box arms at 45°,
      4 short-cylinder motors, 4 Rotors; dark meshStandardMaterial body, cyan emissive
      accents, amber nav-light emissive spheres with one blink), `SceneRig.jsx` (drei
      `Float` idle bob + damped `useFrame` group tilt toward normalized mouse, parallax
      gated off for tier 2/3). No OrbitControls, no Environment, no external assets.
      Files: src/components/three/Rotor.jsx, src/components/three/Drone.jsx,
      src/components/three/SceneRig.jsx
      Verify: `npm run build` exits 0. (Rendered in the Canvas by item 8.)

- [ ] 8. Build the Canvas wrapper, error boundary, and assemble the interactive Hero.
      `src/components/three/HeroCanvas.jsx`: `<Canvas dpr={tier.dpr} gl={{antialias,
      powerPreference:'high-performance'}} camera={{position:[0,0.8,5],fov:45}}>` with
      ambient + two cyan/amber lights + subtle fog + `<SceneRig>`; no shadows/postprocessing.
      `src/components/three/CanvasErrorBoundary.jsx`: class component with
      `getDerivedStateFromError`/`componentDidCatch` (logs once to console.warn) rendering
      `this.props.fallback`. `src/components/sections/Hero.jsx`: full-viewport section;
      renders HUD overlay (Crosshair + viewport CornerBrackets + telemetry cluster driven
      by `useTelemetry` + name/role/tagline/CTAs + blinking SCROLL hint) as plain DOM;
      uses `useDeviceTier` — if tier 3 render `StaticHudHero` directly, else mount
      `React.lazy(() => import('../three/HeroCanvas'))` inside `CanvasErrorBoundary`
      wrapping `Suspense`, both falling back to `StaticHudHero`. Canvas is aria-hidden.
      Files: src/components/three/HeroCanvas.jsx,
      src/components/three/CanvasErrorBoundary.jsx, src/components/sections/Hero.jsx
      Verify: `npm run build` exits 0 and emits a SEPARATE code-split chunk for the Three
      bundle (confirm a second JS chunk in the build output). `npm run dev`: hero shows the
      spinning drone reacting to the mouse on desktop; forcing prefers-reduced-motion
      renders StaticHudHero; text/telemetry paint immediately.

- [ ] 9. Build the content sections that consume primitives + data: About, Skills,
      Experience, Gallery.
      `About.jsx` (framed operator-profile card with avatar placeholder + mono spec sheet,
      bio prose max-65ch, quick-stats strip, Framer Motion reveal). `Skills.jsx` (grid of
      `HudCard` per skillGroup, each with SignalBars + Tag list). `Experience.jsx`
      (flight-log vertical timeline: cyan spine, status-dot nodes, glass cards with
      SORTIE id/role/org/dates/highlights, alternating sides ≥md / single column <md,
      sequential reveal). `Gallery.jsx` (`AerialTile` grid `grid-cols-2 md:grid-cols-3
      gap-3` of uniform `aspect-[4/3]` tiles: distinct gradient + topographic SVG lines +
      coord caption on hover; image:null → gradient placeholder, alt from data). Define
      `AerialTile` inside Gallery.jsx (or a small sibling). All reveals gated by
      useReducedMotion; all headings via `SectionHeading` as `<h2>` with `aria-labelledby`.
      Files: src/components/sections/About.jsx, src/components/sections/Skills.jsx,
      src/components/sections/Experience.jsx, src/components/sections/Gallery.jsx
      Verify: `npm run build` exits 0. `npm run dev`: each section renders from
      `portfolio.js` data, responsive at mobile/desktop widths, placeholders show (no
      broken images), reveals run once and are instant under reduced motion.

- [ ] 10. Build the interactive sections: Missions and Contact.
      `Missions.jsx` with a `MissionCard`: responsive grid `grid-cols-1 sm:grid-cols-2
      lg:grid-cols-3`; each card = gradient aerial placeholder + grid/bracket overlay,
      `MISSION //` id, title, `StatusChip`, objective, Tag row, and a real
      `<button aria-expanded>` VIEW LOG that inline-expands a collapsible region (local
      useState per card); CLASSIFIED cards render the button `aria-disabled` reading
      ACCESS DENIED with redacted styling. `Contact.jsx`: left COMMS form (name/email/
      message) with HUD inputs, controlled state, submit calls `validateContact`, blocks
      simulated send unless valid, sets `aria-invalid`/`aria-describedby` per field, moves
      focus to first errored field on invalid, shows `role="status" aria-live="polite"`
      success state on valid; right = social/comms rows from data with status dots. No
      network request.
      Files: src/components/sections/Missions.jsx, src/components/sections/Contact.jsx
      Verify: `npm run build` exits 0. `npm run dev`: mission cards expand/collapse via
      keyboard, CLASSIFIED shows ACCESS DENIED disabled; contact form blocks invalid
      submit with visible errors + focus move, and shows SIGNAL SENT success on valid
      input.

- [ ] 11. Build Navbar + Footer and compose the full page in App.jsx.
      `src/components/layout/Navbar.jsx`: fixed `<header>`; callsign/name mark, nav links
      from data as real `<a href="#id">` with `aria-current` active state via
      `useActiveSection`, live mono clock / SYS NOMINAL chip; transparent at top → `.glass`
      + bottom border after scroll (Framer Motion `useScroll`); mobile hamburger
      `<button aria-expanded aria-controls="mobile-menu">` → full-screen overlay menu using
      `useFocusTrap` (Esc closes, focus returns to toggle). `src/components/layout/
      Footer.jsx`: mono strip (callsign, © {year} {name}, BUILT WITH REACT · THREE.JS,
      back-to-top link, faint animated grid baseline). Replace `src/App.jsx` with the §2
      composition: `<Backdrop/>` + `<Navbar/>` + `<main>` containing Hero, About, Skills,
      Experience, Missions, Gallery, Contact (each a `<section id aria-labelledby>`) +
      `<Footer/>`. Keep `main.jsx`/StrictMode unchanged.
      Files: src/components/layout/Navbar.jsx, src/components/layout/Footer.jsx, src/App.jsx
      Verify: `npm run build` exits 0. `npm run dev`: full single page scrolls through all
      sections in order; nav smooth-scrolls, active link highlights per section; sticky
      navbar gains glass after scroll; mobile menu opens, traps focus, closes on Esc and
      restores focus; no console errors.

- [ ] 12. Final integration pass: responsiveness, accessibility, performance, and build.
      Review the whole page end-to-end against design §5: semantic landmarks
      (header/main/footer, section aria-labelledby, h2 headings), decorative HUD layers
      aria-hidden + pointer-events-none, keyboard reachability of nav + form + mission
      expanders, focus-visible rings, alt text from data / alt="" for placeholders,
      contrast tokens used as specified (hud.dim for labels only). Confirm the Three bundle
      is code-split and does not block first paint, reduced-motion disables infinite
      animations + telemetry ticking + Framer loops, and the three device tiers behave
      (desktop full canvas, narrow/low-core canvas downgrade, reduced-motion/no-WebGL →
      StaticHudHero). Fix any seams between sections (spacing rhythm, duplicated ids,
      z-index of Backdrop vs content).
      Files: any of the above as needed for fixes
      Verify: `npm run build` exits 0 with a code-split Three chunk; `npm run preview` (or
      `npm run dev`) shows the complete, polished site with no console errors across a
      mobile-width and desktop-width check and with prefers-reduced-motion forced on.

---

## Notes / assumptions
- No test runner is installed and the design explicitly defers adding one; verification is
  `npm run build` (must exit 0) plus `npm run dev`/`npm run preview` smoke checks. The pure
  `lib/` modules are written to be unit-testable later but are not unit-tested in this phase.
- `node_modules` is already installed and the baseline build is green, so `npm install` is
  only needed if a later environment starts from a clean checkout. Run `npm install` first
  if `node_modules` is absent.
- Custom favicon and final `<title>` copy are a later client step (design §6, Out of Scope);
  `index.html` already carries a reasonable title/description.
- Placeholder imagery is CSS-gradient / inline-SVG only. No remote image hosts and no local
  image file paths are referenced (all data `image` fields are `null`), so the site builds
  and runs fully offline with no broken images.
