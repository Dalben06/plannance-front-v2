import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import type { AuthSession } from '@/api/auth';
import SignUp from '@/views/pages/auth/SignUp.vue';

const { mockToastAdd, mockRouterPush, mockCreateUser, mockAuthenticateWithVanillaAccount } = vi.hoisted(() => ({
    mockToastAdd: vi.fn(),
    mockRouterPush: vi.fn().mockResolvedValue(undefined),
    mockCreateUser: vi.fn(),
    mockAuthenticateWithVanillaAccount: vi.fn()
}));

vi.mock('primevue/usetoast', () => ({
    useToast: () => ({ add: mockToastAdd })
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockRouterPush }),
    RouterLink: { template: '<a><slot /></a>' }
}));

vi.mock('@/api/user', () => ({
    createUser: mockCreateUser
}));

vi.mock('@/api/auth', () => ({
    authenticateWithVanillaAccount: mockAuthenticateWithVanillaAccount
}));

const mockAuthSession: AuthSession = {
    accessToken: 'tok123',
    expiresIn: 3600,
    tokenType: 'Bearer',
    user: { id: 'u1', name: 'John Doe', email: 'john@example.com', picture: null, emailVerified: false }
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

function mountSignUp() {
    const pinia = createPinia();
    setActivePinia(pinia);
    const wrapper = mount(SignUp, {
        global: {
            plugins: [pinia],
            stubs: {
                FloatingConfigurator: { template: '<div />' },
                RouterLink: { template: '<a><slot /></a>' },
                InputText: inputTextStub,
                Password: passwordStub,
                Button: buttonStub
            }
        }
    });
    return { wrapper, pinia };
}

async function fillForm(wrapper: ReturnType<typeof mountSignUp>['wrapper'], name: string, email: string, password: string) {
    const inputs = wrapper.findAll('input');
    await inputs[0].setValue(name);
    await inputs[1].setValue(email);
    await inputs[2].setValue(password);
}

async function submitAndFlush(wrapper: ReturnType<typeof mountSignUp>['wrapper']) {
    wrapper.find('form').trigger('submit');
    await vi.advanceTimersByTimeAsync(10); // advance past vee-validate's 5ms debounce
    await flushPromises();
}

describe('SignUp', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'] });
        vi.clearAllMocks();
        mockCreateUser.mockResolvedValue({ id: 'u1', name: 'John Doe', email: 'john@example.com', picture: null });
        mockAuthenticateWithVanillaAccount.mockResolvedValue(mockAuthSession);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('mounts without errors', () => {
        const { wrapper } = mountSignUp();
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find('form').exists()).toBe(true);
    });

    it('shows field validation errors when submitting empty form', async () => {
        const { wrapper } = mountSignUp();

        await submitAndFlush(wrapper);

        expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="email-error"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="password-error"]').exists()).toBe(true);
        expect(mockCreateUser).not.toHaveBeenCalled();
    });

    it('shows error toast when API fails', async () => {
        mockCreateUser.mockRejectedValue(new Error('Network error'));
        const { wrapper } = mountSignUp();

        await fillForm(wrapper, 'John Doe', 'john@example.com', 'secret123');
        await submitAndFlush(wrapper);

        expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it('calls createUser, auto-logins, shows success toast and redirects on happy path', async () => {
        const { wrapper, pinia } = mountSignUp();
        const auth = useAuthStore(pinia);

        await fillForm(wrapper, 'John Doe', 'john@example.com', 'secret123');
        await submitAndFlush(wrapper);

        expect(mockCreateUser).toHaveBeenCalledWith({ name: 'John Doe', email: 'john@example.com', password: 'secret123' });
        expect(mockAuthenticateWithVanillaAccount).toHaveBeenCalledWith('john@example.com', 'secret123');
        expect(auth.accessToken).toBe(mockAuthSession.accessToken);
        expect(auth.user?.email).toBe(mockAuthSession.user.email);
        expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
        expect(mockRouterPush).toHaveBeenCalledWith({ path: '/home/calendar' });
    });

    it('disables submit button while request is in flight', async () => {
        let resolveCreate!: (v: unknown) => void;
        mockCreateUser.mockReturnValue(new Promise((r) => (resolveCreate = r)));
        const { wrapper } = mountSignUp();

        await fillForm(wrapper, 'John Doe', 'john@example.com', 'secret123');
        wrapper.find('form').trigger('submit');
        await vi.advanceTimersByTimeAsync(10);
        await flushPromises();

        const button = wrapper.find('[data-testid="submit-button"]');
        expect(button.element.hasAttribute('disabled')).toBe(true);

        resolveCreate({ id: 'u1', name: 'John Doe', email: 'john@example.com', picture: null });
        await flushPromises();
    });
});
