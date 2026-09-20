import { ExtrudeGeometry, Shape } from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import { CULVERT_DIMENSIONS as D, toScene } from '../config/culvertDimensions'

function createSlabPlan() {
  const length = toScene(D.bottomSlab.length)
  const centerWidth = toScene(D.bottomSlab.centerWidth)
  const portalWidth = toScene(D.bottomSlab.portalWidth)
  const portalDepth = toScene(D.bottomSlab.portalDepth)
  const shape = new Shape()
  const z0 = -length / 2
  const transition = toScene(D.bottomSlab.segmentLengths.transitionZone)
  const z1 = z0 + portalDepth
  const z2 = z1 + transition
  const z3 = length / 2 - portalDepth - transition
  const z4 = length / 2 - portalDepth

  shape.moveTo(-portalWidth / 2, z0)
  shape.lineTo(portalWidth / 2, z0)
  shape.lineTo(portalWidth / 2 - 1.5, z1)
  shape.lineTo(portalWidth / 2 - 1.5, z2)
  shape.lineTo(centerWidth / 2, z2)
  shape.lineTo(centerWidth / 2, z3)
  shape.lineTo(portalWidth / 2 - 1.5, z3)
  shape.lineTo(portalWidth / 2 - 1.5, z4)
  shape.lineTo(portalWidth / 2, length / 2)
  shape.lineTo(-portalWidth / 2, length / 2)
  shape.lineTo(-portalWidth / 2 + 1.5, z4)
  shape.lineTo(-portalWidth / 2 + 1.5, z3)
  shape.lineTo(-centerWidth / 2, z3)
  shape.lineTo(-centerWidth / 2, z2)
  shape.lineTo(-portalWidth / 2 + 1.5, z2)
  shape.lineTo(-portalWidth / 2 + 1.5, z1)
  shape.closePath()
  return shape
}

function createDovetailCutter() {
  const groove = D.bottomSlab.dovetailGroove
  const endWidth = toScene(groove.endWidth)
  const centerWidth = toScene(groove.centerWidth)
  const depth = toScene(groove.depth)
  const length = toScene(groove.length)
  const taperLength = toScene(groove.taperLength)
  const slabThickness = toScene(D.bottomSlab.thickness)

  const section = new Shape()
  section.moveTo(-endWidth / 2, -length / 2)
  section.lineTo(endWidth / 2, -length / 2)
  section.lineTo(centerWidth / 2, -length / 2 + taperLength)
  section.lineTo(centerWidth / 2, length / 2 - taperLength)
  section.lineTo(endWidth / 2, length / 2)
  section.lineTo(-endWidth / 2, length / 2)
  section.lineTo(-centerWidth / 2, length / 2 - taperLength)
  section.lineTo(-centerWidth / 2, -length / 2 + taperLength)
  section.closePath()

  const cutter = new ExtrudeGeometry(section, { depth: depth + 0.02, bevelEnabled: false })
  cutter.rotateX(Math.PI / 2)
  cutter.translate(0, -slabThickness - 0.01, 0)
  return cutter
}

export function createBottomSlab() {
  const thickness = toScene(D.bottomSlab.thickness)
  const slab = new ExtrudeGeometry(createSlabPlan(), {
    depth: thickness,
    bevelEnabled: false,
  })
  // Shape 的第二坐标先作为 Z，挤出轴再转为竖向 Y；顶面最终位于 Y=0。
  slab.rotateX(Math.PI / 2)

  if (!D.bottomSlab.dovetailGroove.enabled) return slab

  const evaluator = new Evaluator()
  const result = evaluator.evaluate(new Brush(slab), new Brush(createDovetailCutter()), SUBTRACTION)
  result.geometry.computeVertexNormals()
  result.geometry.computeBoundingBox()
  result.geometry.computeBoundingSphere()
  return result.geometry
}
