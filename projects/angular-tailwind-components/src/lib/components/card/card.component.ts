import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindCard extends TailwindComponent {
  private static readonly shellBase =
    'bg-white rounded-xl border border-neutral-200 overflow-visible transition-shadow duration-200 flex flex-col min-h-0';

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
}
