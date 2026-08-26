import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TailwindColor, TailwindHeroicon } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';
import { DOT_COLOR } from './properties/constant';

/** One event in a `tailwind-timeline`. */
@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTimelineItem extends TailwindComponent {
  /** Headline of the event. */
  readonly title = input<string>('');
  /** When it happened, rendered muted beside the title. */
  readonly time = input<string>('');
  /** Status colour of the marker. */
  readonly color = input<TailwindColor>('primary');
  /** Icon inside the marker; a plain dot is drawn when omitted. */
  readonly icon = input<TailwindHeroicon | undefined>(undefined);
  /** Hides the connector below the marker — set it on the last item. */
  readonly last = input<boolean>(false);

  readonly dotClasses = computed(() =>
    ['flex size-7 shrink-0 items-center justify-center rounded-full', DOT_COLOR[this.color()]].join(' ')
  );
}
