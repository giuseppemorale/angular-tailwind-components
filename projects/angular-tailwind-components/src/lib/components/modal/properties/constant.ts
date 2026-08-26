import type { TailwindSize } from '../../../models';

/** Exit animation duration, kept in sync with the panel transition in the template. */
export const EXIT_ANIMATION_MS = 200;

/** Panel width per size, applied to the overlay pane the position strategy sizes and centres. */
export const SIZE_MAX_WIDTH: Record<TailwindSize, string> = {
  xs: '24rem',
  sm: '28rem',
  md: '32rem',
  lg: '42rem',
  xl: '56rem'
};
