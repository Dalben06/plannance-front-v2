import { getTemplates } from '@/api/csv';
import type { TemplateResponse } from '@/types/api.p';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTemplateStore = defineStore('template', () => {
    const templates = ref<TemplateResponse[]>([]);
    const fetchingTemplates = ref(false);
    const isLoading = computed(() => fetchingTemplates.value);

    async function fetchTemplates() {
        fetchingTemplates.value = true;
        try {
            const templatesData = await getTemplates();
            console.log('Fetched templates:', templatesData);
            templates.value = templatesData;
        } finally {
            fetchingTemplates.value = false;
        }
    }

    return { templates, isLoading, fetchTemplates };
});
