<script lang="ts" setup>
import BaseStatsWidget, { type StatsWidgetProps } from '@/components/dashboard/BaseStatsWidget.vue';
import { useCalendarEventModal } from '@/composable/calendar/useCalendarEventModal';
import { useCalendarSummaryState } from '@/composable/calendar/useCalendarSummaryState';
import { useCalendarStore } from '@/stores/calendar';
import { formatCurrency } from '@/utils/calendar-utils';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const { expenses, income, isLoading } = storeToRefs(useCalendarStore());

const { expenseFormatted, incomeFormatted } = useCalendarSummaryState({
    expenses,
    income,
    isLoading,
    formatCurrency
});

const { openForCreate } = useCalendarEventModal();

const charts = computed<StatsWidgetProps[]>(() => [
    { title: 'Expenses', value: expenseFormatted.value, icon: 'pi pi-chart-bar', color: 'red' },
    { title: 'Income', value: incomeFormatted.value, icon: 'pi pi-arrow-up-right', color: 'green' },
    { title: 'Budget', value: '$4,000.00', icon: 'pi pi-chart-pie', color: 'violet' },
    { title: 'Balance', value: '$10,000.00', icon: 'pi pi-wallet', color: 'primary' }
]);
</script>

<template>
    <BaseStatsWidget v-if="charts.length" :items="charts" :isLoading="isLoading" />
    <div class="col-span-12 flex justify-end">
        <Button label="Add Event" icon="pi pi-plus" @click="openForCreate" />
    </div>
</template>
