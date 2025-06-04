<template>
  <div class="max-w-4xl mx-auto">
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
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-red-600 mb-2">Article Not Found</h2>
        <p class="text-gray-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
        <RouterLink to="/dashboard" class="btn-primary">Back to Dashboard</RouterLink>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="bg-white border border-gray-200 rounded-lg p-8">
      <!-- Back to Dashboard Link -->
      <div class="mb-6">
        <RouterLink to="/dashboard" class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Dashboard
        </RouterLink>
      </div>

      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {{ article.title }}
        </h1>
        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
          {{ article.description }}
        </p>
        <div class="flex items-center justify-between text-sm text-gray-500 border-b border-gray-200 pb-4">
          <div class="flex items-center space-x-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-2">
                <span class="text-white text-sm font-medium">{{ article.author.username.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="font-medium">{{ article.author.username }}</span>
            </div>
            <span>{{ formatDate(article.createdAt) }}</span>
            <span v-if="article.favoritesCount > 0" class="flex items-center">
              <svg class="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
              {{ article.favoritesCount }}
            </span>
          </div>
          <div class="flex space-x-3">
            <button
                @click="editArticle"
                class="inline-flex items-center px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit
            </button>
          </div>
        </div>
      </header>

      <div class="prose prose-lg max-w-none mb-8">
        <div class="whitespace-pre-wrap text-gray-800 leading-relaxed text-base">{{ article.body }}</div>
      </div>

      <footer v-if="article.tagList?.length" class="border-t border-gray-200 pt-6">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Tags</h3>
        <div class="flex flex-wrap gap-2">
          <span
              v-for="tag in article.tagList"
              :key="tag"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200"
          >
            {{ tag }}
          </span>
        </div>
      </footer>
    </div>

    <!-- Related Articles or Actions -->
    <div v-if="article" class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Article Actions</h3>
          <div class="mt-2 text-sm text-blue-700">
            <p class="mb-2" v-if="article.author.username === userStore.username">You can edit this article or browse
              other articles from the dashboard.</p>
            <p class="mb-2" v-else>You are viewing this article as a guest. Only the author can edit it.</p>
            <div class="flex space-x-4" v-if="article.author.username === userStore.username">
              <button @click="editArticle" class="text-blue-600 hover:text-blue-800 font-medium">
                Edit Article
              </button>
              <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800 font-medium">
                View All Articles
              </RouterLink>
            </div>
            <div v-else>
              <RouterLink to="/dashboard" class="text-blue-600 hover:text-blue-800 font-medium">
                View All Articles
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticle } from '@/shared/api/hooks'
import {useUserStore} from "@/app/stores/userStore.ts";

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

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
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>