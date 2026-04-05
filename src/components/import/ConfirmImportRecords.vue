<script lang="ts" setup>
import { confirmImport, getImportById } from '@/api/csv';
import type { CsvImport } from '@/types/api.p';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const currentImport = ref<CsvImport | null>(null);
onMounted(async () => {
    await fetchCurrentImport();
});
const isLoading = ref(false);
async function fetchCurrentImport() {
    isLoading.value = true;
    const id = route.params.id as string;
    currentImport.value = await getImportById(id);
    isLoading.value = false;
}

const isConfirming = ref(false);
const confirmError = ref<string | null>(null);

const toast = useToast();
async function handleConfirm() {
    isConfirming.value = true;
    confirmError.value = null;
    try {
        if (!currentImport.value?.id) {
            throw new Error('No import to confirm');
        }
        await confirmImport(currentImport.value?.id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data import with success', life: 3000 });
        await router.push({ name: 'import' });
    } catch (error: unknown) {
        const err = error as { message?: string };
        confirmError.value = err?.message ?? 'Confirm failed';
    } finally {
        isConfirming.value = false;
    }
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                <p class="text-sm text-surface-500 dark:text-surface-400">Total Records</p>
                <p class="mt-1 text-2xl font-semibold" data-testid="total-records">{{ currentImport?.data.length ?? 0 }}</p>
            </div>
        </div>

        <DataTable :loading="isLoading" :value="currentImport?.data ?? []" data-testid="confirm-table">
            <Column field="title" header="Title" />
            <Column field="start" header="Date" />
            <Column field="amount" header="Amount" />
            <Column field="type" header="Type" />
        </DataTable>

        <Message v-if="confirmError" severity="error" data-testid="confirm-error">{{ confirmError }}</Message>

        <div class="flex justify-end">
            <Button label="Confirm" icon="pi pi-check" data-testid="confirm-button" :loading="isConfirming" @click="handleConfirm" />
        </div>
    </div>
</template>
