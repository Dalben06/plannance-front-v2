import { getMouthEvents } from '@/api/calendar';
import type { CalendarDay } from '@/types/api.p';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export const useCalendarStore = defineStore('calendar', () => {
    const days = ref<CalendarDay[]>([]);
    const date = ref<Date>(new Date());
    const fetchingEvents = ref(false);
    const isLoading = computed(() => fetchingEvents.value);
    const month = computed(() => date.value?.getMonth()); // 0-11

    function goToday() {
        date.value = new Date();
    }

    function getMonth() {
        const mo = date.value?.getMonth() + 1;
        const string = mo.toString();
        if (string.length > 1) return string;

        return '0' + string;
    }

    const yearMonth = computed(() => {
        return `${date.value.getFullYear()}-${getMonth()}`;
    });

    async function getEventsFromMonth() {
        days.value = await getMouthEvents(yearMonth.value);
    }

    const expenses = computed(() => {
        return days.value.reduce((sum, event) => sum + event.expense, 0) ?? 0;
    });

    const income = computed(() => {
        return days.value.reduce((sum, event) => sum + event.income, 0) ?? 0;
    });

    watch(month, async () => {
        fetchingEvents.value = true;
        try {
            await getEventsFromMonth();
        } finally {
            fetchingEvents.value = false;
        }
    });

    return { days, month, date, goToday, expenses, income, isLoading, getEventsFromMonth };
});
