export type ParticleQualityTier = 'high' | 'medium' | 'low' | 'mobile'

export type ParticleBackend = 'webgpu' | 'webgl2' | 'static'

export type ParticleFieldState = 'idle' | 'disturbed' | 'settling'

export interface ClusterDefinition {
  readonly center: readonly [number, number, number]
  readonly radius: readonly [number, number, number]
  readonly drift: readonly [number, number, number]
  readonly phase: number
  readonly colorMix: number
}

export interface ParticleQualityConfig {
  readonly webgpuCount: number
  readonly webglCount: number
  readonly dpr: number
  readonly frameBudgetMs: number
}

export interface ParticleFieldConfig {
  readonly colors: {
    readonly navy: string
    readonly blue: string
    readonly aqua: string
    readonly pearl: string
    readonly slate: string
  }
  readonly clusters: readonly ClusterDefinition[]
  readonly quality: Readonly<Record<ParticleQualityTier, ParticleQualityConfig>>
  readonly pointerRadius: number
  readonly pointerForce: number
  readonly pulseDuration: number
  readonly idleDrift: number
  readonly anchorReturn: number
  readonly entropyGain: number
  readonly entropyDecayRate: number
  readonly wakeStrength: number
  readonly overscan: number
}

export interface ParticleRuntimeStats {
  backend: ParticleBackend
  quality: ParticleQualityTier
  particleCount: number
  averageFrameMs: number
  dpr: number
}

export interface ParticleInput {
  active: boolean
  x: number
  y: number
  velocityX: number
  velocityY: number
  speed: number
  pulseX: number
  pulseY: number
  pulseAge: number
  entropy: number
  scrollVelocity: number
}

export interface ParticleRenderer {
  readonly backend: Exclude<ParticleBackend, 'static'>
  readonly capacity: number
  resize(width: number, height: number, dpr: number): void
  render(deltaSeconds: number, elapsedSeconds: number, input: ParticleInput): void
  setActiveCount(count: number): void
  dispose(): void
}

export interface ParticleFieldController {
  dispose(): void
}
