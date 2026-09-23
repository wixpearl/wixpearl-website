import type { ParticleFieldConfig } from './types'

export const particleFieldConfig: ParticleFieldConfig = {
  colors: {
    navy: '#0B1F33',
    blue: '#168CFF',
    aqua: '#23D5C3',
    pearl: '#F7F8F5',
    slate: '#66788A',
  },
  clusters: [
    {
      center: [-0.58, 0.48, -0.18],
      radius: [0.78, 0.64, 0.5],
      drift: [0.012, 0.008, 0.004],
      phase: 0.4,
      colorMix: 0.08,
    },
    {
      center: [0.55, 0.5, -0.08],
      radius: [0.74, 0.7, 0.52],
      drift: [-0.01, 0.009, 0.004],
      phase: 2.1,
      colorMix: 0.48,
    },
    {
      center: [-0.5, -0.48, 0.1],
      radius: [0.8, 0.68, 0.46],
      drift: [0.009, -0.008, 0.003],
      phase: 3.8,
      colorMix: 0.76,
    },
    {
      center: [0.58, -0.46, 0.04],
      radius: [0.82, 0.62, 0.5],
      drift: [-0.011, -0.007, 0.004],
      phase: 5.3,
      colorMix: 0.28,
    },
  ],
  quality: {
    high: { webgpuCount: 9_500, webglCount: 5_200, dpr: 1.5, frameBudgetMs: 22 },
    medium: { webgpuCount: 3_000, webglCount: 3_500, dpr: 1.25, frameBudgetMs: 28 },
    low: { webgpuCount: 12_000, webglCount: 2_500, dpr: 1, frameBudgetMs: 38 },
    mobile: { webgpuCount: 6_000, webglCount: 2_500, dpr: 1, frameBudgetMs: 38 },
  },
  pointerRadius: 1.35,
  pointerForce: 1.2,
  pulseDuration: 1.15,
  idleDrift: 0.008,
  anchorReturn: 0.34,
  entropyGain: 0.72,
  entropyDecayRate: 1.05,
  wakeStrength: 0.78,
  overscan: 0.18,
} as const

export function assertParticleConfig(config: ParticleFieldConfig) {
  if (config.clusters.length !== 4) throw new Error('Particle field requires four clusters')

  for (const tier of Object.values(config.quality)) {
    if (tier.webgpuCount <= 0 || tier.webglCount <= 0) {
      throw new Error('Particle counts must be positive')
    }
    if (tier.dpr < 1 || tier.dpr > 1.5)
      throw new Error('Particle DPR must remain between 1 and 1.5')
  }

  if (config.entropyDecayRate <= 0 || config.overscan < 0.1) {
    throw new Error('Particle entropy and overscan values must be positive and safe')
  }
}
