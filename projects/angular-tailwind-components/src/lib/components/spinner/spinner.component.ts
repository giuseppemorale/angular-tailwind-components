import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindColor, TailwindSize } from '../../models';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindSpinner extends TailwindComponent {
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Color uses Tailwind text color class */
  readonly color = input<TailwindColor>('primary');
  /** Optional label text */
  readonly label = input<string>('');
  /** Aria label for accessibility */
  readonly ariaLabel = input<string>('Loading');
  /** Layout orientation */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly containerClasses = computed(() => {
    const base = 'inline-flex items-center gap-2';
    const orient = this.orientation() === 'vertical' ? 'flex-col' : '';
    return `${base} ${orient}`;
  });

  readonly iconPixelSize = computed(() => {
    const sizeMap: Record<TailwindSize, number> = {
      xs: 16,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 48
    };
    return sizeMap[this.size()];
  });

  readonly iconClasses = computed(() => {
    const colorMap: Record<TailwindColor, string> = {
      primary: 'text-primary-600',
      secondary: 'text-neutral-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-danger-600',
      info: 'text-info-600',
      transparent: 'text-neutral-400'
    };

    return `animate-spin ${colorMap[this.color()]}`;
  });

  readonly labelClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };

    return `${sizeMap[this.size()]} ${this.color()} font-medium`;
  });
}
