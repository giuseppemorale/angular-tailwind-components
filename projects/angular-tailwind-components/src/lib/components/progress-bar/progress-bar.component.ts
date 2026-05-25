import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindPalette, TailwindSize } from '../../models';
import { filledBarClasses } from '../../utils/palette.util';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindProgressBar extends TailwindComponent {
  readonly value = input<number>(0);
  readonly label = input<string>('');
  readonly showLabel = input<boolean>(true);
  readonly showValue = input<boolean>(true);
  readonly color = input<TailwindPalette>('neutral');
  readonly size = input<TailwindSize>('md');
  readonly indeterminate = input<boolean>(false);
  readonly striped = input<boolean>(false);

  readonly clampedValue = computed(() => Math.max(0, Math.min(100, this.value())));

  readonly trackClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
      xl: 'h-5'
    };

    return `w-full bg-neutral-200 rounded-full overflow-hidden ${sizeMap[this.size()]}`;
  });

  readonly barClasses = computed(() => {
    const palette = this.color();
    const shade = palette === 'amber' || palette === 'yellow' ? 500 : 600;
    const base = ['h-full rounded-full transition-all duration-300 ease-out', filledBarClasses(palette, shade)];

    if (this.indeterminate()) {
      base.push('tailwind-progress-indeterminate');
    }

    if (this.striped()) {
      base.push('bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_100%]');
    }

    return base.join(' ');
  });
}
