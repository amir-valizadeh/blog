<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
    <div class="text-center text-white">
      <h1 class="text-6xl font-bold mb-4">ArvanCloud</h1>
      <p class="text-xl mb-8">Blog Management Dashboard</p>
      <div class="space-x-4">
        <RouterLink to="/auth/signin" class="btn-primary bg-white text-primary-600 hover:bg-gray-100">
          Sign In
        </RouterLink>
        <RouterLink to="/dashboard" class="btn-primary border-white text-white hover:bg-white hover:text-primary-600">
          Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page - landing page
</script>