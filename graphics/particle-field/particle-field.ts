import { particleFieldConfig } from './particle-config'
import {
  createParticleInput,
  decayPointerInput,
  triggerParticlePulse,
  updatePointerInput,
} from './particle-interaction'
import {
  countForBackend,
  nextLowerQuality,
  selectInitialQuality,
  selectParticleBackend,
  shouldLowerQuality,
} from './particle-quality'
import { getParticleFieldState } from './particle-state'

import type { DeviceProfile } from './particle-quality'
import type {
  ParticleBackend,
  ParticleFieldController,
  ParticleQualityTier,
  ParticleRenderer,
  ParticleRuntimeStats,
} from './types'

interface NavigatorPerformance extends Navigator {
  connection?: { saveData?: boolean }
  deviceMemory?: number
  gpu?: {
    requestAdapter(options?: { powerPreference?: 'high-performance' }): Promise<object | null>
  }
}

function hasWebGL2() {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null
  } catch {
    return false
  }
}

function getDeviceProfile(): DeviceProfile {
  const extendedNavigator = navigator as NavigatorPerformance
  return {
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    deviceMemory: extendedNavigator.deviceMemory,
    saveData: extendedNavigator.connection?.saveData === true,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hasWebGPU: extendedNavigator.gpu !== undefined,
    hasWebGL2: hasWebGL2(),
    viewportWidth: window.innerWidth,
  }
}

function forcedBackend(): ParticleBackend | null {
  if (process.env.NODE_ENV === 'production') return null
  const value = new URLSearchParams(window.location.search).get('particleBackend')
  return value === 'webgpu' || value === 'webgl2' || value === 'static' ? value : null
}

async function createRenderer(
  backend: ParticleBackend,
  canvas: HTMLCanvasElement,
  count: number
): Promise<ParticleRenderer | null> {
  if (backend === 'static') return null

  if (backend === 'webgpu') {
    try {
      const gpu = (navigator as NavigatorPerformance).gpu
      const adapter = await gpu?.requestAdapter({ powerPreference: 'high-performance' })
      if (!adapter) throw new Error('WebGPU adapter unavailable')
      const { createWebGPUParticleField } = await import('./webgpu-particle-field')
      return await createWebGPUParticleField(canvas, count)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('WixPearl particle field: WebGPU unavailable, using WebGL2.', error)
      }
    }
  }

  try {
    const { createWebGLParticleField } = await import('./webgl-particle-field')
    return createWebGLParticleField(canvas, count)
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('WixPearl particle field: WebGL2 unavailable, keeping static visual.', error)
    }
    return null
  }
}

