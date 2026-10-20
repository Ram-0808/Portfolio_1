import { memo } from 'react'
import { Canvas } from '@react-three/fiber'
import SceneRig from './SceneRig'

// R3F canvas wrapper for the hero drone. Default-exported so Hero can
// React.lazy() it into a code-split chunk. No OrbitControls, no shadows, no
// postprocessing, no drei Environment — the glow look comes from emissive
// materials + plain lights so the scene stays fully offline/asset-free.
//
// Props: { tier, mouse, frameloop }
//   tier.dpr      — clamps the device pixel ratio per device tier.
//   tier.parallax / tier.rotorSpeed drive the SceneRig.
//   mouse         — normalized pointer from useMousePosition.
//   frameloop     — 'always' while the hero is on-screen (rotors/tilt/Float run
//                   at ~60fps); 'demand' when the hero is scrolled out of view,
//                   which renders the last frame once and then idles so the
//                   useFrame work and GPU compositing stop competing with
//                   scrolling. Memoized so pointer-driven Hero re-renders don't
//                   tear down and rebuild the R3F scene.
function HeroCanvas({ tier, mouse, frameloop = 'always' }) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={tier.dpr}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.8, 5], fov: 45 }}
    >
      <fog attach="fog" args={['#05070A', 6, 12]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={1.1} color="#00E5D4" />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#FFB020" />
      <SceneRig mouse={mouse} parallax={tier.parallax} rotorSpeed={tier.rotorSpeed} />
    </Canvas>
  )
}

export default memo(HeroCanvas)
