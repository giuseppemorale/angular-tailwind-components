import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindOptionGroup, TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-radio-group',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindRadioGroup),
      multi: true
    }
  ],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss'
})
export class TailwindRadioGroup<T = unknown> extends TailwindComponent implements ControlValueAccessor {
  /** Label for the radio group */
  readonly label = input<string>('');
  /** Aria label for accessibility */
  readonly ariaLabel = input<string>('');
  /** Name for the radio group (used for native radio grouping) */
  readonly name = input<string>();
  /** Available options */
  readonly options = input<TailwindOptionGroup<T>[]>([]);
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Layout orientation */
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  /** Currently selected value */
  readonly value = model<T | null>(null);

  /** Internal disabled state */
  readonly isDisabled = signal(false);

  /** Radio button outer ring size */
  readonly radioSizeClass = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'w-3.5 h-3.5',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-7 h-7'
    };
    return sizeMap[this.size()];
  });

  /** Inner dot size */
  readonly dotSizeClass = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-3.5 h-3.5'
    };
    return sizeMap[this.size()];
  });

  // CVA
  private onChange: (value: T) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onRadioChange(optionValue: T): void {
    this.value.set(optionValue);
    this.onChange(optionValue);
    this.onTouched();
  }
}
