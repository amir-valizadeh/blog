// src/shared/api/hooks.ts
import {
    type UseMutationOptions,
    type UseQueryOptions,
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/vue-query'
import { computed } from 'vue'
import {
    ApiError,
    type Article,
    type CreateArticleRequest,
    type LoginRequest,
    type RegisterRequest,
    type UpdateArticleRequest,
    type User,
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

export const useFeedArticles = (params?: {
    limit?: number
    offset?: number
}) => {
    return useQuery({
        queryKey: queryKeys.articlesFeed(params),
        queryFn: () => apiClient.getFeedArticles(params),
        staleTime: 2 * 60 * 1000, // 2 minutes (feed is more dynamic)
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

// Current User Query
export const useCurrentUser = () => {
    return useQuery({
        queryKey: queryKeys.currentUser(),
        queryFn: () => apiClient.getCurrentUser(),
        enabled: !!localStorage.getItem('token'),
        staleTime: 10 * 60 * 1000, // 10 minutes
    })
}

// Authentication Mutations
export const useLogin = (options?: UseMutationOptions<any, ApiError, LoginRequest>) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
        onSuccess: (data) => {
            // Cache user data
            queryClient.setQueryData(queryKeys.currentUser(), data)
            // Invalidate and refetch any user-related queries
            queryClient.invalidateQueries({ queryKey: queryKeys.user })
        },
        onError: (error: ApiError) => {
            console.error('Login failed:', error)
        },
        ...options,
    })
}

export const useRegister = (options?: UseMutationOptions<any, ApiError, RegisterRequest>) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
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

export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            apiClient.clearToken()
        },
        onSuccess: () => {
            // Clear all cached data
            queryClient.clear()
        },
    })
}

// Article Mutations
export const useCreateArticle = (options?: UseMutationOptions<any, ApiError, CreateArticleRequest>) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (articleData: CreateArticleRequest) => apiClient.createArticle(articleData),
        onSuccess: (data) => {
            // Invalidate articles list to show new article
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
            // Cache the new article
            queryClient.setQueryData(queryKeys.articlesDetail(data.article.slug), data)
        },
        onError: (error: ApiError) => {
            console.error('Failed to create article:', error)
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

export const useDeleteArticle = (options?: UseMutationOptions<void, ApiError, string>) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (slug: string) => apiClient.deleteArticle(slug),
        onSuccess: (_, slug) => {
            // Remove the specific article from cache
            queryClient.removeQueries({ queryKey: queryKeys.articlesDetail(slug) })

            // Optimistically update articles list by removing the deleted article
            queryClient.setQueriesData(
                { queryKey: queryKeys.articles },
                (oldData: any) => {
                    if (oldData?.articles) {
                        return {
                            ...oldData,
                            articles: oldData.articles.filter((article: Article) => article.slug !== slug),
                            articlesCount: oldData.articlesCount - 1,
                        }
                    }
                    return oldData
                }
            )

            // Invalidate to ensure fresh data
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
        },
        onError: (error: ApiError) => {
            console.error('Failed to delete article:', error)
            // Revert optimistic update by invalidating queries
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
        },
        ...options,
    })
}

// Favorite Mutations
export const useFavoriteArticle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (slug: string) => apiClient.favoriteArticle(slug),
        onMutate: async (slug) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.articlesDetail(slug) })

            // Snapshot the previous value
            const previousArticle = queryClient.getQueryData(queryKeys.articlesDetail(slug))

            // Optimistically update to the new value
            queryClient.setQueryData(queryKeys.articlesDetail(slug), (old: any) => {
                if (old?.article) {
                    return {
                        ...old,
                        article: {
                            ...old.article,
                            favorited: true,
                            favoritesCount: old.article.favoritesCount + 1,
                        },
                    }
                }
                return old
            })

            return { previousArticle }
        },
        onError: (err, slug, context) => {
            // Revert optimistic update
            if (context?.previousArticle) {
                queryClient.setQueryData(queryKeys.articlesDetail(slug), context.previousArticle)
            }
        },
        onSettled: (data, error, slug) => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: queryKeys.articlesDetail(slug) })
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
        },
    })
}

export const useUnfavoriteArticle = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (slug: string) => apiClient.unfavoriteArticle(slug),
        onMutate: async (slug) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.articlesDetail(slug) })

            const previousArticle = queryClient.getQueryData(queryKeys.articlesDetail(slug))

            queryClient.setQueryData(queryKeys.articlesDetail(slug), (old: any) => {
                if (old?.article) {
                    return {
                        ...old,
                        article: {
                            ...old.article,
                            favorited: false,
                            favoritesCount: Math.max(0, old.article.favoritesCount - 1),
                        },
                    }
                }
                return old
            })

            return { previousArticle }
        },
        onError: (err, slug, context) => {
            if (context?.previousArticle) {
                queryClient.setQueryData(queryKeys.articlesDetail(slug), context.previousArticle)
            }
        },
        onSettled: (data, error, slug) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.articlesDetail(slug) })
            queryClient.invalidateQueries({ queryKey: queryKeys.articles })
        },
    })
}

// Utility composables
export const useIsAuthenticated = () => {
    const { data: user, isLoading } = useCurrentUser()

    return computed(() => ({
        isAuthenticated: !!user?.value?.user,
        isLoading: isLoading.value,
        user: user?.value?.user,
    }))
}

export const useArticlePagination = (pageSize = 10) => {
    return {
        getOffset: (page: number) => (page - 1) * pageSize,
        getTotalPages: (total: number) => Math.ceil(total / pageSize),
        pageSize,
    }
}