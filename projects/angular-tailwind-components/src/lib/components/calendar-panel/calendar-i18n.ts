export type CalendarLang = 'it' | 'en';

export type CalendarLabels = {
  months: string[];
  weekDays: string[];
  today: string;
};

const LABELS: Record<CalendarLang, CalendarLabels> = {
  it: {
    months: [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre'
    ],
    weekDays: ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'],
    today: 'Oggi'
  },
  en: {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    today: 'Today'
  }
};

export function calendarLabelsFor(lang: CalendarLang): CalendarLabels {
  return LABELS[lang];
}
