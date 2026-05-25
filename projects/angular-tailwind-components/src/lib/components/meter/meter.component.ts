import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindSize, TailwindPalette } from '../../models';
import { filledBarClasses } from '../../utils/palette.util';
import { TailwindComponent } from '../tailwind.component';
import { TailwindMeterSegment } from './interfaces/meter-segment.interface';

@Component({
  selector: 'tailwind-meter',
  templateUrl: './meter.component.html',
  styleUrl: './meter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindMeter extends TailwindComponent {
  readonly segments = input<TailwindMeterSegment[]>([]);
  readonly max = input<number>(100);
  readonly showLabels = input<boolean>(true);
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
      const palette = seg.color ?? 'neutral';
      return { ...seg, widthPct: pct, barClass: this.paletteToBarClass(palette) };
    });
  });

  readonly trackContainerClasses = computed(
    () => `flex w-full overflow-hidden rounded-full bg-neutral-200 ${this.trackHeightClass()}`
  );

  legendSwatchClass(palette: TailwindPalette = 'neutral'): string {
    return this.paletteToBarClass(palette);
  }

  private paletteToBarClass(palette: TailwindPalette): string {
    const shade = palette === 'amber' || palette === 'yellow' ? 500 : 600;
    return filledBarClasses(palette, shade);
  }
}
