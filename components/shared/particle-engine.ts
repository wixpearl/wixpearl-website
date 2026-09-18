export type ParticleQuality = 'high' | 'medium' | 'low'

export interface ParticlePointer {
  active: boolean
  x: number
  y: number
}

export interface ParticleState {
  capacity: number
  count: number
  x: Float32Array
  y: Float32Array
  velocityX: Float32Array
  velocityY: Float32Array
  radius: Float32Array
  tone: Float32Array
}

const UINT32_RANGE = 4_294_967_296

function seededRandom(seed: number) {
  let value = seed >>> 0

  return () => {
    value = (Math.imul(value, 1_664_525) + 1_013_904_223) >>> 0
    return value / UINT32_RANGE
  }
}

export function clampFrameDelta(deltaSeconds: number) {
  return Math.min(Math.max(deltaSeconds, 0), 0.05)
}

export function createParticleState(
  capacity: number,
  width: number,
  height: number,
  seed = 0x57_50_4c
): ParticleState {
  const random = seededRandom(seed)
  const state: ParticleState = {
    capacity,
    count: capacity,
    x: new Float32Array(capacity),
    y: new Float32Array(capacity),
    velocityX: new Float32Array(capacity),
    velocityY: new Float32Array(capacity),
    radius: new Float32Array(capacity),
    tone: new Float32Array(capacity),
  }

  for (let index = 0; index < capacity; index += 1) {
    const angle = random() * Math.PI * 2
    const speed = 3 + random() * 8
    state.x[index] = random() * width
    state.y[index] = random() * height
    state.velocityX[index] = Math.cos(angle) * speed
    state.velocityY[index] = Math.sin(angle) * speed
    state.radius[index] = 0.8 + random() * 1.35
    state.tone[index] = random()
  }

  return state
}

export function setParticleCount(state: ParticleState, count: number) {
  state.count = Math.min(Math.max(Math.floor(count), 0), state.capacity)
}

export function nextLowerQuality(quality: ParticleQuality): ParticleQuality {
  if (quality === 'high') return 'medium'
  return 'low'
}

export function stepParticles(
  state: ParticleState,
  deltaSeconds: number,
  width: number,
  height: number,
  pointer: ParticlePointer
) {
  const delta = clampFrameDelta(deltaSeconds)
  const margin = 28

  for (let index = 0; index < state.count; index += 1) {
    let x = state.x[index] ?? 0
    let y = state.y[index] ?? 0
    let velocityX = state.velocityX[index] ?? 0
    let velocityY = state.velocityY[index] ?? 0

    if (pointer.active) {
      const offsetX = pointer.x - x
      const offsetY = pointer.y - y
      const distanceSquared = offsetX * offsetX + offsetY * offsetY

      if (distanceSquared > 1 && distanceSquared < 57_600) {
        const distance = Math.sqrt(distanceSquared)
        const influence = 1 - distance / 240
        const attraction = influence * 7.5 * delta
        const orbit = influence * 3.25 * delta
        velocityX += (offsetX / distance) * attraction - (offsetY / distance) * orbit
        velocityY += (offsetY / distance) * attraction + (offsetX / distance) * orbit
      }
    }

    const speed = Math.hypot(velocityX, velocityY)
    if (speed > 18) {
      const scale = 18 / speed
      velocityX *= scale
      velocityY *= scale
    }

    x += velocityX * delta
    y += velocityY * delta

    if (x < -margin) x = width + margin
    else if (x > width + margin) x = -margin

    if (y < -margin) y = height + margin
    else if (y > height + margin) y = -margin

    state.x[index] = x
    state.y[index] = y
    state.velocityX[index] = velocityX
    state.velocityY[index] = velocityY
  }
}
