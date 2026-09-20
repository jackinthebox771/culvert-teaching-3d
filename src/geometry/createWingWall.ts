import { CULVERT_DIMENSIONS as D, toScene } from '../config/culvertDimensions'
import { createIndexedGeometry } from './geometryUtils'

export type WingSide = 'left' | 'right'
export type PortalEnd = 'front' | 'rear'

export function createWingWall(side: WingSide, end: PortalEnd) {
  const sideSign = side === 'left' ? -1 : 1
  const endSign = end === 'front' ? -1 : 1
  const length = toScene(D.wingWall.length)
  const thickness = toScene(D.wingWall.thickness)
  const rootHeight = toScene(D.wingWall.rootHeight)
  const endHeight = toScene(D.wingWall.endHeight)
  const angle = (D.wingWall.planAngle.value * Math.PI) / 180
  const barrelLength = toScene(D.barrel.length)
  const headwallThickness = toScene(D.headwall.thickness)
  const outerRadius = toScene(D.barrel.outerRadius)

  const rootX = sideSign * (outerRadius + thickness * 0.38)
  const rootZ = endSign * (barrelLength / 2 + headwallThickness / 2)
  const endX = rootX + sideSign * Math.sin(angle) * length
  const endZ = rootZ + endSign * Math.cos(angle) * length
  const dx = endX - rootX
  const dz = endZ - rootZ
  const invLength = 1 / Math.hypot(dx, dz)
  const px = -dz * invLength * thickness / 2
  const pz = dx * invLength * thickness / 2

  const v = [
    rootX + px, 0, rootZ + pz,
    rootX - px, 0, rootZ - pz,
    endX + px, 0, endZ + pz,
    endX - px, 0, endZ - pz,
    rootX + px, rootHeight, rootZ + pz,
    rootX - px, rootHeight, rootZ - pz,
    endX + px, endHeight, endZ + pz,
    endX - px, endHeight, endZ - pz,
  ]
  const i = [
    0, 2, 1, 1, 2, 3,
    4, 5, 6, 5, 7, 6,
    0, 4, 2, 2, 4, 6,
    1, 3, 5, 3, 7, 5,
    0, 1, 4, 1, 5, 4,
    2, 6, 3, 3, 6, 7,
  ]
  return createIndexedGeometry(v, i)
}
