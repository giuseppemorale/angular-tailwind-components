import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcOption, AtcSize } from '../../models';

@Component({
  selector: 'atc-radio-group',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtcRadioGroup),
      multi: true,
    },
  ],
  template: `
    <fieldset
      class="flex gap-3"
      [class.flex-col]="orientation() === 'vertical'"
      [attr.aria-label]="ariaLabel()"
      role="radiogroup"
    >
      @if (label()) {
        <legend class="text-sm font-medium text-surface-700 mb-2">{{ label() }}</legend>
      }

      @for (option of options(); track option.value) {
        <label
          class="inline-flex items-start gap-2.5 cursor-pointer select-none"
          [class.cursor-not-allowed]="isDisabled() || option.disabled"
          [class.opacity-50]="isDisabled() || option.disabled"
        >
          <div class="relative flex items-center justify-center shrink-0" [class]="radioSizeClass()">
            <input
              type="radio"
              class="peer sr-only"
              [name]="name()"
              [value]="option.value"
              [checked]="value() === option.value"
              [disabled]="isDisabled() || !!option.disabled"
              (change)="onRadioChange(option.value)"
            />
            <div
              class="w-full h-full rounded-full border-2 transition-all duration-150
                     peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/30 peer-focus-visible:ring-offset-1
                     flex items-center justify-center"
              [class.border-surface-300]="value() !== option.value"
              [class.border-primary-600]="value() === option.value"
            >
              @if (value() === option.value) {
                <div class="rounded-full bg-primary-600 transition-transform duration-150 scale-100"
                     [class]="dotSizeClass()"></div>
              }
            </div>
          </div>

          <div class="flex flex-col gap-0.5 pt-0.5">
            <span class="text-sm font-medium text-surface-800 leading-tight">{{ option.label }}</span>
            @if (option.description) {
              <span class="text-xs text-surface-500 leading-snug">{{ option.description }}</span>
            }
          </div>
        </label>
      }
    </fieldset>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
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
