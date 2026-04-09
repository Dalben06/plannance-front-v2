import TemplateForm from '@/components/template/TemplateForm.vue';
import type { CsvColumnMapping } from '@/types/api.p';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectStub } from '@tests/stubs';

const { mockSaveTemplate, mockUpdateTemplate, mockUploadCsvForMapping } = vi.hoisted(() => ({
    mockSaveTemplate: vi.fn(),
    mockUpdateTemplate: vi.fn(),
    mockUploadCsvForMapping: vi.fn()
}));

vi.mock('@/api/csv', () => ({
    saveTemplate: mockSaveTemplate,
    updateTemplate: mockUpdateTemplate,
    uploadCsvForMapping: mockUploadCsvForMapping
}));

const { mockToastAdd } = vi.hoisted(() => ({
    mockToastAdd: vi.fn()
}));

vi.mock('primevue/usetoast', () => ({
    useToast: () => ({ add: mockToastAdd })
}));

const TEST_COLUMNS: CsvColumnMapping[] = [
    { name: 'Date', type: 'date' },
    { name: 'Amount', type: 'number' },
    { name: 'Description', type: 'string' },
    { name: 'Extra String', type: 'string' }
];

function mountForm(props: Record<string, unknown> = {}) {
    return shallowMount(TemplateForm, {
        global: { plugins: [createPinia()], stubs: { Select: SelectStub } },
        props
    });
}

function mountFormWithColumns(extraProps: Record<string, unknown> = {}) {
    return mountForm({ initialColumns: TEST_COLUMNS, ...extraProps });
}

async function submitAndFlush(wrapper: ReturnType<typeof mountForm>) {
    wrapper.find('[data-testid="template-form"]').trigger('submit');
    await vi.advanceTimersByTimeAsync(10);
    await flushPromises();
}

