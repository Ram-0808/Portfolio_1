// Fixed decorative background layer sitting behind all content.
// Composes: an animated fine grid, one slow scanline bar, a radial-fade top
// glow, and a radar-sweep motif. Entirely decorative, so it is aria-hidden +
// pointer-events-none and lives at z-[-1]. All motion ceases under
// prefers-reduced-motion via the global index.css reduced-motion block.
export default function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-hud-void"
    >
      {/* Animated fine grid (per design §1 finding 10). */}
      <div className="absolute inset-0 bg-grid-fine [background-size:40px_40px] animate-grid-drift opacity-[0.15]" />

      {/* Radial-fade glow from the top. */}
      <div className="absolute inset-0 bg-radial-fade" />

      {/* One slow scanline bar sweeping down the viewport. */}
      <div className="absolute inset-x-0 top-0 h-24 bg-scanlines animate-scanline opacity-40" />

      {/* Radar-sweep motif anchored top-right. */}
      <div className="absolute -right-32 -top-32 h-96 w-96 opacity-[0.12]">
        <div
          className="absolute inset-0 origin-center animate-radar-sweep"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(0,229,212,0.35), transparent 25%)',
            borderRadius: '9999px',
          }}
        />
      </div>
    </div>
  )
}
