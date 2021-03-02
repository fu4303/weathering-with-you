import { Ref, watch, ref } from 'vue'
import { useWindowSize, tryOnUnmounted, tryOnMounted } from '@vueuse/core'

const FIXED_STEP = 16

export interface UseContext2DOptions {
  tick: (dt: number) => any
  render: (ctx: CanvasRenderingContext2D) => any
}

export function useContext2D(canvas: Ref<HTMLCanvasElement>, { render, tick }: UseContext2DOptions) {
  const ctx = ref<CanvasRenderingContext2D>()
  const isActive = ref(false)
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
    if (!isActive.value)
      return

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
      isActive.value = true
      render(ctx.value!)
      requestAnimationFrame(update)
    }
    else {
      const stop = watch(ctx, () => {
        if (ctx.value) {
          isActive.value = true
          render(ctx.value!)
          requestAnimationFrame(update)
          stop()
        }
      })
    }
  }

  tryOnUnmounted(() => {
    isActive.value = false
  })

  return {
    width,
    height,
    start,
  }
}
