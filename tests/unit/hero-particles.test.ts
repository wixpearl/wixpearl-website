import { describe, expect, it, vi } from 'vitest'

import { canUseHeroParticles } from '@/components/home/hero-particle-policy'
import { normalizePointer, resolveInteractionTarget } from '@/graphics/particlesGL/particles-webgl'

describe('hero particle runtime policy', () => {
  const capableProfile = {
    reducedMotion: false,
    saveData: false,
    webgl2: true,
    hardwareConcurrency: 8,
    deviceMemory: 8,
  }

  it('enables particles only for capable motion-enabled devices', () => {
    expect(canUseHeroParticles(capableProfile)).toBe(true)
    expect(canUseHeroParticles({ ...capableProfile, reducedMotion: true })).toBe(false)
    expect(canUseHeroParticles({ ...capableProfile, saveData: true })).toBe(false)
    expect(canUseHeroParticles({ ...capableProfile, webgl2: false })).toBe(false)
    expect(canUseHeroParticles({ ...capableProfile, hardwareConcurrency: 1 })).toBe(false)
    expect(canUseHeroParticles({ ...capableProfile, deviceMemory: 1 })).toBe(false)
  })
})

describe('hero particle interaction mapping', () => {
  it('normalizes the complete interaction area to WebGL coordinates', () => {
    const rect = { left: 100, right: 500, top: 50, bottom: 250, width: 400, height: 200 }

    expect(normalizePointer(100, 50, rect)).toEqual({ x: -1, y: 1, inside: true })
    expect(normalizePointer(300, 150, rect)).toEqual({ x: 0, y: 0, inside: true })
    expect(normalizePointer(500, 250, rect)).toEqual({ x: 1, y: -1, inside: true })
    expect(normalizePointer(99, 150, rect).inside).toBe(false)
  })

  it('prefers the target ancestor and otherwise retains the particle target', () => {
    const interactionElement = {} as Element
    const target = {
      closest: vi.fn(() => interactionElement),
    } as unknown as HTMLElement

    expect(resolveInteractionTarget(target, '[data-particle-host]')).toBe(interactionElement)
    expect(resolveInteractionTarget(target, null)).toBe(target)
  })
})
