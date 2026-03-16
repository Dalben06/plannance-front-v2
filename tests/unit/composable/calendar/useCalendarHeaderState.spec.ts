import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useCalendarHeaderState, type CalendarHeaderStore } from '@/composable/calendar/useCalendarHeaderState';

function makeStore(overrides: Partial<CalendarHeaderStore> = {}): CalendarHeaderStore {
    return {
        month: 2,
        goToday: vi.fn(),
        date: new Date(2026, 2, 15),
        ...overrides
    };
}

describe('useCalendarHeaderState', () => {
    describe('isBusy / canInteract', () => {
        it('isBusy is true when isLoading=true', () => {
            const { isBusy } = useCalendarHeaderState({
                store: makeStore(),
                currentMonth: ref(2),
                isLoading: ref(true)
            });
            expect(isBusy.value).toBe(true);
        });

        it('canInteract is false when isLoading=true', () => {
            const { canInteract } = useCalendarHeaderState({
                store: makeStore(),
                currentMonth: ref(2),
                isLoading: ref(true)
            });
            expect(canInteract.value).toBe(false);
        });

        it('isBusy is false when isLoading=false', () => {
            const { isBusy } = useCalendarHeaderState({
                store: makeStore(),
                currentMonth: ref(2),
                isLoading: ref(false)
            });
            expect(isBusy.value).toBe(false);
        });

        it('canInteract is true when isLoading=false', () => {
            const { canInteract } = useCalendarHeaderState({
                store: makeStore(),
                currentMonth: ref(2),
                isLoading: ref(false)
            });
            expect(canInteract.value).toBe(true);
        });
    });

    describe('prevMonth', () => {
        it('decrements month', () => {
            const store = makeStore({ date: new Date(2026, 5, 1) }); // June 2026
            const { prevMonth } = useCalendarHeaderState({
                store,
                currentMonth: ref(5),
                isLoading: ref(false)
            });
            prevMonth();
            expect(store.date.getMonth()).toBe(4); // May
        });

        it('wraps Jan (0) -> Dec (11) of previous year', () => {
            const store = makeStore({ date: new Date(2026, 0, 1) }); // January 2026
            const { prevMonth } = useCalendarHeaderState({
                store,
                currentMonth: ref(0),
                isLoading: ref(false)
            });
            prevMonth();
            expect(store.date.getMonth()).toBe(11); // December
            expect(store.date.getFullYear()).toBe(2025);
        });

        it('is a no-op when isLoading=true', () => {
            const store = makeStore({ date: new Date(2026, 5, 1) });
            const originalDate = store.date;
            const { prevMonth } = useCalendarHeaderState({
                store,
                currentMonth: ref(5),
                isLoading: ref(true)
            });
            prevMonth();
            expect(store.date).toBe(originalDate);
        });
    });

    describe('nextMonth', () => {
        it('increments month', () => {
            const store = makeStore({ date: new Date(2026, 5, 1) }); // June 2026
            const { nextMonth } = useCalendarHeaderState({
                store,
                currentMonth: ref(5),
                isLoading: ref(false)
            });
            nextMonth();
            expect(store.date.getMonth()).toBe(6); // July
        });

        it('wraps Dec (11) -> Jan (0) of next year', () => {
            const store = makeStore({ date: new Date(2026, 11, 1) }); // December 2026
            const { nextMonth } = useCalendarHeaderState({
                store,
                currentMonth: ref(11),
                isLoading: ref(false)
            });
            nextMonth();
            expect(store.date.getMonth()).toBe(0); // January
            expect(store.date.getFullYear()).toBe(2027);
        });

        it('is a no-op when isLoading=true', () => {
            const store = makeStore({ date: new Date(2026, 5, 1) });
            const originalDate = store.date;
            const { nextMonth } = useCalendarHeaderState({
                store,
                currentMonth: ref(5),
                isLoading: ref(true)
            });
            nextMonth();
            expect(store.date).toBe(originalDate);
        });
    });

    describe('goToday', () => {
        it('delegates to store.goToday()', () => {
            const store = makeStore();
            const { goToday } = useCalendarHeaderState({
                store,
                currentMonth: ref(2),
                isLoading: ref(false)
            });
            goToday();
            expect(store.goToday).toHaveBeenCalledOnce();
        });

        it('is a no-op when isLoading=true', () => {
            const store = makeStore();
            const { goToday } = useCalendarHeaderState({
                store,
                currentMonth: ref(2),
                isLoading: ref(true)
            });
            goToday();
            expect(store.goToday).not.toHaveBeenCalled();
        });
    });
});
