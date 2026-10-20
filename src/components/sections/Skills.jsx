import { motion } from 'framer-motion'
import data from '../../data/portfolio'
import useReducedMotion from '../../hooks/useReducedMotion'
import HudCard from '../ui/HudCard'
import SectionHeading from '../ui/SectionHeading'
import SignalBars from '../ui/SignalBars'

// Skills (#skills) — responsive grid of HudCards, one per skillGroup. Each skill
// renders its name + a 5-bar SignalBars meter (level 0..5). Data from
// data.skillGroups. Cards reveal with a small stagger (gated by reduced motion).
export default function Skills() {
  const reduced = useReducedMotion()
  const { skillGroups } = data

  const reveal = (i) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-60px' },
          transition: { duration: 0.45, ease: 'easeOut', delay: (i % 3) * 0.08 },
        }

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading kicker="// 02 — CAPABILITIES" id="skills-heading">
        Skills
      </SectionHeading>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <motion.div key={group.id} {...reveal(i)}>
            <HudCard className="h-full">
              <h3 className="font-mono text-hud-sm uppercase tracking-widest text-hud-cyan">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center justify-between gap-4">
                    <span className="font-mono text-hud-sm text-hud-mid">{skill.name}</span>
                    <SignalBars
                      level={skill.level}
                      label={`${skill.name}: ${skill.level} of 5`}
                    />
                  </li>
                ))}
              </ul>
            </HudCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
