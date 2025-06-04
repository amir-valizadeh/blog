import {
    type UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/vue-query'
import {
    type ApiError,
    type RegisterRequest,
    type UpdateArticleRequest,
    apiClient
} from './client'

// Query Keys
export const queryKeys = {
    articles: ['articles'] as const,
    articlesList: (params?: any) => [...queryKeys.articles, 'list', params] as const,
    articlesDetail: (slug: string) => [...queryKeys.articles, 'detail', slug] as const,
    articlesFeed: (params?: any) => [...queryKeys.articles, 'feed', params] as const,
    tags: ['tags'] as const,
    user: ['user'] as const,
    currentUser: () => [...queryKeys.user, 'current'] as const,
}
// Articles Queries
export const useArticles = (params?: {
    tag?: string
    author?: string
    favorited?: string
    limit?: number
    offset?: number
}) => {
    return useQuery({
        queryKey: queryKeys.articlesList(params),
        queryFn: () => apiClient.getArticles(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
export const useArticle = (slug: string) => {
    return useQuery({
        queryKey: queryKeys.articlesDetail(slug),
        queryFn: () => apiClient.getArticle(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    })
}
// Tags Query
export const useTags = () => {
    return useQuery({
        queryKey: queryKeys.tags,
        queryFn: () => apiClient.getTags(),
        staleTime: 30 * 60 * 1000, // 30 minutes (tags don't change often)
    })
}
export const useRegister = (options?: UseMutationOptions<any, ApiError, RegisterRequest>) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userData: RegisterRequest) => {
            const response = await apiClient.register(userData)

            // Import and use the store here to avoid circular dependencies
            const { useUserStore } = await import('@/app/stores/userStore')
            const userStore = useUserStore()
            userStore.setUser(response.user)

            return response
        },
        onSuccess: (data) => {
            // Cache user data
            queryClient.setQueryData(queryKeys.currentUser(), data)
            // Invalidate and refetch any user-related queries
            queryClient.invalidateQueries({ queryKey: queryKeys.user })
        },
        onError: (error: ApiError) => {
            console.error('Registration failed:', error)
        },
        ...options,
    })
}

export const useUpdateArticle = (options?: UseMutationOptions<any, ApiError, { slug: string, data: UpdateArticleRequest }>) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ slug, data }: { slug: string, data: UpdateArticleRequest }) =>
            apiClient.updateArticle(slug, data),
        onSuccess: (data, variables) => {
            // Update the specific article cache
            queryClient.setQueryData(queryKeys.articlesDetail(variables.slug), data)

            // If slug changed, also cache with new slug
            if (data.article.slug !== variables.slug) {
                queryClient.setQueryData(queryKeys.articlesDetail(data.article.slug), data)
                queryClient.removeQueries({ queryKey: queryKeys.articlesDetail(variables.slug) })
            }

            // Invalidate articles list to show updated data
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
        },
        onError: (error: ApiError) => {
            console.error('Failed to update article:', error)
        },
        ...options,
    })
}
export const useArticlePagination = (pageSize = 10) => {
    return {
        getOffset: (page: number) => (page - 1) * pageSize,
        getTotalPages: (total: number) => Math.ceil(total / pageSize),
        pageSize,
    }
}