import { Component, computed, input } from '@angular/core';
import { TailwindSize } from '../../models';

@Component({
  selector: 'tailwind-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class TailwindSkeleton {
  readonly variant = input<'text' | 'circle' | 'rect' | 'rounded'>('text');
  readonly width = input<string>('100%');
  readonly height = input<string>('');

  readonly computedClasses = computed(() => {
    const base = 'tailwind-skeleton-pulse';
    const variantMap: Record<string, string> = {
      text: 'h-4 rounded',
      circle: 'rounded-full',
      rect: 'rounded-none',
      rounded: 'rounded-xl',
    };
    return `${base} ${variantMap[this.variant()]}`;
  });

  get hostStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.width()) styles['width'] = this.width();
    if (this.height()) styles['height'] = this.height();
    else if (this.variant() === 'circle') styles['height'] = this.width();
    return styles;
  }
}
