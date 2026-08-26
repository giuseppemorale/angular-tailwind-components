import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindOption, TailwindSize } from '../../models';
import { TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { FOCUS_RING, PRESS_FEEDBACK, TRANSITION_CONTROL } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';
import type { ThumbGeometry } from './interfaces/thumb-geometry.interface';
import { SEGMENT_SIZE } from './properties/constant';

/**
 * Two to five mutually exclusive choices shown side by side, built on the WAI-ARIA radio group
 * pattern so the value works with `formControl`.
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

  /** The track, which is also the positioning context for the thumb. */
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  /**
   * Where the sliding thumb currently is. `null` until the first measurement (or when nothing is
   * selected), which keeps the thumb hidden instead of flashing at the origin.
   */
  private readonly thumb = signal<ThumbGeometry | null>(null);

  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver?: ResizeObserver;

  constructor() {
    super();

    // Re-measure whenever anything that can move the segments changes.
    effect(() => {
      this.value();
      this.options();
      this.size();
      this.fullWidth();
      // The DOM still holds the previous layout at this point; measure once it has caught up.
      queueMicrotask(() => this.measureThumb());
    });

    afterNextRender(() => {
      const el = this.track()?.nativeElement;
      if (!el) return;

      // Labels reflow (container resize, font swap, i18n) without any input changing.
      this.resizeObserver = new ResizeObserver(() => this.measureThumb());
      this.resizeObserver.observe(el);
      this.measureThumb();

      this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
    });
  }

  readonly containerClasses = computed(() =>
    this.mergeClasses(
      'relative inline-flex items-center gap-1 rounded-control border border-border bg-surface-muted p-1',
      this.fullWidth() ? 'flex w-full' : '',
      this.isDisabled() ? 'opacity-50' : ''
    )
  );

  /** The single highlight element that slides behind the selection; `hidden` until measured. */
  readonly thumbClasses = computed(() =>
    [
      'pointer-events-none absolute top-1 bottom-1 left-0 rounded-control-inner bg-surface shadow-sm',
      'transition-[transform,width] duration-200 ease-in-out',
      this.thumb() ? 'opacity-100' : 'opacity-0'
    ].join(' ')
  );

  readonly thumbTransform = computed(() => `translateX(${this.thumb()?.left ?? 0}px)`);

  readonly thumbWidth = computed(() => `${this.thumb()?.width ?? 0}px`);

  isSelected(option: TailwindOption<T>): boolean {
    return this.compareWith()(option.value, this.value());
  }

  segmentClasses(option: TailwindOption<T>): string {
    const selected = this.isSelected(option);
    return [
      // `relative` lifts the label above the thumb, which is painted first in the same stacking context.
      'relative rounded-control-inner font-medium cursor-pointer whitespace-nowrap',
      TRANSITION_CONTROL,
      PRESS_FEEDBACK,
      FOCUS_RING,
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.fullWidth() ? 'flex-1' : '',
      SEGMENT_SIZE[this.size()],
      selected ? 'text-fg' : 'text-neutral-600 hover:text-fg'
    ]
      .filter(Boolean)
      .join(' ');
  }

  /** Reads the selected segment's box and parks the thumb on it. */
  private measureThumb(): void {
    const track = this.track()?.nativeElement;
    if (!track) return;

    const index = this.options().findIndex(o => this.isSelected(o));
    if (index < 0) {
      this.thumb.set(null);
      return;
    }

    const segment = track.querySelectorAll<HTMLElement>('[role="radio"]').item(index);
    if (!segment) {
      this.thumb.set(null);
      return;
    }

    this.thumb.set({ left: segment.offsetLeft, width: segment.offsetWidth });
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
