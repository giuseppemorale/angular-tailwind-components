import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TailwindSafeHtmlPipe } from '../../pipes/safehtml/safehtml.pipe';
import { TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { FIELD_BASE, FIELD_PADDING, FIELD_STATE, FIELD_STATE_INVALID } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindSafeHtmlPipe],
  selector: 'tailwind-textarea',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindTextarea),
      multi: true
    }
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTextarea extends TailwindComponent implements ControlValueAccessor {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });

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
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
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
    /**
     * A textarea grows with its content, so it takes {@link FIELD_PADDING} — the multi-line half of
     * the field scale, which keeps `py-*` — instead of the fixed `h-*` the single-line fields use.
     */
    const minHeightMap: Record<TailwindSize, string> = {
      xs: 'min-h-[4.5rem]',
      sm: 'min-h-[5rem]',
      md: 'min-h-[5.5rem]',
      lg: 'min-h-[6.5rem]',
      xl: 'min-h-[7.5rem]'
    };

    const resizeMap: Record<'vertical' | 'none' | 'both' | 'horizontal', string> = {
      vertical: 'resize-y',
      none: 'resize-none',
      both: 'resize',
      horizontal: 'resize-x'
    };

    const size = this.size();
    return [
      'block',
      FIELD_BASE,
      FIELD_PADDING[size],
      minHeightMap[size],
      resizeMap[this.resize()],
      this.hasError() ? FIELD_STATE_INVALID : FIELD_STATE
    ].join(' ');
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
