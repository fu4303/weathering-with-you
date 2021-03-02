import { ref, watch } from 'vue'
import { useWindowSize, tryOnUnmounted } from '@vueuse/core'

export interface UseContext2DOptions {
  tick: (dt: number) => any
  render: (ctx: CanvasRenderingContext2D) => any
}

const FIXED_STEP = 16

export function useContext2D(canvas: HTMLCanvasElement, { render, tick }: UseContext2DOptions) {
  const FPS = 60
  const { width, height } = useWindowSize()
  const ctx = canvas.getContext('2d')
  const isActive = ref(false)

  let lastTime = 0

  watch([width, height], () => {
    canvas.width = width.value
    canvas.height = height.value
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

    render(ctx!)
    requestAnimationFrame(update)
  }

  const resume = () => {
    isActive.value = true
    update(0)
  }

  const pause = () => {
    isActive.value = false
  }

  tryOnUnmounted(() => pause())

  return {
    resume,
    pause,
    width,
    height,
  }
}
