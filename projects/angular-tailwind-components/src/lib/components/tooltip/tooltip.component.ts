import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TailwindPosition } from '../../models';
import { TailwindComponent } from '../tailwind.component';

/** Arrow geometry per side the tooltip sits on, relative to its trigger. */
const ARROW_SPECS: Record<
  TailwindPosition,
  { className: string; viewBox: string; width: number; height: number; path: string }
> = {
  top: {
    className: 'tooltip-arrow tooltip-arrow-down',
    viewBox: '0 0 12 7',
    width: 12,
    height: 7,
    path: 'M0 0 H12 L6 7 Z'
  },
  bottom: {
    className: 'tooltip-arrow tooltip-arrow-up',
    viewBox: '0 0 12 7',
    width: 12,
    height: 7,
    path: 'M0 7 H12 L6 0 Z'
  },
  left: {
    className: 'tooltip-arrow tooltip-arrow-right',
    viewBox: '0 0 7 12',
    width: 7,
    height: 12,
    path: 'M0 0 V12 L7 6 Z'
  },
  right: {
    className: 'tooltip-arrow tooltip-arrow-left',
    viewBox: '0 0 7 12',
    width: 7,
    height: 12,
    path: 'M7 0 V12 L0 6 Z'
  }
};

/**
 * Tooltip surface. Purely presentational: `TailwindTooltipDirective` owns placement through the CDK
 * overlay, and tells this component which side it ended up on so the arrow points the right way.
 */
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
