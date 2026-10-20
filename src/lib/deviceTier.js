// Pure device-tier logic + a WebGL feature detect.
//
// computeTier (§3):
//   !webglOk || reducedMotion                -> tier 3 { dpr:[1,1],   parallax:false, rotorSpeed:0 }
//   width<=768 || cores<=4 || memory<=4      -> tier 2 { dpr:[1,1.5], parallax:false, rotorSpeed:0.4 }
//   else                                     -> tier 1 { dpr:[1,2],   parallax:true,  rotorSpeed:1 }
//
// Unknown-signal guard: undefined cores/memory must NOT downgrade on their own.
// Only a value that is a defined number <= 4 triggers the tier-2 downgrade.

/**
 * Detect WebGL support via a throwaway canvas. Returns true only if a context
 * is obtained. Any throw / absence of context -> false. Safe under SSR.
 */
export function detectWebGL() {
  try {
    if (typeof document === 'undefined') return false
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!gl
  } catch (e) {
    return false
  }
}

const isLowSignal = (value) => typeof value === 'number' && value <= 4

/**
 * @param {{width:number,cores?:number,memory?:number,reducedMotion:boolean,webglOk:boolean}} signals
 * @returns {{tier:number,dpr:number[],parallax:boolean,rotorSpeed:number}}
 */
export function computeTier({ width, cores, memory, reducedMotion, webglOk }) {
  if (!webglOk || reducedMotion) {
    return { tier: 3, dpr: [1, 1], parallax: false, rotorSpeed: 0 }
  }

  if (width <= 768 || isLowSignal(cores) || isLowSignal(memory)) {
    return { tier: 2, dpr: [1, 1.5], parallax: false, rotorSpeed: 0.4 }
  }

  return { tier: 1, dpr: [1, 2], parallax: true, rotorSpeed: 1 }
}
