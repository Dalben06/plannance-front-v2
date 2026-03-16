export function atNoon(d: Date | string) {
    const date = toISODate(d);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
}
export function makeDate(y: number, m: number, day: number) {
    return new Date(y, m, day, 12, 0, 0, 0);
}
export function addDays(d: Date | string, days: number) {
    const date = toISODate(d);
    const x = atNoon(date);
    x.setDate(x.getDate() + days);
    return x;
}
export function startOfMonth(d: Date | string) {
    const date = toISODate(d);
    return makeDate(date.getFullYear(), date.getMonth(), 1);
}
export function isSameDay(a: Date | string, b: Date | string) {
    const dateA = toISODate(a);
    const dateB = toISODate(b);
    return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
}
export function toKey(d: Date | string) {
    const date = toISODate(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
export function parseDate(input: Date | string) {
    if (input instanceof Date) return atNoon(input);
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (m) return makeDate(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return atNoon(new Date(input));
}
export function startOfWeek(d: Date | string, weekStartsOn: 0 | 1) {
    const date = toISODate(d);
    const x = atNoon(date);
    const dow = x.getDay();
    const diff = (dow - weekStartsOn + 7) % 7;
    return addDays(x, -diff);
}
export function buildMonthGrid(cursor: Date | string, weekStartsOn: 0 | 1) {
    const date = toISODate(cursor);
    const first = startOfMonth(date);
    const gridStart = startOfWeek(first, weekStartsOn);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function formatCurrency(amount: number, currency: string = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
}

export function toISODate(d: Date | string): Date {
    if (typeof d == 'string') d = new Date(d);

    return d;
}
