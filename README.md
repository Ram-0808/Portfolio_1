# Drone Technology Portfolio

A single-page portfolio for a drone / UAV technology professional, built with a
"ground control station" HUD aesthetic — a WebGL drone hero, telemetry readouts,
mission logs, and an aerial gallery.

The site currently ships with **placeholder (dummy) content** so it can be
reviewed end-to-end. All of that content lives in one file and is designed to be
swapped for the client's real details with minimal edits (see
[Swapping in real content](#swapping-in-real-content)).

## Tech stack

- **React 18** + **Vite 5** (JavaScript, no TypeScript)
- **Tailwind CSS 3** for styling (custom `hud` color + utility theme)
- **Framer Motion** for scroll/reveal animation (respects reduced-motion)
- **three.js** + **@react-three/fiber** + **@react-three/drei** for the 3D drone hero

No backend. The contact form validates client-side and simulates a send — it
makes no network request.

## Requirements

- **Node.js 18+** (Vite 5 requires Node 18 or newer)
- npm (bundled with Node)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload) — http://localhost:5173
npm run dev

# 3. Build the optimized production bundle into dist/
npm run build

# 4. Preview the production build locally — http://localhost:4173
npm run preview
```

`npm run build` must complete with exit code 0. The three.js code is
**code-split** into its own chunk (`dist/assets/HeroCanvas-*.js`) via a lazy
import, so the hero text and telemetry paint immediately while the WebGL scene
loads in the background.

## Project structure

```
index.html                 App shell + Google Fonts
src/
  main.jsx                 React entry
  App.jsx                  Page composition: Navbar + sections + Footer
  index.css                Tailwind layers + HUD base styles
  data/
    portfolio.js           >>> SINGLE SOURCE OF ALL CONTENT <<<  (edit this)
  components/
    layout/                Backdrop, Navbar, Footer
    sections/              Hero, About, Skills, Experience, Missions,
                           Gallery, Contact (one file per page section)
    three/                 WebGL drone hero (lazy-loaded) + fallbacks
    ui/                    Reusable HUD primitives (cards, chips, headings…)
  hooks/                   Device tier, reduced-motion, active section, etc.
  lib/                     Pure logic: telemetry, contact validation, device tier
public/                    Static assets served as-is (put real images here)
```

Section order on the page: **Hero → About → Skills → Experience → Missions →
Gallery → Contact → Footer**, with a sticky navbar.

## Swapping in real content

All copy, stats, projects, roles, skills, certifications, and links come from a
single file:

> **`src/data/portfolio.js`**

Components never hardcode content — they read only from this object. To go live,
edit the keys in that file. Each key is commented inline. The top-level sections
are:

| Key            | What it drives                                                        |
| -------------- | --------------------------------------------------------------------- |
| `identity`     | Name, callsign, role, tagline, location, status, flight hours, avatar, resume link |
| `hero`         | Seed values for the animated hero telemetry readouts                  |
| `about`        | Bio paragraphs and the quick-stats strip                              |
| `skillGroups`  | Skill categories; each skill has a `level` (0–5) that draws the signal-bar meter |
| `experience`   | "Flight Log" timeline entries (role, org, dates, highlights)          |
| `projects`     | "Mission Logs" cards (title, status, objective, tech tags, image)     |
| `gallery`      | Aerial gallery tiles (caption, coordinates, image)                    |
| `certifications` | Certifications list (name, issuer, year)                            |
| `contact`      | Email and social links                                                |
| `nav`          | Navbar links and smooth-scroll targets                                |

### Adding real images

1. Drop image files into `public/images/` (create the folder if needed).
2. Set the matching `image` field in `portfolio.js` to the path, e.g.
   `image: '/images/mission-01.jpg'`.
3. Set a descriptive `alt` string next to it for accessibility.

Any `image` left as `null` renders the built-in HUD gradient placeholder, so the
layout always looks complete even before real photos are added.

### Status values worth knowing

- `projects[].status`: `'COMPLETE'` (green), `'ACTIVE'` (amber), or
  `'CLASSIFIED'` (redacted — the card shows "ACCESS DENIED" and never expands).
- `experience[].status`: `'current'` or `'past'`.

## Accessibility & graceful degradation

- The hero's 3D scene is decorative (`aria-hidden`); all real information is plain
  DOM that paints without WebGL.
- On reduced-motion, no-WebGL, or small/low-power devices the hero falls back to a
  static HUD rendering, and animations are neutralized.
- Sections use landmark headings, the mobile menu traps focus and restores it on
  close, and the contact form reports validation errors to assistive tech.

> Full WCAG conformance requires manual testing with assistive technologies and
> an expert accessibility review; the above describes the patterns built in, not a
> certified audit result.
