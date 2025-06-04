<!-- src/pages/article/ArticleDetailPage.vue -->
<template>
  <div class="max-w-4xl">
    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white border border-gray-200 rounded-lg p-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white border border-gray-200 rounded-lg p-8">
      <div class="text-center">
        <h2 class="text-xl font-semibold text-red-600 mb-2">Article Not Found</h2>
        <p class="text-gray-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
        <RouterLink to="/dashboard" class="btn-primary">Back to Dashboard</RouterLink>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="bg-white border border-gray-200 rounded-lg p-8">
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          {{ article.title }}
        </h1>
        <p class="text-gray-600 mb-4">
          {{ article.description }}
        </p>
        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center space-x-4">
            <span>By {{ article.author.username }}</span>
            <span>{{ formatDate(article.createdAt) }}</span>
            <span v-if="article.favoritesCount > 0">
              ❤️ {{ article.favoritesCount }}
            </span>
          </div>
          <div class="flex space-x-2">
            <button
                @click="editArticle"
                class="text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Edit
            </button>
          </div>
        </div>
      </header>

      <div class="prose max-w-none mb-6">
        <div class="whitespace-pre-wrap text-gray-800 leading-relaxed">{{ article.body }}</div>
      </div>

      <footer v-if="article.tagList?.length" class="border-t pt-4">
        <div class="flex flex-wrap gap-2">
          <span
              v-for="tag in article.tagList"
              :key="tag"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {{ tag }}
          </span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticle } from '@/shared/api/hooks'

const route = useRoute()
const router = useRouter()

// Get article slug from route
const articleSlug = computed(() => route.params.slug as string)

// Fetch article data
const { data: articleData, isLoading, error } = useArticle(articleSlug.value)

// Computed article for easy access
const article = computed(() => articleData.value?.article)

const editArticle = () => {
  router.push(`/article/${route.params.slug}/edit`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>