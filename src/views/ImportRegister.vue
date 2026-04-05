<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const steps = [{ label: 'Import' }, { label: 'Check' }, { label: 'Confirm' }];

const stepIndex = computed<number>(() => {
    const map: Record<string, number> = {
        'import-register': 0,
        'import-review': 1,
        'import-confirm': 2
    };
    return map[route.name as string] ?? 0;
});
</script>

<template>
    <div class="flex flex-col gap-8">
        <Steps :model="steps" :active-step="stepIndex" data-testid="import-steps" :readonly="true" />
        <router-view />
    </div>
</template>
