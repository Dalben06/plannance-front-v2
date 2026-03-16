import { computed, type ComputedRef, type Ref } from 'vue';

export type CalendarHeaderStore = {
    // month is a store state property (number)
    month: number;
    goToday: () => void;
    date: Date;
};

export function useCalendarHeaderState(params: { store: CalendarHeaderStore; currentMonth: Ref<number>; isLoading: Ref<boolean> }): {
    isBusy: ComputedRef<boolean>;
    canInteract: ComputedRef<boolean>;
    prevMonth: () => void;
    nextMonth: () => void;
    goToday: () => void;
} {
    const isBusy = computed(() => params.isLoading.value);
    const canInteract = computed(() => !params.isLoading.value);

    function prevMonth(): void {
        if (!canInteract.value) return;

        changeMonth(params.currentMonth.value - 1);
    }

    function nextMonth(): void {
        if (!canInteract.value) return;
        changeMonth(params.currentMonth.value + 1);
    }

    function changeMonth(newMonth: number) {
        const date = params.store.date;
        let year = date.getFullYear();

        if (newMonth <= 0) {
            newMonth = 11;
            year -= 1;
        }

        if (newMonth > 11) {
            newMonth = 0;
            year += 1;
        }

        const newDate = new Date(year, newMonth, 1);
        params.store.date = newDate;
    }

    function goToday(): void {
        if (!canInteract.value) return;
        params.store.goToday();
    }

    return { isBusy, canInteract, prevMonth, nextMonth, goToday };
}
