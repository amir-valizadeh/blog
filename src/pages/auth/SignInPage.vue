<!-- src/pages/auth/SignInPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 text-center">Sign in</h2>
        </div>

        <form @submit.prevent="handleSignIn" class="space-y-4">
          <!-- General Error -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-red-700 text-sm">{{ generalError }}</p>
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                :class="{ 'border-red-500': emailError }"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                :class="{ 'border-red-500': passwordError }"
            />
            <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
          </div>

          <!-- Submit Button -->
          <div class="pt-2">
            <button
                type="submit"
                :disabled="loading"
                class="w-full bg-teal-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Signing in...' : 'Sign in' }}
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLogin } from '@/shared/api/hooks'
import { ApiError } from '@/shared/api/client'

const router = useRouter()
const emailError = ref('')
const passwordError = ref('')
const generalError = ref('')

const form = ref({
  email: '',
  password: '',
})

const loginMutation = useLogin({
  onSuccess: () => {
    router.push('/dashboard')
  },
  onError: (error: ApiError) => {
    generalError.value = ''
    emailError.value = ''
    passwordError.value = ''

    if (error.isValidationError) {
      const errors = error.errors
      if (errors.email) {
        emailError.value = errors.email[0]
      }
      if (errors.password) {
        passwordError.value = errors.password[0]
      }
      if (errors['email or password']) {
        generalError.value = errors['email or password'][0]
      }
    } else {
      generalError.value = 'An error occurred. Please try again.'
    }
  }
})

const validateForm = () => {
  emailError.value = ''
  passwordError.value = ''
  generalError.value = ''

  if (!form.value.email) {
    emailError.value = 'Required field'
    return false
  }

  if (!form.value.password) {
    passwordError.value = 'Required field'
    return false
  }

  return true
}

const handleSignIn = async () => {
  if (!validateForm()) return

  loginMutation.mutate({
    user: {
      email: form.value.email,
      password: form.value.password,
    }
  })
}

const loading = loginMutation.isPending
</script>