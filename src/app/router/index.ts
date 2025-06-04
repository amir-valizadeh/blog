// src/app/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Layouts
import AuthLayout from '@/shared/layouts/AuthLayout.vue'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import MainLayout from '@/shared/layouts/MainLayout.vue'

// Pages
import HomePage from '@/pages/home/HomePage.vue'
import SignInPage from '@/pages/auth/SignInPage.vue'
import SignUpPage from '@/pages/auth/SignUpPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import NewArticlePage from '@/pages/article/NewArticlePage.vue'
import EditArticlePage from '@/pages/article/EditArticlePage.vue'
import ArticleDetailPage from '@/pages/article/ArticleDetailPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'

// Route names enum for type safety
export enum RouteNames {
    Home = 'Home',
    SignIn = 'SignIn',
    SignUp = 'SignUp',
    Dashboard = 'Dashboard',
    NewArticle = 'NewArticle',
    EditArticle = 'EditArticle',
    ArticleDetail = 'ArticleDetail',
    Profile = 'Profile',
    NotFound = 'NotFound',
}



const routes: RouteRecordRaw[] = [
    // Main routes
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: RouteNames.Home,
                component: HomePage,
                meta: {
                    title: 'ArvanCloud Blog Dashboard',
                    description: 'Blog management dashboard for ArvanCloud challenge',
                    layout: 'main',
                },
            },
        ],
    },

    // Auth routes
    {
        path: '/auth',
        component: AuthLayout,
        meta: { requiresGuest: true, layout: 'auth' },
        children: [
            {
                path: 'signin',
                name: RouteNames.SignIn,
                component: SignInPage,
                meta: {
                    title: 'Sign In - ArvanCloud',
                    description: 'Sign in to your ArvanCloud blog dashboard',
                },
            },
            {
                path: 'signup',
                name: RouteNames.SignUp,
                component: SignUpPage,
                meta: {
                    title: 'Sign Up - ArvanCloud',
                    description: 'Create your ArvanCloud blog dashboard account',
                },
            },
            {
                path: '',
                redirect: '/auth/signin',
            },
        ],
    },

    {
        path: '/dashboard',
        component: DashboardLayout,
        meta: { requiresAuth: true, layout: 'dashboard' },
        children: [
            {
                path: '',
                name: RouteNames.Dashboard,
                component: DashboardPage,
                meta: {
                    title: 'Dashboard - ArvanCloud',
                    description: 'Manage your blog articles and content',
                },
            },
            {
                path: 'profile',
                name: RouteNames.Profile,
                component: ProfilePage,
                meta: {
                    title: 'Profile - ArvanCloud',
                    description: 'Manage your profile settings',
                },
            },
        ],
    },

    {
        path: '/article',
        component: DashboardLayout,
        meta: { requiresAuth: true, layout: 'dashboard' },
        children: [
            {
                path: 'new',
                name: RouteNames.NewArticle,
                component: NewArticlePage,
                meta: {
                    title: 'New Article - ArvanCloud',
                    description: 'Create a new blog article',
                },
            },
            {
                path: ':slug/edit',
                name: RouteNames.EditArticle,
                component: EditArticlePage,
                meta: {
                    title: 'Edit Article - ArvanCloud',
                    description: 'Edit your blog article',
                },
            },
            {
                path: ':slug',
                name: RouteNames.ArticleDetail,
                component: ArticleDetailPage,
                meta: {
                    title: 'Article Detail - ArvanCloud',
                    description: 'View article details',
                },
            },
        ],
    },

    // 404 catch all
    {
        path: '/:pathMatch(.*)*',
        name: RouteNames.NotFound,
        component: NotFoundPage,
        meta: {
            title: 'Page Not Found - ArvanCloud',
            description: 'The page you are looking for does not exist',
            layout: 'main',
        },
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
            return { top: 0 }
    },
})

// Auth utilities
const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token')
}

const redirectToAuth = () => {
    return { name: RouteNames.SignIn }
}

const redirectToDashboard = () => {
    return { name: RouteNames.Dashboard }
}

// Navigation guards
router.beforeEach((to, from, next) => {
    // Set document title
    if (to.meta.title) {
        document.title = `${to.meta.title }`
    }

    // Set meta description
    if (to.meta.description) {
        let metaDescription = document.querySelector('meta[name="description"]')
        if (!metaDescription) {
            metaDescription = document.createElement('meta')
            metaDescription.setAttribute('name', 'description')
            document.head.appendChild(metaDescription)
        }
        metaDescription.setAttribute('content', `${to.meta.description}`)
    }

    // Auth guards
    const authenticated = isAuthenticated()

    // Routes that require authentication
    if (to.meta.requiresAuth && !authenticated) {
        next(redirectToAuth())
        return
    }

    // Routes that require guest (not authenticated)
    if (to.meta.requiresGuest && authenticated) {
        next(redirectToDashboard())
        return
    }

    next()
})
export default router

