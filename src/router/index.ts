import { env } from '@/config/env';
import AppLayout from '@/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import { calendarRouter } from './calendarRouter';
import { uiKitRouter } from './uiKitRouter';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            meta: { requiresAuth: false },
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/home',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                ...calendarRouter,
                ...(env.enableDebug ? uiKitRouter : [])
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    await authStore.hydrateSession();
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthenticated = authStore.isAuthenticated;

    if (requiresAuth && !isAuthenticated) {
        return { path: '/auth/login' };
    }

    if (to.name === 'auth' && isAuthenticated) {
        return { path: '/home' };
    }

    return true;
});

export default router;
