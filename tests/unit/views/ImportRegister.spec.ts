import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImportRegister from '@/views/ImportRegister.vue';
import { RouterViewStub } from '@tests/stubs';

const mockRouteName = { value: 'import-register' };

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        useRoute: () => ({ name: mockRouteName.value })
    };
});

function mountComponent() {
    return shallowMount(ImportRegister, {
        global: { stubs: { RouterView: RouterViewStub } }
    });
}

describe('ImportRegister', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockRouteName.value = 'import-register';
    });

    it('renders Steps component', async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="import-steps"]').exists()).toBe(true);
    });

    it('stepIndex=0 when route.name is import-register', async () => {
        mockRouteName.value = 'import-register';

        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();

        const steps = wrapper.find('[data-testid="import-steps"]');
        expect(steps.attributes('active-step') ?? steps.attributes('activestep')).toBe('0');
    });

    it('stepIndex=1 when route.name is import-review', async () => {
        mockRouteName.value = 'import-review';

        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();

        const steps = wrapper.find('[data-testid="import-steps"]');
        expect(steps.attributes('active-step') ?? steps.attributes('activestep')).toBe('1');
    });

    it('stepIndex=2 when route.name is import-confirm', async () => {
        mockRouteName.value = 'import-confirm';

        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();

        const steps = wrapper.find('[data-testid="import-steps"]');
        expect(steps.attributes('active-step') ?? steps.attributes('activestep')).toBe('2');
    });

    it('renders router-view for step content', async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="router-view-stub"]').exists()).toBe(true);
    });
});
