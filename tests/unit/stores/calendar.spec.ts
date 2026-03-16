import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCalendarStore } from '@/stores/calendar';

vi.mock('@/api/calendar', () => ({
    getMouthEvents: vi.fn()
}));

import { getMouthEvents } from '@/api/calendar';

const mockGetMouthEvents = vi.mocked(getMouthEvents);

describe('useCalendarStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockGetMouthEvents.mockResolvedValue([]);
    });

    it('initial state: days=[], fetchingEvents=false, date is today', () => {
        const store = useCalendarStore();
        expect(store.days).toEqual([]);
        expect(store.isLoading).toBe(false);
        expect(store.date).toBeInstanceOf(Date);
    });

    it('month: computed from date.getMonth()', () => {
        const store = useCalendarStore();
        store.date = new Date(2026, 5, 1);
        expect(store.month).toBe(5);
    });

    it('expenses: sum of all day.expense values', () => {
        const store = useCalendarStore();
        store.days = [
            { id: '1', date: '2026-03-01', events: [], expense: 100, income: 0 },
            { id: '2', date: '2026-03-02', events: [], expense: 200, income: 0 }
        ];
        expect(store.expenses).toBe(300);
    });

    it('expenses: 0 when days is empty', () => {
        const store = useCalendarStore();
        expect(store.expenses).toBe(0);
    });

    it('income: sum of all day.income values', () => {
        const store = useCalendarStore();
        store.days = [
            { id: '1', date: '2026-03-01', events: [], expense: 0, income: 150 },
            { id: '2', date: '2026-03-02', events: [], expense: 0, income: 250 }
        ];
        expect(store.income).toBe(400);
    });

    it('income: 0 when days is empty', () => {
        const store = useCalendarStore();
        expect(store.income).toBe(0);
    });

    it('isLoading: mirrors fetchingEvents state', async () => {
        const store = useCalendarStore();
        expect(store.isLoading).toBe(false);
    });

    it('goToday(): resets date to today', () => {
        const store = useCalendarStore();
        store.date = new Date(2025, 0, 1);
        const before = new Date();
        store.goToday();
        const after = new Date();
        expect(store.date.getTime()).toBeGreaterThanOrEqual(before.getTime());
        expect(store.date.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('getEventsFromMonth(): calls getMouthEvents with yearMonth and sets days', async () => {
        const mockDays = [{ id: '1', date: '2026-03-01', events: [], expense: 0, income: 0 }];
        mockGetMouthEvents.mockResolvedValue(mockDays);

        const store = useCalendarStore();
        store.date = new Date(2026, 2, 1);
        await store.getEventsFromMonth();

        expect(mockGetMouthEvents).toHaveBeenCalledWith('2026-03');
        expect(store.days).toEqual(mockDays);
    });

    it('watcher: changing date triggers API call', async () => {
        const store = useCalendarStore();
        // Wait for initial watcher call from store creation
        await vi.waitFor(() => expect(mockGetMouthEvents).toHaveBeenCalled());
        mockGetMouthEvents.mockClear();

        store.date = new Date(2026, 5, 1);
        await vi.waitFor(() => expect(mockGetMouthEvents).toHaveBeenCalledWith('2026-06'));
    });

    it('watcher: sets fetchingEvents=false after API call completes', async () => {
        const store = useCalendarStore();
        await vi.waitFor(() => expect(mockGetMouthEvents).toHaveBeenCalled());
        // After the initial watcher fires and resolves, isLoading should be false
        expect(store.isLoading).toBe(false);
    });
});
