import { Canvas } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { Suspense } from 'react'
import { CulvertAssembly } from '../components3d/CulvertAssembly'
import { useCulvertStore } from '../store/useCulvertStore'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { CameraRig } from './CameraRig'
import { ClippingSystem } from './ClippingSystem'
import { DimensionSystem } from './DimensionSystem'
import { ExplodeAnimator } from './ExplodeAnimator'
import { GroundGrid } from './GroundGrid'
import { SceneLights } from './SceneLights'

function SceneContents({ compact }: { compact: boolean }) {
  const debugEnabled = useCulvertStore((state) => state.debugEnabled)
  const axesVisible = useCulvertStore((state) => state.axesVisible)
  const hoveredComponentId = useCulvertStore((state) => state.hoveredComponentId)
  useCursor(hoveredComponentId !== null, 'pointer', 'auto')
  return (
    <>
      <color attach="background" args={['#06121f']} />
      <SceneLights compact={compact} />
      <CulvertAssembly />
      <GroundGrid />
      <ClippingSystem />
      <DimensionSystem />
      {debugEnabled && axesVisible && <axesHelper args={[4]} position={[0, 0.025, 0]} />}
      <ExplodeAnimator />
      <CameraRig />
    </>
  )
}

export function CulvertScene() {
  const compact = useMediaQuery('(max-width: 767px)')
  const clearSelection = useCulvertStore((state) => state.clearSelection)
  const setHoveredComponentId = useCulvertStore((state) => state.setHoveredComponentId)
  return (
    <Canvas
      dpr={compact ? [1, 1.25] : [1, 1.75]}
      shadows={compact ? false : 'basic'}
      camera={{ position: [-36, 25, -41], fov: 44, near: 0.1, far: 140 }}
      gl={{ antialias: true, alpha: false, localClippingEnabled: true }}
      onPointerMissed={clearSelection}
      onPointerLeave={() => setHoveredComponentId(null)}
    >
      <Suspense fallback={null}>
        <SceneContents compact={compact} />
      </Suspense>
    </Canvas>
  )
}
