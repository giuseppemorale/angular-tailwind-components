import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

/**
 * Ordered sequence of events — activity feeds, order tracking, audit trails.
 *
 * Rendered as an `<ol>`: the order carries meaning, so a screen reader should announce it as a
 * numbered list rather than as a stack of divs. The connector line and dots are decorative and
 * hidden from assistive technology.
 */
@Component({
  selector: 'tailwind-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTimeline extends TailwindComponent {
  /** Accessible name for the sequence. */
  readonly ariaLabel = input<string>('');

  readonly listClasses = computed(() => this.mergeClasses('relative flex flex-col'));
}
