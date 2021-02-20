<script setup lang="ts">
import ScrollToElement from 'scroll-to-element'

const scrollToTop = () => {
  // @ts-ignore
  ScrollToElement('.scroll-to', {
    duration: 1000 * 60,
  })
}
</script>

<template>
  <button class="mx-auto" @click="scrollToTop">
    <ic-outline-keyboard-arrow-up class="text-4xl" />
  </button>
</template>
