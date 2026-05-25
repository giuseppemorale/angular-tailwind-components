import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindColor, TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindBadge extends TailwindComponent {
  /** Semantic color */
  readonly color = input<TailwindColor>('primary');
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Show a dot indicator */
  readonly dot = input<boolean>(false);
  /** Shape variant */
  readonly rounded = input<boolean>(false);
  /** Accessible label */
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

    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-100 text-primary-700',
      secondary: 'bg-neutral-100 text-neutral-700',
      success: 'bg-success-100 text-success-700',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'bg-danger-100 text-danger-700',
      info: 'bg-info-100 text-info-700',
      transparent: 'bg-transparent text-neutral-600 border border-neutral-200'
    };

    const shape = this.rounded() ? 'rounded-full' : 'rounded-md';

    return [...base, colorMap[this.color()], sizeMap[this.size()], shape].join(' ');
  });
}
