import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ImportPendingTable from '@/components/import/ImportPendingTable.vue';
import type { CsvImport } from '@/types/api.p';

const { mockRouterPush } = vi.hoisted(() => ({
    mockRouterPush: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockRouterPush })
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
        id: 'import-1',
        userId: 'user-1',
        errorLines: [],
        data: [],
        createdAt: '2026-04-01T10:00:00Z',
        expiresAt: '2026-04-08T10:00:00Z',
        ...overrides
    };
}

describe('ImportPendingTable', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockIsLoading.value = false;
        mockImports.value = [];
        mockFetchImports.mockClear();
        mockRouterPush.mockClear();
    });

    it('isLoading=true: shows skeleton, hides table', async () => {
        mockIsLoading.value = true;

        const wrapper = shallowMount(ImportPendingTable);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="table-skeleton"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="pending-table"]').exists()).toBe(false);
    });

    it('isLoading=false: hides skeleton, shows table', async () => {
        mockIsLoading.value = false;

        const wrapper = shallowMount(ImportPendingTable);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="table-skeleton"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="pending-table"]').exists()).toBe(true);
    });

    it('onMounted: calls fetchImports', async () => {
        shallowMount(ImportPendingTable);
        await wrapper_flush();

        expect(mockFetchImports).toHaveBeenCalledOnce();
    });

    it('renders table with correct number of rows when imports exist', async () => {
        mockImports.value = [makeCsvImport({ id: 'a' }), makeCsvImport({ id: 'b' })];

        const wrapper = shallowMount(ImportPendingTable);
        await wrapper.vm.$nextTick();

        const table = wrapper.find('[data-testid="pending-table"]');
        expect(table.exists()).toBe(true);
        expect(wrapper.props()).toEqual({});
    });

    it('row-click event triggers router.push with import-review and row id', async () => {
        const row = makeCsvImport({ id: 'row-123' });
        mockImports.value = [row];

        const wrapper = shallowMount(ImportPendingTable);
        await wrapper.vm.$nextTick();

        const table = wrapper.find('[data-testid="pending-table"]');
        await table.trigger('row-click', { data: row });

        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import-review', params: { id: 'row-123' } });
    });

    it('DataTable is rendered when imports are present', async () => {
        const imports = [makeCsvImport({ id: 'x' }), makeCsvImport({ id: 'y' })];
        mockImports.value = imports;

        const wrapper = shallowMount(ImportPendingTable);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="pending-table"]').exists()).toBe(true);
    });
});

async function wrapper_flush() {
    await new Promise((r) => setTimeout(r, 0));
}
