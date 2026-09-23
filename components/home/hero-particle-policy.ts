export interface HeroParticleProfile {
  reducedMotion: boolean
  saveData: boolean
  webgl2: boolean
  hardwareConcurrency: number
  deviceMemory: number | null
}

export function canUseHeroParticles(profile: HeroParticleProfile): boolean {
  if (profile.reducedMotion || profile.saveData || !profile.webgl2) return false
  if (profile.hardwareConcurrency < 2) return false
  return profile.deviceMemory === null || profile.deviceMemory > 1
}
