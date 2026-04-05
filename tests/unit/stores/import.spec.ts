import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useImportStore } from '@/stores/import';
import type { CsvImport } from '@/types/api.p';

vi.mock('@/api/csv', () => ({
    getImports: vi.fn()
}));

import { getImports } from '@/api/csv';

const mockGetImports = vi.mocked(getImports);

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

describe('useImportStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockGetImports.mockResolvedValue([]);
    });

    it('initial state: imports=[], isLoading=false', () => {
        const store = useImportStore();
        expect(store.imports).toEqual([]);
        expect(store.isLoading).toBe(false);
    });

    it('fetchImports: sets imports from API response (non-expired)', async () => {
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const item = makeCsvImport({ id: 'a', expiresAt: futureDate });
        mockGetImports.mockResolvedValue([item]);

        const store = useImportStore();
        await store.fetchImports();

        expect(store.imports).toHaveLength(1);
        expect(store.imports[0].id).toBe('a');
    });

    it('fetchImports: filters out expired items', async () => {
        const pastDate = new Date(Date.now() - 1000).toISOString();
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        mockGetImports.mockResolvedValue([makeCsvImport({ id: 'expired', expiresAt: pastDate }), makeCsvImport({ id: 'valid', expiresAt: futureDate })]);

        const store = useImportStore();
        await store.fetchImports();

        expect(store.imports).toHaveLength(1);
        expect(store.imports[0].id).toBe('valid');
    });

    it('fetchImports: filters out all items if all are expired', async () => {
        const pastDate = new Date(Date.now() - 1000).toISOString();
        mockGetImports.mockResolvedValue([makeCsvImport({ id: 'a', expiresAt: pastDate }), makeCsvImport({ id: 'b', expiresAt: pastDate })]);

        const store = useImportStore();
        await store.fetchImports();

        expect(store.imports).toHaveLength(0);
    });

    it('fetchImports: sorts by createdAt descending (newest first)', async () => {
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        mockGetImports.mockResolvedValue([
            makeCsvImport({ id: 'oldest', createdAt: '2026-03-01T00:00:00Z', expiresAt: futureDate }),
            makeCsvImport({ id: 'newest', createdAt: '2026-04-01T00:00:00Z', expiresAt: futureDate }),
            makeCsvImport({ id: 'middle', createdAt: '2026-03-15T00:00:00Z', expiresAt: futureDate })
        ]);

        const store = useImportStore();
        await store.fetchImports();

        expect(store.imports.map((i) => i.id)).toEqual(['newest', 'middle', 'oldest']);
    });

    it('fetchImports: sets isLoading=true while pending, false after resolve', async () => {
        let resolvePromise!: (value: CsvImport[]) => void;
        mockGetImports.mockReturnValue(new Promise((r) => (resolvePromise = r)));

        const store = useImportStore();
        const fetchPromise = store.fetchImports();

        expect(store.isLoading).toBe(true);

        resolvePromise([]);
        await fetchPromise;

        expect(store.isLoading).toBe(false);
    });

    it('fetchImports: sets isLoading=false even when API rejects', async () => {
        mockGetImports.mockRejectedValue(new Error('Network error'));

        const store = useImportStore();
        await expect(store.fetchImports()).rejects.toThrow();

        expect(store.isLoading).toBe(false);
    });

    it('fetchImports: sets imports=[] on empty response', async () => {
        mockGetImports.mockResolvedValue([]);

        const store = useImportStore();
        await store.fetchImports();

        expect(store.imports).toEqual([]);
    });
});
