// Decorative HUD crosshair. `tracking` variant adds a subtle animated ring used
// near hero center. Always aria-hidden + pointer-events-none.
export default function Crosshair({ tracking = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block ${className}`}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-hud-cyan/70">
        <line x1="24" y1="4" x2="24" y2="18" stroke="currentColor" strokeWidth="1" />
        <line x1="24" y1="30" x2="24" y2="44" stroke="currentColor" strokeWidth="1" />
        <line x1="4" y1="24" x2="18" y2="24" stroke="currentColor" strokeWidth="1" />
        <line x1="30" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="1" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
        {tracking ? (
          <circle
            cx="24"
            cy="24"
            r="12"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="4 3"
            className="animate-radar-sweep origin-center"
            opacity="0.5"
          />
        ) : null}
      </svg>
    </span>
  )
}
