<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="card p-8">
        <div class="mb-4">
          <h1 class="text-9xl font-bold text-primary-500">404</h1>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p class="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="space-y-3">
          <RouterLink to="/" class="block btn-primary">
            Go Home
          </RouterLink>
          <RouterLink to="/dashboard" class="block btn-secondary">
            Go to Dashboard
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found page
</script>