<!-- src/design-system/components/ui/DeleteModal.vue -->
<template>
  <!-- Modal Overlay -->
  <div
      v-if="isVisible"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleOverlayClick"
  >
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-lg"></div>

    <!-- Modal container -->
    <div class="flex min-h-full items-center justify-center p-4">
      <!-- Modal content -->
      <div
          class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all"
          @click.stop
      >
        <!-- Modal header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            Delete Article
          </h3>
        </div>

        <!-- Modal body -->
        <div class="px-6 py-4">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-700">
                Are you sure you want to delete this article?
              </p>
              <p v-if="articleTitle" class="text-sm font-medium text-gray-900 mt-1">
                "{{ articleTitle }}"
              </p>
            </div>
          </div>
          <p class="text-sm text-gray-500">
            This action cannot be undone. The article will be permanently removed from your account.
          </p>
        </div>

        <!-- Modal footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
              @click="$emit('confirm')"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

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

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

// Handle escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  // Restore body scroll
  document.body.style.overflow = ''
})
</script>