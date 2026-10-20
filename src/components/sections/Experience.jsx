import { motion } from 'framer-motion'
import data from '../../data/portfolio'
import useReducedMotion from '../../hooks/useReducedMotion'
import SectionHeading from '../ui/SectionHeading'
import StatusChip from '../ui/StatusChip'

// Experience (#experience) — "Flight Log" vertical timeline. A central cyan
// spine (left on mobile, centered at >=md) carries status-dot node markers; each
// entry is a .glass card with mono SORTIE id / role / org / dates and highlight
// bullets. Entries alternate sides at >=md, single column below. Sequential
// reveal gated by reduced motion. Data from data.experience (status current|past).
export default function Experience() {
  const reduced = useReducedMotion()
  const { experience } = data

  const reveal = (i) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 },
        }

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading kicker="// 03 — FLIGHT LOG" id="experience-heading">
        Experience
      </SectionHeading>

      <ol className="relative mt-4">
        {/* Central spine. */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[9px] w-px bg-hud-line md:left-1/2 md:-translate-x-1/2"
        />

        {experience.map((entry, i) => {
          const side = i % 2 === 0 // even -> left side on desktop
          return (
            <li
              key={entry.id}
              className={`relative mb-10 pl-10 last:mb-0 md:w-1/2 md:pl-0 ${
                side ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
              }`}
            >
              {/* Node marker on the spine. */}
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-0 flex h-[19px] w-[19px] items-center justify-center md:left-auto ${
                  side ? 'md:-right-[9px] md:translate-x-1/2' : 'md:-left-[9px] md:-translate-x-1/2'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ring-4 ring-hud-void ${
                    entry.status === 'current'
                      ? 'bg-hud-amber shadow-glow-amber'
                      : 'bg-hud-cyan shadow-glow'
                  }`}
                />
              </span>

              <motion.article className="glass relative rounded-sm p-5" {...reveal(i)}>
                <div
                  className={`flex flex-wrap items-center gap-3 ${
                    side ? 'md:justify-end' : ''
                  }`}
                >
                  <span className="font-mono text-hud-xs uppercase tracking-widest text-hud-cyan">
                    {entry.id}
                  </span>
                  <StatusChip
                    status={entry.status === 'current' ? 'ACTIVE' : 'COMPLETE'}
                    label={entry.status === 'current' ? 'ACTIVE' : 'ARCHIVED'}
                  />
                </div>

                <h3 className="mt-2 font-sans text-lg font-semibold text-hud-hi">
                  {entry.role}
                </h3>
                <p className="font-mono text-hud-sm text-hud-mid">
                  {entry.org} · {entry.start}–{entry.end}
                </p>

                <ul
                  className={`mt-3 space-y-1.5 text-hud-mid ${
                    side ? 'md:ml-auto' : ''
                  }`}
                >
                  {entry.highlights.map((h, hi) => (
                    <li key={hi} className="text-base leading-relaxed">
                      <span aria-hidden="true" className="mr-2 text-hud-cyan">
                        ›
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
