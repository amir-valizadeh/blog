<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Arvancloud Challenge</h1>
          </div>

          <!-- User Info & Actions -->
          <div class="flex items-center space-x-4">
            <!-- Loading state -->
            <div v-if="userStore.isLoading" class="flex items-center space-x-2">
              <div class="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span class="text-sm text-gray-600">Loading...</span>
            </div>

            <!-- User info -->
            <template v-else-if="userStore.isAuthenticated">
              <span class="text-sm text-gray-600">Welcome {{ userStore.username }}!</span>
              <button
                  @click="handleLogout"
                  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </template>

            <!-- Not authenticated -->
            <template v-else>
              <span class="text-sm text-red-600">Not authenticated</span>
              <button
                  @click="redirectToLogin"
                  class="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <div class="flex">
      <!-- Sidebar -->
      <nav class="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] hidden lg:block">
        <div class="px-6 py-8">
          <div class="space-y-2">
            <RouterLink
                to="/dashboard"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="isActiveRoute('/dashboard')
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'"
            >
              All Articles
            </RouterLink>
            <RouterLink
                to="/article/new"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="isActiveRoute('/article/new')
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'"
            >
              New Article
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="lg:hidden fixed bottom-4 right-4 z-50">
        <button
            @click="toggleMobileMenu"
            class="bg-primary-500 text-white p-3 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu Overlay -->
      <div
          v-if="showMobileMenu"
          class="fixed inset-0 z-40 lg:hidden"
          @click="closeMobileMenu"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
        <nav class="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50">
          <div class="px-6 py-8">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                  @click="closeMobileMenu"
                  class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-2">
              <RouterLink
                  to="/dashboard"
                  @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  :class="isActiveRoute('/dashboard')
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                All Articles
              </RouterLink>
              <RouterLink
                  to="/article/new"
                  @click="closeMobileMenu"
                  class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  :class="isActiveRoute('/article/new')
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                New Article
              </RouterLink>
            </div>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <main class="flex-1 min-h-[calc(100vh-4rem)]">
        <div class="px-4 sm:px-6 lg:px-8 py-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/app/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const showMobileMenu = ref(false)

// Check authentication and fetch user data on mount
onMounted(async () => {
  if (!userStore.isAuthenticated) {
    await router.push('/auth/signin')
  }
})

const isActiveRoute = (path: string) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = () => {
  userStore.clearUser()
  router.push('/auth/signin')
}

const redirectToLogin = () => {
  router.push('/auth/signin')
}
</script>