// src/shared/api/client.ts
const API_BASE_URL = 'https://api-3281216083-arvancloud-challenge.apps.ir-central1.arvancaas.ir/api'

// API Response Types
export interface User {
    email: string
    token: string
    username: string
    bio: string | null
    image: string | null
}

export interface Profile {
    username: string
    bio: string | null
    image: string | null
    following: boolean
}

export interface Article {
    slug: string
    title: string
    description: string
    body: string
    tagList: string[]
    createdAt: string
    updatedAt: string
    favorited: boolean
    favoritesCount: number
    author: Profile
}

export interface Comment {
    id: number
    createdAt: string
    updatedAt: string
    body: string
    author: Profile
}

// Request Types
export interface LoginRequest {
    user: {
        email: string
        password: string
    }
}

export interface RegisterRequest {
    user: {
        username: string
        email: string
        password: string
    }
}

export interface CreateArticleRequest {
    article: {
        title: string
        description: string
        body: string
        tagList?: string[]
    }
}

export interface UpdateArticleRequest {
    article: {
        title?: string
        description?: string
        body?: string
        tagList?: string[]
    }
}

// Response Wrappers
export interface UserResponse {
    user: User
}

export interface ArticleResponse {
    article: Article
}

export interface ArticlesResponse {
    articles: Article[]
    articlesCount: number
}

export interface TagsResponse {
    tags: string[]
}

export interface ErrorResponse {
    errors: Record<string, string[]>
}

// HTTP Client
class ApiClient {
    private baseURL: string
    private token: string | null = null

    constructor(baseURL: string) {
        this.baseURL = baseURL
        this.loadToken()
    }

    private loadToken() {
        this.token = localStorage.getItem('token')
    }

    setToken(token: string) {
        this.token = token
        localStorage.setItem('token', token)
    }

    clearToken() {
        this.token = null
        localStorage.removeItem('token')
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        }

        if (this.token) {
            (config.headers as Record<string, string>)['Authorization'] = `Token ${this.token}`
        }

        const response = await fetch(url, config)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new ApiError(response.status, errorData)
        }

        return response.json()
    }

    // Authentication
    async login(credentials: LoginRequest): Promise<UserResponse> {
        const response = await this.request<UserResponse>('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
        this.setToken(response.user.token)
        return response
    }

    async register(userData: RegisterRequest): Promise<UserResponse> {
        const response = await this.request<UserResponse>('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
        this.setToken(response.user.token)
        return response
    }

    async getCurrentUser(): Promise<UserResponse> {
        return this.request<UserResponse>('/user')
    }

    // Articles
    async getArticles(params?: {
        tag?: string
        author?: string
        favorited?: string
        limit?: number
        offset?: number
    }): Promise<ArticlesResponse> {
        const searchParams = new URLSearchParams()

        if (params?.tag) searchParams.append('tag', params.tag)
        if (params?.author) searchParams.append('author', params.author)
        if (params?.favorited) searchParams.append('favorited', params.favorited)
        if (params?.limit) searchParams.append('limit', params.limit.toString())
        if (params?.offset) searchParams.append('offset', params.offset.toString())

        const query = searchParams.toString()
        return this.request<ArticlesResponse>(`/articles${query ? `?${query}` : ''}`)
    }

    async getFeedArticles(params?: {
        limit?: number
        offset?: number
    }): Promise<ArticlesResponse> {
        const searchParams = new URLSearchParams()

        if (params?.limit) searchParams.append('limit', params.limit.toString())
        if (params?.offset) searchParams.append('offset', params.offset.toString())

        const query = searchParams.toString()
        return this.request<ArticlesResponse>(`/articles/feed${query ? `?${query}` : ''}`)
    }

    async getArticle(slug: string): Promise<ArticleResponse> {
        return this.request<ArticleResponse>(`/articles/${slug}`)
    }

    async createArticle(articleData: CreateArticleRequest): Promise<ArticleResponse> {
        return this.request<ArticleResponse>('/articles', {
            method: 'POST',
            body: JSON.stringify(articleData),
        })
    }

    async updateArticle(slug: string, articleData: UpdateArticleRequest): Promise<ArticleResponse> {
        return this.request<ArticleResponse>(`/articles/${slug}`, {
            method: 'PUT',
            body: JSON.stringify(articleData),
        })
    }

    async deleteArticle(slug: string): Promise<void> {
        await this.request(`/articles/${slug}`, {
            method: 'DELETE',
        })
    }

    // Tags
    async getTags(): Promise<TagsResponse> {
        return this.request<TagsResponse>('/tags')
    }

    // Favorites
    async favoriteArticle(slug: string): Promise<ArticleResponse> {
        return this.request<ArticleResponse>(`/articles/${slug}/favorite`, {
            method: 'POST',
        })
    }

    async unfavoriteArticle(slug: string): Promise<ArticleResponse> {
        return this.request<ArticleResponse>(`/articles/${slug}/favorite`, {
            method: 'DELETE',
        })
    }
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public data: any
    ) {
        super(`API Error: ${status}`)
        this.name = 'ApiError'
    }

    get isValidationError() {
        return this.status === 422
    }

    get isUnauthorized() {
        return this.status === 401
    }

    get errors(): Record<string, string[]> {
        return this.data?.errors || {}
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)