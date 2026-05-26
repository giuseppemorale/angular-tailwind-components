import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindCalendarPanel } from './calendar-panel.component';

describe('TailwindCalendarPanel', () => {
  let fixture: ComponentFixture<TailwindCalendarPanel>;
  let component: TailwindCalendarPanel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindCalendarPanel]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindCalendarPanel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('viewMonth', 4);
    fixture.componentRef.setInput('viewYear', 2026);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens year view when header is clicked in day view', () => {
    const header = fixture.nativeElement.querySelector('button.text-sm.font-semibold') as HTMLButtonElement;
    header.click();
    fixture.detectChanges();
    expect(component.calendarView()).toBe('years');
    expect(fixture.nativeElement.textContent).toContain('2016');
    expect(fixture.nativeElement.textContent).toContain('2027');
  });

  it('navigates year → month → day selection in standalone mode', () => {
    component.calendarView.set('years');
    fixture.detectChanges();

    const yearBtn = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.trim() === '2020'
    ) as HTMLButtonElement;
    yearBtn.click();
    fixture.detectChanges();
    expect(component.calendarView()).toBe('months');
    expect(component.viewYear()).toBe(2020);

    const monthBtn = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.trim() === 'Gen'
    ) as HTMLButtonElement;
    monthBtn.click();
    fixture.detectChanges();
    expect(component.calendarView()).toBe('days');
    expect(component.viewMonth()).toBe(0);

    const onChange = vi.fn();
    component.registerOnChange(onChange);
    const day1 = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.trim() === '1' && b.classList.contains('h-8')
    ) as HTMLButtonElement;
    day1.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2020, 0, 1));
  });

  it('emits daySelect only in embedded mode', () => {
    component.embedded.set(true);
    fixture.detectChanges();

    const daySpy = vi.fn();
    const onChange = vi.fn();
    component.daySelect.subscribe(daySpy);
    component.registerOnChange(onChange);

    const day1 = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.trim() === '1' && b.classList.contains('h-8')
    ) as HTMLButtonElement;
    day1.click();
    expect(daySpy).toHaveBeenCalledWith(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('writeValue syncs view and value', () => {
    component.writeValue(new Date(1995, 6, 20));
    expect(component.value()).toEqual(new Date(1995, 6, 20));
    expect(component.viewMonth()).toBe(6);
    expect(component.viewYear()).toBe(1995);
  });

  it('disables days outside min/max range', () => {
    fixture.componentRef.setInput('minDate', new Date(2026, 4, 10));
    fixture.componentRef.setInput('maxDate', new Date(2026, 4, 20));
    fixture.detectChanges();

    expect(component.isDayDisabled(9)).toBe(true);
    expect(component.isDayDisabled(10)).toBe(false);
    expect(component.isDayDisabled(21)).toBe(true);
  });
});
