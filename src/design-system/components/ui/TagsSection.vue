<!-- src/components/TagsSection.vue -->
<template>
  <div>
    <!-- Selected Tags Display -->
    <div v-if="selectedTags.length > 0" class="mb-4">
      <div class="flex flex-wrap gap-2">
        <span
            v-for="tag in selectedTags"
            :key="tag"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700"
        >
          {{ tag }}
          <button
              @click="$emit('remove-tag', tag)"
              class="ml-2 text-primary-500 hover:text-primary-700 transition-colors"
              type="button"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Available Tags -->
    <div class="space-y-2 max-h-60 overflow-y-auto">
      <div v-if="isLoading" class="text-sm text-gray-500 text-center py-4">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading tags...
        </div>
      </div>

      <div v-else-if="availableTags.length === 0" class="text-sm text-gray-500 text-center py-4">
        No tags available
      </div>

      <label
          v-else
          v-for="tag in availableTags"
          :key="tag.id"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
      >
        <input
            type="checkbox"
            :value="tag.name"
            :checked="selectedTags.includes(tag.name)"
            @change="updateTags"
            class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
        />
        <span class="ml-3 text-sm text-gray-700">{{ tag.name }}</span>
        <span v-if="selectedTags.includes(tag.name)" class="ml-auto">
          <svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tag {
  id: number
  name: string
}

interface Props {
  selectedTags: string[]
  availableTags: Tag[]
  isLoading: boolean
}

interface Emits {
  (e: 'update-tags', tags: string[]): void
  (e: 'remove-tag', tag: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateTags = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  const isChecked = target.checked

  const currentTags = [...props.selectedTags]

  if (isChecked && !currentTags.includes(value)) {
    currentTags.push(value)
  } else if (!isChecked) {
    const index = currentTags.indexOf(value)
    if (index > -1) {
      currentTags.splice(index, 1)
    }
  }

  emit('update-tags', currentTags)
}
</script>