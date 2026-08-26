import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_TAILWIND_LABELS, resolveTailwindLabels } from '../../models';
import { TAILWIND_DATETIME_LANGUAGE, TAILWIND_LABELS } from '../../tokens';
import { TailwindDatePicker } from './date-picker.component';

describe('TailwindDatePicker', () => {
  let fixture: ComponentFixture<TailwindDatePicker>;
  let component: TailwindDatePicker;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindDatePicker]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindDatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function field(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  function panel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('tailwind-calendar-panel');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the calendar closed until the field is activated', () => {
    expect(panel()).toBeNull();

    field().click();
    fixture.detectChanges();
    expect(panel()).toBeTruthy();
  });

  it('should associate label and field', () => {
    fixture.componentRef.setInput('label', 'Due date');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.getAttribute('for')).toBe(field().id);
  });

  it('should show the localized placeholder by default', () => {
    expect(field().placeholder).toBe(DEFAULT_TAILWIND_LABELS.selectDate);
  });

  it('should prefer an explicit placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'gg/mm/aaaa');
    fixture.detectChanges();
    expect(field().placeholder).toBe('gg/mm/aaaa');
  });

  it('should take the placeholder from TAILWIND_LABELS', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindDatePicker],
      providers: [{ provide: TAILWIND_LABELS, useValue: resolveTailwindLabels({ selectDate: 'Seleziona data' }) }]
    }).compileComponents();

    const localized = TestBed.createComponent(TailwindDatePicker);
    localized.detectChanges();

    expect(localized.nativeElement.querySelector('input').placeholder).toBe('Seleziona data');
    localized.destroy();
  });

  it('should format the selected date with the given pattern', () => {
    component.writeValue(new Date(2024, 2, 5));
    fixture.detectChanges();

    expect(field().value).toBe('05/03/2024');
  });

  it('should honour a custom format', () => {
    fixture.componentRef.setInput('format', 'yyyy-MM-dd');
    component.writeValue(new Date(2024, 2, 5));
    fixture.detectChanges();

    expect(field().value).toBe('2024-03-05');
  });

  it('should implement CVA writeValue and setDisabledState', () => {
    const date = new Date(2024, 0, 1);
    component.writeValue(date);
    expect(component.value()?.getTime()).toBe(date.getTime());

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(field().disabled).toBe(true);
  });

  it('should localize month names from the datetime locale token', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindDatePicker],
      providers: [{ provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'fr' }]
    }).compileComponents();

    const french = TestBed.createComponent(TailwindDatePicker);
    french.detectChanges();

    french.nativeElement.querySelector('input').click();
    french.detectChanges();

    // Weekday abbreviations do not depend on today's date, unlike the month heading.
    // They now come from Intl, so any locale works — not just it/en.
    expect(french.nativeElement.textContent).toContain('Je');
    expect(french.nativeElement.textContent).toContain('Ve');
    french.destroy();
  });

  it('should start the week on the day the locale prescribes', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindDatePicker],
      providers: [{ provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'en-US' }]
    }).compileComponents();

    const american = TestBed.createComponent(TailwindDatePicker);
    american.detectChanges();
    american.nativeElement.querySelector('input').click();
    american.detectChanges();

    // US weeks start on Sunday; the grid used to hard-code Monday.
    const header = american.nativeElement.textContent as string;
    expect(header.indexOf('Su')).toBeLessThan(header.indexOf('Mo'));
    american.destroy();
  });
});
