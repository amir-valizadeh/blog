<!-- src/pages/dashboard/DashboardPage.vue -->
<template>
  <div>
    <!-- Page Title -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-900">All Posts</h2>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white border border-gray-200 rounded-lg p-8">
      <div class="animate-pulse">
        <div class="space-y-4">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white border border-gray-200 rounded-lg p-8">
      <div class="text-center">
        <p class="text-red-600 mb-4">Failed to load articles</p>
        <button @click="refetch" class="btn-primary">Try Again</button>
      </div>
    </div>

    <!-- Articles Table -->
    <div v-else-if="articles.length > 0" class="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excerpt</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(article, index) in articles" :key="article.slug" class="hover:bg-gray-50">
          <td class="px-4 py-3 text-sm text-gray-900">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td class="px-4 py-3 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            <RouterLink :to="`/article/${article.slug}`">
              {{ article.title }}
            </RouterLink>
          </td>
          <td class="px-4 py-3 text-sm text-gray-900">{{ article.author.username }}</td>
          <td class="px-4 py-3 text-sm text-gray-500">{{ article.tagList.join(', ') }}</td>
          <td class="px-4 py-3 text-sm text-gray-500">{{ article.description }}</td>
          <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(article.createdAt) }}</td>
          <td class="px-4 py-3 text-sm text-gray-500">
            <div class="relative">
              <button
                  @click="toggleDropdown(article.slug)"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <span class="text-lg">⋯</span>
              </button>

              <!-- Dropdown Menu -->
              <div
                  v-if="activeDropdown === article.slug"
                  class="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10"
              >
                <button
                    @click="editArticle(article)"
                    class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                    @click="deleteArticle(article)"
                    class="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :disabled="deleteMutation.isPending"
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-lg p-8">
      <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
        <p class="text-gray-500 mb-4">Get started by creating your first article</p>
        <RouterLink to="/article/new" class="btn-primary">Create Article</RouterLink>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center">
      <nav class="flex items-center space-x-1">
        <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          ‹
        </button>

        <template v-for="page in totalPages" :key="page">
          <button
              v-if="page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)"
              @click="goToPage(page)"
              class="px-3 py-1 text-sm rounded"
              :class="page === currentPage
              ? 'bg-teal-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'"
          >
            {{ page }}
          </button>
          <span
              v-else-if="page === currentPage - 3 || page === currentPage + 3"
              class="px-2 text-gray-500"
          >
            ...
          </span>
        </template>

        <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          ›
        </button>
      </nav>
    </div>

    <!-- Tips Section -->
    <div class="mt-8 flex items-start space-x-2 text-sm">
      <div class="text-blue-500 mt-0.5">💡</div>
      <div class="text-gray-600">
        <span class="font-medium">tips</span>
        <p class="mt-1">
          If page > 1<br>
          path: /articles<br>
          page: currentPage()<br>
          url: /articles?page=1
        </p>
        <p class="mt-2 text-orange-600 flex items-start">
          <span class="text-orange-500 mr-1">⚠️</span>
          The username is not supported to be developed in this final project.
        </p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteModal
        :is-visible="showDeleteModal"
        :article-title="selectedArticle?.title"
        @close="handleCloseModal"
        @confirm="handleConfirmDelete"
    />
    <div class="mt-8 flex items-start space-x-2 text-sm">
      <div class="text-blue-500 mt-0.5">💡</div>
      <div class="text-gray-600">
        <span class="font-medium">tips</span>
        <p class="mt-1">
          If page > 1<br>
          path: /articles<br>
          page: currentPage()<br>
          url: /articles?page=1
        </p>
        <p class="mt-2 text-orange-600 flex items-start">
          <span class="text-orange-500 mr-1">⚠️</span>
          The username is not supported to be developed in this final project.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticles, useDeleteArticle, useLogout } from '@/shared/api/hooks'
import { useArticlePagination } from '@/shared/api/hooks'
import DeleteModal from '@/design-system/components/ui/DeleteModal.vue'
import type { Article } from '@/shared/api/client'

const router = useRouter()
const activeDropdown = ref<number | null>(null)
const showDeleteModal = ref(false)
const selectedArticle = ref<Article | null>(null)
const currentPage = ref(1)

// Pagination
const { pageSize, getOffset, getTotalPages } = useArticlePagination(10)

// Fetch articles with pagination
const {
  data: articlesData,
  isLoading,
  error,
  refetch
} = useArticles(computed(() => ({
  limit: pageSize,
  offset: getOffset(currentPage.value)
})))

// Computed values
const articles = computed(() => articlesData.value?.articles || [])
const totalArticles = computed(() => articlesData.value?.articlesCount || 0)
const totalPages = computed(() => getTotalPages(totalArticles.value))

// Mutations
const deleteMutation = useDeleteArticle({
  onSuccess: () => {
    // Refetch articles to get updated list
    refetch()
  }
})

const logoutMutation = useLogout({
  onSuccess: () => {
    router.push('/auth/signin')
  }
})

// Mock articles data - realistic structure for RealWorld API
const toggleDropdown = (articleId: string) => {
  activeDropdown.value = activeDropdown.value === articleId ? null : articleId
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const editArticle = (article: Article) => {
  activeDropdown.value = null
  router.push(`/article/${article.slug}/edit`)
}

const deleteArticle = (article: Article) => {
  activeDropdown.value = null
  selectedArticle.value = article
  showDeleteModal.value = true
}

const handleCloseModal = () => {
  showDeleteModal.value = false
  selectedArticle.value = null
}

const handleConfirmDelete = async () => {
  if (selectedArticle.value) {
    try {
      await deleteMutation.mutateAsync(selectedArticle.value.slug)
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  // Close modal
  handleCloseModal()
}

const handleLogout = () => {
  logoutMutation.mutate()
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
const closeDropdowns = () => {
  activeDropdown.value = null
}
</script>