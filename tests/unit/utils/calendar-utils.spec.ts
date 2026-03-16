import { describe, expect, it } from 'vitest';
import { addDays, atNoon, buildMonthGrid, formatCurrency, isSameDay, makeDate, parseDate, startOfMonth, startOfWeek, toISODate, toKey } from '@/utils/calendar-utils';

describe('atNoon', () => {
    it('sets time to 12:00:00', () => {
        const d = new Date(2026, 2, 15, 8, 30, 0);
        const result = atNoon(d);
        expect(result.getHours()).toBe(12);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
    });

    it('accepts string input', () => {
        // Bare date strings parse as UTC midnight; we only verify the time is set to noon
        const result = atNoon('2026-03-15T06:00:00'); // local time unambiguous
        expect(result.getHours()).toBe(12);
    });

    it('preserves date part', () => {
        const d = new Date(2026, 2, 15, 23, 59, 59);
        const result = atNoon(d);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(2);
        expect(result.getDate()).toBe(15);
    });
});

describe('makeDate', () => {
    it('creates a Date at noon for given y/m/day', () => {
        const result = makeDate(2026, 2, 15);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(2);
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(12);
    });
});

describe('addDays', () => {
    it.each([
        [5, 15, 20],
        [-5, 15, 10],
        [0, 15, 15]
    ])('delta %i from day %i yields day %i', (delta, startDay, expectedDay) => {
        const d = new Date(2026, 2, startDay, 12, 0, 0);
        const result = addDays(d, delta);
        expect(result.getDate()).toBe(expectedDay);
    });

    it('crosses month boundary', () => {
        const d = new Date(2026, 2, 30, 12, 0, 0);
        const result = addDays(d, 5);
        expect(result.getMonth()).toBe(3);
        expect(result.getDate()).toBe(4);
    });
});

describe('startOfMonth', () => {
    it('returns 1st of month regardless of day', () => {
        const d = new Date(2026, 2, 15);
        const result = startOfMonth(d);
        expect(result.getDate()).toBe(1);
        expect(result.getMonth()).toBe(2);
        expect(result.getFullYear()).toBe(2026);
    });

    it('works with last day of month', () => {
        const d = new Date(2026, 2, 31);
        expect(startOfMonth(d).getDate()).toBe(1);
    });
});

describe('isSameDay', () => {
    it.each([
        [new Date(2026, 2, 15, 8, 0), new Date(2026, 2, 15, 23, 59), true],
        [new Date(2026, 2, 15), new Date(2026, 2, 16), false],
        // Use datetime string to avoid UTC midnight timezone issue
        ['2026-03-15T12:00:00', new Date(2026, 2, 15, 10, 0), true],
        [new Date(2026, 2, 15), new Date(2025, 2, 15), false]
    ])('isSameDay(%s, %s) === %s', (a, b, expected) => {
        expect(isSameDay(a, b)).toBe(expected);
    });
});

describe('toKey', () => {
    it.each([
        [new Date(2026, 2, 15), '2026-03-15'],
        [new Date(2026, 0, 5), '2026-01-05'],
        [new Date(2026, 11, 31), '2026-12-31']
    ])('toKey(%s) === %s', (d, expected) => {
        expect(toKey(d)).toBe(expected);
    });

    it('pads single-digit month and day', () => {
        expect(toKey(new Date(2026, 0, 1))).toBe('2026-01-01');
    });
});

describe('parseDate', () => {
    it('converts string "YYYY-MM-DD" to Date at noon', () => {
        const result = parseDate('2026-03-15');
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(2);
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(12);
    });

    it('returns Date at noon when given a Date', () => {
        const d = new Date(2026, 2, 15, 8, 0, 0);
        const result = parseDate(d);
        expect(result.getHours()).toBe(12);
        expect(result.getDate()).toBe(15);
    });
});

describe('startOfWeek', () => {
    it('weekStartsOn=0 returns Sunday', () => {
        // March 15, 2026 is a Sunday
        const d = new Date(2026, 2, 18, 12, 0, 0); // Wednesday
        const result = startOfWeek(d, 0);
        expect(result.getDay()).toBe(0); // Sunday
    });

    it('weekStartsOn=1 returns Monday', () => {
        const d = new Date(2026, 2, 18, 12, 0, 0); // Wednesday
        const result = startOfWeek(d, 1);
        expect(result.getDay()).toBe(1); // Monday
    });

    it('when day is already the start day, returns the same day', () => {
        const sunday = new Date(2026, 2, 15, 12, 0, 0); // Sunday
        const result = startOfWeek(sunday, 0);
        expect(result.getDate()).toBe(15);
    });
});

describe('buildMonthGrid', () => {
    it('returns exactly 42 dates', () => {
        const cursor = new Date(2026, 2, 1);
        const grid = buildMonthGrid(cursor, 0);
        expect(grid).toHaveLength(42);
    });

    it('weekStartsOn=0: first cell is Sunday', () => {
        const cursor = new Date(2026, 2, 1);
        const grid = buildMonthGrid(cursor, 0);
        expect(grid[0].getDay()).toBe(0);
    });

    it('weekStartsOn=1: first cell is Monday', () => {
        const cursor = new Date(2026, 2, 1);
        const grid = buildMonthGrid(cursor, 1);
        expect(grid[0].getDay()).toBe(1);
    });

    it('contains all days in target month', () => {
        const cursor = new Date(2026, 2, 1); // March 2026
        const grid = buildMonthGrid(cursor, 0);
        const marchDays = grid.filter((d) => d.getMonth() === 2 && d.getFullYear() === 2026);
        expect(marchDays).toHaveLength(31);
    });
});

describe('formatCurrency', () => {
    it('formats in USD by default', () => {
        expect(formatCurrency(1234.5)).toBe('$1,234.50');
    });

    it('formats in EUR when specified', () => {
        const result = formatCurrency(1234.5, 'EUR');
        expect(result).toContain('1,234.50');
        expect(result).toContain('€');
    });

    it('handles zero amount', () => {
        expect(formatCurrency(0)).toBe('$0.00');
    });
});

describe('toISODate', () => {
    it('converts string to Date', () => {
        const result = toISODate('2026-03-15T00:00:00');
        expect(result).toBeInstanceOf(Date);
    });

    it('returns Date unchanged', () => {
        const d = new Date(2026, 2, 15);
        const result = toISODate(d);
        expect(result).toBe(d);
    });
});
