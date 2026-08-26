import { calendarLabelsFor } from './calendar-i18n';

describe('calendarLabelsFor', () => {
  it('should produce twelve capitalised month names', () => {
    const it = calendarLabelsFor('it');
    expect(it.months.length).toBe(12);
    expect(it.months[0]).toBe('Gennaio');
    expect(it.months[11]).toBe('Dicembre');
  });

  it('should localise months beyond the two languages the library used to ship', () => {
    expect(calendarLabelsFor('fr').months[0]).toBe('Janvier');
    expect(calendarLabelsFor('de').months[0]).toBe('Januar');
    expect(calendarLabelsFor('es').months[0]).toBe('Enero');
  });

  it('should return seven weekday abbreviations starting on the locale first day', () => {
    const it = calendarLabelsFor('it');
    expect(it.weekDays.length).toBe(7);
    // Italian weeks start on Monday.
    expect(it.firstDayOfWeek).toBe(1);
    expect(it.weekDays[0].toLowerCase().startsWith('l')).toBe(true);
  });

  it('should start the week on Sunday for en-US', () => {
    const enUS = calendarLabelsFor('en-US');
    expect(enUS.firstDayOfWeek).toBe(0);
    expect(enUS.weekDays[0].toLowerCase().startsWith('su')).toBe(true);
  });

  it('should translate the today shortcut for known languages', () => {
    expect(calendarLabelsFor('it').today).toBe('Oggi');
    expect(calendarLabelsFor('en').today).toBe('Today');
    expect(calendarLabelsFor('fr').today).toBe("Aujourd'hui");
  });

  it('should fall back instead of throwing on an unusable locale tag', () => {
    const labels = calendarLabelsFor('not a locale');
    expect(labels.months.length).toBe(12);
    expect(labels.weekDays.length).toBe(7);
  });

  it('should return the same object for repeated lookups', () => {
    expect(calendarLabelsFor('pt')).toBe(calendarLabelsFor('pt'));
  });
});
