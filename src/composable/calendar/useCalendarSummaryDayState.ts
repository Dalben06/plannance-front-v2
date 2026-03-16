import { computed, type ComputedRef, type Ref } from 'vue';

export type CurrencyFormatter = (amount: number) => string;

export function createUsdFormatter(locale = 'en-US'): CurrencyFormatter {
    const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' });
    return (amount: number) => fmt.format(amount);
}

export function useCalendarSummaryDayState(params: { expense: Ref<number>; income: Ref<number>; format?: CurrencyFormatter }): {
    showExpense: ComputedRef<boolean>;
    showIncome: ComputedRef<boolean>;
    expenseFormat: ComputedRef<string>;
    incomeFormat: ComputedRef<string>;
    expenseTitle: ComputedRef<string>;
    incomeTitle: ComputedRef<string>;
} {
    const formatFn = params.format ?? createUsdFormatter('en-US');

    const showExpense = computed(() => params.expense.value > 0);
    const showIncome = computed(() => params.income.value > 0);

    const expenseFormat = computed(() => formatFn(params.expense.value));
    const incomeFormat = computed(() => formatFn(params.income.value));

    const expenseTitle = computed(() => `Spent: ${expenseFormat.value}`);
    const incomeTitle = computed(() => `Income: ${incomeFormat.value}`);

    return {
        showExpense,
        showIncome,
        expenseFormat,
        incomeFormat,
        expenseTitle,
        incomeTitle
    };
}
