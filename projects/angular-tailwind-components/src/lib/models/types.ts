/** Common types used across all components */

/** Size variants for components */
export type TailwindSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Built-in Tailwind CSS palette families (https://tailwindcss.com/docs/colors) */
export const TAILWIND_PALETTES = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose'
] as const;

/** Color input for colorable components — any Tailwind palette family */
export type TailwindPalette = (typeof TAILWIND_PALETTES)[number];

/** Button kinds */
export type TailwindButtonKind = 'solid' | 'flat' | 'outlined' | 'ghost' | 'text';

/** ARIA role for `TailwindButton` */
export type TailwindButtonRole = 'button' | 'menuitem' | 'tab' | 'switch' | 'checkbox' | 'radio';

/** Position variants for overlays */
export type TailwindPosition = 'top' | 'bottom' | 'left' | 'right';

/** Icon placement relative to button label */
export type TailwindIconPosition = 'left' | 'right';

/** Shape variants */
export type TailwindShape = 'rounded' | 'pill' | 'square';

/** Semantic heading level for `TailwindTitle` */
export type TailwindTitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/**
 * Pixel width and height for `TailwindIcon`. Intended range **16–64**; values outside it are clamped at runtime.
 */
export type TailwindIconSize = number;

/** Option interface for select/radio/checkbox groups */
export interface TailwindOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface TailwindOptionGroup<T = unknown> extends TailwindOption<T> {
  description?: string;
}

export interface TailwindMenuItem {
  label?: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  value?: string;
  items?: Exclude<TailwindMenuItem, 'items'>[];
}
