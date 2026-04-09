<script lang="ts" setup>
import { useTemplateStore } from '@/stores/template';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
    modelValue: string | null;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const router = useRouter();
const templateStore = useTemplateStore();
const { templates } = storeToRefs(templateStore);

onMounted(() => {
    templateStore.fetchTemplates();
});

function navigateToNewTemplate() {
    router.push({ name: 'template-new' });
}

function navigateToEditTemplate(id: string) {
    router.push({ name: 'template-edit', params: { id } });
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-surface-700 dark:text-surface-300">Select a template</p>
            <Button class="p-button-text p-button-sm" data-testid="new-template-button" icon="pi pi-plus" label="New Template" @click="navigateToNewTemplate" />
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
                v-for="template in templates"
                :key="template.id"
                :data-testid="`template-option-${template.name}`"
                class="relative cursor-pointer rounded-lg border-2 p-4 transition-colors"
                :class="props.modelValue === template.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-950' : 'border-surface-200 dark:border-surface-700 hover:border-primary-300'"
                @click="emit('update:modelValue', template.id)"
            >
                <p class="font-medium">{{ template.name }}</p>
                <Button class="p-button-text p-button-secondary p-button-sm absolute right-2 top-2" :data-testid="`edit-template-${template.name}`" icon="pi pi-pencil" @click.stop="navigateToEditTemplate(template.id)" />
            </div>
        </div>
    </div>
</template>
