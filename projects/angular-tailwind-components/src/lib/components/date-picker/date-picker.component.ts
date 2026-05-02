import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'atc-date-picker',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AtcDatePicker), multi: true }],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class AtcDatePicker implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('Select date');
  format = input<string>('yyyy-MM-dd');
  pickerId = input<string>(`atc-date-${nextDateId++}`);

  value = model<string>('');
  isDisabled = signal(false);
  showCalendar = signal(false);
  viewMonth = signal(new Date().getMonth());
  viewYear = signal(new Date().getFullYear());

  readonly weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  displayValue = computed(() => this.value() || '');

  monthYearLabel = computed(() => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[this.viewMonth()]} ${this.viewYear()}`;
  });

  calendarDays = computed(() => {
    const y = this.viewYear(), m = this.viewMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days: number[] = Array(offset).fill(0);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  });

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void { this.value.set(v ?? ''); if (v) { const d = new Date(v); this.viewMonth.set(d.getMonth()); this.viewYear.set(d.getFullYear()); } }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  toggleCalendar(): void { if (!this.isDisabled()) this.showCalendar.update(v => !v); }
  prevMonth(): void { if (this.viewMonth() === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); } else { this.viewMonth.update(m => m - 1); } }
  nextMonth(): void { if (this.viewMonth() === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); } else { this.viewMonth.update(m => m + 1); } }

  selectDay(day: number): void {
    const y = this.viewYear(), m = this.viewMonth();
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    this.value.set(dateStr);
    this.onChange(dateStr);
    this.onTouched();
    this.showCalendar.set(false);
  }

  isSelected(day: number): boolean {
    const v = this.value();
    if (!v) return false;
    const d = new Date(v);
    return d.getFullYear() === this.viewYear() && d.getMonth() === this.viewMonth() && d.getDate() === day;
  }

  isToday(day: number): boolean {
    const t = new Date();
    return t.getFullYear() === this.viewYear() && t.getMonth() === this.viewMonth() && t.getDate() === day;
  }

  goToToday(): void {
    const t = new Date();
    this.viewMonth.set(t.getMonth());
    this.viewYear.set(t.getFullYear());
    this.selectDay(t.getDate());
  }
}

let nextDateId = 0;
