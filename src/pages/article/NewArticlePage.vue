<!-- src/pages/article/NewArticlePage.vue -->
<template>
  <div class="flex gap-6">
    <!-- Main Form Section -->
    <div class="flex-1">
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900">New article</h2>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
        <p class="text-green-800 text-sm">Well done! Article created successfully</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- General Error -->
        <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
          <p class="text-red-700 text-sm">{{ generalError }}</p>
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
              placeholder="Title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              :class="{ 'border-red-500': titleError }"
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
              placeholder="Short description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              :class="{ 'border-red-500': descriptionError }"
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
              rows="12"
              required
              placeholder="Write your article content here..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div>
          <button
              type="submit"
              :disabled="loading"
              class="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Submit' }}
          </button>
        </div>
      </form>

      <!-- Tips Section -->
      <div class="mt-8 flex items-start space-x-2 text-sm">
        <div class="text-blue-500 mt-0.5">💡</div>
        <div class="text-gray-600">
          <span class="font-medium">tips</span>
          <p class="mt-1">
            art<br>
            path: /articles/new<br>
            Submit button should be disabled and calling a submit indicator (optional)
          </p>
          <p class="mt-2 text-orange-600 flex items-start">
            <span class="text-orange-500 mr-1">⚠️</span>
            This is article is not supported to be developed in this final project.
          </p>
        </div>
      </div>
    </div>

    <!-- Tags Sidebar -->
    <div class="w-64">
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-900 mb-3">Tags</h3>
        <div class="space-y-2">
          <label v-for="tag in availableTags" :key="tag.id" class="flex items-center">
            <input
                type="checkbox"
                :value="tag.name"
                v-model="selectedTags"
                class="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span class="ml-2 text-sm text-gray-700">{{ tag.name }}</span>
          </label>
        </div>

        <!-- Tags Tips -->
        <div class="mt-6 flex items-start space-x-2 text-xs">
          <div class="text-blue-500 mt-0.5">💡</div>
          <div class="text-gray-600">
            <span class="font-medium">tips</span>
            <p class="mt-1">
              New tag should be fetched from Tags api and selected tags should be obtained alphabetically.
            </p>
            <p class="mt-2 text-orange-600 flex items-start">
              <span class="text-orange-500 mr-1">⚠️</span>
              The username is not supported to be developed in this final project.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateArticle, useTags } from '@/shared/api/hooks'
import { ApiError } from '@/shared/api/client'

const router = useRouter()
const titleError = ref('')
const descriptionError = ref('')
const generalError = ref('')

const form = ref({
  title: '',
  description: '',
  body: '',
})

const selectedTags = ref<string[]>([])

// Fetch available tags from API
const { data: tagsData } = useTags()

// Convert tags array to objects for UI compatibility
const availableTags = computed(() => {
  const tags = tagsData.value?.tags || []
  return tags.map((tag: string, index: number) => ({
    id: index + 1,
    name: tag
  }))
})

// Create article mutation
const createMutation = useCreateArticle({
  onSuccess: (data) => {
    // Show success and redirect to article detail
    router.push(`/article/${data.article.slug}`)
  },
  onError: (error: ApiError) => {
    generalError.value = ''
    titleError.value = ''
    descriptionError.value = ''

    if (error.isValidationError) {
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
      generalError.value = 'An error occurred. Please try again.'
    }
  }
})

const validateForm = () => {
  titleError.value = ''
  descriptionError.value = ''
  generalError.value = ''

  let isValid = true

  if (!form.value.title.trim()) {
    titleError.value = 'Required field'
    isValid = false
  }

  if (!form.value.description.trim()) {
    descriptionError.value = 'Required field'
    isValid = false
  }

  if (!form.value.body.trim()) {
    generalError.value = 'Body is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  createMutation.mutate({
    article: {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      body: form.value.body.trim(),
      tagList: selectedTags.value,
    }
  })
}

const loading = createMutation.isPending
const showSuccess = ref(false) // Keep for UI compatibility but don't use
</script>