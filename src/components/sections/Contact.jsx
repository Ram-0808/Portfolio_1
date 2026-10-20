import { useRef, useState } from 'react'
import data from '../../data/portfolio'
import validateContact from '../../lib/validateContact'
import HudFrame from '../ui/HudFrame'
import SectionHeading from '../ui/SectionHeading'

// Contact (#contact) — left COMMS form (name/email/message) with HUD-styled
// controlled inputs and client-side validation; right column = social/comms
// rows from data.contact. Submit calls validateContact and blocks the simulated
// send unless valid; on invalid, focus moves to the first errored field and each
// field exposes aria-invalid + aria-describedby; on valid, a role="status"
// aria-live success state is shown. No network request.
export default function Contact() {
  const { contact } = data
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const refs = {
    name: useRef(null),
    email: useRef(null),
    message: useRef(null),
  }

  const onChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (sent) setSent(false)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const result = validateContact(values)
    setErrors(result.errors)

    if (!result.valid) {
      setSent(false)
      // Move focus to the first errored field (in document order).
      const firstErr = ['name', 'email', 'message'].find((f) => result.errors[f])
      if (firstErr && refs[firstErr].current) refs[firstErr].current.focus()
      return
    }

    // Simulated transmit — no network request.
    setSent(true)
    setValues({ name: '', email: '', message: '' })
  }

  const fieldBase =
    'w-full rounded-sm border bg-hud-panel/60 px-3 py-2 font-mono text-hud-sm text-hud-hi placeholder:text-hud-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-cyan'
  const borderFor = (field) => (errors[field] ? 'border-hud-red' : 'border-hud-line')

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading kicker="// 06 — COMMS" id="contact-heading">
        Contact
      </SectionHeading>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* COMMS form. */}
        <div className="lg:col-span-3">
          <HudFrame label="SECT//TRANSMIT" className="p-6">
            <form noValidate onSubmit={onSubmit} className="space-y-5">
              {/* Name / Callsign */}
              <div>
                <label htmlFor="contact-name" className="hud-label text-hud-dim">
                  CALLSIGN
                </label>
                <input
                  id="contact-name"
                  ref={refs.name}
                  type="text"
                  value={values.name}
                  onChange={onChange('name')}
                  aria-invalid={errors.name ? 'true' : undefined}
                  aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  className={`mt-1.5 ${fieldBase} ${borderFor('name')}`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-1.5 font-mono text-hud-xs text-hud-red">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email / Frequency */}
              <div>
                <label htmlFor="contact-email" className="hud-label text-hud-dim">
                  FREQUENCY (EMAIL)
                </label>
                <input
                  id="contact-email"
                  ref={refs.email}
                  type="email"
                  value={values.email}
                  onChange={onChange('email')}
                  aria-invalid={errors.email ? 'true' : undefined}
                  aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  className={`mt-1.5 ${fieldBase} ${borderFor('email')}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-1.5 font-mono text-hud-xs text-hud-red">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message / Transmission */}
              <div>
                <label htmlFor="contact-message" className="hud-label text-hud-dim">
                  TRANSMISSION
                </label>
                <textarea
                  id="contact-message"
                  ref={refs.message}
                  rows={5}
                  value={values.message}
                  onChange={onChange('message')}
                  aria-invalid={errors.message ? 'true' : undefined}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  className={`mt-1.5 resize-y ${fieldBase} ${borderFor('message')}`}
                  placeholder="Message…"
                />
                {errors.message && (
                  <p id="contact-message-error" className="mt-1.5 font-mono text-hud-xs text-hud-red">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="border border-hud-cyan/60 px-6 py-3 font-mono text-hud-sm uppercase tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-cyan"
                >
                  TRANSMIT
                </button>
                {/* Success state — announced politely. */}
                {sent && (
                  <span
                    role="status"
                    aria-live="polite"
                    className="font-mono text-hud-sm uppercase tracking-widest text-hud-green"
                  >
                    <span aria-hidden="true" className="mr-2">
                      ▚
                    </span>
                    SIGNAL SENT
                  </span>
                )}
              </div>
            </form>
          </HudFrame>
        </div>

        {/* Comms / social links. */}
        <div className="lg:col-span-2">
          <HudFrame label="SECT//CHANNELS" className="p-6">
            <p className="hud-label text-hud-dim">DIRECT</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-1.5 inline-block font-mono text-hud-sm text-hud-cyan hover:text-hud-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-cyan"
            >
              {contact.email}
            </a>

            <ul className="mt-6 space-y-3">
              {contact.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between gap-4 rounded-sm border border-hud-line px-3 py-2.5 transition-colors hover:border-hud-cyan/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-cyan"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2 w-2 rounded-full bg-hud-green"
                      />
                      <span className="font-mono text-hud-sm uppercase tracking-widest text-hud-mid group-hover:text-hud-hi">
                        {social.label}
                      </span>
                    </span>
                    <span className="font-mono text-hud-xs text-hud-dim">{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </HudFrame>
        </div>
      </div>
    </section>
  )
}
