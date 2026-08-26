import { TailwindColor, TailwindSize, TailwindVariantKind } from '../models';

/**
 * Shared visual scales.
 *
 * These maps used to be duplicated inside each component's `computed`, which let them drift apart
 * (same `size` rendering differently on input vs select) and rebuilt the objects on every change
 * detection pass. Keep new components pointing at these constants instead of inlining a scale.
 *
 * Two rules hold the system together:
 *
 * 1. **Height is explicit, not emergent.** The scales below pin `h-*` instead of letting the height
 *    fall out of `py-*` plus whatever line-height the text happens to have. Without it a button and
 *    an input of the same `size` sitting on the same row drift apart by a pixel or two as soon as
 *    an icon, a different font or a native control enters the picture — the single detail
 *    developers notice first and blame the library for.
 * 2. **Radius is a role, not a size.** Every control gets `rounded-control` whatever its `size`, so
 *    a `sm` and an `xl` button are recognisably the same family. The token behind it is remapped
 *    app-wide by `provideTailwindRadius()`.
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

/**
 * Text size, horizontal padding and radius for text-like form controls that can grow vertically
 * (textarea, editor). Single-line fields use {@link FIELD_SIZE}, which pins a height instead.
 */
export const FIELD_PADDING: Readonly<Record<TailwindSize, string>> = {
  xs: 'text-xs px-2 py-1 rounded-control',
  sm: 'text-sm px-2.5 py-1.5 rounded-control',
  md: 'text-sm px-3 py-2 rounded-control',
  lg: 'text-base px-3.5 py-2.5 rounded-control',
  xl: 'text-base px-4 py-3 rounded-control'
};

/**
 * Text size, padding, height and radius for single-line form controls
 * (input, select, autocomplete, number-input, date/time pickers).
 *
 * There is deliberately no `py-*`: the height is fixed and both native inputs and the flex-based
 * triggers centre their content, so vertical padding could only fight with it.
 */
export const FIELD_SIZE: Readonly<Record<TailwindSize, string>> = {
  xs: `text-xs px-2 ${CONTROL_HEIGHT.xs} rounded-control`,
  sm: `text-sm px-2.5 ${CONTROL_HEIGHT.sm} rounded-control`,
  md: `text-sm px-3 ${CONTROL_HEIGHT.md} rounded-control`,
  lg: `text-base px-3.5 ${CONTROL_HEIGHT.lg} rounded-control`,
  xl: `text-base px-4 ${CONTROL_HEIGHT.xl} rounded-control`
};

/** Padding, text size, height and radius for pressable controls (button and button-like triggers). */
export const CONTROL_SIZE: Readonly<Record<TailwindSize, string>> = {
  xs: `text-xs px-2 ${CONTROL_HEIGHT.xs} rounded-control`,
  sm: `text-sm px-3 ${CONTROL_HEIGHT.sm} rounded-control`,
  md: `text-sm px-4 ${CONTROL_HEIGHT.md} rounded-control`,
  lg: `text-base px-5 ${CONTROL_HEIGHT.lg} rounded-control`,
  xl: `text-base px-6 ${CONTROL_HEIGHT.xl} rounded-control`
};

/**
 * Icon pixel size paired with each control size.
 *
 * The values are deliberately flat at the small end. `tailwind-icon` clamps to 16–64, so the 14 this
 * map used to hand out for `xs` was silently rendered at 16 anyway; and the library ships Heroicons
 * *outline* only, whose 1.5px stroke thins out and goes muddy below that. `md` therefore shares
 * `sm`'s 16px — the two already share `text-sm`, and 18px overpowered a 14px label.
 *
 * `xl` uses 24, the size Heroicons is drawn at, where the strokes land on whole pixels.
 */
export const ICON_PIXEL_SIZE: Readonly<Record<TailwindSize, number>> = {
  xs: 16,
  sm: 16,
  md: 16,
  lg: 20,
  xl: 24
};

