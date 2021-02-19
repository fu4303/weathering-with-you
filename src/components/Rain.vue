<script setup='props' lang='ts'>
import { ref } from 'vue'
import { createRain } from '~/logics/rain'

const el = ref()

createRain(el)
</script>

<template>
  <canvas ref="el" class="fixed inset-0 bg-transparent pointer-events-none" style="z-index: 50000;" width="400" height="400" />
</template>
