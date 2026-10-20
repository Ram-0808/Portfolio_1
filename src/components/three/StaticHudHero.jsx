import HudFrame from '../ui/HudFrame'
import HeroOverlay from '../sections/HeroOverlay'
import DroneSilhouette from './DroneSilhouette'

// Guaranteed non-WebGL hero. Used as:
//   - the CanvasErrorBoundary fallback,
//   - the tier-3 render path (reduced-motion / no-WebGL / small device).
// Renders an inline-SVG top-down quadcopter silhouette behind the SAME overlay
// (name/role/CTAs + telemetry cluster) the live Hero uses, so both paths look
// consistent. The SVG is static under reduced motion (the global index.css
// reduced-motion block neutralizes the glow-pulse); a faint pulse only runs
// when motion is permitted.
//
// Props: { identity, telemetry } — the exact data the live Hero consumes.
export default function StaticHudHero({ identity, telemetry }) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading-static"
      className="relative min-h-screen overflow-hidden"
    >
      <h2 id="hero-heading-static" className="sr-only">
        {identity.name} — {identity.role}
      </h2>

      {/* Decorative SVG drone silhouette, centered behind the overlay. */}
      <DroneSilhouette className="absolute inset-0" />

      <HudFrame label="SECT//HERO" className="absolute inset-4 md:inset-8">
        <HeroOverlay identity={identity} telemetry={telemetry} />
      </HudFrame>
    </section>
  )
}
