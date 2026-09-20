import { Plane, Vector3 } from 'three'
import type { ClippingMode } from '../types/culvert'

type ActiveClippingMode = Exclude<ClippingMode, 'off'>

/** 共享剖切面；材质只引用，不在组件内重复创建。 */
export const CLIPPING_PLANES: Record<ActiveClippingMode, Plane> = {
  // Three.js 裁去平面法向一侧：法向取 -X，从而保留 +X（右半部分）。
  cross: new Plane(new Vector3(-1, 0, 0), 0),
  // 法向取 +Z，从而保留 -Z 部分。
  longitudinal: new Plane(new Vector3(0, 0, 1), 0),
}

const SWEEP_HALF_RANGE: Record<ActiveClippingMode, number> = {
  cross: 9,
  longitudinal: 16,
}

export function updateClippingPlane(mode: ActiveClippingMode, progress: number) {
  CLIPPING_PLANES[mode].constant = (progress - 0.5) * SWEEP_HALF_RANGE[mode] * 2
}

export function getClippingPlanes(mode: ClippingMode): Plane[] {
  return mode === 'off' ? [] : [CLIPPING_PLANES[mode]]
}
