import { Component, computed, input } from '@angular/core';
import { TailwindSize } from '../../models';

@Component({
  selector: 'tailwind-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class TailwindSpinner {
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Color ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â uses Tailwind text color class */
  readonly color = input<string>('text-primary-600');
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
      xl: 'w-12 h-12',
    };

    return `tailwind-spinner-svg ${sizeMap[this.size()]} ${this.color()}`;
  });

  readonly labelClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    return `${sizeMap[this.size()]} ${this.color()} font-medium`;
  });
}
