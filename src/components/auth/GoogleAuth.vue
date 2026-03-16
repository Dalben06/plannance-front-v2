<script lang="ts" setup>
import { authenticateWithGoogle } from '@/api/auth';
import { features } from '@/config/env';
import { useAuthStore } from '@/stores/auth';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const GOOGLE_SCRIPT_SELECTOR = 'script[src*="accounts.google.com/gsi/client"]';

const auth = useAuthStore();
const router = useRouter();

const buttonHostRef = ref<HTMLElement | null>(null);
const errorMessage = ref('');
const isLoading = ref(false);

let isMounted = true;

function getGoogleAccounts() {
    return window.google?.accounts?.id;
}

function getErrorMessage(error: unknown) {
    if (typeof error === 'object' && error && 'data' in error) {
        const apiError = (error as { data?: { error?: string } }).data?.error;
        if (typeof apiError === 'string' && apiError.trim()) {
            return apiError;
        }
    }

    if (typeof error === 'object' && error && 'message' in error) {
        const message = (error as { message?: string }).message;
        if (typeof message === 'string' && message.trim()) {
            return message;
        }
    }

    return 'Google sign-in failed. Please try again.';
}

function waitForGoogleIdentity() {
    if (getGoogleAccounts()) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        const script = document.querySelector<HTMLScriptElement>(GOOGLE_SCRIPT_SELECTOR);

        if (!script) {
            reject(new Error('Google sign-in script is missing.'));
            return;
        }

        const onLoad = () => {
            cleanup();

            if (getGoogleAccounts()) {
                resolve();
                return;
            }

            reject(new Error('Google sign-in is unavailable right now.'));
        };

        const onError = () => {
            cleanup();
            reject(new Error('Google sign-in script failed to load.'));
        };

        const cleanup = () => {
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
        };

        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
    });
}

async function onGoogleCredential(response: GoogleCredentialResponse) {
    if (!response.credential) {
        errorMessage.value = 'Google did not return a valid login token.';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
        const session = await authenticateWithGoogle(response.credential);

        if (!isMounted) return;

        auth.setSession(session);
        await router.push({ path: '/home/calendar' });
    } catch (error) {
        if (!isMounted) return;
        errorMessage.value = getErrorMessage(error);
    } finally {
        if (isMounted) {
            isLoading.value = false;
        }
    }
}

async function renderGoogleButton() {
    const googleClientId = features.googleAuth;
    if (!googleClientId) {
        errorMessage.value = 'Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.';
        return;
    }

    try {
        await waitForGoogleIdentity();

        if (!isMounted || !buttonHostRef.value) return;

        const googleAccounts = getGoogleAccounts();
        if (!googleAccounts) {
            errorMessage.value = 'Google sign-in is unavailable right now.';
            return;
        }

        errorMessage.value = '';

        googleAccounts.initialize({
            client_id: googleClientId,
            callback: (response) => {
                void onGoogleCredential(response);
            },
            cancel_on_tap_outside: false
        });

        buttonHostRef.value.innerHTML = '';
        googleAccounts.renderButton(buttonHostRef.value, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            logo_alignment: 'left',
            width: buttonHostRef.value.offsetWidth || 360
        });
    } catch (error) {
        if (!isMounted) return;
        errorMessage.value = getErrorMessage(error);
    }
}

onMounted(() => {
    void renderGoogleButton();
});

onBeforeUnmount(() => {
    isMounted = false;
});
</script>

<template>
    <section class="mt-6 space-y-3">
        <div ref="buttonHostRef" class="google-button-host flex min-h-10 w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-2 py-1" :class="{ 'pointer-events-none opacity-70': isLoading }" />

        <p v-if="isLoading" class="text-center text-xs font-semibold text-white/60">Signing you in...</p>
        <p v-if="errorMessage" class="text-center text-sm font-semibold text-rose-300" aria-live="polite">
            {{ errorMessage }}
        </p>
    </section>
</template>

<style scoped>
.google-button-host:empty::before {
    color: rgba(233, 238, 252, 0.65);
    content: 'Loading Google sign-in...';
    font-size: 0.875rem;
    font-weight: 600;
}
</style>
