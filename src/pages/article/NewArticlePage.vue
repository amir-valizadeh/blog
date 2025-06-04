<!-- src/pages/article/NewArticlePage.vue -->
<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Main Form Section -->
    <div class="flex-1 order-2 lg:order-1">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900">New article</h2>
      </div>

      <!-- Debug Info (remove in production) -->
      <div v-if="debuggerMode" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
        <strong>Debug:</strong> Loading: {{ isCreating }} | Selected Tags: {{ selectedTags.length }}
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <p class="text-green-800 text-sm font-medium">Well done! Article created successfully. Redirecting...</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- General Error -->
        <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
          <div class="flex items-center justify-between">
            <p class="text-red-700 text-sm">{{ generalError }}</p>
            <button @click="clearErrors" type="button" class="text-red-500 hover:text-red-700">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Title Field -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
              id="title"
              v-model="form.title"
              type="text"
              required
              placeholder="Enter article title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': titleError }"
              :disabled="isCreating"
          />
          <p v-if="titleError" class="text-red-500 text-xs mt-1">{{ titleError }}</p>
        </div>

        <!-- Description Field -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
              id="description"
              v-model="form.description"
              rows="3"
              required
              placeholder="Short description of your article"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500': descriptionError }"
              :disabled="isCreating"
          ></textarea>
          <p v-if="descriptionError" class="text-red-500 text-xs mt-1">{{ descriptionError }}</p>
        </div>

        <!-- Body Field -->
        <div>
          <label for="body" class="block text-sm font-medium text-gray-700 mb-2">
            Body
          </label>
          <textarea
              id="body"
              v-model="form.body"
              :rows="isMobile ? 8 : 12"
              required
              placeholder="Write your article content here..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y"
              :disabled="isCreating"
          ></textarea>
          <p v-if="bodyError" class="text-red-500 text-xs mt-1">{{ bodyError }}</p>
        </div>

        <!-- Submit Button -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
              type="submit"
              :disabled="isCreating"
              class="flex-1 bg-primary-500 text-white 2xl:max-w-fit px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <span v-if="isCreating" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
            <span v-else>Create Article</span>
          </button>

          <!-- Reset Button -->
          <button
              type="button"
              @click="resetForm"
              :disabled="isCreating"
              class="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Reset
          </button>

          <!-- Force Reset (Debug) -->
          <button
              v-if="isCreating"
              type="button"
              @click="forceReset"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            Force Reset
          </button>
        </div>
      </form>
    </div>

    <!-- Tags Sidebar -->
    <div class="w-full lg:w-80 order-1 lg:order-2">
      <!-- Mobile Tags Section -->
      <div class="lg:hidden mb-6">
        <button
            @click="showMobileTags = !showMobileTags"
            class="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
        >
          <span class="font-medium text-gray-900">Tags ({{ selectedTags.length }} selected)</span>
          <svg
              class="w-5 h-5 transition-transform"
              :class="showMobileTags ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <div v-show="showMobileTags" class="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <TagsSection
              :selected-tags="selectedTags"
              :available-tags="availableTags"
              :is-loading="isTagsLoading"
              @update-tags="updateSelectedTags"
              @remove-tag="removeTag"
          />
        </div>
      </div>

      <!-- Desktop Tags Section -->
      <div class="hidden lg:block">
        <div class="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Tags</h3>
          <TagsSection
              :selected-tags="selectedTags"
              :available-tags="availableTags"
              :is-loading="isTagsLoading"
              @update-tags="updateSelectedTags"
              @remove-tag="removeTag"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTags } from '@/shared/api/hooks'
import { ApiError } from '@/shared/api/client'
import { useQueryClient } from "@tanstack/vue-query"


// Mobile detection
const isMobile = ref(false)
const showMobileTags = ref(false)

const router = useRouter()

// Form state
const form = ref({
  title: '',
  description: '',
  body: '',
})

// Error states
const titleError = ref('')
const descriptionError = ref('')
const bodyError = ref('')
const generalError = ref('')
const showSuccess = ref(false)
const isCreating = ref(false)
const queryClient = useQueryClient()
const debuggerMode = import.meta.env.VITE_DEBUGGER
// Tags state
const selectedTags = ref<string[]>([])

// Fetch available tags from API
const { data: tagsData, isLoading: isTagsLoading } = useTags()

// Convert tags array to objects for UI compatibility
const availableTags = computed(() => {
  const tags = tagsData.value?.tags || []
  return tags.map((tag: string, index: number) => ({
    id: index + 1,
    name: tag
  }))
})

const clearErrors = () => {
  titleError.value = ''
  descriptionError.value = ''
  bodyError.value = ''
  generalError.value = ''
}

const forceReset = () => {
  isCreating.value = false
  clearErrors()
}

const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    body: '',
  }
  selectedTags.value = []
  clearErrors()
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.value.title.trim()) {
    titleError.value = 'Title is required'
    isValid = false
  }

  if (!form.value.description.trim()) {
    descriptionError.value = 'Description is required'
    isValid = false
  }

  if (!form.value.body.trim()) {
    bodyError.value = 'Body is required'
    isValid = false
  }

  return isValid
}

const updateSelectedTags = (newTags: string[]) => {
  selectedTags.value = newTags
}

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const handleSubmit = async () => {


  if (!validateForm()) {
    return
  }

  isCreating.value = true
  clearErrors()

  try {

    // Import API client directly to avoid hook issues
    const { apiClient } = await import('@/shared/api/client')

    const response = await apiClient.createArticle({
      article: {
        title: form.value.title.trim(),
        description: form.value.description.trim(),
        body: form.value.body.trim(),
        tagList: selectedTags.value,
      }
    })


    // Show success message
    showSuccess.value = true
    queryClient.invalidateQueries({queryKey:["articles"]})

    // Redirect after delay
    setTimeout(() => {
      router.push(`/article/${response.article.slug}`)
    }, 1500)

  } catch (error: any) {
    console.error('Create article error:', error)

    if (error instanceof ApiError) {
      if (error.isValidationError) {
        const errors = error.errors

        if (errors.title) {
          titleError.value = errors.title[0]
        }
        if (errors.description) {
          descriptionError.value = errors.description[0]
        }
        if (errors.body) {
          bodyError.value = errors.body[0]
        }
        if (errors.tagList) {
          generalError.value = `Tags: ${errors.tagList[0]}`
        }
      } else if (error.status === 401) {
        generalError.value = 'You must be logged in to create articles'
      } else if (error.status === 403) {
        generalError.value = 'You do not have permission to create articles'
      } else if (error.status >= 500) {
        generalError.value = 'Server error. Please try again later.'
      } else {
        generalError.value = `API Error: ${error.message}`
      }
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      generalError.value = 'Network error. Please check your connection.'
    } else {
      generalError.value = `Unexpected error: ${error.message || 'Unknown error'}`
    }
  } finally {
    isCreating.value = false
  }
}

// Mobile detection
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>