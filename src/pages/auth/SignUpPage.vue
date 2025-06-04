<!-- src/pages/auth/SignUpPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-gray-900 text-center">Sign up</h2>
        </div>

        <form @submit.prevent="handleSignUp" class="space-y-4">
          <!-- General Error -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
            <p class="text-red-700 text-sm">{{ generalError }}</p>
          </div>

          <!-- Username Field -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
                id="username"
                v-model="form.username"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                :class="{ 'border-red-500': usernameError }"
            />
            <p v-if="usernameError" class="text-red-500 text-xs mt-1">{{ usernameError }}</p>
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
              {{ loading ? 'Creating account...' : 'Sign up' }}
            </button>
          </div>

          <!-- Sign in link -->
          <div class="text-center pt-4">
            <span class="text-sm text-gray-600">Have an account? </span>
            <RouterLink
                to="/auth/signin"
                class="text-sm text-teal-600 hover:text-teal-500 font-medium"
            >
              Sign in
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
import { useRegister } from '@/shared/api/hooks'
import { ApiError } from '@/shared/api/client'

const router = useRouter()
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const generalError = ref('')

const form = ref({
  username: '',
  email: '',
  password: '',
})

const registerMutation = useRegister({
  onSuccess: () => {
    router.push('/dashboard')
  },
  onError: (error: ApiError) => {
    generalError.value = ''
    usernameError.value = ''
    emailError.value = ''
    passwordError.value = ''

    if (error.isValidationError) {
      const errors = error.errors
      if (errors.username) {
        usernameError.value = errors.username[0]
      }
      if (errors.email) {
        emailError.value = errors.email[0]
      }
      if (errors.password) {
        passwordError.value = errors.password[0]
      }
    } else {
      generalError.value = 'An error occurred. Please try again.'
    }
  }
})

const validateForm = () => {
  usernameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  generalError.value = ''

  let isValid = true

  if (!form.value.username) {
    usernameError.value = 'Required field'
    isValid = false
  }

  if (!form.value.email) {
    emailError.value = 'Required field'
    isValid = false
  }

  if (!form.value.password) {
    passwordError.value = 'Required field'
    isValid = false
  }

  return isValid
}

const handleSignUp = async () => {
  if (!validateForm()) return

  registerMutation.mutate({
    user: {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    }
  })
}

const loading = registerMutation.isPending
</script>