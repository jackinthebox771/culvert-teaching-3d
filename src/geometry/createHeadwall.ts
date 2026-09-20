import { ExtrudeGeometry, Shape } from 'three'
import { CULVERT_DIMENSIONS as D, toScene } from '../config/culvertDimensions'
import { addSemicircle } from './geometryUtils'

export function createHeadwall() {
  const thickness = toScene(D.headwall.thickness)
  const baseWidth = toScene(D.headwall.baseWidth)
  const topWidth = toScene(D.headwall.topWidth)
  const height = toScene(D.headwall.totalHeight)
  const chamferX = toScene(D.headwall.chamferX)
  const chamferY = toScene(D.headwall.chamferY)
  const innerRadius = toScene(D.barrel.innerRadius)
  const springY = toScene(D.barrel.sideWallHeight)
  const shape = new Shape()

  shape.moveTo(-baseWidth / 2, 0)
  shape.lineTo(-topWidth / 2, height - chamferY)
  shape.lineTo(-topWidth / 2 + chamferX, height)
  shape.lineTo(topWidth / 2 - chamferX, height)
  shape.lineTo(topWidth / 2, height - chamferY)
  shape.lineTo(baseWidth / 2, 0)
  shape.lineTo(innerRadius, 0)
  shape.lineTo(innerRadius, springY)
  addSemicircle(shape, springY, innerRadius, true, D.barrel.radialSegments)
  shape.lineTo(-innerRadius, 0)
  shape.closePath()

  const geometry = new ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: false,
    curveSegments: D.barrel.radialSegments,
  })
  geometry.translate(0, 0, -thickness / 2)
  geometry.computeVertexNormals()
  return geometry
}
