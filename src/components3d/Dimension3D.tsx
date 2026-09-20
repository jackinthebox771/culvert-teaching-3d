import { Html, Line } from '@react-three/drei'
import { useMemo } from 'react'
import { Quaternion, Vector3 } from 'three'
import type { DimensionDefinition } from '../config/dimensionConfig'

export function Dimension3D({ definition }: { definition: DimensionDefinition }) {
  const start = useMemo(() => new Vector3(...definition.start), [definition.start])
  const end = useMemo(() => new Vector3(...definition.end), [definition.end])
  const offset = useMemo(() => new Vector3(...definition.offset), [definition.offset])
  const dimensionStart = useMemo(() => start.clone().add(offset), [start, offset])
  const dimensionEnd = useMemo(() => end.clone().add(offset), [end, offset])
  const midpoint = useMemo(() => dimensionStart.clone().add(dimensionEnd).multiplyScalar(0.5), [dimensionStart, dimensionEnd])
  const direction = useMemo(() => dimensionEnd.clone().sub(dimensionStart).normalize(), [dimensionStart, dimensionEnd])
  const startQuaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction),
    [direction],
  )
  const endQuaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.clone().negate()),
    [direction],
  )

  return (
    <group name={`dimension-${definition.id}`}>
      <Line points={[start, dimensionStart]} color="#67dfff" lineWidth={1} />
      <Line points={[end, dimensionEnd]} color="#67dfff" lineWidth={1} />
      <Line points={[dimensionStart, dimensionEnd]} color="#8be8ff" lineWidth={1.5} />
      <ArrowHead position={dimensionStart} quaternion={startQuaternion} />
      <ArrowHead position={dimensionEnd} quaternion={endQuaternion} />
      <Html position={midpoint} center distanceFactor={28} style={{ pointerEvents: 'none' }}>
        <div className="whitespace-nowrap rounded-md border border-cyan-300/35 bg-slate-950/90 px-2 py-1 font-mono text-[10px] text-cyan-100 shadow-lg">
          {definition.label} · {definition.value}
        </div>
      </Html>
    </group>
  )
}

function ArrowHead({ position, quaternion }: { position: Vector3; quaternion: Quaternion }) {
  return (
    <mesh position={position} quaternion={quaternion}>
      <coneGeometry args={[0.13, 0.45, 12]} />
      <meshBasicMaterial color="#8be8ff" toneMapped={false} />
    </mesh>
  )
}
