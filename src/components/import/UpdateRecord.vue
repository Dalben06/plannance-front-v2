<script lang="ts" setup>
import { getImportById, updateImportRecord } from '@/api/csv';
import type { CsvImport, ImportRecord } from '@/types/api.p';
import type { DataTableRowEditSaveEvent } from 'primevue/datatable';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const currentImport = ref<CsvImport | null>(null);

async function handleNext() {
    await router.push({ name: 'import-confirm', params: { id: route.params.id } });
}

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

const types = ref([
    { label: 'debit', value: 'debit' },
    { label: 'credit', value: 'credit' }
]);

const onRowEditSave = async (event: DataTableRowEditSaveEvent) => {
    let { newData, index } = event;

    if (!currentImport.value || !currentImport.value.data?.length) return;

    const newDate: ImportRecord = {
        ...(newData as ImportRecord)
    };
    currentImport.value.data[index] = newDate;
    await updateImportRecord({ ...currentImport.value });
};
const editingRows = ref([]);

const getStatusLabel = (status: 'debit' | 'credit') => {
    switch (status) {
        case 'debit':
            return 'warn';

        case 'credit':
            return 'success';

        default:
            return 'primary';
    }
};
</script>

<template>
    <div class="flex flex-col gap-6">
        <div v-if="isLoading" data-testid="records-skeleton" class="flex flex-col gap-2">
            <span v-for="n in 4" :key="n" class="block h-8 w-full animate-pulse rounded bg-surface-200 dark:bg-surface-700" aria-hidden="true" />
        </div>

        <template v-else>
            <DataTable
                v-model:editingRows="editingRows"
                :value="currentImport?.data ?? []"
                editMode="row"
                dataKey="id"
                @row-edit-save="onRowEditSave"
                :pt="{
                    table: { style: 'min-width: 50rem' },
                    column: {
                        bodycell: ({ state }: { state: Record<string, unknown> }) => ({
                            style: state['d_editing'] && 'padding-top: 0.75rem; padding-bottom: 0.75rem'
                        })
                    }
                }"
                :loading="isLoading"
            >
                <Column field="title" header="Title" style="width: 20%">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" fluid />
                    </template>
                </Column>
                <Column field="start" header="Date" style="width: 20%">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" fluid />
                    </template>
                </Column>
                <Column field="amount" header="Amount" style="width: 20%">
                    <template #editor="{ data, field }">
                        <InputNumber id="event-amount" v-model="data[field]" :min="0.01" :minFractionDigits="2" :maxFractionDigits="2" placeholder="0.00" fluid />
                    </template>
                </Column>
                <Column field="type" header="Status" style="width: 20%">
                    <template #editor="{ data, field }">
                        <Select v-model="data[field]" :options="types" optionLabel="label" optionValue="value" placeholder="Select a Type" fluid>
                            <template #option="slotProps">
                                <Tag :value="slotProps.option.value" :severity="getStatusLabel(slotProps.option.value)" />
                            </template>
                        </Select>
                    </template>
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.type" :severity="getStatusLabel(slotProps.data.type)" />
                    </template>
                </Column>
                <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
            </DataTable>

            <div class="flex justify-end">
                <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" data-testid="next-button" @click="handleNext" />
            </div>
        </template>
    </div>
</template>
