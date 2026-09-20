import type { BufferGeometry } from 'three'
import { CULVERT_COLORS } from '../config/colors'
import { ComponentMesh } from './ComponentMesh'

export function BottomSlab({ geometry }: { geometry: BufferGeometry }) {
  return <ComponentMesh id="bottom-slab" name="底板" color={CULVERT_COLORS.bottomSlab} geometry={geometry} />
}
