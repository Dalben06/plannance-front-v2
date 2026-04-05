import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

const { mockGetImportById, mockConfirmImport } = vi.hoisted(() => ({
    mockGetImportById: vi.fn(),
    mockConfirmImport: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('@/api/csv', () => ({
    getImportById: mockGetImportById,
    confirmImport: mockConfirmImport
}));

vi.mock('primevue', async (importOriginal) => {
    const actual = await importOriginal<typeof import('primevue')>();
    return {
        ...actual,
        useToast: () => ({ add: vi.fn() })
    };
});

function makeCsvImport(overrides: Partial<CsvImport> = {}): CsvImport {
    return {
        id: 'import-xyz',
        userId: 'user-1',
        errorsLines: [1, 3],
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
        mockGetImportById.mockClear();
        mockConfirmImport.mockClear();
        mockRouterPush.mockClear();
        mockRouteParams.id = 'import-xyz';
    });

    it('renders confirm button', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());
        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="confirm-button"]').exists()).toBe(true);
    });

    it('shows total records count from currentImport', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());
        const wrapper = shallowMount(ConfirmImportRecords);
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="total-records"]').text()).toBe('3');
    });

    it('shows 0 records when import has no data', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport({ data: [], errorsLines: [] }));
        const wrapper = shallowMount(ConfirmImportRecords);
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="total-records"]').text()).toBe('0');
    });

    it('confirm button click navigates to import page', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());
        const wrapper = shallowMount(ConfirmImportRecords);
        await new Promise((r) => setTimeout(r, 0));

        await wrapper.find('[data-testid="confirm-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import' });
    });

    it('no confirm error shown initially', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());
        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="confirm-error"]').exists()).toBe(false);
    });

    it('shows confirm error when router.push rejects', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());
        mockRouterPush.mockRejectedValueOnce(new Error('Navigation failed'));
        const wrapper = shallowMount(ConfirmImportRecords);
        await new Promise((r) => setTimeout(r, 0));

        await wrapper.find('[data-testid="confirm-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="confirm-error"]').exists()).toBe(true);
    });

    it('DataTable receives currentImport data', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());
        const wrapper = shallowMount(ConfirmImportRecords);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="confirm-table"]').exists()).toBe(true);
    });
});
