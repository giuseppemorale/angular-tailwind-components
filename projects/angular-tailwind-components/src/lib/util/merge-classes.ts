import { extendTailwindMerge } from 'tailwind-merge';

/*
 * Plain concatenation left both the base class and the consumer's on the element. With equal
 * specificity the winner is whichever Tailwind emits last, and within a utility group that order is
 * alphabetical by value: `bg-red-500` lost to `bg-surface` while `bg-teal-500` won.
 *
 * Colors need no entry here — tailwind-merge accepts any color name. Only the role-based theme keys
 * and the two box-shadow utilities are unknown to it.
 */
const twMerge = extendTailwindMerge({
  /*
   * tailwind-merge assumes `text-<size>` overrides `leading-*`. That was true in v3; in v4
   * `text-xs` resolves to `line-height: var(--tw-leading, …)` and `leading-none` sets
   * `--tw-leading`, so the leading utility wins whatever the order. Dropping it changed the
   * line-height of badge, chip and tag.
   */
  override: {
    conflictingClassGroups: {
      'font-size': []
    }
  },
  extend: {
    classGroups: {
      rounded: [{ rounded: ['control', 'control-inner', 'surface', 'surface-inner', 'overlay'] }],
      'rounded-t': [{ 'rounded-t': ['control', 'overlay'] }],
      animate: [{ animate: ['overlay-in', 'overlay-in-up', 'overlay-scale', 'overlay-fade', 'toast-in'] }],
      z: [{ z: ['popover'] }],
      // Both set `box-shadow`, so a consumer's `shadow-*` has to be able to clear them.
      shadow: ['field-depth', 'surface-highlight']
    }
  }
});

/** Concatena classi componente e classi passate dal consumer, risolvendo i conflitti Tailwind (vince il consumer). */
export function mergeClasses(...parts: (string | null | undefined)[]): string {
  return twMerge(parts.filter((p): p is string => !!p?.trim()).join(' '));
}
