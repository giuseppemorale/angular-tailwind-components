import { TailwindColor, TailwindSize, TailwindVariantKind } from '../models';

/**
 * Shared visual scales. Point new components at these constants instead of inlining a scale.
 *
 * Two rules hold the system together: height is pinned explicitly (`h-*`) so controls of the same
 * `size` align on a row, and radius is a role (`rounded-control`) rather than a size, so
 * `provideTailwindRadius()` can remap the whole library at once.
 */

/** Explicit control heights. Shared by fields and pressables so both align on the same row. */
export const CONTROL_HEIGHT: Readonly<Record<TailwindSize, string>> = {
  xs: 'h-6',
  sm: 'h-8',
  md: 'h-9',
  lg: 'h-11',
  xl: 'h-13'
};

/** Square footprint for icon-only controls, paired 1:1 with {@link CONTROL_HEIGHT}. */
export const CONTROL_SQUARE: Readonly<Record<TailwindSize, string>> = {
  xs: 'w-6',
  sm: 'w-8',
  md: 'w-9',
  lg: 'w-11',
  xl: 'w-13'
};

/** Text size, padding and radius for fields that grow vertically (textarea, editor). */
export const FIELD_PADDING: Readonly<Record<TailwindSize, string>> = {
  xs: 'text-xs px-2 py-1 rounded-control',
  sm: 'text-sm px-2.5 py-1.5 rounded-control',
  md: 'text-sm px-3 py-2 rounded-control',
  lg: 'text-base px-3.5 py-2.5 rounded-control',
  xl: 'text-base px-4 py-3 rounded-control'
};

/**
 * Text size, padding, height and radius for single-line form controls. No `py-*`: the height is
 * fixed and the content is centred, so vertical padding could only fight it.
 */
export const FIELD_SIZE: Readonly<Record<TailwindSize, string>> = {
  xs: `text-xs px-2 ${CONTROL_HEIGHT.xs} rounded-control`,
  sm: `text-sm px-2.5 ${CONTROL_HEIGHT.sm} rounded-control`,
  md: `text-sm px-3 ${CONTROL_HEIGHT.md} rounded-control`,
  lg: `text-base px-3.5 ${CONTROL_HEIGHT.lg} rounded-control`,
  xl: `text-base px-4 ${CONTROL_HEIGHT.xl} rounded-control`
};

/** Padding, text size, height and radius for pressable controls. */
export const CONTROL_SIZE: Readonly<Record<TailwindSize, string>> = {
  xs: `text-xs px-2 ${CONTROL_HEIGHT.xs} rounded-control`,
  sm: `text-sm px-3 ${CONTROL_HEIGHT.sm} rounded-control`,
  md: `text-sm px-4 ${CONTROL_HEIGHT.md} rounded-control`,
  lg: `text-base px-5 ${CONTROL_HEIGHT.lg} rounded-control`,
  xl: `text-base px-6 ${CONTROL_HEIGHT.xl} rounded-control`
};

/** Icon pixel size per control size; flat at the small end, where `tailwind-icon` clamps to 16. */
export const ICON_PIXEL_SIZE: Readonly<Record<TailwindSize, number>> = {
  xs: 16,
  sm: 16,
  md: 16,
  lg: 20,
  xl: 24
};

/** Focus ring for controls that reveal it only for keyboard users; text fields use {@link FIELD_FOCUS_RING}. */
export const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

/** Focus ring geometry for text fields; colorless, since the state class supplies `focus:outline-*`. */
export const FIELD_FOCUS_RING = 'outline-none focus:outline focus:outline-2 focus:outline-offset-2';

/** Border, surface and focus colors for a text field in its normal state. */
export const FIELD_STATE = 'border-border-strong text-fg focus:border-ring focus:outline-ring';

/** Border, surface and focus colors for a text field in the invalid state. */
export const FIELD_STATE_INVALID = 'border-danger-400 text-danger-900 focus:border-danger-500 focus:outline-danger-500';

