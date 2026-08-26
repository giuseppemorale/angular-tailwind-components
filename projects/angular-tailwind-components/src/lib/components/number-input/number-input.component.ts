import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_LABELS } from '../../tokens';
import {
  CONTROL_HEIGHT,
  CONTROL_SQUARE,
  DISABLED_PRESSABLE,
  FIELD_BASE,
  FIELD_SIZE,
  FIELD_STATE,
  FIELD_STATE_INVALID,
  FOCUS_RING,
  PRESS_FEEDBACK,
  TRANSITION_CONTROL
} from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

/**
 * Numeric field with real increment and decrement buttons instead of the native spinners.
 * Clamps to `min`/`max` and keeps the form value a `number | null`, never a numeric string.
 */
@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-number-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindNumberInput),
      multi: true
    }
  ],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindNumberInput extends TailwindComponent implements ControlValueAccessor {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });
  private readonly labels = inject(TAILWIND_LABELS);

  /** Label text. */
  readonly label = input<string>('');
  /** Accessible name when there is no visible `label`. */
  readonly ariaLabel = input<string>('');
  /** Placeholder shown while empty. */
  readonly placeholder = input<string>('');
  /** Lower bound; the decrement button stops here. */
  readonly min = input<number | undefined>(undefined);
  /** Upper bound; the increment button stops here. */
  readonly max = input<number | undefined>(undefined);
  /** Amount added or removed per step. */
  readonly step = input<number>(1);
  /** Size variant. */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Disables the field and both steppers. */
  readonly disabled = input<boolean>(false);
  /** Value cannot be typed or stepped, but stays selectable. */
  readonly readonly = input<boolean>(false);
  /** Adds `required`, `aria-required` and the asterisk on the label. */
  readonly required = input<boolean>(false);
  /** Help text under the field. */
  readonly helperText = input<string>('');
  /** Error message, announced with `role="alert"` while `hasError` is set. */
  readonly errorText = input<string>('');
  /** Applies the error styling. */
  readonly hasError = input<boolean>(false);

  /** Current value; `null` when the field is empty. */
  readonly value = model<number | null>(null);

  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly decrementLabel = computed(() => this.labels.decrement);
  readonly incrementLabel = computed(() => this.labels.increment);

  readonly canDecrement = computed(() => {
    if (this.isDisabled() || this.readonly()) return false;
    const min = this.min();
    return min === undefined || (this.value() ?? min) > min;
  });

  readonly canIncrement = computed(() => {
    if (this.isDisabled() || this.readonly()) return false;
    const max = this.max();
    return max === undefined || (this.value() ?? max) < max;
  });

  readonly inputClasses = computed(() =>
    [
      'block',
      FIELD_BASE,
      'text-center tabular-nums',
      FIELD_SIZE[this.size()],
      this.hasError() ? FIELD_STATE_INVALID : FIELD_STATE
    ].join(' ')
  );

  /** The steppers match the field height so the three controls read as one object. */
  readonly stepperClasses = computed(() =>
    [
      'flex shrink-0 items-center justify-center rounded-control border border-border-strong bg-surface text-neutral-600',
      'hover:bg-surface-muted hover:text-fg cursor-pointer',
      CONTROL_HEIGHT[this.size()],
      CONTROL_SQUARE[this.size()],
      TRANSITION_CONTROL,
      PRESS_FEEDBACK,
      FOCUS_RING,
      DISABLED_PRESSABLE
    ].join(' ')
  );

  increment(): void {
    this.stepBy(this.step());
  }

  decrement(): void {
    this.stepBy(-this.step());
  }

  onInputChange(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    // An empty field is a real state — `null` — not zero.
    this.commit(raw === '' ? null : this.clamp(Number(raw)));
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.increment();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrement();
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  private stepBy(delta: number): void {
    if (this.isDisabled() || this.readonly()) return;
    const base = this.value() ?? this.min() ?? 0;
    this.commit(this.clamp(base + delta));
  }

  /** Keeps the value inside `[min, max]` and free of floating-point dust from repeated stepping. */
  private clamp(raw: number): number | null {
    if (!Number.isFinite(raw)) return null;
    const min = this.min();
    const max = this.max();
    let next = raw;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    return Math.round(next * 1e6) / 1e6;
  }

  private commit(next: number | null): void {
    this.value.set(next);
    this.onChange(next);
  }

  // CVA
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.value.set(typeof value === 'number' && Number.isFinite(value) ? value : null);
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
