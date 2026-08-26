import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import type { TailwindCardDensity } from './interfaces/card-density.type';
import { DENSITY_PADDING, SHELL_BASE } from './properties/constant';

@Component({
  selector: 'tailwind-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindCard extends TailwindComponent {
  readonly shellClasses = computed(() => {
    const shadow = this.elevated()
      ? this.hoverable()
        ? 'shadow-lg hover:shadow-xl'
        : 'shadow-lg'
      : this.hoverable()
        ? 'shadow-sm hover:shadow-md'
        : 'shadow-sm';

    return this.mergeClasses(SHELL_BASE, shadow);
  });

  /** Whether the card has elevated shadow. */
  readonly elevated = input<boolean>(false);
  /** Whether to show hover shadow effect. */
  readonly hoverable = input<boolean>(false);
  /** Whether to show header background. */
  readonly headerBg = input<boolean>(false);
  /** Whether the card has a header. */
  readonly hasHeader = input<boolean>(true);
  /** Whether the card has a footer. */
  readonly hasFooter = input<boolean>(true);
  /** How much room the card gives its content. */
  readonly density = input<TailwindCardDensity>('comfortable');

  protected readonly headerClasses = computed(() =>
    [
      'shrink-0 border-b border-border',
      DENSITY_PADDING[this.density()].header,
      this.headerBg() ? 'bg-surface-muted' : ''
    ]
      .filter(Boolean)
      .join(' ')
  );

  protected readonly bodyClasses = computed(() => `flex-1 min-h-0 ${DENSITY_PADDING[this.density()].body}`);

  protected readonly footerClasses = computed(
    () => `shrink-0 border-t border-border bg-surface-muted ${DENSITY_PADDING[this.density()].footer}`
  );
}
