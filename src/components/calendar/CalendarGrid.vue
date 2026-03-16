<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import CalendarDayRow from '@/components/calendar/CalendarDayRow.vue';
import { useCalendarStore } from '@/stores/calendar';

const props = defineProps<{
    weekStartsOn: 0 | 1;
    maxChipsPerDay: number;
}>();

const calendarStore = useCalendarStore();
const { date: currentDateRef, days } = storeToRefs(calendarStore);
</script>

<template>
    <div class="min-h-0 flex-1 overflow-auto p-2">
        <div class="grid h-full grid-cols-7 grid-rows-6 gap-px bg-surface-200 dark:bg-surface-700" role="grid" aria-label="Month view calendar">
            <CalendarDayRow :days="days" :current-date="currentDateRef" :max-chips-per-day="props.maxChipsPerDay" />
        </div>
    </div>
</template>
