<script setup lang="ts">
import { defineProps } from 'vue'
import { formatDate } from '~/logics'

const { frontmatter, blank } = defineProps<{ frontmatter: any; blank: boolean }>()
</script>

<template>
  <div v-if="!blank" class="mt-12">
    <header class="mb-12 text-center border-b-2 border-gray-300 border-opacity-30 dark:border-gruvbox-600">
      <div class="pb-12 mx-auto prose prose-lg">
        <p class="text-sm font-medium dark:text-gruvbox-300 opacity-70">
          {{ formatDate(frontmatter.date) }}
        </p>
        <h1 class="mt-0 font-bold dark:text-gruvbox-300">
          {{ frontmatter.title }}
        </h1>
      </div>
    </header>
    <div>
      <div class="col-span-6 mx-auto prose prose-lg dark:text-gruvbox-400">
        <slot />
      </div>
    </div>
  </div>
  <div v-else class="prose-sm prose">
    <slot />
  </div>
</template>
