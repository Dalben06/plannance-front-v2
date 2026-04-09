import type { CsvImport, CsvUploadResponse, ResponseAPI, TemplateResponse } from '@/types/api.p';
import { http } from './http';

export async function getImports(): Promise<CsvImport[]> {
    const { data } = await http.get<ResponseAPI<CsvImport[]>>('/api/v1/csv/import');
    return data.data;
}

export async function getImportById(_id: string): Promise<CsvImport> {
    const { data } = await http.get<CsvImport>('/api/v1/csv/import/' + _id);
    return data;
}

export async function uploadCsvFile(file: File, templateId: string): Promise<CsvUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('templateId', templateId);
    const response = await http.post<CsvUploadResponse>('/api/v1/csv/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
}

// TODO: implement PUT /api/v1/csv/import/:id
export async function updateImportRecord(_payload: CsvImport): Promise<void> {
    await http.put<CsvImport>('/api/v1/csv/import/', _payload);
}

// TODO: implement POST /api/v1/csv/import/:id/confirm
export async function confirmImport(_id: string): Promise<void> {
    await http.post<CsvImport>('/api/v1/csv/confirm/' + _id);
}

export async function getTemplates(): Promise<TemplateResponse[]> {
    const { data } = await http.get<ResponseAPI<TemplateResponse[]>>('/api/v1/csv/mapping');
    return data.data;
}

export async function newMap(_payload: TemplateResponse): Promise<TemplateResponse> {
    const { data } = await http.post<ResponseAPI<TemplateResponse>>('/api/v1/csv/mapping', _payload);
    return data.data;
}

export async function uploadCsvForMapping(file: File): Promise<CsvMappedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await http.post<CsvMappedResponse>('/api/v1/csv/mapped', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('API response for CSV mapping:', data);
    return data;
}

export async function getTemplateById(id: string): Promise<TemplateResponse> {
    const { data } = await http.get<ResponseAPI<TemplateResponse>>(`/api/v1/csv/mapping/${id}`);
    console.log(`API response for template with ID ${id}:`, data);
    return data.data;
}

export async function saveTemplate(payload: TemplateSavePayload): Promise<TemplateResponse> {
    const { data } = await http.post<ResponseAPI<TemplateResponse>>('/api/v1/csv/mapping', payload);
    return data.data;
}

export async function updateTemplate(id: string, payload: TemplateSavePayload): Promise<TemplateResponse> {
    const { data } = await http.put<ResponseAPI<TemplateResponse>>(`/api/v1/csv/mapping/${id}`, payload);
    return data.data;
}
