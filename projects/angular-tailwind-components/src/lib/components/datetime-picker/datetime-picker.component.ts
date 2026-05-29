import { formatDate } from '@angular/common';
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
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TAILWIND_DATETIME_LANGUAGE } from '../../tokens/tokens';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindButton } from '../button/button.component';
import { isTodayInRange, resolveRangeBounds } from '../calendar-panel/util/calendar-date-range';
import { TailwindCalendarPanel } from '../calendar-panel/calendar-panel.component';
import { CalendarView } from '../calendar-panel/util/calendar-view';
import { TailwindComponent } from '../tailwind.component';

type Lang = 'it' | 'en';

const I18N: Record<
  Lang,
  { months: string[]; weekDays: string[]; time: string; today: string; confirm: string; placeholder: string }
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
    time: 'Ora',
    today: 'Oggi',
    confirm: 'Applica',
    placeholder: 'Seleziona data e ora'
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
    time: 'Time',
    today: 'Today',
    confirm: 'Apply',
    placeholder: 'Select date and time'
  }
};

@Component({
  selector: 'tailwind-datetime-picker',
  imports: [TailwindIcon, TailwindButton, TailwindCalendarPanel],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TailwindDateTimePicker), multi: true }],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindDateTimePicker extends TailwindComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly calendarPanel = viewChild(TailwindCalendarPanel);
  private readonly lang: Lang = inject(TAILWIND_DATETIME_LANGUAGE, { optional: true }) ?? 'it';

  protected readonly i18n = I18N[this.lang];
  protected readonly hours = Array.from({ length: 24 }, (_, i) => i);
  protected readonly minutes = Array.from({ length: 60 }, (_, i) => i);

  readonly label = input<string>('');
  readonly placeholder = input<string | undefined>(undefined);
  /** Angular [DatePipe](https://angular.dev/api/common/DatePipe) format string. */
  readonly format = input<string>('dd/MM/yyyy HH:mm');
  readonly minDate = input<Date | null | undefined>(undefined);
  readonly maxDate = input<Date | null | undefined>(undefined);

  readonly selected = signal<Date | null>(null);
  readonly draft = signal<Date | null>(null);
  readonly isDisabled = signal(false);
  readonly showPanel = signal(false);
  readonly calendarView = signal<CalendarView>('days');
  readonly viewMonth = signal(new Date().getMonth());
  readonly viewYear = signal(new Date().getFullYear());

  readonly isTodaySelectable = computed(() =>
    isTodayInRange(resolveRangeBounds(this.minDate(), this.maxDate()))
  );

  readonly effectivePlaceholder = computed(() => {
    const p = this.placeholder();
    return p?.trim() ? p : this.i18n.placeholder;
  });

  readonly displayValue = computed(() => {
    const d = this.selected();
    if (!d) return '';
    // formatDate richiede registerLocaleData per locale non-EN: leggiamo format fuori dal try
    // per non richiamare signal dentro il catch (contesto reattivo non garantito dopo un throw).
    // Per i formati numerici (default dd/MM/yyyy HH:mm) il risultato è identico in ogni locale.
    const fmt = this.format();
    try {
      return formatDate(d, fmt, this.lang === 'it' ? 'it-IT' : 'en-US');
    } catch {
      return formatDate(d, fmt, 'en-US');
    }
  });

  private onChange: (v: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: Date | null | undefined): void {
    const d = v ? new Date(v.getTime()) : null;
    this.selected.set(d);
    if (this.showPanel()) this.draft.set(d ? new Date(d.getTime()) : null);
    const ref = d ?? new Date();
    this.viewMonth.set(ref.getMonth());
    this.viewYear.set(ref.getFullYear());
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

  togglePanel(): void {
    if (this.isDisabled()) return;
    const opening = !this.showPanel();
    if (opening) {
      const s = this.selected();
      const ref = s ? new Date(s.getTime()) : this.todayNow();
      this.draft.set(ref);
      this.viewMonth.set(ref.getMonth());
      this.viewYear.set(ref.getFullYear());
      this.calendarView.set('days');
    }
    this.showPanel.set(opening);
    if (opening) {
      afterNextRender(() => this.calendarPanel()?.embedded.set(true), { injector: this.injector });
    }
  }

  apply(): void {
    const d = this.draft();
    this.selected.set(d ? new Date(d.getTime()) : null);
    this.emitValue(this.selected());
    this.showPanel.set(false);
  }

  selectDay(day: number): void {
    const cur = this.draft();
    this.draft.set(
      new Date(this.viewYear(), this.viewMonth(), day, cur?.getHours() ?? 0, cur?.getMinutes() ?? 0, 0, 0)
    );
  }

  goToToday(): void {
    if (!this.isTodaySelectable()) return;
    const t = this.todayNow();
    this.viewMonth.set(t.getMonth());
    this.viewYear.set(t.getFullYear());
    this.draft.set(t);
  }

  onHourChange(e: Event): void {
    const cur = this.draft();
    if (!cur) return;
    const h = Number((e.target as HTMLSelectElement).value);
    this.draft.set(new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), h, cur.getMinutes(), 0, 0));
  }

  onMinuteChange(e: Event): void {
    const cur = this.draft();
    if (!cur) return;
    const min = Number((e.target as HTMLSelectElement).value);
    this.draft.set(new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), cur.getHours(), min, 0, 0));
  }

  private todayNow(): Date {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), 0, 0);
  }

  private emitValue(d: Date | null): void {
    this.onChange(d ? new Date(d.getTime()) : null);
    this.onTouched();
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.showPanel()) return;
    const t = event.target;
    if (t instanceof Node && this.host.nativeElement.contains(t)) return;
    this.showPanel.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.showPanel()) return;
    event.stopPropagation();
    this.showPanel.set(false);
  }
}
