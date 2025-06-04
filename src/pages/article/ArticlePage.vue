<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex items-center space-x-4">
            <RouterLink to="/dashboard" class="text-primary-600 hover:text-primary-700 transition-colors">
              ← Back to Dashboard
            </RouterLink>
            <h1 class="text-xl font-semibold text-gray-900">Article Management</h1>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Welcome user!</span>
            <button @click="handleLogout" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/auth/signin')
}
</script>