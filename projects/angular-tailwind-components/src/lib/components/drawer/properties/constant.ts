import type { TailwindPosition } from '../../../models';

/** Exit animation duration, kept in sync with the panel transition. */
export const EXIT_ANIMATION_MS = 300;

/** Off-screen transform per edge, used for the enter and exit slide. */
export const HIDDEN_TRANSFORM: Record<TailwindPosition, string> = {
  right: 'translate-x-full',
  left: '-translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full'
};
