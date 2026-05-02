import { Component, computed, input } from '@angular/core';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class AtcSpinner {
  /** Size variant */
  size = input<AtcSize>('md');
  /** Color â€” uses Tailwind text color class */
  color = input<string>('text-primary-600');
  /** Optional label text */
  label = input<string>('');
  /** Aria label for accessibility */
  ariaLabel = input<string>('Loading');
  /** Layout orientation */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  containerClasses = computed(() => {
    const base = 'inline-flex items-center gap-2';
    const orient = this.orientation() === 'vertical' ? 'flex-col' : '';
    return `${base} ${orient}`;
  });

  spinnerClasses = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    return `atc-spinner-svg ${sizeMap[this.size()]} ${this.color()}`;
  });

  labelClasses = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    return `${sizeMap[this.size()]} ${this.color()} font-medium`;
  });
}
