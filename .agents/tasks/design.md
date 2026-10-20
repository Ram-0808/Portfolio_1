# Design — Drone-Tech Portfolio ("Mission Control / HUD")

## Overview

A frontend-only, single-page personal portfolio for a drone-technology professional, themed as a dark aerospace **ground-control station (GCS)**. The page is a vertical scroll of distinct sections, each framed with HUD motifs (corner brackets, crosshairs, grid lines, telemetry readouts) over a dark radar/topographic background. The hero carries an interactive 3D drone rendered with React Three Fiber that reacts to the mouse. All content is driven by a single dummy-data file so the client can swap in real details later with minimal edits.

**Stack (locked):** React 18.3, Vite 5.4, Tailwind CSS 3.4, Framer Motion 11, @react-three/fiber 8.18, @react-three/drei 9.122, three 0.169. No new runtime dependencies. No external `.glb` assets — the drone is built procedurally from three primitives. Placeholder imagery uses inline SVG / CSS gradients; no remote image services are used, so the site works fully offline and the client drops in real files later.

**Scaffold state (verified):** The workspace is a blank Vite+React starter. `tailwind.config.js` has an empty `theme.extend: {}`, `src/index.css` contains only the three `@tailwind` directives, `App.jsx` is a placeholder, `main.jsx` wraps the app in `<React.StrictMode>`, and `index.html` has a generic title and the default `/vite.svg` favicon. Everything in §1 and §2 below is therefore **net-new** work, not an incremental addition (see §6 for the explicit file-rewrite list).

---

## 1. Visual Design System

### Color palette (hex)

All colors live in a **single `hud` Tailwind color group** so every utility reads `*-hud-*` with no double-prefix traps and no mid-word capitals (findings 1 & 2). The text ramp (`hi`/`mid`/`dim`) is folded into the same group, so body text is `text-hud-mid`, never `text-text-mid`.

| Token | Hex | Tailwind utility | Use |
|---|---|---|---|
| `hud.void` | `#05070A` | `bg-hud-void` | Page background (near-black, blue-cold) |
| `hud.panel` | `#0B1016` | `bg-hud-panel` | Panel / card base |
| `hud.panel2` | `#121A23` | `bg-hud-panel2` | Raised panel, hover |
| `hud.line` | `#1C2A36` | `border-hud-line` | Grid lines, borders (dim) |
| `hud.cyan` | `#00E5D4` | `text-hud-cyan` | Primary accent (teal-cyan) |
| `hud.amber` | `#FFB020` | `text-hud-amber` | Warning accent, status, alerts |
| `hud.green` | `#36E27B` | `text-hud-green` | "Nominal" / online status |
| `hud.red` | `#FF4D5E` | `text-hud-red` | "Fault" / offline status |
| `hud.hi` | `#E6F1F5` | `text-hud-hi` | Primary text |
| `hud.mid` | `#9FB3BF` | `text-hud-mid` | Secondary / body text |
| `hud.dim` | `#5E7482` | `text-hud-dim` | Labels, captions, telemetry secondary, CLASSIFIED chip |

**CSS-only values (NOT Tailwind utilities)** — the "soft" glow highlights `cyanSoft (#2FFBEA)` and `amberSoft (#FFD37A)` are intentionally **kept out of the Tailwind `colors` map** (finding 2). They appear only as raw hex inside `boxShadow`, `backgroundImage`, and the `@layer components` CSS in `index.css`. This avoids mixed-case utility classes and makes the utility-vs-CSS split explicit.

Accent usage rule: **cyan = interactive/primary, amber = status/attention, red/green = state only.** Never mix cyan and amber as glow on the same element.

### Tailwind theme extension (`tailwind.config.js` → `theme.extend`)

This block **replaces** the current empty `theme.extend: {}` wholesale (finding 9).

```js
extend: {
  colors: {
    hud: {
      void: '#05070A', panel: '#0B1016', panel2: '#121A23', line: '#1C2A36',
      cyan: '#00E5D4', amber: '#FFB020', green: '#36E27B', red: '#FF4D5E',
      // text ramp folded into the same group: text-hud-hi / -mid / -dim
      hi: '#E6F1F5', mid: '#9FB3BF', dim: '#5E7482',
    },
  },
  fontFamily: {
    // mono = labels, telemetry, numbers, nav; sans = body/headings prose
    mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    sans: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    'hud-xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.12em' }], // 11px telemetry labels
    'hud-sm': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.06em' }],
  },
  boxShadow: {
    // cyanSoft/amberSoft kept as raw hex here, not as color tokens
    glow: '0 0 0 1px rgba(0,229,212,0.25), 0 0 20px -4px rgba(0,229,212,0.45)',
    'glow-amber': '0 0 0 1px rgba(255,176,32,0.25), 0 0 18px -4px rgba(255,176,32,0.4)',
  },
  backgroundImage: {
    'grid-fine': 'linear-gradient(to right, #1C2A3640 1px, transparent 1px), linear-gradient(to bottom, #1C2A3640 1px, transparent 1px)',
    'scanlines': 'repeating-linear-gradient(0deg, rgba(0,229,212,0.04) 0px, rgba(0,229,212,0.04) 1px, transparent 1px, transparent 3px)',
    'radial-fade': 'radial-gradient(ellipse at 50% 0%, rgba(0,229,212,0.08), transparent 60%)',
  },
  backgroundSize: { 'grid-fine': '40px 40px' },
  keyframes: {
    scanline: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
    'radar-sweep': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
    'glow-pulse': { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
    'grid-drift': { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '40px 40px' } },
    flicker: { '0%,19%,21%,80%,82%,100%': { opacity: '1' }, '20%,81%': { opacity: '0.7' } },
    'blink': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
  },
  animation: {
    scanline: 'scanline 6s linear infinite',
    'radar-sweep': 'radar-sweep 4s linear infinite',
    'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
    'grid-drift': 'grid-drift 3s linear infinite',
    flicker: 'flicker 4s linear infinite',
    blink: 'blink 1.2s step-end infinite',
  },
}
```

