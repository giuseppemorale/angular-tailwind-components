import { Component, computed, input } from '@angular/core';
import { TailwindSize, TailwindSeverity } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TailwindMeterSegment } from './interfaces/meter-segment.interface';

@Component({
  selector: 'tailwind-meter',
  templateUrl: './meter.component.html',
  styleUrl: './meter.component.scss'
})
export class TailwindMeter extends TailwindComponent {
  /** Segments rendered as proportional blocks in the bar. */
  readonly segments = input<TailwindMeterSegment[]>([]);
  /**
   * Scale maximum. Each segment `value` is shown as `value / max` of the bar width.
   * Default 100 (percent-style values).
   */
  readonly max = input<number>(100);
  /** Show a simple legend under the bar */
  readonly showLabels = input<boolean>(true);
  /** Track height */
  readonly size = input<TailwindSize>('md');

  readonly trackHeightClass = computed(() => {
    const map: Record<TailwindSize, string> = {
      xs: 'h-1.5',
      sm: 'h-2',
      md: 'h-2.5',
      lg: 'h-3.5',
      xl: 'h-4'
    };
    return map[this.size()];
  });

  readonly totalValue = computed(() => this.segments().reduce((s, x) => s + Math.max(0, x.value), 0));

  readonly scaleMax = computed(() => {
    const m = this.max();
    if (m > 0) {
      return m;
    }
    const t = this.totalValue();
    return t > 0 ? t : 1;
  });

  readonly segmentLayouts = computed(() => {
    const cap = this.scaleMax();
    return this.segments().map(seg => {
      const pct = cap > 0 ? (Math.max(0, seg.value) / cap) * 100 : 0;
      const variant = seg.variant ?? 'primary';
      return { ...seg, widthPct: pct, barClass: this.variantToBarClass(variant) };
    });
  });

  readonly trackContainerClasses = computed(
    () => `flex w-full overflow-hidden rounded-full bg-surface-200 ${this.trackHeightClass()}`
  );

  legendSwatchClass(variant?: TailwindSeverity | 'primary'): string {
    return this.variantToBarClass(variant ?? 'primary');
  }

  private variantToBarClass(variant: TailwindSeverity | 'primary'): string {
    const map: Record<string, string> = {
      primary: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-500',
      danger: 'bg-danger-600',
      info: 'bg-info-600'
    };
    return map[variant] ?? map['primary'];
  }
}
