import type { CulvertComponentId } from '../types/culvert'
import { CULVERT_DIMENSIONS as D, toScene } from './culvertDimensions'

export interface DimensionDefinition {
  id: string
  label: string
  value: string
  start: [number, number, number]
  end: [number, number, number]
  offset: [number, number, number]
  componentIds: readonly CulvertComponentId[]
  key?: boolean
}

const half = (value: number) => toScene(value) / 2
const mm = (value: number) => `${value} mm`

const ALL_COMPONENTS = [
  'bottom-slab', 'barrel', 'front-headwall', 'rear-headwall',
  'front-left-wing-wall', 'front-right-wing-wall', 'rear-left-wing-wall', 'rear-right-wing-wall',
] as const satisfies readonly CulvertComponentId[]

export const DIMENSION_DEFINITIONS: readonly DimensionDefinition[] = [
  {
    id: 'overall-length', label: '总体长度', value: mm(D.overall.length.value), key: true,
    start: [-7, 0, -half(D.overall.length.value)],
    end: [-7, 0, half(D.overall.length.value)],
    offset: [0, 12, 0], componentIds: ALL_COMPONENTS,
  },
  {
    id: 'overall-width', label: '总体宽度', value: mm(D.overall.width.value), key: true,
    start: [-half(D.overall.width.value), 0, -14],
    end: [half(D.overall.width.value), 0, -14],
    offset: [0, 10.5, 0], componentIds: ALL_COMPONENTS,
  },
  {
    id: 'overall-height', label: '总体高度', value: mm(D.overall.heightFromSlabBottom.value), key: true,
    start: [half(D.overall.width.value), -2.5, 0],
    end: [half(D.overall.width.value), 9, 0],
    offset: [1.7, 0, 0], componentIds: ALL_COMPONENTS,
  },
  {
    id: 'slab-thickness', label: '底板厚度', value: mm(D.bottomSlab.thickness.value),
    start: [-half(D.bottomSlab.portalWidth.value), -2.5, 0],
    end: [-half(D.bottomSlab.portalWidth.value), 0, 0],
    offset: [-1.3, 0, 0], componentIds: ['bottom-slab'],
  },
  {
    id: 'groove-center-width', label: '燕尾槽中央宽度', value: mm(D.bottomSlab.dovetailGroove.centerWidth.value),
    start: [-half(D.bottomSlab.dovetailGroove.centerWidth.value), -2.56, -4],
    end: [half(D.bottomSlab.dovetailGroove.centerWidth.value), -2.56, -4],
    offset: [0, -0.7, 0], componentIds: ['bottom-slab'],
  },
  {
    id: 'groove-end-width', label: '燕尾槽端部宽度', value: mm(D.bottomSlab.dovetailGroove.endWidth.value),
    start: [-half(D.bottomSlab.dovetailGroove.endWidth.value), -2.56, 14],
    end: [half(D.bottomSlab.dovetailGroove.endWidth.value), -2.56, 14],
    offset: [0, -0.7, 0.7], componentIds: ['bottom-slab'],
  },
  {
    id: 'groove-length', label: '燕尾槽纵向长度', value: mm(D.bottomSlab.dovetailGroove.length.value),
    start: [0, -2.56, -15], end: [0, -2.56, 15],
    offset: [4.2, -0.7, 0], componentIds: ['bottom-slab'],
  },
  {
    id: 'barrel-length', label: '洞身长度', value: mm(D.barrel.length.value),
    start: [-half(D.barrel.baseWidth.value), 0, -half(D.barrel.length.value)],
    end: [-half(D.barrel.baseWidth.value), 0, half(D.barrel.length.value)],
    offset: [-1.2, 0, 0], componentIds: ['barrel'],
  },
  {
    id: 'barrel-inner-radius', label: '内拱半径', value: `R${D.barrel.innerRadius.value}`,
    start: [0, D.barrel.sideWallHeight.value / 1000, 0],
    end: [toScene(D.barrel.innerRadius), D.barrel.sideWallHeight.value / 1000, 0],
    offset: [0, 0.65, 0], componentIds: ['barrel'],
  },
  {
    id: 'front-headwall-width', label: '面墙底宽', value: mm(D.headwall.baseWidth.value),
    start: [-half(D.headwall.baseWidth.value), 0, -10], end: [half(D.headwall.baseWidth.value), 0, -10],
    offset: [0, -0.8, -0.5], componentIds: ['front-headwall'],
  },
  {
    id: 'front-headwall-height', label: '面墙总高', value: mm(D.headwall.totalHeight.value),
    start: [half(D.headwall.baseWidth.value), 0, -10], end: [half(D.headwall.baseWidth.value), 9, -10],
    offset: [1.2, 0, 0], componentIds: ['front-headwall'],
  },
  {
    id: 'rear-headwall-width', label: '面墙底宽', value: mm(D.headwall.baseWidth.value),
    start: [-half(D.headwall.baseWidth.value), 0, 10], end: [half(D.headwall.baseWidth.value), 0, 10],
    offset: [0, -0.8, 0.5], componentIds: ['rear-headwall'],
  },
  {
    id: 'rear-headwall-height', label: '面墙总高', value: mm(D.headwall.totalHeight.value),
    start: [half(D.headwall.baseWidth.value), 0, 10], end: [half(D.headwall.baseWidth.value), 9, 10],
    offset: [1.2, 0, 0], componentIds: ['rear-headwall'],
  },
  ...wingDimensions('front-left-wing-wall', -8, -10, -15, -1),
  ...wingDimensions('front-right-wing-wall', 8, -10, -15, 1),
  ...wingDimensions('rear-left-wing-wall', -8, 10, 15, -1),
  ...wingDimensions('rear-right-wing-wall', 8, 10, 15, 1),
]

function wingDimensions(
  componentId: CulvertComponentId,
  x: number,
  rootZ: number,
  endZ: number,
  xDirection: -1 | 1,
): DimensionDefinition[] {
  return [
    {
      id: `${componentId}-length`, label: '翼墙纵向长度', value: mm(D.wingWall.length.value),
      start: [x, 0, rootZ], end: [x, 0, endZ], offset: [xDirection, 0, 0],
      componentIds: [componentId],
    },
    {
      id: `${componentId}-root-height`, label: '翼墙根部高度', value: mm(D.wingWall.rootHeight.value),
      start: [x, 0, rootZ], end: [x, 7, rootZ], offset: [xDirection, 0, 0],
      componentIds: [componentId],
    },
  ]
}
