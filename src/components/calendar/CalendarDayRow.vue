<script lang="ts" setup>
import CalendarEventDay from '@/components/calendar/CalendarEventDay.vue';
import CalendarSummaryDay from '@/components/calendar/CalendarSummaryDay.vue';
import { useCalendarEventModal } from '@/composable/calendar/useCalendarEventModal';
import { useCalendarStore } from '@/stores/calendar';
import type { CalendarDay } from '@/types/api.p';
import { atNoon, isSameDay, toISODate, toKey } from '@/utils/calendar-utils';
import { storeToRefs } from 'pinia';

const { isLoading } = storeToRefs(useCalendarStore());

const props = defineProps<{
    currentDate: Date;
    days: CalendarDay[];
    maxChipsPerDay: number;
}>();

const today = atNoon(new Date());

function isOutsideMonth(d: Date | string): boolean {
    const date = toISODate(d);
    return date.getMonth() !== props.currentDate.getMonth() || date.getFullYear() !== props.currentDate.getFullYear();
}

function isToday(d: Date | string): boolean {
    return isSameDay(d, today);
}

function toKeyDate(d: Date | string): string {
    return toKey(d);
}

function cellClass(d: Date | string): string {
    const classes: string[] = [];
    if (isToday(d)) {
        classes.push('ring-2 ring-primary-400/30 shadow-lg shadow-primary-500/10');
    }
    if (isOutsideMonth(d)) classes.push('opacity-50');
    return classes.join(' ');
}

function dayBadgeClass(d: Date | string): string {
    return isToday(d) ? 'bg-primary-500/10 text-primary-700 dark:text-primary-300' : 'bg-surface-100 dark:bg-surface-700/50 text-surface-600 dark:text-surface-300';
}

const { openForEdit } = useCalendarEventModal();
function openForCreate(date: Date = toISODate(props.currentDate)): void {
    openForEdit({ start: date, title: '', amount: 0, type: 'debit', id: '' });
}
</script>

<template>
    <div
        v-for="day in props.days"
        :key="toKeyDate(day.date)"
        role="gridcell"
        data-testid="day-cell"
        class="min-h-32 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/40 p-2 shadow-sm transition hover:-translate-y-0.5 hover:bg-surface-100 dark:hover:bg-surface-700/50 hover:border-primary-300/60 dark:hover:border-primary-400/60 hover:shadow-md grid grid-rows-[auto_1fr_auto] gap-1"
        :class="cellClass(day.date)"
    >
        <div class="flex items-center justify-between">
            <template v-if="isLoading">
                <span data-testid="day-skeleton" class="h-8 w-8 rounded-lg bg-surface-200 dark:bg-surface-700 animate-pulse" aria-hidden="true" />
            </template>
            <template v-else>
                <button type="button" class="layout-topbar-action" title="Add Event" @click="openForCreate(toISODate(day.date))">
                    <i class="pi pi-calendar-plus"></i>
                </button>
                <span data-testid="day-number" class="grid h-8 w-8 place-items-center rounded-lg text-sm font-extrabold" :class="dayBadgeClass(day.date)">
                    {{ toISODate(day.date).getDate() }}
                </span>
            </template>
        </div>

        <template v-if="!isLoading">
            <CalendarEventDay data-testid="event-day" :events="day.events" :max-chips-per-day="props.maxChipsPerDay" />
        </template>
        <template v-else>
            <div data-testid="events-skeleton" class="mt-2 space-y-1">
                <span class="block h-3 w-20 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" aria-hidden="true" />
                <span class="block h-3 w-14 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" aria-hidden="true" />
            </div>
        </template>

        <template v-if="!isLoading">
            <CalendarSummaryDay data-testid="summary-day" :expense="day.expense" :income="day.income" />
        </template>
        <template v-else>
            <div data-testid="summary-skeleton" class="mt-2 flex items-center gap-2">
                <span class="inline-block h-3 w-10 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" aria-hidden="true" />
                <span class="inline-block h-3 w-10 rounded bg-surface-200 dark:bg-surface-700 animate-pulse" aria-hidden="true" />
            </div>
        </template>
    </div>
</template>