### `src/index.css` — full rewrite

This file is **rewritten, not appended** (finding 9). The current contents (only the three `@tailwind` directives) are replaced by: the directives + the blocks below.

- **Fonts are loaded from `index.html` via `<link rel="preconnect">` + `<link rel="stylesheet">`, NOT via CSS `@import`** (finding 9). CSS `@import` blocks the CSSOM and contradicts the "never block first paint" goal stated under Performance; a `<link>` with `display=swap` lets the browser preconnect and render with the fallback stack immediately. The `@tailwind` directives stay the first lines of `index.css`.
- `html { scroll-behavior: smooth; scroll-padding-top: 5rem; }` (navbar offset).
- `body { @apply bg-hud-void text-hud-mid font-sans antialiased; }` (note `text-hud-mid`, per finding 1).
- A custom `::selection` in cyan; thin cyan scrollbar styling.
- A `@layer components` block for repeated HUD primitives as utility classes:
  - `.hud-label` — mono, `text-hud-xs`, uppercase, `@apply text-hud-dim`, tracking-wide.
  - `.hud-corner` — pseudo-element corner brackets (`::before/::after` with cyan borders) applied to framed panels.
  - `.glass` — `background: rgba(11,16,22,0.55); backdrop-filter: blur(10px); border: 1px solid #1C2A36;`
  - `.text-glow` — `text-shadow: 0 0 12px rgba(0,229,212,0.5);` (uses the `cyanSoft`-family glow as raw hex).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce) { *, ::before, ::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; } html { scroll-behavior: auto; } }`

### Typography scale

- Display / hero name: `font-sans`, `clamp(2.5rem, 7vw, 5rem)`, weight 600, tight tracking.
- Section headings: `font-sans` `text-3xl md:text-4xl` weight 600, each preceded by a mono `.hud-label` kicker (e.g. `// 02 — MISSION LOG`).
- Body: `font-sans` `text-base md:text-lg` `text-hud-mid`, max-width `65ch`.
- Telemetry / labels / nav / stats: `font-mono`, uppercase, `text-hud-xs`/`text-hud-sm`, `text-hud-dim` or `text-hud-cyan`.
- Numbers in telemetry use mono with `tabular-nums` (`font-variant-numeric`, confirmed available in Tailwind 3.4 core).

### Spacing / HUD motifs

- 8px base spacing rhythm; sections use `py-24 md:py-32`, container `max-w-6xl mx-auto px-6`.
- Every major section sits inside a `HudFrame` (thin `hud.line` border + animated corner brackets + a top-left `.hud-label` id like `SECT//ABOUT`).
- Persistent decorative overlays fixed behind content: animated fine grid, one slow `scanline` bar, and `radial-fade` glow from top. These live in a single `<Backdrop />` with `position: fixed; inset: 0; z-[-1]; pointer-events-none`.
- **Backdrop grid composition (finding 10):** the fine grid layer is composed exactly as (the `grid-fine` key is both a `backgroundImage` and a `backgroundSize` entry, and the drift animation is applied on top):
  ```html
  <div class="absolute inset-0 bg-grid-fine [background-size:40px_40px] animate-grid-drift opacity-[0.15]" aria-hidden="true"></div>
  ```

---

## 2. Section Layout & Page Composition

Single page, sections stacked in `App.jsx`. Order and anchor ids:

1. **Navbar** (`#top`, fixed) — left: callsign/logo mark + name mono; center/right: nav links (`ABOUT, SKILLS, FLIGHT LOG, MISSIONS, GALLERY, CONTACT`) with active-section highlight; a live mono "clock"/`SYS NOMINAL` status chip on the right. Transparent at top, gains `.glass` + bottom `hud.line` border after scrolling (Framer Motion `useScroll`). Mobile: hamburger → full-screen HUD overlay menu with a hand-rolled focus trap (see below). Smooth-scroll via anchor + `scroll-behavior`.

   **Mobile menu focus trap + Esc (finding 7)** — implemented without any new dependency, via a `useFocusTrap(ref, active)` hook (see §3):
   - On open: move focus to the first focusable element (first menu link); set `aria-hidden="true"` (or `inert` where supported) on the rest of the page (the `<main>` and `<footer>` siblings) so background content is unreachable by `Tab` and screen readers.
   - `keydown` handler within the menu container: `Tab` on the last focusable element wraps to the first; `Shift+Tab` on the first wraps to the last (computed from a live query of focusable descendants: `a[href], button, input, [tabindex]:not([tabindex="-1"])`).
   - `Esc`: closes the menu and **returns focus to the toggle button** (the hook stores the element that was focused before open and restores it on deactivate).
   - The toggle is `<button aria-expanded aria-controls="mobile-menu">`; the menu container has `id="mobile-menu"`.

