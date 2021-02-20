<script setup='props' lang='ts'>
import { ref } from 'vue'
import { createSnow } from '~/logics/snow'

const el = ref()

createSnow(el)
</script>

<template>
  <canvas ref="el" class="fixed inset-0 bg-transparent pointer-events-none" width="400" height="400" />
</template>
