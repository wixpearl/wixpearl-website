import { particleFieldConfig } from './particle-config'

import type { ParticleInput } from './types'

export function createParticleInput(): ParticleInput {
  return {
    active: false,
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    speed: 0,
    pulseX: 0,
    pulseY: 0,
    pulseAge: particleFieldConfig.pulseDuration,
    entropy: 0,
    scrollVelocity: 0,
  }
}

export function updatePointerInput(
  input: ParticleInput,
  x: number,
  y: number,
  deltaSeconds: number
) {
  const safeDelta = Math.max(deltaSeconds, 1 / 240)
  const velocityX = (x - input.x) / safeDelta
  const velocityY = (y - input.y) / safeDelta

  input.velocityX += (velocityX - input.velocityX) * 0.28
  input.velocityY += (velocityY - input.velocityY) * 0.28
  input.speed = Math.min(3.5, Math.hypot(input.velocityX, input.velocityY))
  input.entropy = Math.min(
    1,
    input.entropy + particleFieldConfig.entropyGain * (0.18 + input.speed / 3.5)
  )
  input.x = x
  input.y = y
  input.active = true
}

export function decayPointerInput(input: ParticleInput, deltaSeconds: number) {
  const decay = Math.exp(-deltaSeconds * 7)
  input.velocityX *= decay
  input.velocityY *= decay
  input.speed *= decay
  input.entropy *= Math.exp(-deltaSeconds * particleFieldConfig.entropyDecayRate)
  if (input.entropy < 0.01) input.entropy = 0
  input.scrollVelocity *= Math.exp(-deltaSeconds * 5)
  input.pulseAge = Math.min(particleFieldConfig.pulseDuration, input.pulseAge + deltaSeconds)
}

export function triggerParticlePulse(input: ParticleInput, x: number, y: number) {
  input.pulseX = x
  input.pulseY = y
  input.pulseAge = 0
  input.entropy = Math.max(input.entropy, 0.92)
}

export function pulseStrength(age: number, duration = particleFieldConfig.pulseDuration) {
  if (age < 0 || age >= duration) return 0
  const progress = age / duration
  const envelope = Math.sin(progress * Math.PI)
  return envelope * (progress < 0.26 ? -0.42 : 0.68)
}