2. **Hero** (`#top`) — full-viewport. Layered (HUD overlay is plain DOM; the 3D drone is a decorative background):
   - Back: `<HeroCanvas />` (R3F) with the procedural drone — floating/idle rotation, rotors spinning, tilting toward the cursor (parallax). Lazy-loaded and wrapped in a `CanvasErrorBoundary` (see §3 and finding 4).
   - Mid: HUD overlay — animated crosshair tracking near-center, corner brackets on the viewport, an animated grid, and a cluster of telemetry readouts (`ALT 00412 m`, `BATT 87%`, `GPS 37.42°N 122.17°W`, `SIG ▮▮▮▮▯`, `SPD 14.2 m/s`) that tick per the reducer contract below.
   - Front: name (`portfolio.identity.name`), role/title, tagline, two CTAs (`VIEW MISSIONS`, `ESTABLISH COMMS` → contact). A `SCROLL ↓` mono hint with `blink`.

   **Telemetry tick contract (finding 5)** — the ticking logic is a pure reducer so it is unit-testable and deterministic with an injected RNG:
   ```
   telemetryReducer(state, { type: 'tick', rng }) -> nextState
     // rng: () => number in [0,1); defaults to Math.random. tickCount is tracked in state.
     altitude: round(state.altitude + (rng()*6 - 3)) clamped to [380, 440]            // ±0..3 m
     speed:    round1(state.speed + (rng()*0.8 - 0.4)) clamped to [10.0, 18.0]         // ±0..0.4 m/s, 1 decimal
     battery:  every 5th tick, battery = max(60, battery - 1); otherwise unchanged     // monotonic down, floor 60%
     signal:   unchanged (fixed from seed, 0..5)
     gps:      unchanged (static string)
     tickCount: state.tickCount + 1
   ```
   - Driver: a `useTelemetry(seed)` behavior inside `Hero`/`TelemetryReadout` dispatches `{type:'tick'}` on a `setInterval` of **1200ms**; the interval is cleared on unmount (StrictMode double-invoke safe).
   - **Reduced motion / tier 3: the interval is never started** — telemetry shows the static seed values, no ticking. The reducer itself is pure and side-effect-free; only the interval is gated.

3. **About** (`#about`) — two columns: left a framed "operator profile" card (placeholder avatar block + mono spec sheet: `ROLE / BASE / STATUS / FLIGHT HOURS`), right the bio prose + a strip of quick stats (years, missions flown, platforms). Framer Motion reveal on scroll.

4. **Skills** (`#skills`) — grid of grouped skill clusters, each a `HudCard` with a mono group header and a list of skills rendered as labeled bars / tags with a `SignalBars` motif. Groups come straight from data.

5. **Experience — "Flight Log"** (`#experience`) — vertical mission-timeline. Central cyan spine with node markers (status dots); each entry is a glass card with mono timestamp/`SORTIE` id, role, org, dates, and bullet highlights. Alternating sides on desktop, single column on mobile. Entries reveal sequentially.

6. **Projects — "Mission Logs"** (`#missions`) — responsive card grid. Each `MissionCard` shows: placeholder aerial image (gradient + grid overlay + corner brackets), `MISSION //` id, title, a `STATUS` chip, objective line, tech tag row, and a `VIEW LOG` affordance. Hover = glow + slight lift + scanline sweep.
   - **Status chip colors (finding 12):** `COMPLETE → hud.green`, `ACTIVE → hud.amber`, `CLASSIFIED → hud.dim` with a lock glyph (`▣`/🔒 rendered as a mono char) and reduced opacity to read as redacted. All three map in `StatusChip` via an explicit `{COMPLETE, ACTIVE, CLASSIFIED}` lookup; unknown status falls back to `hud.dim`.
   - **VIEW LOG affordance (finding 12):** since routing and lightbox are out of scope, `VIEW LOG` **inline-expands the card** to reveal the full objective + tech list using local `useState` per card (no route, no modal). It is a real `<button aria-expanded>` toggling a collapsible region, so it is keyboard-operable and announced. For `CLASSIFIED` cards the button renders disabled (`aria-disabled`, no expand) and reads `ACCESS DENIED`.

7. **Gallery** (`#gallery`) — a uniform responsive grid of placeholder aerial tiles (`AerialTile`: distinct gradient + topographic SVG lines + coordinate caption overlay). **Layout (finding 11):** drop "masonry" — use uniform `aspect-[4/3]` tiles in `grid-cols-2 md:grid-cols-3 gap-3`. Hover reveals a mono caption (`IMG_0042 · 1/2000s · f/2.8 · ISO100`). Lightbox is out of scope — tiles are decorative placeholders.

8. **Contact** (`#contact`) — left: `COMMS` form (name, email, message) with HUD-styled inputs, client-side state + validation, and a fake "transmit" success state (`▚ SIGNAL SENT`). Right: social/comms links from data as mono rows with status dots. No network request; submission is simulated.

   **Validation contract (finding 6)** — extracted to a pure helper so it is unit-testable without the DOM:
   ```
   validateContact({ name, email, message }) -> { valid: boolean, errors: { name?, email?, message? } }
     name:    required; trim; length 1..80;   else errors.name    = 'Callsign required (1–80 chars).'
     email:   required; matches /^[^\s@]+@[^\s@]+\.[^\s@]+$/;        else errors.email   = 'Valid frequency (email) required.'
     message: required; trim; length 10..1000; else errors.message = 'Transmission must be 10–1000 chars.'
     valid = Object.keys(errors).length === 0
   ```
   - Form wiring: each field renders `errors[field]` text in an element referenced by `aria-describedby`, and sets `aria-invalid="true"` only when its key is present in `errors`. Submit handler calls `validateContact`, and **blocks the simulated send unless `valid`**; on invalid, focus moves to the first field with an error. On valid, it shows the `role="status" aria-live="polite"` success state.

