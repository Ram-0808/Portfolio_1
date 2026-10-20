// Tech tag pill (mono, bordered).
export default function Tag({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm border border-hud-line bg-hud-panel/60 px-2 py-0.5 font-mono text-hud-xs uppercase tracking-wider text-hud-mid ${className}`}
    >
      {children}
    </span>
  )
}
