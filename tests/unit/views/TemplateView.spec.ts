import type { TemplateResponse } from '@/types/api.p';
import TemplateView from '@/views/TemplateView.vue';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockRouterBack, mockRouterPush } = vi.hoisted(() => ({
    mockRouterBack: vi.fn(),
    mockRouterPush: vi.fn().mockResolvedValue(undefined)
}));

const mockRouteParams = vi.hoisted(() => ({ id: undefined as string | undefined }));

vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('vue-router')>();
    return {
        ...actual,
        useRoute: () => ({ params: mockRouteParams }),
        useRouter: () => ({ back: mockRouterBack, push: mockRouterPush })
    };
});

const { mockFetchTemplateById } = vi.hoisted(() => ({
    mockFetchTemplateById: vi.fn()
}));

vi.mock('@/stores/template', () => ({
    useTemplateStore: () => ({
        fetchTemplateById: mockFetchTemplateById
    })
}));

function makeTemplateResponse(overrides: Partial<TemplateResponse> = {}): TemplateResponse {
    return {
        id: 'template-1',
        userId: 'user-1',
        name: 'Bank Statement',
        mappings: [
            { from: 'Date', to: 'startAt' },
            { from: 'Amount', to: 'amount' },
            { from: 'Description', to: 'title' }
        ],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
        ...overrides
    };
}

describe('TemplateView', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockRouterBack.mockClear();
        mockRouterPush.mockClear();
        mockFetchTemplateById.mockClear();
        mockRouteParams.id = undefined;
    });

    describe('new template mode', () => {
        it('shows "New Template" as page title', () => {
            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            expect(wrapper.find('[data-testid="page-title"]').text()).toBe('New Template');
        });

        it('renders the TemplateForm without loading skeleton', () => {
            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            expect(wrapper.find('[data-testid="loading-skeleton"]').exists()).toBe(false);
        });

        it('does not call fetchTemplateById', () => {
            shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            expect(mockFetchTemplateById).not.toHaveBeenCalled();
        });

        it('renders back button', () => {
            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            expect(wrapper.find('[data-testid="back-button"]').exists()).toBe(true);
        });

        it('calls router.back() when back button clicked', async () => {
            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            await wrapper.find('[data-testid="back-button"]').trigger('click');
            expect(mockRouterBack).toHaveBeenCalled();
        });
    });

    describe('edit template mode', () => {
        beforeEach(() => {
            mockRouteParams.id = 'template-1';
        });

        it('shows "Edit Template" as page title', async () => {
            mockFetchTemplateById.mockResolvedValue(makeTemplateResponse());
            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            await flushPromises();
            expect(wrapper.find('[data-testid="page-title"]').text()).toBe('Edit Template');
        });

        it('shows loading skeleton while fetching', async () => {
            let resolve!: (v: TemplateResponse) => void;
            mockFetchTemplateById.mockReturnValue(new Promise<TemplateResponse>((r) => (resolve = r)));

            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-testid="loading-skeleton"]').exists()).toBe(true);

            resolve(makeTemplateResponse());
            await flushPromises();

            expect(wrapper.find('[data-testid="loading-skeleton"]').exists()).toBe(false);
        });

        it('calls fetchTemplateById with the route id', async () => {
            mockFetchTemplateById.mockResolvedValue(makeTemplateResponse());
            shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            await flushPromises();
            expect(mockFetchTemplateById).toHaveBeenCalledWith('template-1');
        });

        it('shows load error when fetch fails', async () => {
            mockFetchTemplateById.mockRejectedValue(new Error('Network error'));
            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            await flushPromises();
            expect(wrapper.find('[data-testid="load-error"]').exists()).toBe(true);
        });
    });

    describe('after save', () => {
        it('navigates to import-register after saved event', async () => {
            const wrapper = shallowMount(TemplateView, { global: { plugins: [createPinia()] } });
            await wrapper.findComponent({ name: 'TemplateForm' }).vm.$emit('saved');
            expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import-register' });
        });
    });
});
