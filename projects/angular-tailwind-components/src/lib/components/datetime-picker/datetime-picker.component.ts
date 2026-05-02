import { Component, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcDatePicker } from '../date-picker/date-picker.component';
import { AtcTimePicker } from '../time-picker/time-picker.component';

export interface AtcDateTimeValue {
  date: string;
  time: string;
}

@Component({
  selector: 'atc-datetime-picker',
  standalone: true,
  imports: [AtcDatePicker, AtcTimePicker],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AtcDateTimePicker), multi: true }],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss',
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
