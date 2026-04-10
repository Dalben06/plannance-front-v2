<script lang="ts" setup>
import TemplateForm from '@/components/template/TemplateForm.vue';
import { useTemplateStore } from '@/stores/template';
import type { CsvColumnMapping } from '@/types/api.p';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const templateStore = useTemplateStore();

const templateId = route.params.id as string | undefined;
const isEditMode = !!templateId;

const isLoading = ref(false);
const loadError = ref<string | null>(null);

const initialName = ref<string | undefined>(undefined);
const initialMappings = ref<{ startAt: string; amount: string; title: string }>({ startAt: '', amount: '', title: '' });
const initialColumns = ref<CsvColumnMapping[]>([]);

const defaultColumns: CsvColumnMapping[] = [
    { name: 'startAt', type: 'date' },
    { name: 'amount', type: 'number' },
    { name: 'title', type: 'string' }
];

onMounted(async () => {
    if (!isEditMode) return;

    isLoading.value = true;
    loadError.value = null;
    try {
        const template = await templateStore.fetchTemplateById(templateId!);
        initialName.value = template.name;
        const mapping = template.mappings ?? [];

        for (const col of defaultColumns) {
            const mapped = mapping.find((m) => m.to === col.name);
            if (mapped) {
                initialColumns.value.push({ name: mapped.from, type: col.type });
                initialMappings.value[col.name as keyof typeof initialMappings.value] = mapped.from;
            }
        }
    } catch (error) {
        console.error('Error loading template:', error);
        loadError.value = 'Failed to load the template. Please try again.';
    } finally {
        isLoading.value = false;
    }
});

async function handleSaved() {
    await router.push({ name: 'import-register' });
}
</script>

<template>
    <div class="mx-auto max-w-2xl px-4 py-8">
        <div class="mb-6 flex items-center gap-3">
            <Button class="p-button-text p-button-secondary" data-testid="back-button" icon="pi pi-arrow-left" @click="router.back()" />
            <h1 class="text-2xl font-semibold" data-testid="page-title">
                {{ isEditMode ? 'Edit Template' : 'New Template' }}
            </h1>
        </div>

        <div v-if="isLoading" class="flex flex-col gap-4" data-testid="loading-skeleton">
            <Skeleton height="2.5rem" />
            <Skeleton height="2.5rem" />
            <Skeleton height="2.5rem" />
        </div>

        <div v-else-if="loadError" class="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300" data-testid="load-error">
            {{ loadError }}
        </div>

        <TemplateForm v-else :initial-columns="initialColumns" :initial-mappings="initialMappings" :initial-name="initialName" :template-id="templateId" @saved="handleSaved" />
    </div>
</template>
