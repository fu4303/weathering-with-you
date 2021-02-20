import { Ref } from 'vue'
import { useContext2D } from '~/logics/ctx'
import { randomInt, lerp, normalizeVector, scaleVector, between, Vector2D } from '~/logics/util'

interface SnowOptions {
  count: number
  thickness: [number, number]
  color: string
  velocity: [number, number]
  size: [number, number]
  alpha: [number, number]
}

interface Snowflake {
  x: number
  vx: number
  vy: number
  l: number
  a: number
  y: number
  size: number
}

const DEFAULT_OPTIONS: SnowOptions = {
  count: 200,
  thickness: [0.5, 3],
  color: 'white',
  velocity: [0.05, 0.1],
  size: [1, 3],
  alpha: [0.05, 0.15],
}

export function createSnow(canvas: Ref<HTMLCanvasElement>, options: SnowOptions = DEFAULT_OPTIONS) {
  const snowflakes: Snowflake[] = []

  const initDrops = () => {
    for (let i = 0; i < options.count; ++i) {
      const snowflake: Partial<Snowflake> = {}
      resetDrop(snowflake)
      snowflake.y = randomInt(0, height.value)
      // @ts-ignore
      snowflakes.push(snowflake)
    }
  }

  const resetDrop = (snowflake: Partial<Snowflake>) => {
    const scale = Math.random()
    snowflake.x = randomInt(-50, width.value + 50)
    snowflake.vx = 0.01
    snowflake.vy = lerp(options.velocity[0], options.velocity[1], scale)
    snowflake.l = lerp(options.size[0], options.size[1], scale)
    snowflake.a = lerp(options.alpha[0], options.alpha[1], scale)
    snowflake.y = randomInt(-snowflake.l, 0)
    snowflake.size = between(options.size[0], options.size[1])
  }

  const { start, width, height } = useContext2D(canvas, {
    tick(dt) {
      for (let i = snowflakes.length - 1; i >= 0; --i) {
        const snowflake = snowflakes[i]
        snowflake.x += snowflake.vx * dt
        snowflake.y += snowflake.vy * dt

        if (snowflake.y > height.value + snowflake.l)
          resetDrop(snowflake)
      }
    },
    render(ctx) {
      ctx.clearRect(0, 0, width.value, height.value)
      ctx.save()
      ctx.fillStyle = options.color
      ctx.lineWidth = between(options.thickness[0], options.thickness[1])
      // @ts-ignore
      // ctx.compositeOperation = 'lighter'

      for (let i = 0; i < snowflakes.length; ++i) {
        const snowflake = snowflakes[i]

        const x1 = Math.round(snowflake.x)
        const y1 = Math.round(snowflake.y)

        const v: Vector2D = { x: snowflake.vx, y: snowflake.vy }
        normalizeVector(v)
        scaleVector(v, -snowflake.l)

        const x2 = Math.round(x1 + v.x)
        const y2 = Math.round(y1 + v.y)

        ctx.globalAlpha = snowflake.a
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.ellipse(snowflake.x, snowflake.y, snowflake.size, snowflake.size, Math.PI / 2, 0, 2 * Math.PI)

        // ctx.
        ctx.lineTo(x2, y2)
        ctx.fill()
        ctx.closePath()
      }
      ctx.restore()
    },
  })

  initDrops()
  start()
}
