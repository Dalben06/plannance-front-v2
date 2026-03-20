import type { CalendarEvent } from '@/types/api.p';
import { ref } from 'vue';

// Module-level singleton — shared application-wide for the CalendarEventModal.
// Do not use this composable expecting isolated state per call.
const visible = ref(false);
const editingEvent = ref<CalendarEvent | null>(null);
const _skipNextReset = ref(false);

function openForCreate() {
    editingEvent.value = null;
    visible.value = true;
}

function openForEdit(event: CalendarEvent) {
    editingEvent.value = event;
    visible.value = true;
}

/** Re-shows the modal without resetting the form (used when user cancels a discard prompt). */
function reopen() {
    _skipNextReset.value = true;
    visible.value = true;
}

function close() {
    visible.value = false;
    editingEvent.value = null;
}

export function useCalendarEventModal() {
    return { visible, editingEvent, _skipNextReset, openForCreate, openForEdit, reopen, close };
}
