import { useFBX } from '@react-three/drei'
import { type ThreeEvent } from '@react-three/fiber'
import { useMemo } from 'react'
import { DoubleSide, EdgesGeometry, type BufferGeometry } from 'three'
import fbxUrl from '../../docs/涵洞三维模型.fbx?url'
import { CULVERT_COLORS } from '../config/colors'
import { loadVerifiedFbxGeometry } from '../geometry/loadVerifiedFbxGeometry'
import { useCulvertStore } from '../store/useCulvertStore'
import { COMPONENT_IDS, type CulvertComponentId } from '../types/culvert'

const COMPONENT_COLORS: Record<CulvertComponentId, string> = {
  'bottom-slab': CULVERT_COLORS.bottomSlab,
  barrel: CULVERT_COLORS.barrel,
  'front-headwall': CULVERT_COLORS.headwall,
  'rear-headwall': CULVERT_COLORS.headwall,
  'front-left-wing-wall': CULVERT_COLORS.wingWall,
  'front-right-wing-wall': CULVERT_COLORS.wingWall,
  'rear-left-wing-wall': CULVERT_COLORS.wingWall,
  'rear-right-wing-wall': CULVERT_COLORS.wingWall,
}

function ProjectionComponent({ id, geometry, opacity }: { id: CulvertComponentId; geometry: BufferGeometry; opacity: number }) {
  const selectedComponentId = useCulvertStore((state) => state.selectedComponentId)
  const hoveredComponentId = useCulvertStore((state) => state.hoveredComponentId)
  const visible = useCulvertStore((state) => state.visibility[id])
  const setSelectedComponentId = useCulvertStore((state) => state.setSelectedComponentId)
  const setHoveredComponentId = useCulvertStore((state) => state.setHoveredComponentId)
  const edges = useMemo(() => new EdgesGeometry(geometry, 24), [geometry])
  const selected = selectedComponentId === id
  const hovered = hoveredComponentId === id

  const stop = (event: ThreeEvent<PointerEvent | MouseEvent>) => event.stopPropagation()

  if (!visible) return null
  return (
    <group name={id} userData={{ componentId: id }}>
      <mesh
        geometry={geometry}
        onPointerOver={(event) => {
          stop(event)
          setHoveredComponentId(id)
        }}
        onPointerOut={(event) => {
          stop(event)
          if (useCulvertStore.getState().hoveredComponentId === id) setHoveredComponentId(null)
        }}
        onClick={(event) => {
          stop(event)
          setSelectedComponentId(id)
        }}
      >
        <meshBasicMaterial
          color={selected ? '#dffaff' : hovered ? '#8deeff' : COMPONENT_COLORS[id]}
          side={DoubleSide}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
          transparent={opacity < 1}
          opacity={opacity}
          depthWrite={opacity > 0.98}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={selected ? '#ffffff' : '#bdefff'} transparent opacity={(selected ? 1 : 0.68) * opacity} />
      </lineSegments>
    </group>
  )
}

export function ProjectionAssembly({ opacity = 1 }: { opacity?: number }) {
  const source = useFBX(fbxUrl)
  const geometry = useMemo(() => loadVerifiedFbxGeometry(source), [source])
  return (
    <group name="projection-culvert">
      {COMPONENT_IDS.map((id) => <ProjectionComponent key={id} id={id} geometry={geometry[id]} opacity={opacity} />)}
    </group>
  )
}
