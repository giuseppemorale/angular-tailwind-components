import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'atc-date-picker',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AtcDatePicker), multi: true }],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label [for]="pickerId()" class="text-sm font-medium text-surface-700">{{ label() }}</label>
      }
      <div class="relative">
        <input [id]="pickerId()" type="text" readonly [value]="displayValue()" [placeholder]="placeholder()"
          class="block w-full bg-white border border-surface-300 rounded-md px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 cursor-pointer disabled:bg-surface-50 disabled:cursor-not-allowed pr-10"
          [disabled]="isDisabled()" (click)="toggleCalendar()" />
        <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
        </svg>
      </div>

      @if (showCalendar()) {
        <div class="absolute z-[1060] mt-1 bg-white rounded-xl border border-surface-200 shadow-xl p-4 w-72">
          <!-- Month/Year nav -->
          <div class="flex items-center justify-between mb-3">
            <button type="button" (click)="prevMonth()" class="p-1 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer">
              <svg class="w-4 h-4 text-surface-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
            </button>
            <span class="text-sm font-semibold text-surface-800">{{ monthYearLabel() }}</span>
            <button type="button" (click)="nextMonth()" class="p-1 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer">
              <svg class="w-4 h-4 text-surface-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
            </button>
          </div>
          <!-- Weekdays -->
          <div class="grid grid-cols-7 gap-0 mb-1">
            @for (day of weekDays; track day) {
              <div class="text-center text-xs font-medium text-surface-400 py-1">{{ day }}</div>
            }
          </div>
          <!-- Days -->
          <div class="grid grid-cols-7 gap-0">
            @for (day of calendarDays(); track $index) {
              @if (day === 0) {
                <div></div>
              } @else {
                <button type="button" (click)="selectDay(day)"
                  class="h-8 w-8 mx-auto rounded-lg text-sm transition-colors cursor-pointer hover:bg-surface-100"
                  [class.bg-primary-600]="isSelected(day)" [class.text-white]="isSelected(day)" [class.hover:bg-primary-700]="isSelected(day)"
                  [class.text-surface-700]="!isSelected(day) && !isToday(day)"
                  [class.font-semibold]="isToday(day)" [class.text-primary-600]="isToday(day) && !isSelected(day)">
                  {{ day }}
                </button>
              }
            }
          </div>
          <!-- Today button -->
          <div class="mt-2 pt-2 border-t border-surface-100">
            <button type="button" (click)="goToToday()" class="text-xs text-primary-600 font-medium hover:underline cursor-pointer">Today</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `:host { display: block; position: relative; }`,
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
