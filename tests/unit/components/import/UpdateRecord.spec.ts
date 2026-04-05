import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

const { mockGetImportById, mockUpdateImportRecord } = vi.hoisted(() => ({
    mockGetImportById: vi.fn(),
    mockUpdateImportRecord: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('@/api/csv', () => ({
    getImportById: mockGetImportById,
    updateImportRecord: mockUpdateImportRecord
}));

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
        mockGetImportById.mockClear();
        mockUpdateImportRecord.mockClear();
        mockRouterPush.mockClear();
        mockRouteParams.id = 'import-abc';
    });

    it('isLoading=true: shows skeleton, hides table', async () => {
        mockGetImportById.mockReturnValue(new Promise(() => {}));

        const wrapper = shallowMount(UpdateRecord);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="records-skeleton"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(false);
    });

    it('isLoading=false with matching import: shows table', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());

        const wrapper = shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="records-skeleton"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(true);
    });

    it('isLoading=false with no data: shows empty table without crash', async () => {
        mockGetImportById.mockResolvedValue(null);

        const wrapper = shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(true);
    });

    it('DataTable is rendered when matching import data exists', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());

        const wrapper = shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="records-table"]').exists()).toBe(true);
    });

    it('clicking Next navigates to import-confirm with current id', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());

        const wrapper = shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        await wrapper.find('[data-testid="next-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import-confirm', params: { id: 'import-abc' } });
    });

    it('onMounted: calls getImportById with route id', async () => {
        mockGetImportById.mockResolvedValue(makeCsvImport());

        shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        expect(mockGetImportById).toHaveBeenCalledWith('import-abc');
    });

    it('onMounted: calls getImportById with updated route id', async () => {
        mockRouteParams.id = 'import-xyz';
        mockGetImportById.mockResolvedValue(makeCsvImport({ id: 'import-xyz' }));

        shallowMount(UpdateRecord);
        await new Promise((r) => setTimeout(r, 0));

        expect(mockGetImportById).toHaveBeenCalledWith('import-xyz');
    });
});
