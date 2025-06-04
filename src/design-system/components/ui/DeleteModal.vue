<!-- src/design-system/components/ui/DeleteModal.vue -->
<template>
  <div
      v-if="isVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="handleOverlayClick"
  >
    <div
        class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4"
        @click.stop
    >
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900">Delete Article</h3>
        </div>

        <!-- Message -->
        <div class="mb-6">
          <p class="text-sm text-gray-500">
            Are you sure you want to delete this article?
          </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <button
              @click="handleCancel"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
              @click="handleDelete"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isVisible: boolean
  articleTitle?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)

const handleOverlayClick = () => {
  emit('close')
}

const handleCancel = () => {
  emit('close')
}

const handleDelete = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('confirm')
  } catch (error) {
    console.error('Delete error:', error)
  } finally {
    loading.value = false
  }
}
</script>