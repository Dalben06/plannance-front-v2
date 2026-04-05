import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImportView from '@/views/ImportView.vue';

const { mockRouterPush } = vi.hoisted(() => ({
    mockRouterPush: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        useRouter: () => ({ push: mockRouterPush })
    };
});

describe('ImportView', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockRouterPush.mockClear();
    });

    it('renders New Import button', async () => {
        const wrapper = shallowMount(ImportView);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="new-import-button"]').exists()).toBe(true);
    });

    it('clicking New Import button navigates to import-register', async () => {
        const wrapper = shallowMount(ImportView);
        await wrapper.vm.$nextTick();

        await wrapper.find('[data-testid="new-import-button"]').trigger('click');

        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import-register' });
    });

    it('renders ImportPendingTable stub', async () => {
        const wrapper = shallowMount(ImportView);
        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent({ name: 'ImportPendingTable' }).exists()).toBe(true);
    });
});
