import data from '../../data/portfolio'

// Mono footer strip: callsign, copyright, build credit, and a back-to-top
// link. A faint animated grid baseline sits behind the text (aria-hidden).
// All content comes from data.identity.
export default function Footer() {
  const { identity } = data
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-hud-line">
      {/* Faint animated grid baseline — decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 bg-grid-fine [background-size:40px_40px] animate-grid-drift opacity-[0.08]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 font-mono text-hud-xs uppercase tracking-wider text-hud-dim md:flex-row md:justify-between">
        <span className="text-hud-mid">{identity.callsign}</span>

        <span>
          © {year} {identity.name}
        </span>

        <span>BUILT WITH REACT · THREE.JS</span>

        <a
          href="#top"
          className="text-hud-cyan transition-colors hover:text-hud-hi focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-cyan"
        >
          BACK TO TOP ↑
        </a>
      </div>
    </footer>
  )
}
