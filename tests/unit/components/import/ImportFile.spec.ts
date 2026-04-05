import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImportFile from '@/components/import/ImportFile.vue';
import TemplateImport from '@/components/import/TemplateImport.vue';

const { mockRouterPush } = vi.hoisted(() => ({
    mockRouterPush: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockRouterPush })
}));

const { mockUploadCsvFile } = vi.hoisted(() => ({
    mockUploadCsvFile: vi.fn()
}));

vi.mock('@/api/csv', () => ({
    uploadCsvFile: mockUploadCsvFile
}));

async function selectTemplate(wrapper: ReturnType<typeof shallowMount>, templateId = 'template-123') {
    await wrapper.findComponent(TemplateImport).vm.$emit('update:modelValue', templateId);
    await wrapper.vm.$nextTick();
}

describe('ImportFile', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockRouterPush.mockClear();
        mockUploadCsvFile.mockClear();
    });

    it('renders upload button', async () => {
        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="upload-button"]').exists()).toBe(true);
    });

    it('renders file input', async () => {
        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="file-input"]').exists()).toBe(true);
    });

    it('upload button is disabled when no file is selected', async () => {
        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        const button = wrapper.find('[data-testid="upload-button"]');
        expect(button.attributes('disabled')).toBeDefined();
    });

    it('does not call uploadCsvFile when no file is selected and upload is triggered', async () => {
        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        await wrapper.find('[data-testid="upload-button"]').trigger('click');

        expect(mockUploadCsvFile).not.toHaveBeenCalled();
    });

    it('successful upload navigates to import-review with returned id', async () => {
        mockUploadCsvFile.mockResolvedValue({ id: 'new-import-99', columns: [] });

        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        await selectTemplate(wrapper);

        const input = wrapper.find('[data-testid="file-input"]');
        const file = new File(['data'], 'test.csv', { type: 'text/csv' });
        Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
        await input.trigger('change');

        await wrapper.find('[data-testid="upload-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(mockUploadCsvFile).toHaveBeenCalledWith(file, 'template-123');
        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'import-review', params: { id: 'new-import-99' } });
    });

    it('400 error: shows upload error message', async () => {
        mockUploadCsvFile.mockRejectedValue({ status: 400, data: { message: 'Invalid file format' } });

        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        await selectTemplate(wrapper);

        const input = wrapper.find('[data-testid="file-input"]');
        const file = new File(['bad'], 'bad.csv', { type: 'text/csv' });
        Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
        await input.trigger('change');

        await wrapper.find('[data-testid="upload-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="upload-error"]').exists()).toBe(true);
    });

    it('500 error: shows upload error message', async () => {
        mockUploadCsvFile.mockRejectedValue({ status: 500, message: 'Server error' });

        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        await selectTemplate(wrapper);

        const input = wrapper.find('[data-testid="file-input"]');
        const file = new File([''], 'test.csv', { type: 'text/csv' });
        Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
        await input.trigger('change');

        await wrapper.find('[data-testid="upload-button"]').trigger('click');
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="upload-error"]').exists()).toBe(true);
    });

    it('no error message shown initially', async () => {
        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="upload-error"]').exists()).toBe(false);
    });

    it('upload skeleton shown while uploading', async () => {
        let resolveUpload!: (v: unknown) => void;
        mockUploadCsvFile.mockReturnValue(new Promise((r) => (resolveUpload = r)));

        const wrapper = shallowMount(ImportFile);
        await wrapper.vm.$nextTick();

        await selectTemplate(wrapper);

        const input = wrapper.find('[data-testid="file-input"]');
        const file = new File([''], 'test.csv', { type: 'text/csv' });
        Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
        await input.trigger('change');

        await wrapper.find('[data-testid="upload-button"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-testid="upload-skeleton"]').exists()).toBe(true);

        resolveUpload({ id: 'x', columns: [] });
        await new Promise((r) => setTimeout(r, 0));

        expect(wrapper.find('[data-testid="upload-skeleton"]').exists()).toBe(false);
    });
});
