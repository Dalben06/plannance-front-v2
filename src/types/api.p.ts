export type CalendarEvent = {
    id: string | number;
    title: string;
    start: Date | string; // "YYYY-MM-DD" or ISO datetime or Date
    amount: number;
    type: 'debit' | 'credit';
};

export type CalendarDay = {
    date: Date | string;
    events: CalendarEvent[];
    expense: number;
    income: number;
    id: string;
};

export type WeekStartsOn = 0 | 1;

export type ResponseAPI<T> = {
    data: T;
};
