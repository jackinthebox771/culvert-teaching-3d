import { ExtrudeGeometry, Shape } from 'three'
import { CULVERT_DIMENSIONS as D, toScene } from '../config/culvertDimensions'
import { addSemicircle } from './geometryUtils'

export function createBarrel() {
  const innerRadius = toScene(D.barrel.innerRadius)
  const outerRadius = toScene(D.barrel.outerRadius)
  const baseHalfWidth = toScene(D.barrel.baseWidth) / 2
  const wallHeight = toScene(D.barrel.sideWallHeight)
  const length = toScene(D.barrel.length)
  const shape = new Shape()

  shape.moveTo(-baseHalfWidth, 0)
  shape.lineTo(-outerRadius, wallHeight)
  addSemicircle(shape, wallHeight, outerRadius, false, D.barrel.radialSegments)
  shape.lineTo(baseHalfWidth, 0)
  shape.lineTo(innerRadius, 0)
  shape.lineTo(innerRadius, wallHeight)
  addSemicircle(shape, wallHeight, innerRadius, true, D.barrel.radialSegments)
  shape.lineTo(-innerRadius, 0)
  shape.closePath()

  const geometry = new ExtrudeGeometry(shape, {
    depth: length,
    bevelEnabled: false,
    curveSegments: D.barrel.radialSegments,
  })
  geometry.translate(0, 0, -length / 2)
  geometry.computeVertexNormals()
  return geometry
}
