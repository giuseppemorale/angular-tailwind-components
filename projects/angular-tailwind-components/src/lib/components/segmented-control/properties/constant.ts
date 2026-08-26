import type { TailwindSize } from '../../../models';

/** Padding and text size per control size. */
export const SEGMENT_SIZE: Record<TailwindSize, string> = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
  xl: 'text-base px-5 py-2.5'
};
