export type VerificationStatus = 'CONFIRMED' | 'TODO_VERIFY'

export interface DimensionValue {
  value: number
  unit: 'mm' | 'deg'
  status: VerificationStatus
  source: string
  note?: string
}

const mm = (value: number, source: string, note?: string): DimensionValue => ({
  value, unit: 'mm', status: 'CONFIRMED', source, note,
})

const deg = (value: number, source: string, note?: string): DimensionValue => ({
  value, unit: 'deg', status: 'CONFIRMED', source, note,
})

const DRAWING = '涵洞图纸.pdf：1-1 剖面图、2-2 剖面图、平面图'
const FBX = '涵洞三维模型.fbx：世界坐标按 1 ft = 304.8 mm 换算'

/**
 * 工程尺寸唯一数据源。
 * 当前值由正式图纸尺寸链与 FBX 独立网格包围盒/特征坐标交叉核对。
 * 成品几何使用 FBX 的八个独立实体网格，以避免把复杂多折面构件简化为示意体。
 */
export const CULVERT_DIMENSIONS = {
  scale: 1 / 1000,
  overall: {
    length: mm(32000, `${DRAWING}；${FBX}`),
    width: mm(18000, `${DRAWING}；${FBX}`),
    heightFromSlabBottom: mm(11500, FBX),
  },
  bottomSlab: {
    length: mm(32000, `${DRAWING}；${FBX}`),
    centerWidth: mm(12000, `${DRAWING}；${FBX}`),
    portalWidth: mm(18000, `${DRAWING}；${FBX}`),
    portalDepth: mm(6000, `${DRAWING}；${FBX}`, '端部 1000 外伸加 5000 翼墙区'),
    thickness: mm(2500, `${DRAWING} 相对标高 0.00/-2.50；${FBX}`),
    stepDepth: mm(1000, `${DRAWING}；${FBX}`, '两端底板外伸段'),
    segmentLengths: {
      endLip: mm(1000, `${DRAWING}；${FBX}`),
      wingZone: mm(5000, `${DRAWING}；${FBX}`),
      transitionZone: mm(4500, `${DRAWING}；${FBX}`),
      centerZone: mm(11000, `${DRAWING}；${FBX}`),
    },
    dovetailGroove: {
      enabled: true,
      endWidth: mm(7000, FBX, '底面空槽两端宽度'),
      centerWidth: mm(3000, FBX, '底面空槽中央宽度'),
      depth: mm(1500, FBX, '从底板底面向上切除，顶层保留 1000'),
      length: mm(30000, FBX, '槽从纵向 1000 延伸至 31000'),
      taperLength: mm(5000, FBX, '每端由 7000 收分到 3000'),
      centerLength: mm(20000, FBX),
    },
  },
  barrel: {
    length: mm(16200, FBX, '实体纵向包围范围 7900-24100'),
    baseWidth: mm(10000, FBX),
    innerRadius: mm(2500, `${DRAWING}；${FBX}`),
    outerRadius: mm(3500, `${DRAWING}；${FBX}`),
    sideWallHeight: mm(2500, `${DRAWING}；${FBX}`, '净孔直墙段高度'),
    totalHeight: mm(6000, `${DRAWING}；${FBX}`),
    radialSegments: 64,
  },
  headwall: {
    thickness: mm(3500, FBX, '面墙变截面实体的最大纵向深度'),
    baseWidth: mm(12000, FBX),
    topWidth: mm(8000, `${DRAWING}；${FBX}`),
    topStraightWidth: mm(7000, `${DRAWING}；${FBX}`),
    totalHeight: mm(9000, `${DRAWING}；${FBX}`),
    topCapDepth: mm(1500, `${DRAWING}；${FBX}`),
    chamferX: mm(500, `${DRAWING}；${FBX}`),
    chamferY: mm(500, `${DRAWING}；${FBX}`),
  },
  wingWall: {
    thickness: mm(1500, `${DRAWING}；${FBX}`, '顶部/端部控制厚度'),
    rootHeight: mm(7000, `${DRAWING}；${FBX}`),
    endHeight: mm(3500, FBX, '相对底板顶面的外端高度'),
    length: mm(5000, `${DRAWING}；${FBX}`, '纵向投影长度'),
    transverseExtent: mm(5250, FBX),
    planAngle: deg(46.4, FBX, '仅供旧参数化后备几何；正式翼墙采用多折面 FBX 实体'),
  },
} as const

export const toScene = (dimension: DimensionValue | number): number =>
  (typeof dimension === 'number' ? dimension : dimension.value) * CULVERT_DIMENSIONS.scale

export const TODO_VERIFY_DIMENSIONS: ReadonlyArray<readonly [string, DimensionValue]> = []
