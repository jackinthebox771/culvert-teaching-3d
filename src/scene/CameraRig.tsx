import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { CAMERA_PRESETS } from '../config/cameraPresets'
import { COMPONENT_FOCUS_CONFIG } from '../config/componentFocusConfig'
import { EXPLODE_CAMERA_RETREAT, getExplodeOffset } from '../config/explodeConfig'
import { useCulvertStore } from '../store/useCulvertStore'
import type { CulvertComponentId } from '../types/culvert'

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const controls = useRef<OrbitControlsImpl>(null)
  const presetId = useCulvertStore((state) => state.cameraPreset)
  const focusRequest = useCulvertStore((state) => state.cameraFocusRequest)
  const setCameraTelemetry = useCulvertStore((state) => state.setCameraTelemetry)
  const destination = useRef(new Vector3(...CAMERA_PRESETS.isometric.position))
  const target = useRef(new Vector3(...CAMERA_PRESETS.isometric.target))
  const transitioning = useRef(true)
  const frameCount = useRef(0)
  const lastExplodeProgress = useRef(useCulvertStore.getState().explodeProgress)
  const focusedComponentId = useRef<CulvertComponentId | null>(null)
  const lastFocusOffset = useRef(new Vector3())

  useEffect(() => {
    if (!presetId) return
    const preset = CAMERA_PRESETS[presetId]
    const progress = useCulvertStore.getState().explodeProgress
    target.current.set(...preset.target)
    destination.current.set(...preset.position)
    camera.up.set(...(preset.up ?? [0, 1, 0]))
    const radial = destination.current.clone().sub(target.current)
    radial.setLength(radial.length() + progress * EXPLODE_CAMERA_RETREAT)
    destination.current.copy(target.current).add(radial)
    lastExplodeProgress.current = progress
    focusedComponentId.current = null
    lastFocusOffset.current.set(0, 0, 0)
    transitioning.current = true
  }, [camera, presetId])

  useEffect(() => {
    if (!focusRequest) return
    const focus = COMPONENT_FOCUS_CONFIG[focusRequest.componentId]
    const offset = getExplodeOffset(focusRequest.componentId, useCulvertStore.getState().explodeProgress)
    destination.current.set(
      focus.position[0] + offset[0],
      focus.position[1] + offset[1],
      focus.position[2] + offset[2],
    )
    target.current.set(
      focus.target[0] + offset[0],
      focus.target[1] + offset[1],
      focus.target[2] + offset[2],
    )
    lastExplodeProgress.current = useCulvertStore.getState().explodeProgress
    focusedComponentId.current = focusRequest.componentId
    lastFocusOffset.current.set(...offset)
    transitioning.current = true
  }, [focusRequest])

  useFrame((_, delta) => {
    const explodeProgress = useCulvertStore.getState().explodeProgress
    if (controls.current && focusedComponentId.current) {
      const nextOffsetTuple = getExplodeOffset(focusedComponentId.current, explodeProgress)
      const nextOffset = new Vector3(...nextOffsetTuple)
      const focusDelta = nextOffset.sub(lastFocusOffset.current)
      if (focusDelta.lengthSq() > 0.00000001) {
        camera.position.add(focusDelta)
        controls.current.target.add(focusDelta)
        destination.current.add(focusDelta)
        target.current.add(focusDelta)
        lastFocusOffset.current.add(focusDelta)
      }
    }
    const retreatDelta = focusedComponentId.current
      ? 0
      : (explodeProgress - lastExplodeProgress.current) * EXPLODE_CAMERA_RETREAT
    if (controls.current && Math.abs(retreatDelta) > 0.00001) {
      const currentRadial = camera.position.clone().sub(controls.current.target)
      currentRadial.setLength(Math.max(10, currentRadial.length() + retreatDelta))
      camera.position.copy(controls.current.target).add(currentRadial)

      const destinationRadial = destination.current.clone().sub(target.current)
      destinationRadial.setLength(Math.max(10, destinationRadial.length() + retreatDelta))
      destination.current.copy(target.current).add(destinationRadial)
    }
    lastExplodeProgress.current = explodeProgress

    if (transitioning.current && controls.current) {
      const alpha = 1 - Math.exp(-delta * 4.2)
      camera.position.lerp(destination.current, alpha)
      controls.current.target.lerp(target.current, alpha)
      controls.current.update()
      if (camera.position.distanceTo(destination.current) < 0.015) transitioning.current = false
    }
    frameCount.current += 1
    if (frameCount.current % 12 === 0) {
      const { x, y, z } = camera.position
      setCameraTelemetry(`x ${x.toFixed(2)} · y ${y.toFixed(2)} · z ${z.toFixed(2)} · fov ${(camera as PerspectiveCamera).fov ?? '—'}°`)
    }
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={10}
      maxDistance={120}
      maxPolarAngle={Math.PI - 0.025}
    />
  )
}
