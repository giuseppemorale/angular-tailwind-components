import { Component, computed, input } from '@angular/core';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
})
export class AtcSkeleton {
  variant = input<'text' | 'circle' | 'rect' | 'rounded'>('text');
  width = input<string>('100%');
  height = input<string>('');

  computedClasses = computed(() => {
    const base = 'atc-skeleton-pulse';
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
