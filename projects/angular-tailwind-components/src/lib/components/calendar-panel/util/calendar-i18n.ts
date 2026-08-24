/**
 * Calendar month and weekday names.
 *
 * These used to be two hand-written tables (`it` and `en`), which capped the library at two
 * languages and hard-coded a Monday-first week. `Intl.DateTimeFormat` produces the same strings for
 * any locale the runtime knows, and `Intl.Locale.getWeekInfo` gives the locale's real first weekday
 * (Sunday in en-US, Monday in most of Europe, Saturday in much of the Middle East).
 */

/**
 * Any BCP 47 locale tag. `'it'` and `'en'` remain valid, so existing
 * `provideTailwindConfig({ DATETIME_LANGUAGE: 'it' })` keeps working.
 */
export type CalendarLang = string;

export type CalendarLabels = {
  /** Month names, January first. */
  months: string[];
  /** Weekday abbreviations, already rotated so index 0 is the locale's first day of the week. */
  weekDays: string[];
  /** Label of the "today" shortcut. */
  today: string;
  /**
   * Locale's first day of the week as a JavaScript day number (0 = Sunday … 6 = Saturday).
   * Grids must offset by this value instead of assuming Monday.
   */
  firstDayOfWeek: number;
};

/** "Today" has no `Intl` equivalent, so the few translations we ship stay in a table. */
const TODAY_BY_LANGUAGE: Record<string, string> = {
  it: 'Oggi',
  en: 'Today',
  fr: "Aujourd'hui",
  es: 'Hoy',
  de: 'Heute',
  pt: 'Hoje',
  nl: 'Vandaag'
};

/** Results are stable per locale and cheap to reuse; `Intl` construction is the expensive part. */
const CACHE = new Map<string, CalendarLabels>();

function primaryLanguage(locale: string): string {
  return locale.toLowerCase().split(/[-_]/)[0];
}

/**
 * Locales that start the week on Sunday, used only when `Intl.Locale.getWeekInfo` is unavailable
 * (it is still missing from several runtimes). Matched on region first, then language.
 */
const SUNDAY_FIRST = new Set(['US', 'CA', 'JP', 'IL', 'KR', 'TW', 'HK', 'MX', 'BR', 'ZA', 'PH', 'ja', 'he', 'ko']);

/** `Intl.Locale.getWeekInfo` when available, otherwise a best-effort lookup, otherwise ISO Monday. */
function firstDayOfWeekFor(locale: string): number {
  try {
    const parsed = new Intl.Locale(locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number } };
    const info = parsed.getWeekInfo?.();
    // `weekInfo.firstDay` is 1–7 with 7 = Sunday; JavaScript uses 0 = Sunday.
    if (info) return info.firstDay % 7;

    const region = parsed.region ?? locale.split(/[-_]/)[1]?.toUpperCase();
    if (region && SUNDAY_FIRST.has(region)) return 0;
    return SUNDAY_FIRST.has(primaryLanguage(locale)) ? 0 : 1;
  } catch {
    return 1;
  }
}

function buildLabels(locale: string): CalendarLabels {
  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'long' });
  const months = Array.from({ length: 12 }, (_, month) => {
    const label = monthFormat.format(new Date(Date.UTC(2021, month, 1)));
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  const firstDayOfWeek = firstDayOfWeekFor(locale);
  const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const weekDays = Array.from({ length: 7 }, (_, offset) => {
    // 2021-08-01 was a Sunday, so adding the day number lands on that weekday.
    const day = (firstDayOfWeek + offset) % 7;
    const label = weekdayFormat.format(new Date(Date.UTC(2021, 7, 1 + day)));
    const trimmed = label.replace(/\.$/, '').slice(0, 2);
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  });

  return {
    months,
    weekDays,
    today: TODAY_BY_LANGUAGE[primaryLanguage(locale)] ?? TODAY_BY_LANGUAGE['en'],
    firstDayOfWeek
  };
}

/** Month names, weekday abbreviations and first weekday for `locale`. */
export function calendarLabelsFor(locale: CalendarLang): CalendarLabels {
  const cached = CACHE.get(locale);
  if (cached) return cached;

  let labels: CalendarLabels;
  try {
    labels = buildLabels(locale);
  } catch {
    // An unknown tag should degrade to the default locale rather than break the calendar.
    labels = buildLabels('en');
  }
  CACHE.set(locale, labels);
  return labels;
}
