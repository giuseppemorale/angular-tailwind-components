import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TAILWIND_DATETIME_LANGUAGE } from '../../tokens/tokens';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';
import {
  coerceCalendarDateOrNull,
  isCalendarDayInRange,
  isCalendarMonthInRange,
  isCalendarYearInRange,
  isTodayInRange,
  resolveRangeBounds
} from './util/calendar-date-range';
import { calendarLabelsFor, CalendarLang } from './util/calendar-i18n';
import { CalendarView, yearPageStartFor, YEARS_PER_PAGE } from './util/calendar-view';

@Component({
  imports: [TailwindButton],
  selector: 'tailwind-calendar-panel',
  templateUrl: './calendar-panel.component.html',
  styleUrl: './calendar-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TailwindCalendarPanel), multi: true }]
})
export class TailwindCalendarPanel extends TailwindComponent implements ControlValueAccessor {
  private readonly lang: CalendarLang = inject(TAILWIND_DATETIME_LANGUAGE, { optional: true }) ?? 'it';

  protected readonly i18n = calendarLabelsFor(this.lang);

  readonly months = input<string[] | undefined>(undefined);
  readonly weekDays = input<string[] | undefined>(undefined);
  readonly highlightDate = input<Date | null>(null);
  readonly minDate = input<Date | null | undefined>(undefined);
  readonly maxDate = input<Date | null | undefined>(undefined);

  /**
   * When true, only emits `daySelect`; parent owns value and footer.
   * Set to `true` by date/datetime picker hosts via `ViewChild`.
   */
  readonly embedded = signal(false);

  readonly calendarView = model<CalendarView>('days');
  readonly viewMonth = model(new Date().getMonth());
  readonly viewYear = model(new Date().getFullYear());
  readonly value = model<Date | null>(null);

  readonly daySelect = output<number>();

  readonly isDisabled = signal(false);

  readonly effectiveMonths = computed(() => this.months() ?? this.i18n.months);
  readonly effectiveWeekDays = computed(() => this.weekDays() ?? this.i18n.weekDays);
  private readonly coercedValue = computed(() => coerceCalendarDateOrNull(this.value()));
  private readonly coercedHighlightDate = computed(() => coerceCalendarDateOrNull(this.highlightDate()));

  readonly effectiveHighlight = computed(() => (this.embedded() ? this.coercedHighlightDate() : this.coercedValue()));

  readonly rangeBounds = computed(() => resolveRangeBounds(this.minDate(), this.maxDate()));
  readonly isTodaySelectable = computed(() => isTodayInRange(this.rangeBounds()));

  private readonly yearPageStart = signal(yearPageStartFor(new Date().getFullYear()));

  private onChange: (v: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    super();
    /** Storybook date controls pass timestamps; keep the model as a real `Date`. */
    effect(() => {
      const raw = this.value();
      if (raw instanceof Date) return;
      const d = coerceCalendarDateOrNull(raw);
      if (d !== raw) this.value.set(d);
    });
    /** Keeps the visible month in sync when `value` is set from outside (e.g. Storybook controls). */
    effect(() => {
      if (this.embedded()) return;
      const d = this.coercedValue();
      if (!d) return;
      this.viewMonth.set(d.getMonth());
      this.viewYear.set(d.getFullYear());
      this.yearPageStart.set(yearPageStartFor(d.getFullYear()));
    });
  }

  readonly headerLabel = computed(() => {
    const view = this.calendarView();
    const y = this.viewYear();
    if (view === 'years') {
      const start = this.yearPageStart();
      return `${start} – ${start + YEARS_PER_PAGE - 1}`;
    }
    if (view === 'months') {
      return String(y);
    }
    return `${this.effectiveMonths()[this.viewMonth()]} ${y}`;
  });

  readonly headerClickable = computed(() => this.calendarView() !== 'years');
  readonly showNavChevrons = computed(() => this.calendarView() !== 'months');
  readonly shortMonths = computed(() => this.effectiveMonths().map(m => m.slice(0, 3)));

  readonly yearOptions = computed(() => {
    const start = this.yearPageStart();
    return Array.from({ length: YEARS_PER_PAGE }, (_, i) => start + i);
  });

