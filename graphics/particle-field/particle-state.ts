import { particleFieldConfig } from './particle-config'

import type { ParticleFieldState } from './types'

export interface IdleAnchor {
  readonly x: number
  readonly y: number
  readonly z: number
  readonly cluster: number
  readonly seed: number
}

export function clampFrameDelta(deltaSeconds: number) {
  return Math.min(Math.max(deltaSeconds, 0), 0.05)
}

function seededUnit(index: number, salt: number) {
  let value = (Math.imul(index + 1, 1_664_525) + salt) >>> 0
  value ^= value >>> 16
  value = Math.imul(value, 2_246_822_519) >>> 0
  value = (value ^ (value >>> 13)) >>> 0
  return value / 4_294_967_296
}

export function sampleIdleAnchor(index: number): IdleAnchor {
  const cluster = index % particleFieldConfig.clusters.length
  const definition = particleFieldConfig.clusters[cluster]
  if (!definition) throw new Error('Missing particle cluster definition')

  const angleSeed = seededUnit(index, 101)
  const radiusSeed = seededUnit(index, 307)
  const spreadX = seededUnit(index, 911) * 2 - 1
  const spreadY = seededUnit(index, 1_541) * 2 - 1
  const angle = angleSeed * Math.PI * 2
  const radial = Math.sqrt(radiusSeed)
  const clusterX = definition.center[0] + Math.cos(angle) * definition.radius[0] * radial
  const clusterY = definition.center[1] + Math.sin(angle) * definition.radius[1] * radial

  return {
    x: clusterX * 0.44 + spreadX * 0.56,
    y: clusterY * 0.44 + spreadY * 0.56,
    z: (seededUnit(index, 2_053) - 0.5) * 0.12,
    cluster,
    seed: angleSeed,
  }
}

export function isOutsideOverscan(x: number, y: number, aspect: number) {
  const margin = particleFieldConfig.overscan
  return Math.abs(x) > aspect * (1 + margin) || Math.abs(y) > 1 + margin
}

export function getParticleFieldState(active: boolean, entropy: number): ParticleFieldState {
  if (active) return 'disturbed'
  return entropy > 0.025 ? 'settling' : 'idle'
}
