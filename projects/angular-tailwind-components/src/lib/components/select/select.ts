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
  template: `
    <div class="flex flex-col gap-1.5">
      @if (label()) {
        <label
          [for]="selectId()"
          class="text-sm font-medium text-surface-700"
          [class.text-danger-600]="hasError()"
        >
          {{ label() }}
          @if (required()) {
            <span class="text-danger-500 ml-0.5">*</span>
          }
        </label>
      }

      <div class="relative">
        <select
          [id]="selectId()"
          [disabled]="isDisabled()"
          [attr.aria-invalid]="hasError() || null"
          [attr.aria-describedby]="helperText() || errorText() ? selectId() + '-helper' : null"
          [class]="selectClasses()"
          (change)="onSelectChange($event)"
        >
          @if (placeholder()) {
            <option value="" disabled [selected]="!value()">{{ placeholder() }}</option>
          }
          @for (option of options(); track option.value) {
            <option
              [value]="option.value"
              [disabled]="!!option.disabled"
              [selected]="value() === option.value"
            >
              {{ option.label }}
            </option>
          }
        </select>

        <!-- Chevron icon -->
        <svg
          class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      @if (helperText() && !hasError()) {
        <p [id]="selectId() + '-helper'" class="text-xs text-surface-500">{{ helperText() }}</p>
      }
      @if (errorText() && hasError()) {
        <p [id]="selectId() + '-helper'" class="text-xs text-danger-600">{{ errorText() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
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
