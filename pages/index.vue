<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useIntersectionObserver, useWindowScroll } from '@vueuse/core'
import Rellax from 'rellax'
import Typed from 'typed.js'

const text = ref()
const isSkyVisible = ref(false)
const cloudsEnd = ref()

const { y } = useWindowScroll()

const isBelowClouds = computed(() => {
  if (cloudsEnd.value) {
    console.log(y.value, cloudsEnd.value.offsetTop)
    if (y.value > cloudsEnd.value.offsetTop)
      return true
  }

  return false
})

onMounted(() => {
  Rellax('.parallax', {
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
    <Snow :class="{ 'opacity-0': isBelowClouds }" class="transition-opacity duration-1000" />

    <!-- Sky -->
    <div class="relative grid h-screen overflow-hidden bg-gradient-to-b from-wwy-100 to-wwy-200 place-items-center">
      <div class="relative z-10 w-full p-8 max-w-prose">
        <h1 ref="text" class="h-12 text-5xl" />
        <span class="block mt-2 text-2xl">I'm wheat</span>
        <div class="py-2">
          <About />
        </div>
        <div class="flex flex-row items-center mt-8 space-x-4">
          <a href="https://github.com/jacobclevenger" target="_blank">
            <mdi-github class="text-2xl" />
          </a>
          <a href="https://twitter.com/wheatjs" target="_blank">
            <mdi-twitter class="text-2xl" />
          </a>
          <span class="flex-1" />
          <a href="https://github.com/jacobclevenger/wheatjs.me" target="_blank">View on Github</a>
          <router-link to="/blog">
            Blog
          </router-link>
        </div>
      </div>
      <img src="/images/sky-cloud-1.svg" data-rellax-speed="-1" class="absolute bottom-0 parallax">
      <img src="/images/sky-cloud-2.svg" class="absolute -bottom-1">

      <div class="absolute opacity-50 bottom-12">
        <ic-outline-keyboard-arrow-down class="text-4xl" />
      </div>
    </div>

    <!-- Clouds -->
    <div class="relative z-10 h-screen bg-gradient-to-b from-wwy-200 to-wwy-200" />
    <div class="relative z-10 h-screen bg-gradient-to-b from-wwy-200 to-wwy-250" />
    <div class="relative z-10 h-screen bg-gradient-to-b from-wwy-250 to-wwy-275" />

    <div ref="cloudsEnd" class="relative h-screen overflow-hidden bg-gradient-to-b from-wwy-350 to-wwy-375">
      <img src="/images/cloud-7.svg" data-rellax-speed="-3" class="opacity-50 clouds parallax">
      <img src="/images/cloud-6.svg" data-rellax-speed="-2.75" class="opacity-50 clouds parallax">
      <img src="/images/cloud-5.svg" data-rellax-speed="-2.5" class="opacity-50 clouds parallax">
      <img src="/images/cloud-4.svg" data-rellax-speed="-2" class="clouds parallax">
      <img src="/images/cloud-3.svg" data-rellax-speed="-1.5" class="clouds parallax">
      <img src="/images/cloud-2.svg" data-rellax-speed="-1" class="clouds parallax">
      <img src="/images/cloud-1.svg" class="absolute z-10 -top-1">
      <Rain :class="{ 'opacity-0': !isBelowClouds }" class="transition-opacity duration-1000" />
    </div>


    <div class="h-screen bg-gradient-to-b from-wwy-375 to-wwy-400" />

    <!-- City -->
    <div class="relative h-screen bg-gradient-to-b from-wwy-400 to-wwy-500 city">
      <img src="/images/skyline-7.svg" data-rellax-speed="-4.2" class="skyline parallax">
      <img src="/images/skyline-6.svg" data-rellax-speed="-4" class="skyline parallax">
      <img src="/images/skyline-5.svg" data-rellax-speed="-3" class="skyline parallax">
      <img src="/images/skyline-4.svg" data-rellax-speed="-2" class="skyline parallax">
      <img src="/images/skyline-3.svg" data-rellax-speed="-1.3" class="skyline parallax">
      <img src="/images/skyline-2.svg" data-rellax-speed="-1" class="skyline parallax">
      <div class="absolute bottom-0 w-full h-6 z-2 bg-wwy-500" />
      <img src="/images/skyline-1.svg" class="absolute bottom-0 z-1">
    </div>

    <!-- Water -->
    <div class="relative h-screen bg-gradient-to-b from-wwy-500 to-wwy-500" />
    <div class="relative h-screen bg-gradient-to-b from-wwy-500 to-wwy-600" />
    <div class="relative h-screen bg-gradient-to-b from-wwy-600 to-wwy-700">
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
