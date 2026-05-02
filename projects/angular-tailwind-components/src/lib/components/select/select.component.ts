import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcOption, AtcSize } from '../../models';

@Component({
  selector: 'atc-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtcSelect),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class AtcSelect implements ControlValueAccessor {
  /** Label text */
  label = input<string>('');
  /** Placeholder text */
  placeholder = input<string>('');
  /** Available options */
  options = input<AtcOption[]>([]);
  /** Size variant */
  size = input<AtcSize>('md');
  /** Whether the select is required */
  required = input<boolean>(false);
  /** Helper text */
  helperText = input<string>('');
  /** Error text */
  errorText = input<string>('');
  /** Whether in error state */
  hasError = input<boolean>(false);
  /** Unique ID */
  selectId = input<string>(`atc-select-${nextSelectId++}`);

  /** Currently selected value */
  value = model<string>('');

  /** Internal disabled state */
  isDisabled = signal(false);

  /** Computed select classes */
  selectClasses = computed(() => {
    const base = [
      'block w-full appearance-none bg-white',
      'border transition-colors duration-150',
      'pr-10 cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed',
    ];

    const sizeMap: Record<AtcSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-2.5 py-1.5 rounded-md',
      md: 'text-sm px-3 py-2 rounded-md',
      lg: 'text-base px-3.5 py-2.5 rounded-lg',
      xl: 'text-base px-4 py-3 rounded-lg',
    };

    const stateClass = this.hasError()
      ? 'border-danger-400 focus:ring-danger-500/30 text-danger-900'
      : 'border-surface-300 focus:ring-primary-500/30 focus:border-primary-500 text-surface-900';

    return [...base, sizeMap[this.size()], stateClass].join(' ');
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

  onSelectChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
  }
}

let nextSelectId = 0;
