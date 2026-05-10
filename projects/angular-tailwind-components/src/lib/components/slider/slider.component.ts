import { booleanAttribute, Component, computed, ElementRef, forwardRef, input, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSeverity, TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

/** Value model: single number or sorted pair when `range` is true */
export type TailwindSliderValue = number | [number, number];

@Component({
  selector: 'tailwind-slider',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindSlider),
      multi: true
    }
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class TailwindSlider extends TailwindComponent implements ControlValueAccessor {
  /** Minimum bound */
  readonly min = input<number>(0);
  /** Maximum bound */
  readonly max = input<number>(100);
  /** Step increment */
  readonly step = input<number>(1);
  /** Two-thumb range mode */
  readonly range = input<boolean>(false);
  /** Layout */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Tick marks at each step */
  readonly showTicks = input<boolean>(false);
  /** Control size */
  readonly size = input<TailwindSize>('md');
  /** Track fill / thumb color */
  readonly variant = input<TailwindSeverity | 'primary'>('primary');

  readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  /** Single-thumb value */
  readonly singleValue = signal(0);
  /** Range: lower value */
  readonly rangeLow = signal(0);
  /** Range: upper value */
  readonly rangeHigh = signal(100);

  /** Disabled via template (combined with form `setDisabledState`) */
  readonly hostDisabled = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly isDisabled = signal(false);

  readonly isEffectivelyDisabled = computed(() => this.isDisabled() || this.hostDisabled());

  private onChange: (v: TailwindSliderValue) => void = () => {};
  private onTouched: () => void = () => {};

  readonly activeThumb = signal<null | 0 | 1>(null);

  readonly thumbSizeClass = computed(() => {
    const map: Record<TailwindSize, string> = {
      xs: 'size-3',
      sm: 'size-3.5',
      md: 'size-4',
      lg: 'size-5',
      xl: 'size-6'
    };
    return map[this.size()];
  });

  readonly trackThickness = computed(() => {
    const map: Record<TailwindSize, string> = {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-2.5',
      xl: 'h-3'
    };
    return map[this.size()];
  });

  readonly verticalTrackThickness = computed(() => {
    const map: Record<TailwindSize, string> = {
      xs: 'w-1',
      sm: 'w-1.5',
      md: 'w-2',
      lg: 'w-2.5',
      xl: 'w-3'
    };
    return map[this.size()];
  });

  /**
   * Uses theme CSS variables (`--color-*`) so accent colors work even when dynamic
   * `bg-*` utilities are not present in the compiled stylesheet (Tailwind content scan).
   */
  readonly accentVars = computed(() => {
    const name = this.variant();
    return {
      fill: `var(--color-${name}-500)`,
      thumb: `var(--color-${name}-600)`,
      ring: `var(--color-${name}-500)`
    };
  });

  readonly singlePct = computed(() => this.valueToPct(this.singleValue()));

  readonly lowPct = computed(() => this.valueToPct(this.rangeLow()));
  readonly highPct = computed(() => this.valueToPct(this.rangeHigh()));

  readonly fillStartPct = computed(() => (this.range() ? Math.min(this.lowPct(), this.highPct()) : 0));

  readonly fillWidthPct = computed(() =>
    this.range() ? Math.abs(this.highPct() - this.lowPct()) : this.singlePct()
  );

  readonly tickPositions = computed(() => {
    if (!this.showTicks()) {
      return [] as number[];
    }
    const lo = this.min();
    const hi = this.max();
    const st = this.step();
    if (st <= 0 || hi < lo) {
      return [];
    }
    const steps = Math.round((hi - lo) / st);
    const out: number[] = [];
    for (let i = 0; i <= steps; i++) {
      out.push(this.valueToPct(lo + i * st));
    }
    return out;
  });

  writeValue(value: TailwindSliderValue | null): void {
    const lo = this.min();
    const hi = this.max();
    if (this.range()) {
      const pair = Array.isArray(value) ? value : [lo, hi];
      const a = this.snap(Math.min(pair[0] ?? lo, pair[1] ?? hi));
      const b = this.snap(Math.max(pair[0] ?? lo, pair[1] ?? hi));
      this.rangeLow.set(Math.min(a, b));
      this.rangeHigh.set(Math.max(a, b));
    } else {
      const n = Array.isArray(value) ? value[0] : value;
      const num = typeof n === 'number' && !Number.isNaN(n) ? n : lo;
      this.singleValue.set(this.snap(num));
    }
  }

  registerOnChange(fn: (v: TailwindSliderValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  valueToPct(v: number): number {
    const lo = this.min();
    const hi = this.max();
    if (hi === lo) {
      return 0;
    }
    return ((this.snap(v) - lo) / (hi - lo)) * 100;
  }

  snap(raw: number): number {
    const lo = this.min();
    const hi = this.max();
    const st = this.step();
    if (st <= 0) {
      return Math.min(hi, Math.max(lo, raw));
    }
    const stepped = Math.round((raw - lo) / st) * st + lo;
    const rounded = Math.round(stepped * 1e6) / 1e6;
    return Math.min(hi, Math.max(lo, rounded));
  }

  pctToValue(pct: number): number {
    const lo = this.min();
    const hi = this.max();
    const v = lo + (pct / 100) * (hi - lo);
    return this.snap(v);
  }

  onThumbPointerDown(event: PointerEvent, thumbIndex: 0 | 1): void {
    event.stopPropagation();
    this.onTrackPointerDown(event, thumbIndex);
  }

  onTrackPointerDown(event: PointerEvent, thumbIndex: 0 | 1 | null): void {
    if (this.isEffectivelyDisabled()) {
      return;
    }
    event.preventDefault();
    const track = this.trackRef()?.nativeElement;
    if (!track) {
      return;
    }

    let thumb: 0 | 1 | null = thumbIndex;
    if (!this.range()) {
      thumb = null;
    } else if (thumb === null) {
      const v = this.readValueFromPointer(event, track);
      const low = this.rangeLow();
      const high = this.rangeHigh();
      const d0 = Math.abs(v - low);
      const d1 = Math.abs(v - high);
      thumb = d0 <= d1 ? 0 : 1;
    }

    this.activeThumb.set(thumb);
    this.applyPointer(event, track, thumb);

    if (typeof track.setPointerCapture === 'function') {
      track.setPointerCapture(event.pointerId);
    }

    const move = (ev: PointerEvent) => this.applyPointer(ev, track, thumb);
    const up = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      try {
        track.releasePointerCapture(ev.pointerId);
      } catch {
        /* ignore */
      }
      this.activeThumb.set(null);
      this.onTouched();
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  }

  private readValueFromPointer(event: PointerEvent, track: HTMLElement): number {
    const rect = track.getBoundingClientRect();
    const horizontal = this.orientation() === 'horizontal';
    let ratio: number;
    if (horizontal) {
      ratio = (event.clientX - rect.left) / rect.width;
    } else {
      ratio = 1 - (event.clientY - rect.top) / rect.height;
    }
    ratio = Math.min(1, Math.max(0, ratio));
    return this.pctToValue(ratio * 100);
  }

  private applyPointer(event: PointerEvent, track: HTMLElement, thumbIndex: 0 | 1 | null): void {
    const next = this.readValueFromPointer(event, track);
    if (this.range()) {
      const idx = thumbIndex ?? 0;
      if (idx === 0) {
        const hi = this.rangeHigh();
        this.rangeLow.set(this.snap(Math.min(next, hi)));
      } else {
        const lo = this.rangeLow();
        this.rangeHigh.set(this.snap(Math.max(next, lo)));
      }
      this.onChange([this.rangeLow(), this.rangeHigh()]);
    } else {
      this.singleValue.set(next);
      this.onChange(this.singleValue());
    }
  }

  onKeyDown(event: KeyboardEvent, thumbIndex: 0 | 1): void {
    if (this.isEffectivelyDisabled()) {
      return;
    }
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) {
      return;
    }
    event.preventDefault();
    const lo = this.min();
    const hi = this.max();
    const st = this.step();
    const horizontal = this.orientation() === 'horizontal';
    const decKey = horizontal ? 'ArrowLeft' : 'ArrowDown';
    const incKey = horizontal ? 'ArrowRight' : 'ArrowUp';

    const delta = (key: string) => {
      if (key === 'Home') {
        return lo - (thumbIndex === 0 ? this.rangeLow() : this.rangeHigh());
      }
      if (key === 'End') {
        return hi - (thumbIndex === 0 ? this.rangeLow() : this.rangeHigh());
      }
      if (key === decKey) {
        return -st;
      }
      if (key === incKey) {
        return st;
      }
      return 0;
    };

    const d = delta(event.key);
    if (d === 0) {
      return;
    }

    if (this.range()) {
      if (thumbIndex === 0) {
        const next = this.snap(this.rangeLow() + d);
        this.rangeLow.set(Math.min(next, this.rangeHigh()));
      } else {
        const next = this.snap(this.rangeHigh() + d);
        this.rangeHigh.set(Math.max(next, this.rangeLow()));
      }
      this.onChange([this.rangeLow(), this.rangeHigh()]);
    } else {
      this.singleValue.set(this.snap(this.singleValue() + d));
      this.onChange(this.singleValue());
    }
  }
}
