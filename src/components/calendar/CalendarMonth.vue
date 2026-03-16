<script setup lang="ts">
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
import CalendarHeader from '@/components/calendar/CalendarHeader.vue';
import { useCalendarMonthState } from '@/composable/calendar/useCalendarMonthState';
import { useCalendarStore } from '@/stores/calendar';
import type { WeekStartsOn } from '@/types/api.p';
import { storeToRefs } from 'pinia';
import { computed, toRef } from 'vue';

const props = withDefaults(
    defineProps<{
        weekStartsOn?: WeekStartsOn; // 0=Sun, 1=Mon
        maxChipsPerDay?: number;
        locale?: string;
    }>(),
    {
        weekStartsOn: 0,
        maxChipsPerDay: 2,
        locale: 'en-US'
    }
);

const calendarStore = useCalendarStore();
const { month, date } = storeToRefs(calendarStore);

const { monthTitle, weekdayLabels } = useCalendarMonthState({
    month,
    weekStartsOn: computed(() => props.weekStartsOn),
    locale: toRef(props, 'locale'),
    year: computed(() => date.value.getFullYear())
});
</script>

<template>
    <div class="flex h-full w-full flex-col overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 shadow-md">
        <calendar-header :month="monthTitle" />

        <!-- Weekday header row -->
        <div class="grid grid-cols-7 border-b border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800" role="row">
            <div v-for="weekDay in weekdayLabels" :key="weekDay" class="py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-surface-500 dark:text-surface-400" role="columnheader">
                {{ weekDay }}
            </div>
        </div>

        <calendar-grid :week-starts-on="weekStartsOn" :max-chips-per-day="props.maxChipsPerDay" />
    </div>
</template>
