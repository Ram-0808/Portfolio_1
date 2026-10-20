import data from '../../data/portfolio'
import SectionHeading from '../ui/SectionHeading'
import CornerBrackets from '../ui/CornerBrackets'

// A set of distinct cold-aerial gradients so each tile reads differently.
const GRADIENTS = [
  'from-[#0B1016] via-[#122a30] to-[#05070A]',
  'from-[#0B1016] via-[#1C2A36] to-[#05070A]',
  'from-[#07131a] via-[#123038] to-[#05070A]',
  'from-[#0B1016] via-[#1a2430] to-[#05070A]',
  'from-[#081318] via-[#12232b] to-[#05070A]',
  'from-[#0B1016] via-[#152630] to-[#05070A]',
]

// A single aerial placeholder tile: distinct CSS gradient + topographic inline
// SVG contour lines + a coordinate/EXIF caption overlay revealed on hover/focus.
// image:null -> gradient placeholder (alt=""); a real image path -> <img> with
// its data alt.
function AerialTile({ item, index }) {
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <figure className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-hud-line">
      {item.image ? (
        <img
          src={item.image}
          alt={item.alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <>
          {/* Gradient placeholder with topographic contour lines. */}
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          />
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full opacity-40 transition-opacity duration-300 group-hover:opacity-60"
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
          >
            {[40, 90, 140, 190, 240].map((base, i) => (
              <path
                key={i}
                d={`M0 ${base} C 80 ${base - 30 + i * 6}, 160 ${base + 24}, 240 ${base - 18}, 400 ${base + 10}`}
                fill="none"
                stroke="#00E5D4"
                strokeWidth="1"
                strokeOpacity={0.35 - i * 0.03}
              />
            ))}
          </svg>
          <div className="absolute inset-0 bg-grid-fine [background-size:32px_32px] opacity-[0.12]" />
        </>
      )}

      <CornerBrackets size={12} className="opacity-50 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Caption overlay — revealed on hover / focus-within. */}
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-hud-void/90 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <span className="block font-mono text-hud-xs uppercase tracking-widest text-hud-cyan">
          {item.id}
        </span>
        <span className="block font-mono text-hud-xs text-hud-dim">{item.caption}</span>
        <span className="block font-mono text-hud-xs text-hud-dim">{item.coords}</span>
      </figcaption>
    </figure>
  )
}

// Gallery (#gallery) — uniform responsive grid of aerial placeholder tiles.
export default function Gallery() {
  const { gallery } = data

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
    >
      <SectionHeading kicker="// 05 — IMAGERY" id="gallery-heading">
        Gallery
      </SectionHeading>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {gallery.map((item, i) => (
          <AerialTile key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
