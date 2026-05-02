import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';

@Component({
  selector: 'tailwind-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindInput),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class TailwindInput implements ControlValueAccessor {
  /** Label text */
  readonly label = input<string>('');
  /** Placeholder text */
  readonly placeholder = input<string>('');
  /** Input type */
  readonly type = input<'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'>('text');
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Whether the input is required */
  readonly required = input<boolean>(false);
  /** Whether the input is readonly */
  readonly = input<boolean>(false);
  /** Helper text shown below input */
  readonly helperText = input<string>('');
  /** Error text shown when hasError is true */
  readonly errorText = input<string>('');
  /** Whether the input is in error state */
  readonly hasError = input<boolean>(false);
  /** Whether the input has a prefix icon slot */
  readonly prefixIcon = input<boolean>(false);
  /** Whether the input has a suffix icon slot */
  readonly suffixIcon = input<boolean>(false);
  /** Unique ID for the input */
  readonly inputId = input<string>(`tailwind-input-${nextId++}`);

  /** Two-way bound value */
  readonly value = model<string>('');

  /** Internal disabled state */
  isDisabled = signal(false);

  /** Computed input classes */
  readonly inputClasses = computed(() => {
    const base = [
      'block w-full bg-white',
      'border transition-colors duration-150',
      'placeholder:text-surface-400',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed',
    ];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-2.5 py-1.5 rounded-md',
      md: 'text-sm px-3 py-2 rounded-md',
      lg: 'text-base px-3.5 py-2.5 rounded-lg',
      xl: 'text-base px-4 py-3 rounded-lg',
    };

    const stateClass = this.hasError()
      ? 'border-danger-400 focus:ring-danger-500/30 text-danger-900'
      : 'border-surface-300 focus:ring-primary-500/30 focus:border-primary-500 text-surface-900';

    const paddingLeft = this.prefixIcon() ? 'pl-10' : '';
    const paddingRight = this.suffixIcon() ? 'pr-10' : '';

    return [...base, sizeMap[this.size()], stateClass, paddingLeft, paddingRight].join(' ');
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

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}

let nextId = 0;
