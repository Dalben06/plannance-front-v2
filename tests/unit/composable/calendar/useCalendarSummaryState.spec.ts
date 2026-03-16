import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCalendarSummaryState } from '@/composable/calendar/useCalendarSummaryState';

function makeParams(overrides: { expenses?: number; income?: number; isLoading?: boolean } = {}) {
    const formatCurrency = vi.fn((n: number) => `$${n.toFixed(2)}`);
    return {
        expenses: ref(overrides.expenses ?? 0),
        income: ref(overrides.income ?? 0),
        isLoading: ref(overrides.isLoading ?? false),
        formatCurrency
    };
}

describe('useCalendarSummaryState', () => {
    describe('expenseFormatted', () => {
        it('returns "Loading..." when isLoading=true', () => {
            const params = makeParams({ isLoading: true, expenses: 500 });
            const { expenseFormatted } = useCalendarSummaryState(params);
            expect(expenseFormatted.value).toBe('Loading...');
        });

        it('returns formatted currency when not loading', () => {
            const params = makeParams({ isLoading: false, expenses: 500 });
            const { expenseFormatted } = useCalendarSummaryState(params);
            expect(expenseFormatted.value).toBe('$500.00');
            expect(params.formatCurrency).toHaveBeenCalledWith(500);
        });
    });

    describe('incomeFormatted', () => {
        it('returns "Loading..." when isLoading=true', () => {
            const params = makeParams({ isLoading: true, income: 300 });
            const { incomeFormatted } = useCalendarSummaryState(params);
            expect(incomeFormatted.value).toBe('Loading...');
        });

        it('returns formatted currency when not loading', () => {
            const params = makeParams({ isLoading: false, income: 300 });
            const { incomeFormatted } = useCalendarSummaryState(params);
            expect(incomeFormatted.value).toBe('$300.00');
        });
    });

    describe('reactivity', () => {
        it('toggling isLoading switches expenseFormatted between states', () => {
            const params = makeParams({ expenses: 100 });
            const { expenseFormatted } = useCalendarSummaryState(params);

            expect(expenseFormatted.value).toBe('$100.00');
            params.isLoading.value = true;
            expect(expenseFormatted.value).toBe('Loading...');
            params.isLoading.value = false;
            expect(expenseFormatted.value).toBe('$100.00');
        });

        it('toggling isLoading switches incomeFormatted between states', () => {
            const params = makeParams({ income: 200 });
            const { incomeFormatted } = useCalendarSummaryState(params);

            expect(incomeFormatted.value).toBe('$200.00');
            params.isLoading.value = true;
            expect(incomeFormatted.value).toBe('Loading...');
            params.isLoading.value = false;
            expect(incomeFormatted.value).toBe('$200.00');
        });
    });
});
