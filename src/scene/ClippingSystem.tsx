import { useEffect, useRef } from 'react'
import { Mesh, PlaneHelper } from 'three'
import { CLIPPING_PLANES, updateClippingPlane } from '../config/clippingConfig'
import { useCulvertStore } from '../store/useCulvertStore'

export function ClippingSystem() {
  const mode = useCulvertStore((state) => state.clippingMode)
  const progress = useCulvertStore((state) => state.clippingProgress)
  const debugEnabled = useCulvertStore((state) => state.debugEnabled)
  const helperRef = useRef<PlaneHelper>(null)

  useEffect(() => {
    if (mode !== 'off') updateClippingPlane(mode, progress)
  }, [mode, progress])

  useEffect(() => {
    helperRef.current?.traverse((object) => {
      if (!(object instanceof Mesh)) return
      object.material.transparent = true
      object.material.opacity = 0.045
      object.material.depthWrite = false
    })
  }, [mode])

  if (mode === 'off' || !debugEnabled) return null
  return <planeHelper ref={helperRef} args={[CLIPPING_PLANES[mode], 20, 0xffb13b]} />
}
