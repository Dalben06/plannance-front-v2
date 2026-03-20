import { beforeEach, describe, expect, it } from 'vitest';
import { useCalendarEventModal } from '@/composable/calendar/useCalendarEventModal';
import type { CalendarEvent } from '@/types/api.p';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
    return {
        id: '1',
        title: 'Test Event',
        start: '2026-03-15',
        amount: 100,
        type: 'debit',
        ...overrides
    };
}

// Reset module-level singleton state before each test
beforeEach(() => {
    const { close } = useCalendarEventModal();
    close();
});

describe('useCalendarEventModal', () => {
    describe('initial state', () => {
        it('visible is false', () => {
            const { visible } = useCalendarEventModal();
            expect(visible.value).toBe(false);
        });

        it('editingEvent is null', () => {
            const { editingEvent } = useCalendarEventModal();
            expect(editingEvent.value).toBeNull();
        });
    });

    describe('openForCreate', () => {
        it('sets visible=true and editingEvent=null', () => {
            const { openForCreate, visible, editingEvent } = useCalendarEventModal();
            openForCreate();
            expect(visible.value).toBe(true);
            expect(editingEvent.value).toBeNull();
        });

        it('clears a previously set editingEvent', () => {
            const { openForEdit, openForCreate, editingEvent } = useCalendarEventModal();
            openForEdit(makeEvent({ title: 'Old' }));
            openForCreate();
            expect(editingEvent.value).toBeNull();
        });
    });

    describe('openForEdit', () => {
        it('sets visible=true and stores the event', () => {
            const event = makeEvent({ title: 'My Event' });
            const { openForEdit, visible, editingEvent } = useCalendarEventModal();
            openForEdit(event);
            expect(visible.value).toBe(true);
            expect(editingEvent.value).toEqual(event);
        });

        it('replaces a previously set editingEvent', () => {
            const first = makeEvent({ id: '1', title: 'First' });
            const second = makeEvent({ id: '2', title: 'Second' });
            const { openForEdit, editingEvent } = useCalendarEventModal();
            openForEdit(first);
            openForEdit(second);
            expect(editingEvent.value).toEqual(second);
        });
    });

    describe('close', () => {
        it('sets visible=false and clears editingEvent', () => {
            const event = makeEvent();
            const { openForEdit, close, visible, editingEvent } = useCalendarEventModal();
            openForEdit(event);
            close();
            expect(visible.value).toBe(false);
            expect(editingEvent.value).toBeNull();
        });
    });

    describe('reopen', () => {
        it('sets visible=true without clearing editingEvent', () => {
            const event = makeEvent({ title: 'Keep Me' });
            const { openForEdit, reopen, visible, editingEvent } = useCalendarEventModal();
            // Simulate the modal being hidden by setting visible directly (not via close,
            // which would also clear editingEvent — reopen is for "cancel discard" flows)
            openForEdit(event);
            visible.value = false;
            reopen();
            expect(visible.value).toBe(true);
            expect(editingEvent.value).toEqual(event);
        });

        it('sets _skipNextReset=true', () => {
            const { reopen, _skipNextReset } = useCalendarEventModal();
            reopen();
            expect(_skipNextReset.value).toBe(true);
        });
    });

    describe('singleton behaviour', () => {
        it('all call sites share the same state', () => {
            const a = useCalendarEventModal();
            const b = useCalendarEventModal();
            a.openForCreate();
            expect(b.visible.value).toBe(true);
        });
    });
});
