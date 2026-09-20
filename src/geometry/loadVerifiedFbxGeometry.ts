import { BufferAttribute, BufferGeometry, Group, Mesh } from 'three'
import type { CulvertComponentId } from '../types/culvert'

const FBX_UNIT_TO_SCENE_METRES = 0.3048
const SLAB_TOP_Y_IN_FBX_METRES = 2.5
const MODEL_CENTER_Z_IN_FBX_METRES = 16

const MESH_NAME_BY_COMPONENT: Record<CulvertComponentId, string> = {
  'bottom-slab': '_连接的实心几何图形_15164',
  barrel: '_连接的实心几何图形_15745',
  'front-headwall': '_连接的实心几何图形_15769',
  'rear-headwall': '_连接的实心几何图形_16231',
  'front-left-wing-wall': '_融合_7979',
  'front-right-wing-wall': '_融合_13038',
  'rear-left-wing-wall': '_融合_15049',
  'rear-right-wing-wall': '_融合_15096',
}

/**
 * 将 AutoCAD FBX 的九个网格转换为教学模型的八个独立构件。
 * FBX 使用英尺；FBXLoader 已完成 Z-up 到 Y-up 的轴转换。
 * `_空心_拉伸_15041` 是燕尾槽辅助/切割实体，不作为实体构件渲染。
 */
export function loadVerifiedFbxGeometry(root: Group): Record<CulvertComponentId, BufferGeometry> {
  root.updateMatrixWorld(true)
  return Object.fromEntries(
    Object.entries(MESH_NAME_BY_COMPONENT).map(([componentId, meshName]) => {
      const mesh = root.getObjectByName(meshName) as Mesh<BufferGeometry> | undefined
      if (!mesh?.geometry) throw new Error(`FBX 中缺少必需网格：${meshName}`)
      const geometry = mesh.geometry.clone()
      const sourcePosition = geometry.getAttribute('position') as BufferAttribute
      for (let vertexIndex = 0; vertexIndex < sourcePosition.count; vertexIndex += 1) {
        const sourceX = sourcePosition.getX(vertexIndex)
        const sourceY = sourcePosition.getY(vertexIndex)
        const sourceZ = sourcePosition.getZ(vertexIndex)
        sourcePosition.setXYZ(
          vertexIndex,
          sourceX * FBX_UNIT_TO_SCENE_METRES,
          sourceZ * FBX_UNIT_TO_SCENE_METRES - SLAB_TOP_Y_IN_FBX_METRES,
          -sourceY * FBX_UNIT_TO_SCENE_METRES - MODEL_CENTER_Z_IN_FBX_METRES,
        )
      }
      sourcePosition.needsUpdate = true
      geometry.computeVertexNormals()
      geometry.computeBoundingBox()
      geometry.computeBoundingSphere()
      return [componentId, geometry]
    }),
  ) as Record<CulvertComponentId, BufferGeometry>
}
