import type { ConnectedPosition } from '@angular/cdk/overlay';
import type { TailwindPosition } from '../../../models';

/** Gap between trigger and panel. */
export const OFFSET_PX = 8;

export const POSITIONS: Record<TailwindPosition, ConnectedPosition> = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -OFFSET_PX },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: OFFSET_PX },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -OFFSET_PX },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: OFFSET_PX }
};
