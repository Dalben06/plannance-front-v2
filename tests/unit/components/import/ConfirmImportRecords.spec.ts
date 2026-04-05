import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import ConfirmImportRecords from '@/components/import/ConfirmImportRecords.vue';
import type { CsvImport } from '@/types/api.p';

const { mockRouterPush, mockRouteParams } = vi.hoisted(() => ({
    mockRouterPush: vi.fn().mockResolvedValue(undefined),
    mockRouteParams: { id: 'import-xyz' }
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockRouterPush }),
    useRoute: () => ({ params: mockRouteParams })
}));

const mockImports = ref<CsvImport[]>([]);

vi.mock('@/stores/import', () => ({
    useImportStore: () => ({
        imports: mockImports
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
        id: 'import-xyz',
        userId: 'user-1',
        errorLines: [1, 3],
        data: [
            { id: 'r1', title: 'Salary', start: '2026-04-01', amount: 3000, type: 'credit' },
            { id: 'r2', title: 'Rent', start: '2026-04-05', amount: 1200, type: 'debit' },
            { id: 'r3', title: 'Groceries', start: '2026-04-06', amount: 200, type: 'debit' }
        ],
        createdAt: '2026-04-01T10:00:00Z',
        expiresAt: '2026-04-08T10:00:00Z',
        ...overrides
    };
}

describe('ConfirmImportRecords', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockImports.value = [];
        mockRouterPush.mockClear();
        mockRouteParams.id = 'import-xyz';
    });

    it('renders confirm button', async () => {
        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="confirm-button"]').exists()).toBe(true);
    });

    it('shows total records count from currentImport', async () => {
        mockImports.value = [makeCsvImport()];

        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="total-records"]').text()).toBe('3');
    });

    it('shows total errors count from currentImport', async () => {
        mockImports.value = [makeCsvImport()];

        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="total-errors"]').text()).toBe('2');
    });

    it('shows 0 records and 0 errors when no import found', async () => {
        mockImports.value = [];

        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="total-records"]').text()).toBe('0');
        expect(wrapper.find('[data-testid="total-errors"]').text()).toBe('0');
    });

    it('confirm button click navigates to import page', async () => {
        mockImports.value = [makeCsvImport()];

        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        await wrapper.find('[data-testid="confirm-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import' });
    });

    it('no confirm error shown initially', async () => {
        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="confirm-error"]').exists()).toBe(false);
    });

    it('shows confirm error when router.push rejects', async () => {
        mockRouterPush.mockRejectedValueOnce(new Error('Navigation failed'));
        mockImports.value = [makeCsvImport()];

        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        await wrapper.find('[data-testid="confirm-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="confirm-error"]').exists()).toBe(true);
    });

    it('DataTable receives currentImport data', async () => {
        const importItem = makeCsvImport();
        mockImports.value = [importItem];

        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        const table = wrapper.find('[data-testid="confirm-table"]');
        expect(table.exists()).toBe(true);
    });
});
