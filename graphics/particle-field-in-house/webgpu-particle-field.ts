/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import {
  Fn,
  If,
  color,
  cos,
  float,
  hash,
  instanceIndex,
  instancedArray,
  mix,
  sin,
  uint,
  uniform,
  uniformArray,
  vec3,
  vec4,
} from 'three/tsl'
import * as THREE from 'three/webgpu'

import { particleFieldConfig } from './particle-config'
import { pulseStrength } from './particle-interaction'

import type { ParticleInput, ParticleRenderer } from './types'

export async function createWebGPUParticleField(
  canvas: HTMLCanvasElement,
  capacity: number
): Promise<ParticleRenderer> {
  const renderer = new THREE.WebGPURenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)
  await renderer.init()

  if ((renderer.backend as { isWebGPUBackend?: boolean }).isWebGPUBackend !== true) {
    await renderer.dispose()
    throw new Error('WebGPU adapter unavailable')
  }

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1)
  const clusterValues = particleFieldConfig.clusters.map(
    (cluster) => new THREE.Vector4(...cluster.center, 0)
  )
  const clusterRadiiValues = particleFieldConfig.clusters.map(
    (cluster) => new THREE.Vector4(...cluster.radius, cluster.colorMix)
  )
  const clusterPositions = uniformArray(clusterValues, 'vec4')
  const clusterRadii = uniformArray(clusterRadiiValues, 'vec4')
  const delta = uniform(1 / 60)
  const time = uniform(0)
  const aspect = uniform(1)
  const pointer = uniform(new THREE.Vector4(0, 0, 0, 0))
  const pointerActive = uniform(0)
  const fieldEntropy = uniform(0)
  const pulse = uniform(new THREE.Vector4(0, 0, 0, 0))
  const scrollVelocity = uniform(0)
  const positionBuffer = instancedArray(capacity, 'vec3')
  const velocityBuffer = instancedArray(capacity, 'vec3')
  const anchorBuffer = instancedArray(capacity, 'vec3')
  const metadataBuffer = instancedArray(capacity, 'vec4')
  const entropyBuffer = instancedArray(capacity, 'float')

  const init = Fn(() => {
    const position = positionBuffer.element(instanceIndex)
    const velocity = velocityBuffer.element(instanceIndex)
    const anchor = anchorBuffer.element(instanceIndex)
    const metadata = metadataBuffer.element(instanceIndex)
    const particleEntropy = entropyBuffer.element(instanceIndex)
    const clusterIndex = instanceIndex.mod(uint(4)).toVar()
    const center = vec4(clusterPositions.element(clusterIndex))
    const radii = vec4(clusterRadii.element(clusterIndex))
    const randomA = hash(instanceIndex.mul(uint(1_664_525)).add(uint(101))).toVar()
    const randomB = hash(instanceIndex.mul(uint(22_695_477)).add(uint(307))).toVar()
    const randomC = hash(instanceIndex.mul(uint(1_103_515_245)).add(uint(911))).toVar()
    const randomD = hash(instanceIndex.mul(uint(747_796_405)).add(uint(1_541))).toVar()
    const angle = randomA.mul(Math.PI * 2)
    const radial = randomB.sqrt()
    const clusterPoint = vec3(
      center.x.add(cos(angle).mul(radii.x).mul(radial)),
      center.y.add(sin(angle).mul(radii.y).mul(radial)),
      randomC.sub(0.5).mul(0.12)
    )
    const dispersedPoint = vec3(randomC.mul(2).sub(1), randomD.mul(2).sub(1), clusterPoint.z)
    const idleAnchor = mix(clusterPoint, dispersedPoint, 0.56)

    anchor.assign(idleAnchor)
    position.assign(vec3(idleAnchor.x.mul(aspect), idleAnchor.y, idleAnchor.z))
    velocity.assign(vec3(0))
    metadata.assign(vec4(float(clusterIndex), randomA, randomB, randomD))
    particleEntropy.assign(0)
  })
  const initCompute = init().compute(capacity).setName('Initialize dispersed WixPearl field')

  const update = Fn(() => {
    const position = positionBuffer.element(instanceIndex)
    const velocity = velocityBuffer.element(instanceIndex)
    const anchor = anchorBuffer.element(instanceIndex)
    const metadata = metadataBuffer.element(instanceIndex)
    const particleEntropy = entropyBuffer.element(instanceIndex)
    const idleAnchor = vec3(anchor.x.mul(aspect), anchor.y, anchor.z).toVar()
    const displacement = position.sub(idleAnchor).toVar()

    particleEntropy.mulAssign(float(1).sub(delta.mul(particleFieldConfig.entropyDecayRate)).max(0))

    const pointerOffset = position.xy.sub(pointer.xy).toVar()
    const pointerDistance = pointerOffset.length().max(0.001).toVar()
    const pointerReach = float(particleFieldConfig.pointerRadius)
      .mul(float(0.72).add(aspect.mul(0.18)))
      .toVar()
    const pointerInfluence = float(1).sub(pointerDistance.div(pointerReach)).max(0).toVar()
    particleEntropy.assign(
      particleEntropy.max(pointerInfluence.mul(fieldEntropy).mul(pointerActive))
    )

    const returnStrength = float(particleFieldConfig.anchorReturn).mul(
      float(1).sub(particleEntropy.mul(0.72))
    )
    const force = displacement.negate().mul(returnStrength).toVar()
    const idleFlow = vec3(
      sin(time.mul(0.085).add(metadata.y.mul(12))),
      cos(time.mul(0.071).add(metadata.z.mul(11))),
      sin(time.mul(0.047).add(metadata.w.mul(9))).mul(0.25)
    )
    force.addAssign(idleFlow.mul(particleFieldConfig.idleDrift))

    const turbulentFlow = vec3(
      sin(position.y.mul(5).add(time.mul(1.4)).add(metadata.y.mul(17))),
      cos(position.x.mul(4).sub(time.mul(1.1)).add(metadata.z.mul(19))),
      sin(position.x.add(position.y).mul(3).add(metadata.w.mul(13))).mul(0.3)
    )
    force.addAssign(turbulentFlow.mul(particleEntropy).mul(particleFieldConfig.wakeStrength))

    const pointerDirection = pointerOffset.div(pointerDistance).toVar()
    force.xy.addAssign(
      pointerDirection
        .mul(pointerInfluence)
        .mul(pointerActive)
        .mul(float(particleFieldConfig.pointerForce).add(pointer.w.mul(0.22)))
    )
    force.xy.addAssign(
      vec3(pointerDirection.y.negate(), pointerDirection.x, 0)
        .xy.mul(pointerInfluence)
        .mul(particleEntropy)
        .mul(0.7)
    )
    force.y.addAssign(scrollVelocity.mul(metadata.w.sub(0.5)).mul(0.11))

    const pulseOffset = position.xy.sub(pulse.xy).toVar()
    const pulseDistance = pulseOffset.length().max(0.001).toVar()
    const pulseInfluence = float(1).sub(pulseDistance.div(1.65)).max(0).mul(pulse.z).toVar()
    force.xy.addAssign(pulseOffset.div(pulseDistance).mul(pulseInfluence).mul(1.35))

    velocity.addAssign(force.mul(delta))
    const damping = float(3.4).sub(particleEntropy.mul(1.8))
    velocity.mulAssign(float(1).sub(delta.mul(damping)).max(0))
    const speed = velocity.length().toVar()
    If(speed.greaterThan(1.8), () => {
      velocity.assign(velocity.normalize().mul(1.8))
    })
    position.addAssign(velocity.mul(delta))

    const limitX = aspect.mul(1 + particleFieldConfig.overscan)
    const limitY = float(1 + particleFieldConfig.overscan)
    If(position.x.abs().greaterThan(limitX).or(position.y.abs().greaterThan(limitY)), () => {
      position.assign(idleAnchor)
      velocity.assign(vec3(0))
      particleEntropy.assign(0)
    })
  })
  const updateCompute = update().compute(capacity).setName('Settle WixPearl entropy field')
  await renderer.computeAsync(initCompute)

  const material = new THREE.SpriteNodeMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    transparent: true,
  })
  material.positionNode = positionBuffer.toAttribute()
  const metadataAttribute = metadataBuffer.toAttribute()
  const velocityAttribute = velocityBuffer.toAttribute()
  const entropyAttribute = entropyBuffer.toAttribute()
  const blue = uniform(color(particleFieldConfig.colors.blue))
  const aqua = uniform(color(particleFieldConfig.colors.aqua))
  const pearl = uniform(color(particleFieldConfig.colors.pearl))
  material.colorNode = Fn(() => {
    const centerMix = metadataAttribute.y.mul(0.34).add(metadataAttribute.x.div(5)).clamp(0, 1)
    const energy = velocityAttribute.length().div(1.8).add(entropyAttribute.mul(0.2)).clamp(0, 1)
    const core = metadataAttribute.w.smoothstep(0.972, 1)
    const fieldColor = mix(blue, aqua, centerMix.add(energy.mul(0.14)).clamp(0, 1))
    return vec4(mix(fieldColor, pearl, core), float(0.2).add(core.mul(0.58)))
  })()
  material.scaleNode = float(0.011)
    .add(metadataAttribute.z.mul(0.011))
    .add(metadataAttribute.w.smoothstep(0.972, 1).mul(0.022))
    .add(entropyAttribute.mul(0.003))

  const geometry = new THREE.PlaneGeometry(1, 1)
  const mesh = new THREE.InstancedMesh(geometry, material, capacity)
  mesh.frustumCulled = false
  scene.add(mesh)

  return {
    backend: 'webgpu',
    capacity,
    resize(width, height, dpr) {
      const nextAspect = width / Math.max(height, 1)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      camera.left = -nextAspect
      camera.right = nextAspect
      camera.top = 1
      camera.bottom = -1
      camera.updateProjectionMatrix()
      aspect.value = nextAspect
    },
    render(deltaSeconds, elapsedSeconds, input: ParticleInput) {
      delta.value = deltaSeconds
      time.value = elapsedSeconds
      pointer.value.set(input.x, input.y, input.entropy, input.speed)
      pointerActive.value = input.active ? 1 : 0
      fieldEntropy.value = input.entropy
      pulse.value.set(input.pulseX, input.pulseY, pulseStrength(input.pulseAge), input.pulseAge)
      scrollVelocity.value = input.scrollVelocity
      renderer.compute(updateCompute)
      renderer.render(scene, camera)
    },
    setActiveCount(count) {
      const activeCount = Math.min(capacity, Math.max(0, count))
      mesh.count = activeCount
      updateCompute.count = activeCount
    },
    dispose() {
      renderer.setAnimationLoop(null)
      geometry.dispose()
      material.dispose()
      positionBuffer.value.dispose()
      velocityBuffer.value.dispose()
      anchorBuffer.value.dispose()
      metadataBuffer.value.dispose()
      entropyBuffer.value.dispose()
      void renderer.dispose()
    },
  }
}
