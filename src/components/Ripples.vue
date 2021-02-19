<script setup='props' lang='ts'>
import { ref, onMounted } from 'vue'
import { createRipples } from '~/logics/ripples'

const el = ref()

onMounted(() => {
  if (el.value) {
    // const ctx = el.value.getContext('2d')

    createRipples(el.value)
  }
})

</script>

<template>
  <canvas class="absolute w-full h-full bg-transparent pointer-events-none" style="z-index: 50000;" width="400" height="400" ref="el"></canvas>
</template>
