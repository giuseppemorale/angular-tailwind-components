import { Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css'
})
export class TailwindSkeleton extends TailwindComponent {
  readonly variant = input<'text' | 'circle' | 'rect' | 'rounded'>('text');
  readonly width = input<string>('100%');
  readonly height = input<string>('');

  readonly computedClasses = computed(() => {
    const base = 'tailwind-skeleton-pulse';
    const variantMap: Record<string, string> = {
      text: 'h-4 rounded',
      circle: 'rounded-full',
      rect: 'rounded-none',
      rounded: 'rounded-xl'
    };
    return `${base} ${variantMap[this.variant()]}`;
  });
}