9. **Footer** — mono strip: callsign, `© {year} {name}`, `BUILT WITH REACT · THREE.JS`, back-to-top link, a faint animated grid baseline.

---

## 3. Component Breakdown

```
src/
  App.jsx                      // composes Backdrop + Navbar + sections + Footer
  main.jsx                     // existing; keeps <React.StrictMode> (R3F 8 is StrictMode-safe)
  data/
    portfolio.js               // single source of dummy content (see §4)
  lib/
    telemetry.js               // pure telemetryReducer(state,{type,rng}) + initial-state builder
    validateContact.js         // pure validateContact(values) (see §2.8)
    deviceTier.js              // pure computeTier({width,cores,memory,reducedMotion,webglOk}) + detectWebGL()
  hooks/
    useReducedMotion.js        // wraps matchMedia('(prefers-reduced-motion: reduce)')
    useActiveSection.js        // IntersectionObserver → active nav id
    useMousePosition.js        // normalized -1..1 pointer for hero parallax (throttled via rAF)
    useDeviceTier.js           // reads window/navigator + useReducedMotion → calls computeTier (finding 8)
    useFocusTrap.js            // focus trap for mobile menu (finding 7)
    useTelemetry.js            // seeds state + 1200ms interval dispatching reducer; no-op under reduced motion
  components/
    layout/
      Backdrop.jsx             // fixed grid + scanline + radial glow + radar sweep motif
      Navbar.jsx
      Footer.jsx
    ui/
      HudFrame.jsx             // bordered region + animated corner brackets + section id label
      HudCard.jsx              // glass card w/ corner brackets, used by Skills/Missions
      Crosshair.jsx            // animated crosshair (center + tracking variant)
      CornerBrackets.jsx       // 4 L-shaped brackets (reused by frame/card/tiles)
      TelemetryReadout.jsx     // mono label+value, optional ticking animation
      SectionHeading.jsx       // mono kicker + sans heading + motion reveal
      StatusChip.jsx           // colored dot + mono status text (COMPLETE/ACTIVE/CLASSIFIED + nominal/fault)
      Tag.jsx                  // tech tag pill
      SignalBars.jsx           // 5-bar signal meter (skills levels, hero SIG)
    sections/
      Hero.jsx                 // overlay + lazy HeroCanvas (via CanvasErrorBoundary) + telemetry cluster
      About.jsx
      Skills.jsx
      Experience.jsx           // flight-log timeline
      Missions.jsx             // projects grid + MissionCard (inline expand)
      Gallery.jsx              // AerialTile grid
      Contact.jsx              // stateful form + comms links
    three/
      HeroCanvas.jsx           // <Canvas> wrapper: lights, fog, controls-free, DPR clamp
      Drone.jsx                // procedural drone assembly (body + 4 arms + 4 rotors)
      Rotor.jsx                // spinning rotor (useFrame)
      SceneRig.jsx             // group that tilts toward mouse + idle float (Float/drei)
      StaticHudHero.jsx        // non-WebGL fallback hero (finding 3)
      CanvasErrorBoundary.jsx  // class component; componentDidCatch → fallback (finding 4)
```

**Shared primitives** live under `components/ui`, each in its own file. `CornerBrackets` is the atomic bracket unit reused by `HudFrame`, `HudCard`, and `AerialTile`. **Pure logic lives under `lib/`** so it is testable without React/DOM: `telemetry.js`, `validateContact.js`, and `deviceTier.js`.

### 3D hero structure & degradation

- `Hero.jsx` renders the HUD overlay immediately (text + telemetry are HTML, not WebGL, so content is instant and SEO/A11y-friendly). The 3D layer is mounted as:
  ```jsx
  <CanvasErrorBoundary fallback={<StaticHudHero identity={...} telemetry={...} />}>
    <Suspense fallback={<StaticHudHero identity={...} telemetry={...} />}>
      <HeroCanvas tier={tier} />
    </Suspense>
  </CanvasErrorBoundary>
  ```
  The canvas is `React.lazy(() => import('../three/HeroCanvas'))`, so the Three.js bundle is code-split and never blocks first paint.

- **`StaticHudHero.jsx` (finding 3)** — the guaranteed non-WebGL hero, used as the Suspense fallback, the error-boundary fallback, and the tier-3 (reduced-motion / no-WebGL / small-device) render path, so a hero is always present. It renders:
  - an **inline-SVG drone silhouette** (top-down quadcopter outline: center body + 4 arms + 4 rotor circles), `stroke` = `hud.cyan`, `fill: none`; **no animation when reduced motion is active** (the SVG is static; a faint `glow-pulse` is allowed only when motion is permitted);
  - the **same telemetry cluster** and **same name/role/CTA overlay** as the live `Hero`, inside the shared `HudFrame`, so the two render paths are visually consistent.
  - Props: `{ identity, telemetry }` — the exact same identity/telemetry data the live `Hero` consumes, passed down from `Hero` so there is one data source.

