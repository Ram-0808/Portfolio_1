import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useScroll } from 'framer-motion'
import data from '../../data/portfolio'
import useActiveSection from '../../hooks/useActiveSection'
import useFocusTrap from '../../hooks/useFocusTrap'

// Fixed ground-control-station header.
//   - left: callsign/name mark (mono)
//   - center/right: nav links from data.nav as real <a href="#id"> with
//     aria-current driven by useActiveSection
//   - right: a live mono clock + SYS NOMINAL status chip
// Transparent at the top of the page, gains the .glass treatment + a bottom
// hud.line border after scrolling (Framer Motion useScroll). The mobile
// hamburger opens a full-screen HUD overlay menu (id="mobile-menu") that traps
// focus via useFocusTrap and closes on Esc, returning focus to the toggle.
// Smooth-scroll comes from the anchors + CSS scroll-behavior.

const navIds = data.nav.map((item) => item.id)

function useClock() {
  const [time, setTime] = useState(() => formatTime(new Date()))
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatTime(date) {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default function Navbar() {
  const { identity, nav } = data
  const active = useActiveSection(navIds)
  const clock = useClock()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleRef = useRef(null)
  const menuRef = useRef(null)
  const { scrollY } = useScroll()

  // Glass + border after a small scroll threshold.
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => setScrolled(y > 24))
    setScrolled(scrollY.get() > 24)
    return () => unsubscribe()
  }, [scrollY])

  // Close the mobile menu whenever the viewport grows to desktop.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  useFocusTrap(menuRef, menuOpen, closeMenu)

  const statusChip = (
    <span className="inline-flex items-center gap-2 font-mono text-hud-xs uppercase tracking-wider text-hud-green">
      <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-hud-green shadow-glow" />
      SYS NOMINAL
    </span>
  )

  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1 }}
      className={`glass-fixed fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'glass border-b border-hud-line' : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
      >
        {/* Callsign / name mark */}
        <a
          href="#top"
          className="group flex items-center gap-3 font-mono uppercase tracking-wider text-hud-hi focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-cyan"
        >
          <span className="hud-corner inline-flex h-8 w-8 items-center justify-center border border-hud-line bg-hud-panel text-hud-xs text-hud-cyan">
            {identity.callsign.split('-')[0] || identity.callsign}
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-hud-sm text-hud-hi">{identity.name}</span>
            <span className="text-hud-xs text-hud-dim">{identity.callsign}</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 md:flex">
          {nav.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`font-mono text-hud-xs uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-cyan ${
                    isActive ? 'text-hud-cyan text-glow' : 'text-hud-dim hover:text-hud-hi'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right cluster: clock + status (desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="font-mono text-hud-xs tabular-nums tracking-wider text-hud-mid">
            {clock}
          </span>
          {statusChip}
        </div>

        {/* Mobile hamburger */}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center border border-hud-line bg-hud-panel text-hud-cyan focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-cyan md:hidden"
        >
          <span aria-hidden="true" className="font-mono text-lg leading-none">
            {menuOpen ? '✕' : '≡'}
          </span>
        </button>
      </nav>

      {/* Mobile full-screen HUD overlay menu — portaled to <body> so the focus
          trap can inert the rest of the app (#root) while it is open. */}
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="mobile-menu"
            ref={menuRef}
            className="fixed inset-0 z-[60] flex flex-col bg-hud-void/95 backdrop-blur-md md:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-hud-line px-6">
              <span className="font-mono text-hud-xs uppercase tracking-wider text-hud-dim">
                {identity.callsign} // NAV
              </span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={closeMenu}
                className="inline-flex h-10 w-10 items-center justify-center border border-hud-line bg-hud-panel text-hud-cyan focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-cyan"
              >
                <span aria-hidden="true" className="font-mono text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-2 px-6">
              {nav.map((item, i) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={closeMenu}
                      className={`flex items-baseline gap-4 border-b border-hud-line py-4 font-mono uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hud-cyan ${
                        isActive ? 'text-hud-cyan' : 'text-hud-mid hover:text-hud-hi'
                      }`}
                    >
                      <span className="text-hud-xs text-hud-dim">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xl">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-hud-line px-6 py-4">
              <span className="font-mono text-hud-xs tabular-nums tracking-wider text-hud-mid">
                {clock}
              </span>
              {statusChip}
            </div>
          </div>,
          document.body
        )}
    </motion.header>
  )
}
