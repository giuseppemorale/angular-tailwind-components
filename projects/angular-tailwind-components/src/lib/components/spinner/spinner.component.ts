import { Component, computed, input } from '@angular/core';
import { TailwindColor, TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
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

  readonly spinnerClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };

    const colorMap: Record<TailwindColor, string> = {
      primary: 'text-primary-600',
      secondary: 'text-secondary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-danger-600',
      info: 'text-info-600'
    };

    return `tailwind-spinner-svg ${sizeMap[this.size()]} ${colorMap[this.color()]}`;
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
