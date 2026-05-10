import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-textarea',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindTextarea),
      multi: true
    }
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css'
})
export class TailwindTextarea extends TailwindComponent implements ControlValueAccessor {
  /** Label text */
  readonly label = input<string>('');
  /** Placeholder text */
  readonly placeholder = input<string>('');
  /** Visible row count */
  readonly rows = input<number>(4);
  /** Optional maximum width in columns */
  readonly cols = input<number | undefined>(undefined);
  /** Maximum character length (HTML maxlength) */
  readonly maxlength = input<number | undefined>(undefined);
  /** Resize behavior */
  readonly resize = input<'vertical' | 'none' | 'both' | 'horizontal'>('vertical');
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Whether the textarea is readonly */
  readonly readonly = input<boolean>(false);
  /** Helper text shown below field */
  readonly helperText = input<string>('');
  /** Error text shown when hasError is true */
  readonly errorText = input<string>('');
  /** Whether the textarea is in error state */
  readonly hasError = input<boolean>(false);

  /** Two-way bound value */
  readonly value = model<string>('');

  /** Internal disabled state */
  readonly isDisabled = signal(false);

  /** Computed textarea classes */
  readonly textareaClasses = computed(() => {
    const base = [
      'block w-full bg-white',
      'border transition-colors duration-150',
      'placeholder:text-surface-400',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed'
    ];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm min-h-[4.5rem]',
      sm: 'text-sm px-2.5 py-1.5 rounded-md min-h-[5rem]',
      md: 'text-sm px-3 py-2 rounded-md min-h-[5.5rem]',
      lg: 'text-base px-3.5 py-2.5 rounded-lg min-h-[6.5rem]',
      xl: 'text-base px-4 py-3 rounded-lg min-h-[7.5rem]'
    };

    const resizeMap: Record<'vertical' | 'none' | 'both' | 'horizontal', string> = {
      vertical: 'resize-y',
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x'
    };

    const stateClass = this.hasError()
      ? 'border-danger-400 focus:outline-danger-500 text-danger-900'
      : 'border-surface-300 focus:outline-primary-500 text-surface-900';

    return [...base, sizeMap[this.size()], resizeMap[this.resize()], stateClass].join(' ');
  });

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
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
