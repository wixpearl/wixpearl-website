import * as THREE from 'three'

import { particleFieldConfig } from './particle-config'
import { pulseStrength } from './particle-interaction'
import { sampleIdleAnchor } from './particle-state'

import type { ParticleInput, ParticleRenderer } from './types'

export function createWebGLParticleField(
  canvas: HTMLCanvasElement,
  capacity: number
): ParticleRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(capacity * 3)
  const anchors = new Float32Array(capacity * 3)
  const seeds = new Float32Array(capacity * 4)
  const clusters = new Float32Array(capacity)

  for (let index = 0; index < capacity; index += 1) {
    const anchor = sampleIdleAnchor(index)
    const offset = index * 3
    const seedOffset = index * 4
    anchors[offset] = anchor.x
    anchors[offset + 1] = anchor.y
    anchors[offset + 2] = anchor.z
    seeds[seedOffset] = anchor.seed
    seeds[seedOffset + 1] = ((index * 73) % 997) / 997
    seeds[seedOffset + 2] = ((index * 193) % 991) / 991
    seeds[seedOffset + 3] = ((index * 389) % 983) / 983
    clusters[index] = anchor.cluster
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aAnchor', new THREE.BufferAttribute(anchors, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  geometry.setAttribute('aCluster', new THREE.BufferAttribute(clusters, 1))
  geometry.setDrawRange(0, capacity)

  const uniforms = {
    uTime: { value: 0 },
    uAspect: { value: 1 },
    uPointScale: { value: 1 },
    uPointer: { value: new THREE.Vector4(0, 0, 0, 0) },
    uPulse: { value: new THREE.Vector4(0, 0, 0, 0) },
    uEntropy: { value: 0 },
    uScrollVelocity: { value: 0 },
    uBlue: { value: new THREE.Color(particleFieldConfig.colors.blue) },
    uAqua: { value: new THREE.Color(particleFieldConfig.colors.aqua) },
    uPearl: { value: new THREE.Color(particleFieldConfig.colors.pearl) },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 aAnchor;
      attribute vec4 aSeed;
      attribute float aCluster;
      uniform float uTime;
      uniform float uAspect;
      uniform float uPointScale;
      uniform vec4 uPointer;
      uniform vec4 uPulse;
      uniform float uEntropy;
      uniform float uScrollVelocity;
      uniform vec3 uBlue;
      uniform vec3 uAqua;
      uniform vec3 uPearl;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec3 world = vec3(aAnchor.x * uAspect, aAnchor.y, aAnchor.z);
        vec2 idle = vec2(
          sin(uTime * 0.085 + aSeed.x * 12.0),
          cos(uTime * 0.071 + aSeed.y * 11.0)
        ) * ${particleFieldConfig.idleDrift.toFixed(4)};
        world.xy += idle;

        vec2 pointerOffset = world.xy - uPointer.xy;
        float pointerDistance = max(length(pointerOffset), 0.001);
        float pointerReach = ${particleFieldConfig.pointerRadius.toFixed(2)} * (0.72 + uAspect * 0.18);
        float wake = max(0.0, 1.0 - pointerDistance / pointerReach) * uEntropy;
        vec2 direction = pointerOffset / pointerDistance;
        vec2 tangent = vec2(-direction.y, direction.x);
        float curl = sin(uTime * (0.75 + uEntropy) + aSeed.z * 24.0 + pointerDistance * 5.0);
        world.xy += direction * wake * (0.08 + uPointer.w * 0.035);
        world.xy += tangent * wake * curl * ${particleFieldConfig.wakeStrength.toFixed(2)} * 0.14;
        world.y += uScrollVelocity * (aSeed.w - 0.5) * 0.018;

        vec2 pulseOffset = world.xy - uPulse.xy;
        float pulseDistance = max(length(pulseOffset), 0.001);
        float pulseInfluence = max(0.0, 1.0 - pulseDistance / 1.65) * uPulse.z;
        world.xy += pulseOffset / pulseDistance * pulseInfluence * 0.34;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
        float core = smoothstep(0.972, 1.0, aSeed.w);
        gl_PointSize = (1.5 + aSeed.z * 2.3 + core * 2.8 + wake * 0.9) * uPointScale;
        float colorMix = clamp(aCluster / 4.0 + aSeed.y * 0.28 + wake * 0.12, 0.0, 1.0);
        vColor = mix(mix(uBlue, uAqua, colorMix), uPearl, core);
        vAlpha = mix(0.16, 0.68, core) * (0.72 + aSeed.x * 0.28);
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vec2 offset = gl_PointCoord - 0.5;
        float alpha = smoothstep(0.5, 0.08, length(offset)) * vAlpha;
        if (alpha < 0.015) discard;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
  })

  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  scene.add(points)

  return {
    backend: 'webgl2',
    capacity,
    resize(width, height, dpr) {
      const aspect = width / Math.max(height, 1)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      camera.left = -aspect
      camera.right = aspect
      camera.top = 1
      camera.bottom = -1
      camera.updateProjectionMatrix()
      uniforms.uAspect.value = aspect
      uniforms.uPointScale.value = dpr
    },
    render(_deltaSeconds, elapsedSeconds, input: ParticleInput) {
      uniforms.uTime.value = elapsedSeconds
      uniforms.uPointer.value.set(input.x, input.y, input.active ? 1 : 0, input.speed)
      uniforms.uPulse.value.set(
        input.pulseX,
        input.pulseY,
        pulseStrength(input.pulseAge),
        input.pulseAge
      )
      uniforms.uEntropy.value = input.entropy
      uniforms.uScrollVelocity.value = input.scrollVelocity
      renderer.render(scene, camera)
    },
    setActiveCount(count) {
      geometry.setDrawRange(0, Math.min(capacity, Math.max(0, count)))
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
