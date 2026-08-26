import type { ConnectedPosition } from '@angular/cdk/overlay';
import type { TailwindPosition } from '../../../models';

/** Gap between trigger and tooltip, matching the arrow overhang. */
export const OFFSET_PX = 8;

export const POSITIONS: Record<TailwindPosition, ConnectedPosition> = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -OFFSET_PX },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: OFFSET_PX },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -OFFSET_PX },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: OFFSET_PX }
};

/** Opposite side first, then the perpendicular ones: a tooltip flips before it slides sideways. */
export const FALLBACK_ORDER: Record<TailwindPosition, TailwindPosition[]> = {
  top: ['top', 'bottom', 'right', 'left'],
  bottom: ['bottom', 'top', 'right', 'left'],
  left: ['left', 'right', 'top', 'bottom'],
  right: ['right', 'left', 'top', 'bottom']
};

export const SHOW_DELAY_MS = 200;
export const HIDE_DELAY_MS = 150;
