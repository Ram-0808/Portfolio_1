import CornerBrackets from './CornerBrackets'

// Bordered region + animated corner brackets + an optional top-left mono label
// (e.g. SECT//ABOUT). Wraps any content inside a thin hud.line border.
export default function HudFrame({ label, children, className = '' }) {
  return (
    <div className={`relative border border-hud-line ${className}`}>
      <CornerBrackets size={14} className="animate-glow-pulse" />
      {label ? (
        <span className="hud-label absolute -top-2 left-4 bg-hud-void px-2">{label}</span>
      ) : null}
      {children}
    </div>
  )
}
