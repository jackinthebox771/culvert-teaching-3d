import { DragControls, Html, Line } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Box3, Box3Helper, BufferGeometry, DoubleSide, EdgesGeometry, Group, MathUtils, Matrix4, Vector3 } from 'three'
import { ASSEMBLY_SNAP_DISTANCE } from '../config/classroomChallengeConfig'
import { getClippingPlanes } from '../config/clippingConfig'
import { CULVERT_COLORS } from '../config/colors'
import { getExplodeOffset } from '../config/explodeConfig'
import { useCulvertStore } from '../store/useCulvertStore'
import type { CulvertComponentId } from '../types/culvert'

interface ComponentMeshProps {
  id: CulvertComponentId
  name: string
  color: string
  geometry: BufferGeometry
  position?: [number, number, number]
}

export function ComponentMesh({ id, name, color, geometry, position = [0, 0, 0] }: ComponentMeshProps) {
  const groupRef = useRef<Group>(null)
  const componentVisible = useCulvertStore((state) => state.visibility[id])
  const debugEnabled = useCulvertStore((state) => state.debugEnabled)
  const originsVisible = useCulvertStore((state) => state.originsVisible)
  const boundingBoxesVisible = useCulvertStore((state) => state.boundingBoxesVisible)
  const labelsVisible = useCulvertStore((state) => state.labelsVisible)
  const hoveredComponentId = useCulvertStore((state) => state.hoveredComponentId)
  const selectedComponentId = useCulvertStore((state) => state.selectedComponentId)
  const isolationEnabled = useCulvertStore((state) => state.isolationEnabled)
  const spotlightComponentIds = useCulvertStore((state) => state.spotlightComponentIds)
  const transparencyMode = useCulvertStore((state) => state.transparencyMode)
  const clippingMode = useCulvertStore((state) => state.clippingMode)
  const bottomViewEnabled = useCulvertStore((state) => state.bottomViewEnabled)
  const assemblyChallengeActive = useCulvertStore((state) => state.assemblyChallengeActive)
  const assembledComponentIds = useCulvertStore((state) => state.assembledComponentIds)
  const assemblyResetSequence = useCulvertStore((state) => state.assemblyResetSequence)
  const finishAssemblyDrag = useCulvertStore((state) => state.finishAssemblyDrag)
  const setHoveredComponentId = useCulvertStore((state) => state.setHoveredComponentId)
  const setSelectedComponentId = useCulvertStore((state) => state.setSelectedComponentId)
  const hovered = hoveredComponentId === id
  const selected = selectedComponentId === id
  const spotlighted = spotlightComponentIds?.includes(id) ?? false
  const assembled = assembledComponentIds.includes(id)
  const dimmed = (isolationEnabled && selectedComponentId !== null && !selected)
    || (spotlightComponentIds !== null && !spotlighted)
  const visible = componentVisible && (!bottomViewEnabled || id === 'bottom-slab')
  const transparent = dimmed || transparencyMode !== 'solid'
  const opacity = dimmed ? 0.12 : transparencyMode === 'transparent' ? 0.32 : transparencyMode === 'xray' ? 0.14 : 1
  const edges = useMemo(() => new EdgesGeometry(geometry, 24), [geometry])
  const bounds = useMemo(() => {
    geometry.computeBoundingBox()
    return geometry.boundingBox?.clone() ?? new Box3()
  }, [geometry])
  const center = useMemo(() => bounds.getCenter(new Vector3()), [bounds])
  const helper = useMemo(() => new Box3Helper(bounds, 0x78dcff), [bounds])
  const shouldStartExploded = assemblyChallengeActive && !assembled
  const dragMatrix = useMemo(() => {
    if (!shouldStartExploded) return new Matrix4()
    const offset = getExplodeOffset(id, 1)
    return new Matrix4().makeTranslation(...offset)
    // DragControls mutates this matrix; the reset sequence intentionally creates a fresh instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assemblyResetSequence, id, shouldStartExploded])
  const dragPosition = useRef(new Vector3())

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const offset = assemblyChallengeActive ? [0, 0, 0] : getExplodeOffset(id, useCulvertStore.getState().explodeProgress)
    groupRef.current.position.set(
      position[0] + offset[0],
      position[1] + offset[1],
      position[2] + offset[2],
    )
    const targetRotation = id === 'bottom-slab' && bottomViewEnabled ? Math.PI : 0
    groupRef.current.rotation.z = MathUtils.damp(groupRef.current.rotation.z, targetRotation, 5.2, delta)
  })

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    setHoveredComponentId(id)
  }

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (useCulvertStore.getState().hoveredComponentId === id) setHoveredComponentId(null)
  }

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setSelectedComponentId(id)
  }

  const component = (
    <group ref={groupRef} visible={visible} position={position} name={id} userData={{ componentId: id }}>
      <mesh
        geometry={geometry}
        castShadow={!dimmed}
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          emissive={assembled ? '#39d98a' : selected ? '#54e9ff' : hovered ? '#1ba9c5' : spotlighted ? '#9a7415' : '#000000'}
          emissiveIntensity={assembled ? 0.3 : selected ? bottomViewEnabled ? 0.12 : 0.48 : hovered ? 0.3 : spotlighted ? 0.18 : 0}
          roughness={0.72}
          metalness={0.03}
          side={DoubleSide}
          transparent={transparent}
          opacity={opacity}
          wireframe={transparencyMode === 'xray'}
          depthWrite={!transparent}
          clippingPlanes={getClippingPlanes(clippingMode)}
          clipShadows
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={selected ? CULVERT_COLORS.selected : hovered ? '#5ce7ff' : CULVERT_COLORS.edge}
          transparent
          opacity={dimmed ? 0.08 : transparencyMode === 'xray' ? 0.78 : selected ? 1 : hovered ? 0.82 : 0.42}
          clippingPlanes={getClippingPlanes(clippingMode)}
        />
      </lineSegments>
      {debugEnabled && boundingBoxesVisible && <primitive object={helper} />}
      {debugEnabled && originsVisible && <axesHelper args={[1.1]} />}
      {debugEnabled && labelsVisible && visible && (!isolationEnabled || selected) && (spotlightComponentIds === null || spotlighted) && (
        <Html position={[center.x, center.y + 0.45, center.z]} center distanceFactor={18} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-md border border-cyan-300/30 bg-slate-950/85 px-2 py-1 text-[10px] font-medium tracking-wide text-cyan-100 shadow-lg">
            {name}<span className="ml-1 text-cyan-400/60">{id}</span>
          </div>
        </Html>
      )}
      {id === 'bottom-slab' && bottomViewEnabled && (
        <>
          <Line points={[[0, -2.62, -7], [0, -4, -9]]} color="#ffd35a" lineWidth={2} />
          <Html position={[0, -4.2, -10]} center distanceFactor={28} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-lg border border-amber-300/40 bg-slate-950/90 px-3 py-1.5 text-[11px] font-semibold text-amber-100 shadow-xl">
              底板底面燕尾形空槽
            </div>
          </Html>
        </>
      )}
    </group>
  )

  if (!assemblyChallengeActive || assembled) return component
  return (
    <DragControls
      matrix={dragMatrix}
      onDragStart={(origin) => {
        dragPosition.current.copy(origin)
        setSelectedComponentId(id)
      }}
      onDrag={(localMatrix) => dragPosition.current.setFromMatrixPosition(localMatrix)}
      onDragEnd={() => finishAssemblyDrag(id, dragPosition.current.length() <= ASSEMBLY_SNAP_DISTANCE)}
    >
      {component}
    </DragControls>
  )
}
