import {
  BufferGeometry,
  Float32BufferAttribute,
  Shape,
  Vector2,
} from 'three'

export function addSemicircle(
  shape: Shape,
  centerY: number,
  radius: number,
  reverse = false,
  segments = 64,
) {
  const points: Vector2[] = []
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments
    const angle = reverse ? t * Math.PI : Math.PI - t * Math.PI
    points.push(new Vector2(Math.cos(angle) * radius, centerY + Math.sin(angle) * radius))
  }
  points.forEach((point) => shape.lineTo(point.x, point.y))
}

export function createIndexedGeometry(
  vertices: number[],
  indices: number[],
): BufferGeometry {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}
