import { ContactShadows, Grid } from '@react-three/drei'
import { useCulvertStore } from '../store/useCulvertStore'

export function GroundGrid() {
  const debugEnabled = useCulvertStore((state) => state.debugEnabled)
  const gridVisible = useCulvertStore((state) => state.gridVisible)
  const bottomViewEnabled = useCulvertStore((state) => state.bottomViewEnabled)
  return (
    <>
      {debugEnabled && gridVisible && !bottomViewEnabled && (
        <Grid
          position={[0, -2.52, 0]}
          args={[48, 48]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#17658a"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#2ea8d5"
          fadeDistance={38}
          fadeStrength={1.2}
          infiniteGrid
        />
      )}
      {!bottomViewEnabled && <ContactShadows position={[0, -2.51, 0]} opacity={0.38} scale={42} blur={2.4} far={18} />}
    </>
  )
}
