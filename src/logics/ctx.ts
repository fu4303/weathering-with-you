import { Ref, watch, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const FIXED_STEP = 16

export interface UseContext2DOptions {
  tick: (dt: number) => any
  render: (ctx: CanvasRenderingContext2D) => any
}

export function useContext2D(canvas: Ref<HTMLCanvasElement>, { render, tick }: UseContext2DOptions) {
  const ctx = ref<CanvasRenderingContext2D>()
  const { width, height } = useWindowSize()

  let lastTime = 0

  watch(canvas, () => {
    if (canvas.value)
      ctx.value = canvas.value.getContext('2d')!
  }, { immediate: true })

  watch([width, height, canvas], () => {
    if (canvas.value) {
      canvas.value.width = width.value
      canvas.value.height = height.value
    }
  }, { immediate: true })

  const update = (time: number) => {
    let dt = time - lastTime
    lastTime = time

    if (dt > 100)
      dt = FIXED_STEP

    while (dt >= FIXED_STEP) {
      tick(FIXED_STEP)
      dt -= FIXED_STEP
    }

    render(ctx.value!)
    requestAnimationFrame(update)
  }

  const start = () => {
    if (ctx.value) {
      render(ctx.value!)
      requestAnimationFrame(update)
    }
    else {
      const stop = watch(ctx, () => {
        if (ctx.value) {
          render(ctx.value!)
          requestAnimationFrame(update)
          stop()
        }
      })
    }
  }

  return {
    width,
    height,
    start,
  }
}
