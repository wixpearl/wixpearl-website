import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'

declare global {
  interface Window {
    THREE?: typeof THREE
  }
}

export interface ParticlesGLOptions {
  target?: string
  interactionTarget?: string | null
  character?: string
  particleSize?: number
  particleSpacing?: number
  particleColor?: string
  sampling?: number
  tilt?: boolean
  tiltFactor?: number
  tiltSpeed?: number
  displaceStrength?: number
  displaceRadius?: number
  velocityInfluence?: number
  returnSpeed?: number
  fontSize?: number
  fontFamily?: string
  videoUpdateRate?: number
  modelScale?: number
  geometry?: readonly number[] | Float32Array | null
  on?: {
    init?: (instance: ParticlesGLInstanceHandle) => void
  }
}

export interface ParticlesGLInstanceHandle {
  readonly id: string
  readonly options: Readonly<ParticlesGLOptions>
  readonly initialized: boolean
  init: () => Promise<void>
  cleanup: (keepTargetHidden?: boolean) => void
  updateOptions: (options: ParticlesGLOptions) => void
}

export interface ParticlesGLController {
  init: () => Promise<void>
  cleanup: () => void
  updateOptions: (options: ParticlesGLOptions) => void
  options: Readonly<ParticlesGLOptions>
}

interface ResolvedParticlesGLOptions {
  target: string
  interactionTarget: string | null
  character: string
  particleSize: number
  particleSpacing: number
  particleColor: string
  sampling: number
  tilt: boolean
  tiltFactor: number
  tiltSpeed: number
  displaceStrength: number
  displaceRadius: number
  velocityInfluence: number
  returnSpeed: number
  fontSize: number
  fontFamily: string
  videoUpdateRate: number
  modelScale: number
  geometry: readonly number[] | Float32Array | null
  on: NonNullable<ParticlesGLOptions['on']>
}

type ParticleTargetElement = HTMLElement | SVGSVGElement
type ParticleSystem = THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>

interface StackingProperties {
  position: 'fixed' | 'absolute'
  zIndex: number
  isFixedContext: boolean
}

interface ParticleSystemData {
  system: ParticleSystem
  element: ParticleTargetElement
  interactionElement: Element
  options: ResolvedParticlesGLOptions
  inView: boolean
  observer: IntersectionObserver | null
  originalVisibility: string
  targetRotation: THREE.Vector2
  isMouseOver: boolean
  resetAnimation: { x: number; y: number }
  currentMouse: THREE.Vector2
  lastMousePos: THREE.Vector2
  stacking: StackingProperties
  mouseVelocity: number
  isMoving: boolean
  inactivityTimer: number
  effectRadius: number
  targetEffectRadius: number
  lastMoveTime: number
  isVideo: boolean
  videoCanvas: HTMLCanvasElement | null
  videoContext: CanvasRenderingContext2D | null
  lastVideoUpdate: number
  videoUpdateInterval: number
  hideTimer: number | null
  externalRadiusUpdate?: boolean
}

interface RendererData {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
}

interface ResizeHandlers {
  handleResize: () => void
  handleOrientationChange: () => void
  isMobile: boolean
}

interface ParticleData {
  positions: number[] | Float32Array
  colors: number[]
}

if (typeof window !== 'undefined' && !window.THREE) {
  window.THREE = THREE
}

function valueAt(values: ArrayLike<number>, index: number): number {
  return values[index] ?? 0
}

function isMesh(object: THREE.Object3D): object is THREE.Mesh {
  return (object as THREE.Mesh).isMesh
}

export interface NormalizedPointer {
  readonly x: number
  readonly y: number
  readonly inside: boolean
}

export function normalizePointer(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom' | 'width' | 'height'>
): NormalizedPointer {
  const inside =
    rect.width > 0 &&
    rect.height > 0 &&
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom

  return {
    x: rect.width > 0 ? ((clientX - rect.left) / rect.width) * 2 - 1 : 0,
    y: rect.height > 0 ? -((clientY - rect.top) / rect.height) * 2 + 1 : 0,
    inside,
  }
}

export function resolveInteractionTarget(
  target: ParticleTargetElement,
  selector: string | null
): Element {
  if (!selector) return target
  return target.closest(selector) ?? document.querySelector(selector) ?? target
}

