export type CalendarView = 'days' | 'months' | 'years';

export const YEARS_PER_PAGE = 12;

export function yearPageStartFor(year: number): number {
  return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
}
