// src/app/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/shared/api/client'
import type { User } from '@/shared/api/client'

export const useUserStore = defineStore('user', () => {
    // State
    const user = ref<User | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!user.value)
    const username = computed(() => user.value?.username || '')
    const email = computed(() => user.value?.email || '')

    // Actions
    const setUser = (userData: User) => {
        user.value = userData
        // Still store token in localStorage for API client
        localStorage.setItem('token', userData.token)
        // Store user data for persistence
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const clearUser = () => {
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        apiClient.clearToken()
    }

    const loadUserFromStorage = () => {
        const storedUser = localStorage.getItem('user')
        const token = localStorage.getItem('token')

        if (storedUser && token) {
            try {
                const userData = JSON.parse(storedUser)
                user.value = userData
                apiClient.setToken(token)
            } catch (error) {
                console.error('Failed to parse stored user data:', error)
                clearUser()
            }
        }
    }

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            clearUser()
            return
        }

        isLoading.value = true
        error.value = null

        try {
            const response = await apiClient.getCurrentUser()
            setUser(response.user)
        } catch (err: any) {
            console.error('Failed to fetch current user:', err)
            error.value = err.message || 'Failed to fetch user data'
            // If unauthorized, clear user data
            if (err.status === 401) {
                clearUser()
            }
        } finally {
            isLoading.value = false
        }
    }

    const canEditArticle = (articleAuthorUsername: string) => {
        return isAuthenticated.value && user.value?.username === articleAuthorUsername
    }

    // Initialize user from storage on store creation
    loadUserFromStorage()

    return {
        // State
        user,
        isLoading,
        error,

        // Getters
        isAuthenticated,
        username,
        email,

        // Actions
        setUser,
        clearUser,
        loadUserFromStorage,
        fetchCurrentUser,
        canEditArticle
    }
})