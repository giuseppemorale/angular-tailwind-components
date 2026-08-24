import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_TAILWIND_LABELS, resolveTailwindLabels } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindTimePicker } from './time-picker.component';

describe('TailwindTimePicker', () => {
  let fixture: ComponentFixture<TailwindTimePicker>;
  let component: TailwindTimePicker;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindTimePicker]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindTimePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function field(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  function panelOpen(): boolean {
    return component.showPanel();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the panel closed until the field is activated', () => {
    expect(panelOpen()).toBe(false);

    field().click();
    fixture.detectChanges();
    expect(panelOpen()).toBe(true);
  });

  it('should associate label and field', () => {
    fixture.componentRef.setInput('label', 'Start time');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.getAttribute('for')).toBe(field().id);
  });

  it('should show the shared placeholder label', () => {
    expect(field().placeholder).toBe(DEFAULT_TAILWIND_LABELS.selectTime);
  });

  it('should take its strings from TAILWIND_LABELS', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindTimePicker],
      providers: [
        {
          provide: TAILWIND_LABELS,
          useValue: resolveTailwindLabels({ selectTime: 'Seleziona ora', now: 'Adesso', apply: 'Applica' })
        }
      ]
    }).compileComponents();

    const localized = TestBed.createComponent(TailwindTimePicker);
    localized.detectChanges();
    expect(localized.nativeElement.querySelector('input').placeholder).toBe('Seleziona ora');

    localized.nativeElement.querySelector('input').click();
    localized.detectChanges();
    expect(localized.nativeElement.textContent).toContain('Adesso');
    expect(localized.nativeElement.textContent).toContain('Applica');
    localized.destroy();
  });

  it('should show the bound value in the field', () => {
    component.writeValue('09:30');
    fixture.detectChanges();
    expect(field().value).toBe('09:30');
  });

  it('should implement CVA writeValue and setDisabledState', () => {
    component.writeValue('14:45');
    expect(component.value()).toBe('14:45');

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(field().disabled).toBe(true);
  });

  it('should not open the panel while disabled', () => {
    component.setDisabledState(true);
    fixture.detectChanges();

    field().click();
    fixture.detectChanges();
    expect(panelOpen()).toBe(false);
  });
});
