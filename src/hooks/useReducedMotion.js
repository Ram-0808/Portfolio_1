import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const getInitial = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia(QUERY).matches
}

/**
 * Reflects prefers-reduced-motion. SSR / StrictMode safe, cleans up its listener.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(getInitial)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mql = window.matchMedia(QUERY)
    const onChange = (e) => setReduced(e.matches)
    setReduced(mql.matches)

    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    // older Safari fallback
    mql.addListener(onChange)
    return () => mql.removeListener(onChange)
  }, [])

  return reduced
}

export default useReducedMotion
