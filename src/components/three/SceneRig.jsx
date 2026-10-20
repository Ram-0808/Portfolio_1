import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import Drone from './Drone'

// Wraps the Drone in an idle Float bob and a damped tilt toward the normalized
// mouse. Parallax (the mouse tilt) is disabled when `parallax` is false
// (tier 2/3). The lerp is damped in useFrame so the tilt eases rather than
// snapping.
export default function SceneRig({ mouse = { x: 0, y: 0 }, parallax = true, rotorSpeed = 1 }) {
  const group = useRef(null)

  useFrame((_, delta) => {
    if (!group.current) return
    const targetY = parallax ? mouse.x * 0.5 : 0
    const targetX = parallax ? mouse.y * 0.35 : 0
    // Frame-rate independent damping toward the target rotation.
    const k = 1 - Math.pow(0.001, delta)
    group.current.rotation.y += (targetY - group.current.rotation.y) * k
    group.current.rotation.x += (targetX - group.current.rotation.x) * k
  })

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6} floatingRange={[-0.1, 0.1]}>
        <Drone rotorSpeed={rotorSpeed} />
      </Float>
    </group>
  )
}
