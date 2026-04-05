import type { CsvImport, ResponseAPI, TemplateResponse } from '@/types/api.p';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/api/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn()
    }
}));

import { confirmImport, getImportById, getImports, getTemplates, newMap, updateImportRecord, uploadCsvFile } from '@/api/csv';
import { http } from '@/api/http';

const mockHttp = {
    get: vi.mocked(http.get),
    post: vi.mocked(http.post),
    put: vi.mocked(http.put)
};

function makeCsvImport(overrides: Partial<CsvImport> = {}): CsvImport {
    return {
        id: 'import-1',
        userId: 'user-1',
        errorsLines: [],
        data: [],
        createdAt: '2026-04-01T10:00:00Z',
        expiresAt: '2026-04-08T10:00:00Z',
        ...overrides
    };
}

function makeTemplateResponse(overrides: Partial<TemplateResponse> = {}): TemplateResponse {
    return {
        id: 'template-1',
        userId: 'user-1',
        name: 'My Template',
        mapping: { title: 'Title', amount: 'Amount' },
        createdAt: '2026-04-01T10:00:00Z',
        updatedAt: '2026-04-01T10:00:00Z',
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

describe('getImportById', () => {
    beforeEach(() => {
        mockHttp.get.mockClear();
    });

    it('calls GET /api/v1/csv/import/:id', async () => {
        const csvImport = makeCsvImport({ id: 'import-42' });
        mockHttp.get.mockResolvedValue({ data: csvImport });

        const result = await getImportById('import-42');

        expect(mockHttp.get).toHaveBeenCalledWith('/api/v1/csv/import/import-42');
        expect(result).toEqual(csvImport);
    });

    it('returns the import record from the response', async () => {
        const csvImport = makeCsvImport({ id: 'abc', userId: 'u-99' });
        mockHttp.get.mockResolvedValue({ data: csvImport });

        const result = await getImportById('abc');

        expect(result.id).toBe('abc');
        expect(result.userId).toBe('u-99');
    });
});

describe('uploadCsvFile', () => {
    beforeEach(() => {
        mockHttp.post.mockClear();
    });

    it('calls POST /api/v1/csv/import with FormData containing the file', async () => {
        const file = new File(['a,b,c'], 'test.csv', { type: 'text/csv' });
        mockHttp.post.mockResolvedValue({ data: makeCsvImport() });

        await uploadCsvFile(file, 'template-1');

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/csv/import', expect.any(FormData), {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    });

    it('appends the file under the "file" key in FormData', async () => {
        const file = new File(['data'], 'upload.csv', { type: 'text/csv' });
        mockHttp.post.mockResolvedValue({ data: makeCsvImport() });

        await uploadCsvFile(file, 'template-1');

        const formData = mockHttp.post.mock.calls[0][1] as FormData;
        expect(formData.get('file')).toBe(file);
    });

    it('appends templateId under the "templateId" key in FormData', async () => {
        const file = new File(['data'], 'upload.csv', { type: 'text/csv' });
        mockHttp.post.mockResolvedValue({ data: makeCsvImport() });

        await uploadCsvFile(file, 'template-99');

        const formData = mockHttp.post.mock.calls[0][1] as FormData;
        expect(formData.get('templateId')).toBe('template-99');
    });

    it('returns the CsvImport record from the response', async () => {
        const file = new File([''], 'test.csv');
        const csvImport = makeCsvImport({ id: 'new-import', userId: 'u-1' });
        mockHttp.post.mockResolvedValue({ data: csvImport });

        const result = await uploadCsvFile(file, 'template-1');

        expect(result).toEqual(csvImport);
    });

    it('rejects with 400 error when server returns 400', async () => {
        const file = new File(['bad'], 'bad.csv');
        const error = { status: 400, message: 'Bad Request', data: { message: 'Invalid file format' } };
        mockHttp.post.mockRejectedValue(error);

        await expect(uploadCsvFile(file, 'template-1')).rejects.toMatchObject({ status: 400 });
    });

    it('rejects with 500 error when server returns 500', async () => {
        const file = new File([''], 'test.csv');
        const error = { status: 500, message: 'Internal Server Error' };
        mockHttp.post.mockRejectedValue(error);

        await expect(uploadCsvFile(file, 'template-id')).rejects.toMatchObject({ status: 500 });
    });
});

describe('updateImportRecord', () => {
    beforeEach(() => {
        mockHttp.put.mockClear();
    });

    it('calls PUT /api/v1/csv/import/ with the payload', async () => {
        const payload = makeCsvImport({ id: 'import-1' });
        mockHttp.put.mockResolvedValue({ data: payload });

        await updateImportRecord(payload);

        expect(mockHttp.put).toHaveBeenCalledWith('/api/v1/csv/import/', payload);
    });

    it('resolves without returning a value', async () => {
        const payload = makeCsvImport();
        mockHttp.put.mockResolvedValue({ data: payload });

        const result = await updateImportRecord(payload);

        expect(result).toBeUndefined();
    });
});

describe('confirmImport', () => {
    beforeEach(() => {
        mockHttp.post.mockClear();
    });

    it('calls POST /api/v1/csv/confirm/:id', async () => {
        mockHttp.post.mockResolvedValue({ data: {} });

        await confirmImport('import-42');

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/csv/confirm/import-42');
    });

    it('resolves without returning a value', async () => {
        mockHttp.post.mockResolvedValue({ data: {} });

        const result = await confirmImport('import-1');

        expect(result).toBeUndefined();
    });
});

describe('getTemplates', () => {
    beforeEach(() => {
        mockHttp.get.mockClear();
    });

    it('calls GET /api/v1/csv/mapping', async () => {
        const templates = [makeTemplateResponse()];
        mockHttp.get.mockResolvedValue({ data: { data: templates } as ResponseAPI<TemplateResponse[]> });

        const result = await getTemplates();

        expect(mockHttp.get).toHaveBeenCalledWith('/api/v1/csv/mapping');
        expect(result).toEqual(templates);
    });

    it('returns empty array when no templates exist', async () => {
        mockHttp.get.mockResolvedValue({ data: { data: [] } as ResponseAPI<TemplateResponse[]> });

        const result = await getTemplates();

        expect(result).toEqual([]);
    });

    it('passes through multiple templates from response', async () => {
        const templates = [makeTemplateResponse({ id: 't1' }), makeTemplateResponse({ id: 't2' })];
        mockHttp.get.mockResolvedValue({ data: { data: templates } as ResponseAPI<TemplateResponse[]> });

        const result = await getTemplates();

        expect(result).toHaveLength(2);
        expect(result).toEqual(templates);
    });
});

describe('newMap', () => {
    beforeEach(() => {
        mockHttp.post.mockClear();
    });

    it('calls POST /api/v1/csv/mapping with the payload', async () => {
        const payload = makeTemplateResponse();
        mockHttp.post.mockResolvedValue({ data: { data: payload } as ResponseAPI<TemplateResponse> });

        await newMap(payload);

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/csv/mapping', payload);
    });

    it('returns the created template from the response', async () => {
        const payload = makeTemplateResponse({ id: 'new-template', name: 'Created' });
        mockHttp.post.mockResolvedValue({ data: { data: payload } as ResponseAPI<TemplateResponse> });

        const result = await newMap(payload);

        expect(result).toEqual(payload);
    });
});
