import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

// opposite faces sum to 7: +Y=1 -Y=6  +X=2 -X=5  +Z=3 -Z=4
const SETTLE = {
  1: [0, 0, 0],
  2: [0, 0, Math.PI / 2],
  3: [-Math.PI / 2, 0, 0],
  4: [Math.PI / 2, 0, 0],
  5: [0, 0, -Math.PI / 2],
  6: [Math.PI, 0, 0],
}

// 3x3 grid offsets (u,v) in [-1,0,1] * 0.26, picked per pip count
const LAYOUT = {
  1: ['c'],
  2: ['tl', 'br'],
  3: ['tl', 'c', 'br'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'c', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
}
const UV = {
  tl: [-0.26, 0.26], tr: [0.26, 0.26],
  ml: [-0.26, 0], mr: [0.26, 0],
  c: [0, 0],
  bl: [-0.26, -0.26], br: [0.26, -0.26],
}

// face normal + its two in-plane tangent axes (u axis, v axis)
const FACES = [
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0], value: 2 },   // +X
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0], value: 5 },   // -X
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1], value: 1 },   // +Y
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1], value: 6 },   // -Y
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0], value: 3 },    // +Z
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0], value: 4 },  // -Z
]

function woodGrainTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#e8d2a8'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 48; i++) {
    const y = Math.random() * 256
    ctx.strokeStyle = `rgba(150, 110, 60, ${0.04 + Math.random() * 0.08})`
    ctx.lineWidth = 1 + Math.random() * 2
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= 256; x += 16) {
      ctx.lineTo(x, y + Math.sin(x * 0.04 + i) * 6 + (Math.random() - 0.5) * 3)
    }
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

function Pips({ face }) {
  const pts = LAYOUT[face.value]
  const nx = new THREE.Vector3(...face.n)
  const ux = new THREE.Vector3(...face.u)
  const vx = new THREE.Vector3(...face.v)
  return (
    <>
      {pts.map((k, i) => {
        const [u, v] = UV[k]
        const pos = nx.clone().multiplyScalar(0.515)
          .addScaledVector(ux, u)
          .addScaledVector(vx, v)
        return (
          <mesh key={i} position={pos.toArray()}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#fbf3e2" roughness={0.35} />
          </mesh>
        )
      })}
    </>
  )
}

function Die({ value, spin }) {
  const group = useRef()
  const target = useRef(new THREE.Euler())
  const t0 = useRef(0)
  const grain = useMemo(() => woodGrainTexture(), [])

  useEffect(() => {
    target.current.set(...SETTLE[value || 1])
    t0.current = performance.now()
  }, [spin, value])

  useFrame(() => {
    if (!group.current) return
    const dur = 800
    const elapsed = performance.now() - t0.current
    const t = Math.min(1, elapsed / dur)
    // ease-out with two decaying bounces near the end
    const ease = 1 - Math.pow(1 - t, 3)
    const extraSpins = (1 - ease) * Math.PI * 2 * 3
    group.current.rotation.x = target.current.x + extraSpins * 1.3
    group.current.rotation.y = target.current.y + extraSpins * 1.7
    group.current.rotation.z = target.current.z + extraSpins * 0.9

    const bounce = t > 0.72 ? Math.sin((t - 0.72) * Math.PI * 6) * (1 - t) * 0.5 : 0
    group.current.position.y = Math.max(0, bounce)
  })

  return (
    <group ref={group}>
      <RoundedBox args={[1, 1, 1]} radius={0.09} smoothness={4}>
        <meshStandardMaterial map={grain} roughness={0.55} metalness={0.05} />
      </RoundedBox>
      {FACES.map((f, i) => <Pips key={i} face={f} />)}
    </group>
  )
}

export default function Dice3D({ value, spins, rolling }) {
  return (
    <div className={'dice-stage' + (rolling ? ' is-rolling' : '')}>
      <Canvas camera={{ position: [1.6, 1.9, 2.4], fov: 32 }} dpr={[1, 2]} onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 5, 2]} intensity={1.6} color="#ffd9a0" />
        <directionalLight position={[-2, 1.5, -2]} intensity={0.5} color="#a9c7ff" />
        <pointLight position={[0, 1.2, 1.6]} intensity={0.35} color="#fff3df" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.56, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.1, 32]} />
          <meshStandardMaterial color="#9c7a3f" roughness={0.9} />
        </mesh>
        <Die value={value} spin={spins} />
      </Canvas>
    </div>
  )
}
