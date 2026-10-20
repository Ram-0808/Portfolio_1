// Mono label + value readout. Numbers use tabular-nums so ticking values don't
// shift width. Decorative by default (aria-hidden) since the hero telemetry is
// a non-informational HUD motif.
export default function TelemetryReadout({ label, value, unit, className = '', decorative = true }) {
  return (
    <div
      className={`flex flex-col gap-0.5 ${className}`}
      aria-hidden={decorative ? 'true' : undefined}
    >
      <span className="hud-label text-hud-dim">{label}</span>
      <span className="font-mono text-hud-sm text-hud-cyan tabular-nums">
        {value}
        {unit ? <span className="ml-1 text-hud-dim">{unit}</span> : null}
      </span>
    </div>
  )
}
