<script lang="ts" setup>
import { createCalendarEvent, updateCalendarEvent } from '@/api/calendar';
import { useCalendarEventModal } from '@/composable/calendar/useCalendarEventModal';
import { useCalendarStore } from '@/stores/calendar';
import { toTypedSchema } from '@vee-validate/yup';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useField, useForm } from 'vee-validate';
import { computed, watch } from 'vue';
import * as yup from 'yup';

const { visible, editingEvent, _skipNextReset, reopen, close } = useCalendarEventModal();
const calendarStore = useCalendarStore();
const toast = useToast();
const confirm = useConfirm();

const typeOptions = [
    { label: 'Debit', value: 'debit' },
    { label: 'Credit', value: 'credit' }
];

const schema = toTypedSchema(
    yup.object({
        title: yup.string().required('Title is required').min(1).max(255),
        start: yup.date().required('Start date is required').typeError('Start date is required'),
        amount: yup.number().required('Amount is required').min(0.01, 'Amount must be greater than 0'),
        type: yup.string().oneOf(['debit', 'credit']).required('Type is required')
    })
);

const { handleSubmit, resetForm, meta, setFieldError, isSubmitting } = useForm({ validationSchema: schema });

const { value: title, errorMessage: titleError } = useField<string>('title');
const { value: start, errorMessage: startError } = useField<Date>('start');
const { value: amount, errorMessage: amountError } = useField<number>('amount');
const { value: type, errorMessage: typeError } = useField<string>('type');

const modalTitle = computed(() => (editingEvent.value ? 'Edit Event' : 'Add Event'));
function clearForm() {
    resetForm({
        values: {
            title: '',
            start: new Date(),
            amount: 0,
            type: 'debit'
        }
    });
}
watch(visible, (val) => {
    if (!val) return;

    if (_skipNextReset.value) {
        _skipNextReset.value = false;
        return;
    }

    if (editingEvent.value) {
        resetForm({
            values: {
                title: editingEvent.value.title,
                start: editingEvent.value.start ? new Date(editingEvent.value.start) : undefined,
                amount: editingEvent.value.amount,
                type: editingEvent.value.type
            }
        });
    } else {
        clearForm();
    }
});

const onSubmit = handleSubmit(async (values) => {
    const isEdit = !!editingEvent.value;
    const eventId = editingEvent.value?.id;

    try {
        const payload = {
            title: values.title,
            start: values.start,
            amount: values.amount,
            type: values.type as 'debit' | 'credit'
        };

        if (isEdit && eventId !== undefined) {
            await updateCalendarEvent(eventId, payload);
        } else {
            await createCalendarEvent(payload);
        }

        await calendarStore.getEventsFromMonth();
        toast.add({ severity: 'success', summary: 'Success', detail: isEdit ? 'Event updated' : 'Event created', life: 3000 });
        clearForm();
        close();
    } catch (err: any) {
        if (err?.response?.status === 422) {
            const errors = err.response.data?.errors ?? {};
            Object.entries(errors).forEach(([field, messages]) => {
                setFieldError(field as any, (messages as string[])[0]);
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again.', life: 4000 });
        }
    }
});

function onHide() {
    if (meta.value.dirty) {
        confirm.require({
            message: 'Are you sure you want to discard these changes?',
            header: 'Discard Changes',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Discard',
            rejectLabel: 'Keep editing',
            accept: () => {
                close();
            },
            reject: () => {
                reopen();
            }
        });
    } else {
        close();
    }
}
</script>

<template>
    <ConfirmDialog />
    <Dialog v-model:visible="visible" :header="modalTitle" modal :style="{ width: '28rem' }" @hide="onHide">
        <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
            <div class="flex flex-col gap-1">
                <label for="event-title" class="font-medium text-sm">Title</label>
                <InputText id="event-title" v-model="title" placeholder="Event title" :invalid="!!titleError" />
                <small v-if="titleError" class="text-red-500">{{ titleError }}</small>
            </div>

            <div class="flex flex-col gap-1">
                <label for="event-start" class="font-medium text-sm">Start Date</label>
                <DatePicker id="event-start" v-model="start" dateFormat="yy-mm-dd" placeholder="Select date" :invalid="!!startError" showIcon />
                <small v-if="startError" class="text-red-500">{{ startError }}</small>
            </div>

            <div class="flex flex-col gap-1">
                <label for="event-amount" class="font-medium text-sm">Amount</label>
                <InputNumber id="event-amount" v-model="amount" :min="0.01" :minFractionDigits="2" :maxFractionDigits="2" placeholder="0.00" :invalid="!!amountError" />
                <small v-if="amountError" class="text-red-500">{{ amountError }}</small>
            </div>

            <div class="flex flex-col gap-1">
                <label for="event-type" class="font-medium text-sm">Type</label>
                <Select id="event-type" v-model="type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Select type" :invalid="!!typeError" />
                <small v-if="typeError" class="text-red-500">{{ typeError }}</small>
            </div>

            <div class="flex justify-end gap-2 pt-2">
                <Button type="button" label="Cancel" severity="secondary" @click="onHide" />
                <Button type="submit" :label="modalTitle" :disabled="isSubmitting" :icon="isSubmitting ? 'pi pi-spin pi-spinner' : undefined" />
            </div>
        </form>
    </Dialog>
</template>
