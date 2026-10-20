import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// A single spinning rotor: two thin crossed blades on a small hub, rotating
// about Y. `speed` comes from the tier's rotorSpeed (0 = no spin, e.g. tier 2
// uses 0.4, tier 1 uses 1). All geometry is procedural — no external assets.
export default function Rotor({ position = [0, 0, 0], speed = 1 }) {
  const ref = useRef(null)

  useFrame((_, delta) => {
    if (!ref.current || speed === 0) return
    ref.current.rotation.y += delta * speed * 18
  })

  return (
    <group ref={ref} position={position}>
      <mesh>
        <boxGeometry args={[0.9, 0.012, 0.07]} />
        <meshStandardMaterial color="#0B1016" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.9, 0.012, 0.07]} />
        <meshStandardMaterial color="#0B1016" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Hub */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
        <meshStandardMaterial
          color="#121A23"
          emissive="#00E5D4"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}