export async function createParticleField(
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  host: HTMLElement
): Promise<ParticleFieldController> {
  const profile = getDeviceProfile()
  let backend = forcedBackend() ?? selectParticleBackend(profile)
  let quality: ParticleQualityTier = selectInitialQuality(profile)
  const requestedCount = countForBackend(backend, quality)
  let renderer = await createRenderer(backend, canvas, requestedCount)

  if (!renderer) backend = 'static'
  else backend = renderer.backend

  const input = createParticleInput()
  const stats: ParticleRuntimeStats = {
    backend,
    quality,
    particleCount: renderer ? countForBackend(backend, quality) : 0,
    averageFrameMs: 0,
    dpr: particleFieldConfig.quality[quality].dpr,
  }
  let disposed = false
  let visible = true
  let frame = 0
  let lastFrame = performance.now()
  let lastRenderedFrame = 0
  let elapsed = 0
  let overBudgetFrames = 0
  let lastPointerTime = Number.NEGATIVE_INFINITY
  let lastScrollY = window.scrollY
  let lastFieldState = getParticleFieldState(false, 0)

  const syncDataAttributes = () => {
    root.dataset.backend = stats.backend
    root.dataset.quality = stats.quality
    root.dataset.particleCount = String(stats.particleCount)
    root.dataset.motion = stats.backend === 'static' ? 'static' : 'animated'
    root.dataset.fieldState = stats.backend === 'static' ? 'idle' : lastFieldState
  }

  const resize = () => {
    if (!renderer) return
    const bounds = root.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, particleFieldConfig.quality[quality].dpr)
    stats.dpr = dpr
    renderer.resize(Math.max(1, bounds.width), Math.max(1, bounds.height), dpr)
  }

  const pointerToWorld = (clientX: number, clientY: number) => {
    const bounds = root.getBoundingClientRect()
    const aspect = bounds.width / Math.max(bounds.height, 1)
    return {
      x: ((clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2 * aspect,
      y: (0.5 - (clientY - bounds.top) / Math.max(bounds.height, 1)) * 2,
    }
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (backend === 'static') return
    const now = performance.now()
    const world = pointerToWorld(event.clientX, event.clientY)
    updatePointerInput(input, world.x, world.y, (now - lastPointerTime) / 1_000)
    root.dataset.interaction = 'pointer'
    lastPointerTime = now
  }

  const handlePointerLeave = () => {
    input.active = false
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (backend === 'static') return
    const world = pointerToWorld(event.clientX, event.clientY)
    triggerParticlePulse(input, world.x, world.y)
    root.dataset.interaction = 'pulse'
  }

  const lowerQuality = () => {
    if (!renderer) return
    const next = nextLowerQuality(quality)
    if (next === quality) return
    quality = next
    stats.quality = next
    stats.particleCount = Math.min(stats.particleCount, countForBackend(backend, next))
    renderer.setActiveCount(stats.particleCount)
    overBudgetFrames = 0
    stats.averageFrameMs = 0
    syncDataAttributes()
    resize()
  }

  const renderFrame = (timestamp: number) => {
    if (disposed) return
    frame = window.requestAnimationFrame(renderFrame)
    if (!renderer || document.hidden || !visible) {
      lastFrame = timestamp
      return
    }

    const minimumInterval = profile.coarsePointer || quality === 'low' ? 1_000 / 30 : 1_000 / 60
    if (timestamp - lastRenderedFrame < minimumInterval - 1) return
    const delta = Math.min(0.05, Math.max(0, (timestamp - lastFrame) / 1_000))
    lastFrame = timestamp
    lastRenderedFrame = timestamp
    elapsed += delta
    if (input.active && performance.now() - lastPointerTime > 120) input.active = false
    const scrollY = window.scrollY
    const scrollDelta = (scrollY - lastScrollY) / Math.max(root.clientHeight, 1)
    input.scrollVelocity +=
      (Math.max(-1, Math.min(1, scrollDelta * 18)) - input.scrollVelocity) * 0.2
    lastScrollY = scrollY
    decayPointerInput(input, delta)
    const fieldState = getParticleFieldState(input.active, input.entropy)
    if (fieldState !== lastFieldState) {
      lastFieldState = fieldState
      root.dataset.fieldState = fieldState
    }
    renderer.render(delta, elapsed, input)

    const frameMs = performance.now() - timestamp
    stats.averageFrameMs =
      stats.averageFrameMs === 0 ? frameMs : stats.averageFrameMs * 0.94 + frameMs * 0.06
    const budget = particleFieldConfig.quality[quality].frameBudgetMs
    overBudgetFrames =
      stats.averageFrameMs > budget ? overBudgetFrames + 1 : Math.max(0, overBudgetFrames - 2)
    if (shouldLowerQuality(quality, stats.averageFrameMs, overBudgetFrames)) lowerQuality()
    root.dataset.ready = 'true'
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(root)
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? true
    },
    { threshold: 0.05 }
  )
  intersectionObserver.observe(host)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('blur', handlePointerLeave)
  window.addEventListener('pointerdown', handlePointerDown, { passive: true })
  syncDataAttributes()
  renderer?.setActiveCount(stats.particleCount)
  resize()

  if (renderer) frame = window.requestAnimationFrame(renderFrame)
  else root.dataset.ready = 'true'

  return {
    dispose() {
      disposed = true
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('blur', handlePointerLeave)
      window.removeEventListener('pointerdown', handlePointerDown)
      renderer?.dispose()
      renderer = null
    },
  }
}
