import { particleFieldConfig } from './particle-config'

import type { ParticleBackend, ParticleQualityTier } from './types'

export interface DeviceProfile {
  coarsePointer: boolean
  hardwareConcurrency: number
  deviceMemory: number | undefined
  saveData: boolean
  reducedMotion: boolean
  hasWebGPU: boolean
  hasWebGL2: boolean
  viewportWidth: number
}

export function selectParticleBackend(profile: DeviceProfile): ParticleBackend {
  if (profile.reducedMotion || profile.saveData) return 'static'
  if (profile.hasWebGPU) return 'webgpu'
  if (profile.hasWebGL2) return 'webgl2'
  return 'static'
}

export function selectInitialQuality(profile: DeviceProfile): ParticleQualityTier {
  if (profile.coarsePointer) return profile.viewportWidth <= 768 ? 'mobile' : 'low'
  if ((profile.deviceMemory ?? 8) <= 4 || profile.hardwareConcurrency <= 4) return 'low'
  if ((profile.deviceMemory ?? 8) <= 8 || profile.hardwareConcurrency <= 8) return 'medium'
  return 'high'
}

export function nextLowerQuality(quality: ParticleQualityTier): ParticleQualityTier {
  if (quality === 'high') return 'medium'
  if (quality === 'medium') return 'low'
  return 'mobile'
}

export function countForBackend(backend: ParticleBackend, quality: ParticleQualityTier) {
  const tier = particleFieldConfig.quality[quality]
  if (backend === 'webgpu') return tier.webgpuCount
  if (backend === 'webgl2') return tier.webglCount
  return 0
}

export function shouldLowerQuality(
  quality: ParticleQualityTier,
  averageFrameMs: number,
  overBudgetFrames: number
) {
  return (
    quality !== 'mobile' &&
    averageFrameMs > particleFieldConfig.quality[quality].frameBudgetMs &&
    overBudgetFrames >= 90
  )
}
