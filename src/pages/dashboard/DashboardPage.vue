<!-- src/pages/dashboard/DashboardPage.vue -->
<template>
  <div>

    <div v-if="debuggeMode" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
      <strong>Debug Info:</strong>
      Current User: {{ userStore.username || 'Not logged in' }} |
      Modal Visible: {{ showDeleteModal }} |
      Selected Article: {{ selectedArticle?.title || 'None' }} |
      Is Loading User: {{ userStore.isLoading }} |
      Delete Loading: {{ isDeleting }}
    </div>
    

    <!-- Page Title -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">All Posts</h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white">
      <div class="animate-pulse">
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white text-center py-12">
      <p class="text-red-600 mb-4">Failed to load articles</p>
      <Button @click="refetch" class="btn-primary">Try Again</Button>
    </div>

    <!-- Articles Table -->
    <div v-else-if="articles.length > 0" class="bg-white">
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full">
          <thead>
          <tr class="border-b border-gray-200">
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
              #
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              TITLE
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              AUTHOR
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
              TAGS
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              EXCERPT
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              CREATED
            </th>
            <th class="px-6 py-4 w-16"></th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
          <tr v-for="(article, index) in articles" :key="article.slug" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </td>
            <td class="px-6 py-4">
              <RouterLink
                  :to="`/article/${article.slug}`"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {{ article.title }}
              </RouterLink>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">
              @{{ article.author.username }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div class="truncate max-w-48">
                {{ article.tagList.length > 0 ? article.tagList.join(', ') : 'No tags' }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div class="truncate max-w-xs">
                {{ article.description || 'No description available' }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(article.createdAt) }}
            </td>
            <td class="px-6 py-4">
              <!-- Only show dropdown if user can edit this article -->
              <div v-if="userStore.canEditArticle(article.author.username)" class="relative">
                <button
                    @click="toggleDropdown(article.slug)"
                    class="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div
                    v-if="activeDropdown === article.slug"
                    class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                >
                  <button
                      @click="editArticle(article)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                      @click="deleteArticle(article)"
                      class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                      :disabled="isDeleting"
                  >
                    <span v-if="isDeleting && selectedArticle?.slug === article.slug">Deleting...</span>
                    <span v-else>Delete</span>
                  </button>
                </div>
              </div>
              <!-- Show locked icon if user cannot edit -->
              <div v-else class="flex items-center justify-center">
                <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4 overflow-y-auto max-h-screen pb-20">
        <div
            v-for="(article, index) in articles"
            :key="article.slug"
            class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <div class="flex items-center text-xs text-gray-500 mb-1">
                <span class="mr-2">#{{ (currentPage - 1) * pageSize + index + 1 }}</span>
                <span>@{{ article.author.username }}</span>
                <span class="ml-1 text-gray-400">
                  {{ userStore.canEditArticle(article.author.username) ? '(can edit)' : '(read only)' }}
                </span>
              </div>
              <RouterLink
                  :to="`/article/${article.slug}`"
                  class="text-primary-600 hover:text-primary-700 font-medium transition-colors block"
              >
                {{ article.title }}
              </RouterLink>
            </div>

            <!-- Show dropdown only if user can edit -->
            <div v-if="userStore.canEditArticle(article.author.username)" class="relative ml-2">
              <button
                  @click="toggleDropdown(article.slug)"
                  class="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </button>

              <!-- Mobile Dropdown -->
              <div
                  v-if="activeDropdown === article.slug"
                  class="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <button
                    @click="editArticle(article)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg transition-colors"
                >
                  Edit
                </button>
                <button
                    @click="deleteArticle(article)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
                    :disabled="isDeleting"
                >
                  <span v-if="isDeleting && selectedArticle?.slug === article.slug">Deleting...</span>
                  <span v-else>Delete</span>
                </button>
              </div>
            </div>
            <!-- Show locked icon if user cannot edit -->
            <div v-else class="ml-2 flex items-center">
              <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>

          <p class="text-sm text-gray-600 mb-2 line-clamp-2">
            {{ article.description || 'No description available' }}
          </p>

          <div class="flex items-center justify-between text-xs text-gray-500">
            <div v-if="article.tagList.length > 0" class="flex flex-wrap gap-1">
              <span
                  v-for="tag in article.tagList.slice(0, 2)"
                  :key="tag"
                  class="bg-gray-100 px-2 py-1 rounded"
              >
                {{ tag }}
              </span>
              <span v-if="article.tagList.length > 2" class="text-gray-400">
                +{{ article.tagList.length - 2 }}
              </span>
            </div>
            <span>{{ formatDate(article.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white text-center py-16">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
        <p class="text-gray-500 mb-6">Get started by creating your first article</p>
        <RouterLink
            to="/article/new"
            class="inline-flex items-center px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
        >
          Create Article
        </RouterLink>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccessMessage" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <p class="text-green-800 text-sm font-medium">Article deleted successfully!</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="deleteError" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <p class="text-red-800 text-sm font-medium">{{ deleteError }}</p>
        </div>
        <button @click="clearDeleteError" class="text-red-500 hover:text-red-700">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center">
      <nav class="flex items-center space-x-1">
        <!-- Previous Button -->
        <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Page Numbers -->
        <template v-for="page in visiblePages" :key="page">
          <button
              v-if="typeof page === 'number'"
              @click="goToPage(page)"
              class="px-3 py-2 text-sm rounded-lg transition-colors"
              :class="page === currentPage
              ? 'bg-primary-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
          <span
              v-else
              class="px-2 text-gray-400 text-sm"
          >
            {{ page }}
          </span>
        </template>

        <!-- Next Button -->
        <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </nav>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteModal
        :is-visible="showDeleteModal"
        :article-title="selectedArticle?.title"
        @close="handleCloseModal"
        @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticles, useArticlePagination } from '@/shared/api/hooks'
import { useUserStore } from '@/app/stores/userStore'
import type { Article } from '@/shared/api/client'

const router = useRouter()
const userStore = useUserStore()
const activeDropdown = ref<string | null>(null)
const showDeleteModal = ref(false)
const selectedArticle = ref<Article | null>(null)
const currentPage = ref(1)
const showSuccessMessage = ref(false)
const deleteError = ref('')
const isDeleting = ref(false)
const debuggeMode=import.meta.env.VITE_DEBUGGER

// Pagination
const { pageSize, getOffset, getTotalPages } = useArticlePagination(10)
// Fetch articles with pagination
const limit = ref(pageSize)
const offset = computed(() => getOffset(currentPage.value))

const {
  data: articlesData,
  isLoading,
  error,
  refetch
} = useArticles({
  limit: limit.value,
  offset: offset.value
})



// Computed values
const articles = computed(() => articlesData.value?.articles || [])
const totalArticles = computed(() => articlesData.value?.articlesCount || 0)
const totalPages = computed(() => getTotalPages(totalArticles.value))

// Pagination helper
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 4) {
      pages.push('...')
    }

    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 3) {
      pages.push('...')
    }

    // Always show last page
    if (total > 1) {
      pages.push(total)
    }
  }

  return pages
})

