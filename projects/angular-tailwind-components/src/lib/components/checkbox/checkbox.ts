import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtcCheckbox),
      multi: true,
    },
  ],
  template: `
    <label
      [for]="checkboxId()"
      class="inline-flex items-start gap-2.5 cursor-pointer select-none"
      [class.cursor-not-allowed]="isDisabled()"
      [class.opacity-50]="isDisabled()"
    >
      <div class="relative flex items-center justify-center shrink-0" [class]="boxSizeClass()">
        <input
          [id]="checkboxId()"
          type="checkbox"
          class="peer sr-only"
          [checked]="checked()"
          [disabled]="isDisabled()"
          [attr.aria-describedby]="description() ? checkboxId() + '-desc' : null"
          (change)="onCheckboxChange($event)"
        />
        <div
          class="w-full h-full rounded-md border-2 transition-all duration-150
                 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/30 peer-focus-visible:ring-offset-1"
          [class.border-surface-300]="!checked()"
          [class.bg-white]="!checked()"
          [class.border-primary-600]="checked()"
          [class.bg-primary-600]="checked()"
        >
          @if (checked()) {
            <svg class="w-full h-full text-white p-0.5" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.5 4.5L6.5 11.5L3 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        </div>
      </div>

      <div class="flex flex-col gap-0.5 pt-0.5">
        @if (label()) {
          <span class="text-sm font-medium text-surface-800 leading-tight">{{ label() }}</span>
        }
        @if (description()) {
          <span
            [id]="checkboxId() + '-desc'"
            class="text-xs text-surface-500 leading-snug"
          >
            {{ description() }}
          </span>
        }
      </div>
    </label>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `,
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
