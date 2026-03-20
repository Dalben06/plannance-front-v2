import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CalendarDay, CalendarEvent, ResponseAPI } from '@/types/api.p';

vi.mock('@/api/http', () => ({
    http: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn()
    }
}));

import { http } from '@/api/http';
import { getMouthEvents, createCalendarEvent, updateCalendarEvent } from '@/api/calendar';

const mockHttp = {
    get: vi.mocked(http.get),
    post: vi.mocked(http.post),
    put: vi.mocked(http.put)
};

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

function makeDay(overrides: Partial<CalendarDay> = {}): CalendarDay {
    return {
        id: 'd1',
        date: '2026-03-15',
        events: [],
        expense: 0,
        income: 0,
        ...overrides
    };
}

describe('getMouthEvents', () => {
    beforeEach(() => {
        mockHttp.get.mockClear();
    });

    it('calls GET /api/v1/calendar-day with month param', async () => {
        const days: CalendarDay[] = [makeDay()];
        mockHttp.get.mockResolvedValue({ data: { data: days } as ResponseAPI<CalendarDay[]> });

        const result = await getMouthEvents('2026-03');

        expect(mockHttp.get).toHaveBeenCalledWith('/api/v1/calendar-day', { params: { month: '2026-03' } });
        expect(result).toEqual(days);
    });

    it('returns empty array when response has no days', async () => {
        mockHttp.get.mockResolvedValue({ data: { data: [] } as ResponseAPI<CalendarDay[]> });

        const result = await getMouthEvents('2026-03');

        expect(result).toEqual([]);
    });

    it('passes through multiple days from response', async () => {
        const days: CalendarDay[] = [makeDay({ id: 'd1', income: 100 }), makeDay({ id: 'd2', expense: 200 })];
        mockHttp.get.mockResolvedValue({ data: { data: days } as ResponseAPI<CalendarDay[]> });

        const result = await getMouthEvents('2026-03');

        expect(result).toHaveLength(2);
        expect(result).toEqual(days);
    });
});

describe('createCalendarEvent', () => {
    beforeEach(() => {
        mockHttp.post.mockClear();
    });

    it('calls POST /api/v1/calendar-events with payload', async () => {
        const payload: Omit<CalendarEvent, 'id'> = { title: 'New Event', start: '2026-03-15', amount: 50, type: 'credit' };
        const created = makeEvent({ ...payload, id: '42' });
        mockHttp.post.mockResolvedValue({ data: { data: created } as ResponseAPI<CalendarEvent> });

        const result = await createCalendarEvent(payload);

        expect(mockHttp.post).toHaveBeenCalledWith('/api/v1/calendar-events', payload);
        expect(result).toEqual(created);
    });

    it('returns the created event with server-assigned id', async () => {
        const payload: Omit<CalendarEvent, 'id'> = { title: 'Salary', start: '2026-03-01', amount: 3000, type: 'credit' };
        const created = makeEvent({ ...payload, id: 'server-id-99' });
        mockHttp.post.mockResolvedValue({ data: { data: created } as ResponseAPI<CalendarEvent> });

        const result = await createCalendarEvent(payload);

        expect(result.id).toBe('server-id-99');
    });
});

describe('updateCalendarEvent', () => {
    beforeEach(() => {
        mockHttp.put.mockClear();
    });

    it('calls PUT /api/v1/calendar-events/:id with payload (string id)', async () => {
        const payload: Omit<CalendarEvent, 'id'> = { title: 'Updated', start: '2026-03-20', amount: 200, type: 'debit' };
        const updated = makeEvent({ ...payload, id: 'abc' });
        mockHttp.put.mockResolvedValue({ data: { data: updated } as ResponseAPI<CalendarEvent> });

        const result = await updateCalendarEvent('abc', payload);

        expect(mockHttp.put).toHaveBeenCalledWith('/api/v1/calendar-events/abc', payload);
        expect(result).toEqual(updated);
    });

    it('calls PUT /api/v1/calendar-events/:id with payload (numeric id)', async () => {
        const payload: Omit<CalendarEvent, 'id'> = { title: 'Updated', start: '2026-03-20', amount: 200, type: 'debit' };
        const updated = makeEvent({ ...payload, id: 5 });
        mockHttp.put.mockResolvedValue({ data: { data: updated } as ResponseAPI<CalendarEvent> });

        await updateCalendarEvent(5, payload);

        expect(mockHttp.put).toHaveBeenCalledWith('/api/v1/calendar-events/5', payload);
    });

    it('returns the updated event', async () => {
        const payload: Omit<CalendarEvent, 'id'> = { title: 'Rent', start: '2026-03-01', amount: 1200, type: 'debit' };
        const updated = makeEvent({ ...payload, id: '7' });
        mockHttp.put.mockResolvedValue({ data: { data: updated } as ResponseAPI<CalendarEvent> });

        const result = await updateCalendarEvent('7', payload);

        expect(result).toEqual(updated);
    });
});
