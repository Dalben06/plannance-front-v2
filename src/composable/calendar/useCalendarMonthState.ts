import type { WeekStartsOn } from '@/types/api.p';
import { addDays, makeDate, startOfWeek } from '@/utils/calendar-utils';
import { computed, type ComputedRef, type Ref } from 'vue';

export type CalendarMonthUtils = {
    addDays: (d: Date, days: number) => Date;
    makeDate: (y: number, m: number, d: number) => Date;
    startOfWeek: (d: Date, weekStartsOn: WeekStartsOn) => Date;
};

const defaultUtils: CalendarMonthUtils = { addDays, makeDate, startOfWeek };

export function useCalendarMonthState(params: {
    month: Ref<number>; // 0..11
    year: Ref<number>;
    weekStartsOn: Ref<WeekStartsOn> | WeekStartsOn;
    locale: Ref<string> | string;
    now?: Ref<Date> | Date;
    utils?: Partial<CalendarMonthUtils>;
}): {
    monthTitle: ComputedRef<string>;
    weekdayLabels: ComputedRef<string[]>;
} {
    const utils: CalendarMonthUtils = { ...defaultUtils, ...(params.utils ?? {}) };

    const localeRef = computed(() => (typeof params.locale === 'string' ? params.locale : params.locale.value));
    const weekStartsOnRef = computed(() => (typeof params.weekStartsOn === 'number' ? params.weekStartsOn : params.weekStartsOn.value));

    const monthTitle = computed(() => {
        const fmt = new Intl.DateTimeFormat(localeRef.value, { month: 'long', year: 'numeric' });
        return fmt.format(new Date(params.year.value, params.month.value, 1));
    });

    const weekdayLabels = computed(() => {
        // deterministic base date (Sun Jan 4, 2026)
        const base = utils.makeDate(2026, 0, 4);
        const start = utils.startOfWeek(base, weekStartsOnRef.value);
        const fmt = new Intl.DateTimeFormat(localeRef.value, { weekday: 'short' });

        return Array.from({ length: 7 }, (_, i) => fmt.format(utils.addDays(start, i)));
    });

    return { monthTitle, weekdayLabels };
}
