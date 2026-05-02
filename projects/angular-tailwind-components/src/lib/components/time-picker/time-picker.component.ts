import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'atc-time-picker',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AtcTimePicker), multi: true }],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
})
export class AtcTimePicker implements ControlValueAccessor {
  label = input<string>('');
  step = input<number>(60);
  pickerId = input<string>(`atc-time-${nextTimeId++}`);
  value = model<string>('');
  isDisabled = signal(false);
  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string): void { this.value.set(v ?? ''); }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.isDisabled.set(d); }

  onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.value.set(val); this.onChange(val);
  }
}

let nextTimeId = 0;
