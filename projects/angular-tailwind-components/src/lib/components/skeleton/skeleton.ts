import { Component, computed, input } from '@angular/core';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-skeleton',
  standalone: true,
  template: `<div [class]="computedClasses()" aria-hidden="true"></div>`,
  styles: `
    :host { display: block; }
    @keyframes atc-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .atc-skeleton-pulse {
      animation: atc-shimmer 1.5s ease-in-out infinite;
      background: linear-gradient(90deg, var(--color-surface-200) 25%, var(--color-surface-100) 50%, var(--color-surface-200) 75%);
      background-size: 200% 100%;
    }
  `,
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
