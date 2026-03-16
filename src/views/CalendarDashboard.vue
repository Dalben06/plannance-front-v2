<script lang="ts" setup>
import CalendarMonth from '@/components/calendar/CalendarMonth.vue';
import CalendarSummary from '@/components/calendar/CalendarSummary.vue';
import { useCalendarStore } from '@/stores/calendar';
import { onMounted } from 'vue';

const calendarStore = useCalendarStore();

onMounted(() => {
    calendarStore.getEventsFromMonth();
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <!-- <StatsWidget /> -->
        <CalendarSummary class="col-span-12 lg:col-span-4" />
        <div class="col-span-12">
            <CalendarMonth :max-chips-per-day="2" />
        </div>
    </div>
</template>
