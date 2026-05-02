import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtcInput),
      multi: true,
    },
  ],
  template: `
    <div class="atc-input-wrapper flex flex-col gap-1.5">
      @if (label()) {
        <label
          [for]="inputId()"
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
        @if (prefixIcon()) {
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            <ng-content select="[atcPrefix]" />
          </span>
        }

        <input
          [id]="inputId()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [readonly]="readonly()"
          [attr.aria-invalid]="hasError() || null"
          [attr.aria-describedby]="helperText() || errorText() ? inputId() + '-helper' : null"
          [value]="value()"
          [class]="inputClasses()"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
        />

        @if (suffixIcon()) {
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            <ng-content select="[atcSuffix]" />
          </span>
        }
      </div>

      @if (helperText() && !hasError()) {
        <p [id]="inputId() + '-helper'" class="text-xs text-surface-500">
          {{ helperText() }}
        </p>
      }
      @if (errorText() && hasError()) {
        <p [id]="inputId() + '-helper'" class="text-xs text-danger-600">
          {{ errorText() }}
        </p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AtcInput implements ControlValueAccessor {
  /** Label text */
  label = input<string>('');
  /** Placeholder text */
  placeholder = input<string>('');
  /** Input type */
  type = input<'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'>('text');
  /** Size variant */
  size = input<AtcSize>('md');
  /** Whether the input is required */
  required = input<boolean>(false);
  /** Whether the input is readonly */
  readonly = input<boolean>(false);
  /** Helper text shown below input */
  helperText = input<string>('');
  /** Error text shown when hasError is true */
  errorText = input<string>('');
  /** Whether the input is in error state */
  hasError = input<boolean>(false);
  /** Whether the input has a prefix icon slot */
  prefixIcon = input<boolean>(false);
  /** Whether the input has a suffix icon slot */
  suffixIcon = input<boolean>(false);
  /** Unique ID for the input */
  inputId = input<string>(`atc-input-${nextId++}`);

  /** Two-way bound value */
  value = model<string>('');

  /** Internal disabled state */
  isDisabled = signal(false);

  /** Computed input classes */
  inputClasses = computed(() => {
    const base = [
      'block w-full bg-white',
      'border transition-colors duration-150',
      'placeholder:text-surface-400',
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
