import { motion } from 'framer-motion'
import data from '../../data/portfolio'
import useReducedMotion from '../../hooks/useReducedMotion'
import HudFrame from '../ui/HudFrame'
import SectionHeading from '../ui/SectionHeading'

// About (#about) — two columns: a framed "operator profile" card (avatar
// placeholder + mono spec sheet) and the bio prose + a quick-stats strip.
// All content from data.identity + data.about. Reveal gated by reduced motion.
export default function About() {
  const reduced = useReducedMotion()
  const { identity, about } = data

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.5, ease: 'easeOut' },
      }

  const spec = [
    { label: 'ROLE', value: identity.role },
    { label: 'BASE', value: identity.location },
    { label: 'STATUS', value: identity.status },
    { label: 'FLIGHT HOURS', value: `${identity.flightHours} h` },
  ]

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading kicker="// 01 — OPERATOR" id="about-heading">
        About
      </SectionHeading>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Operator profile card. */}
        <motion.div className="lg:col-span-2" {...reveal}>
          <HudFrame label="SECT//PROFILE" className="p-5">
            {/* Avatar placeholder block (gradient, decorative). */}
            <div
              aria-hidden="true"
              className="relative mb-5 aspect-square w-full overflow-hidden rounded-sm border border-hud-line bg-gradient-to-br from-hud-panel2 via-hud-panel to-hud-void"
            >
              <div className="absolute inset-0 bg-grid-fine [background-size:24px_24px] opacity-20" />
              <div className="absolute inset-0 bg-radial-fade" />
              <span className="absolute bottom-2 left-3 font-mono text-hud-xs uppercase tracking-widest text-hud-dim">
                NO SIGNAL · {identity.callsign}
              </span>
            </div>

            {/* Mono spec sheet. */}
            <dl className="divide-y divide-hud-line">
              {spec.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="hud-label text-hud-dim">{row.label}</dt>
                  <dd className="text-right font-mono text-hud-sm text-hud-hi">{row.value}</dd>
                </div>
              ))}
            </dl>
          </HudFrame>
        </motion.div>

        {/* Bio prose + quick stats. */}
        <motion.div className="lg:col-span-3" {...reveal}>
          <div className="max-w-[65ch] space-y-5">
            {about.bio.map((para, i) => (
              <p key={i} className="text-base text-hud-mid md:text-lg">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {about.stats.map((stat) => (
              <div key={stat.label} className="glass rounded-sm px-4 py-5 text-center">
                <div className="font-sans text-3xl font-semibold text-hud-cyan text-glow md:text-4xl">
                  {stat.value}
                </div>
                <div className="hud-label mt-2 text-hud-dim">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
