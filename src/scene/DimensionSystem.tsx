import { Dimension3D } from '../components3d/Dimension3D'
import { DIMENSION_DEFINITIONS } from '../config/dimensionConfig'
import { useCulvertStore } from '../store/useCulvertStore'

export function DimensionSystem() {
  const mode = useCulvertStore((state) => state.dimensionMode)
  const selectedId = useCulvertStore((state) => state.selectedComponentId)
  const explodeProgress = useCulvertStore((state) => state.explodeProgress)
  const bottomViewEnabled = useCulvertStore((state) => state.bottomViewEnabled)

  if (mode === 'off' || explodeProgress > 0.001) return null
  const definitions = DIMENSION_DEFINITIONS.filter((definition) => {
    if (mode === 'all') return true
    if (mode === 'key') return definition.key
    if (definition.key || selectedId === null || !definition.componentIds.includes(selectedId)) return false
    return !bottomViewEnabled || definition.id.startsWith('groove-')
  })

  return (
    <group name="engineering-dimensions" rotation={bottomViewEnabled ? [0, 0, Math.PI] : [0, 0, 0]}>
      {definitions.map((definition) => <Dimension3D key={definition.id} definition={definition} />)}
    </group>
  )
}
