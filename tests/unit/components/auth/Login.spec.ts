import type { AuthSession } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';
import Login from '@/views/pages/auth/Login.vue';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockRouterPush, mockAuthenticateWithVanillaAccount } = vi.hoisted(() => ({
    mockRouterPush: vi.fn().mockResolvedValue(undefined),
    mockAuthenticateWithVanillaAccount: vi.fn()
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockRouterPush }),
    RouterLink: { template: '<a><slot /></a>' }
}));

vi.mock('@/api/auth', () => ({
    authenticateWithVanillaAccount: mockAuthenticateWithVanillaAccount
}));

vi.mock('@/components/auth/GoogleAuth.vue', () => ({
    default: { template: '<div />' }
}));

const mockAuthSession: AuthSession = {
    accessToken: 'tok123',
    expiresIn: 3600,
    tokenType: 'Bearer',
    user: { id: 'u1', name: 'Jane Doe', email: 'jane@example.com', picture: null, emailVerified: true }
};

const inputTextStub = {
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
};

const passwordStub = {
    template: '<input type="password" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue'],
    emits: ['update:modelValue']
};

const buttonStub = {
    template: '<button :type="type || \'button\'" :disabled="disabled || loading" data-testid="submit-button">{{ label }}</button>',
    props: ['label', 'disabled', 'loading', 'type']
};

const messageStub = {
    template: '<div data-testid="login-error"><slot /></div>',
    props: ['severity']
};

function mountLogin() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(Login, {
        global: {
            plugins: [pinia],
            stubs: {
                FloatingConfigurator: { template: '<div />' },
                GoogleAuth: { template: '<div />' },
                RouterLink: { template: '<a><slot /></a>' },
                InputText: inputTextStub,
                Password: passwordStub,
                Button: buttonStub,
                Message: messageStub
            }
        }
    });
    return { wrapper, pinia };
}

async function fillForm(wrapper: ReturnType<typeof mountLogin>['wrapper'], email: string, password: string) {
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue(email);
    await inputs[1].setValue(password);
}

async function submitAndFlush(wrapper: ReturnType<typeof mountLogin>['wrapper']) {
    wrapper.find('form').trigger('submit');
    await vi.advanceTimersByTimeAsync(10); // advance past vee-validate's 5ms debounce
    await flushPromises();
}

describe('Login', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'] });
        vi.clearAllMocks();
        mockAuthenticateWithVanillaAccount.mockResolvedValue(mockAuthSession);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('mounts without errors', () => {
        const { wrapper } = mountLogin();
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('form').exists()).toBe(true);
    });

    it('shows field validation errors when submitting an empty form', async () => {
        const { wrapper } = mountLogin();

        await submitAndFlush(wrapper);

        expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="password-error"]').exists()).toBe(true);
        expect(mockAuthenticateWithVanillaAccount).not.toHaveBeenCalled();
    });

    it('shows email validation error for an invalid email format', async () => {
        const { wrapper } = mountLogin();

        await fillForm(wrapper, 'not-an-email', 'secret123');
        await submitAndFlush(wrapper);

        expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="email-error"]').text()).toContain('Invalid email address');
        expect(mockAuthenticateWithVanillaAccount).not.toHaveBeenCalled();
    });

    it('shows password validation error when password is too short', async () => {
        const { wrapper } = mountLogin();

        await fillForm(wrapper, 'jane@example.com', '123');
        await submitAndFlush(wrapper);

        expect(wrapper.find('[data-testid="password-error"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="password-error"]').text()).toContain('at least 6 characters');
        expect(mockAuthenticateWithVanillaAccount).not.toHaveBeenCalled();
    });

    it('calls authenticateWithVanillaAccount with correct args, sets session and redirects on happy path', async () => {
        const { wrapper, pinia } = mountLogin();
        const auth = useAuthStore(pinia);

        await fillForm(wrapper, 'jane@example.com', 'secret123');
        await submitAndFlush(wrapper);

        expect(mockAuthenticateWithVanillaAccount).toHaveBeenCalledWith('jane@example.com', 'secret123');
        expect(auth.accessToken).toBe(mockAuthSession.accessToken);
        expect(auth.user?.email).toBe(mockAuthSession.user.email);
        expect(mockRouterPush).toHaveBeenCalledWith({ path: '/home/calendar' });
    });

    it('shows inline error message when the API call fails', async () => {
        mockAuthenticateWithVanillaAccount.mockRejectedValue({ message: 'Invalid credentials', data: null });
        const { wrapper } = mountLogin();

        await fillForm(wrapper, 'jane@example.com', 'wrongpassword');
        await submitAndFlush(wrapper);

        expect(wrapper.find('[data-testid="login-error"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="login-error"]').text()).toContain('Invalid credentials');
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it('prefers the backend data.message over the generic error message', async () => {
        mockAuthenticateWithVanillaAccount.mockRejectedValue({
            message: 'Request failed with status code 401',
            data: { message: 'Email or password is incorrect' }
        });
        const { wrapper } = mountLogin();

        await fillForm(wrapper, 'jane@example.com', 'wrongpassword');
        await submitAndFlush(wrapper);

        expect(wrapper.find('[data-testid="login-error"]').text()).toContain('Email or password is incorrect');
    });

    it('falls back to a generic message when the error has no message', async () => {
        mockAuthenticateWithVanillaAccount.mockRejectedValue({});
        const { wrapper } = mountLogin();

        await fillForm(wrapper, 'jane@example.com', 'secret123');
        await submitAndFlush(wrapper);

        expect(wrapper.find('[data-testid="login-error"]').text()).toContain('Login failed. Please try again.');
    });

    it('clears the error message on a new submission attempt', async () => {
        mockAuthenticateWithVanillaAccount.mockRejectedValueOnce({ message: 'Invalid credentials' });
        mockAuthenticateWithVanillaAccount.mockResolvedValueOnce(mockAuthSession);
        const { wrapper } = mountLogin();

        await fillForm(wrapper, 'jane@example.com', 'wrongpassword');
        await submitAndFlush(wrapper);
        expect(wrapper.find('[data-testid="login-error"]').exists()).toBe(true);

        await submitAndFlush(wrapper);
        expect(wrapper.find('[data-testid="login-error"]').exists()).toBe(false);
    });

    it('does not call the API when only email is provided', async () => {
        const { wrapper } = mountLogin();

        const inputs = wrapper.findAll('input');
        await inputs[0].setValue('jane@example.com');
        await submitAndFlush(wrapper);

        expect(mockAuthenticateWithVanillaAccount).not.toHaveBeenCalled();
        expect(wrapper.find('[data-testid="password-error"]').exists()).toBe(true);
    });

    it('does not call the API when only password is provided', async () => {
        const { wrapper } = mountLogin();

        const inputs = wrapper.findAll('input');
        await inputs[1].setValue('secret123');
        await submitAndFlush(wrapper);

        expect(mockAuthenticateWithVanillaAccount).not.toHaveBeenCalled();
        expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(true);
    });
});
