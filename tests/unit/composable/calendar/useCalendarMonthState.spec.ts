import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import { useCalendarMonthState } from '@/composable/calendar/useCalendarMonthState';

describe('useCalendarMonthState', () => {
    describe('monthTitle', () => {
        it('returns "March 2026" for month=2, year=2026 in en-US', () => {
            const { monthTitle } = useCalendarMonthState({
                month: ref(2),
                year: ref(2026),
                weekStartsOn: 0,
                locale: 'en-US'
            });
            expect(monthTitle.value).toBe('March 2026');
        });

        it('returns "January 2026" for month=0, year=2026 in en-US', () => {
            const { monthTitle } = useCalendarMonthState({
                month: ref(0),
                year: ref(2026),
                weekStartsOn: 0,
                locale: 'en-US'
            });
            expect(monthTitle.value).toBe('January 2026');
        });

        it('reactivity: change month ref updates monthTitle', () => {
            const month = ref(0);
            const { monthTitle } = useCalendarMonthState({
                month,
                year: ref(2026),
                weekStartsOn: 0,
                locale: 'en-US'
            });
            expect(monthTitle.value).toBe('January 2026');
            month.value = 11;
            expect(monthTitle.value).toBe('December 2026');
        });
    });

    describe('weekdayLabels', () => {
        it('returns exactly 7 labels', () => {
            const { weekdayLabels } = useCalendarMonthState({
                month: ref(2),
                year: ref(2026),
                weekStartsOn: 0,
                locale: 'en-US'
            });
            expect(weekdayLabels.value).toHaveLength(7);
        });

        it('weekStartsOn=0: starts with "Sun" in en-US', () => {
            const { weekdayLabels } = useCalendarMonthState({
                month: ref(2),
                year: ref(2026),
                weekStartsOn: 0,
                locale: 'en-US'
            });
            expect(weekdayLabels.value[0]).toBe('Sun');
        });

        it('weekStartsOn=1: starts with "Mon" in en-US', () => {
            const { weekdayLabels } = useCalendarMonthState({
                month: ref(2),
                year: ref(2026),
                weekStartsOn: 1,
                locale: 'en-US'
            });
            expect(weekdayLabels.value[0]).toBe('Mon');
        });

        it('weekStartsOn=1: last label is "Sun" in en-US', () => {
            const { weekdayLabels } = useCalendarMonthState({
                month: ref(2),
                year: ref(2026),
                weekStartsOn: 1,
                locale: 'en-US'
            });
            expect(weekdayLabels.value[6]).toBe('Sun');
        });

        it('accepts weekStartsOn as a Ref', () => {
            const weekStartsOn = ref<0 | 1>(0);
            const { weekdayLabels } = useCalendarMonthState({
                month: ref(2),
                year: ref(2026),
                weekStartsOn,
                locale: 'en-US'
            });
            expect(weekdayLabels.value[0]).toBe('Sun');
            weekStartsOn.value = 1;
            expect(weekdayLabels.value[0]).toBe('Mon');
        });

        it('accepts locale as a Ref', () => {
            const locale = ref('en-US');
            const { weekdayLabels } = useCalendarMonthState({
                month: ref(2),
                year: ref(2026),
                weekStartsOn: 0,
                locale
            });
            expect(weekdayLabels.value).toHaveLength(7);
        });
    });
});
