import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import CalendarEventDay from '@/components/calendar/CalendarEventDay.vue';
import type { CalendarEvent } from '@/types/api.p';

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
    return {
        id: Math.random().toString(),
        title: 'Test Event',
        start: '2026-03-15',
        amount: 100,
        type: 'debit',
        ...overrides
    };
}

describe('CalendarEventDay', () => {
    it('empty events array: renders nothing', () => {
        const wrapper = shallowMount(CalendarEventDay, {
            props: { events: [], maxChipsPerDay: 3 }
        });
        expect(wrapper.find('[title]').exists()).toBe(false);
    });

    it('events.length <= maxChipsPerDay: renders all chips, no "+more" button', () => {
        const events = [makeEvent({ title: 'A' }), makeEvent({ title: 'B' })];
        const wrapper = shallowMount(CalendarEventDay, {
            props: { events, maxChipsPerDay: 3 }
        });
        expect(wrapper.findAll('div[title]')).toHaveLength(2);
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('events.length > maxChipsPerDay: renders only maxChipsPerDay chips + "+N more" button', () => {
        const events = [makeEvent({ title: 'A' }), makeEvent({ title: 'B' }), makeEvent({ title: 'C' }), makeEvent({ title: 'D' })];
        const wrapper = shallowMount(CalendarEventDay, {
            props: { events, maxChipsPerDay: 2 }
        });
        expect(wrapper.findAll('div[title]')).toHaveLength(2);
        const button = wrapper.find('button');
        expect(button.exists()).toBe(true);
        expect(button.text()).toContain('+2 more');
    });

    it.each([
        [3, 2, 2, true],
        [2, 2, 2, false],
        [1, 3, 1, false]
    ])('%i events with maxChipsPerDay=%i: %i chips shown, button=%s', (eventsCount, maxChips, expectedChips, hasButton) => {
        const events = Array.from({ length: eventsCount }, (_, i) => makeEvent({ title: `Event ${i}`, id: i }));
        const wrapper = shallowMount(CalendarEventDay, { props: { events, maxChipsPerDay: maxChips } });
        expect(wrapper.findAll('div[title]')).toHaveLength(expectedChips);
        expect(wrapper.find('button').exists()).toBe(hasButton);
    });

    it('event.type="debit": chip has rose color classes', () => {
        const events = [makeEvent({ type: 'debit', title: 'Expense' })];
        const wrapper = shallowMount(CalendarEventDay, { props: { events, maxChipsPerDay: 3 } });
        const chip = wrapper.find('div[title]');
        expect(chip.classes().join(' ')).toContain('rose');
    });

    it('event.type="credit": chip has primary color classes', () => {
        const events = [makeEvent({ type: 'credit', title: 'Income' })];
        const wrapper = shallowMount(CalendarEventDay, { props: { events, maxChipsPerDay: 3 } });
        const chip = wrapper.find('div[title]');
        expect(chip.classes().join(' ')).toContain('primary');
    });
});
