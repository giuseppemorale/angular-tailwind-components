import { formatDate } from '@angular/common';
import { Component, computed, ElementRef, forwardRef, HostListener, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TAILWIND_DATETIME_LANGUAGE } from '../../tokens/tokens';
import { TailwindComponent } from '../tailwind.component';

type Lang = 'it' | 'en';

const I18N: Record<Lang, { months: string[]; weekDays: string[]; time: string; today: string; confirm: string; placeholder: string }> = {
  it: {
    months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
    weekDays: ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do'],
    time: 'Ora',
    today: 'Oggi',
    confirm: 'Applica',
    placeholder: 'Seleziona data e ora'
  },
  en: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    time: 'Time',
    today: 'Today',
    confirm: 'Apply',
    placeholder: 'Select date and time'
  }
};

@Component({
  selector: 'tailwind-datetime-picker',
  imports: [],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TailwindDateTimePicker), multi: true }],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.css'
})
export class TailwindDateTimePicker extends TailwindComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly lang: Lang = inject(TAILWIND_DATETIME_LANGUAGE, { optional: true }) ?? 'it';

  protected readonly i18n = I18N[this.lang];
  protected readonly weekDays = this.i18n.weekDays;
  protected readonly hours = Array.from({ length: 24 }, (_, i) => i);
  protected readonly minutes = Array.from({ length: 60 }, (_, i) => i);

  readonly label = input<string>('');
  readonly placeholder = input<string | undefined>(undefined);
  /** Angular [DatePipe](https://angular.dev/api/common/DatePipe) format string. */
  readonly format = input<string>('dd/MM/yyyy HH:mm');

  readonly selected = signal<Date | null>(null);
  readonly draft = signal<Date | null>(null);
  readonly isDisabled = signal(false);
  readonly showPanel = signal(false);
  readonly viewMonth = signal(new Date().getMonth());
  readonly viewYear = signal(new Date().getFullYear());

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

  readonly monthYearLabel = computed(() =>
    `${this.i18n.months[this.viewMonth()]} ${this.viewYear()}`
  );

  readonly calendarDays = computed(() => {
    const y = this.viewYear(), m = this.viewMonth();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7; // Mon = 0
    const total = new Date(y, m + 1, 0).getDate();
    const days: number[] = Array(offset).fill(0);
    for (let i = 1; i <= total; i++) days.push(i);
    return days;
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

  registerOnChange(fn: (v: Date | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.isDisabled.set(disabled); }

  togglePanel(): void {
    if (this.isDisabled()) return;
    const opening = !this.showPanel();
    if (opening) {
      const s = this.selected();
      const ref = s ? new Date(s.getTime()) : this.todayNow();
      this.draft.set(ref);
      this.viewMonth.set(ref.getMonth());
      this.viewYear.set(ref.getFullYear());
    }
    this.showPanel.set(opening);
  }

  apply(): void {
    const d = this.draft();
    this.selected.set(d ? new Date(d.getTime()) : null);
    this.emitValue(this.selected());
    this.showPanel.set(false);
  }

  prevMonth(): void {
    if (this.viewMonth() === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); }
    else { this.viewMonth.update(m => m - 1); }
  }

  nextMonth(): void {
    if (this.viewMonth() === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); }
    else { this.viewMonth.update(m => m + 1); }
  }

  selectDay(day: number): void {
    const cur = this.draft();
    this.draft.set(new Date(this.viewYear(), this.viewMonth(), day, cur?.getHours() ?? 0, cur?.getMinutes() ?? 0, 0, 0));
  }

  isSelected(day: number): boolean {
    const v = this.draft();
    return !!v && v.getFullYear() === this.viewYear() && v.getMonth() === this.viewMonth() && v.getDate() === day;
  }

  isToday(day: number): boolean {
    const t = new Date();
    return t.getFullYear() === this.viewYear() && t.getMonth() === this.viewMonth() && t.getDate() === day;
  }

  goToToday(): void {
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
