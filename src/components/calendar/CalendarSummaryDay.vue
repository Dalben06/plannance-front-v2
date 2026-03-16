<script lang="ts" setup>
import { useCalendarSummaryDayState } from '@/composable/calendar/useCalendarSummaryDayState';
import { toRef } from 'vue';

const props = defineProps<{
    expense: number;
    income: number;
}>();

const { showExpense, showIncome, expenseFormat, incomeFormat, expenseTitle, incomeTitle } = useCalendarSummaryDayState({
    expense: toRef(props, 'expense'),
    income: toRef(props, 'income')
});
</script>

<template>
    <div class="mt-1 flex min-h-0 flex-col gap-1 overflow-hidden">
        <div
            v-if="showExpense"
            class="truncate rounded-xl border border-surface-200 dark:border-surface-700 bg-rose-400/10 px-2 py-0.5 text-[10px] font-semibold text-surface-700 dark:text-surface-100 border-l-4 border-l-rose-400/60"
            :title="expenseTitle"
        >
            Spent: {{ expenseFormat }}
        </div>

        <div
            v-if="showIncome"
            class="truncate rounded-xl border border-surface-200 dark:border-surface-700 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-surface-700 dark:text-surface-100 border-l-4 border-l-emerald-400/60"
            :title="incomeTitle"
        >
            Income: {{ incomeFormat }}
        </div>
    </div>
</template>
