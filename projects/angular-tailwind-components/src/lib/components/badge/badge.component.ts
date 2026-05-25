import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindPalette, TailwindSize } from '../../models';
import { softBadgeClasses } from '../../utils/palette.util';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindBadge extends TailwindComponent {
  readonly color = input<TailwindPalette>('neutral');
  readonly size = input<TailwindSize>('md');
  readonly dot = input<boolean>(false);
  readonly rounded = input<boolean>(false);
  readonly ariaLabel = input<string>('');

  readonly computedClasses = computed(() => {
    const base = ['inline-flex items-center gap-1 font-medium', 'leading-none'];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5',
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
      lg: 'text-sm px-3 py-1',
      xl: 'text-sm px-3.5 py-1.5'
    };

    const shape = this.rounded() ? 'rounded-full' : 'rounded-md';

    return [...base, softBadgeClasses(this.color()), sizeMap[this.size()], shape].join(' ');
  });
}
