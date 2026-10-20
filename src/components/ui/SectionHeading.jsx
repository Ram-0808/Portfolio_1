import { motion } from 'framer-motion'
import useReducedMotion from '../../hooks/useReducedMotion'

// Mono kicker + <h2> heading with a Framer Motion reveal gated by
// prefers-reduced-motion. `id` is applied to the <h2> for aria-labelledby.
export default function SectionHeading({ kicker, children, id, className = '' }) {
  const reduced = useReducedMotion()

  const reveal = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.5, ease: 'easeOut' },
      }

  return (
    <motion.div className={`mb-10 ${className}`} {...reveal}>
      {kicker ? <p className="hud-label text-hud-cyan">{kicker}</p> : null}
      <h2
        id={id}
        className="mt-2 font-sans text-3xl font-semibold tracking-tight text-hud-hi md:text-4xl"
      >
        {children}
      </h2>
    </motion.div>
  )
}
