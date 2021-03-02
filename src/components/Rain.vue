<script setup='props' lang='ts'>
import { ref, onMounted } from 'vue'
import { createRain } from '~/logics/rain'

const el = ref()

onMounted(() => {
  if (el.value)
    createRain(el.value)
})
</script>

<template>
  <canvas ref="el" class="fixed inset-0 bg-transparent pointer-events-none" style="z-index: 5;" width="400" height="400" />
</template>
