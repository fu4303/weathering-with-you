import { Ref } from 'vue'
import { useContext2D } from '~/logics/ctx'
import { ease, randomInt, between } from '~/logics/util'

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
}

const DEFAULT_OPTIONS: RippleOptions = {
  count: 25,
  thickness: 2,
  color: 'white',
  rotation: 8,
  fadeDuration: [300, 350],
  rippleDuration: [1000, 3500],
  rippleSize: [50, 250],
}

export function createRipples(canvas: Ref<HTMLCanvasElement>, options: RippleOptions = DEFAULT_OPTIONS) {
  const ripples: Ripple[] = []

  const initRipples = () => {
    for (let i = 0; i < options.count; ++i) {
      const ripple: Partial<Ripple> = {}
      resetRipple(ripple)
      // @ts-ignore
      ripples.push(ripple)
    }
  }

  const resetRipple = (ripple: Partial<Ripple>) => {
    ripple.y = randomInt(height.value / 5, height.value)
    ripple.x = randomInt(-50, width.value + 50)

    ripple.distance = ripple.y / height.value

    ripple.maxSize = randomInt(options.rippleSize[0], options.rippleSize[1]) * ripple.distance
    ripple.initialAlpha = between(0.3, 0.8) * ripple.distance
    ripple.alpha = 0
    ripple.duration = randomInt(options.rippleDuration[0], options.rippleDuration[1])
    ripple.fadeDuration = randomInt(options.fadeDuration[0], options.fadeDuration[1])
    ripple.start = Date.now()
    ripple.fadeStart = 0
    ripple.width = 0
    ripple.height = 0
  }

  const { start, width, height } = useContext2D(canvas, {
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

        ctx.globalAlpha = ripple.initialAlpha - ripple.alpha

        /**
         * Would like to generate splash effect here eventually
         */
        // ctx.beginPath()
        // ctx.ellipse(ripple.x, ripple.y, 5, 5, Math.PI / 2, 0, 2 * Math.PI)
        // ctx.fill()
        // ctx.closePath()

        ctx.beginPath()
        ctx.ellipse(ripple.x, ripple.y, Math.abs(ripple.height * ripple.distance), Math.abs(ripple.width), Math.PI / 2, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.ellipse(ripple.x, ripple.y, Math.abs(childRippleHeight), Math.abs(childRippleWidth), Math.PI / 2, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.closePath()
      }

      ctx.restore()
    },
    tick() {
      for (let i = ripples.length - 1; i >= 0; --i) {
        const ripple = ripples[i]
        const now = Date.now()
        const p = (now - ripple.start) / ripple.duration

        if (now - ripple.start > ripple.duration - ripple.fadeDuration) {
          if (ripple.fadeStart === 0)
            ripple.fadeStart = Date.now()

          const x = (now - ripple.fadeStart) / (ripple.fadeDuration)
          ripple.alpha = ripple.initialAlpha * x
        }

        if (now - ripple.start >= ripple.duration) {
          if (now - ripple.fadeStart >= ripple.fadeDuration) resetRipple(ripple)
        }
        else {
          ripple.width = ripple.maxSize * ease(p)
          ripple.height = (ripple.maxSize / options.rotation) * ease(p)
        }
      }
    },
  })

  initRipples()
  start()
}
