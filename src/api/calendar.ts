// Example usage: src/api/users.api.ts
import type { CalendarDay, CalendarEvent, ResponseAPI } from '@/types/api.p';
import { http } from './http';

export async function getMouthEvents(month: string): Promise<CalendarDay[]> {
    const { data } = await http.get<ResponseAPI<CalendarDay[]>>(`/api/v1/calendar-day`, { params: { month: month } });
    return data.data;
}

export async function createCalendarEvent(payload: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const { data } = await http.post<ResponseAPI<CalendarEvent>>(`/api/v1/calendar-events`, payload);
    return data.data;
}

export async function updateCalendarEvent(id: string | number, payload: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const { data } = await http.put<ResponseAPI<CalendarEvent>>(`/api/v1/calendar-events/${id}`, payload);
    return data.data;
}
