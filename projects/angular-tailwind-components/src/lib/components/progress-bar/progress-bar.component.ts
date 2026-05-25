import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindColor, TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindProgressBar extends TailwindComponent {
  /** Current value (0-100) */
  readonly value = input<number>(0);
  /** Label text */
  readonly label = input<string>('');
  /** Show the label row */
  readonly showLabel = input<boolean>(true);
  /** Show percentage value */
  readonly showValue = input<boolean>(true);
  /** Semantic color */
  readonly color = input<TailwindColor>('primary');
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Indeterminate mode (animated) */
  readonly indeterminate = input<boolean>(false);
  /** Whether to use striped pattern */
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
    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-600',
      secondary: 'bg-neutral-500',
      success: 'bg-success-600',
      warning: 'bg-warning-500',
      danger: 'bg-danger-600',
      info: 'bg-info-600',
      transparent: 'bg-neutral-300'
    };

    const base = ['h-full rounded-full transition-all duration-300 ease-out', colorMap[this.color()]];

    if (this.indeterminate()) {
      base.push('tailwind-progress-indeterminate');
    }

    if (this.striped()) {
      base.push('bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_100%]');
    }

    return base.join(' ');
  });
}
