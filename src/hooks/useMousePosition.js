import { useEffect, useRef, useState } from 'react'

/**
 * Normalized pointer position in [-1, 1] on both axes, origin at viewport
 * center. rAF-throttled; cleans up listener + frame on unmount.
 *
 * @param {boolean} [enabled=true] - when false, stays at {x:0,y:0} and binds nothing
 */
export function useMousePosition(enabled = true) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const frame = useRef(0)
  const latest = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined

    const flush = () => {
      frame.current = 0
      setPos(latest.current)
    }

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      latest.current = { x, y }
      if (!frame.current) {
        frame.current = window.requestAnimationFrame(flush)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame.current) window.cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [enabled])

  return pos
}

export default useMousePosition
