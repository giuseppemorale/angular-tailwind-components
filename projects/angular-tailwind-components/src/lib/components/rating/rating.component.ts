import { ChangeDetectionStrategy, Component, computed, forwardRef, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_LABELS } from '../../tokens';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';
import { STAR_PIXEL_SIZE } from './properties/constant';

/** Star rating, editable or read-only. Exposed as a `slider` for arrow-key support. */
@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-rating',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindRating),
      multi: true
    }
  ],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindRating extends TailwindComponent implements ControlValueAccessor {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });
  private readonly labels = inject(TAILWIND_LABELS);

  /** How many stars to show. */
  readonly max = input<number>(5);
  /** Size variant. */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Display only: no pointer or keyboard interaction, and no slider semantics. */
  readonly readonly = input<boolean>(false);
  /** Disables interaction while keeping the control in the tab order semantics of a disabled input. */
  readonly disabled = input<boolean>(false);
  /** Allows clearing the rating by picking the current value again. */
  readonly clearable = input<boolean>(true);
  /** Accessible name; defaults to `TAILWIND_LABELS.rating`. */
  readonly ariaLabel = input<string>('');

  /** Current rating, `0` meaning unrated. */
  readonly value = model<number>(0);

  private readonly formDisabled = signal(false);
  /** Star under the pointer, previewed without committing. */
  private readonly hovered = signal<number | null>(null);

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly isInteractive = computed(() => !this.readonly() && !this.isDisabled());

  readonly stars = computed(() => Array.from({ length: Math.max(1, this.max()) }, (_, i) => i + 1));
  readonly starPixelSize = computed(() => STAR_PIXEL_SIZE[this.size()]);

  /** What the user currently sees: the hover preview when there is one, the value otherwise. */
  readonly displayValue = computed(() => this.hovered() ?? this.value());

  readonly resolvedAriaLabel = computed(() => this.ariaLabel() || this.labels.rating);
  readonly valueText = computed(() =>
    this.labels.ratingValue.replace('{value}', String(this.value())).replace('{max}', String(this.max()))
  );

  isFilled(star: number): boolean {
    return star <= this.displayValue();
  }

  starClasses(star: number): string {
    return [
      'transition-colors duration-150 ease-in-out',
      this.isFilled(star) ? 'text-warning-500' : 'text-neutral-300',
      this.isInteractive() ? 'cursor-pointer' : ''
    ]
      .filter(Boolean)
      .join(' ');
  }

  onStarEnter(star: number): void {
    if (this.isInteractive()) this.hovered.set(star);
  }

  onPointerLeave(): void {
    this.hovered.set(null);
  }

  pick(star: number): void {
    if (!this.isInteractive()) return;
    // Clicking the current rating again clears it, which is the only way to undo with the pointer.
    const next = this.clearable() && star === this.value() ? 0 : star;
    this.commit(next);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isInteractive()) return;

    const delta: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
    let next: number;

    if (event.key === 'Home') next = this.clearable() ? 0 : 1;
    else if (event.key === 'End') next = this.max();
    else if (event.key in delta) next = this.value() + delta[event.key];
    else return;

    event.preventDefault();
    this.commit(Math.min(this.max(), Math.max(this.clearable() ? 0 : 1, next)));
  }

  private commit(next: number): void {
    this.value.set(next);
    this.hovered.set(null);
    this.onChange(next);
    this.onTouched();
  }

  // CVA
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.value.set(typeof value === 'number' && Number.isFinite(value) ? value : 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
