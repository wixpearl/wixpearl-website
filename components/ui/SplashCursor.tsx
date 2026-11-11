'use client'
import { useEffect, useRef } from 'react'

interface SplashCursorProps {
  simResolution?: number
  dyeResolution?: number
  captureResolution?: number
  densityDissipation?: number
  velocityDissipation?: number
  pressure?: number
  pressureIterations?: number
  curl?: number
  splatRadius?: number
  splatForce?: number
  shading?: boolean
  colorUpdateSpeed?: number
  backColor?: { r: number; g: number; b: number }
  transparent?: boolean
  rainbowMode?: boolean
  color?: string
}

interface Color {
  r: number
  g: number
  b: number
}

interface Pointer {
  id: number
  texcoordX: number
  texcoordY: number
  prevTexcoordX: number
  prevTexcoordY: number
  deltaX: number
  deltaY: number
  down: boolean
  moved: boolean
  color: Color
}

interface Config {
  SIM_RESOLUTION: number
  DYE_RESOLUTION: number
  CAPTURE_RESOLUTION: number
  DENSITY_DISSIPATION: number
  VELOCITY_DISSIPATION: number
  PRESSURE: number
  PRESSURE_ITERATIONS: number
  CURL: number
  SPLAT_RADIUS: number
  SPLAT_FORCE: number
  SHADING: boolean
  COLOR_UPDATE_SPEED: number
  PAUSED: boolean
  BACK_COLOR: Color
  TRANSPARENT: boolean
  RAINBOW_MODE: boolean
  COLOR: string
}

interface FBO {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  attach: (id: number) => number
}

interface DoubleFBO {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: FBO
  write: FBO
  swap: () => void
}

interface Format {
  internalFormat: number
  format: number
}

interface Ext {
  formatRGBA: Format | null
  formatRG: Format | null
  formatR: Format | null
  halfFloatTexType: number
  supportLinearFiltering: unknown
}

type Uniforms = Record<string, WebGLUniformLocation | null | undefined>

interface GLContext {
  gl: WebGL2RenderingContext | WebGLRenderingContext
  ext: Ext
}

function createPointer(): Pointer {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  }
}

