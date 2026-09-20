import type { ChallengeMode, CulvertComponentId, OrthographicViewId } from '../types/culvert'

export const CHALLENGE_MODES: ReadonlyArray<{
  id: ChallengeMode
  title: string
  subtitle: string
}> = [
  { id: 'identify', title: '挑战 1 · 认构件', subtitle: '根据三维高亮选择准确构件名称' },
  { id: 'projection-to-model', title: '挑战 2 · 图找物', subtitle: '根据二维投影在三维模型中找出构件' },
  { id: 'model-to-projection', title: '挑战 3 · 物找图', subtitle: '为高亮构件选择指定方向的投影图' },
  { id: 'assembly', title: '挑战 4 · 拼装涵洞', subtitle: '把八个分解构件拖回正确空间位置' },
]

export const ORTHOGRAPHIC_VIEW_LABELS: Record<OrthographicViewId, string> = {
  front: '正面投影图',
  horizontal: '水平投影图',
  side: '侧面投影图',
}

export const ORTHOGRAPHIC_VIEW_IDS = Object.keys(ORTHOGRAPHIC_VIEW_LABELS) as OrthographicViewId[]

/** 场景单位为 m。拖动构件原点进入该半径后自动吸附到正式装配位置。 */
export const ASSEMBLY_SNAP_DISTANCE = 3.2

/** 拼装顺序提示只用于教学反馈，不限制学生自由拖动。 */
export const ASSEMBLY_HINT_ORDER: readonly CulvertComponentId[] = [
  'bottom-slab',
  'barrel',
  'front-headwall',
  'rear-headwall',
  'front-left-wing-wall',
  'front-right-wing-wall',
  'rear-left-wing-wall',
  'rear-right-wing-wall',
]
