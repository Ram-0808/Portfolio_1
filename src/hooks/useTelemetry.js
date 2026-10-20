import { useEffect, useReducer } from 'react'
import { createTelemetryState, telemetryReducer } from '../lib/telemetry'
import useReducedMotion from './useReducedMotion'

const TICK_MS = 1200

/**
 * Seeds telemetry state from the data seed and ticks it every 1200ms via a
 * setInterval dispatching the pure reducer. The interval is cleared on unmount
 * (StrictMode double-invoke safe) and is never started under reduced motion —
 * in that case the static seed values are shown and no ticking happens.
 *
 * The interval is also gated by `active`: when the hero is scrolled off-screen
 * the interval is cleared so the hero overlay subtree stops re-rendering while
 * nobody can see it, and restarts when the hero scrolls back into view. The
 * last values are retained, so the readouts resume from where they left off.
 *
 * @param {{altitude:number,battery:number,gps:string,signal:number,speed:number}} seed
 * @param {boolean} [active=true] - tick only while true (and motion is allowed)
 * @returns {{altitude:number,battery:number,gps:string,signal:number,speed:number,tickCount:number}}
 */
export function useTelemetry(seed, active = true) {
  const reducedMotion = useReducedMotion()
  const [state, dispatch] = useReducer(telemetryReducer, seed, createTelemetryState)

  useEffect(() => {
    if (reducedMotion || !active) return undefined
    const id = setInterval(() => dispatch({ type: 'tick' }), TICK_MS)
    return () => clearInterval(id)
  }, [reducedMotion, active])

  return state
}

export default useTelemetry
