import { useEffect, useRef, useState } from 'react'

/**
 * Thin IntersectionObserver wrapper that reports whether the attached element
 * is currently on-screen. Used to gate expensive, continuous work (the R3F
 * render loop, the telemetry interval) off while the hero is scrolled out of
 * view — the single biggest source of wasted main-thread/GPU time during a
 * scroll session.
 *
 * Safe defaults: when IntersectionObserver is unavailable (SSR / very old
 * browser) the hook reports `true` so nothing that depends on visibility
 * silently disappears or stops animating.
 *
 * @param {{rootMargin?:string, threshold?:number|number[]}} [options]
 * @returns {[React.MutableRefObject<Element|null>, boolean]} ref + inView flag
 */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(true)

  const { rootMargin = '0px', threshold = 0 } = options

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const el = ref.current
    if (!el) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries[0]?.isIntersecting ?? true)
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [ref, inView]
}

export default useInView
