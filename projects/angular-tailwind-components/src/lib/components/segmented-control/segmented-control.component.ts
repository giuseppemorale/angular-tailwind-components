import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindOption, TailwindSize } from '../../models';
import { TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { TailwindComponent } from '../tailwind.component';

/** Padding and text size per control size. */
const SEGMENT_SIZE: Record<TailwindSize, string> = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
  xl: 'text-base px-5 py-2.5'
};

/**
 * A small set of mutually exclusive choices shown side by side — the "segmented control" or
 * "toggle group" pattern. Use it instead of a select when there are two to five short options and
 * seeing them all at once matters.
 *
 * Implemented as the WAI-ARIA **radio group** pattern rather than a tablist: the choice is a value,
 * not a view, so it belongs in forms and works with `formControl`.
 */
@Component({
  selector: 'tailwind-segmented-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindSegmentedControl),
      multi: true
    }
  ],
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindSegmentedControl<T = string> extends TailwindComponent implements ControlValueAccessor {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The available choices. */
  readonly options = input<TailwindOption<T>[]>([]);
  /** Visible label above the group. */
  readonly label = input<string>('');
  /** Accessible name when there is no visible `label`. */
  readonly ariaLabel = input<string>('');
  /** Size variant. */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Stretches the segments to fill the available width. */
  readonly fullWidth = input<boolean>(false);
  /** Disables the whole group. */
  readonly disabled = input<boolean>(false);
  /** How an option value is matched against the current value. */
  readonly compareWith = input<(a: T | null, b: T | null) => boolean>((a, b) => Object.is(a, b));

  /** Selected value. */
  readonly value = model<T | null>(null);

  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly containerClasses = computed(() =>
    this.mergeClasses(
      'inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-surface-muted p-1',
      this.fullWidth() ? 'flex w-full' : '',
      this.isDisabled() ? 'opacity-50' : ''
    )
  );

  isSelected(option: TailwindOption<T>): boolean {
    return this.compareWith()(option.value, this.value());
  }

  segmentClasses(option: TailwindOption<T>): string {
    const selected = this.isSelected(option);
    return [
      'rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.fullWidth() ? 'flex-1' : '',
      SEGMENT_SIZE[this.size()],
      selected ? 'bg-surface text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
    ]
      .filter(Boolean)
      .join(' ');
  }

  select(option: TailwindOption<T>): void {
    if (this.isDisabled() || option.disabled) return;
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
  }

  /**
   * Radio-group keyboard behaviour: arrows move between segments and select as they go, wrapping
   * around and skipping disabled ones; Home/End jump to the extremes.
   */
  onKeydown(event: KeyboardEvent): void {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    const options = this.options();
    if (this.isDisabled() || options.length === 0) return;

    const current = options.findIndex(o => this.isSelected(o));
    let target: number;

    if (event.key === 'Home') target = this.nextEnabled(-1, 1);
    else if (event.key === 'End') target = this.nextEnabled(options.length, -1);
    else if (event.key in step) target = this.nextEnabled(current, step[event.key]);
    else return;

    if (target < 0) return;
    event.preventDefault();
    this.select(options[target]);
    this.focusSegment(target);
  }

  private nextEnabled(from: number, direction: number): number {
    const options = this.options();
    for (let step = 1; step <= options.length; step++) {
      const index = (((from + direction * step) % options.length) + options.length) % options.length;
      if (!options[index].disabled) return index;
    }
    return -1;
  }

  private focusSegment(index: number): void {
    this.host.nativeElement.querySelectorAll<HTMLButtonElement>('[role="radio"]').item(index)?.focus();
  }

  // CVA
  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | null): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
