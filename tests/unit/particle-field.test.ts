import { describe, expect, it } from 'vitest'

import {
  assertParticleConfig,
  particleFieldConfig,
} from '@/graphics/particle-field/particle-config'
import {
  createParticleInput,
  decayPointerInput,
  pulseStrength,
  triggerParticlePulse,
  updatePointerInput,
} from '@/graphics/particle-field/particle-interaction'
import {
  countForBackend,
  nextLowerQuality,
  selectInitialQuality,
  selectParticleBackend,
  shouldLowerQuality,
} from '@/graphics/particle-field/particle-quality'
import {
  clampFrameDelta,
  getParticleFieldState,
  isOutsideOverscan,
  sampleIdleAnchor,
} from '@/graphics/particle-field/particle-state'

const capableDesktop = {
  coarsePointer: false,
  hardwareConcurrency: 16,
  deviceMemory: 16,
  saveData: false,
  reducedMotion: false,
  hasWebGPU: true,
  hasWebGL2: true,
  viewportWidth: 1440,
}

describe('particle field policy', () => {
  it('selects progressive backends and quality tiers', () => {
    expect(selectParticleBackend(capableDesktop)).toBe('webgpu')
    expect(selectParticleBackend({ ...capableDesktop, hasWebGPU: false })).toBe('webgl2')
    expect(selectParticleBackend({ ...capableDesktop, reducedMotion: true })).toBe('static')
    expect(selectInitialQuality(capableDesktop)).toBe('high')
    expect(
      selectInitialQuality({ ...capableDesktop, coarsePointer: true, viewportWidth: 1024 })
    ).toBe('low')
    expect(countForBackend('webgpu', 'high')).toBe(9_500)
    expect(countForBackend('webgl2', 'low')).toBe(2_500)
  })

  it('only lowers quality after sustained pressure', () => {
    expect(nextLowerQuality('high')).toBe('medium')
    expect(nextLowerQuality('medium')).toBe('low')
    expect(nextLowerQuality('low')).toBe('mobile')
    expect(nextLowerQuality('mobile')).toBe('mobile')
    expect(
      selectInitialQuality({ ...capableDesktop, coarsePointer: true, viewportWidth: 390 })
    ).toBe('mobile')
    expect(countForBackend('webgpu', 'mobile')).toBe(6_000)
    expect(shouldLowerQuality('high', 23, 89)).toBe(false)
    expect(shouldLowerQuality('high', 23, 90)).toBe(true)
  })

  it('keeps the central configuration within its safety bounds', () => {
    expect(() => {
      assertParticleConfig(particleFieldConfig)
    }).not.toThrow()
    expect(particleFieldConfig.clusters).toHaveLength(4)
    expect(particleFieldConfig.quality.high.dpr).toBeLessThanOrEqual(1.5)
  })
})

describe('particle interaction and cluster motion', () => {
  it('injects entropy and settles back to idle in about four seconds', () => {
    const input = createParticleInput()
    updatePointerInput(input, 0.4, -0.2, 1 / 60)
    expect(input.active).toBe(true)
    expect(input.speed).toBeGreaterThan(0)
    expect(input.entropy).toBeGreaterThan(0)
    expect(getParticleFieldState(input.active, input.entropy)).toBe('disturbed')
    input.active = false
    const before = input.entropy
    decayPointerInput(input, 1)
    expect(input.entropy).toBeLessThan(before)
    expect(getParticleFieldState(false, input.entropy)).toBe('settling')
    for (let frame = 0; frame < 180; frame += 1) decayPointerInput(input, 1 / 60)
    expect(getParticleFieldState(false, input.entropy)).toBe('idle')
  })

  it('produces a bounded implosion-to-release pulse', () => {
    const input = createParticleInput()
    triggerParticlePulse(input, 1, -1)
    expect(input.pulseX).toBe(1)
    expect(input.entropy).toBeGreaterThanOrEqual(0.9)
    expect(pulseStrength(0.1)).toBeLessThan(0)
    expect(pulseStrength(0.7)).toBeGreaterThan(0)
    expect(pulseStrength(particleFieldConfig.pulseDuration)).toBe(0)
  })

  it('creates deterministic anchors across the full screen without a visible boundary', () => {
    expect(clampFrameDelta(-1)).toBe(0)
    expect(clampFrameDelta(3)).toBe(0.05)
    const anchors = Array.from({ length: 256 }, (_, index) => sampleIdleAnchor(index))
    expect(sampleIdleAnchor(42)).toEqual(sampleIdleAnchor(42))
    expect(Math.min(...anchors.map((anchor) => anchor.x))).toBeLessThan(-0.7)
    expect(Math.max(...anchors.map((anchor) => anchor.x))).toBeGreaterThan(0.7)
    expect(Math.min(...anchors.map((anchor) => anchor.y))).toBeLessThan(-0.7)
    expect(Math.max(...anchors.map((anchor) => anchor.y))).toBeGreaterThan(0.7)
    expect(isOutsideOverscan(1, 0, 1)).toBe(false)
    expect(isOutsideOverscan(1.3, 0, 1)).toBe(true)
  })
})
