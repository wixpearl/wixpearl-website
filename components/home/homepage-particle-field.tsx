'use client'

import { useEffect, useRef } from 'react'

import type { ParticleFieldController } from '@/graphics/particle-field-in-house/types'

const fallbackNodes = [
  ['5%', '12%', 'h-40 w-64 -rotate-12', 'bg-[#168cff]/14'],
  ['66%', '8%', 'h-44 w-60 rotate-10', 'bg-[#23d5c3]/12'],
  ['14%', '62%', 'h-36 w-72 rotate-6', 'bg-[#23d5c3]/10'],
  ['70%', '66%', 'h-40 w-68 -rotate-6', 'bg-[#168cff]/12'],
] as const

export function HomepageParticleField() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const host = root?.closest<HTMLElement>('[data-particle-host]')
    if (!root || !canvas || !host) return

    const lifecycle = { disposed: false }
    let controller: ParticleFieldController | null = null
    let timeout = 0
    let idleHandle = 0

    const start = () => {
      void import('@/graphics/particle-field-in-house/particle-field').then(
        async ({ createParticleField }) => {
          if (lifecycle.disposed) return
          const nextController = await createParticleField(root, canvas, host)
          if (!root.isConnected) nextController.dispose()
          else controller = nextController
        }
      )
    }

    const requestIdle = Reflect.get(window, 'requestIdleCallback') as
      ((callback: () => void, options?: { timeout: number }) => number) | undefined
    const cancelIdle = Reflect.get(window, 'cancelIdleCallback') as
      ((handle: number) => void) | undefined
    if (requestIdle) idleHandle = requestIdle(start, { timeout: 900 })
    else timeout = window.setTimeout(start, 120)

    return () => {
      lifecycle.disposed = true
      window.clearTimeout(timeout)
      if (idleHandle) cancelIdle?.(idleHandle)
      controller?.dispose()
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <div
        ref={rootRef}
        data-slot="homepage-particle-field"
        data-backend="static"
        data-quality="low"
        data-particle-count="0"
        data-motion="static"
        data-ready="false"
        data-field-state="idle"
        aria-hidden="true"
        className="homepage-particle-field pointer-events-none sticky top-0 h-dvh w-full overflow-hidden"
      >
        <div className="homepage-particle-fallback pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgb(22_140_255/0.22)_0_0.8px,transparent_1.2px)] bg-size-[38px_38px] opacity-35" />
          {fallbackNodes.map(([left, top, size, color]) => (
            <span
              key={`${left}-${top}`}
              className={`absolute rounded-[48%] blur-3xl ${size} ${color}`}
              style={{ left, top }}
            />
          ))}
        </div>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
        />
      </div>
    </div>
  )
}
