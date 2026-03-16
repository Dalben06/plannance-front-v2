import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { ref } from 'vue';
import CalendarDayRow from '@/components/calendar/CalendarDayRow.vue';
import type { CalendarDay } from '@/types/api.p';

vi.mock('@/api/calendar', () => ({
    getMouthEvents: vi.fn().mockResolvedValue([])
}));

// We control isLoading by mocking the store
const mockIsLoading = ref(false);

vi.mock('@/stores/calendar', () => ({
    useCalendarStore: () => ({ isLoading: mockIsLoading })
}));

// storeToRefs needs to work with our mock — provide a simple shim
vi.mock('pinia', async (importOriginal) => {
    const actual = await importOriginal<typeof import('pinia')>();
    return {
        ...actual,
        storeToRefs: (store: any) => store
    };
});

function makeDay(overrides: Partial<CalendarDay> = {}): CalendarDay {
    return {
        id: '1',
        date: '2026-03-15T12:00:00',
        events: [],
        expense: 0,
        income: 0,
        ...overrides
    };
}

const currentDate = new Date(2026, 2, 1); // March 2026

describe('CalendarDayRow', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        mockIsLoading.value = false;
    });

    it('isLoading=true: day-skeleton is visible', async () => {
        mockIsLoading.value = true;

        const wrapper = shallowMount(CalendarDayRow, {
            props: { currentDate, days: [makeDay()], maxChipsPerDay: 3 }
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-testid="day-skeleton"]').exists()).toBe(true);
    });

    it('isLoading=false: skeletons absent, day-number visible', async () => {
        mockIsLoading.value = false;

        const wrapper = shallowMount(CalendarDayRow, {
            props: { currentDate, days: [makeDay()], maxChipsPerDay: 3 }
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-testid="day-skeleton"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="day-number"]').exists()).toBe(true);
    });

    it('day is today: cell has ring class', async () => {
        // Use local noon time to avoid UTC midnight timezone issues
        const today = new Date();
        const todayLocalNoon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
        const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

        const wrapper = shallowMount(CalendarDayRow, {
            props: {
                currentDate: currentMonthDate,
                days: [makeDay({ date: todayLocalNoon })],
                maxChipsPerDay: 3
            }
        });

        await wrapper.vm.$nextTick();
        const cell = wrapper.find('[data-testid="day-cell"]');
        expect(cell.classes().join(' ')).toContain('ring');
    });

    it('day is outside current month: cell has opacity class', async () => {
        const wrapper = shallowMount(CalendarDayRow, {
            props: {
                currentDate, // March 2026
                days: [makeDay({ date: new Date(2026, 1, 28) })], // February day
                maxChipsPerDay: 3
            }
        });

        await wrapper.vm.$nextTick();
        const cell = wrapper.find('[data-testid="day-cell"]');
        expect(cell.classes().join(' ')).toContain('opacity');
    });

    it('day inside current month: no opacity class', async () => {
        const wrapper = shallowMount(CalendarDayRow, {
            props: {
                currentDate, // March 2026
                days: [makeDay({ date: new Date(2026, 2, 10) })],
                maxChipsPerDay: 3
            }
        });

        await wrapper.vm.$nextTick();
        const cell = wrapper.find('[data-testid="day-cell"]');
        expect(cell.classes().join(' ')).not.toContain('opacity');
    });
});
