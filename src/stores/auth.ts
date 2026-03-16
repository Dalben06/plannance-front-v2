import { getCurrentUser, type AuthSession, type AuthenticatedUser } from '@/api/auth';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type AppUser = {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
};

const ACCESS_TOKEN_STORAGE_KEY = 'access_token';
const AUTH_USER_STORAGE_KEY = 'auth_user';

function canUseStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStoredAccessToken() {
    if (!canUseStorage()) return null;

    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    return token?.trim() ? token : null;
}

function readStoredUser(): AppUser | null {
    if (!canUseStorage()) return null;

    const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!rawUser) return null;

    try {
        const parsed = JSON.parse(rawUser) as Partial<AppUser>;
        if (typeof parsed.id !== 'string' || typeof parsed.email !== 'string') return null;

        return {
            id: parsed.id,
            name: parsed.name ?? parsed.email,
            email: parsed.email,
            avatarUrl: parsed.avatarUrl
        };
    } catch {
        window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
        return null;
    }
}

function persistAccessToken(accessToken: string | null) {
    if (!canUseStorage()) return;

    if (accessToken) {
        window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
        return;
    }

    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

function persistUser(user: AppUser | null) {
    if (!canUseStorage()) return;

    if (user) {
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
        return;
    }

    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

function mapAuthenticatedUser(user: AuthenticatedUser): AppUser {
    return {
        id: user.id,
        name: user.name ?? user.email ?? 'Google User',
        email: user.email ?? '',
        avatarUrl: user.picture ?? undefined
    };
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<AppUser | null>(readStoredUser());
    const accessToken = ref<string | null>(readStoredAccessToken());
    const isHydrating = ref(false);

    const isAuthenticated = computed(() => !!user.value || !!accessToken.value);

    function setUser(next: AppUser | null) {
        user.value = next;
    }

    function setSession(session: AuthSession) {
        accessToken.value = session.accessToken;
        persistAccessToken(session.accessToken);

        const nextUser = mapAuthenticatedUser(session.user);
        user.value = nextUser;
        persistUser(nextUser);
    }

    async function hydrateSession() {
        if (user.value || !accessToken.value || isHydrating.value) return;

        isHydrating.value = true;

        try {
            const currentUser = await getCurrentUser();
            const nextUser = mapAuthenticatedUser(currentUser);
            user.value = nextUser;
            persistUser(nextUser);
        } catch {
            logout();
        } finally {
            isHydrating.value = false;
        }
    }

    function logout() {
        user.value = null;
        accessToken.value = null;
        persistUser(null);
        persistAccessToken(null);
    }

    return {
        accessToken,
        user,
        isAuthenticated,
        hydrateSession,
        setUser,
        setSession,
        logout
    };
});
