import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_TAILWIND_LABELS } from '../../models';
import { TAILWIND_DATETIME_LANGUAGE } from '../../tokens';
import { TailwindDateTimePicker } from './datetime-picker.component';

describe('TailwindDateTimePicker', () => {
  let fixture: ComponentFixture<TailwindDateTimePicker>;
  let component: TailwindDateTimePicker;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindDateTimePicker]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindDateTimePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function field(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the panel closed until the field is activated', () => {
    expect(component.showPanel()).toBe(false);

    field().click();
    fixture.detectChanges();
    expect(component.showPanel()).toBe(true);
  });

  it('should show the shared placeholder label', () => {
    expect(field().placeholder).toBe(DEFAULT_TAILWIND_LABELS.selectDateTime);
  });

  it('should format date and time together', () => {
    component.writeValue(new Date(2024, 4, 9, 14, 5));
    fixture.detectChanges();

    expect(field().value).toBe('09/05/2024 14:05');
  });

  it('should honour a custom format', () => {
    fixture.componentRef.setInput('format', 'yyyy-MM-dd HH:mm');
    component.writeValue(new Date(2024, 4, 9, 14, 5));
    fixture.detectChanges();

    expect(field().value).toBe('2024-05-09 14:05');
  });

  it('should copy the written date rather than hold the caller instance', () => {
    const original = new Date(2024, 0, 1, 8, 0);
    component.writeValue(original);

    original.setFullYear(1999);
    // Mutating the caller's object must not rewrite the control's value.
    expect(component.selected()?.getFullYear()).toBe(2024);
  });

  it('should implement CVA setDisabledState', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(field().disabled).toBe(true);

    field().click();
    fixture.detectChanges();
    expect(component.showPanel()).toBe(false);
  });

  it('should localize the calendar from the datetime locale token', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindDateTimePicker],
      providers: [{ provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'de' }]
    }).compileComponents();

    const german = TestBed.createComponent(TailwindDateTimePicker);
    german.detectChanges();
    german.nativeElement.querySelector('input').click();
    german.detectChanges();

    // German weekday abbreviations, produced by Intl rather than a hand-written table.
    expect(german.nativeElement.textContent).toContain('Mi');
    german.destroy();
  });
});
