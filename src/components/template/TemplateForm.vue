<script lang="ts" setup>
import { saveTemplate, updateTemplate, uploadCsvForMapping } from '@/api/csv';
import type { CsvColumnMapping, TemplateSavePayload } from '@/types/api.p';
import { toTypedSchema } from '@vee-validate/yup';
import { useToast } from 'primevue/usetoast';
import { useField, useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import * as yup from 'yup';

const props = defineProps<{
    templateId?: string;
    initialName?: string;
    initialMappings?: { startAt: string; amount: string; title: string };
    initialColumns?: CsvColumnMapping[];
}>();

const emit = defineEmits<{
    (e: 'saved'): void;
}>();

const toast = useToast();

const columns = ref<CsvColumnMapping[]>(props.initialColumns ?? []);
const isUploadingCsv = ref(false);
const csvError = ref<string | null>(null);
const saveError = ref<string | null>(null);

const dateColumns = computed(() => columns.value.filter((c) => c.type === 'date').map((c) => c.name));
const numberColumns = computed(() => columns.value.filter((c) => c.type === 'number').map((c) => c.name));
const stringColumns = computed(() => columns.value.filter((c) => c.type === 'string').map((c) => c.name));

const schema = toTypedSchema(
    yup.object({
        name: yup.string().required('Template name is required'),
        startAt: yup.string().required('Start date column is required'),
        amount: yup.string().required('Amount column is required'),
        title: yup.string().required('Title column is required')
    })
);

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema });

const { value: name, errorMessage: nameError } = useField<string>('name', undefined, {
    initialValue: props.initialName ?? ''
});
const { value: startAt, errorMessage: startAtError } = useField<string>('startAt', undefined, {
    initialValue: props.initialMappings?.startAt ?? ''
});
const { value: amount, errorMessage: amountError } = useField<string>('amount', undefined, {
    initialValue: props.initialMappings?.amount ?? ''
});
const { value: title, errorMessage: titleError } = useField<string>('title', undefined, {
    initialValue: props.initialMappings?.title ?? ''
});

async function handleCsvUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    isUploadingCsv.value = true;
    csvError.value = null;
    try {
        const response = await uploadCsvForMapping(file);
        columns.value = response.columns;
        startAt.value = '';
        amount.value = '';
        title.value = '';
    } catch {
        csvError.value = 'Failed to process the CSV file. Please try again.';
    } finally {
        isUploadingCsv.value = false;
    }
}

const onSubmit = handleSubmit(async (values) => {
    saveError.value = null;

    const payload: TemplateSavePayload = {
        id: props.templateId,
        name: values.name,
        mappings: [
            { from: values.startAt, to: 'startAt' },
            { from: values.amount, to: 'amount' },
            { from: values.title, to: 'title' }
        ]
    };

    try {
        if (props.templateId) {
            await updateTemplate(props.templateId!, payload);
        } else {
            await saveTemplate(payload);
        }
        toast.add({ severity: 'success', summary: 'Success', detail: 'Template saved successfully', life: 3000 });
        emit('saved');
    } catch (error: unknown) {
        const err = error as { status?: number; data?: { message?: string }; message?: string };
        if (err?.status === 400) {
            saveError.value = err?.data?.message ?? err?.message ?? 'Invalid data. Please check your inputs.';
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred. Please try again.', life: 3000 });
        }
    }
});
</script>

<template>
    <form class="flex flex-col gap-6" data-testid="template-form" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
            <label class="text-sm font-medium" for="template-name">Template Name</label>
            <InputText id="template-name" v-model="name" data-testid="template-name-input" placeholder="e.g. Bank Statement" :invalid="!!nameError" />
            <small v-if="nameError" class="text-red-500" data-testid="name-error">{{ nameError }}</small>
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">Upload CSV to detect columns</label>
            <input
                accept=".csv"
                class="block w-full text-sm text-surface-700 dark:text-surface-300 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-950 dark:file:text-primary-300"
                data-testid="csv-file-input"
                type="file"
                :disabled="isUploadingCsv"
                @change="handleCsvUpload"
            />
            <small v-if="isUploadingCsv" class="text-surface-500" data-testid="csv-loading">Processing CSV...</small>
            <small v-if="csvError" class="text-red-500" data-testid="csv-error">{{ csvError }}</small>
        </div>

        <template v-if="columns.length > 0">
            <div class="rounded-lg border border-surface-200 p-4 dark:border-surface-700">
                <p class="mb-4 text-sm font-semibold text-surface-700 dark:text-surface-300">Map CSV columns to fields</p>

                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium" for="startAt-select">Start Date <span class="text-red-500">*</span></label>
                        <Select id="startAt-select" v-model="startAt" data-testid="startAt-select" :options="dateColumns" :invalid="!!startAtError" placeholder="Select date column" />
                        <small v-if="startAtError" class="text-red-500" data-testid="startAt-error">{{ startAtError }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium" for="amount-select">Amount <span class="text-red-500">*</span></label>
                        <Select id="amount-select" v-model="amount" data-testid="amount-select" :options="numberColumns" :invalid="!!amountError" placeholder="Select number column" />
                        <small v-if="amountError" class="text-red-500" data-testid="amount-error">{{ amountError }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium" for="title-select">Title <span class="text-red-500">*</span></label>
                        <Select id="title-select" v-model="title" data-testid="title-select" :options="stringColumns" :invalid="!!titleError" placeholder="Select string column" />
                        <small v-if="titleError" class="text-red-500" data-testid="title-error">{{ titleError }}</small>
                    </div>
                </div>
            </div>
        </template>

        <div v-if="saveError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300" data-testid="save-error">
            {{ saveError }}
        </div>

        <Button :disabled="isSubmitting || columns.length === 0" :label="templateId ? 'Update Template' : 'Save Template'" :loading="isSubmitting" data-testid="save-button" icon="pi pi-save" type="submit" />
    </form>
</template>
