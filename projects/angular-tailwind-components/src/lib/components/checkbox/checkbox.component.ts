import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindCheckbox),
      multi: true
    }
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class TailwindCheckbox extends TailwindComponent implements ControlValueAccessor  {
  /** Label text */
  readonly label = input<string>('');
  /** Description text */
  readonly description = input<string>('');
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Unique ID */
  
  /** Two-way bound checked state */
  readonly checked = model<boolean>(false);

  /** Internal disabled state */
  readonly isDisabled = signal(false);

  /** Box size class based on size input */
  readonly boxSizeClass = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    };
    return sizeMap[this.size()];
  });

  // CVA
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onCheckboxChange(event: Event): void {
    const val = (event.target as HTMLInputElement).checked;
    this.checked.set(val);
    this.onChange(val);
    this.onTouched();
  }
}

