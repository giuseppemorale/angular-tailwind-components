import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

/**
 * Ordered sequence of events, rendered as an `<ol>` because the order carries meaning.
 * Connector line and dots are decorative and hidden from assistive technology.
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
