import {
  coerceCalendarDate,
  coerceCalendarDateOrNull,
  isCalendarDayInRange,
  isCalendarMonthInRange,
  isCalendarYearInRange,
  resolveRangeBounds
} from './calendar-date-range';

describe('calendar-date-range', () => {
  const bounds = resolveRangeBounds(new Date(2026, 0, 10), new Date(2026, 0, 20));

  it('coerceCalendarDate accepts ISO strings', () => {
    const d = coerceCalendarDate('2026-01-15T00:00:00.000Z');
    expect(d?.getFullYear()).toBe(2026);
  });

  it('coerceCalendarDateOrNull accepts timestamps', () => {
    const ts = new Date(2026, 4, 15).getTime();
    expect(coerceCalendarDateOrNull(ts)).toEqual(new Date(2026, 4, 15));
    expect(coerceCalendarDateOrNull(null)).toBeNull();
  });

  it('resolveRangeBounds swaps inverted min/max', () => {
    const swapped = resolveRangeBounds(new Date(2026, 0, 20), new Date(2026, 0, 10));
    expect(swapped).toEqual(bounds);
  });

  it('disables days outside range', () => {
    expect(isCalendarDayInRange(2026, 0, 9, bounds)).toBe(false);
    expect(isCalendarDayInRange(2026, 0, 10, bounds)).toBe(true);
    expect(isCalendarDayInRange(2026, 0, 21, bounds)).toBe(false);
  });

  it('disables months with no selectable days', () => {
    expect(isCalendarMonthInRange(2025, 11, bounds)).toBe(false);
    expect(isCalendarMonthInRange(2026, 0, bounds)).toBe(true);
    expect(isCalendarMonthInRange(2026, 1, bounds)).toBe(false);
  });

  it('disables years with no selectable days', () => {
    expect(isCalendarYearInRange(2025, bounds)).toBe(false);
    expect(isCalendarYearInRange(2026, bounds)).toBe(true);
    expect(isCalendarYearInRange(2027, bounds)).toBe(false);
  });
});
