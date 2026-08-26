import type { TailwindPosition } from '../../../models';
import type { TooltipArrowSpec } from '../interfaces/tooltip-arrow-spec.interface';

/** Arrow geometry per side the tooltip sits on, relative to its trigger. */
export const ARROW_SPECS: Record<TailwindPosition, TooltipArrowSpec> = {
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
