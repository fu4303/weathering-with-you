<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  type: String,
})
</script>

<template>
  <div class="relative px-8 border-l-4 border-yellow-500 rounded bg-gruvbox-900 bg-opacity-10">
    <div class="absolute left-0 grid w-10 h-10 -mt-5 -ml-5 text-yellow-400 rounded-full bg-wheat-900 place-content-center">
      <ic-baseline-info />
    </div>
    <div class="py-4 prose prose-lg">
      <slot />
    </div>
  </div>
</template>
