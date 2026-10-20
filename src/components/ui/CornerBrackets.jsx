// Four L-shaped cyan corner brackets. Decorative, absolutely positioned inside
// a `relative` parent. Reused by HudFrame, HudCard, and tiles.
export default function CornerBrackets({ size = 12, className = '' }) {
  const s = `${size}px`
  const common = 'absolute w-3 h-3 border-hud-cyan pointer-events-none'
  return (
    <span aria-hidden="true" className={className}>
      <span className={`${common} top-0 left-0 border-t border-l`} style={{ width: s, height: s }} />
      <span className={`${common} top-0 right-0 border-t border-r`} style={{ width: s, height: s }} />
      <span className={`${common} bottom-0 left-0 border-b border-l`} style={{ width: s, height: s }} />
      <span className={`${common} bottom-0 right-0 border-b border-r`} style={{ width: s, height: s }} />
    </span>
  )
}