const toggleDropdown = (articleSlug: string) => {
  activeDropdown.value = activeDropdown.value === articleSlug ? null : articleSlug
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const editArticle = (article: Article) => {


  if (!userStore.canEditArticle(article.author.username)) {
    console.warn('User cannot edit this article')
    return
  }

  activeDropdown.value = null
  router.push(`/article/${article.slug}/edit`)
}

const deleteArticle = (article: Article) => {


  if (!userStore.canEditArticle(article.author.username)) {
    console.warn('User cannot delete this article')
    deleteError.value = 'You can only delete your own articles'
    return
  }

  activeDropdown.value = null
  selectedArticle.value = article
  showDeleteModal.value = true
  clearDeleteError()
}

const handleCloseModal = () => {
  showDeleteModal.value = false
  selectedArticle.value = null
}

const handleConfirmDelete = async () => {


  if (!selectedArticle.value) {
    console.error('No article selected for deletion')
    deleteError.value = 'No article selected'
    handleCloseModal()
    return
  }

  if (!userStore.canEditArticle(selectedArticle.value.author.username)) {
    console.warn('Cannot delete article - insufficient permissions')
    deleteError.value = 'You can only delete your own articles'
    handleCloseModal()
    return
  }

  isDeleting.value = true
  clearDeleteError()

  try {

    // Import API client directly to avoid hook issues
    const { apiClient } = await import('@/shared/api/client')

    await apiClient.deleteArticle(selectedArticle.value.slug)


    // Show success message
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)

    // Refetch articles to update the list
    // await refetch()


  } catch (error: any) {
    console.error('Delete operation failed:', error)

    if (error.status === 401) {
      deleteError.value = 'You are not authorized to delete this article'
    } else if (error.status === 403) {
      deleteError.value = 'You do not have permission to delete this article'
    } else if (error.status === 404) {
      deleteError.value = 'Article not found'
    } else if (error.status >= 500) {
      deleteError.value = 'Server error. Please try again later.'
    } else {
      deleteError.value = error.message || 'Failed to delete article. Please try again.'
    }
  } finally {
    isDeleting.value = false
    handleCloseModal()
    window.location.reload()

  }
}

const clearDeleteError = () => {
  deleteError.value = ''
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>