  readonly calendarDays = computed(() => {
    const y = this.viewYear(),
      m = this.viewMonth();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    const total = new Date(y, m + 1, 0).getDate();
    const days: number[] = Array(offset).fill(0);
    for (let i = 1; i <= total; i++) days.push(i);
    return days;
  });

  writeValue(v: unknown): void {
    const d = coerceCalendarDateOrNull(v);
    this.value.set(d);
    const ref = d ?? new Date();
    this.viewMonth.set(ref.getMonth());
    this.viewYear.set(ref.getFullYear());
    this.yearPageStart.set(yearPageStartFor(ref.getFullYear()));
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onHeaderClick(): void {
    const view = this.calendarView();
    if (view === 'days' || view === 'months') {
      this.yearPageStart.set(yearPageStartFor(this.viewYear()));
      this.calendarView.set('years');
    }
  }

  prev(): void {
    if (this.isDisabled()) return;
    switch (this.calendarView()) {
      case 'days':
        this.shiftMonth(-1);
        break;
      case 'years':
        this.yearPageStart.update(s => s - YEARS_PER_PAGE);
        break;
    }
  }

  next(): void {
    if (this.isDisabled()) return;
    switch (this.calendarView()) {
      case 'days':
        this.shiftMonth(1);
        break;
      case 'years':
        this.yearPageStart.update(s => s + YEARS_PER_PAGE);
        break;
    }
  }

  selectYear(year: number): void {
    if (this.isDisabled() || this.isYearDisabled(year)) return;
    this.viewYear.set(year);
    this.calendarView.set('months');
  }

  selectMonth(month: number): void {
    if (this.isDisabled() || this.isMonthDisabled(month)) return;
    this.viewMonth.set(month);
    this.calendarView.set('days');
  }

  selectDay(day: number): void {
    if (this.isDisabled() || this.isDayDisabled(day)) return;
    if (this.embedded()) {
      this.daySelect.emit(day);
      return;
    }
    const d = new Date(this.viewYear(), this.viewMonth(), day);
    this.value.set(d);
    this.onChange(d);
    this.onTouched();
  }

  goToToday(): void {
    if (this.isDisabled() || !this.isTodaySelectable()) return;
    const t = new Date();
    this.viewMonth.set(t.getMonth());
    this.viewYear.set(t.getFullYear());
    this.selectDay(t.getDate());
  }

  resetView(): void {
    this.calendarView.set('days');
  }

  isSelectedDay(day: number): boolean {
    const d = this.effectiveHighlight();
    if (!d) return false;
    return d.getFullYear() === this.viewYear() && d.getMonth() === this.viewMonth() && d.getDate() === day;
  }

  isToday(day: number): boolean {
    const t = new Date();
    return t.getFullYear() === this.viewYear() && t.getMonth() === this.viewMonth() && t.getDate() === day;
  }

  isSelectedYear(year: number): boolean {
    return this.effectiveHighlight()?.getFullYear() === year;
  }

  isCurrentYear(year: number): boolean {
    return new Date().getFullYear() === year;
  }

  isSelectedMonth(month: number): boolean {
    const d = this.effectiveHighlight();
    return !!d && d.getFullYear() === this.viewYear() && d.getMonth() === month;
  }

  isCurrentMonth(month: number): boolean {
    const t = new Date();
    return t.getFullYear() === this.viewYear() && t.getMonth() === month;
  }

  isYearDisabled(year: number): boolean {
    return !isCalendarYearInRange(year, this.rangeBounds());
  }

  isMonthDisabled(month: number): boolean {
    return !isCalendarMonthInRange(this.viewYear(), month, this.rangeBounds());
  }

  isDayDisabled(day: number): boolean {
    return !isCalendarDayInRange(this.viewYear(), this.viewMonth(), day, this.rangeBounds());
  }

  private shiftMonth(delta: number): void {
    let m = this.viewMonth() + delta;
    let y = this.viewYear();
    if (m < 0) {
      m = 11;
      y--;
    } else if (m > 11) {
      m = 0;
      y++;
    }
    this.viewMonth.set(m);
    this.viewYear.set(y);
  }
}
