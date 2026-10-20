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
 * @param {{altitude:number,battery:number,gps:string,signal:number,speed:number}} seed
 * @returns {{altitude:number,battery:number,gps:string,signal:number,speed:number,tickCount:number}}
 */
export function useTelemetry(seed) {
  const reducedMotion = useReducedMotion()
  const [state, dispatch] = useReducer(telemetryReducer, seed, createTelemetryState)

  useEffect(() => {
    if (reducedMotion) return undefined
    const id = setInterval(() => dispatch({ type: 'tick' }), TICK_MS)
    return () => clearInterval(id)
  }, [reducedMotion])

  return state
}

export default useTelemetry
