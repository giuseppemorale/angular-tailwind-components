/** Common types used across all components */

/** Size variants for components */
export type TailwindSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Color variants for buttons and interactive elements */
export type TailwindColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

/** Button kinds */
export type TailwindButtonKind = 'solid' | 'outlined' | 'ghost' | 'text';

/** Alert/feedback color variants */
export type TailwindSeverity = 'success' | 'warning' | 'danger' | 'info';

/** Position variants for overlays */
export type TailwindPosition = 'top' | 'bottom' | 'left' | 'right';

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
}
