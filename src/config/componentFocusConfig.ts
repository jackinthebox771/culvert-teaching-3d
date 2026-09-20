import type { CulvertComponentId } from '../types/culvert'

export interface ComponentFocusConfig {
  position: [number, number, number]
  target: [number, number, number]
}

export const COMPONENT_FOCUS_CONFIG: Record<CulvertComponentId, ComponentFocusConfig> = {
  'bottom-slab': { position: [-36, 20, -41], target: [0, -1, 0] },
  barrel: { position: [-30, 18, -28], target: [0, 3, 0] },
  'front-headwall': { position: [-24, 14, -34], target: [0, 3, -14] },
  'rear-headwall': { position: [24, 14, 34], target: [0, 3, 14] },
  'front-left-wing-wall': { position: [-24, 14, -34], target: [-5, 2.5, -13] },
  'front-right-wing-wall': { position: [24, 14, -34], target: [5, 2.5, -13] },
  'rear-left-wing-wall': { position: [-24, 14, 34], target: [-5, 2.5, 13] },
  'rear-right-wing-wall': { position: [24, 14, 34], target: [5, 2.5, 13] },
}
