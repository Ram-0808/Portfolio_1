import { lazy, Suspense } from 'react'
import data from '../../data/portfolio'
import useDeviceTier from '../../hooks/useDeviceTier'
import useTelemetry from '../../hooks/useTelemetry'
import useMousePosition from '../../hooks/useMousePosition'
import HeroOverlay from './HeroOverlay'
import StaticHudHero from '../three/StaticHudHero'
import DroneSilhouette from '../three/DroneSilhouette'
import CanvasErrorBoundary from '../three/CanvasErrorBoundary'

// The Three.js bundle is code-split here: React.lazy + dynamic import keeps the
// WebGL chunk out of the initial payload so the hero text/telemetry paint
// instantly.
const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

// Full-viewport hero. The informational content (name/role/tagline/CTAs +
// telemetry cluster) is plain DOM in HeroOverlay so it paints immediately and
// stays accessible; the 3D drone is a decorative, aria-hidden background layer.
//
// Degradation (design §3/§5):
//   tier 3 (reduced-motion / no-WebGL / small device) -> StaticHudHero only.
//   tier 1/2 -> plain-DOM overlay painted immediately, with the lazy HeroCanvas
//               as a decorative background inside a CanvasErrorBoundary +
//               Suspense. While the WebGL chunk loads or if it throws, the
//               decorative DroneSilhouette stands in for the canvas so a drone
//               is always visible behind the overlay.
export default function Hero() {
  const { identity } = data
  const tier = useDeviceTier()
  const telemetry = useTelemetry(data.hero.telemetry)
  // Only track the pointer when parallax is active (tier 1) — binds nothing otherwise.
  const mouse = useMousePosition(tier.parallax)

  if (tier.tier === 3) {
    return <StaticHudHero identity={identity} telemetry={telemetry} />
  }

  // Decorative stand-in for the canvas while it loads or if WebGL throws.
  const canvasFallback = <DroneSilhouette className="absolute inset-0" />

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative min-h-screen overflow-hidden"
    >
      <h2 id="hero-heading" className="sr-only">
        {identity.name} — {identity.role}
      </h2>

      {/* Decorative WebGL drone background. */}
      <div aria-hidden="true" className="absolute inset-0">
        <CanvasErrorBoundary fallback={canvasFallback}>
          <Suspense fallback={canvasFallback}>
            <HeroCanvas tier={tier} mouse={mouse} />
          </Suspense>
        </CanvasErrorBoundary>
      </div>

      {/* Plain-DOM HUD overlay — paints immediately, not gated on the chunk. */}
      <HeroOverlay identity={identity} telemetry={telemetry} />
    </section>
  )
}
