<template>
  <div class="max-w-2xl mx-auto px-4">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Profile Settings</h2>
      <p class="text-gray-600">Manage your account information</p>
    </div>

    <div class="card p-6">
      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div class="flex items-center space-x-6">
          <div class="shrink-0">
            <div class="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
              <span class="text-white text-2xl font-medium">
                {{ profile.username.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Profile Photo</h3>
            <p class="text-sm text-gray-500">Update your profile picture</p>
            <button type="button" class="mt-2 btn-secondary text-sm">
              Change Photo
            </button>
          </div>
        </div>

        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
              id="username"
              v-model="profile.username"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
              id="email"
              v-model="profile.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
              id="bio"
              v-model="profile.bio"
              rows="4"
              placeholder="Tell us about yourself..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <RouterLink to="/dashboard" class="btn-secondary">
            Cancel
          </RouterLink>
          <button
              type="submit"
              :disabled="loading"
              class="btn-primary"
          >
            {{ loading ? 'Updating...' : 'Update Profile' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const profile = ref({
  username: '',
  email: '',
  bio: '',
  image: '',
})

const loadProfile = async () => {
  try {
    // TODO: Implement API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data
    profile.value = {
      username: 'testuser',
      email: 'test@example.com',
      bio: 'A passionate developer working on amazing projects.',
      image: '',
    }
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

const handleUpdate = async () => {
  loading.value = true
  try {
    // TODO: Implement API call
    console.log('Updating profile:', profile.value)
    await new Promise(resolve => setTimeout(resolve, 1000))

    router.push('/dashboard')
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>