<script setup='props' lang='ts'>
import { ref } from 'vue'
import { createRipples } from '~/logics/ripples'

const el = ref()

createRipples(el)
</script>

<template>
  <canvas ref="el" class="absolute w-full h-full bg-transparent pointer-events-none" style="z-index: 50000;" width="400" height="400" />
</template>
