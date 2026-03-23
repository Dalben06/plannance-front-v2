<script setup lang="ts">
import { authenticateWithVanillaAccount } from '@/api/auth';
import GoogleAuth from '@/components/auth/GoogleAuth.vue';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/stores/auth';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const loginSchema = toTypedSchema(
    yup.object({
        email: yup.string().email('Invalid email address').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    })
);

const { handleSubmit: handleLoginSubmit, defineField: defineLoginField, isSubmitting, errors } = useForm({ validationSchema: loginSchema });

const [loginEmail] = defineLoginField('email');
const [loginPassword] = defineLoginField('password');

const router = useRouter();
const auth = useAuthStore();
const loginError = ref<string | null>(null);

const onLogin = handleLoginSubmit(async (values) => {
    loginError.value = null;
    try {
        const authUser = await authenticateWithVanillaAccount(values.email, values.password);
        auth.setSession(authUser);
        await router.push({ path: '/home/calendar' });
    } catch (error: any) {
        loginError.value = error?.data?.message ?? error?.message ?? 'Login failed. Please try again.';
    }
});
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/plannance.svg" alt="" srcset="" class="mb-8 w-16 shrink-0 mx-auto" />

                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Plannance!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>
                    <GoogleAuth />
                    <form @submit.prevent="onLogin">
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-1" v-model.trim="loginEmail" />
                        <small v-if="errors.email" class="text-red-500 block mb-6" data-testid="email-error">{{ errors.email }}</small>
                        <div v-else class="mb-6"></div>

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="loginPassword" placeholder="Password" :toggleMask="true" class="mb-1" fluid :feedback="false"></Password>
                        <small v-if="errors.password" class="text-red-500 block mb-6" data-testid="password-error">{{ errors.password }}</small>
                        <div v-else class="mb-6"></div>

                        <Button label="Sign In" class="w-full" type="submit" :loading="isSubmitting" :disabled="isSubmitting" data-testid="submit-button"></Button>
                        <Message v-if="loginError" severity="error" class="mt-3 w-full" data-testid="login-error">{{ loginError }}</Message>
                    </form>
                    <div class="text-center mt-6">
                        <span class="text-muted-color">Don't have an account? </span>
                        <RouterLink to="/auth/signup" class="text-primary font-medium">Sign up</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
