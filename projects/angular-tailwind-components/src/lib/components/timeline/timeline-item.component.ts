import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TailwindColor, TailwindHeroicon } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

/** Dot colour per semantic status. */
const DOT_COLOR: Record<TailwindColor, string> = {
  primary: 'bg-primary-600 text-on-primary-600',
  secondary: 'bg-neutral-200 text-neutral-700',
  success: 'bg-success-600 text-on-success-600',
  warning: 'bg-warning-500 text-on-warning-500',
  danger: 'bg-danger-600 text-on-danger-600',
  info: 'bg-info-600 text-on-info-600',
  transparent: 'bg-surface text-neutral-600 border border-border-strong'
};

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
