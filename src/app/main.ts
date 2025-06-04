import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import App from './App.vue'
import { queryClient } from '@/shared/lib/query-client.ts'

// Import global styles
import './styles/index.css'
import {VueQueryDevtools} from "@tanstack/vue-query-devtools";

const app = createApp(App)

// Global plugins
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin, {
    queryClient,
    enableDevtoolsV6Plugin: true,
})

// Conditionally render Vue Query Devtools in development mode
app.component('VueQueryDevtools', VueQueryDevtools)


app.mount('#app')