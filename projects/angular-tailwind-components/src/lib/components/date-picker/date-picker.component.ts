import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  Injector,
  input,
  LOCALE_ID,
  model,
  signal,
  viewChild
} from '@angular/core';
import { formatDate } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TAILWIND_DATETIME_LANGUAGE, TAILWIND_LABELS } from '../../tokens/tokens';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindButton } from '../button/button.component';
import { isTodayInRange, resolveRangeBounds } from '../calendar-panel/util/calendar-date-range';
import { TailwindCalendarPanel } from '../calendar-panel/calendar-panel.component';
import { CalendarView } from '../calendar-panel/util/calendar-view';
import { calendarLabelsFor } from '../calendar-panel/util/calendar-i18n';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon, TailwindButton, TailwindCalendarPanel],
  selector: 'tailwind-date-picker',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TailwindDatePicker), multi: true }],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindDatePicker extends TailwindComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly calendarPanel = viewChild(TailwindCalendarPanel);
  private readonly locale = inject(TAILWIND_DATETIME_LANGUAGE, { optional: true }) ?? inject(LOCALE_ID);
  private readonly labels = inject(TAILWIND_LABELS);

  /** Month and weekday names for the active locale, plus its first day of the week. */
  protected readonly calendar = calendarLabelsFor(this.locale);
  protected readonly i18n = {
    months: this.calendar.months,
    weekDays: this.calendar.weekDays,
    today: this.labels.today,
    now: this.labels.now,
    apply: this.labels.apply,
    confirm: this.labels.apply,
    time: this.labels.time,
    placeholder: this.labels.selectDate
  };

  readonly label = input<string>('');
  readonly placeholder = input<string | undefined>(undefined);
  readonly format = input<string>('dd/MM/yyyy');
  readonly minDate = input<Date | null | undefined>(undefined);
  readonly maxDate = input<Date | null | undefined>(undefined);

  readonly value = model<Date | null>(null);
  /** Working selection while the panel is open; committed on Apply. */
  readonly draft = signal<Date | null>(null);

  readonly isDisabled = signal(false);
  readonly showCalendar = signal(false);
  readonly calendarView = signal<CalendarView>('days');
  readonly viewMonth = signal(new Date().getMonth());
  readonly viewYear = signal(new Date().getFullYear());

  readonly effectivePlaceholder = computed(() => {
    const p = this.placeholder();
    return p?.trim() ? p : this.i18n.placeholder;
  });

  readonly isTodaySelectable = computed(() => isTodayInRange(resolveRangeBounds(this.minDate(), this.maxDate())));

  readonly displayValue = computed(() => {
    const d = this.value();
    if (!d) return '';
    const fmt = this.format();
    try {
      return formatDate(d, fmt, this.locale);
    } catch {
      return formatDate(d, fmt, 'en-US');
    }
  });

  private onChange: (v: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: Date | null): void {
    this.value.set(v ?? null);
    if (v && !isNaN(v.getTime())) {
      this.viewMonth.set(v.getMonth());
      this.viewYear.set(v.getFullYear());
    }
  }

  registerOnChange(fn: (v: Date | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.isDisabled.set(d);
  }

  toggleCalendar(): void {
    if (this.isDisabled()) return;
    const opening = !this.showCalendar();
    if (opening) {
      this.draft.set(this.value());
      const ref = this.value() ?? new Date();
      this.viewMonth.set(ref.getMonth());
      this.viewYear.set(ref.getFullYear());
      this.calendarView.set('days');
    }
    this.showCalendar.set(opening);
    if (opening) {
      afterNextRender(() => this.calendarPanel()?.embedded.set(true), { injector: this.injector });
    }
  }

  apply(): void {
    const d = this.draft();
    this.value.set(d);
    this.onChange(d);
    this.onTouched();
    this.showCalendar.set(false);
  }

  selectDay(day: number): void {
    this.draft.set(new Date(this.viewYear(), this.viewMonth(), day));
  }

  goToToday(): void {
    if (!this.isTodaySelectable()) return;
    const t = new Date();
    this.viewMonth.set(t.getMonth());
    this.viewYear.set(t.getFullYear());
    this.selectDay(t.getDate());
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.showCalendar()) return;
    const t = event.target;
    if (t instanceof Node && this.host.nativeElement.contains(t)) return;
    this.showCalendar.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.showCalendar()) return;
    event.stopPropagation();
    this.showCalendar.set(false);
  }
}
