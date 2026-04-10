import TemplateImport from '@/components/import/TemplateImport.vue';
import { useTemplateStore } from '@/stores/template';
import type { TemplateResponse } from '@/types/api.p';
import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockRouterPush } = vi.hoisted(() => ({
    mockRouterPush: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('vue-router', () => ({
    useRouter: () => ({ push: mockRouterPush })
}));

// Mock @/api/csv to prevent http.ts → router/index.ts transitive import
// which would fail because the vue-router mock above omits createRouter
vi.mock('@/api/csv', () => ({
    getTemplates: vi.fn().mockResolvedValue([]),
    getTemplateById: vi.fn(),
    saveTemplate: vi.fn(),
    updateTemplate: vi.fn(),
    uploadCsvForMapping: vi.fn()
}));

const TEST_TEMPLATES: TemplateResponse[] = [
    { id: 'tmpl-1', name: 'Bank Statement', userId: 'u', mappings: [], createdAt: '', updatedAt: '' },
    { id: 'tmpl-2', name: 'Salary', userId: 'u', mappings: [], createdAt: '', updatedAt: '' }
];

describe('TemplateImport', () => {
    let pinia: ReturnType<typeof createPinia>;
    let store: ReturnType<typeof useTemplateStore>;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        store = useTemplateStore();
        store.templates = TEST_TEMPLATES;
        vi.spyOn(store, 'fetchTemplates').mockResolvedValue(undefined);
        mockRouterPush.mockClear();
    });

    function mountComponent() {
        return shallowMount(TemplateImport, {
            global: { plugins: [pinia] },
            props: { modelValue: null }
        });
    }

    it('renders the New Template button', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('[data-testid="new-template-button"]').exists()).toBe(true);
    });

    it('navigates to template-new when New Template button is clicked', async () => {
        const wrapper = mountComponent();
        await wrapper.find('[data-testid="new-template-button"]').trigger('click');
        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'template-new' });
    });

    it('renders edit icon buttons for each template', () => {
        const wrapper = mountComponent();
        expect(wrapper.find('[data-testid="edit-template-Bank Statement"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="edit-template-Salary"]').exists()).toBe(true);
    });

    it('navigates to template-edit with id when edit icon is clicked', async () => {
        const wrapper = mountComponent();
        await wrapper.find('[data-testid="edit-template-Bank Statement"]').trigger('click');
        expect(mockRouterPush).toHaveBeenCalledWith({ name: 'template-edit', params: { id: 'tmpl-1' } });
    });

    it('emits update:modelValue when a template card is clicked', async () => {
        const wrapper = mountComponent();
        await wrapper.find('[data-testid="template-option-Bank Statement"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tmpl-1']);
    });

    it('does not emit update:modelValue when edit icon is clicked', async () => {
        const wrapper = mountComponent();
        await wrapper.find('[data-testid="edit-template-Bank Statement"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });
});
