export type CalendarRangeBounds = {
  minTs?: number;
  maxTs?: number;
};

/** Normalizes values from forms, Storybook controls, or API (Date, ISO string, timestamp). */
export function coerceCalendarDate(value: unknown): Date | undefined {
  if (value == null || value === '') return undefined;
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  if (typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

export function startOfCalendarDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function resolveRangeBounds(minDate?: unknown, maxDate?: unknown): CalendarRangeBounds {
  let minTs: number | undefined;
  let maxTs: number | undefined;
  const min = coerceCalendarDate(minDate);
  const max = coerceCalendarDate(maxDate);
  if (min) minTs = startOfCalendarDay(min);
  if (max) maxTs = startOfCalendarDay(max);
  if (minTs != null && maxTs != null && minTs > maxTs) {
    return { minTs: maxTs, maxTs: minTs };
  }
  return { minTs, maxTs };
}

export function isCalendarDayInRange(
  year: number,
  month: number,
  day: number,
  bounds: CalendarRangeBounds
): boolean {
  const ts = new Date(year, month, day).getTime();
  if (bounds.minTs != null && ts < bounds.minTs) return false;
  if (bounds.maxTs != null && ts > bounds.maxTs) return false;
  return true;
}

export function isCalendarMonthInRange(year: number, month: number, bounds: CalendarRangeBounds): boolean {
  const monthStart = new Date(year, month, 1).getTime();
  const monthEnd = new Date(year, month + 1, 0).getTime();
  if (bounds.minTs != null && monthEnd < bounds.minTs) return false;
  if (bounds.maxTs != null && monthStart > bounds.maxTs) return false;
  return true;
}

export function isCalendarYearInRange(year: number, bounds: CalendarRangeBounds): boolean {
  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year, 11, 31).getTime();
  if (bounds.minTs != null && yearEnd < bounds.minTs) return false;
  if (bounds.maxTs != null && yearStart > bounds.maxTs) return false;
  return true;
}

export function isTodayInRange(bounds: CalendarRangeBounds): boolean {
  const t = new Date();
  return isCalendarDayInRange(t.getFullYear(), t.getMonth(), t.getDate(), bounds);
}
