import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue()],
  server: {
    port: 3000,
    host: '0.0.0.0', // For Docker
    watch: {
      usePolling: true, // For Docker on some systems
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/app': resolve(__dirname, 'src/app'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/widgets': resolve(__dirname, 'src/widgets'),
      '@/features': resolve(__dirname, 'src/features'),
      '@/entities': resolve(__dirname, 'src/entities'),
      '@/shared': resolve(__dirname, 'src/shared'),
      '@/design-system': resolve(__dirname, 'src/design-system'),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'query-vendor': ['@tanstack/vue-query'],
          'utils-vendor': ['@vueuse/core'],
        },
      },
    },
  },
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
})