- **`CanvasErrorBoundary.jsx` (finding 4)** — a React **class** component (there is no hooks error-boundary API, and none is installed). It implements `static getDerivedStateFromError()` + `componentDidCatch(error, info)` to set `hasError`, and renders `this.props.fallback` (`<StaticHudHero/>`) when `hasError` is true, otherwise `this.props.children`. `componentDidCatch` logs the error once to `console.warn` (`'[HeroCanvas] WebGL render failed, showing static hero'`) for diagnostics; it is not fatal to the page — only the hero subtree degrades. This is required because **`<Suspense>` catches lazy-load only, not runtime WebGL/R3F throws**, and `<Canvas onError>` is not a reliable downgrade mechanism.

- **WebGL feature detect (finding 4 & 8)** — `lib/deviceTier.js` exports `detectWebGL()`: create a throwaway `<canvas>`, try `getContext('webgl')` then `getContext('experimental-webgl')`, return `true` only if a context is obtained (wrapped in try/catch; any throw → `false`). This runs **before** mounting `<Canvas>`; if it returns false, `Hero` renders `StaticHudHero` directly and never mounts the canvas. The error boundary remains as a second line of defense for mid-session context loss.

- `HeroCanvas.jsx`: `<Canvas dpr={tier.dpr} gl={{ antialias: true, powerPreference: 'high-performance' }} camera={{ position:[0,0.8,5], fov:45 }}>`; ambient + 2 directional/point lights tinted cyan and amber; subtle fog; no OrbitControls (passive showpiece).
- `Drone.jsx`: central body = rounded `boxGeometry`/`cylinderGeometry`; 4 arms = thin boxes radiating at 45°; 4 motors = short cylinders; 4 `Rotor` blades. Materials: dark `meshStandardMaterial` body, cyan emissive accents, amber nav-light dots (small emissive spheres, one `blink`). **Chosen: plain lights (no drei `Environment`)** to stay fully offline/asset-free; `Float` from drei is used for the idle bob (confirmed present in drei 9.122).
- `SceneRig.jsx` reads the normalized mouse (from `useMousePosition`, passed as prop) and lerps group rotation toward it in `useFrame` (damped) for the cursor-reactive tilt. Parallax is disabled on tier 2/3.

### Device tiering (finding 8)

- **Pure core:** `lib/deviceTier.js` → `computeTier({ width, cores, memory, reducedMotion, webglOk })` returns `{ tier, dpr, parallax, rotorSpeed }`:
  ```
  if (!webglOk || reducedMotion)              -> tier 3: { tier:3, dpr:[1,1],   parallax:false, rotorSpeed:0 }   // StaticHudHero
  else if (width <= 768 || cores<=4 || memory<=4)
                                              -> tier 2: { tier:2, dpr:[1,1.5], parallax:false, rotorSpeed:0.4 }
  else                                        -> tier 1: { tier:1, dpr:[1,2],   parallax:true,  rotorSpeed:1 }
  ```
  **Unknown-signal guard:** `cores`/`memory` arriving as `undefined` are treated as "unknown" and **do not trigger a downgrade on their own** — the comparisons `cores<=4`/`memory<=4` must be written so `undefined` is false (i.e., only downgrade when the value is a defined number ≤ 4). `navigator.deviceMemory` is non-standard (absent in Safari/Firefox) and `hardwareConcurrency` can be undefined; this prevents mis-tiering those browsers.
- **Hook wrapper:** `hooks/useDeviceTier.js` reads `window.innerWidth`, `navigator.hardwareConcurrency`, `navigator.deviceMemory`, `useReducedMotion()`, and `detectWebGL()`, then calls `computeTier(...)`. It returns the tier object; `Hero` uses `tier.tier === 3` to choose `StaticHudHero`, and passes `tier.dpr`/`tier.rotorSpeed`/`tier.parallax` into the canvas scene.

**Rendering approach decision:** the 3D drone is a *decorative background layer*; the hero's informational content is plain DOM. Chosen over a canvas-only hero because it keeps text selectable, accessible, and instantly painted while the heavy WebGL chunk streams in — and it makes the tier-3 static path a straightforward swap.

---

## 4. Dummy Data Model (`src/data/portfolio.js`)

One default-exported object with commented keys. Shape:

