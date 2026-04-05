<script lang="ts" setup>
import { useImportStore } from '@/stores/import';
import type { CsvImport } from '@/types/api.p';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const importStore = useImportStore();
const { imports, isLoading } = storeToRefs(importStore);

function handleRowClick(row: CsvImport) {
    router.push({ name: 'import-review', params: { id: row.id } });
}

function formatDate(value: Date | string): string {
    return new Date(value).toLocaleDateString();
}

onMounted(() => {
    importStore.fetchImports();
});
</script>

<template>
    <div>
        <div v-if="isLoading" class="flex flex-col gap-3" data-testid="table-skeleton">
            <span v-for="n in 4" :key="n" class="block h-10 w-full animate-pulse rounded bg-surface-200 dark:bg-surface-700" aria-hidden="true" />
        </div>

        <DataTable v-else :value="imports" data-testid="pending-table" class="cursor-pointer" @row-click="handleRowClick($event.data)">
            <template #empty>
                <p class="py-4 text-center text-surface-500 dark:text-surface-400">No pending imports found.</p>
            </template>
            <Column header="# Records" data-testid="col-records">
                <template #body="{ data: row }">
                    {{ (row as CsvImport).data.length }}
                </template>
            </Column>
            <Column header="Created">
                <template #body="{ data: row }">
                    {{ formatDate((row as CsvImport).createdAt) }}
                </template>
            </Column>
            <Column header="Expires">
                <template #body="{ data: row }">
                    {{ formatDate((row as CsvImport).expiresAt) }}
                </template>
            </Column>
        </DataTable>
    </div>
</template>
