<script setup lang="ts">
import { useHead } from '@vueuse/head'

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be renedered correctly in the html results with vite-ssg
useHead({
  title: 'Hey, I\'m wheat',
  meta: [
    { name: 'description', content: 'My personal experimental website' },
  ],
})
</script>

<template>
  <router-view />
</template>
