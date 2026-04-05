import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import UpdateRecord from '@/components/import/UpdateRecord.vue';
import type { CsvImport } from '@/types/api.p';

const { mockRouterPush, mockRouteParams } = vi.hoisted(() => ({
    mockRouterPush: vi.fn().mockResolvedValue(undefined),
    mockRouteParams: { id: 'import-abc' }
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockRouterPush }),
    useRoute: () => ({ params: mockRouteParams })
}));

const mockFetchImports = vi.fn();
const mockIsLoading = ref(false);
const mockImports = ref<CsvImport[]>([]);

vi.mock('@/stores/import', () => ({
    useImportStore: () => ({
        imports: mockImports,
        isLoading: mockIsLoading,
        fetchImports: mockFetchImports
    })
}));

vi.mock('pinia', async (importOriginal) => {
    const actual = await importOriginal<typeof import('pinia')>();
    return {
        ...actual,
        storeToRefs: (store: unknown) => store
    };
});

function makeCsvImport(overrides: Partial<CsvImport> = {}): CsvImport {
    return {
        id: 'import-abc',
        userId: 'user-1',
        errorLines: [],
        data: [
            { id: 'r1', title: 'Salary', start: '2026-04-01', amount: 3000, type: 'credit' },
            { id: 'r2', title: 'Rent', start: '2026-04-05', amount: 1200, type: 'debit' }
        ],
        createdAt: '2026-04-01T10:00:00Z',
        expiresAt: '2026-04-08T10:00:00Z',
        ...overrides
    };
}

describe('UpdateRecord', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockIsLoading.value = false;
        mockImports.value = [];
        mockFetchImports.mockClear();
        mockRouterPush.mockClear();
        mockRouteParams.id = 'import-abc';
    });

    it('isLoading=true: shows skeleton, hides table', async () => {
        mockIsLoading.value = true;
        mockImports.value = [makeCsvImport()];

        const wrapper = shallowMount(UpdateRecord);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="records-skeleton"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(false);
    });

    it('isLoading=false with matching import: shows table', async () => {
        mockIsLoading.value = false;
        mockImports.value = [makeCsvImport()];

        const wrapper = shallowMount(UpdateRecord);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="records-skeleton"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(true);
    });

    it('isLoading=false with no matching import: shows empty table without crash', async () => {
        mockIsLoading.value = false;
        mockImports.value = [];

        const wrapper = shallowMount(UpdateRecord);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(true);
    });

    it('DataTable is rendered when matching import data exists', async () => {
        const importItem = makeCsvImport();
        mockImports.value = [importItem];

        const wrapper = shallowMount(UpdateRecord);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(true);
    });

    it('clicking Next navigates to import-confirm with current id', async () => {
        mockImports.value = [makeCsvImport()];

        const wrapper = shallowMount(UpdateRecord);
        await wrapper.vm.$nextTick();

        await wrapper.find('[data-testid="next-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import-confirm', params: { id: 'import-abc' } });
    });

    it('onMounted: calls fetchImports when imports is empty', async () => {
        mockImports.value = [];

        shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        expect(mockFetchImports).toHaveBeenCalledOnce();
    });

    it('onMounted: does not call fetchImports when imports already loaded', async () => {
        mockImports.value = [makeCsvImport()];

        shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        expect(mockFetchImports).not.toHaveBeenCalled();
    });
});