```js
// src/data/portfolio.js
// Swap every placeholder below for the client's real content.
// Images: drop real files in /public/images and set the string path (e.g. '/images/mission-01.jpg').
// Leaving an image null renders the built-in gradient placeholder with alt="".
// When a real image is set, also give it a descriptive alt (see the `alt` fields where present).

export default {
  identity: {
    name: 'Alex Carter',
    callsign: 'AC-01',                 // shown as logo mark / mono tag
    role: 'Drone Systems Engineer / UAV Specialist',
    tagline: 'Designing, flying, and automating unmanned aerial systems — from firmware to flight line.',
    location: 'San Francisco, CA',     // "BASE"
    status: 'AVAILABLE',               // chip in navbar/about
    flightHours: 1240,                 // telemetry stat
    avatar: null,                      // '/images/avatar.jpg' later
    resumeUrl: '#',                    // link; '#' = disabled placeholder
  },

  hero: {
    // decorative animated telemetry seeds (values tick client-side around these per §2 reducer)
    telemetry: {
      altitude: 412,    // m   — ticks ±0..3, clamped [380,440]
      battery: 87,      // %   — decrements 1% every 5 ticks, floor 60
      gps: '37.42°N  122.17°W',  // static
      signal: 4,        // 0..5 bars — static
      speed: 14.2,      // m/s — ticks ±0..0.4, clamped [10,18]
    },
  },

  about: {
    bio: [
      'First paragraph … placeholder bio for a drone-technology professional.',
      'Second paragraph … experience across platforms, payloads, and mapping.',
    ],
    stats: [
      { label: 'YEARS ACTIVE', value: '7+' },
      { label: 'MISSIONS FLOWN', value: '320' },
      { label: 'PLATFORMS', value: '12' },
    ],
  },

  // Each group → one HUD card in Skills. level 0..5 drives SignalBars.
  skillGroups: [
    { id: 'flight', title: 'Flight Systems & Controls',
      skills: [ {name:'PX4 / ArduPilot', level:5}, {name:'MAVLink', level:5},
                {name:'PID Tuning', level:4}, {name:'Autonomous Mission Planning', level:4} ] },
    { id: 'payload', title: 'Payloads & Sensors',
      skills: [ {name:'LiDAR', level:4}, {name:'Multispectral', level:4},
                {name:'Thermal (IR)', level:3}, {name:'Gimbal/EO Integration', level:4} ] },
    { id: 'gis', title: 'GIS & Aerial Mapping / Photogrammetry',
      skills: [ {name:'Pix4D', level:5}, {name:'Agisoft Metashape', level:4},
                {name:'QGIS', level:4}, {name:'Orthomosaic / DEM', level:4} ] },
    { id: 'firmware', title: 'Firmware & Embedded',
      skills: [ {name:'C / C++', level:5}, {name:'STM32 / ESP32', level:4},
                {name:'RTOS', level:3}, {name:'ESC & Motor Control', level:4} ] },
    { id: 'data', title: 'Data Processing',
      skills: [ {name:'Python', level:5}, {name:'ROS / ROS2', level:4},
                {name:'OpenCV', level:4}, {name:'Point Cloud (PDAL)', level:3} ] },
    { id: 'regs', title: 'Regulations & Certifications',
      skills: [ {name:'FAA Part 107', level:5}, {name:'BVLOS Ops', level:3},
                {name:'Airspace / LAANC', level:4}, {name:'Safety Case Authoring', level:3} ] },
  ],

  // "Flight Log" timeline — newest first. status: 'current' | 'past'
  experience: [
    { id:'SORTIE-07', role:'Senior Drone Systems Engineer', org:'SkyGrid Robotics',
      start:'2022', end:'PRESENT', status:'current',
      highlights:[ 'Lead autonomy stack for BVLOS inspection fleet.',
                   'Integrated LiDAR + RTK GPS pipeline.' ] },
    { id:'SORTIE-04', role:'UAV Mapping Specialist', org:'TerraMap Surveys',
      start:'2019', end:'2022', status:'past',
      highlights:[ 'Delivered 200+ photogrammetry survey missions.',
                   'Built automated orthomosaic processing pipeline.' ] },
    { id:'SORTIE-01', role:'Flight Firmware Engineer', org:'AeroCore Systems',
      start:'2017', end:'2019', status:'past',
      highlights:[ 'Developed ESC firmware and failsafe logic.',
                   'Tuned flight controllers across 6 airframes.' ] },
  ],

  // "Mission Logs" (projects). status: 'COMPLETE' | 'ACTIVE' | 'CLASSIFIED'
  // chip colors: COMPLETE→hud.green, ACTIVE→hud.amber, CLASSIFIED→hud.dim (lock glyph, redacted)
  projects: [
    { id:'MISSION-001', title:'Autonomous Infrastructure Inspection',
      status:'ACTIVE', objective:'BVLOS autonomous inspection of power corridors.',
      tech:['PX4','ROS2','LiDAR','RTK'], image:null, alt:'' },
    { id:'MISSION-002', title:'Precision Agriculture Mapping',
      status:'COMPLETE', objective:'Multispectral crop-health orthomosaics at scale.',
      tech:['Pix4D','Multispectral','QGIS'], image:null, alt:'' },
    { id:'MISSION-003', title:'Search & Rescue Thermal Platform',
      status:'COMPLETE', objective:'Thermal-guided SAR with real-time downlink.',
      tech:['Thermal IR','MAVLink','Python'], image:null, alt:'' },
    { id:'MISSION-004', title:'Swarm Coordination R&D',
      status:'CLASSIFIED', objective:'Multi-agent formation flight experiments.',
      tech:['ROS2','C++','RTOS'], image:null, alt:'' },
  ],

  // Gallery placeholders. caption shows as mono EXIF-style overlay.
  gallery: [
    { id:'IMG_0042', caption:'1/2000s · f/2.8 · ISO100', image:null, alt:'', coords:'37.80°N 122.27°W' },
    { id:'IMG_0043', caption:'1/1600s · f/4 · ISO200',   image:null, alt:'', coords:'36.11°N 115.17°W' },
    { id:'IMG_0044', caption:'1/1000s · f/2.8 · ISO100', image:null, alt:'', coords:'34.05°N 118.24°W' },
    { id:'IMG_0045', caption:'1/3200s · f/5.6 · ISO100', image:null, alt:'', coords:'40.71°N 74.00°W'  },
    { id:'IMG_0046', caption:'1/800s · f/4 · ISO400',    image:null, alt:'', coords:'47.60°N 122.33°W' },
    { id:'IMG_0047', caption:'1/2000s · f/2.8 · ISO100', image:null, alt:'', coords:'29.76°N 95.36°W'  },
  ],

  certifications: [
    { id:'cert-1', name:'FAA Part 107 Remote Pilot', issuer:'FAA', year:'2018' },
    { id:'cert-2', name:'BVLOS Waiver Authorization', issuer:'FAA', year:'2021' },
    { id:'cert-3', name:'Pix4D Certified', issuer:'Pix4D', year:'2020' },
  ],

  contact: {
    email: 'alex.carter@example.com',
    socials: [
      { label:'GITHUB',   url:'https://github.com/',   handle:'@alexcarter' },
      { label:'LINKEDIN', url:'https://linkedin.com/',  handle:'in/alexcarter' },
      { label:'X',        url:'https://x.com/',         handle:'@alexcarter_uav' },
    ],
  },

  nav: [ // drives navbar + smooth-scroll targets
    { id:'about', label:'ABOUT' }, { id:'skills', label:'SKILLS' },
    { id:'experience', label:'FLIGHT LOG' }, { id:'missions', label:'MISSIONS' },
    { id:'gallery', label:'GALLERY' }, { id:'contact', label:'CONTACT' },
  ],
}
```

