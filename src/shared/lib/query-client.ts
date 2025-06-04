// src/shared/lib/query-client.ts
import { QueryClient } from '@tanstack/vue-query'
import { ApiError } from '../api/client'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Global defaults for all queries
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
            retry: (failureCount, error) => {
                // Don't retry on authentication errors
                if (error instanceof ApiError && error.isUnauthorized) {
                    return false
                }
                // Don't retry on validation errors
                if (error instanceof ApiError && error.isValidationError) {
                    return false
                }
                // Retry up to 3 times for other errors
                return failureCount < 3
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            // Global defaults for all mutations
            retry: false, // Don't retry mutations by default
            onError: (error) => {
                // Global error handling for mutations
                console.error('Mutation error:', error)

                if (error instanceof ApiError) {
                    if (error.isUnauthorized) {
                        // Handle unauthorized errors globally
                        localStorage.removeItem('token')
                        // You could also redirect to login page here
                        window.location.href = '/auth/signin'
                    }
                }
            },
        },
    },
})