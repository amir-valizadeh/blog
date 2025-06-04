// src/app/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/shared/api/client'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)
    const isLoading = ref(false)

    const isAuthenticated = computed(() => !!user.value)
    const username = computed(() => user.value?.username || '')

    const setUser = (userData: User) => {
        user.value = userData
        localStorage.setItem('token', userData.token)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const clearUser = () => {
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const loadUserFromStorage = () => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
            try {
                user.value = JSON.parse(storedUser)
            } catch (error) {
                console.error('Failed to parse stored user:', error)
                clearUser()
            }
        }
    }

    const canEditArticle = (articleAuthorUsername: string) => {
        return isAuthenticated.value && user.value?.username === articleAuthorUsername
    }

    // Initialize from storage
    loadUserFromStorage()

    return {
        user,
        isLoading,
        isAuthenticated,
        username,
        setUser,
        clearUser,
        loadUserFromStorage,
        canEditArticle
    }
})