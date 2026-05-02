import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-time-picker',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TailwindTimePicker), multi: true }],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TailwindTimePicker extends TailwindComponent implements ControlValueAccessor  {
  readonly label = input<string>('');
  readonly step = input<number>(60);
    readonly value = model<string>('');
  readonly isDisabled = signal(false);
  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.isDisabled.set(d);
  }

  onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }
}

