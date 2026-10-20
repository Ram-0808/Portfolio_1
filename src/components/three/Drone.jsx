import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Rotor from './Rotor'

// Procedural quadcopter assembled from three primitives — no external .glb.
//   - central rounded body (box + cylinder canopy)
//   - 4 thin-box arms radiating at 45deg
//   - 4 short-cylinder motors at the arm ends
//   - 4 Rotor instances on the motors
//   - amber nav-light emissive spheres, one of which blinks
// Dark meshStandardMaterial body with cyan emissive accents.
const ARM_LEN = 1.15
const ARM_ANGLES = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]

export default function Drone({ rotorSpeed = 1 }) {
  const blinkRef = useRef(null)

  // Blink one nav light (amber). Uses elapsed time so it is frame-rate
  // independent and needs no external state.
  useFrame((state) => {
    if (!blinkRef.current) return
    const on = Math.sin(state.clock.elapsedTime * 4) > 0
    blinkRef.current.intensity = on ? 1.6 : 0.15
  })

  return (
    <group>
      {/* Central body */}
      <mesh castShadow={false}>
        <boxGeometry args={[0.9, 0.22, 0.9]} />
        <meshStandardMaterial color="#0B1016" metalness={0.5} roughness={0.45} />
      </mesh>
      {/* Canopy / dome */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.16, 20]} />
        <meshStandardMaterial
          color="#121A23"
          emissive="#00E5D4"
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      {ARM_ANGLES.map((angle, i) => {
        const x = Math.cos(angle) * ARM_LEN
        const z = Math.sin(angle) * ARM_LEN
        const isBlinker = i === 0
        return (
          <group key={i}>
            {/* Arm */}
            <mesh position={[x / 2, 0, z / 2]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[ARM_LEN, 0.07, 0.1]} />
              <meshStandardMaterial color="#0B1016" metalness={0.5} roughness={0.5} />
            </mesh>
            {/* Motor */}
            <mesh position={[x, 0.04, z]}>
              <cylinderGeometry args={[0.13, 0.13, 0.16, 16]} />
              <meshStandardMaterial
                color="#121A23"
                emissive="#00E5D4"
                emissiveIntensity={0.3}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Rotor */}
            <Rotor position={[x, 0.16, z]} speed={rotorSpeed} />
            {/* Amber nav-light */}
            <mesh position={[x, -0.04, z]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial
                color="#FFB020"
                emissive="#FFB020"
                emissiveIntensity={isBlinker ? 1.2 : 0.8}
              />
            </mesh>
            <pointLight
              ref={isBlinker ? blinkRef : undefined}
              position={[x, -0.04, z]}
              color="#FFB020"
              intensity={isBlinker ? 1.2 : 0.5}
              distance={1.5}
            />
          </group>
        )
      })}
    </group>
  )
}
