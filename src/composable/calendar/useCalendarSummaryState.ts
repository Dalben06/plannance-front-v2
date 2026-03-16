import { computed, type ComputedRef, type Ref } from 'vue';

export type FormatCurrency = (amount: number) => string;

export function useCalendarSummaryState(params: { expenses: Ref<number>; income: Ref<number>; isLoading: Ref<boolean>; formatCurrency: FormatCurrency }): {
    expenseFormatted: ComputedRef<string>;
    incomeFormatted: ComputedRef<string>;
} {
    const expenseFormatted = computed(() => (params.isLoading.value ? 'Loading...' : params.formatCurrency(params.expenses.value)));

    const incomeFormatted = computed(() => (params.isLoading.value ? 'Loading...' : params.formatCurrency(params.income.value)));

    return { expenseFormatted, incomeFormatted };
}
