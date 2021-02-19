import { useWindowSize } from '@vueuse/core'
import { watch } from 'vue'

function ease(n: number) {
  return n * (2 - n)
}

// Math helpers
const math = {
  // Random integer between min and max
  randomInteger(min: number, max: number) {
    return Math.round((Math.random() * (max - min)) + min)
  },
  // Linear Interpolation
  lerp(a: number, b: number, n: number) {
    return a + ((b - a) * n)
  },
  scaleVector(v: any, s: any) {
    v.x *= s
    v.y *= s
  },
  normalizeVector(v: any) {
    const m = Math.sqrt(v.x * v.x + v.y * v.y)
    math.scaleVector(v, 1 / m)
  },
  between(min: number, max: number) {
    return +(((Math.random() * (max - min)) + min).toFixed(2))
  },
}

export function createRipples(stage: any) {
  const FIXED_STEP = 16

  // Ripple Settings
  const RIPPLE_COUNT = 25 // Adjust for more/less rain ripples
  const RIPPLE_WIDTH = 2 // Increase for thicker rain
  const RIPPLE_X_BUFFER = 50 // How far to the sides of the screen ripples will spawn
  const RIPPLE_COLOR = 'white'
  const RIPPLE_ROTATION = 5

  const RIPPLE_FADE_DURATION = [300, 300]
  const RIPPLE_DURATION = [1000, 3500]

  const RIPPLE_SIZE = [50, 250]

  // Initialize our canvas
  const { width, height } = useWindowSize()

  watch([width, height], () => {
    stage.width = width.value
    stage.height = height.value
  }, { immediate: true })

  const ctx = stage.getContext('2d')
  ctx.imageSmoothingEnabled = true

  let lastTime = 0

  // Collection of rain ripples
  const ripples: any = []

  const initDrops = function() {
    for (let i = 0; i < RIPPLE_COUNT; i++) {
      const ripple: any = {}
      resetDrop(ripple)
      ripples.push(ripple)
    }
  }

  // Reset a ripple to the top of the canvas
  const resetDrop = function(ripple: any) {
    ripple.y = math.randomInteger(stage.height / 2, stage.height)
    ripple.x = math.randomInteger(-RIPPLE_X_BUFFER, stage.width + RIPPLE_X_BUFFER)

    const distance = ripple.y / stage.height

    ripple.maxWidth = math.randomInteger(RIPPLE_SIZE[0], RIPPLE_SIZE[1]) * distance
    ripple.initialAlpha = math.between(0.3, 0.8) * distance
    ripple.alpha = 0
    ripple.duration = math.randomInteger(RIPPLE_DURATION[0], RIPPLE_DURATION[1])
    ripple.fadeDuration = math.randomInteger(RIPPLE_FADE_DURATION[0], RIPPLE_FADE_DURATION[1])
    ripple.start = Date.now()
    ripple.fadeStart = 0
    ripple.end = ripple.start + ripple.duration
    ripple.width = 0
    ripple.height = 0
  }

  const updateDrops = function(dt: any) {
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
        if (now - ripple.fadeStart >= ripple.fadeDuration) resetDrop(ripple)
      }
      else {
        ripple.width = ripple.maxWidth * ease(p)
        ripple.height = (ripple.maxWidth / RIPPLE_ROTATION) * ease(p)
      }
    }
  }

  const renderDrops = function(ctx: any) {
    ctx.save()
    ctx.strokeStyle = RIPPLE_COLOR
    ctx.lineWidth = RIPPLE_WIDTH
    ctx.compositeOperation = 'lighter'

    for (let i = 0; i < ripples.length; ++i) {
      const ripple = ripples[i]

      const childRippleWidth = Math.max(0, ripple.width - 50)
      const childRippleHeight = Math.max(0, ripple.height - (50 / RIPPLE_ROTATION))

      ctx.globalAlpha = ripple.initialAlpha - ripple.alpha
      ctx.beginPath()
      ctx.ellipse(ripple.x, ripple.y, ripple.height, ripple.width, Math.PI / 2, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.ellipse(ripple.x, ripple.y, childRippleHeight, childRippleWidth, Math.PI / 2, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.restore()
  }

  const render = function() {
    ctx.clearRect(0, 0, stage.width, stage.height)
    renderDrops(ctx)
  }

  const update = function(time: any) {
    let dt = time - lastTime
    lastTime = time

    if (dt > 100)
      dt = FIXED_STEP

    while (dt >= FIXED_STEP) {
      updateDrops(FIXED_STEP)
      dt -= FIXED_STEP
    }

    render()
    requestAnimationFrame(update)
  }

  initDrops()
  requestAnimationFrame(update)
}
