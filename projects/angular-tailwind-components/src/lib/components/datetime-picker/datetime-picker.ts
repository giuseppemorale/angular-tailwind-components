import { Component, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcDatePicker } from '../date-picker/date-picker';
import { AtcTimePicker } from '../time-picker/time-picker';

export interface AtcDateTimeValue {
  date: string;
  time: string;
}

@Component({
  selector: 'atc-datetime-picker',
  standalone: true,
  imports: [AtcDatePicker, AtcTimePicker],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AtcDateTimePicker), multi: true }],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label class="text-sm font-medium text-surface-700">{{ label() }}</label>
      }
      <div class="flex gap-3 items-start">
        <div class="flex-1">
          <atc-date-picker [label]="''" [(value)]="dateValue" (valueChange)="onDateChange()" />
        </div>
        <div class="w-32">
          <atc-time-picker [label]="''" [(value)]="timeValue" (valueChange)="onTimeChange()" />
        </div>
      </div>
    </div>
  `,
  styles: `:host { display: block; }`,
})
export class AtcDateTimePicker implements ControlValueAccessor {
  label = input<string>('');
  dateValue = signal('');
  timeValue = signal('');
  isDisabled = signal(false);
  private onChange: (v: AtcDateTimeValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: AtcDateTimeValue): void {
    if (v) { this.dateValue.set(v.date ?? ''); this.timeValue.set(v.time ?? ''); }
  }
  registerOnChange(fn: (v: AtcDateTimeValue) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  onDateChange(): void { this.emitChange(); }
  onTimeChange(): void { this.emitChange(); }

  private emitChange(): void {
    this.onChange({ date: this.dateValue(), time: this.timeValue() });
    this.onTouched();
  }
}
