import { describe, expect, it } from 'vitest'

import {
  clampFrameDelta,
  createParticleState,
  nextLowerQuality,
  setParticleCount,
  stepParticles,
} from '@/components/shared/particle-engine'

describe('particle engine', () => {
  it('creates deterministic particle data', () => {
    const first = createParticleState(4, 1_200, 800, 42)
    const second = createParticleState(4, 1_200, 800, 42)

    expect(Array.from(first.x)).toEqual(Array.from(second.x))
    expect(Array.from(first.y)).toEqual(Array.from(second.y))
    expect(Array.from(first.velocityX)).toEqual(Array.from(second.velocityX))
  })

  it('clamps frame deltas after an interruption', () => {
    expect(clampFrameDelta(-1)).toBe(0)
    expect(clampFrameDelta(0.016)).toBe(0.016)
    expect(clampFrameDelta(2)).toBe(0.05)
  })

  it('wraps particles without allocating a new state', () => {
    const state = createParticleState(1, 100, 80, 7)
    state.x[0] = 140
    state.y[0] = 120
    state.velocityX[0] = 0
    state.velocityY[0] = 0

    stepParticles(state, 0.016, 100, 80, { active: false, x: 0, y: 0 })

    expect(state.x[0]).toBe(-28)
    expect(state.y[0]).toBe(-28)
  })

  it('applies a bounded pointer influence', () => {
    const state = createParticleState(1, 400, 300, 9)
    state.x[0] = 100
    state.y[0] = 100
    state.velocityX[0] = 0
    state.velocityY[0] = 0

    stepParticles(state, 0.05, 400, 300, { active: true, x: 180, y: 100 })

    expect(state.velocityX[0]).toBeGreaterThan(0)
    expect(Math.hypot(state.velocityX[0], state.velocityY[0])).toBeLessThanOrEqual(18)
  })

  it('only reduces quality and clamps active particle counts', () => {
    expect(nextLowerQuality('high')).toBe('medium')
    expect(nextLowerQuality('medium')).toBe('low')
    expect(nextLowerQuality('low')).toBe('low')

    const state = createParticleState(48, 400, 300)
    setParticleCount(state, 20)
    expect(state.count).toBe(20)
    setParticleCount(state, 100)
    expect(state.count).toBe(48)
  })
})
