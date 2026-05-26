import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  model,
  signal
} from '@angular/core';
import { formatDate } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TAILWIND_DATETIME_LANGUAGE } from '../../tokens/tokens';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindButton } from '../button/button.component';
import { TailwindCalendarPanel } from '../calendar-panel/calendar-panel.component';
import { CalendarView } from '../calendar-panel/calendar-view';
import { TailwindComponent } from '../tailwind.component';

type Lang = 'it' | 'en';

const I18N: Record<
  Lang,
  { months: string[]; weekDays: string[]; today: string; confirm: string; placeholder: string }
> = {
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
    today: 'Oggi',
    confirm: 'Applica',
    placeholder: 'Seleziona data'
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
    today: 'Today',
    confirm: 'Apply',
    placeholder: 'Select date'
  }
};

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
  private readonly lang: Lang = inject(TAILWIND_DATETIME_LANGUAGE, { optional: true }) ?? 'it';

  protected readonly i18n = I18N[this.lang];

  readonly label = input<string>('');
  readonly placeholder = input<string | undefined>(undefined);
  readonly format = input<string>('dd/MM/yyyy');

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

  readonly displayValue = computed(() => {
    const d = this.value();
    if (!d) return '';
    const fmt = this.format();
    try {
      return formatDate(d, fmt, this.lang === 'it' ? 'it-IT' : 'en-US');
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
    if (!this.showCalendar()) {
      this.draft.set(this.value());
      const ref = this.value() ?? new Date();
      this.viewMonth.set(ref.getMonth());
      this.viewYear.set(ref.getFullYear());
      this.calendarView.set('days');
    }
    this.showCalendar.update(v => !v);
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