describe('TemplateForm', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'] });
        setActivePinia(createPinia());
        mockSaveTemplate.mockClear();
        mockUpdateTemplate.mockClear();
        mockUploadCsvForMapping.mockClear();
        mockToastAdd.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('rendering', () => {
        it('renders the template name input', () => {
            const wrapper = mountForm();
            expect(wrapper.find('[data-testid="template-name-input"]').exists()).toBe(true);
        });

        it('renders the csv file input', () => {
            const wrapper = mountForm();
            expect(wrapper.find('[data-testid="csv-file-input"]').exists()).toBe(true);
        });

        it('renders save button', () => {
            const wrapper = mountFormWithColumns();
            expect(wrapper.find('[data-testid="save-button"]').exists()).toBe(true);
        });

        it('shows "Save Template" label when no templateId', () => {
            const wrapper = mountFormWithColumns();
            expect(wrapper.find('[data-testid="save-button"]').attributes('label')).toBe('Save Template');
        });

        it('shows "Update Template" label when templateId is provided', () => {
            const wrapper = mountFormWithColumns({ templateId: 'template-1' });
            expect(wrapper.find('[data-testid="save-button"]').attributes('label')).toBe('Update Template');
        });

        it('does not show mapping selects when no columns loaded', () => {
            const wrapper = mountForm();
            expect(wrapper.find('[data-testid="startAt-select"]').exists()).toBe(false);
            expect(wrapper.find('[data-testid="amount-select"]').exists()).toBe(false);
            expect(wrapper.find('[data-testid="title-select"]').exists()).toBe(false);
        });

        it('shows mapping selects when columns are provided', () => {
            const wrapper = mountFormWithColumns();
            expect(wrapper.find('[data-testid="startAt-select"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="amount-select"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="title-select"]').exists()).toBe(true);
        });

        it('does not show save error initially', () => {
            const wrapper = mountForm();
            expect(wrapper.find('[data-testid="save-error"]').exists()).toBe(false);
        });
    });

    describe('initial values', () => {
        it('pre-fills name from initialName prop', () => {
            const wrapper = mountFormWithColumns({ initialName: 'My Bank Template' });
            expect(wrapper.find('[data-testid="template-name-input"]').attributes('modelvalue')).toBe('My Bank Template');
        });

        it('pre-fills mappings from initialMappings prop', () => {
            const wrapper = mountFormWithColumns({
                initialName: 'Test',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });
            expect(wrapper.findComponent('[data-testid="startAt-select"]').props('modelValue')).toBe('Date');
            expect(wrapper.findComponent('[data-testid="amount-select"]').props('modelValue')).toBe('Amount');
            expect(wrapper.findComponent('[data-testid="title-select"]').props('modelValue')).toBe('Description');
        });
    });

    describe('type-filtered columns', () => {
        it('startAt select only shows date-type columns', () => {
            const wrapper = mountFormWithColumns();
            const options = wrapper.findComponent('[data-testid="startAt-select"]').props('options') as string[];
            expect(options).toEqual(['Date']);
        });

        it('amount select only shows number-type columns', () => {
            const wrapper = mountFormWithColumns();
            const options = wrapper.findComponent('[data-testid="amount-select"]').props('options') as string[];
            expect(options).toEqual(['Amount']);
        });

        it('title select only shows string-type columns', () => {
            const wrapper = mountFormWithColumns();
            const options = wrapper.findComponent('[data-testid="title-select"]').props('options') as string[];
            expect(options).toContain('Description');
            expect(options).toContain('Extra String');
            expect(options).not.toContain('Date');
            expect(options).not.toContain('Amount');
        });
    });

    describe('CSV upload', () => {
        it('calls uploadCsvForMapping with the selected file', async () => {
            const file = new File(['Date,Amount,Description'], 'test.csv', { type: 'text/csv' });
            mockUploadCsvForMapping.mockResolvedValue({ columns: TEST_COLUMNS });

            const wrapper = mountForm();
            const input = wrapper.find('[data-testid="csv-file-input"]');
            Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
            await input.trigger('change');
            await flushPromises();

            expect(mockUploadCsvForMapping).toHaveBeenCalledWith(file);
        });

        it('shows loading text while processing CSV', async () => {
            let resolve!: (v: unknown) => void;
            mockUploadCsvForMapping.mockReturnValue(new Promise((r) => (resolve = r)));

            const wrapper = mountForm();
            const input = wrapper.find('[data-testid="csv-file-input"]');
            const file = new File([''], 'test.csv');
            Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
            await input.trigger('change');
            await wrapper.vm.$nextTick();

            expect(wrapper.find('[data-testid="csv-loading"]').exists()).toBe(true);

            resolve({ columns: [] });
            await flushPromises();
            expect(wrapper.find('[data-testid="csv-loading"]').exists()).toBe(false);
        });

        it('shows csv error when upload fails', async () => {
            mockUploadCsvForMapping.mockRejectedValue(new Error('Network error'));

            const wrapper = mountForm();
            const input = wrapper.find('[data-testid="csv-file-input"]');
            const file = new File([''], 'bad.csv');
            Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
            await input.trigger('change');
            await flushPromises();

            expect(wrapper.find('[data-testid="csv-error"]').exists()).toBe(true);
        });
    });

    describe('form submission - new template', () => {
        it('calls saveTemplate with correct payload on valid submit', async () => {
            const created = { id: 'new-1', userId: 'u', name: 'Test', mappings: [], createdAt: '', updatedAt: '' };
            mockSaveTemplate.mockResolvedValue(created);

            const wrapper = mountFormWithColumns({
                initialName: 'Test',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(mockSaveTemplate).toHaveBeenCalledWith({
                name: 'Test',
                mappings: [
                    { from: 'Date', to: 'startAt' },
                    { from: 'Amount', to: 'amount' },
                    { from: 'Description', to: 'title' }
                ]
            });
        });

        it('201/200: shows success toast after saving', async () => {
            mockSaveTemplate.mockResolvedValue({ id: '1', userId: 'u', name: 'T', mapping: {}, createdAt: '', updatedAt: '' });

            const wrapper = mountFormWithColumns({
                initialName: 'Test',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
        });

        it('emits "saved" event after successful save', async () => {
            mockSaveTemplate.mockResolvedValue({ id: '1', userId: 'u', name: 'T', mapping: {}, createdAt: '', updatedAt: '' });

            const wrapper = mountFormWithColumns({
                initialName: 'Test',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(wrapper.emitted('saved')).toBeTruthy();
        });

        it('400: displays error message on screen (not toast)', async () => {
            mockSaveTemplate.mockRejectedValue({ status: 400, data: { message: 'Name already exists' } });

            const wrapper = mountFormWithColumns({
                initialName: 'Test',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(wrapper.find('[data-testid="save-error"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="save-error"]').text()).toContain('Name already exists');
            expect(mockToastAdd).not.toHaveBeenCalled();
        });

        it('500: shows error toast (not inline error)', async () => {
            mockSaveTemplate.mockRejectedValue({ status: 500, message: 'Server error' });

            const wrapper = mountFormWithColumns({
                initialName: 'Test',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
            expect(wrapper.find('[data-testid="save-error"]').exists()).toBe(false);
        });
    });

    describe('form submission - edit template', () => {
        it('calls updateTemplate with id and payload when templateId is set', async () => {
            const updated = { id: 'tmpl-5', userId: 'u', name: 'Updated', mapping: {}, createdAt: '', updatedAt: '' };
            mockUpdateTemplate.mockResolvedValue(updated);

            const wrapper = mountFormWithColumns({
                templateId: 'tmpl-5',
                initialName: 'Updated',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(mockUpdateTemplate).toHaveBeenCalledWith('tmpl-5', {
                id: 'tmpl-5',
                name: 'Updated',
                mappings: [
                    { from: 'Date', to: 'startAt' },
                    { from: 'Amount', to: 'amount' },
                    { from: 'Description', to: 'title' }
                ]
            });
            expect(mockSaveTemplate).not.toHaveBeenCalled();
        });

        it('200: shows success toast after updating', async () => {
            mockUpdateTemplate.mockResolvedValue({ id: 'tmpl-5', userId: 'u', name: 'T', mapping: {}, createdAt: '', updatedAt: '' });

            const wrapper = mountFormWithColumns({
                templateId: 'tmpl-5',
                initialName: 'Updated',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
        });

        it('400: displays inline error message when update returns 400', async () => {
            mockUpdateTemplate.mockRejectedValue({ status: 400, data: { message: 'Duplicate name' } });

            const wrapper = mountFormWithColumns({
                templateId: 'tmpl-5',
                initialName: 'Updated',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(wrapper.find('[data-testid="save-error"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="save-error"]').text()).toContain('Duplicate name');
            expect(mockToastAdd).not.toHaveBeenCalled();
        });

        it('500: shows error toast when update returns 500', async () => {
            mockUpdateTemplate.mockRejectedValue({ status: 500, message: 'Server error' });

            const wrapper = mountFormWithColumns({
                templateId: 'tmpl-5',
                initialName: 'Updated',
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(mockToastAdd).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
            expect(wrapper.find('[data-testid="save-error"]').exists()).toBe(false);
        });
    });

    describe('validation', () => {
        it('shows name error when submitting without a name', async () => {
            const wrapper = mountFormWithColumns({
                initialMappings: { startAt: 'Date', amount: 'Amount', title: 'Description' }
            });

            await submitAndFlush(wrapper);

            expect(wrapper.find('[data-testid="name-error"]').exists()).toBe(true);
            expect(mockSaveTemplate).not.toHaveBeenCalled();
        });

        it('shows startAt error when submitting without mapping', async () => {
            const wrapper = mountFormWithColumns({ initialName: 'Test' });

            await submitAndFlush(wrapper);

            expect(wrapper.find('[data-testid="startAt-error"]').exists()).toBe(true);
            expect(mockSaveTemplate).not.toHaveBeenCalled();
        });

        it('shows amount error when submitting without mapping', async () => {
            const wrapper = mountFormWithColumns({ initialName: 'Test' });

            await submitAndFlush(wrapper);

            expect(wrapper.find('[data-testid="amount-error"]').exists()).toBe(true);
            expect(mockSaveTemplate).not.toHaveBeenCalled();
        });

        it('shows title error when submitting without mapping', async () => {
            const wrapper = mountFormWithColumns({ initialName: 'Test' });

            await submitAndFlush(wrapper);

            expect(wrapper.find('[data-testid="title-error"]').exists()).toBe(true);
            expect(mockSaveTemplate).not.toHaveBeenCalled();
        });

        it('save button is disabled when no columns are loaded', () => {
            const wrapper = mountForm({ initialName: 'Test' });
            const btn = wrapper.find('[data-testid="save-button"]');
            expect(btn.attributes('disabled')).toBeDefined();
        });
    });
});
