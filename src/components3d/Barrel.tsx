import type { BufferGeometry } from 'three'
import { CULVERT_COLORS } from '../config/colors'
import { ComponentMesh } from './ComponentMesh'

export function Barrel({ geometry }: { geometry: BufferGeometry }) {
  return <ComponentMesh id="barrel" name="洞身" color={CULVERT_COLORS.barrel} geometry={geometry} />
}
