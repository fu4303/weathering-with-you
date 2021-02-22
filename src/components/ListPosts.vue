<script setup lang="ts">
import { useRouter } from 'vue-router'
import { formatDate } from '~/logics'

const router = useRouter()

console.log(router.getRoutes())

const posts = router.getRoutes()
  .filter(i => i.path.startsWith('/posts') && i.meta.frontmatter.date)
  .sort((a, b) => +new Date(b.meta.frontmatter.date) - +new Date(a.meta.frontmatter.date))
</script>

<template>
  <div class="w-full px-4 py-8 mx-auto max-w-prose">
    <h2 class="text-2xl font-bold text-wwy-50">
      Blog Posts
    </h2>
    <div class="py-4 space-y-12">
      <router-link v-for="post in posts" :key="post.meta.frontmatter.title" :to="post.path" class="flex flex-col">
        <span class="text-lg">{{ post.meta.frontmatter.title }}</span>
        <span class="mb-2 text-xs opacity-75">{{ formatDate(post.meta.frontmatter.date) }}</span>
        <p class="prose-sm opacity-75">
          {{ post.meta.frontmatter.description }}
        </p>
      </router-link>
    </div>
    <div class="py-8 text-right">
      <router-link to="/blog">
        More Posts
        <carbon-arrow-right />
      </router-link>
    </div>
  </div>
</template>
