<!-- src/pages/article/EditArticlePage.vue -->
<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Main Form Section -->
    <div class="flex-1">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Edit article</h2>
      </div>

      <!-- Loading State for Initial Data -->
      <div v-if="articleLoading" class="bg-white rounded-lg border border-gray-200 p-8">
        <div class="animate-pulse">
          <div class="space-y-4">
            <div class="h-10 bg-gray-200 rounded"></div>
            <div class="h-24 bg-gray-200 rounded"></div>
            <div class="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Article Not Found -->
      <div v-else-if="!articleData && !articleLoading" class="bg-white rounded-lg border border-gray-200 p-8">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Article not found</h3>
          <p class="text-gray-500 mb-4">The article you're trying to edit doesn't exist or you don't have permission to edit it.</p>
          <RouterLink to="/dashboard" class="btn-primary">Back to Dashboard</RouterLink>
        </div>
      </div>

      <!-- Article Form -->
      <div v-else>
        <!-- Success Message -->
        <div v-if="showSuccess" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <p class="text-green-800 text-sm font-medium">Well done! Article updated successfully, redirecting to dashboard</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- General Error -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <p class="text-red-700 text-sm">{{ generalError }}</p>
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
                placeholder="Article title"
                class="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                :class="titleError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
            />
            <p v-if="titleError" class="text-red-500 text-sm mt-1">{{ titleError }}</p>
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
                placeholder="Short description"
                class="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                :class="descriptionError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'"
            ></textarea>
            <p v-if="descriptionError" class="text-red-500 text-sm mt-1">{{ descriptionError }}</p>
          </div>

          <!-- Body Field -->
          <div>
            <label for="body" class="block text-sm font-medium text-gray-700 mb-2">
              Body
            </label>
            <textarea
                id="body"
                v-model="form.body"
                rows="12"
                required
                placeholder="Write your article content here..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full sm:w-auto bg-primary-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Updating...' : 'Submit' }}
            </button>

            <!-- Reset Button -->
            <button
                type="button"
                @click="resetForm"
                class="w-full sm:w-auto px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tags Sidebar -->
    <div class="w-full lg:w-80 order-first lg:order-last">
      <!-- Mobile Tags Section -->
      <div class="block lg:hidden mb-6">
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
              @remove-tag="removeTag"
              @update-tags="updateSelectedTags"
          />
        </div>
      </div>

      <!-- Desktop Tags Section -->
      <div class="hidden lg:block space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <TagsSection
              :selected-tags="selectedTags"
              :available-tags="availableTags"
              :is-loading="isTagsLoading"
              @remove-tag="removeTag"
              @update-tags="updateSelectedTags"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useArticle, useUpdateArticle, useTags } from '@/shared/api/hooks'
import { useQueryClient } from "@tanstack/vue-query"


const router = useRouter()
const route = useRoute()
const titleError = ref('')
const descriptionError = ref('')
const generalError = ref('')
const showSuccess = ref(false)
const showMobileTags = ref(false)
const isSubmitting = ref(false)
const queryClient = useQueryClient()

const form = ref({
  title: '',
  description: '',
  body: '',
})

const originalForm = ref({
  title: '',
  description: '',
  body: '',
})

const selectedTags = ref<string[]>([])

// Get article slug from route
const articleSlug = computed(() => route.params.slug as string)

// Fetch article data
const { data: articleData, isLoading: articleLoading, error: articleError } = useArticle(articleSlug.value)

// Fetch available tags
const { data: tagsData, isLoading: isTagsLoading } = useTags()

// Convert tags array to objects for UI compatibility
const availableTags = computed(() => {
  const tags = tagsData.value?.tags || []
  return tags.map((tag: string, index: number) => ({
    id: index + 1,
    name: tag
  }))
})

// Update article mutation - Create fresh instance each time
const updateMutation = useUpdateArticle({
  onSuccess: (data) => {
    isSubmitting.value = false
    showSuccess.value = true
    //invalid articles in dashboard using vue query
    queryClient.invalidateQueries({queryKey:["articles"]})
    setTimeout(()=> router.push("/dashboard"),1500)
    clearErrors()

    // Update original form data
    if (data?.article) {
      originalForm.value = {
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
      }
    }

    setTimeout(() => {
      showSuccess.value = false
    }, 3000)

    // If slug changed, redirect to new URL
    if (data?.article?.slug && data.article.slug !== articleSlug.value) {
      router.push(`/article/${data.article.slug}/edit`)
    }
  },
  onError: (error: any) => {
    isSubmitting.value = false
    clearErrors()

    if (error?.isValidationError && error.errors) {
      const errors = error.errors
      if (errors.title) {
        titleError.value = errors.title[0]
      }
      if (errors.description) {
        descriptionError.value = errors.description[0]
      }
      if (errors.body) {
        generalError.value = errors.body[0]
      }
    } else {
      generalError.value = error?.message || 'Failed to update article. Please try again.'
    }
  }
})

// Load article data when it's available
watch(articleData, (data) => {
  if (data?.article) {
    const article = data.article
    form.value = {
      title: article.title,
      description: article.description,
      body: article.body,
    }
    originalForm.value = { ...form.value }
    selectedTags.value = [...article.tagList]
  }
}, { immediate: true })

// Reset mutation state on mount
onMounted(() => {
  // Ensure mutation starts in idle state
  isSubmitting.value = false
  clearErrors()
})

const clearErrors = () => {
  titleError.value = ''
  descriptionError.value = ''
  generalError.value = ''
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
    generalError.value = 'Body is required'
    isValid = false
  }

  return isValid
}

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const updateSelectedTags = (newTags: string[]) => {
  selectedTags.value = newTags
}

const resetForm = () => {
  form.value = { ...originalForm.value }
  selectedTags.value = [...(articleData.value?.article?.tagList || [])]
  clearErrors()
}

const handleSubmit = async () => {
  if (isSubmitting.value) return // Prevent double submission

  if (!validateForm()) return

  isSubmitting.value = true

  // Prepare data according to RealWorld API spec
  const updateData = {
    slug: articleSlug.value,
    data: {
      article: {
        title: form.value.title.trim(),
        description: form.value.description.trim(),
        body: form.value.body.trim(),
        tagList: selectedTags.value,
      }
    }
  }

  // Use the mutation
  updateMutation.mutate(updateData)
}
</script>