function SplashCursor({
  simResolution: SIM_RESOLUTION = 128,
  dyeResolution: DYE_RESOLUTION = 1440,
  captureResolution: CAPTURE_RESOLUTION = 512,
  densityDissipation: DENSITY_DISSIPATION = 3.5,
  velocityDissipation: VELOCITY_DISSIPATION = 2,
  pressure: PRESSURE = 0.1,
  pressureIterations: PRESSURE_ITERATIONS = 20,
  curl: CURL = 3,
  splatRadius: SPLAT_RADIUS = 0.2,
  splatForce: SPLAT_FORCE = 6000,
  shading: SHADING = true,
  colorUpdateSpeed: COLOR_UPDATE_SPEED = 10,
  backColor: BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  transparent: TRANSPARENT = true,
  rainbowMode: RAINBOW_MODE = true,
  color: COLOR = '#ff0000',
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const canvasOrNull = canvasRef.current
    if (!canvasOrNull) return
    const canvas: HTMLCanvasElement = canvasOrNull

    let isActive = true

    const config: Config = {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      PAUSED: false,
      BACK_COLOR,
      TRANSPARENT,
      RAINBOW_MODE,
      COLOR,
    }

    const pointer: Pointer = createPointer()
    const pointers: Pointer[] = [pointer]

    const { gl, ext } = getWebGLContext(canvas)
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256
      config.SHADING = false
    }

    function getWebGLContext(canvasEl: HTMLCanvasElement): GLContext {
      const params: WebGLContextAttributes = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      }

      let glCtx: WebGL2RenderingContext | WebGLRenderingContext | null = canvasEl.getContext(
        'webgl2',
        params
      )

      const isWebGL2 = glCtx !== null

      if (!isWebGL2) {
        glCtx =
          canvasEl.getContext('webgl', params) ||
          (canvasEl.getContext('experimental-webgl', params) as WebGLRenderingContext | null)
      }

      if (!glCtx) throw new Error('WebGL not supported')

      const context: WebGL2RenderingContext | WebGLRenderingContext = glCtx

      let halfFloat: OES_texture_half_float | null = null
      let supportLinearFiltering: unknown = null

      if (isWebGL2) {
        const gl2 = context as WebGL2RenderingContext
        gl2.getExtension('EXT_color_buffer_float')
        supportLinearFiltering = gl2.getExtension('OES_texture_float_linear')
      } else {
        halfFloat = context.getExtension('OES_texture_half_float')
        supportLinearFiltering = context.getExtension('OES_texture_half_float_linear')
      }

      context.clearColor(0.0, 0.0, 0.0, 1.0)

      const halfFloatTexType = isWebGL2
        ? (context as WebGL2RenderingContext).HALF_FLOAT
        : halfFloat
          ? halfFloat.HALF_FLOAT_OES
          : context.FLOAT

      let formatRGBA: Format | null
      let formatRG: Format | null
      let formatR: Format | null

      if (isWebGL2) {
        const gl2 = context as WebGL2RenderingContext
        formatRGBA = getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType)
        formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType)
      } else {
        formatRGBA = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
        formatR = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
      }

      return {
        gl: context,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering,
        },
      }
    }

    function getSupportedFormat(
      glCtx: WebGL2RenderingContext | WebGLRenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ): Format | null {
      if (!supportRenderTextureFormat(glCtx, internalFormat, format, type)) {
        const gl2 = glCtx as WebGL2RenderingContext
        switch (internalFormat) {
          case gl2.R16F:
            return getSupportedFormat(glCtx, gl2.RG16F, gl2.RG, type)
          case gl2.RG16F:
            return getSupportedFormat(glCtx, gl2.RGBA16F, gl2.RGBA, type)
          default:
            return null
        }
      }
      return { internalFormat, format }
    }

    function supportRenderTextureFormat(
      glCtx: WebGL2RenderingContext | WebGLRenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ): boolean {
      const texture = glCtx.createTexture()
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture)
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST)
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST)
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE)
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE)
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)
      const fbo = glCtx.createFramebuffer()
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo)
      glCtx.framebufferTexture2D(
        glCtx.FRAMEBUFFER,
        glCtx.COLOR_ATTACHMENT0,
        glCtx.TEXTURE_2D,
        texture,
        0
      )
      const status = glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER)
      return status === glCtx.FRAMEBUFFER_COMPLETE
    }

    class Material {
      vertexShader: WebGLShader
      fragmentShaderSource: string
      programs: Array<WebGLProgram | undefined>
      activeProgram: WebGLProgram | null
      uniforms: Uniforms

      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader
        this.fragmentShaderSource = fragmentShaderSource
        this.programs = []
        this.activeProgram = null
        this.uniforms = {}
      }

      setKeywords(keywords: string[]): void {
        let hash = 0
        for (let i = 0; i < keywords.length; i++) {
          // FIX 4: guard keyword access
          const kw = keywords[i]
          if (kw !== undefined) hash += hashCode(kw)
        }
        let program = this.programs[hash]
        if (program == null) {
          const fragmentShader = compileShader(
            gl.FRAGMENT_SHADER,
            this.fragmentShaderSource,
            keywords
          )
          if (!fragmentShader) return
          program = createProgram(this.vertexShader, fragmentShader)
          this.programs[hash] = program
        }
        if (program === this.activeProgram) return
        this.uniforms = getUniforms(program)
        this.activeProgram = program
      }

      bind(): void {
        if (this.activeProgram) gl.useProgram(this.activeProgram)
      }
    }

    class Program {
      uniforms: Uniforms
      program: WebGLProgram

      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.uniforms = {}
        this.program = createProgram(vertexShader, fragmentShader)
        this.uniforms = getUniforms(this.program)
      }

      bind(): void {
        gl.useProgram(this.program)
      }
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
      const program = gl.createProgram()
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        console.trace(gl.getProgramInfoLog(program))
      return program
    }

    function getUniforms(program: WebGLProgram): Uniforms {
      const uniforms: Uniforms = {}
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
      for (let i = 0; i < uniformCount; i++) {
        const uniformInfo = gl.getActiveUniform(program, i)
        if (!uniformInfo) continue
        const uniformName = uniformInfo.name
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName)
      }
      return uniforms
    }

    function compileShader(
      type: number,
      source: string,
      keywords?: string[] | null
    ): WebGLShader | null {
      const finalSource = addKeywords(source, keywords)
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, finalSource)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        console.trace(gl.getShaderInfoLog(shader))
      return shader
    }

    function addKeywords(source: string, keywords?: string[] | null): string {
      if (!keywords) return source
      let keywordsString = ''
      keywords.forEach((keyword) => {
        keywordsString += '#define ' + keyword + '\n'
      })
      return keywordsString + source
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
    )
    if (!baseVertexShader) throw new Error('Failed to compile base vertex shader')

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `
    )
    if (!copyShader) throw new Error('Failed to compile copy shader')

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `
    )
    if (!clearShader) throw new Error('Failed to compile clear shader')

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
          color = max(color, vec3(0));
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
              vec3 lc = texture2D(uTexture, vL).rgb;
              vec3 rc = texture2D(uTexture, vR).rgb;
              vec3 tc = texture2D(uTexture, vT).rgb;
              vec3 bc = texture2D(uTexture, vB).rgb;

              float dx = length(rc) - length(lc);
              float dy = length(tc) - length(bc);

              vec3 n = normalize(vec3(dx, dy, length(texelSize)));
              vec3 l = vec3(0.0, 0.0, 1.0);

              float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
              c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `
    )
    if (!splatShader) throw new Error('Failed to compile splat shader')

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
      ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
    )
    if (!advectionShader) throw new Error('Failed to compile advection shader')

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `
    )
    if (!divergenceShader) throw new Error('Failed to compile divergence shader')

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `
    )
    if (!curlShader) throw new Error('Failed to compile curl shader')

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    )
    if (!vorticityShader) throw new Error('Failed to compile vorticity shader')

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `
    )
    if (!pressureShader) throw new Error('Failed to compile pressure shader')

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    )
    if (!gradientSubtractShader) throw new Error('Failed to compile gradient subtract shader')

    const blit = (() => {
      const arrayBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
      const elementBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)
      return (target: FBO | null, clear = false): void => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
          gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        } else {
          gl.viewport(0, 0, target.width, target.height)
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
        }
        if (clear) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0)
          gl.clear(gl.COLOR_BUFFER_BIT)
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    })()

    let dye: DoubleFBO | null = null
    let velocity: DoubleFBO | null = null
    let divergence: FBO | null = null
    let curl: FBO | null = null
    let pressure: DoubleFBO | null = null

    const copyProgram = new Program(baseVertexShader, copyShader)
    const clearProgram = new Program(baseVertexShader, clearShader)
    const splatProgram = new Program(baseVertexShader, splatShader)
    const advectionProgram = new Program(baseVertexShader, advectionShader)
    const divergenceProgram = new Program(baseVertexShader, divergenceShader)
    const curlProgram = new Program(baseVertexShader, curlShader)
    const vorticityProgram = new Program(baseVertexShader, vorticityShader)
    const pressureProgram = new Program(baseVertexShader, pressureShader)
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader)
    const displayMaterial = new Material(baseVertexShader, displayShaderSource)

    function initFramebuffers(): void {
      const simRes = getResolution(config.SIM_RESOLUTION)
      const dyeRes = getResolution(config.DYE_RESOLUTION)
      const texType = ext.halfFloatTexType
      const rgba = ext.formatRGBA
      const rg = ext.formatRG
      const r = ext.formatR
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST
      gl.disable(gl.BLEND)

      if (!rgba || !rg || !r) return

      if (!dye)
        dye = createDoubleFBO(
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        )
      else
        dye = resizeDoubleFBO(
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        )

      if (!velocity)
        velocity = createDoubleFBO(
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        )
      else
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        )

      divergence = createFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      )
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST)
      pressure = createDoubleFBO(
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      )
    }

    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      gl.activeTexture(gl.TEXTURE0)
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      gl.viewport(0, 0, w, h)
      gl.clear(gl.COLOR_BUFFER_BIT)

      const texelSizeX = 1.0 / w
      const texelSizeY = 1.0 / h
      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX,
        texelSizeY,
        attach(id: number): number {
          gl.activeTexture(gl.TEXTURE0 + id)
          gl.bindTexture(gl.TEXTURE_2D, texture)
          return id
        },
      }
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param)
      let fbo2 = createFBO(w, h, internalFormat, format, type, param)
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read(): FBO {
          return fbo1
        },
        set read(value: FBO) {
          fbo1 = value
        },
        get write(): FBO {
          return fbo2
        },
        set write(value: FBO) {
          fbo2 = value
        },
        swap(): void {
          const temp = fbo1
          fbo1 = fbo2
          fbo2 = temp
        },
      }
    }

    function resizeFBO(
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      const newFBO = createFBO(w, h, internalFormat, format, type, param)
      copyProgram.bind()
      gl.uniform1i(copyProgram.uniforms.uTexture ?? null, target.attach(0))
      blit(newFBO)
      return newFBO
    }

    function resizeDoubleFBO(
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      if (target.width === w && target.height === h) return target
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param)
      target.write = createFBO(w, h, internalFormat, format, type, param)
      target.width = w
      target.height = h
      target.texelSizeX = 1.0 / w
      target.texelSizeY = 1.0 / h
      return target
    }

    function updateKeywords(): void {
      const displayKeywords: string[] = []
      if (config.SHADING) displayKeywords.push('SHADING')
      displayMaterial.setKeywords(displayKeywords)
    }

    updateKeywords()
    initFramebuffers()
    let lastUpdateTime = Date.now()
    let colorUpdateTimer = 0.0

    function updateFrame(): void {
      if (!isActive) return
      const dt = calcDeltaTime()
      if (resizeCanvas()) initFramebuffers()
      updateColors(dt)
      applyInputs()
      step(dt)
      render(null)
      animationFrameId.current = requestAnimationFrame(updateFrame)
    }

    function calcDeltaTime(): number {
      const now = Date.now()
      let dt = (now - lastUpdateTime) / 1000
      dt = Math.min(dt, 0.016666)
      lastUpdateTime = now
      return dt
    }

    function resizeCanvas(): boolean {
      const width = scaleByPixelRatio(canvas.clientWidth)
      const height = scaleByPixelRatio(canvas.clientHeight)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        return true
      }
      return false
    }

    function updateColors(dt: number): void {
      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
      if (colorUpdateTimer >= 1) {
        colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
        pointers.forEach((p) => {
          p.color = generateColor()
        })
      }
    }

    function applyInputs(): void {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false
          splatPointer(p)
        }
      })
    }

    function step(dt: number): void {
      if (!velocity || !dye || !curl || !divergence || !pressure) return

      gl.disable(gl.BLEND)
      curlProgram.bind()
      gl.uniform2f(curlProgram.uniforms.texelSize ?? null, velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(curlProgram.uniforms.uVelocity ?? null, velocity.read.attach(0))
      blit(curl)

      vorticityProgram.bind()
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      )
      gl.uniform1i(vorticityProgram.uniforms.uVelocity ?? null, velocity.read.attach(0))
      gl.uniform1i(vorticityProgram.uniforms.uCurl ?? null, curl.attach(1))
      gl.uniform1f(vorticityProgram.uniforms.curl ?? null, config.CURL)
      gl.uniform1f(vorticityProgram.uniforms.dt ?? null, dt)
      blit(velocity.write)
      velocity.swap()

      divergenceProgram.bind()
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      )
      gl.uniform1i(divergenceProgram.uniforms.uVelocity ?? null, velocity.read.attach(0))
      blit(divergence)

      clearProgram.bind()
      gl.uniform1i(clearProgram.uniforms.uTexture ?? null, pressure.read.attach(0))
      gl.uniform1f(clearProgram.uniforms.value ?? null, config.PRESSURE)
      blit(pressure.write)
      pressure.swap()

      pressureProgram.bind()
      gl.uniform2f(
        pressureProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      )
      gl.uniform1i(pressureProgram.uniforms.uDivergence ?? null, divergence.attach(0))
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure ?? null, pressure.read.attach(1))
        blit(pressure.write)
        pressure.swap()
      }

      gradienSubtractProgram.bind()
      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      )
      gl.uniform1i(gradienSubtractProgram.uniforms.uPressure ?? null, pressure.read.attach(0))
      gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity ?? null, velocity.read.attach(1))
      blit(velocity.write)
      velocity.swap()

      advectionProgram.bind()
      gl.uniform2f(
        advectionProgram.uniforms.texelSize ?? null,
        velocity.texelSizeX,
        velocity.texelSizeY
      )
      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize ?? null,
          velocity.texelSizeX,
          velocity.texelSizeY
        )
      const velocityId = velocity.read.attach(0)
      gl.uniform1i(advectionProgram.uniforms.uVelocity ?? null, velocityId)
      gl.uniform1i(advectionProgram.uniforms.uSource ?? null, velocityId)
      gl.uniform1f(advectionProgram.uniforms.dt ?? null, dt)
      gl.uniform1f(advectionProgram.uniforms.dissipation ?? null, config.VELOCITY_DISSIPATION)
      blit(velocity.write)
      velocity.swap()

      if (!ext.supportLinearFiltering)
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize ?? null, dye.texelSizeX, dye.texelSizeY)
      gl.uniform1i(advectionProgram.uniforms.uVelocity ?? null, velocity.read.attach(0))
      gl.uniform1i(advectionProgram.uniforms.uSource ?? null, dye.read.attach(1))
      gl.uniform1f(advectionProgram.uniforms.dissipation ?? null, config.DENSITY_DISSIPATION)
      blit(dye.write)
      dye.swap()
    }

    function render(target: FBO | null): void {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.enable(gl.BLEND)
      drawDisplay(target)
    }

    function drawDisplay(target: FBO | null): void {
      const width = target == null ? gl.drawingBufferWidth : target.width
      const height = target == null ? gl.drawingBufferHeight : target.height
      displayMaterial.bind()
      if (config.SHADING)
        gl.uniform2f(displayMaterial.uniforms.texelSize ?? null, 1.0 / width, 1.0 / height)
      if (dye) gl.uniform1i(displayMaterial.uniforms.uTexture ?? null, dye.read.attach(0))
      blit(target)
    }

    function splatPointer(p: Pointer): void {
      const dx = p.deltaX * config.SPLAT_FORCE
      const dy = p.deltaY * config.SPLAT_FORCE
      splat(p.texcoordX, p.texcoordY, dx, dy, p.color)
    }

    function clickSplat(p: Pointer): void {
      const color = generateColor()
      color.r *= 10.0
      color.g *= 10.0
      color.b *= 10.0
      const dx = 10 * (Math.random() - 0.5)
      const dy = 30 * (Math.random() - 0.5)
      splat(p.texcoordX, p.texcoordY, dx, dy, color)
    }

    function splat(x: number, y: number, dx: number, dy: number, color: Color): void {
      if (!velocity || !dye) return

      splatProgram.bind()
      gl.uniform1i(splatProgram.uniforms.uTarget ?? null, velocity.read.attach(0))
      gl.uniform1f(splatProgram.uniforms.aspectRatio ?? null, canvas.width / canvas.height)
      gl.uniform2f(splatProgram.uniforms.point ?? null, x, y)
      gl.uniform3f(splatProgram.uniforms.color ?? null, dx, dy, 0.0)
      gl.uniform1f(splatProgram.uniforms.radius ?? null, correctRadius(config.SPLAT_RADIUS / 100.0))
      blit(velocity.write)
      velocity.swap()

      gl.uniform1i(splatProgram.uniforms.uTarget ?? null, dye.read.attach(0))
      gl.uniform3f(splatProgram.uniforms.color ?? null, color.r, color.g, color.b)
      blit(dye.write)
      dye.swap()
    }

    function correctRadius(radius: number): number {
      const aspectRatio = canvas.width / canvas.height
      if (aspectRatio > 1) radius *= aspectRatio
      return radius
    }

    function updatePointerDownData(p: Pointer, id: number, posX: number, posY: number): void {
      p.id = id
      p.down = true
      p.moved = false
      p.texcoordX = posX / canvas.width
      p.texcoordY = 1.0 - posY / canvas.height
      p.prevTexcoordX = p.texcoordX
      p.prevTexcoordY = p.texcoordY
      p.deltaX = 0
      p.deltaY = 0
      p.color = generateColor()
    }

    function updatePointerMoveData(p: Pointer, posX: number, posY: number, color: Color): void {
      p.prevTexcoordX = p.texcoordX
      p.prevTexcoordY = p.texcoordY
      p.texcoordX = posX / canvas.width
      p.texcoordY = 1.0 - posY / canvas.height
      p.deltaX = correctDeltaX(p.texcoordX - p.prevTexcoordX)
      p.deltaY = correctDeltaY(p.texcoordY - p.prevTexcoordY)
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0
      p.color = color
    }

    function updatePointerUpData(p: Pointer): void {
      p.down = false
    }

    function correctDeltaX(delta: number): number {
      const aspectRatio = canvas.width / canvas.height
      if (aspectRatio < 1) delta *= aspectRatio
      return delta
    }

    function correctDeltaY(delta: number): number {
      const aspectRatio = canvas.width / canvas.height
      if (aspectRatio > 1) delta /= aspectRatio
      return delta
    }

    function hexToRGB(hex: string): Color {
      let val = hex.replace('#', '')
      if (val.length === 3) {
        const c0 = val.charAt(0)
        const c1 = val.charAt(1)
        const c2 = val.charAt(2)
        val = c0 + c0 + c1 + c1 + c2 + c2
      }
      const r = parseInt(val.slice(0, 2), 16) / 255
      const g = parseInt(val.slice(2, 4), 16) / 255
      const b = parseInt(val.slice(4, 6), 16) / 255
      return { r: r * 0.15, g: g * 0.15, b: b * 0.15 }
    }

    function generateColor(): Color {
      if (!config.RAINBOW_MODE) {
        return hexToRGB(config.COLOR)
      }
      const c = HSVtoRGB(Math.random(), 1.0, 1.0)
      c.r *= 0.15
      c.g *= 0.15
      c.b *= 0.15
      return c
    }

    function HSVtoRGB(h: number, s: number, v: number): Color {
      const i = Math.floor(h * 6)
      const f = h * 6 - i
      const p = v * (1 - s)
      const q = v * (1 - f * s)
      const t = v * (1 - (1 - f) * s)
      let r: number
      let g: number
      let b: number
      switch (i % 6) {
        case 0:
          r = v
          g = t
          b = p
          break
        case 1:
          r = q
          g = v
          b = p
          break
        case 2:
          r = p
          g = v
          b = t
          break
        case 3:
          r = p
          g = q
          b = v
          break
        case 4:
          r = t
          g = p
          b = v
          break
        case 5:
          r = v
          g = p
          b = q
          break
        default:
          r = 0
          g = 0
          b = 0
      }
      return { r, g, b }
    }

    function wrap(value: number, min: number, max: number): number {
      const range = max - min
      if (range === 0) return min
      return ((value - min) % range) + min
    }

    function getResolution(resolution: number): { width: number; height: number } {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio
      const min = Math.round(resolution)
      const max = Math.round(resolution * aspectRatio)
      if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min }
      return { width: min, height: max }
    }

    function scaleByPixelRatio(input: number): number {
      const pixelRatio = window.devicePixelRatio || 1
      return Math.floor(input * pixelRatio)
    }

    function hashCode(s: string): number {
      if (s.length === 0) return 0
      let hash = 0
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i)
        hash |= 0
      }
      return hash
    }

    function handleMouseDown(e: MouseEvent): void {
      const posX = scaleByPixelRatio(e.clientX)
      const posY = scaleByPixelRatio(e.clientY)
      updatePointerDownData(pointer, -1, posX, posY)
      clickSplat(pointer)
    }

    let firstMouseMoveHandled = false
    function handleMouseMove(e: MouseEvent): void {
      const posX = scaleByPixelRatio(e.clientX)
      const posY = scaleByPixelRatio(e.clientY)
      if (!firstMouseMoveHandled) {
        const color = generateColor()
        updatePointerMoveData(pointer, posX, posY, color)
        firstMouseMoveHandled = true
      } else {
        updatePointerMoveData(pointer, posX, posY, pointer.color)
      }
    }

    function handleTouchStart(e: TouchEvent): void {
      const touches = e.targetTouches
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i]
        if (!touch) continue
        const posX = scaleByPixelRatio(touch.clientX)
        const posY = scaleByPixelRatio(touch.clientY)
        updatePointerDownData(pointer, touch.identifier, posX, posY)
      }
    }

    function handleTouchMove(e: TouchEvent): void {
      const touches = e.targetTouches
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i]
        if (!touch) continue
        const posX = scaleByPixelRatio(touch.clientX)
        const posY = scaleByPixelRatio(touch.clientY)
        updatePointerMoveData(pointer, posX, posY, pointer.color)
      }
    }

    function handleTouchEnd(e: TouchEvent): void {
      const touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        updatePointerUpData(pointer)
      }
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove, false)
    window.addEventListener('touchend', handleTouchEnd)

    updateFrame()

    return () => {
      isActive = false

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }

      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        id="fluid"
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
        }}
      />
    </div>
  )
}

export default SplashCursor
