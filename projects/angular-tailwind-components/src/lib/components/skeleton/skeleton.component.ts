import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindSkeleton extends TailwindComponent {
  /** Shape of the placeholder. */
  readonly variant = input<'text' | 'circle' | 'rect' | 'rounded'>('text');
  /** CSS width of the placeholder. */
  readonly width = input<string>('100%');
  /** CSS height of the placeholder. */
  readonly height = input<string>('');

  readonly computedClasses = computed(() => {
    const base = 'tailwind-skeleton-pulse';
    const variantMap: Record<string, string> = {
      text: 'h-4 rounded-control-inner',
      circle: 'rounded-full',
      rect: 'rounded-none',
      rounded: 'rounded-surface'
    };
    return this.mergeClasses(base, variantMap[this.variant()]);
  });
}
