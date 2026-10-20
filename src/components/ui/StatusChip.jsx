// Dot + mono status text. Explicit lookup for mission + system statuses.
//   COMPLETE   -> green
//   ACTIVE     -> amber
//   CLASSIFIED -> dim (redacted, lock glyph)
//   nominal    -> green
//   fault      -> red
// Unknown status falls back to dim.

const STATUS = {
  COMPLETE: { color: 'text-hud-green', dot: 'bg-hud-green', glyph: null },
  ACTIVE: { color: 'text-hud-amber', dot: 'bg-hud-amber', glyph: null },
  CLASSIFIED: { color: 'text-hud-dim', dot: 'bg-hud-dim', glyph: '▣', redacted: true },
  nominal: { color: 'text-hud-green', dot: 'bg-hud-green', glyph: null },
  fault: { color: 'text-hud-red', dot: 'bg-hud-red', glyph: null },
}

const FALLBACK = { color: 'text-hud-dim', dot: 'bg-hud-dim', glyph: null }

export default function StatusChip({ status, label, className = '' }) {
  const cfg = STATUS[status] || FALLBACK
  const text = label || status

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-hud-xs uppercase tracking-wider ${cfg.color} ${
        cfg.redacted ? 'opacity-70' : ''
      } ${className}`}
    >
      <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
      {cfg.glyph ? <span aria-hidden="true">{cfg.glyph}</span> : null}
      <span>{text}</span>
    </span>
  )
}
