import { Canvas } from '@react-three/fiber'
import SceneRig from './SceneRig'

// R3F canvas wrapper for the hero drone. Default-exported so Hero can
// React.lazy() it into a code-split chunk. No OrbitControls, no shadows, no
// postprocessing, no drei Environment — the glow look comes from emissive
// materials + plain lights so the scene stays fully offline/asset-free.
//
// Props: { tier, mouse } — tier.dpr clamps the device pixel ratio per device
// tier; tier.parallax / tier.rotorSpeed drive the SceneRig; mouse is the
// normalized pointer from useMousePosition.
export default function HeroCanvas({ tier, mouse }) {
  return (
    <Canvas
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
