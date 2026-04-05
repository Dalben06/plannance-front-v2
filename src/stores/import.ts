import { getImports } from '@/api/csv';
import type { CsvImport } from '@/types/api.p';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useImportStore = defineStore('import', () => {
    const imports = ref<CsvImport[]>([]);
    const fetchingImports = ref(false);
    const isLoading = computed(() => fetchingImports.value);

    async function fetchImports() {
        fetchingImports.value = true;
        try {
            const all = await getImports();
            const now = new Date();
            imports.value = all.filter((item) => new Date(item.expiresAt) > now).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } finally {
            fetchingImports.value = false;
        }
    }

    async function getImportById(id: string): Promise<CsvImport | null> {
        const all = await getImports();
        const found = all.find((item) => item.id === id) || null;
        return found;
    }

    return { imports, isLoading, fetchImports, getImportById };
});
