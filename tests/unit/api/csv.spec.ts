import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CsvImport, CsvUploadResponse, ResponseAPI } from '@/types/api.p';

vi.mock('@/api/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn()
    }
}));

import { http } from '@/api/http';
import { getImports, uploadCsvFile, updateImportRecord, confirmImport } from '@/api/csv';

const mockHttp = {
    get: vi.mocked(http.get),
    post: vi.mocked(http.post),
    put: vi.mocked(http.put)
};

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

describe('getImports', () => {
    beforeEach(() => {
        mockHttp.get.mockClear();
    });

    it('calls GET /api/v1/csv/import', async () => {
        const imports = [makeCsvImport()];
        mockHttp.get.mockResolvedValue({ data: { data: imports } as ResponseAPI<CsvImport[]> });

        const result = await getImports();

        expect(mockHttp.get).toHaveBeenCalledWith('/api/v1/csv/import');
        expect(result).toEqual(imports);
    });

    it('returns empty array when response has no items', async () => {
        mockHttp.get.mockResolvedValue({ data: { data: [] } as ResponseAPI<CsvImport[]> });

        const result = await getImports();

        expect(result).toEqual([]);
    });

    it('passes through multiple items from response', async () => {
        const imports = [makeCsvImport({ id: 'a' }), makeCsvImport({ id: 'b' })];
        mockHttp.get.mockResolvedValue({ data: { data: imports } as ResponseAPI<CsvImport[]> });

        const result = await getImports();

        expect(result).toHaveLength(2);
        expect(result).toEqual(imports);
    });
});

describe('uploadCsvFile', () => {
    beforeEach(() => {
        mockHttp.post.mockClear();
    });

    it('calls POST /api/v1/csv/mapped with FormData containing the file', async () => {
        const file = new File(['a,b,c'], 'test.csv', { type: 'text/csv' });
        const response: CsvUploadResponse = { id: 'new-import-1', columns: [{ name: 'title', type: 'string' }] };
        mockHttp.post.mockResolvedValue({ data: { data: response } as ResponseAPI<CsvUploadResponse> });

        const result = await uploadCsvFile(file);

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/csv/mapped', expect.any(FormData), {
            headers: { 'Content-Type': undefined }
        });
        expect(result).toEqual(response);
    });

    it('appends the file under the "file" key in FormData', async () => {
        const file = new File(['data'], 'upload.csv', { type: 'text/csv' });
        mockHttp.post.mockResolvedValue({
            data: { data: { id: 'x', columns: [] } } as ResponseAPI<CsvUploadResponse>
        });

        await uploadCsvFile(file);

        const formData = mockHttp.post.mock.calls[0][1] as FormData;
        expect(formData.get('file')).toBe(file);
    });

    it('returns id and columns from the response', async () => {
        const file = new File([''], 'test.csv');
        const response: CsvUploadResponse = {
            id: 'abc-123',
            columns: [
                { name: 'title', type: 'string' },
                { name: 'amount', type: 'number' }
            ]
        };
        mockHttp.post.mockResolvedValue({ data: { data: response } as ResponseAPI<CsvUploadResponse> });

        const result = await uploadCsvFile(file);

        expect(result.id).toBe('abc-123');
        expect(result.columns).toHaveLength(2);
    });

    it('rejects with 400 error when server returns 400', async () => {
        const file = new File(['bad'], 'bad.csv');
        const error = { status: 400, message: 'Bad Request', data: { message: 'Invalid file format' } };
        mockHttp.post.mockRejectedValue(error);

        await expect(uploadCsvFile(file)).rejects.toMatchObject({ status: 400 });
    });

    it('rejects with 500 error when server returns 500', async () => {
        const file = new File([''], 'test.csv');
        const error = { status: 500, message: 'Internal Server Error' };
        mockHttp.post.mockRejectedValue(error);

        await expect(uploadCsvFile(file)).rejects.toMatchObject({ status: 500 });
    });
});

describe('updateImportRecord (stub)', () => {
    it('resolves without error', async () => {
        await expect(updateImportRecord('id-1', {})).resolves.toBeUndefined();
    });
});

describe('confirmImport (stub)', () => {
    it('resolves without error', async () => {
        await expect(confirmImport('id-1')).resolves.toBeUndefined();
    });
});
