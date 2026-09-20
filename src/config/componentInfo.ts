import type { CulvertComponentId } from '../types/culvert'
import { CULVERT_DIMENSIONS as D } from './culvertDimensions'

export interface ComponentInfo {
  id: CulvertComponentId
  name: string
  category: string
  location: string
  role: string
  shape: string
  keyFeature: string
  drawingTip: string
  dimensions: ReadonlyArray<{ label: string; value: string }>
  indent?: boolean
}

const mm = (value: number) => `${value} mm`

export const COMPONENT_INFO: Record<CulvertComponentId, ComponentInfo> = {
  'bottom-slab': {
    id: 'bottom-slab', name: '底板', category: '底板 Bottom Slab', location: '涵洞最下部，作为全部构件的空间基准。',
    role: '承托洞身、面墙与翼墙，并将上部荷载传递至地基。',
    shape: '整体为变宽板状实体，底面中部设燕尾形空槽。',
    keyFeature: '底面燕尾形空槽属于外观不易直接观察的隐蔽形体。',
    drawingTip: '重点比较水平投影的变宽轮廓，以及底面不可见槽口轮廓。',
    dimensions: [
      { label: '总长', value: mm(D.bottomSlab.length.value) },
      { label: '端部宽', value: mm(D.bottomSlab.portalWidth.value) },
      { label: '厚度', value: mm(D.bottomSlab.thickness.value) },
      { label: '燕尾槽深', value: mm(D.bottomSlab.dovetailGroove.depth.value) },
    ],
  },
  barrel: {
    id: 'barrel', name: '洞身', category: '洞身 Culvert Barrel', location: '位于涵洞中央，落在底板之上并贯穿两端面墙。',
    role: '形成涵洞的主体承重结构和连续通水空间。',
    shape: '由两侧边墙与上部拱圈构成，内部形成贯通拱形通道。',
    keyFeature: '边墙与拱圈连续连接，内外拱弧同心且孔洞纵向贯通。',
    drawingTip: '观察外轮廓与内部拱孔在不同投影方向中的重合和遮挡关系。',
    dimensions: [
      { label: '长度', value: mm(D.barrel.length.value) },
      { label: '内半径', value: `R${D.barrel.innerRadius.value}` },
      { label: '外半径', value: `R${D.barrel.outerRadius.value}` },
      { label: '总高', value: mm(D.barrel.totalHeight.value) },
    ],
  },
  'front-headwall': headwallInfo('front-headwall', '前端面墙', '涵洞前端洞口'),
  'rear-headwall': headwallInfo('rear-headwall', '后端面墙', '涵洞后端洞口'),
  'front-left-wing-wall': wingInfo('front-left-wing-wall', '前端左翼墙', '前端洞口左侧'),
  'front-right-wing-wall': wingInfo('front-right-wing-wall', '前端右翼墙', '前端洞口右侧'),
  'rear-left-wing-wall': wingInfo('rear-left-wing-wall', '后端左翼墙', '后端洞口左侧'),
  'rear-right-wing-wall': wingInfo('rear-right-wing-wall', '后端右翼墙', '后端洞口右侧'),
}

function headwallInfo(id: CulvertComponentId, name: string, location: string): ComponentInfo {
  return {
    id, name, category: '面墙 Headwall', location: `${location}，位于洞身端部。`,
    role: '稳定洞口端部并连接洞身与两侧翼墙。',
    shape: '直立墙体带拱形穿孔，顶部两端设倒角。',
    keyFeature: '拱形孔洞与洞身通道同轴，顶部两端具有 500×500 mm 倒角。',
    drawingTip: '重点识别拱形穿孔、顶部倒角及其与洞身通道的同轴关系。',
    dimensions: [
      { label: '总高', value: mm(D.headwall.totalHeight.value) },
      { label: '底宽', value: mm(D.headwall.baseWidth.value) },
      { label: '顶宽', value: mm(D.headwall.topWidth.value) },
      { label: '顶部倒角', value: `${D.headwall.chamferX.value} × ${D.headwall.chamferY.value} mm` },
    ],
  }
}

function wingInfo(id: CulvertComponentId, name: string, location: string): ComponentInfo {
  return {
    id, name, category: '翼墙 Wing Wall', location: `${location}，从面墙向外呈八字形展开。`,
    role: '挡土并引导洞口两侧土体与水流过渡。',
    shape: '具有厚度、斜置方向和高度变化的多折面空间实体。',
    keyFeature: '平面斜置并向外展开，根部至外端高度逐渐变化。',
    drawingTip: '重点比较其水平投影中的八字展开与立面投影中的变高轮廓。',
    dimensions: [
      { label: '纵向长度', value: mm(D.wingWall.length.value) },
      { label: '横向展开', value: mm(D.wingWall.transverseExtent.value) },
      { label: '根部高度', value: mm(D.wingWall.rootHeight.value) },
      { label: '外端高度', value: mm(D.wingWall.endHeight.value) },
    ],
    indent: true,
  }
}

export const COMPONENT_INFO_LIST = Object.values(COMPONENT_INFO)
