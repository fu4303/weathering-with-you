import { Ref } from 'vue'
import { useContext2D } from '~/logics/useCanvas'
import { ease, randomInt, between, degToRad } from '~/logics/util'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const GRAVITY = 0.5
const INITIAL_VELOCITY = -1

interface RippleOptions {
  count: number
  thickness: number
  color: string
  rotation: number
  fadeDuration: [number, number]
  rippleDuration: [number, number]
  rippleSize: [number, number]
}

interface Ripple {
  maxSize: number
  duration: number
  fadeDuration: number
  start: number
  fadeStart: number
  initialAlpha: number
  alpha: number
  width: number
  height: number
  x: number
  y: number
  distance: number
  decay: number
  rotation: number
  dropYV: number[]
  dropY: number[]
  dropX: number[]
  dropSize: number[]
  dropAlpha: number[]
  dropFadeStart: number[]
}

const DEFAULT_OPTIONS: RippleOptions = {
  count: 35,
  thickness: 3,
  color: '#479DA8',
  rotation: 8,
  fadeDuration: [1500, 200],
  rippleDuration: [4000, 5000],
  rippleSize: [150, 350],
}

export function createRipples(canvas: HTMLCanvasElement, options: RippleOptions = DEFAULT_OPTIONS) {
  const ripples: Ripple[] = []

  const initRipples = async() => {
    for (let i = 0; i < options.count; ++i) {
      const ripple: Partial<Ripple> = {}
      resetRipple(ripple)
      await sleep(options.rippleDuration[1] / options.count)
      // @ts-ignore
      ripples.push(ripple)
    }
  }

  const resetRipple = (ripple: Partial<Ripple>) => {
    ripple.y = randomInt(0, height.value)
    ripple.x = randomInt(-50, width.value + 50)

    ripple.distance = ripple.y / height.value

    ripple.maxSize = randomInt(options.rippleSize[0], options.rippleSize[1]) * ripple.distance
    ripple.initialAlpha = between(0.3, 0.8) * ripple.distance
    ripple.alpha = 0
    ripple.decay = 0
    ripple.duration = randomInt(options.rippleDuration[0], options.rippleDuration[1])
    ripple.fadeDuration = randomInt(options.fadeDuration[0], options.fadeDuration[1])
    ripple.start = Date.now()
    ripple.fadeStart = 0
    ripple.width = 0
    ripple.height = 0
    ripple.rotation = degToRad(between(0, 360))
    const drops = randomInt(3, 5)

    ripple.dropYV = Array(drops).fill(0).map(() => between(-3, -4))
    ripple.dropY = Array(drops).fill(ripple.y)
    ripple.dropX = Array(drops).fill(0).map(() => between(-3, 3))
    ripple.dropSize = Array(drops).fill(0).map(() => between(1, 3))
    ripple.dropAlpha = Array(drops).fill(0)
    ripple.dropFadeStart = Array(drops).fill(null)
  }

  const { resume, width, height } = useContext2D(canvas, {
    render(ctx) {
      ctx.clearRect(0, 0, width.value, height.value)
      ctx.save()
      ctx.strokeStyle = options.color
      ctx.fillStyle = options.color
      ctx.lineWidth = options.thickness
      // @ts-ignore
      ctx.compositeOperation = 'lighter'

      // Render Ripples
      for (let i = 0; i < ripples.length; ++i) {
        const ripple = ripples[i]

        const childRippleWidth = Math.max(0, ripple.width - 50)
        const childRippleHeight = Math.max(0, ripple.height * ripple.distance - (50 / options.rotation))

        ctx.shadowBlur = 10
        ctx.shadowColor = options.color

        /**
         * Would like to generate splash effect here eventually
         */
        ripple.dropY.forEach((y, i) => {
          if (y > ripple.y)
            return

          ctx.globalAlpha = ripple.initialAlpha - ripple.dropAlpha[i]
          ctx.beginPath()
          ctx.ellipse(ripple.x + ripple.dropX[i], y, ripple.dropSize[i], ripple.dropSize[i], Math.PI / 2, 0, 2 * Math.PI)
          ctx.fill()
          ctx.closePath()
        })

        ctx.globalAlpha = ripple.initialAlpha - ripple.alpha

        ctx.beginPath()
        ctx.ellipse(
          ripple.x,
          ripple.y,
          Math.abs(ripple.height * ripple.distance),
          Math.abs(ripple.width),
          Math.PI / 2,
          Math.max(0, degToRad(0 + ripple.decay * 100) + ripple.rotation),
          Math.PI * (1 - ripple.decay / 2) + ripple.rotation)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.ellipse(
          ripple.x, // X
          ripple.y, // Y
          Math.abs(ripple.height * ripple.distance), // Width
          Math.abs(ripple.width), // Height
          Math.PI / 2, // Rotation
          Math.max(0, degToRad(180 + ripple.decay * 100)) + ripple.rotation, // Start Angle
          2 * Math.PI * (1 - ripple.decay / 2) + ripple.rotation) // End Angle
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.ellipse(ripple.x, ripple.y, Math.abs(childRippleHeight), Math.abs(childRippleWidth), Math.PI / 2, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.ellipse(ripple.x, ripple.y, Math.abs(childRippleHeight), Math.abs(childRippleWidth), Math.PI / 2, 0, 2 * Math.PI)
        ctx.closePath()
      }

      ctx.restore()
    },
    tick(dt) {
      for (let i = ripples.length - 1; i >= 0; --i) {
        const ripple = ripples[i]
        const now = Date.now()
        const p = (now - ripple.start) / ripple.duration

        if (now - ripple.start > ripple.duration) {
          if (ripple.fadeStart === 0)
            ripple.fadeStart = Date.now()

          const x = (now - ripple.fadeStart) / (ripple.fadeDuration)
          const y = (now - ripple.fadeStart) / (ripple.fadeDuration * 2.75)
          ripple.alpha = ripple.initialAlpha * x
          ripple.decay = ripple.initialAlpha * y
        }

        if (now - ripple.start >= ripple.duration) {
          if (now - ripple.fadeStart >= ripple.fadeDuration) resetRipple(ripple)
        }
        else {
          ripple.width = ripple.maxSize * ease(p)
          ripple.height = (ripple.maxSize / options.rotation) * ease(p)
          ripple.dropYV = ripple.dropYV.map(y => y += GRAVITY * p)
          ripple.dropY = ripple.dropY.map((y, i) => y += ripple.dropYV[i])

          ripple.dropAlpha = ripple.dropAlpha.map((a, i) => {
            if (ripple.dropYV[i] > 0) {
              if (ripple.dropFadeStart[i] === null)
                ripple.dropFadeStart[i] = Date.now()

              const x = (now - ripple.dropFadeStart[i]) / (1000)
              return Math.min(1, ripple.initialAlpha * ease(x))
            }

            return a
          })
        }
      }
    },
  })

  initRipples()
  resume()
}
