// Three.js does not publish declarations in its runtime package. The particle
// subsystem keeps its public contracts typed and treats WebGPU/TSL as an
// external runtime boundary so the pinned renderer can evolve independently.
declare module 'three'
declare module 'three/webgpu'
declare module 'three/tsl'