/** Motion for color and border changes — the fastest of the library's three durations. */
export const TRANSITION_COLORS = 'transition-colors duration-150 ease-in-out';

/** Colors plus the properties that move; `transform` is listed so {@link PRESS_FEEDBACK} eases. */
export const TRANSITION_CONTROL =
  'transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-in-out';

/** Scale-down feedback on press. Backed by the `press` utility in `styles/tailwind.css`. */
export const PRESS_FEEDBACK = 'press';

/** Disabled treatment for pressables: the object fades out. */
export const DISABLED_PRESSABLE = 'disabled:cursor-not-allowed disabled:opacity-50';

/** Disabled treatment for fields: the surface goes muted. */
export const DISABLED_FIELD = 'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted';

/**
 * Base shell shared by every text-like field. Carries no `display`, so a native `<input>` can add
 * `block` while a composite trigger adds `flex items-center`.
 */
export const FIELD_BASE = `w-full bg-surface border field-depth ${TRANSITION_CONTROL} placeholder:text-neutral-400 ${FIELD_FOCUS_RING} ${DISABLED_FIELD}`;

/**
 * Static semantic surfaces for the label-like components (badge, chip, tag, alert).
 * Fill and border stay in separate maps so a component can take one without the other.
 */
export const SOLID_FILL: Readonly<Record<TailwindColor, string>> = {
  primary: 'bg-primary-600 text-on-primary-600',
  secondary: 'bg-neutral-600 text-on-neutral-600',
  success: 'bg-success-700 text-on-success-700',
  warning: 'bg-warning-500 text-on-warning-500',
  danger: 'bg-danger-600 text-on-danger-600',
  info: 'bg-info-600 text-on-info-600',
  transparent: 'bg-transparent text-neutral-700'
};

/** Tinted fill: a light wash of the color behind text of the same hue. */
export const SOFT_FILL: Readonly<Record<TailwindColor, string>> = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-neutral-100 text-neutral-700',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-800',
  danger: 'bg-danger-100 text-danger-700',
  info: 'bg-info-100 text-info-800',
  transparent: 'bg-transparent text-neutral-700'
};

/** No fill; the color is carried by the text (and, with {@link SEMANTIC_BORDER}, the edge). */
export const OUTLINED_FILL: Readonly<Record<TailwindColor, string>> = {
  primary: 'bg-transparent text-primary-700',
  secondary: 'bg-transparent text-neutral-700',
  success: 'bg-transparent text-success-800',
  warning: 'bg-transparent text-warning-800',
  danger: 'bg-transparent text-danger-700',
  info: 'bg-transparent text-info-800',
  transparent: 'bg-transparent text-neutral-700'
};

/** Border color for a semantic edge — an outlined surface, or the alert's left accent stripe. */
export const SEMANTIC_BORDER: Readonly<Record<TailwindColor, string>> = {
  primary: 'border-primary-300',
  secondary: 'border-border-strong',
  success: 'border-success-300',
  warning: 'border-warning-300',
  danger: 'border-danger-300',
  info: 'border-info-300',
  transparent: 'border-border-strong'
};

/** Background and text for a `kind` / `color` pair, without any border color. */
export function semanticFill(kind: TailwindVariantKind, color: TailwindColor): string {
  const map = kind === 'solid' ? SOLID_FILL : kind === 'outlined' ? OUTLINED_FILL : SOFT_FILL;
  return map[color];
}

/**
 * Full surface for a `kind` / `color` pair: fill plus matching border color.
 * Pair it with a plain `border` on the element so all three kinds keep identical metrics.
 */
export function semanticSurface(kind: TailwindVariantKind, color: TailwindColor): string {
  const border = kind === 'outlined' || color === 'transparent' ? SEMANTIC_BORDER[color] : 'border-transparent';
  return `${semanticFill(kind, color)} ${border}`;
}
