<script setup='props' lang='ts'>
import { ref, onMounted } from 'vue'
import { createSnow } from '~/logics/snow'

const el = ref()

onMounted(() => {
  if (el.value)
    createSnow(el.value)
})
</script>

<template>
  <canvas ref="el" class="fixed inset-0 bg-transparent pointer-events-none" width="400" height="400" />
</template>
