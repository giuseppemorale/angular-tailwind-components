import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcOption, AtcSize } from '../../models';

@Component({
  selector: 'atc-radio-group',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtcRadioGroup),
      multi: true,
    },
  ],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
})
export class AtcRadioGroup implements ControlValueAccessor {
  /** Label for the radio group */
  label = input<string>('');
  /** Aria label for accessibility */
  ariaLabel = input<string>('');
  /** Name for the radio group (used for native radio grouping) */
  name = input<string>(`atc-radio-${nextRadioId++}`);
  /** Available options */
  options = input<AtcOption[]>([]);
  /** Size variant */
  size = input<AtcSize>('md');
  /** Layout orientation */
  orientation = input<'horizontal' | 'vertical'>('vertical');

  /** Currently selected value */
  value = model<string>('');

  /** Internal disabled state */
  isDisabled = signal(false);

  /** Radio button outer ring size */
  radioSizeClass = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7',
    };
    return sizeMap[this.size()];
  });

  /** Inner dot size */
  dotSizeClass = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5',
    };
    return sizeMap[this.size()];
  });

  // CVA
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onRadioChange(optionValue: string): void {
    this.value.set(optionValue);
    this.onChange(optionValue);
    this.onTouched();
  }
}

let nextRadioId = 0;
