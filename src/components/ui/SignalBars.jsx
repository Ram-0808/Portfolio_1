// 5-bar signal meter. Used for skill levels and the hero SIG readout.
// `level` is 0..max; filled bars are cyan, empty bars dim.
export default function SignalBars({ level = 0, max = 5, label, className = '' }) {
  const clamped = Math.max(0, Math.min(max, level))
  const bars = Array.from({ length: max }, (_, i) => i < clamped)

  return (
    <span
      className={`inline-flex items-end gap-0.5 ${className}`}
      role="img"
      aria-label={label || `signal ${clamped} of ${max}`}
    >
      {bars.map((filled, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`inline-block w-1 rounded-sm ${filled ? 'bg-hud-cyan' : 'bg-hud-line'}`}
          style={{ height: `${6 + i * 3}px` }}
        />
      ))}
    </span>
  )
}
