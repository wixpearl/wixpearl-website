'use client'

import { useEffect, useRef } from 'react'

import {
  createParticleState,
  nextLowerQuality,
  setParticleCount,
  stepParticles,
} from '@/components/shared/particle-engine'

import type { ParticlePointer, ParticleQuality, ParticleState } from './particle-engine'
import type { CSSProperties } from 'react'

const staticParticles = [
  ['8%', '18%', '0.18rem', '7s', '-1s'],
  ['20%', '72%', '0.28rem', '9s', '-3s'],
  ['33%', '34%', '0.14rem', '8s', '-4s'],
  ['45%', '84%', '0.22rem', '10s', '-2s'],
  ['56%', '12%', '0.16rem', '7.5s', '-5s'],
  ['68%', '65%', '0.3rem', '9.5s', '-6s'],
  ['77%', '27%', '0.2rem', '8.5s', '-3.5s'],
  ['88%', '78%', '0.14rem', '11s', '-7s'],
  ['14%', '46%', '0.12rem', '8s', '-2.5s'],
  ['40%', '16%', '0.2rem', '10s', '-5.5s'],
  ['73%', '88%', '0.14rem', '9s', '-4.5s'],
  ['94%', '40%', '0.22rem', '8s', '-1.5s'],
] as const

const qualityCounts: Record<ParticleQuality, number> = {
  high: 48,
  medium: 32,
  low: 20,
}

interface NetworkInformationLike {
  saveData?: boolean
}

function resolveCssColor(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
  return value || fallback
}

function createParticleSprite(color: string) {
  const sprite = document.createElement('canvas')
  const size = 48
  sprite.width = size
  sprite.height = size

  const context = sprite.getContext('2d')
  if (!context) return sprite

  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.12, color)
  gradient.addColorStop(0.42, 'rgb(255 255 255 / 0.16)')
  gradient.addColorStop(1, 'transparent')
  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  return sprite
}

function clearActiveTarget(target: HTMLElement | null) {
  if (!target) return
  delete target.dataset.particleActive
  target.style.removeProperty('--particle-local-x')
  target.style.removeProperty('--particle-local-y')
  target.style.removeProperty('--particle-strength')
}

