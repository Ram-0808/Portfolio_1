import { useId, useState } from 'react'
import data from '../../data/portfolio'
import CornerBrackets from '../ui/CornerBrackets'
import SectionHeading from '../ui/SectionHeading'
import StatusChip from '../ui/StatusChip'
import Tag from '../ui/Tag'

// A single mission (project) card. Shows a gradient aerial placeholder with a
// grid + corner-bracket overlay, the MISSION id, title, StatusChip, objective,
// a tech tag row, and a VIEW LOG button that inline-expands a collapsible region
// (local useState). CLASSIFIED missions render the button aria-disabled reading
// ACCESS DENIED with redacted styling and never expand.
function MissionCard({ project }) {
  const [open, setOpen] = useState(false)
  const regionId = useId()
  const classified = project.status === 'CLASSIFIED'

  return (
    <article className="glass relative flex flex-col overflow-hidden rounded-sm border border-hud-line">
      {/* Aerial placeholder header. */}
      <div aria-hidden="true" className="relative aspect-[16/9] overflow-hidden">
        {project.image ? (
          <img src={project.image} alt={project.alt} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-hud-panel2 via-hud-panel to-hud-void" />
            <div className="absolute inset-0 bg-grid-fine [background-size:28px_28px] opacity-20" />
            <div className="absolute inset-0 bg-radial-fade" />
          </>
        )}
        <CornerBrackets size={12} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-hud-xs uppercase tracking-widest text-hud-dim">
            MISSION // {project.id.replace(/^MISSION-/, '')}
          </span>
          <StatusChip status={project.status} />
        </div>

        <h3 className="mt-2 font-sans text-lg font-semibold text-hud-hi">{project.title}</h3>
        <p className="mt-2 text-base text-hud-mid">{project.objective}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>

        {/* Collapsible full log — only rendered/expanded for non-classified. */}
        {!classified && (
          <div
            id={regionId}
            role="region"
            aria-label={`${project.title} log`}
            hidden={!open}
            className="mt-4 border-t border-hud-line pt-4"
          >
            <p className="hud-label text-hud-dim">OBJECTIVE</p>
            <p className="mt-1 text-base text-hud-mid">{project.objective}</p>
            <p className="hud-label mt-3 text-hud-dim">PAYLOAD / STACK</p>
            <ul className="mt-1 space-y-1">
              {project.tech.map((t) => (
                <li key={t} className="font-mono text-hud-sm text-hud-hi">
                  <span aria-hidden="true" className="mr-2 text-hud-cyan">
                    ›
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 pt-1">
          {classified ? (
            <button
              type="button"
              aria-disabled="true"
              className="w-full cursor-not-allowed border border-hud-line/60 px-4 py-2 font-mono text-hud-xs uppercase tracking-widest text-hud-dim opacity-60"
            >
              <span aria-hidden="true" className="mr-2">
                🔒
              </span>
              ACCESS DENIED
            </button>
          ) : (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={regionId}
              onClick={() => setOpen((v) => !v)}
              className="w-full border border-hud-cyan/60 px-4 py-2 font-mono text-hud-xs uppercase tracking-widest text-hud-cyan transition-colors hover:bg-hud-cyan/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-cyan"
            >
              {open ? 'CLOSE LOG ▲' : 'VIEW LOG ▼'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

// Missions (#missions) — "Mission Logs" responsive card grid. Data from
// data.projects.
export default function Missions() {
  const { projects } = data

  return (
    <section
      id="missions"
      aria-labelledby="missions-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading kicker="// 04 — MISSION LOG" id="missions-heading">
        Missions
      </SectionHeading>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <MissionCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
