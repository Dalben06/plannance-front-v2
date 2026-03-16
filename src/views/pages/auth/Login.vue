<script setup lang="ts">
import { authenticateWithVanillaAccount } from '@/api/auth';
import GoogleAuth from '@/components/auth/GoogleAuth.vue';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/stores/auth';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const loginSchema = toTypedSchema(
    yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required()
    })
);

const { handleSubmit: handleLoginSubmit, defineField: defineLoginField } = useForm({ validationSchema: loginSchema });

const [loginEmail] = defineLoginField('email');
const [loginPassword] = defineLoginField('password');

const router = useRouter();
const auth = useAuthStore();

const onLogin = handleLoginSubmit((values) => {
    authenticateWithVanillaAccount(values.email, values.password)
        .then(async (authUser) => {
            auth.setSession(authUser);
            await router.push({ path: '/home/calendar' });
        })
        .catch((error) => {
            console.error('Login failed:', error);
        });
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
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model.trim="loginEmail" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="loginPassword" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Button label="Sign In" class="w-full" type="submit"></Button>
                    </form>
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