Rule for implementer: components read only from this object; no content strings are hardcoded in JSX. `image: null` → render the gradient/SVG placeholder component with `alt=""`.

---

## 5. Responsiveness, Accessibility, Performance, Reduced Motion

### Responsive & 3D degradation
- Breakpoints: Tailwind defaults; design mobile-first. Timeline alternating → single column below `md`; skills/missions grids `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; gallery `grid-cols-2 md:grid-cols-3` with `aspect-[4/3]` tiles (finding 11).
- **3D hero tiers** are decided entirely by `computeTier`/`useDeviceTier` (§3, finding 8):
  1. **Tier 1** (desktop, motion allowed, WebGL ok): full `HeroCanvas`, spinning rotors, cursor tilt, `dpr=[1,2]`.
  2. **Tier 2** (`width<=768` **or** defined `hardwareConcurrency<=4` **or** defined `deviceMemory<=4`): canvas with `dpr=[1,1.5]`, parallax off, slower rotor.
  3. **Tier 3** (`prefers-reduced-motion: reduce` **or** `detectWebGL()===false`): skip the canvas entirely, render `StaticHudHero`.
- The degradation guarantee is enforced at two layers: `detectWebGL()` before mount (tier 3 chosen pre-render), **and** `CanvasErrorBoundary` for runtime WebGL/R3F throws after mount (finding 4). `StaticHudHero` is also the `Suspense` fallback, so a hero is always visible.
- `useReducedMotion` gates all Framer Motion variants (reveal animations become instant, no infinite loops) and stops the telemetry interval.

### Accessibility
- Semantic landmarks: `<header>` (navbar), `<main>` with `<section aria-labelledby>` per section, `<footer>`. Each section heading is an `<h2>` referenced by `aria-labelledby`.
- The 3D canvas and all decorative HUD overlays (crosshair, grid, scanlines, telemetry, Backdrop grid) get `aria-hidden="true"` and `pointer-events-none` where non-interactive.
- Nav links are real `<a href="#id">`; active state uses `aria-current`. Mobile menu toggle is `<button aria-expanded aria-controls="mobile-menu">`; the menu is **keyboard-focus-trapped via `useFocusTrap`** while open and closes on `Esc`, returning focus to the toggle (finding 7).
- Contact form: `<label>` for every input; `aria-invalid` set only when `errors[field]` exists; `aria-describedby` points at the per-field error text; visible focus rings (`focus-visible:ring-hud-cyan`); success announced via `role="status" aria-live="polite"` (finding 6). On invalid submit, focus moves to the first errored field.
- `VIEW LOG` / expand is a real `<button aria-expanded>` controlling a collapsible region; `CLASSIFIED` cards render it `aria-disabled` (finding 12).
- Images (`AerialTile`, avatar, mission images) take `alt` from data; placeholders use `alt=""` (decorative). Real images should receive a descriptive `alt` — documented in the data file.
- **Contrast:** text.hi `#E6F1F5` on `hud.void` ≈ 16:1; text.mid `#9FB3BF` ≈ 8:1; cyan `#00E5D4` on void ≈ 10:1 — all pass WCAG AA (ratios not independently recomputed here). `hud.dim` is reserved for large/mono labels only, not body copy. Full WCAG conformance requires manual AT testing and expert review; this covers the contrast and semantics layer.

### Performance
- Three.js code-split via `React.lazy` + dynamic import; it is the only large chunk and never blocks first paint.
- `useFrame` work kept minimal (rotor rotation + one damped group lerp). Clamp DPR per tier; no shadows (emissive + lights for the glow look). No post-processing passes (avoids `@react-three/postprocessing`, not installed).
- Mouse parallax throttled with `requestAnimationFrame`; scroll via Framer Motion `useScroll`/passive listeners. IntersectionObserver for active-section and reveal-on-scroll.
- Animations are GPU-friendly (`transform`/`opacity` only); grid drift uses `background-position`. Infinite CSS animations are few and low-opacity; all paused/disabled under reduced motion.
- **Fonts loaded via `index.html` `<link rel="preconnect">` + stylesheet `<link ... display=swap>` (NOT CSS `@import`)** to avoid blocking the CSSOM/first paint (finding 9); two families only (JetBrains Mono, Space Grotesk); stacks degrade gracefully offline.

### Testability
- **Pure/unit-testable (in `lib/`, no DOM):** `computeTier(...)` (incl. undefined-signal guards and all three tiers), `telemetryReducer(state,{type,rng})` (deterministic with injected `rng`, clamp bounds, battery monotonic floor), `validateContact(values)` (each rule + return shape), and data-shape consumption.
- **Integration-testable (DOM/RTL, if a test runner is added later — none is installed now):** nav active-state, mobile menu open/close + Esc + focus return, form submit → success state and blocked-on-invalid, `MissionCard` expand/collapse, `CLASSIFIED` disabled affordance, placeholder rendering when `image:null`.
- The R3F scene is intentionally thin and decorative; no 3D assertions are needed, and the tier-3 branch keeps the WebGL path isolated and skippable.

