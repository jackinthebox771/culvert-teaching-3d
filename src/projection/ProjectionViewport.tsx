import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { ProjectionAssembly } from './ProjectionAssembly'

export type ProjectionViewId = 'front' | 'horizontal' | 'side' | 'isometric'

interface ViewDefinition {
  position: [number, number, number]
  up: [number, number, number]
  target: [number, number, number]
  extent: [number, number]
}

const VIEW_DEFINITIONS: Record<Exclude<ProjectionViewId, 'isometric'>, ViewDefinition> = {
  // 从 -X 侧观察，使前端（-Z）在正面投影图中位于左侧，
  // 与水平投影图和三维轴测图的前后端对应关系保持一致。
  front: { position: [-50, 3, 0], up: [0, 1, 0], target: [0, 3, 0], extent: [36, 15] },
  horizontal: { position: [0, 50, 0], up: [1, 0, 0], target: [0, 0, 0], extent: [36, 22] },
  side: { position: [0, 3, -50], up: [0, 1, 0], target: [0, 3, 0], extent: [22, 15] },
}

function OrthographicRig({ view }: { view: Exclude<ProjectionViewId, 'isometric'> }) {
  const size = useThree((state) => state.size)
  const definition = VIEW_DEFINITIONS[view]
  const zoom = Math.min(size.width / definition.extent[0], size.height / definition.extent[1]) * 0.9
  return (
    <OrthographicCamera
      makeDefault
      position={definition.position}
      up={definition.up}
      zoom={zoom}
      near={0.1}
      far={200}
      onUpdate={(camera) => camera.lookAt(new Vector3(...definition.target))}
    />
  )
}

function OrthographicScene({ view, reveal }: { view: Exclude<ProjectionViewId, 'isometric'>; reveal: number }) {
  return (
    <>
      <OrthographicRig view={view} />
      <ProjectionAssembly opacity={reveal} />
    </>
  )
}

function IsometricScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[-36, 25, -41]} fov={42} near={0.1} far={140} />
      <ambientLight intensity={1.5} />
      <ProjectionAssembly />
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} target={[0, 2.5, 0]} minDistance={18} maxDistance={90} />
    </>
  )
}

export function ProjectionScene({ view, reveal = 1 }: { view: ProjectionViewId; reveal?: number }) {
  return view === 'isometric' ? <IsometricScene /> : <OrthographicScene view={view} reveal={reveal} />
}
