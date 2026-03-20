<script lang="ts" setup>
import { useCalendarEventModal } from '@/composable/calendar/useCalendarEventModal';
import type { CalendarEvent } from '@/types/api.p';

const { openForEdit } = useCalendarEventModal();

const props = defineProps<{
    events: CalendarEvent[];
    maxChipsPerDay: number;
}>();

function chipClasses(ev: CalendarEvent): string {
    const base =
        'truncate rounded-xl border border-surface-200 dark:border-surface-700 ' +
        'px-2 py-0.5 text-[10px] font-semibold text-surface-700 dark:text-surface-100 border-l-4 ' +
        'transition hover:bg-surface-100 dark:hover:bg-surface-700/50 ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50';

    if (ev.type === 'debit') return base + ' bg-rose-400/10 border-l-rose-400/60';
    return base + ' bg-primary-400/10 border-l-primary-400/60';
}
</script>

<template>
    <div class="min-h-0 overflow-hidden">
        <div class="flex min-h-0 flex-col gap-1 overflow-hidden">
            <template v-if="props.events?.length">
                <button v-for="eventDay in props.events.slice(0, props.maxChipsPerDay)" :key="eventDay.id" data-testid="event-chip" type="button" :class="chipClasses(eventDay)" :title="eventDay.title" @click="openForEdit(eventDay)">
                    {{ eventDay.title }}
                </button>

                <button
                    v-if="props.events.length > props.maxChipsPerDay"
                    type="button"
                    class="inline-flex w-fit items-center rounded-full border border-primary-300/40 dark:border-primary-400/40 bg-primary-500/10 px-2 py-1 text-[11px] font-extrabold text-primary-700 dark:text-primary-300 transition hover:bg-primary-500/15 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50"
                    :title="`Show ${props.events.length - props.maxChipsPerDay} more`"
                >
                    +{{ props.events.length - props.maxChipsPerDay }} more
                </button>
            </template>
        </div>
    </div>
</template>
