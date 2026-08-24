import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TailwindSafeHtmlPipe } from '../../pipes/safehtml/safehtml.pipe';
import { TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { FIELD_SIZE } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindSafeHtmlPipe],
  selector: 'tailwind-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindInput),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindInput extends TailwindComponent implements ControlValueAccessor {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });

  /** Label text */
  readonly label = input<string>('');
  /** Placeholder text */
  readonly placeholder = input<string>('');
  /** Input type */
  readonly type = input<'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'>('text');
  /** Size variant */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Whether the input is readonly */
  readonly readonly = input<boolean>(false);
  /** Helper text shown below input */
  readonly helperText = input<string>('');
  /** Error text shown when hasError is true */
  readonly errorText = input<string>('');
  /** Whether the input is in error state */
  readonly hasError = input<boolean>(false);

  /** Two-way bound value */
  readonly value = model<string>('');

  /** Internal disabled state */
  readonly isDisabled = signal(false);

  /** Computed input classes */
  readonly inputClasses = computed(() => {
    const base = [
      'block w-full bg-surface',
      'border transition-colors duration-150',
      'placeholder:text-neutral-400',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed'
    ];

    const stateClass = this.hasError()
      ? 'border-danger-400 focus:outline-danger-500 text-danger-900'
      : 'border-neutral-300 focus:outline-primary-500 text-neutral-900';

    return [...base, FIELD_SIZE[this.size()], stateClass].join(' ');
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
