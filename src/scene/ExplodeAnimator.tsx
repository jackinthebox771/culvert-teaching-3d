import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils } from 'three'
import { useCulvertStore } from '../store/useCulvertStore'

const AUTO_SPEED = 0.32
const END_HOLD_SECONDS = 0.7

export function ExplodeAnimator() {
  const direction = useRef<1 | -1>(1)
  const holdRemaining = useRef(0)
  const wasAutoPlaying = useRef(false)

  useFrame((_, delta) => {
    const state = useCulvertStore.getState()

    if (state.autoDemoPlaying) {
      if (!wasAutoPlaying.current) {
        direction.current = state.explodeProgress >= 0.999 ? -1 : 1
        holdRemaining.current = 0
      }
      wasAutoPlaying.current = true

      if (holdRemaining.current > 0) {
        holdRemaining.current = Math.max(0, holdRemaining.current - delta)
        return
      }

      const next = Math.min(1, Math.max(0, state.explodeProgress + delta * AUTO_SPEED * direction.current))
      state.setExplodeProgressFromAnimation(next)
      if (next === 0 || next === 1) {
        direction.current = next === 1 ? -1 : 1
        holdRemaining.current = END_HOLD_SECONDS
      }
      return
    }

    wasAutoPlaying.current = false
    if (!state.explodeAnimating) return

    const next = MathUtils.damp(state.explodeProgress, state.explodeTarget, 4.4, delta)
    if (Math.abs(next - state.explodeTarget) < 0.001) {
      state.setExplodeProgressFromAnimation(state.explodeTarget)
      state.setExplodeAnimating(false)
    } else {
      state.setExplodeProgressFromAnimation(next)
    }
  })

  return null
}