const particlesGL = (function () {
  'use strict'

  /* --------------------------------------------------
   *  Global State Management
   * ------------------------------------------------*/
  let globalRenderer: ParticlesGLRenderer | null = null
  let instanceCounter = 0
  const activeInstances = new Map<string, ParticlesGLInstance>()
  let animationFrameId: number | null = null
  let isAnimating = false
  let resizeObserver: ResizeHandlers | null = null
  let resizeDebounceTimer: number | null = null

  /* --------------------------------------------------
   *  Shared Renderer Architecture
   * ------------------------------------------------*/
  class ParticlesGLRenderer {
    readonly particleSystems = new Map<string, ParticleSystemData>()
    readonly targetElements = new Map<string, ParticleTargetElement>()
    readonly renderers = new Map<string, RendererData>()
    readonly mouse = new THREE.Vector2()
    readonly lastMousePos = new THREE.Vector2()
    readonly mouseVelocity = new THREE.Vector2()

    constructor() {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('touchstart', this.onTouchMove, {
        passive: false,
      })
      document.addEventListener('touchmove', this.onTouchMove, {
        passive: false,
      })
    }

    addParticleSystem(
      instanceId: string,
      particleSystem: ParticleSystem,
      targetElement: ParticleTargetElement,
      options: ResolvedParticlesGLOptions
    ) {
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      })

      const pixelRatio = Math.min(window.devicePixelRatio, 2)
      renderer.setPixelRatio(pixelRatio)
      renderer.setClearColor(0x000000, 0)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
      camera.position.z = 1.15

      scene.add(particleSystem)

      const stacking = getStackingProperties(targetElement)
      const interactionElement = resolveInteractionTarget(targetElement, options.interactionTarget)

      const canvas = renderer.domElement
      canvas.setAttribute('data-particles-target', instanceId)
      canvas.setAttribute('aria-hidden', 'true')
      canvas.setAttribute('data-particles-active', 'false')
      canvas.tabIndex = -1
      canvas.style.position = stacking.position
      canvas.style.pointerEvents = 'none'
      canvas.style.backgroundColor = 'transparent'

      if (stacking.isFixedContext) {
        document.body.appendChild(canvas)
      } else {
        targetElement.parentNode?.insertBefore(canvas, targetElement)
      }

      this.renderers.set(instanceId, { renderer, scene, camera })

      this.particleSystems.set(instanceId, {
        system: particleSystem,
        element: targetElement,
        interactionElement,
        options: options,
        inView: false,
        observer: null,
        originalVisibility: targetElement.style.visibility,
        targetRotation: new THREE.Vector2(),
        isMouseOver: false,
        resetAnimation: { x: 0, y: 0 },
        currentMouse: new THREE.Vector2(),
        lastMousePos: new THREE.Vector2(),
        stacking: stacking,
        mouseVelocity: 0,
        isMoving: false,
        inactivityTimer: 0,
        effectRadius: 0,
        targetEffectRadius: 0,
        lastMoveTime: 0,
        isVideo: targetElement.tagName.toLowerCase() === 'video',
        videoCanvas: null,
        videoContext: null,
        lastVideoUpdate: 0,
        videoUpdateInterval: options.videoUpdateRate || 100,
        hideTimer: null,
      })

      this.targetElements.set(instanceId, targetElement)

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            const systemData = this.particleSystems.get(instanceId)
            if (systemData) {
              systemData.inView = entries[0]?.isIntersecting ?? false
            }
          },
          {
            root: null,
            threshold: 0,
            rootMargin: '500px',
          }
        )

        observer.observe(targetElement)
        const systemData = this.particleSystems.get(instanceId)
        if (systemData) systemData.observer = observer
      } else {
        const systemData = this.particleSystems.get(instanceId)
        if (systemData) systemData.inView = true
      }

      const systemData = this.particleSystems.get(instanceId)
      if (systemData) {
        systemData.hideTimer = window.setTimeout(() => {
          if (this.particleSystems.get(instanceId) === systemData) {
            targetElement.style.visibility = 'hidden'
          }
        }, 16)
      }
    }

    removeParticleSystem(instanceId: string, keepTargetHidden = false) {
      const systemData = this.particleSystems.get(instanceId)
      const rendererData = this.renderers.get(instanceId)

      if (systemData) {
        if (systemData.hideTimer !== null) window.clearTimeout(systemData.hideTimer)
        if (systemData.interactionElement instanceof HTMLElement) {
          systemData.interactionElement.dataset.particlesActive = 'false'
        }
        if (!keepTargetHidden) {
          systemData.element.style.visibility = systemData.originalVisibility || ''
        }

        const canvas = document.querySelector(`canvas[data-particles-target="${instanceId}"]`)
        if (canvas) {
          canvas.remove()
        }

        systemData.system.geometry.dispose()
        if (systemData.system.material.map) systemData.system.material.map.dispose()
        systemData.system.material.dispose()

        if (systemData.observer) {
          systemData.observer.disconnect()
        }

        if (systemData.videoCanvas) {
          systemData.videoCanvas = null
          systemData.videoContext = null
        }

        this.particleSystems.delete(instanceId)
        this.targetElements.delete(instanceId)
      }

      if (rendererData) {
        rendererData.renderer.dispose()
        this.renderers.delete(instanceId)
      }
    }

    readonly onMouseMove = (event: MouseEvent) => {
      for (const [instanceId, systemData] of this.particleSystems) {
        const rect = systemData.interactionElement.getBoundingClientRect()
        const pointer = normalizePointer(event.clientX, event.clientY, rect)
        const isMouseOver = pointer.inside
        const canvas = this.renderers.get(instanceId)?.renderer.domElement
        if (canvas) canvas.dataset.particlesActive = String(isMouseOver)
        if (systemData.interactionElement instanceof HTMLElement) {
          systemData.interactionElement.dataset.particlesActive = String(isMouseOver)
        }

        if (isMouseOver && !systemData.isMouseOver) {
          systemData.isMouseOver = true
        } else if (!isMouseOver && systemData.isMouseOver) {
          systemData.isMouseOver = false
          this.startResetAnimation(instanceId)
        }

        if (isMouseOver) {
          let mouseX = pointer.x
          const mouseY = pointer.y

          if (systemData.element.dataset.flipHorizontal === 'true') {
            mouseX = -mouseX
          }

          const newMousePos = new THREE.Vector2(mouseX, mouseY)

          const velocity = newMousePos.clone().sub(systemData.currentMouse)
          systemData.mouseVelocity = velocity.length()

          systemData.lastMoveTime = performance.now()

          systemData.isMoving = systemData.mouseVelocity > 0.001

          if (systemData.isMoving) {
            systemData.inactivityTimer = 0
          }

          if (systemData.options.tilt) {
            systemData.targetRotation.x = mouseY * systemData.options.tiltFactor
            systemData.targetRotation.y = mouseX * systemData.options.tiltFactor
          }

          systemData.currentMouse.copy(newMousePos)
        }
      }
    }

    readonly onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0]
        if (!touch) return
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY,
        })
        this.onMouseMove(mouseEvent)
      }
    }

    startResetAnimation(instanceId: string) {
      const systemData = this.particleSystems.get(instanceId)
      if (!systemData) return

      systemData.resetAnimation.x = systemData.targetRotation.x
      systemData.resetAnimation.y = systemData.targetRotation.y

      const animate = () => {
        const easeSpeed = 0.08

        systemData.resetAnimation.x += (0 - systemData.resetAnimation.x) * easeSpeed
        systemData.resetAnimation.y += (0 - systemData.resetAnimation.y) * easeSpeed

        systemData.targetRotation.x = systemData.resetAnimation.x
        systemData.targetRotation.y = systemData.resetAnimation.y

        if (
          Math.abs(systemData.resetAnimation.x) > 0.001 ||
          Math.abs(systemData.resetAnimation.y) > 0.001
        ) {
          requestAnimationFrame(animate)
        } else {
          systemData.targetRotation.x = 0
          systemData.targetRotation.y = 0
          systemData.resetAnimation.x = 0
          systemData.resetAnimation.y = 0
        }
      }

      animate()
    }

    animate() {
      if (!isAnimating) return

      for (const [instanceId, systemData] of this.particleSystems) {
        if (!systemData.inView) continue

        const { system, options } = systemData
        const rendererData = this.renderers.get(instanceId)

        if (!rendererData) continue

        const { renderer, scene, camera } = rendererData

        if (systemData.externalRadiusUpdate) {
          systemData.targetEffectRadius = options.displaceRadius
          systemData.externalRadiusUpdate = false
        } else {
          if (systemData.isMouseOver) {
            const currentTime = performance.now()
            const timeSinceLastMove = currentTime - systemData.lastMoveTime

            if (timeSinceLastMove > 100) {
              systemData.isMoving = false
            }

            systemData.targetEffectRadius = systemData.isMoving ? options.displaceRadius : 0
          } else {
            systemData.targetEffectRadius = 0
            systemData.isMoving = false
          }
        }

        const easeSpeed = 0.08
        const radiusDiff = systemData.targetEffectRadius - systemData.effectRadius
        if (Math.abs(radiusDiff) > 0.001) {
          systemData.effectRadius += radiusDiff * easeSpeed
        } else {
          systemData.effectRadius = systemData.targetEffectRadius
        }

        system.rotation.x += (systemData.targetRotation.x - system.rotation.x) * options.tiltSpeed
        system.rotation.y += (systemData.targetRotation.y - system.rotation.y) * options.tiltSpeed

        if (systemData.isVideo) {
          this.updateVideoParticles(systemData)
        }

        const rect = systemData.element.getBoundingClientRect()

        if (rect.width > 0 && rect.height > 0) {
          camera.aspect = rect.width / rect.height
          camera.updateProjectionMatrix()
          renderer.setSize(rect.width, rect.height)
        } else {
          continue
        }

        const fov = camera.fov * (Math.PI / 180)
        const visibleHeight = 2 * Math.tan(fov / 2) * camera.position.z
        const visibleWidth = visibleHeight * camera.aspect
        const mouseWorld = new THREE.Vector2(
          systemData.currentMouse.x * (visibleWidth / 2),
          systemData.currentMouse.y * (visibleHeight / 2)
        )

        this.applyGlitchEffect(system, options, systemData, mouseWorld)

        const canvas = renderer.domElement
        const stacking = systemData.stacking
        canvas.style.position = stacking.position

        canvas.style.display = 'block'
        canvas.style.visibility = 'visible'

        if (stacking.position === 'fixed') {
          canvas.style.top = `${String(rect.top)}px`
          canvas.style.left = `${String(rect.left)}px`
          canvas.style.zIndex = String(stacking.zIndex + 1)
        } else {
          const offsetTop =
            systemData.element instanceof HTMLElement ? systemData.element.offsetTop : rect.top
          const offsetLeft =
            systemData.element instanceof HTMLElement ? systemData.element.offsetLeft : rect.left
          canvas.style.top = `${String(offsetTop)}px`
          canvas.style.left = `${String(offsetLeft)}px`
          const targetStyle = window.getComputedStyle(systemData.element)
          canvas.style.zIndex = targetStyle.zIndex === 'auto' ? '0' : targetStyle.zIndex
        }

        canvas.style.width = `${String(rect.width)}px`
        canvas.style.height = `${String(rect.height)}px`
        canvas.style.pointerEvents = 'none'

        renderer.render(scene, camera)
      }

      animationFrameId = requestAnimationFrame(() => {
        this.animate()
      })
    }

    applyGlitchEffect(
      particleSystem: ParticleSystem,
      options: ResolvedParticlesGLOptions,
      systemData: ParticleSystemData,
      mouseWorld: THREE.Vector2
    ) {
      const posAttr = particleSystem.geometry.attributes.position
      const originalPosAttr = particleSystem.geometry.attributes.originalPosition

      if (!posAttr || !originalPosAttr) return

      const currentRadius = systemData.effectRadius

      if (currentRadius < 0.001) {
        const positions = posAttr.array
        const originalPositions = originalPosAttr.array

        for (let i = 0; i < positions.length; i += 3) {
          const lerpFactor = options.returnSpeed
          const x = valueAt(positions, i)
          const y = valueAt(positions, i + 1)
          positions[i] = x + (valueAt(originalPositions, i) - x) * lerpFactor
          positions[i + 1] = y + (valueAt(originalPositions, i + 1) - y) * lerpFactor
        }

        posAttr.needsUpdate = true
        return
      }

      const positions = posAttr.array
      const originalPositions = originalPosAttr.array

      const currentMouse = systemData.currentMouse
      const mouseVelocity = currentMouse.clone().sub(systemData.lastMousePos)
      systemData.lastMousePos.copy(currentMouse)

      const velocityAngle = Math.atan2(mouseVelocity.y, mouseVelocity.x)

      for (let i = 0; i < positions.length; i += 3) {
        const x = valueAt(positions, i)
        const y = valueAt(positions, i + 1)
        const originalX = valueAt(originalPositions, i)
        const originalY = valueAt(originalPositions, i + 1)
        const tempVec = new THREE.Vector2(x, y)
        const distanceToMouse = mouseWorld.distanceTo(tempVec)

        if (distanceToMouse > currentRadius * 2) {
          const lerpFactor = options.returnSpeed
          positions[i] = x + (originalX - x) * lerpFactor
          positions[i + 1] = y + (originalY - y) * lerpFactor
          continue
        }

        const normalizedDist = distanceToMouse / currentRadius
        const falloff = Math.exp(-normalizedDist * normalizedDist * 2)

        if (falloff > 0.01) {
          const baseAngle = Math.atan2(tempVec.y - mouseWorld.y, tempVec.x - mouseWorld.x)
          const finalAngle = baseAngle + velocityAngle * options.velocityInfluence
          const randomAngle = (Math.random() - 0.5) * Math.PI * 0.5
          const strength = falloff * options.displaceStrength * (1 + Math.random() * 0.5)

          const displacement = new THREE.Vector2(
            Math.cos(finalAngle + randomAngle) * strength,
            Math.sin(finalAngle + randomAngle) * strength
          )

          positions[i] = originalX + displacement.x
          positions[i + 1] = originalY + displacement.y
        } else {
          positions[i] = x + (originalX - x) * options.returnSpeed
          positions[i + 1] = y + (originalY - y) * options.returnSpeed
        }
      }

      posAttr.needsUpdate = true
    }

    updateVideoParticles(systemData: ParticleSystemData) {
      const currentTime = performance.now()

      if (currentTime - systemData.lastVideoUpdate < systemData.videoUpdateInterval) {
        return
      }

      if (!(systemData.element instanceof HTMLVideoElement)) return
      const videoElement = systemData.element

      if (videoElement.readyState >= 2 && !videoElement.paused && !videoElement.ended) {
        if (!systemData.videoCanvas) {
          const MAX_SIDE = 2048
          const aspect = (videoElement.videoWidth || 16) / (videoElement.videoHeight || 9)

          systemData.videoCanvas = document.createElement('canvas')

          if (aspect >= 1) {
            systemData.videoCanvas.width = MAX_SIDE
            systemData.videoCanvas.height = Math.round(MAX_SIDE / aspect)
          } else {
            systemData.videoCanvas.height = MAX_SIDE
            systemData.videoCanvas.width = Math.round(MAX_SIDE * aspect)
          }

          systemData.videoContext = systemData.videoCanvas.getContext('2d', {
            willReadFrequently: true,
          })
        }

        const videoCanvas = systemData.videoCanvas
        const videoContext = systemData.videoContext
        if (!videoContext) return

        const vcw = videoCanvas.width
        const vch = videoCanvas.height

        videoContext.clearRect(0, 0, vcw, vch)
        videoContext.drawImage(videoElement, 0, 0, vcw, vch)

        const imageData = videoContext.getImageData(0, 0, vcw, vch)

        const newPositions: number[] = []
        const newColors: number[] = []
        const brightnessThreshold = 80
        const useColorSampling = systemData.options.particleColor === 'sample'

        for (let y = 0; y < vch; y += systemData.options.sampling) {
          for (let x = 0; x < vcw; x += systemData.options.sampling) {
            const i = (y * vcw + x) * 4
            const r = imageData.data[i]
            const g = imageData.data[i + 1]
            const b = imageData.data[i + 2]

            if (r === undefined || g === undefined || b === undefined) continue
            const brightness = r * 0.299 + g * 0.587 + b * 0.114

            const maxColorComponent = Math.max(r, g, b)
            const hasSignificantColor = maxColorComponent > 50

            if (brightness > brightnessThreshold && hasSignificantColor) {
              const xPos = (x - vcw / 2) * systemData.options.particleSpacing
              const yPos = (vch / 2 - y) * systemData.options.particleSpacing
              newPositions.push(xPos, yPos, 0)

              if (useColorSampling) {
                const colorR = r / 255
                const colorG = g / 255
                const colorB = b / 255
                newColors.push(colorR, colorG, colorB)
              }
            }
          }
        }

        const geometry = systemData.system.geometry
        if (newPositions.length > 0) {
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3))
          geometry.setAttribute(
            'originalPosition',
            new THREE.Float32BufferAttribute(newPositions, 3)
          )

          if (useColorSampling && newColors.length > 0) {
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(newColors, 3))
            geometry.setAttribute('originalColor', new THREE.Float32BufferAttribute(newColors, 3))
          }
        }

        systemData.lastVideoUpdate = currentTime
      }
    }

    startAnimation() {
      if (!isAnimating) {
        isAnimating = true
        this.animate()
      }
    }

    stopAnimation() {
      if (isAnimating) {
        isAnimating = false
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      }
    }

    dispose() {
      this.stopAnimation()

      for (const [instanceId] of this.particleSystems) {
        this.removeParticleSystem(instanceId)
      }

      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('touchstart', this.onTouchMove)
      document.removeEventListener('touchmove', this.onTouchMove)

      for (const rendererData of this.renderers.values()) {
        rendererData.renderer.dispose()
      }

      this.particleSystems.clear()
      this.targetElements.clear()
      this.renderers.clear()
    }
  }

  /* --------------------------------------------------
   *  Universal Element to Canvas Converter
   * ------------------------------------------------*/
  function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('particlesGL: Canvas 2D is unavailable')
    return context
  }

  async function elementToCanvas(
    element: ParticleTargetElement,
    options: Pick<ResolvedParticlesGLOptions, 'particleColor'>
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas')
    const ctx = getCanvasContext(canvas)

    let canvasWidth: number
    let canvasHeight: number
    const tagName = element.tagName.toLowerCase()

    const MAX_SIDE = 2048

    if (['img', 'svg', 'canvas', 'video'].includes(tagName)) {
      let intrinsicW = 0
      let intrinsicH = 0

      if (element instanceof HTMLImageElement) {
        intrinsicW = element.naturalWidth || 0
        intrinsicH = element.naturalHeight || 0
      } else if (element instanceof HTMLVideoElement) {
        intrinsicW = element.videoWidth || 0
        intrinsicH = element.videoHeight || 0
      } else if (element instanceof HTMLCanvasElement) {
        intrinsicW = element.width || 0
        intrinsicH = element.height || 0
      } else if (element instanceof SVGSVGElement) {
        const viewBox = element.getAttribute('viewBox')
        if (viewBox) {
          const vb = viewBox.split(/[ ,]+/).map(Number)
          if (vb.length === 4) {
            intrinsicW = vb[2] ?? 0
            intrinsicH = vb[3] ?? 0
          }
        }
      }

      if (!intrinsicW || !intrinsicH) {
        const rect = element.getBoundingClientRect()
        intrinsicW = rect.width
        intrinsicH = rect.height
      }

      const aspect = intrinsicW / intrinsicH || 1
      if (aspect >= 1) {
        canvasWidth = MAX_SIDE
        canvasHeight = Math.round(MAX_SIDE / aspect)
      } else {
        canvasHeight = MAX_SIDE
        canvasWidth = Math.round(MAX_SIDE * aspect)
      }
    } else {
      const rect = element.getBoundingClientRect()
      const scale = 4
      canvasWidth = Math.min(MAX_SIDE, Math.round(rect.width * scale))
      canvasHeight = Math.min(MAX_SIDE, Math.round(rect.height * scale))
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      switch (tagName) {
        case 'img':
          if (!(element instanceof HTMLImageElement)) break
          await new Promise<void>((resolve, reject) => {
            if (element.complete) {
              ctx.drawImage(element, 0, 0, canvasWidth, canvasHeight)
              resolve()
            } else {
              element.onload = () => {
                ctx.drawImage(element, 0, 0, canvasWidth, canvasHeight)
                resolve()
              }
              element.onerror = reject
            }
          })
          break

        case 'svg':
          if (!(element instanceof SVGSVGElement)) break
          const svgData = new XMLSerializer().serializeToString(element)
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
          const svgUrl = URL.createObjectURL(svgBlob)
          const img = new Image()

          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
              URL.revokeObjectURL(svgUrl)
              resolve()
            }
            img.onerror = reject
            img.src = svgUrl
          })
          break

        case 'canvas':
          if (!(element instanceof HTMLCanvasElement)) break
          ctx.drawImage(element, 0, 0, canvasWidth, canvasHeight)
          break

        case 'video':
          if (!(element instanceof HTMLVideoElement)) break
          if (element.readyState >= 2) {
            ctx.drawImage(element, 0, 0, canvasWidth, canvasHeight)
          } else {
            await new Promise<void>((resolve) => {
              element.addEventListener(
                'loadeddata',
                () => {
                  ctx.drawImage(element, 0, 0, canvasWidth, canvasHeight)
                  resolve()
                },
                { once: true }
              )
            })
          }
          break

        default:
          const computedStyle = window.getComputedStyle(element)
          const text =
            element.textContent ||
            (element instanceof HTMLElement ? element.innerText : '') ||
            'Text'

          const originalFontSize = parseFloat(computedStyle.fontSize)
          const fontFamily = computedStyle.fontFamily
          const fontWeight = computedStyle.fontWeight
          const fontStyle = computedStyle.fontStyle

          const canvasScale = 4
          const canvasFontSize = originalFontSize * canvasScale

          ctx.font = `${fontStyle} ${fontWeight} ${String(canvasFontSize)}px ${fontFamily}`
          ctx.fillStyle = options.particleColor || computedStyle.color
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          ctx.fillText(text, canvasWidth / 2, canvasHeight / 2)
          break
      }
    } catch (error) {
      console.error('Error converting element to canvas:', error)
      ctx.fillStyle = '#333333'
      ctx.fillRect(canvasWidth / 4, canvasHeight / 4, canvasWidth / 2, canvasHeight / 2)
    }

    return canvas
  }

  /* --------------------------------------------------
   *  3D Model Loader
   * ------------------------------------------------*/
  async function loadModelGeometry(
    modelSrc: string,
    options: Pick<ResolvedParticlesGLOptions, 'modelScale'>
  ): Promise<number[]> {
    return new Promise<number[]>((resolve, reject) => {
      const loader = new GLTFLoader()
      loader.load(
        modelSrc,
        (gltf: GLTF) => {
          const positions: number[] = []
          const box = new THREE.Box3().setFromObject(gltf.scene)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = options.modelScale / maxDim

          gltf.scene.traverse((child) => {
            if (isMesh(child)) {
              const geometry = child.geometry
              const posAttr = geometry.attributes.position
              if (!posAttr) return
              const tempVertex = new THREE.Vector3()
              child.updateWorldMatrix(true, false)

              for (let i = 0; i < posAttr.count; i++) {
                tempVertex.fromBufferAttribute(posAttr, i)
                tempVertex.applyMatrix4(child.matrixWorld)

                tempVertex.sub(center)
                tempVertex.multiplyScalar(scale)

                positions.push(tempVertex.x, tempVertex.y, tempVertex.z)
              }
            }
          })

          if (positions.length === 0) {
            console.warn(`particlesGL: No mesh geometry found in ${modelSrc}`)
            reject(new Error(`No mesh geometry found in ${modelSrc}`))
            return
          }

          resolve(positions)
        },
        undefined,
        (error: unknown) => {
          console.error(`particlesGL: Failed to load 3D model from ${modelSrc}`, error)
          reject(new Error(`Failed to load model: ${String(error)}`))
        }
      )
    })
  }

  /* --------------------------------------------------
   *  Particle System Creation
   * ------------------------------------------------*/
  async function createParticleSystem(
    element: ParticleTargetElement,
    options: ResolvedParticlesGLOptions
  ): Promise<ParticleSystem> {
    let particleData: ParticleData
    const modelSrc = element.dataset.modelSrc

    if (modelSrc) {
      try {
        const positions = await loadModelGeometry(modelSrc, options)
        particleData = { positions: positions, colors: [] }
      } catch (error) {
        console.error(`particlesGL: Could not process model ${modelSrc}.`, error)
        await elementToCanvas(element, options)
        particleData = { positions: [], colors: [] }
      }
    } else if (options.geometry) {
      particleData = { positions: Float32Array.from(options.geometry), colors: [] }
    } else {
      const canvas = await elementToCanvas(element, options)
      const ctx = getCanvasContext(canvas)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const tempPositions: number[] = []
      const tempColors: number[] = []

      const useColorSampling = options.particleColor === 'sample'

      const isVideo = element.tagName.toLowerCase() === 'video'
      const alphaThreshold = 128
      const brightnessThreshold = 80

      for (let y = 0; y < canvas.height; y += options.sampling) {
        for (let x = 0; x < canvas.width; x += options.sampling) {
          const i = (y * canvas.width + x) * 4
          const r = imageData.data[i]
          const g = imageData.data[i + 1]
          const b = imageData.data[i + 2]
          const alpha = imageData.data[i + 3]
          if (r === undefined || g === undefined || b === undefined || alpha === undefined) {
            continue
          }

          let shouldCreateParticle = false

          if (isVideo) {
            const brightness = r * 0.299 + g * 0.587 + b * 0.114

            const maxColorComponent = Math.max(r, g, b)
            const hasSignificantColor = maxColorComponent > 50

            shouldCreateParticle = brightness > brightnessThreshold && hasSignificantColor
          } else {
            shouldCreateParticle = alpha > alphaThreshold
          }

          if (shouldCreateParticle) {
            let xPos: number
            let yPos: number

            const isTextCanvas = !['img', 'svg', 'canvas', 'video'].includes(
              element.tagName.toLowerCase()
            )

            if (isTextCanvas) {
              const fov = 75 * (Math.PI / 180)
              const cameraZ = 1.15
              const visibleHeight = 2 * Math.tan(fov / 2) * cameraZ

              const rect = element.getBoundingClientRect()
              const elementAspect = rect.width / rect.height
              const visibleWidth = visibleHeight * elementAspect

              xPos = ((x - canvas.width / 2) / canvas.width) * visibleWidth
              yPos = ((canvas.height / 2 - y) / canvas.height) * visibleHeight
            } else {
              xPos = (x - canvas.width / 2) * options.particleSpacing
              yPos = (canvas.height / 2 - y) * options.particleSpacing
            }

            tempPositions.push(xPos, yPos, 0)

            if (useColorSampling) {
              const colorR = r / 255
              const colorG = g / 255
              const colorB = b / 255
              tempColors.push(colorR, colorG, colorB)
            }
          }
        }
      }
      particleData = { positions: tempPositions, colors: tempColors }
    }

    const { positions, colors } = particleData
    const originalPositions = [...positions]
    const originalColors = [...colors]

    const useColorSampling = options.particleColor === 'sample' && colors.length > 0

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute(
      'originalPosition',
      new THREE.Float32BufferAttribute(originalPositions, 3)
    )

    if (useColorSampling) {
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geometry.setAttribute('originalColor', new THREE.Float32BufferAttribute(originalColors, 3))
    }

    const material = new THREE.PointsMaterial({
      size: options.particleSize,
      map: createCharacterSprite(options.character, options, useColorSampling),
      transparent: true,
      alphaTest: 0.5,
      sizeAttenuation: true,
      vertexColors: useColorSampling,
    })

    const particleSystem = new THREE.Points(geometry, material)
    particleSystem.userData = { options, useColorSampling }

    return particleSystem
  }

  function createCharacterSprite(
    character: string,
    options: Pick<ResolvedParticlesGLOptions, 'particleColor' | 'fontSize' | 'fontFamily'>,
    useColorSampling = false
  ): THREE.CanvasTexture {
    const canvas = document.createElement('canvas')
    const size = 64
    canvas.width = size
    canvas.height = size
    const ctx = getCanvasContext(canvas)

    ctx.fillStyle = useColorSampling ? '#ffffff' : options.particleColor || '#8c8c8c'
    ctx.font = `${String(options.fontSize || 48)}px ${options.fontFamily || 'monospace'}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(character, size / 2, size / 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }

  /* --------------------------------------------------
   *  DOM Analysis Helper
   * ------------------------------------------------*/
  function getStackingProperties(element: ParticleTargetElement): StackingProperties {
    let zIndex = 0
    let isFixed = false
    let el: Element | null = element

    while (el && el !== document.body) {
      const style = window.getComputedStyle(el)
      const currentPosition = style.position
      const currentZIndex = parseInt(style.zIndex, 10)

      if (currentPosition === 'fixed') {
        isFixed = true
      }

      if (currentPosition !== 'static' && !isNaN(currentZIndex)) {
        zIndex = Math.max(zIndex, currentZIndex)
      }

      el = el.parentElement
    }

    const style = window.getComputedStyle(element)
    const elementZIndex = parseInt(style.zIndex, 10)
    if (style.position !== 'static' && !isNaN(elementZIndex)) {
      zIndex = Math.max(zIndex, elementZIndex)
    }

    return {
      position: isFixed ? 'fixed' : 'absolute',
      zIndex: zIndex,
      isFixedContext: isFixed,
    }
  }

  /* --------------------------------------------------
   *  Instance Management
   * ------------------------------------------------*/
  class ParticlesGLInstance {
    readonly id: string
    options: ResolvedParticlesGLOptions
    readonly elements: ParticleTargetElement[]
    initialized: boolean
    private generation = 0
    private initializing = false
    private readonly systemIds = new Set<string>()

    constructor(options: ResolvedParticlesGLOptions, elements: ParticleTargetElement[]) {
      this.id = `particles-gl-${String(++instanceCounter)}`
      this.options = options
      this.elements = elements
      this.initialized = false
    }

    async init() {
      if (this.initialized || this.initializing) return
      this.initializing = true
      const generation = ++this.generation
      activeInstances.set(this.id, this)

      if (!globalRenderer) {
        globalRenderer = new ParticlesGLRenderer()
        globalRenderer.startAnimation()
        setupGlobalResizeObserver()
      }
      const renderer = globalRenderer

      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i]
        if (!element) continue
        try {
          const particleSystem = await createParticleSystem(element, this.options)
          if (generation !== this.generation) {
            particleSystem.geometry.dispose()
            particleSystem.material.map?.dispose()
            particleSystem.material.dispose()
            break
          }
          const elementId = element.id || `element-${String(i)}`
          const systemId = this.id + '-' + elementId
          renderer.addParticleSystem(systemId, particleSystem, element, this.options)
          this.systemIds.add(systemId)
        } catch (error) {
          console.error(
            'particlesGL: Failed to create particle system for element:',
            element,
            error
          )
        }
      }

      this.initializing = false
      if (generation !== this.generation) return
      if (this.systemIds.size === 0) {
        activeInstances.delete(this.id)
        if (activeInstances.size === 0) {
          renderer.dispose()
          if (globalRenderer === renderer) globalRenderer = null
          cleanupGlobalResizeObserver()
        }
        return
      }
      this.initialized = true

      this.options.on.init?.(this)
    }

    cleanup(keepTargetHidden = false) {
      this.generation += 1
      this.initializing = false
      for (const systemId of this.systemIds) {
        globalRenderer?.removeParticleSystem(systemId, keepTargetHidden)
      }
      this.systemIds.clear()

      activeInstances.delete(this.id)

      if (activeInstances.size === 0 && globalRenderer) {
        globalRenderer.dispose()
        globalRenderer = null
        cleanupGlobalResizeObserver()
      }

      this.initialized = false
    }

    updateOptions(newOptions: ParticlesGLOptions) {
      const oldOptions = { ...this.options }
      this.options = {
        ...this.options,
        ...newOptions,
        on: { ...this.options.on, ...newOptions.on },
      }

      const isVideo = this.elements.every((el) => el.tagName.toLowerCase() === 'video')

      const reinitKeys: (keyof ParticlesGLOptions)[] = ['target', 'interactionTarget', 'geometry']

      if (!isVideo) {
        reinitKeys.push('sampling', 'particleSpacing')
      }

      const needsReinit = reinitKeys.some(
        (key) => newOptions[key] !== undefined && newOptions[key] !== oldOptions[key]
      )

      if (needsReinit) {
        this.cleanup()
        setTimeout(() => {
          void this.init()
        }, 100)
      } else {
        this.updateLiveProperties(newOptions, oldOptions)
      }
    }

    updateLiveProperties(newOptions: ParticlesGLOptions, oldOptions: ResolvedParticlesGLOptions) {
      if (!globalRenderer) return

      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i]
        if (!element) continue
        const elementId = element.id || `element-${String(i)}`
        const instanceId = this.id + '-' + elementId
        const systemData = globalRenderer.particleSystems.get(instanceId)

        if (systemData) {
          if (newOptions.displaceRadius !== undefined) {
            systemData.externalRadiusUpdate = true
          }

          systemData.options = {
            ...systemData.options,
            ...newOptions,
            on: { ...systemData.options.on, ...newOptions.on },
          }

          if (newOptions.videoUpdateRate !== undefined) {
            systemData.videoUpdateInterval = newOptions.videoUpdateRate
          }

          const material = systemData.system.material
          if (newOptions.particleSize !== undefined) {
            material.size = newOptions.particleSize
          }

          const characterChanged =
            newOptions.character !== undefined && newOptions.character !== oldOptions.character
          const fontChanged =
            (newOptions.fontSize !== undefined && newOptions.fontSize !== oldOptions.fontSize) ||
            (newOptions.fontFamily !== undefined && newOptions.fontFamily !== oldOptions.fontFamily)
          const colorChanged =
            newOptions.particleColor !== undefined &&
            newOptions.particleColor !== oldOptions.particleColor

          if (characterChanged || fontChanged || colorChanged) {
            const useColorSampling = this.options.particleColor === 'sample'
            const wasColorSampling = oldOptions.particleColor === 'sample'

            const oldMap = material.map
            material.map = createCharacterSprite(
              this.options.character,
              this.options,
              useColorSampling
            )
            if (oldMap) oldMap.dispose()

            material.vertexColors = useColorSampling

            if (useColorSampling !== wasColorSampling) {
              material.needsUpdate = true
            }
          }
        }
      }
    }
  }

  /* --------------------------------------------------
   *  Global Resize Observer
   * ------------------------------------------------*/
  function setupGlobalResizeObserver() {
    if (resizeObserver) return

    let lastWidth = window.innerWidth
    let lastHeight = window.innerHeight
    let lastDevicePixelRatio = window.devicePixelRatio

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      ('ontouchstart' in window && window.innerWidth < 1024)

    const handleResize = () => {
      if (resizeDebounceTimer) {
        clearTimeout(resizeDebounceTimer)
      }

      resizeDebounceTimer = window.setTimeout(() => {
        const currentWidth = window.innerWidth
        const currentHeight = window.innerHeight
        const currentDevicePixelRatio = window.devicePixelRatio

        const widthChanged = Math.abs(currentWidth - lastWidth) > 10
        const heightChanged = isMobile ? false : Math.abs(currentHeight - lastHeight) > 100
        const pixelRatioChanged = currentDevicePixelRatio !== lastDevicePixelRatio

        if (widthChanged || heightChanged || pixelRatioChanged) {
          for (const instance of activeInstances.values()) {
            if (instance.initialized) {
              instance.cleanup()
              setTimeout(() => {
                void instance.init()
              }, 50)
            }
          }

          lastWidth = currentWidth
          lastHeight = currentHeight
          lastDevicePixelRatio = currentDevicePixelRatio
        }
      }, 250)
    }

    const handleOrientationChange = () => {
      if (isMobile) {
        setTimeout(() => {
          handleResize()
        }, 500)
      }
    }

    window.addEventListener('resize', handleResize)

    if (isMobile) {
      window.addEventListener('orientationchange', handleOrientationChange)
    }

    resizeObserver = { handleResize, handleOrientationChange, isMobile }
  }

  function cleanupGlobalResizeObserver() {
    if (resizeObserver) {
      window.removeEventListener('resize', resizeObserver.handleResize)

      if (resizeObserver.isMobile) {
        window.removeEventListener('orientationchange', resizeObserver.handleOrientationChange)
      }

      resizeObserver = null
    }

    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer)
      resizeDebounceTimer = null
    }
  }

  /* --------------------------------------------------
   *  Public API
   * ------------------------------------------------*/
  const particlesGL = function (
    userOptions: ParticlesGLOptions = {}
  ): ParticlesGLController | null {
    const defaults: ResolvedParticlesGLOptions = {
      target: '.particlesGL',
      interactionTarget: null,
      character: '•',
      particleSize: 0.015,
      particleSpacing: 0.002,
      particleColor: 'sample',
      sampling: 4,
      tilt: false,
      tiltFactor: 0.2,
      tiltSpeed: 0.05,
      displaceStrength: 0.6,
      displaceRadius: 0.1,
      velocityInfluence: 0.3,
      returnSpeed: 0.05,
      fontSize: 48,
      fontFamily: 'monospace',
      videoUpdateRate: 100,
      modelScale: 1,
      geometry: null,
      on: {},
    }

    const options: ResolvedParticlesGLOptions = {
      ...defaults,
      ...userOptions,
      on: { ...defaults.on, ...userOptions.on },
    }

    const elements = document.querySelectorAll<ParticleTargetElement>(options.target)
    if (elements.length === 0) {
      console.error(`particlesGL: No elements found with selector "${options.target}"`)
      return null
    }

    const instance = new ParticlesGLInstance(options, Array.from(elements))

    void instance.init()

    return {
      init: () => instance.init(),
      cleanup: () => {
        instance.cleanup()
      },
      updateOptions: (newOptions: ParticlesGLOptions) => {
        instance.updateOptions(newOptions)
      },
      options: instance.options,
    }
  }

  return particlesGL
})()

export default particlesGL
