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

export type ImportRecord = {
    id: string;
    title: string;
    start: Date | string;
    amount: number;
    type: 'credit' | 'debit';
};

export type CsvImport = {
    id: string;
    userId: string;
    errorsLines: number[];
    data: ImportRecord[];
    createdAt: Date | string;
    expiresAt: Date | string;
};

export type CsvColumnMapping = {
    name: string;
    type: string;
};

export type CsvUploadResponse = {
    id: string;
    columns: CsvColumnMapping[];
};

export type TemplateResponse = {
    id: string;
    userId: string;
    name: string;
    mapping: Record<string, string>;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export type TemplateMapping = {
    from: string;
    to: string;
};
