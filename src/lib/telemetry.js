// Pure telemetry logic — no React/DOM. Deterministic with an injected rng.
//
// Contract (§2):
//   altitude: round(alt + (rng()*6 - 3)) clamped [380,440]       // ±0..3 m
//   speed:    round1(spd + (rng()*0.8 - 0.4)) clamped [10.0,18.0] // ±0..0.4 m/s, 1 decimal
//   battery:  every 5th tick -> max(60, battery - 1); else unchanged
//   signal:   unchanged (static from seed, 0..5)
//   gps:      unchanged (static string)
//   tickCount: tickCount + 1

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const round1 = (value) => Math.round(value * 10) / 10

/**
 * Build the initial telemetry state from the data seed.
 * @param {{altitude:number,battery:number,gps:string,signal:number,speed:number}} seed
 */
export function createTelemetryState(seed) {
  return {
    altitude: seed.altitude,
    battery: seed.battery,
    gps: seed.gps,
    signal: seed.signal,
    speed: seed.speed,
    tickCount: 0,
  }
}

/**
 * Pure reducer. action: { type: 'tick', rng? } where rng defaults to Math.random.
 */
export function telemetryReducer(state, action) {
  if (!action || action.type !== 'tick') return state

  const rng = action.rng || Math.random
  const nextTickCount = state.tickCount + 1

  const altitude = clamp(Math.round(state.altitude + (rng() * 6 - 3)), 380, 440)
  const speed = clamp(round1(state.speed + (rng() * 0.8 - 0.4)), 10.0, 18.0)
  const battery = nextTickCount % 5 === 0 ? Math.max(60, state.battery - 1) : state.battery

  return {
    ...state,
    altitude,
    speed,
    battery,
    signal: state.signal, // static
    gps: state.gps, // static
    tickCount: nextTickCount,
  }
}
