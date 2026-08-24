import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_LABELS } from '../../tokens';
import { FIELD_SIZE } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

/**
 * Numeric field with increment and decrement controls — the "spinner" or "stepper" input.
 *
 * `tailwind-input type="number"` leaves the browser's native spinners, which are tiny, unstyleable
 * and absent on mobile. This renders real buttons, clamps to `min`/`max`, and keeps the value a
 * `number | null` in the form rather than a numeric string.
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
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  /** Amount added or removed per step. */
  readonly step = input<number>(1);
  /** Size variant. */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly helperText = input<string>('');
  readonly errorText = input<string>('');
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

  readonly inputClasses = computed(() => {
    const stateClass = this.hasError()
      ? 'border-danger-400 focus:outline-danger-500 text-danger-900'
      : 'border-neutral-300 focus:outline-primary-500 text-neutral-900';

    return [
      'block w-full bg-surface text-center tabular-nums',
      'border transition-colors duration-150',
      'placeholder:text-neutral-400',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
      FIELD_SIZE[this.size()],
      stateClass
    ].join(' ');
  });

  readonly stepperClasses =
    'flex shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-surface p-1.5 text-neutral-600 ' +
    'hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600';

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
