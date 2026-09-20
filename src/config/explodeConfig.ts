import type { CulvertComponentId } from '../types/culvert'

export interface ExplodeConfigEntry {
  componentId: CulvertComponentId
  direction: readonly [number, number, number]
  distance: number
  startProgress: number
  endProgress: number
}

/**
 * 爆炸位移唯一配置源，场景单位为 m。
 * 顺序：底板向下 → 翼墙向两侧 → 面墙向前后 → 洞身向上。
 * 四个阶段互不重叠，确保逐步分解时一次只讲解一类构件。
 */
export const EXPLODE_CONFIG: Record<CulvertComponentId, ExplodeConfigEntry> = {
  'bottom-slab': entry('bottom-slab', [0, -1, 0], 5, 0, 0.25),
  'front-left-wing-wall': entry('front-left-wing-wall', [-0.75, 0, -0.66], 10, 0.25, 0.5),
  'front-right-wing-wall': entry('front-right-wing-wall', [0.75, 0, -0.66], 10, 0.25, 0.5),
  'rear-left-wing-wall': entry('rear-left-wing-wall', [-0.75, 0, 0.66], 10, 0.25, 0.5),
  'rear-right-wing-wall': entry('rear-right-wing-wall', [0.75, 0, 0.66], 10, 0.25, 0.5),
  'front-headwall': entry('front-headwall', [0, 0, -1], 8, 0.5, 0.75),
  'rear-headwall': entry('rear-headwall', [0, 0, 1], 8, 0.5, 0.75),
  barrel: entry('barrel', [0, 1, 0], 9, 0.75, 1),
}

function entry(
  componentId: CulvertComponentId,
  rawDirection: readonly [number, number, number],
  distance: number,
  startProgress: number,
  endProgress: number,
): ExplodeConfigEntry {
  const length = Math.hypot(...rawDirection) || 1
  return {
    componentId,
    direction: rawDirection.map((value) => value / length) as [number, number, number],
    distance,
    startProgress,
    endProgress,
  }
}

const smoothstep = (value: number) => value * value * (3 - 2 * value)

export function getExplodeOffset(id: CulvertComponentId, progress: number): [number, number, number] {
  const config = EXPLODE_CONFIG[id]
  if (config.distance === 0) return [0, 0, 0]
  const range = config.endProgress - config.startProgress
  const local = Math.min(1, Math.max(0, (progress - config.startProgress) / range))
  const distance = config.distance * smoothstep(local)
  return [
    config.direction[0] * distance,
    config.direction[1] * distance,
    config.direction[2] * distance,
  ]
}

export const EXPLODE_TEACHING_STEPS = [
  { progress: 0, label: '完整涵洞' },
  { progress: 0.25, label: '第 1 步：底板向下分离' },
  { progress: 0.5, label: '第 2 步：四片翼墙沿八字方向向两侧分离' },
  { progress: 0.75, label: '第 3 步：前后面墙沿纵轴分离' },
  { progress: 1, label: '第 4 步：洞身向上分离，全部构件完成分解' },
] as const

/** 爆炸 100% 时相机沿当前观察方向增加的距离，组合时等量恢复。 */
export const EXPLODE_CAMERA_RETREAT = 36
