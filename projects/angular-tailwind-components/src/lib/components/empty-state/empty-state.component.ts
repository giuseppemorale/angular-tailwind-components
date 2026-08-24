import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TailwindHeroicon } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

/**
 * The "nothing here yet" panel: an icon, a headline, an explanation and room for a call to action.
 *
 * It exists so every empty list in an app does not reinvent its own centred `<div>` — the spacing,
 * the muted colours and the heading level stay consistent, and the icon is correctly hidden from
 * assistive technology instead of being read out as decoration.
 */
@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindEmptyState extends TailwindComponent {
  /** Headline. */
  readonly title = input<string>('');
  /** Supporting sentence under the headline. */
  readonly description = input<string>('');
  /** Decorative icon shown above the headline. */
  readonly icon = input<TailwindHeroicon | undefined>('inbox');
  /** Heading level, so the state slots into the surrounding document outline. */
  readonly headingLevel = input<2 | 3 | 4 | 5 | 6>(3);
  /** Reduces vertical padding, for empty states inside a card or a table. */
  readonly compact = input<boolean>(false);

  readonly containerClasses = computed(() =>
    this.mergeClasses(
      'flex flex-col items-center justify-center text-center',
      this.compact() ? 'gap-2 px-4 py-8' : 'gap-3 px-6 py-16'
    )
  );
}
