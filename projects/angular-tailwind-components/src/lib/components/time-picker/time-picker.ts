import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'atc-time-picker',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AtcTimePicker), multi: true }],
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label [for]="pickerId()" class="text-sm font-medium text-surface-700">{{ label() }}</label>
      }
      <div class="relative">
        <input [id]="pickerId()" type="time" [value]="value()" [disabled]="isDisabled()" [step]="step()"
          class="block w-full bg-white border border-surface-300 rounded-md px-3 py-2 text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:bg-surface-50 disabled:cursor-not-allowed"
          (input)="onInput($event)" (blur)="onTouched()" />
      </div>
    </div>
  `,
  styles: `:host { display: block; }`,
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
