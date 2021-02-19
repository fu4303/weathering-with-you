<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import Rellax from 'rellax'
import Typed from 'typed.js'

const text = ref()
const isSkyVisible = ref(false)
const sky = ref()

useIntersectionObserver(sky, ([{ isIntersecting }], ob) => {
  isSkyVisible.value = isIntersecting
})

onMounted(() => {
  Rellax('.skyline', {
    center: true,
  })

  Rellax('.clouds', {
    center: true,
  })

  if (text.value) {
    // eslint-disable-next-line
    new Typed(text.value as string, {
      strings: ['Hello,', 'Hola,', 'こんにちは,', '你好,', '안녕하세요,', 'Salut,', 'Ciao,', 'नमस्कार,', 'Hallo,', 'Hej,'],
      typeSpeed: 150,
      backSpeed: 100,
      loop: true,
      showCursor: false,
      smartBackspace: false,
      backDelay: 2500,
    })
  }
})

</script>

<template>
  <main class="">
    <Navigation />
    <Rain :class="{ 'opacity-0': isSkyVisible }" class="transition-opacity duration-500" />

    <!-- Sky -->
    <div ref="sky" class="grid h-screen bg-gradient-to-b from-wwy-100 to-wwy-200 place-items-center">
      <div class="w-full p-8 max-w-prose">
        <h1 ref="text" class="h-12 text-5xl"></h1>
        <span class="block mt-2 text-2xl">I'm wheat</span>
        <div class="py-2">
          <About />
        </div>
        <div class="flex flex-row items-center mt-8 space-x-4">
          <a href="https://github.com/github" target="_blank">
            <mdi-github class="text-2xl" />
          </a>
          <a href="https://twitter.com/wheatjs" target="_blank">
            <mdi-twitter class="text-2xl" />
          </a>
          <span class="flex-1"></span>
          <router-link to="/blog">Blog</router-link>
        </div>
      </div>
    </div>

    <!-- Clouds -->
    <div class="h-screen bg-gradient-to-b from-wwy-200 to-wwy-200" />
    <div class="h-screen bg-gradient-to-b from-wwy-200 to-wwy-250" />
    <div class="h-screen bg-gradient-to-b from-wwy-250 to-wwy-275" />

    <div class="relative h-screen overflow-hidden bg-gradient-to-b from-wwy-350 to-wwy-375">
      <img src="/images/cloud-7.svg" data-rellax-speed="-3" class="opacity-50 clouds">
      <img src="/images/cloud-6.svg" data-rellax-speed="-2.75" class="opacity-50 clouds">
      <img src="/images/cloud-5.svg" data-rellax-speed="-2.5" class="opacity-50 clouds">
      <img src="/images/cloud-4.svg" data-rellax-speed="-2" class="clouds">
      <img src="/images/cloud-3.svg" data-rellax-speed="-1.5" class="clouds">
      <img src="/images/cloud-2.svg" data-rellax-speed="-1" class="clouds">
      <img src="/images/cloud-1.svg" class="absolute -top-1">
    </div>

    <div class="h-screen bg-gradient-to-b from-wwy-375 to-wwy-400" />

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

  .clouds {
    @apply absolute top-0;
  }
</style>
