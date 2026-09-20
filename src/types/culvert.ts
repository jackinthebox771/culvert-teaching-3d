export const COMPONENT_IDS = [
  'bottom-slab',
  'barrel',
  'front-headwall',
  'rear-headwall',
  'front-left-wing-wall',
  'front-right-wing-wall',
  'rear-left-wing-wall',
  'rear-right-wing-wall',
] as const

export type CulvertComponentId = (typeof COMPONENT_IDS)[number]
export type CameraPresetId = 'isometric' | 'front' | 'horizontal' | 'side' | 'bottom' | 'wingWallPlan'
export type TransparencyMode = 'solid' | 'transparent' | 'xray'
export type ClippingMode = 'off' | 'cross' | 'longitudinal'
export type DimensionMode = 'off' | 'key' | 'component' | 'all'
export type WorkspaceMode = 'model' | 'projection'
export type ChallengeMode = 'identify' | 'projection-to-model' | 'model-to-projection' | 'assembly'
export type OrthographicViewId = 'front' | 'horizontal' | 'side'

export interface CulvertComponentMeta {
  id: CulvertComponentId
  nameZh: string
  nameEn: string
  category: 'bottom-slab' | 'barrel' | 'headwall' | 'wing-wall'
  color: string
}
