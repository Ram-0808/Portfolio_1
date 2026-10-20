// Decorative inline-SVG top-down quadcopter silhouette (center body + 4 arms +
// 4 rotor circles), stroke = hud.cyan, fill:none. Shared by StaticHudHero and
// the Hero's non-WebGL background fallback so the drone looks identical on both
// paths. Static under reduced motion — the faint glow-pulse is neutralized by
// the global index.css reduced-motion block. Always decorative (aria-hidden).
export default function DroneSilhouette({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="h-[60vmin] w-[60vmin] max-h-[520px] max-w-[520px] animate-glow-pulse text-hud-cyan"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Four arms radiating at 45deg. */}
        <line x1="100" y1="100" x2="48" y2="48" />
        <line x1="100" y1="100" x2="152" y2="48" />
        <line x1="100" y1="100" x2="48" y2="152" />
        <line x1="100" y1="100" x2="152" y2="152" />

        {/* Center body. */}
        <rect x="84" y="84" width="32" height="32" rx="6" />
        <circle cx="100" cy="100" r="6" />

        {/* Four rotor circles at the arm ends. */}
        <circle cx="48" cy="48" r="22" opacity="0.8" />
        <circle cx="152" cy="48" r="22" opacity="0.8" />
        <circle cx="48" cy="152" r="22" opacity="0.8" />
        <circle cx="152" cy="152" r="22" opacity="0.8" />

        {/* Rotor hubs. */}
        <circle cx="48" cy="48" r="3" fill="currentColor" stroke="none" />
        <circle cx="152" cy="48" r="3" fill="currentColor" stroke="none" />
        <circle cx="48" cy="152" r="3" fill="currentColor" stroke="none" />
        <circle cx="152" cy="152" r="3" fill="currentColor" stroke="none" />
      </svg>
    </div>
  )
}
