<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left side -->
          <div class="flex items-center space-x-8">
            <RouterLink to="/dashboard" class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900">ArvanCloud</h1>
            </RouterLink>

            <nav class="hidden md:flex space-x-6">
              <RouterLink
                  to="/dashboard"
                  class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  :class="{ 'text-primary-600 bg-primary-50': $route.name === 'Dashboard' }"
              >
                Dashboard
              </RouterLink>
              <RouterLink
                  to="/article/new"
                  class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  :class="{ 'text-primary-600 bg-primary-50': $route.name === 'NewArticle' }"
              >
                New Article
              </RouterLink>
            </nav>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <button
                @click="toggleMobileMenu"
                class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- User menu -->
            <div class="relative">
              <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">U</span>
                </div>
                <span class="hidden md:block text-sm font-medium">User</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- User dropdown -->
              <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
              >
                <RouterLink
                    to="/dashboard/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </RouterLink>
                <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-show="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
          <div class="space-y-2">
            <RouterLink
                to="/dashboard"
                class="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              Dashboard
            </RouterLink>
            <RouterLink
                to="/article/new"
                class="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              New Article
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showMobileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showUserMenu.value = false
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/auth/signin')
}

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showUserMenu.value = false
  showMobileMenu.value = false
}

// TODO: Add click outside listener
</script>