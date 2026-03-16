export type CalendarEvent = {
    id: string | number;
    title: string;
    start: Date | string; // "YYYY-MM-DD" or ISO datetime or Date
    end?: Date | string;
    amount: number;
    type: 'debit' | 'credit';
    color?: string;
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
