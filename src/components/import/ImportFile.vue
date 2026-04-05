<script lang="ts" setup>
import { uploadCsvFile } from '@/api/csv';
import TemplateImport from '@/components/import/TemplateImport.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedTemplate = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);

function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    selectedFile.value = input.files?.[0] ?? null;
    uploadError.value = null;
}

async function handleUpload() {
    if (!selectedFile.value || !selectedTemplate.value) return;
    isUploading.value = true;
    uploadError.value = null;
    try {
        const result = await uploadCsvFile(selectedFile.value, selectedTemplate.value);
        console.log('Upload result:', result);
        await router.push({ name: 'import-review', params: { id: result.id } });
    } catch (error: unknown) {
        const err = error as { data?: { message?: string }; message?: string; error?: string };
        uploadError.value = err?.error ?? err?.message ?? 'Upload failed';
    } finally {
        isUploading.value = false;
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <TemplateImport v-model="selectedTemplate" data-testid="template-select" />

        <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300" for="csv-file-input">CSV File</label>
            <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                data-testid="file-input"
                class="block w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded file:border-0 file:bg-primary-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-700 dark:border-surface-600 dark:bg-surface-800"
                @change="handleFileChange"
            />
        </div>

        <Message v-if="uploadError" severity="error" data-testid="upload-error">{{ uploadError }}</Message>

        <div v-if="isUploading" class="flex flex-col gap-2" data-testid="upload-skeleton">
            <span class="block h-4 w-3/4 animate-pulse rounded bg-surface-200 dark:bg-surface-700" aria-hidden="true" />
            <span class="block h-4 w-1/2 animate-pulse rounded bg-surface-200 dark:bg-surface-700" aria-hidden="true" />
        </div>

        <Button label="Upload" icon="pi pi-upload" data-testid="upload-button" :loading="isUploading" :disabled="!selectedFile || !selectedTemplate" @click="handleUpload" />
    </div>
</template>
