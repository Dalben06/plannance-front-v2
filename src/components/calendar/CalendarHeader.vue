<script lang="ts" setup>
import { useCalendarHeaderState } from '@/composable/calendar/useCalendarHeaderState';
import { useCalendarStore } from '@/stores/calendar';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        month?: string;
    }>(),
    { month: 'December' }
);

const calendarStore = useCalendarStore();
const { month: currentMonth, isLoading } = storeToRefs(calendarStore);

const { isBusy, prevMonth, nextMonth, goToday } = useCalendarHeaderState({
    store: calendarStore,
    currentMonth,
    isLoading
});

const monthLabel = computed(() => props.month);

const viewMode = ref('month');
const viewOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' }
];
</script>

<template>
    <header class="flex items-center justify-between gap-4 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 px-5 py-4" :aria-busy="isBusy">
        <!-- Left: Today link -->
        <Button label="Today" text size="small" :disabled="isLoading" @click="goToday" />

        <!-- Center: < Month Year > -->
        <div class="flex items-center gap-2">
            <Button icon="pi pi-chevron-left" text rounded size="small" aria-label="Previous month" :disabled="isLoading" @click="prevMonth" />

            <h2 class="min-w-[11rem] text-center text-xl font-bold tracking-tight text-color">
                <template v-if="isLoading">
                    <span class="inline-block h-5 w-36 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" aria-hidden="true" />
                </template>
                <template v-else>{{ monthLabel }}</template>
            </h2>

            <Button icon="pi pi-chevron-right" text rounded size="small" aria-label="Next month" :disabled="isLoading" @click="nextMonth" />
        </div>

        <!-- Right: Day / Week / Month toggle -->
        <SelectButton v-model="viewMode" :options="viewOptions" :allow-empty="false" option-label="label" option-value="value" size="small" />
    </header>
</template>
