<script setup lang="ts">
import { onMounted, defineEmit } from 'vue'
import Rellax from 'rellax'

defineEmit()

onMounted(() => {
  Rellax('.skyline', {
    center: true,
  })
})

</script>

<template>
  <main class="">
    <Rain />

    <!-- Sky -->
    <div class="h-screen bg-gradient-to-b from-wwy-100 to-wwy-200" />

    <!-- Clouds -->
    <div class="h-screen bg-gradient-to-b from-wwy-200 to-wwy-300" />

    <div class="h-screen bg-gradient-to-b from-wwy-300 to-wwy-400" />

    <!-- City -->
    <div class="relative h-screen bg-gradient-to-b from-wwy-400 to-wwy-500 city">
      <img src="/images/skyline-7.svg" data-rellax-speed="-4.2" class="skyline">
      <img src="/images/skyline-6.svg" data-rellax-speed="-4" class="skyline">
      <img src="/images/skyline-5.svg" data-rellax-speed="-3" class="skyline">
      <img src="/images/skyline-4.svg" data-rellax-speed="-2" class="skyline">
      <img src="/images/skyline-3.svg" data-rellax-speed="-1.3" class="skyline">
      <img src="/images/skyline-2.svg" data-rellax-speed="-1" class="skyline">
      <div class="absolute bottom-0 z-10 w-full h-6 bg-wwy-500"></div>
      <img src="/images/skyline-1.svg" class="absolute bottom-0">
    </div>

    <!-- Water -->
    <div class="relative h-screen bg-gradient-to-b from-wwy-500 to-wwy-500 z-5"></div>
    <div class="relative h-screen bg-gradient-to-b from-wwy-500 to-wwy-600 z-5"></div>
    <div class="relative h-screen bg-gradient-to-b from-wwy-600 to-wwy-700 z-5">
      <Ripples />
    </div>
    <!-- <router-view />
    <Footer /> -->
  </main>
</template>

<style lang="postcss">
  .skyline {
    @apply absolute bottom-0;
  }

</style>
