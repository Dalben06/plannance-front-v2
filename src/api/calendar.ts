// Example usage: src/api/users.api.ts
import type { CalendarDay, ResponseAPI } from '@/types/types.p';
import { http } from './http';


export async function getMouthEvents(month: string): Promise<CalendarDay[]> {
  const { data } = await http.get<ResponseAPI<CalendarDay[]>>(`/api/v1/calendar-day`, { params: { month: month }});
  return data.data;
}
