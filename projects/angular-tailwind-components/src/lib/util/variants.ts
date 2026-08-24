import { TailwindSize } from '../models';

/**
 * Shared visual scales.
 *
 * These maps used to be duplicated inside each component's `computed`, which let them drift apart
 * (same `size` rendering differently on input vs select) and rebuilt the objects on every change
 * detection pass. Keep new components pointing at these constants instead of inlining a scale.
 */

/** Padding, text size and radius for text-like form controls (input, textarea, select, autocomplete). */
export const FIELD_SIZE: Readonly<Record<TailwindSize, string>> = {
  xs: 'text-xs px-2 py-1 rounded-sm',
  sm: 'text-sm px-2.5 py-1.5 rounded-md',
  md: 'text-sm px-3 py-2 rounded-md',
  lg: 'text-base px-3.5 py-2.5 rounded-lg',
  xl: 'text-base px-4 py-3 rounded-lg'
};

/** Padding, text size and radius for pressable controls (button and button-like triggers). */
export const CONTROL_SIZE: Readonly<Record<TailwindSize, string>> = {
  xs: 'text-xs px-2 py-1 rounded-sm',
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-sm px-4 py-2 rounded-md',
  lg: 'text-base px-5 py-2.5 rounded-lg',
  xl: 'text-base px-6 py-3 rounded-lg'
};

/** Icon pixel size paired with each control size. */
export const ICON_PIXEL_SIZE: Readonly<Record<TailwindSize, number>> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22
};

/**
 * Focus ring for controls that should only reveal it for keyboard users.
 * Text fields deliberately use {@link FIELD_FOCUS_RING} instead, since a visible ring on click is
 * the expected behaviour there.
 */
export const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2';

/** Focus ring for text fields, shown on any focus. */
export const FIELD_FOCUS_RING = 'outline-none focus:outline focus:outline-2 focus:outline-offset-2';
