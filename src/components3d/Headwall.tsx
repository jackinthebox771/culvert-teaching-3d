import type { BufferGeometry } from 'three'
import { CULVERT_COLORS } from '../config/colors'
import { ComponentMesh } from './ComponentMesh'

interface HeadwallProps { end: 'front' | 'rear'; geometry: BufferGeometry }

export function Headwall({ end, geometry }: HeadwallProps) {
  return (
    <ComponentMesh
      id={`${end}-headwall`}
      name={end === 'front' ? '前端面墙' : '后端面墙'}
      color={CULVERT_COLORS.headwall}
      geometry={geometry}
    />
  )
}
