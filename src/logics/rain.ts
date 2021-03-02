import { Ref } from 'vue'
import { useContext2D } from '~/logics/useCanvas'
import { randomInt, lerp, normalizeVector, scaleVector, between, Vector2D } from '~/logics/util'

interface RainOptions {
  count: number
  thickness: [number, number]
  color: string
  velocity: [number, number]
  length: [number, number]
  alpha: [number, number]
}

interface Drop {
  x: number
  vx: number
  vy: number
  l: number
  a: number
  y: number
}

const DEFAULT_OPTIONS: RainOptions = {
  count: 150,
  thickness: [0.5, 3],
  color: 'white',
  velocity: [0.8, 1.2],
  length: [50, 150],
  alpha: [0.025, 0.15],
}

export function createRain(canvas: HTMLCanvasElement, options: RainOptions = DEFAULT_OPTIONS) {
  const drops: Drop[] = []

  const initDrops = () => {
    for (let i = 0; i < options.count; ++i) {
      const drop: Partial<Drop> = {}
      resetDrop(drop)
      drop.y = randomInt(0, height.value)
      // @ts-ignore
      drops.push(drop)
    }
  }

  const resetDrop = (drop: Partial<Drop>) => {
    const scale = Math.random()
    drop.x = randomInt(-50, width.value + 50)
    drop.vx = 0
    drop.vy = lerp(options.velocity[0], options.velocity[1], scale)
    drop.l = lerp(options.length[0], options.length[1], scale)
    drop.a = lerp(options.alpha[0], options.alpha[1], scale)
    drop.y = randomInt(-drop.l, 0)
  }

  const { resume, width, height } = useContext2D(canvas, {
    tick(dt) {
      for (let i = drops.length - 1; i >= 0; --i) {
        const drop = drops[i]
        drop.x += drop.vx * dt
        drop.y += drop.vy * dt

        if (drop.y > height.value + drop.l)
          resetDrop(drop)
      }
    },
    render(ctx) {
      ctx.clearRect(0, 0, width.value, height.value)
      ctx.save()
      ctx.strokeStyle = options.color
      ctx.lineWidth = between(options.thickness[0], options.thickness[1])
      // @ts-ignore
      ctx.compositeOperation = 'lighter'

      for (let i = 0; i < drops.length; ++i) {
        const drop = drops[i]

        const x1 = Math.round(drop.x)
        const y1 = Math.round(drop.y)

        const v: Vector2D = { x: drop.vx, y: drop.vy }
        normalizeVector(v)
        scaleVector(v, -drop.l)

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
    },
  })

  initDrops()
  resume()
}