export function ParticleField({ className = '' }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!root || !canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
    const isStatic = reducedMotion.matches || connection?.saveData === true
    const pointer: ParticlePointer = { active: false, x: -1_000, y: -1_000 }
    const smoothedPointer = { x: -1_000, y: -1_000 }
    const trailX = new Float32Array(5)
    const trailY = new Float32Array(5)
    let activeTarget: HTMLElement | null = null
    let pointerDirty = false
    let animationFrame = 0
    let state: ParticleState | null = null
    let width = window.innerWidth
    let height = window.innerHeight
    let quality: ParticleQuality = coarsePointer.matches ? 'medium' : 'high'
    let pixelRatio = 1
    let lastTimestamp = 0
    let lastRenderedTimestamp = 0
    let averageFrameCost = 0
    let overBudgetFrames = 0
    let primarySprite = createParticleSprite(resolveCssColor('--primary', '#805ad5'))
    let cyanSprite = createParticleSprite(resolveCssColor('--cyan', '#58c8dc'))

    root.dataset.motion = isStatic ? 'static' : 'animated'
    root.dataset.quality = quality

    const particleCount = () =>
      coarsePointer.matches ? Math.min(24, qualityCounts[quality]) : qualityCounts[quality]

    const updateCanvasSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      pixelRatio =
        quality === 'low'
          ? 1
          : Math.min(
              window.devicePixelRatio || 1,
              coarsePointer.matches ? 1 : quality === 'medium' ? 1.25 : 1.5
            )
      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      canvas.style.width = `${String(width)}px`
      canvas.style.height = `${String(height)}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      if (!state) state = createParticleState(48, width, height)
      setParticleCount(state, particleCount())
    }

    const refreshPalette = () => {
      primarySprite = createParticleSprite(resolveCssColor('--primary', '#805ad5'))
      cyanSprite = createParticleSprite(resolveCssColor('--cyan', '#58c8dc'))
    }

    const updateActiveTarget = () => {
      pointerDirty = false

      if (!pointer.active || coarsePointer.matches) {
        clearActiveTarget(activeTarget)
        activeTarget = null
        return
      }

      const element = document.elementFromPoint(pointer.x, pointer.y)
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
      const localX = pointer.x - bounds.left
      const localY = pointer.y - bounds.top
      const normalizedX = Math.abs(localX - bounds.width / 2) / Math.max(bounds.width / 2, 1)
      const normalizedY = Math.abs(localY - bounds.height / 2) / Math.max(bounds.height / 2, 1)
      const strength = Math.max(0.42, 1 - Math.hypot(normalizedX, normalizedY) * 0.28)

      activeTarget.dataset.particleActive = 'true'
      activeTarget.style.setProperty('--particle-local-x', `${localX.toFixed(1)}px`)
      activeTarget.style.setProperty('--particle-local-y', `${localY.toFixed(1)}px`)
      activeTarget.style.setProperty('--particle-strength', strength.toFixed(2))
    }

    const draw = () => {
      if (!state) return

      context.clearRect(0, 0, width, height)
      context.save()
      context.globalCompositeOperation = 'lighter'

      for (let index = 0; index < state.count; index += 1) {
        const radius = state.radius[index] ?? 1
        const size = 16 + radius * 8
        context.globalAlpha = 0.28 + radius * 0.13
        context.drawImage(
          (state.tone[index] ?? 0) > 0.72 ? cyanSprite : primarySprite,
          (state.x[index] ?? 0) - size / 2,
          (state.y[index] ?? 0) - size / 2,
          size,
          size
        )
      }

      if (pointer.active && !coarsePointer.matches) {
        context.globalAlpha = 0.13
        for (let index = trailX.length - 1; index >= 0; index -= 1) {
          const size = 34 - index * 4
          context.globalAlpha *= 0.8
          context.drawImage(
            primarySprite,
            (trailX[index] ?? 0) - size / 2,
            (trailY[index] ?? 0) - size / 2,
            size,
            size
          )
        }
      }

      context.restore()
      root.dataset.ready = 'true'
    }

    const lowerQuality = () => {
      const nextQuality = nextLowerQuality(quality)
      if (nextQuality === quality || !state) return
      quality = nextQuality
      root.dataset.quality = quality
      setParticleCount(state, particleCount())
      updateCanvasSize()
      averageFrameCost = 0
      overBudgetFrames = 0
    }

    const render = (timestamp: number) => {
      animationFrame = window.requestAnimationFrame(render)
      if (document.hidden || isStatic || !state) return

      const frameInterval = coarsePointer.matches ? 1_000 / 30 : 1_000 / 60
      if (timestamp - lastRenderedTimestamp < frameInterval - 1) return

      const start = performance.now()
      const delta = lastTimestamp === 0 ? 0 : (timestamp - lastTimestamp) / 1_000
      lastTimestamp = timestamp
      lastRenderedTimestamp = timestamp

      smoothedPointer.x += (pointer.x - smoothedPointer.x) * 0.12
      smoothedPointer.y += (pointer.y - smoothedPointer.y) * 0.12
      for (let index = trailX.length - 1; index > 0; index -= 1) {
        trailX[index] = trailX[index - 1] ?? 0
        trailY[index] = trailY[index - 1] ?? 0
      }
      trailX[0] = smoothedPointer.x
      trailY[0] = smoothedPointer.y

      stepParticles(state, delta, width, height, {
        active: pointer.active,
        x: smoothedPointer.x,
        y: smoothedPointer.y,
      })
      if (pointerDirty) updateActiveTarget()
      draw()

      const frameCost = performance.now() - start
      averageFrameCost =
        averageFrameCost === 0 ? frameCost : averageFrameCost * 0.94 + frameCost * 0.06
      overBudgetFrames =
        averageFrameCost > 6 ? overBudgetFrames + 1 : Math.max(0, overBudgetFrames - 2)
      if (overBudgetFrames >= 90 && quality !== 'low') lowerQuality()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || isStatic) return
      pointer.active = true
      pointer.x = event.clientX
      pointer.y = event.clientY
      if (smoothedPointer.x < -500) {
        smoothedPointer.x = event.clientX
        smoothedPointer.y = event.clientY
        trailX.fill(event.clientX)
        trailY.fill(event.clientY)
      }
      pointerDirty = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
      pointerDirty = true
      updateActiveTarget()
    }

    const handleVisibilityChange = () => {
      lastTimestamp = 0
      lastRenderedTimestamp = 0
      if (!document.hidden && !isStatic) draw()
    }

    updateCanvasSize()
    draw()

    if (!isStatic) animationFrame = window.requestAnimationFrame(render)

    const themeObserver = new MutationObserver(() => {
      refreshPalette()
      draw()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    window.addEventListener('resize', updateCanvasSize, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', updateCanvasSize)
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      themeObserver.disconnect()
      clearActiveTarget(activeTarget)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      data-slot="particle-field"
      data-motion="static"
      data-quality="high"
      aria-hidden="true"
      className={`particle-field pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      <div className="particle-static-plate absolute inset-0">
        {staticParticles.map(([left, top, size, duration, delay], index) => (
          <span
            key={`${left}-${top}`}
            className={`particle-static-dot bg-primary/45 absolute rounded-full shadow-[0_0_14px_color-mix(in_oklch,var(--primary)_48%,transparent)] ${index > 5 ? 'hidden sm:block' : ''}`}
            style={
              {
                left,
                top,
                width: size,
                height: size,
                '--duration': duration,
                '--delay': delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  )
}