---

## 6. Files to Create / Rewrite (scaffold reconciliation — finding 9)

- **`tailwind.config.js`** — replace `theme.extend: {}` wholesale with the §1 block.
- **`src/index.css`** — rewrite: keep the three `@tailwind` directives as the first lines, then add the base rules, `@layer components`, and reduced-motion block from §1. Do **not** add a CSS `@import` for fonts.
- **`index.html`** — add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` + the Google Fonts stylesheet `<link>` with `display=swap` for JetBrains Mono + Space Grotesk. **Later client step (noted, not blocking):** update `<title>` to the person's name/role and replace the `/vite.svg` favicon with a drone/callsign mark.
- **`src/App.jsx`** — replace placeholder with the composition in §2 (Backdrop + Navbar + all sections + Footer).
- **`src/main.jsx`** — unchanged; `<React.StrictMode>` stays (R3F 8 is StrictMode-safe). Ensure the telemetry interval and any listeners clean up in effects (dev double-invoke).
- **All new files** under `src/data`, `src/lib`, `src/hooks`, `src/components/**` per §3.

---

## Out of Scope
- No backend, real email delivery, CMS, analytics, or routing (single page).
- No gallery lightbox/zoom, blog, or i18n.
- No external 3D model assets, HDR environments, or post-processing.
- No real content — all data is placeholder in `src/data/portfolio.js` for later swap.
- No custom favicon / final `<title>` copy in this phase (client-provided later; flagged in §6).

---

## Responses to Design Review Findings

All findings from `design-review.json` (verdict `CHANGES_REQUESTED`) are **addressed**:

1. **HIGH — `colors.text` namespace collision — ADDRESSED.** The text ramp is folded into the single `hud` group (`text-hud-hi/-mid/-dim`); the `text` color group is removed. Body `@apply` and the contrast/typography tables now use `text-hud-*`. One scheme applied throughout (§1).
2. **HIGH — camelCase soft keys — ADDRESSED.** `cyanSoft`/`amberSoft` are removed from the Tailwind `colors` map and kept only as raw hex inside `boxShadow`/`backgroundImage`/`@layer components`. §1 states explicitly which tokens are Tailwind utilities vs CSS-only.
3. **HIGH — `StaticHudHero` undefined — ADDRESSED.** Added `components/three/StaticHudHero.jsx` to the tree with defined markup (inline-SVG cyan drone silhouette, no animation under reduced motion), props (`{identity, telemetry}`, same data as `Hero`), and its role as the single fallback for Suspense/error/tier-3 (§2, §3).
4. **HIGH — Suspense can't catch runtime WebGL failure — ADDRESSED.** Added `components/three/CanvasErrorBoundary.jsx` (class component, `getDerivedStateFromError`/`componentDidCatch` → `StaticHudHero`, logs once) wrapping the lazy canvas, plus `detectWebGL()` feature-detect run before mount. The exact wrapping contract is shown in §3.
5. **MEDIUM — telemetry ticking under-specified — ADDRESSED.** Defined `telemetryReducer(state,{type,rng})` with 1200ms interval, per-field clamped ranges, monotonic battery floor 60%, static signal/gps, injectable `rng`, and a no-op (interval not started) under reduced motion (§2, `lib/telemetry.js`).
6. **MEDIUM — `validateContact` rules undefined — ADDRESSED.** Defined the pure helper, field rules, email regex, length bounds, trimming, return shape `{valid, errors}`, and the `aria-invalid`/`aria-describedby`/submit-blocking wiring (§2, `lib/validateContact.js`).
7. **MEDIUM — focus trap not specified — ADDRESSED.** Specified a dependency-free `useFocusTrap(ref, active)` hook: focus first link on open, Tab/Shift+Tab cycle, `Esc` closes and restores focus to the toggle, `aria-hidden`/`inert` on background (§2, `hooks/useFocusTrap.js`).
8. **MEDIUM — `useDeviceTier` missing / undefined signals — ADDRESSED.** Added `hooks/useDeviceTier.js` + pure `lib/deviceTier.js` `computeTier({width,cores,memory,reducedMotion,webglOk})` returning `{tier,dpr,parallax,rotorSpeed}`, with an explicit guard that `undefined` `cores`/`memory` never downgrade on their own (§3, §5).
9. **MEDIUM — scaffold rewrites framed as "additions" — ADDRESSED.** New §6 states `tailwind.config.js theme.extend` is replaced wholesale and `index.css` is rewritten; fonts moved to `index.html` `<link preconnect>` + stylesheet (not CSS `@import`); `index.html` title/favicon flagged as a later client step.
10. **NIT — Backdrop grid composition implicit — ADDRESSED.** Added the exact example markup line in §1.
11. **NIT — "masonry-ish" vague — ADDRESSED.** Dropped "masonry"; committed to uniform `aspect-[4/3]` tiles in `grid-cols-2 md:grid-cols-3 gap-3` (§2, §5).
12. **NIT — CLASSIFIED color / VIEW LOG target — ADDRESSED.** `CLASSIFIED → hud.dim` + lock glyph/redacted; `VIEW LOG` inline-expands the card (no route), and is disabled (`ACCESS DENIED`) for CLASSIFIED (§2).
