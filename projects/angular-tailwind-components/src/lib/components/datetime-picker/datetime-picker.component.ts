import { Component, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindDatePicker } from '../date-picker/date-picker.component';
import { TailwindTimePicker } from '../time-picker/time-picker.component';
import { TailwindDateTimeValue } from './interfaces/datetime-value.interface';
import { TailwindComponent } from '../tailwind.component';

export type { TailwindDateTimeValue };

@Component({
  selector: 'tailwind-datetime-picker',
  imports: [TailwindDatePicker, TailwindTimePicker],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TailwindDateTimePicker), multi: true }],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss'
})
export class TailwindDateTimePicker extends TailwindComponent implements ControlValueAccessor  {
  readonly label = input<string>('');
  readonly dateValue = signal('');
  readonly timeValue = signal('');
  readonly isDisabled = signal(false);
  private onChange: (v: TailwindDateTimeValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: TailwindDateTimeValue): void {
    if (v) {
      this.dateValue.set(v.date ?? '');
      this.timeValue.set(v.time ?? '');
    }
  }
  registerOnChange(fn: (v: TailwindDateTimeValue) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.isDisabled.set(d);
  }

  onDateChange(): void {
    this.emitChange();
  }
  onTimeChange(): void {
    this.emitChange();
  }

  private emitChange(): void {
    this.onChange({ date: this.dateValue(), time: this.timeValue() });
    this.onTouched();
  }
}
