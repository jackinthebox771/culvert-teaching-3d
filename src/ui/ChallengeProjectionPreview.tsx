import { OrthographicCamera, useFBX } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import { Box3, DoubleSide, EdgesGeometry, Vector3 } from 'three'
import fbxUrl from '../../docs/涵洞三维模型.fbx?url'
import { loadVerifiedFbxGeometry } from '../geometry/loadVerifiedFbxGeometry'
import type { CulvertComponentId, OrthographicViewId } from '../types/culvert'

const VIEW_DIRECTION: Record<OrthographicViewId, [number, number, number]> = {
  front: [-1, 0, 0],
  horizontal: [0, 1, 0],
  side: [0, 0, -1],
}

function ProjectionSubject({ componentId, view }: { componentId: CulvertComponentId; view: OrthographicViewId }) {
  const source = useFBX(fbxUrl)
  const geometries = useMemo(() => loadVerifiedFbxGeometry(source), [source])
  const geometry = geometries[componentId]
  const edges = useMemo(() => new EdgesGeometry(geometry, 24), [geometry])
  const size = useThree((state) => state.size)
  const framing = useMemo(() => {
    geometry.computeBoundingBox()
    const bounds = geometry.boundingBox?.clone() ?? new Box3()
    const center = bounds.getCenter(new Vector3())
    const dimensions = bounds.getSize(new Vector3())
    const projected = view === 'front'
      ? [dimensions.z, dimensions.y]
      : view === 'side'
        ? [dimensions.x, dimensions.y]
        : [dimensions.z, dimensions.x]
    const zoom = Math.min(
      size.width / Math.max(projected[0] * 1.28, 0.1),
      size.height / Math.max(projected[1] * 1.28, 0.1),
    )
    const direction = new Vector3(...VIEW_DIRECTION[view])
    const position = center.clone().addScaledVector(direction, 60)
    return { center, position, zoom }
  }, [geometry, size.height, size.width, view])

  return (
    <>
      <OrthographicCamera
        makeDefault
        position={framing.position.toArray()}
        up={view === 'horizontal' ? [1, 0, 0] : [0, 1, 0]}
        zoom={framing.zoom}
        near={0.1}
        far={140}
        onUpdate={(camera) => camera.lookAt(framing.center)}
      />
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#38cde1" side={DoubleSide} transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#d9fbff" />
      </lineSegments>
    </>
  )
}

export function ChallengeProjectionPreview({
  componentId,
  view,
  className = '',
}: {
  componentId: CulvertComponentId
  view: OrthographicViewId
  className?: string
}) {
  return (
    <div className={`projection-panel overflow-hidden rounded-lg bg-[#061521] ${className}`}>
      <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ProjectionSubject componentId={componentId} view={view} />
        </Suspense>
      </Canvas>
    </div>
  )
}
