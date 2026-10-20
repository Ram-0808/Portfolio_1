import { useEffect, useState } from 'react'

/**
 * Observe the given section ids and return the id of the section currently in
 * view (used for nav active state). Cleans up the observer on unmount.
 *
 * @param {string[]} ids - section element ids to observe
 * @param {{rootMargin?:string}} [options]
 */
export function useActiveSection(ids, options = {}) {
  const [active, setActive] = useState(ids && ids.length ? ids[0] : null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return undefined
    }
    if (!ids || !ids.length) return undefined

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length) {
          setActive(visible[0].target.id)
        }
      },
      {
        rootMargin: options.rootMargin || '-40% 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|'), options.rootMargin])

  return active
}

export default useActiveSection