/**
 * Focus ring for controls that should only reveal it for keyboard users.
 * Text fields deliberately use {@link FIELD_FOCUS_RING} instead, since a visible ring on click is
 * the expected behaviour there.
 *
 * Both draw the ring in `--color-ring` (a single token, defaulting to `primary-500`) rather than in
 * each control's own color: one focus color across the library is easier to recognise, and an app
 * retheming its brand has exactly one variable to set.
 */
export const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

/**
 * Focus ring geometry for text fields, shown on any focus. Deliberately colorless: the state class
 * ({@link FIELD_STATE} / {@link FIELD_STATE_INVALID}) supplies `focus:outline-*`, so a valid and an
 * invalid field never emit two competing outline colors on the same element.
 */
export const FIELD_FOCUS_RING = 'outline-none focus:outline focus:outline-2 focus:outline-offset-2';

/** Border, surface and focus colors for a text field in its normal state. */
export const FIELD_STATE = 'border-border-strong text-fg focus:border-ring focus:outline-ring';

/** Border, surface and focus colors for a text field in the invalid state. */
export const FIELD_STATE_INVALID = 'border-danger-400 text-danger-900 focus:border-danger-500 focus:outline-danger-500';

/**
 * Motion for state changes. Kept to three durations across the whole library so nothing looks
 * out of step: colors and borders are the fastest, transforms and shadows a touch slower,
 * panels entering or leaving the slowest.
 */
export const TRANSITION_COLORS = 'transition-colors duration-150 ease-in-out';

/**
 * Colors plus the properties that move: for controls that also lift, press or tint on hover.
 * `transform` is in the list so {@link PRESS_FEEDBACK} eases instead of snapping — the `press`
 * utility deliberately declares no `transition-property` of its own, which would collide with this.
 */
export const TRANSITION_CONTROL =
  'transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-in-out';

/** Scale-down feedback on press. Backed by the `press` utility in `styles/tailwind.css`. */
export const PRESS_FEEDBACK = 'press';

/**
 * Disabled treatment.
 *
 * Two rules, applied consistently: a **pressable** fades out (it is the same object, temporarily
 * unavailable), a **field** goes to a muted surface (it is a container that currently accepts
 * nothing). Mixing the two was the reason a disabled button and a disabled input next to each other
 * used to look like they came from different libraries.
 */
export const DISABLED_PRESSABLE = 'disabled:cursor-not-allowed disabled:opacity-50';

/** Disabled treatment for text fields and other input surfaces. */
export const DISABLED_FIELD = 'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted';

/**
 * Base shell shared by every text-like field: surface, border, inset depth, motion, focus and
 * disabled treatment. Deliberately carries no `display`, so a native `<input>` can add `block`
 * while a composite trigger (select, autocomplete) adds `flex items-center`.
 */
export const FIELD_BASE = `w-full bg-surface border field-depth ${TRANSITION_CONTROL} placeholder:text-neutral-400 ${FIELD_FOCUS_RING} ${DISABLED_FIELD}`;

/**
 * Static semantic surfaces, shared by the label-like components (badge, chip, tag, alert).
 *
 * Fill and border are kept in separate maps on purpose. A component that needs the border in a
 * different place from the fill — the alert, whose `bordered` mode turns the border into a left
 * accent stripe — can then take one without the other, instead of two `border-*` utilities landing
 * on the same element and being resolved by whichever Tailwind happened to emit last.
 *
 * None of these include hover states: these surfaces label things, they are not pressable.
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
 * Full surface for a `kind` / `color` pair: fill plus the matching border color.
 * Pair it with a plain `border` on the element so the three kinds keep identical metrics —
 * without it, switching `kind` would resize the element by two pixels.
 */
export function semanticSurface(kind: TailwindVariantKind, color: TailwindColor): string {
  const border = kind === 'outlined' || color === 'transparent' ? SEMANTIC_BORDER[color] : 'border-transparent';
  return `${semanticFill(kind, color)} ${border}`;
}
