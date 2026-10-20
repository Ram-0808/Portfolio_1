import { useEffect, useState } from 'react'
import { computeTier, detectWebGL } from '../lib/deviceTier'
import useReducedMotion from './useReducedMotion'

/**
 * Reads window/navigator signals + reduced-motion + WebGL detect, then derives
 * the device tier via the pure computeTier(). Recomputes on resize and when
 * the reduced-motion preference changes.
 */
export function useDeviceTier() {
  const reducedMotion = useReducedMotion()

  const read = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280
    const cores =
      typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined
    const memory =
      typeof navigator !== 'undefined' ? navigator.deviceMemory : undefined
    const webglOk = detectWebGL()
    return computeTier({ width, cores, memory, reducedMotion, webglOk })
  }

  const [tier, setTier] = useState(read)

  useEffect(() => {
    setTier(read())
    if (typeof window === 'undefined') return undefined

    const onResize = () => setTier(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  return tier
}

export default useDeviceTier
