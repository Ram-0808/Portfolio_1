import CornerBrackets from '../ui/CornerBrackets'
import Crosshair from '../ui/Crosshair'
import SignalBars from '../ui/SignalBars'
import TelemetryReadout from '../ui/TelemetryReadout'

// Shared, plain-DOM HUD overlay rendered on top of BOTH hero render paths (the
// live R3F HeroCanvas and the StaticHudHero fallback) so they look identical.
// Everything here is HTML (not WebGL) so hero content paints instantly and is
// accessible. Decorative HUD chrome is aria-hidden; the name/role/tagline/CTAs
// carry the real content.
//
// Props:
//   identity  — data.identity (name, role, tagline)
//   telemetry — a telemetry state object { altitude, battery, gps, signal, speed }
export default function HeroOverlay({ identity, telemetry }) {
  return (
    <>
      {/* Viewport corner brackets. */}
      <CornerBrackets size={28} className="animate-glow-pulse" />

      {/* Center tracking crosshair. */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Crosshair tracking className="opacity-60" />
      </div>

      {/* Telemetry cluster — decorative HUD readouts, top-right. */}
      <div
        aria-hidden="true"
        className="absolute right-6 top-24 hidden flex-col gap-4 sm:flex"
      >
        <TelemetryReadout label="ALT" value={String(telemetry.altitude).padStart(5, '0')} unit="m" />
        <TelemetryReadout label="SPD" value={telemetry.speed.toFixed(1)} unit="m/s" />
        <TelemetryReadout label="BATT" value={`${telemetry.battery}%`} />
        <div className="flex flex-col gap-0.5">
          <span className="hud-label text-hud-dim">SIG</span>
          <SignalBars level={telemetry.signal} label={`signal ${telemetry.signal} of 5`} />
        </div>
        <TelemetryReadout label="GPS" value={telemetry.gps} className="max-w-[12rem]" />
      </div>

      {/* Foreground content — name / role / tagline / CTAs. */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6">
        <span className="hud-label text-hud-cyan">// OPERATOR · {identity.callsign}</span>
        <h1 className="mt-4 font-sans font-semibold leading-[1.05] tracking-tight text-hud-hi text-glow [font-size:clamp(2.5rem,7vw,5rem)]">
          {identity.name}
        </h1>
        <p className="mt-3 font-mono text-hud-sm uppercase tracking-widest text-hud-cyan">
          {identity.role}
        </p>
        <p className="mt-5 max-w-[48ch] text-base text-hud-mid md:text-lg">
          {identity.tagline}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#missions"
            className="group relative border border-hud-cyan/60 px-6 py-3 font-mono text-hud-sm uppercase tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-cyan"
          >
            VIEW MISSIONS
          </a>
          <a
            href="#contact"
            className="border border-hud-line px-6 py-3 font-mono text-hud-sm uppercase tracking-widest text-hud-mid transition-colors hover:border-hud-cyan/60 hover:text-hud-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-cyan"
          >
            ESTABLISH COMMS
          </a>
        </div>
      </div>

      {/* Blinking scroll hint, bottom-center. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-8 flex justify-center"
      >
        <span className="hud-label animate-blink text-hud-dim">SCROLL ↓</span>
      </div>
    </>
  )
}
