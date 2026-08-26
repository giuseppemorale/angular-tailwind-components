import type { ConnectedPosition } from '@angular/cdk/overlay';

/** Minimum panel width when the anchor is narrower. */
export const MIN_PANEL_WIDTH_PX = 192;

/** Below the anchor, aligned to its start or end edge. */
export const BELOW: Record<'left' | 'right', ConnectedPosition[]> = {
  left: [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }
  ],
  right: [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
  ]
};

/** Beside the anchor, for vertical rails such as the toolbar. */
export const BESIDE: ConnectedPosition[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
  { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' }
];
