import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { createUsdFormatter, useCalendarSummaryDayState } from '@/composable/calendar/useCalendarSummaryDayState';

describe('createUsdFormatter', () => {
    it('formats 1234.5 as $1,234.50 in en-US', () => {
        const fmt = createUsdFormatter('en-US');
        expect(fmt(1234.5)).toBe('$1,234.50');
    });

    it('formats 0 as $0.00', () => {
        const fmt = createUsdFormatter();
        expect(fmt(0)).toBe('$0.00');
    });
});

describe('useCalendarSummaryDayState', () => {
    it.each([
        [100, true],
        [0, false],
        [0.01, true]
    ])('showExpense is %s when expense=%s', (expense, expected) => {
        const { showExpense } = useCalendarSummaryDayState({ expense: ref(expense), income: ref(0) });
        expect(showExpense.value).toBe(expected);
    });

    it.each([
        [50, true],
        [0, false],
        [0.01, true]
    ])('showIncome is %s when income=%s', (income, expected) => {
        const { showIncome } = useCalendarSummaryDayState({ expense: ref(0), income: ref(income) });
        expect(showIncome.value).toBe(expected);
    });

    it('expenseFormat calls format fn with expense amount', () => {
        const format = vi.fn((n: number) => `$${n}`);
        const { expenseFormat } = useCalendarSummaryDayState({ expense: ref(42), income: ref(0), format });
        expect(expenseFormat.value).toBe('$42');
        expect(format).toHaveBeenCalledWith(42);
    });

    it('incomeFormat calls format fn with income amount', () => {
        const format = vi.fn((n: number) => `$${n}`);
        const { incomeFormat } = useCalendarSummaryDayState({ expense: ref(0), income: ref(99), format });
        expect(incomeFormat.value).toBe('$99');
        expect(format).toHaveBeenCalledWith(99);
    });

    it('expenseTitle equals "Spent: " + format(expense)', () => {
        const format = vi.fn((n: number) => `$${n}`);
        const { expenseTitle } = useCalendarSummaryDayState({ expense: ref(100), income: ref(0), format });
        expect(expenseTitle.value).toBe('Spent: $100');
    });

    it('incomeTitle equals "Income: " + format(income)', () => {
        const format = vi.fn((n: number) => `$${n}`);
        const { incomeTitle } = useCalendarSummaryDayState({ expense: ref(0), income: ref(200), format });
        expect(incomeTitle.value).toBe('Income: $200');
    });

    it('reactivity: changing expense ref updates showExpense', () => {
        const expense = ref(0);
        const { showExpense } = useCalendarSummaryDayState({ expense, income: ref(0) });
        expect(showExpense.value).toBe(false);
        expense.value = 100;
        expect(showExpense.value).toBe(true);
    });

    it('reactivity: changing expense ref updates expenseFormat', () => {
        const expense = ref(0);
        const format = vi.fn((n: number) => `$${n}`);
        const { expenseFormat } = useCalendarSummaryDayState({ expense, income: ref(0), format });
        expect(expenseFormat.value).toBe('$0');
        expense.value = 500;
        expect(expenseFormat.value).toBe('$500');
    });

    it('uses default USD formatter when no format fn provided', () => {
        const { expenseFormat } = useCalendarSummaryDayState({ expense: ref(1000), income: ref(0) });
        expect(expenseFormat.value).toBe('$1,000.00');
    });
});
