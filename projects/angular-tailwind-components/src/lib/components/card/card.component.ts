import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

/** How much room the card gives its content. */
export type TailwindCardDensity = 'comfortable' | 'compact';

/** Padding per slot and density. `comfortable` reproduces the card's previous fixed spacing. */
const DENSITY_PADDING: Record<TailwindCardDensity, { header: string; body: string; footer: string }> = {
  comfortable: { header: 'px-6 pt-4 pb-3', body: 'p-6', footer: 'px-6 py-4' },
  compact: { header: 'px-4 pt-3 pb-2', body: 'p-4', footer: 'px-4 py-3' }
};

@Component({
  selector: 'tailwind-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindCard extends TailwindComponent {
  private static readonly shellBase =
    'bg-surface rounded-surface border border-border overflow-visible transition-shadow duration-200 ease-in-out flex flex-col min-h-0';

  readonly shellClasses = computed(() => {
    const shadow = this.elevated()
      ? this.hoverable()
        ? 'shadow-lg hover:shadow-xl'
        : 'shadow-lg'
      : this.hoverable()
        ? 'shadow-sm hover:shadow-md'
        : 'shadow-sm';

    return this.mergeClasses(TailwindCard.shellBase, shadow);
  });

  /** Whether the card has elevated shadow */
  readonly elevated = input<boolean>(false);
  /** Whether to show hover shadow effect */
  readonly hoverable = input<boolean>(false);
  /** Whether to show header background */
  readonly headerBg = input<boolean>(false);
  /** Whether the card has a header */
  readonly hasHeader = input<boolean>(true);
  /** Whether the card has a footer */
  readonly hasFooter = input<boolean>(true);
  /**
   * How much room the card gives its content.
   *
   * `comfortable` (24px) is right for a page with a handful of cards; `compact` (16px) is for
   * dashboards, where the same padding repeated across a dozen tiles costs more screen than the
   * content it frames.
   */
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
