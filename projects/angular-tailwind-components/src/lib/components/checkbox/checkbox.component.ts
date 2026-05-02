import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtcCheckbox),
      multi: true,
    },
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class AtcCheckbox implements ControlValueAccessor {
  /** Label text */
  label = input<string>('');
  /** Description text */
  description = input<string>('');
  /** Size variant */
  size = input<AtcSize>('md');
  /** Unique ID */
  checkboxId = input<string>(`atc-checkbox-${nextCheckboxId++}`);

  /** Two-way bound checked state */
  checked = model<boolean>(false);

  /** Internal disabled state */
  isDisabled = signal(false);

  /** Box size class based on size input */
  boxSizeClass = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
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

let nextCheckboxId = 0;
