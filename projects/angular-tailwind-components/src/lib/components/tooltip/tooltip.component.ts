import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TailwindPosition } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { ARROW_SPECS } from './properties/constant';

/** Tooltip surface; `TailwindTooltipDirective` owns placement and reports the resolved side. */
@Component({
  selector: 'tailwind-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTooltip extends TailwindComponent {
  /** Tooltip text */
  readonly text = input.required<string>();
  /** Side the tooltip is rendered on; set by the directive after the overlay resolves a position. */
  readonly position = input<TailwindPosition>('top');

  readonly isVisible = signal(false);

  readonly tooltipShellClasses = computed(() =>
    this.mergeClasses(
      // WCAG 1.4.13 requires hover-triggered content to stay reachable with the pointer,
      // so only the hidden state is click-through.
      'transition-opacity duration-150',
      this.isVisible() ? 'opacity-100' : 'opacity-0 pointer-events-none'
    )
  );

  readonly tooltipBodyClasses =
    'relative z-[1] text-xs font-medium text-white bg-neutral-900 rounded-control shadow-lg whitespace-nowrap px-3 py-1.5';

  readonly arrowSpec = computed(() => ARROW_SPECS[this.position()]);

  show(): void {
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }
}
