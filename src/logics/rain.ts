import { useWindowSize } from '@vueuse/core'
import { watch } from 'vue'

export function createRain(stage: any) {
  const FIXED_STEP = 16

  // Wind
  const WIND_VELOCITY = 0 // Determines how slanted the rain drops fall, 0 = straight down

  // Drop settings
  const DROP_COUNT = 75 // Adjust for more/less rain drops
  const DROP_WIDTH = [.5, 3] // Increase for thicker rain
  const DROP_X_BUFFER = 50 // How far to the sides of the screen drops will spawn
  const DROP_COLOR = 'white'
  const DROP_MIN_VELOCITY = 0.8
  const DROP_MAX_VELOCITY = 1.2
  const DROP_MIN_LENGTH = 50
  const DROP_MAX_LENGTH = 90
  const DROP_MIN_ALPHA = 0.05
  const DROP_MAX_ALPHA = 0.15

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

  // Initialize our canvas
  const { width, height } = useWindowSize()

  watch([width, height], () => {
    stage.width = width.value
    stage.height = height.value
  }, { immediate: true })

  const ctx = stage.getContext('2d')

  let lastTime = 0

  // Collection of rain drops
  const drops: any = []

  const initDrops = function() {
    for (let i = 0; i < DROP_COUNT; i++) {
      const drop: any = {}
      resetDrop(drop)
      drop.y = math.randomInteger(0, stage.height)
      drops.push(drop)
    }
  }

  // Reset a drop to the top of the canvas
  const resetDrop = function(drop: any) {
    const scale = Math.random()
    drop.x = math.randomInteger(-DROP_X_BUFFER, stage.width + DROP_X_BUFFER)
    drop.vx = WIND_VELOCITY
    drop.vy = math.lerp(DROP_MIN_VELOCITY, DROP_MAX_VELOCITY, scale)
    drop.l = math.lerp(DROP_MIN_LENGTH, DROP_MAX_LENGTH, scale)
    drop.a = math.lerp(DROP_MIN_ALPHA, DROP_MAX_ALPHA, scale)
    drop.y = math.randomInteger(-drop.l, 0)
  }

  const updateDrops = function(dt: any) {
    for (let i = drops.length - 1; i >= 0; --i) {
      const drop = drops[i]
      drop.x += drop.vx * dt
      drop.y += drop.vy * dt

      if (drop.y > stage.height + drop.l)
        resetDrop(drop)
    }
  }

  const renderDrops = function(ctx: any) {
    ctx.save()
    ctx.strokeStyle = DROP_COLOR
    ctx.lineWidth = math.between(DROP_WIDTH[0], DROP_WIDTH[1])
    ctx.compositeOperation = 'lighter'

    for (let i = 0; i < drops.length; ++i) {
      const drop = drops[i]

      const x1 = Math.round(drop.x)
      const y1 = Math.round(drop.y)

      const v = { x: drop.vx, y: drop.vy }
      math.normalizeVector(v)
      math.scaleVector(v, -drop.l)

      const x2 = Math.round(x1 + v.x)
      const y2 = Math.round(y1 + v.y)

      ctx.globalAlpha = drop.a
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.restore()
  }

  const render = function() {
    // ctx.fillStyle = 'black'
    ctx.clearRect(0, 0, stage.width, stage.height)
    renderDrops(ctx)
  }

  const update = function(time: any) {
    let dt = time - lastTime
    lastTime = time
    if (dt > 100) dt = FIXED_STEP

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
