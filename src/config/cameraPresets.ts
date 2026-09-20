import type { CameraPresetId } from '../types/culvert'

export interface CameraPreset {
  id: CameraPresetId
  label: string
  position: [number, number, number]
  target: [number, number, number]
  up?: [number, number, number]
}

export const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  // The reference views define the teaching directions. The small X offset in
  // the horizontal view keeps the longitudinal Z axis horizontal on screen.
  isometric: { id: 'isometric', label: '默认轴测', position: [-36, 25, -41], target: [0, 2.5, 0] },
  front: { id: 'front', label: '正面投影图方向', position: [50, 6, 0], target: [0, 2.5, 0] },
  horizontal: { id: 'horizontal', label: '水平投影图方向', position: [0.01, 50, 0], target: [0, 0, 0], up: [1, 0, 0] },
  side: { id: 'side', label: '侧面投影图方向', position: [0, 6, -48], target: [0, 2.5, 0] },
  bottom: { id: 'bottom', label: '底板底视', position: [0.01, 68, -4.01], target: [0, 1.25, -4] },
  wingWallPlan: { id: 'wingWallPlan', label: '翼墙水平工作位', position: [0.01, 42, 0], target: [0, 1.2, 0], up: [1, 0, 0] },
}
