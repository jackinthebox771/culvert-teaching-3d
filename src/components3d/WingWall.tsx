import type { BufferGeometry } from 'three'
import { CULVERT_COLORS } from '../config/colors'
import type { PortalEnd, WingSide } from '../geometry/createWingWall'
import { ComponentMesh } from './ComponentMesh'

interface WingWallProps { side: WingSide; end: PortalEnd; geometry: BufferGeometry }

export function WingWall({ side, end, geometry }: WingWallProps) {
  const id = `${end}-${side}-wing-wall` as const
  const names = {
    'front-left-wing-wall': '前端左翼墙',
    'front-right-wing-wall': '前端右翼墙',
    'rear-left-wing-wall': '后端左翼墙',
    'rear-right-wing-wall': '后端右翼墙',
  } as const
  return <ComponentMesh id={id} name={names[id]} color={CULVERT_COLORS.wingWall} geometry={geometry} />
}
