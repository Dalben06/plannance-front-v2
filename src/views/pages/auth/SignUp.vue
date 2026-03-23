<script setup lang="ts">
import { authenticateWithVanillaAccount } from '@/api/auth';
import { createUser } from '@/api/user';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useAuthStore } from '@/stores/auth';
import { toTypedSchema } from '@vee-validate/yup';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

const signUpSchema = toTypedSchema(
    yup.object({
        name: yup.string().min(1, 'Name is required').required('Name is required'),
        email: yup.string().email('Invalid email address').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
    })
);

const { handleSubmit, defineField, errors, isSubmitting } = useForm({ validationSchema: signUpSchema });

const [name] = defineField('name');
const [email] = defineField('email');
const [password] = defineField('password');

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const onSignUp = handleSubmit(async (values) => {
    try {
        await createUser({ name: values.name, email: values.email, password: values.password });
        const authUser = await authenticateWithVanillaAccount(values.email, values.password);
        auth.setSession(authUser);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Account created successfully!', life: 3000 });
        await router.push({ path: '/home/calendar' });
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create account. Please try again.', life: 4000 });
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
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create your account</div>
                        <span class="text-muted-color font-medium">Sign up to get started</span>
                    </div>
                    <form @submit.prevent="onSignUp">
                        <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Name</label>
                        <InputText id="name" type="text" placeholder="Full name" class="w-full md:w-[30rem] mb-1" v-model.trim="name" data-testid="name-input" />
                        <small v-if="errors.name" class="text-red-500 block mb-6" data-testid="name-error">{{ errors.name }}</small>
                        <div v-else class="mb-6"></div>

                        <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-1" v-model.trim="email" data-testid="email-input" />
                        <small v-if="errors.email" class="text-red-500 block mb-6" data-testid="email-error">{{ errors.email }}</small>
                        <div v-else class="mb-6"></div>

                        <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password" v-model="password" placeholder="Password" :toggleMask="true" class="mb-1" fluid :feedback="false" data-testid="password-input"></Password>
                        <small v-if="errors.password" class="text-red-500 block mb-6" data-testid="password-error">{{ errors.password }}</small>
                        <div v-else class="mb-6"></div>

                        <Button label="Create Account" class="w-full" type="submit" :disabled="isSubmitting" :loading="isSubmitting" data-testid="submit-button"></Button>
                    </form>
                    <div class="text-center mt-6">
                        <span class="text-muted-color">Already have an account? </span>
                        <RouterLink to="/auth/login" class="text-primary font-medium">Sign in</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
