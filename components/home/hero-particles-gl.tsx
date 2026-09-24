'use client'

import { useEffect } from 'react'

import { canUseHeroParticles } from './hero-particle-policy'

import type { ParticlesGLController } from '@/graphics/particlesGL/particles-webgl'

interface NavigatorWithHints extends Navigator {
  readonly connection?: { readonly saveData?: boolean }
  readonly deviceMemory?: number
}

function readRuntimeProfile() {
  const runtimeNavigator = navigator as NavigatorWithHints
  const probe = document.createElement('canvas')

  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: runtimeNavigator.connection?.saveData === true,
    webgl2: probe.getContext('webgl2') !== null,
    hardwareConcurrency: runtimeNavigator.hardwareConcurrency || 1,
    deviceMemory: runtimeNavigator.deviceMemory ?? null,
  }
}

function resetHost(host: HTMLElement) {
  host.dataset.particlesReady = 'false'
  host.dataset.particlesMotion = 'static'
  host.dataset.particlesActive = 'false'
}

export function HeroParticlesGL() {
  useEffect(() => {
    const host = document.querySelector<HTMLElement>('[data-particle-host]')
    if (!host) return

    resetHost(host)
    if (!canUseHeroParticles(readRuntimeProfile())) return

    let disposed = false
    let controller: ParticlesGLController | null = null

    void import('@/graphics/particlesGL/particles-webgl')
      .then(({ default: particlesGL }) => {
        if (disposed) return

        controller = particlesGL({
          target: '[data-particles-hero-logo]',
          interactionTarget: '[data-particle-host]',
          character: '•',
          particleColor: 'sample',
          sampling: 6,
          particleSpacing: 0.0012,
          particleSize: 0.085,
          displaceRadius: 0.5,
          displaceStrength: 0.18,
          velocityInfluence: 0.1,
          returnSpeed: 0.08,
          tilt: true,
          tiltFactor: 0.3,
          tiltSpeed: 0.06,
          on: {
            init: () => {
              if (disposed) {
                controller?.cleanup()
                return
              }
              host.dataset.particlesReady = 'true'
              host.dataset.particlesMotion = 'animated'
            },
          },
        })
      })
      .catch((error: unknown) => {
        resetHost(host)
        if (process.env.NODE_ENV === 'development') {
          console.error('Hero particle effect failed to initialize.', error)
        }
      })

    return () => {
      disposed = true
      controller?.cleanup()
      resetHost(host)
    }
  }, [])

  return null
}
