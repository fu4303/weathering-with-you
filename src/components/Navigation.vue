<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isDark, toggleDark } from '~/logics'

const { t } = useI18n()
</script>

<template>
  <nav class="flex flex-row p-4 h-18 itesm-center">
    <router-link class="text-lg italic font-medium" to="/">
      wheatjs
    </router-link>
    <span class="flex-1" />
    <a class="mx-2 icon-btn" :title="t('button.toggle_dark')" @click="toggleDark">
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </a>
    <a href="https://github.com/jacobclevenger">
      <carbon-logo-github />
    </a>
  </nav>
</template>
