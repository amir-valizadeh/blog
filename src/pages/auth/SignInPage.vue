<!-- src/pages/auth/SignInPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 text-center">Sign in</h2>
        </div>

        <!-- Debug Info (remove in production) -->
        <div class="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> Loading: {{ loading }} | Mutation Status: {{ mutationStatus }}
        </div>

        <form @submit.prevent="handleSignIn" class="space-y-4">
          <!-- General Error -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex items-center justify-between">
              <p class="text-red-700 text-sm">{{ generalError }}</p>
              <button @click="clearErrors" class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-md p-3">
            <p class="text-green-700 text-sm">Successfully signed in! Redirecting...</p>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="Enter your email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                :class="{ 'border-red-500': emailError }"
                :disabled="loading"
            />
            <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
                id="password"
                v-model="form.password"
                type="password"
                required
                placeholder="Enter your password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                :class="{ 'border-red-500': passwordError }"
                :disabled="loading"
            />
            <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
                type="submit"
                :disabled="loading"
                class="w-full bg-teal-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>

          <!-- Manual Reset Button (for debugging) -->
          <div v-if="loading" class="pt-2">
            <button
                type="button"
                @click="forceReset"
                class="w-full bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600"
            >
              Force Reset (Debug)
            </button>
          </div>

          <!-- Sign up link -->
          <div class="text-center pt-4">
            <span class="text-sm text-gray-600">Don't have an account? </span>
            <RouterLink
                to="/auth/signup"
                class="text-sm text-teal-600 hover:text-teal-500 font-medium"
            >
              Sign up now
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ApiError } from '@/shared/api/client'

const router = useRouter()

// Form state
const form = ref({
  email: '',
  password: '',
})

// Error states
const emailError = ref('')
const passwordError = ref('')
const generalError = ref('')
const showSuccess = ref(false)
const mutationStatus = ref('idle')

// Manual loading state for better control
const isLoading = ref(false)

// Computed loading state
const loading = computed(() => isLoading.value)

const clearErrors = () => {
  emailError.value = ''
  passwordError.value = ''
  generalError.value = ''
  showSuccess.value = false
}

const forceReset = () => {
  isLoading.value = false
  mutationStatus.value = 'idle'
  clearErrors()
  console.log('Force reset performed')
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  // Email validation
  if (!form.value.email.trim()) {
    emailError.value = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.value.email.trim())) {
    emailError.value = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!form.value.password.trim()) {
    passwordError.value = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleSignIn = async () => {
  console.log('=== Sign In Attempt Started ===')
  console.log('Form data:', {
    email: form.value.email,
    passwordLength: form.value.password.length
  })

  if (!validateForm()) {
    console.log('Form validation failed')
    return
  }

  // Set loading state
  isLoading.value = true
  mutationStatus.value = 'loading'
  clearErrors()

  try {
    console.log('Making API request...')

    // Import here to avoid circular dependencies
    const { apiClient } = await import('@/shared/api/client')

    const response = await apiClient.login({
      user: {
        email: form.value.email.trim(),
        password: form.value.password,
      }
    })

    console.log('Login API response:', response)
    mutationStatus.value = 'success'

    // Try to set user in store if available
    try {
      const { useUserStore } = await import('@/app/stores/userStore')
      const userStore = useUserStore()
      userStore.setUser(response.user)
      console.log('User set in store:', response.user.username)
    } catch (storeError) {
      console.warn('Could not set user in store:', storeError)
      // Continue anyway, just store in localStorage as fallback
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('token', response.user.token)
    }

    // Show success message
    showSuccess.value = true

    // Redirect after short delay
    setTimeout(() => {
      console.log('Redirecting to dashboard...')
      router.push('/dashboard')
    }, 1000)

  } catch (error: any) {
    console.error('Login error:', error)
    mutationStatus.value = 'error'

    // Handle API errors
    if (error instanceof ApiError) {
      if (error.isValidationError) {
        const errors = error.errors
        console.log('Validation errors:', errors)

        if (errors.email) {
          emailError.value = errors.email[0]
        }
        if (errors.password) {
          passwordError.value = errors.password[0]
        }
        if (errors['email or password']) {
          generalError.value = errors['email or password'][0]
        }
      } else if (error.status === 401) {
        generalError.value = 'Invalid email or password'
      } else if (error.status === 403) {
        generalError.value = 'Access denied'
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
    // Always reset loading state
    isLoading.value = false
    console.log('=== Sign In Attempt Completed ===')
  }
}
</script>