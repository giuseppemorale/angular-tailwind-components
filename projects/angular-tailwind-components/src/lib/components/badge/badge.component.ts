import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TailwindColor, TailwindSize, TailwindVariantKind } from '../../models';
import { TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { semanticSurface } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindBadge extends TailwindComponent {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });

  /** Semantic color */
  readonly color = input<TailwindColor>('primary');
  /** How the surface is painted; all three kinds keep the badge exactly the same size. */
  readonly kind = input<TailwindVariantKind>('soft');
  /** Size variant */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Show a dot indicator */
  readonly dot = input<boolean>(false);
  /** Shape variant */
  readonly rounded = input<boolean>(false);
  /** Accessible label */
  readonly ariaLabel = input<string>('');

  readonly computedClasses = computed(() => {
    const base = ['inline-flex items-center gap-1 border font-medium', 'leading-none'];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5',
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
      lg: 'text-sm px-3 py-1',
      xl: 'text-sm px-3.5 py-1.5'
    };

    const shape = this.rounded() ? 'rounded-full' : 'rounded-control';

    return this.mergeClasses(...base, semanticSurface(this.kind(), this.color()), sizeMap[this.size()], shape);
  });
}
