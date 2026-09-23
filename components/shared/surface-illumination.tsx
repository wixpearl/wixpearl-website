'use client'

import { useEffect } from 'react'

function clearActiveTarget(target: HTMLElement | null) {
  if (!target) return
  delete target.dataset.particleActive
  target.style.removeProperty('--particle-local-x')
  target.style.removeProperty('--particle-local-y')
  target.style.removeProperty('--particle-strength')
}

export function SurfaceIllumination() {
  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    if (coarsePointer.matches) return

    document.documentElement.dataset.surfaceIllumination = 'ready'

    let activeTarget: HTMLElement | null = null
    const handlePointerMove = (event: PointerEvent) => {
      const element = document.elementFromPoint(event.clientX, event.clientY)
      const nextTarget =
        element?.closest<HTMLElement>(
          '[data-particle-surface], [data-particle-text], [data-particle-cta]'
        ) ?? null

      if (nextTarget !== activeTarget) {
        clearActiveTarget(activeTarget)
        activeTarget = nextTarget
      }
      if (!activeTarget) return

      const bounds = activeTarget.getBoundingClientRect()
      const localX = event.clientX - bounds.left
      const localY = event.clientY - bounds.top
      const normalizedX = Math.abs(localX - bounds.width / 2) / Math.max(bounds.width / 2, 1)
      const normalizedY = Math.abs(localY - bounds.height / 2) / Math.max(bounds.height / 2, 1)
      const strength = Math.max(0.42, 1 - Math.hypot(normalizedX, normalizedY) * 0.28)
      activeTarget.dataset.particleActive = 'true'
      activeTarget.style.setProperty('--particle-local-x', `${localX.toFixed(1)}px`)
      activeTarget.style.setProperty('--particle-local-y', `${localY.toFixed(1)}px`)
      activeTarget.style.setProperty('--particle-strength', strength.toFixed(2))
    }
    const handlePointerLeave = () => {
      clearActiveTarget(activeTarget)
      activeTarget = null
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      clearActiveTarget(activeTarget)
      delete document.documentElement.dataset.surfaceIllumination
    }
  }, [])

  return null
}
