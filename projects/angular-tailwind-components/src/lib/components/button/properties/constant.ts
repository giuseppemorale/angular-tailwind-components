import type { TailwindButtonKind, TailwindColor, TailwindSize } from '../../../models';
import {
  CONTROL_SQUARE,
  DISABLED_PRESSABLE,
  FOCUS_RING,
  PRESS_FEEDBACK,
  TRANSITION_CONTROL
} from '../../../util/variants';

/** Always transparent background; no tint on hover, focus, or active. */
const TRANSPARENT =
  'bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent border-transparent text-neutral-600';

/** Structural classes shared by every kind and color. */
export const BASE = [
  'inline-flex items-center justify-center',
  'font-medium',
  TRANSITION_CONTROL,
  PRESS_FEEDBACK,
  FOCUS_RING,
  DISABLED_PRESSABLE,
  'cursor-pointer',
  'border'
];

/** Filled surfaces; `surface-highlight` gives the fill body without a drop shadow. */
const SOLID: Record<TailwindColor, string> = {
  primary:
    'bg-primary-600 text-on-primary-600 hover:bg-primary-700 hover:text-on-primary-700 active:bg-primary-800 active:text-on-primary-800 border-transparent surface-highlight',
  secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 border-border-strong',
  danger:
    'bg-danger-600 text-on-danger-600 hover:bg-danger-700 hover:text-on-danger-700 active:bg-danger-800 active:text-on-danger-800 border-transparent surface-highlight',
  success:
    'bg-success-700 text-on-success-700 hover:bg-success-800 hover:text-on-success-800 active:bg-success-900 active:text-on-success-900 border-transparent surface-highlight',
  warning:
    'bg-warning-500 text-on-warning-500 hover:bg-warning-600 hover:text-on-warning-600 active:bg-warning-700 active:text-on-warning-700 border-transparent surface-highlight',
  info: 'bg-info-600 text-on-info-600 hover:bg-info-700 hover:text-on-info-700 active:bg-info-800 active:text-on-info-800 border-transparent surface-highlight',
  transparent: TRANSPARENT
};

/** Tinted surface: a light wash of the color behind text of the same hue. */
const SOFT: Record<TailwindColor, string> = {
  primary: 'bg-primary-50 text-primary-700 border-transparent hover:bg-primary-100 active:bg-primary-200',
  secondary: 'bg-neutral-100 text-neutral-700 border-transparent hover:bg-neutral-200 active:bg-neutral-300',
  danger: 'bg-danger-50 text-danger-700 border-transparent hover:bg-danger-100 active:bg-danger-200',
  success: 'bg-success-50 text-success-800 border-transparent hover:bg-success-100 active:bg-success-200',
  warning: 'bg-warning-50 text-warning-800 border-transparent hover:bg-warning-100 active:bg-warning-200',
  info: 'bg-info-50 text-info-800 border-transparent hover:bg-info-100 active:bg-info-200',
  transparent: TRANSPARENT
};

/** Filled like `solid`, without the top highlight, border, or hover/active tint. */
const FLAT: Record<TailwindColor, string> = {
  primary: 'bg-primary-600 text-on-primary-600 border-transparent',
  secondary: 'bg-neutral-100 text-neutral-800 border-transparent',
  danger: 'bg-danger-600 text-on-danger-600 border-transparent',
  success: 'bg-success-700 text-on-success-700 border-transparent',
  warning: 'bg-warning-500 text-on-warning-500 border-transparent',
  info: 'bg-info-600 text-on-info-600 border-transparent',
  transparent: TRANSPARENT
};

const OUTLINED: Record<TailwindColor, string> = {
  primary: 'bg-transparent text-primary-600 border-primary-600 hover:bg-primary-50 active:bg-primary-100',
  secondary: 'bg-transparent text-neutral-700 border-border-strong hover:bg-neutral-50 active:bg-neutral-100',
  danger: 'bg-transparent text-danger-800 border-danger-700 hover:bg-danger-50 active:bg-danger-100',
  success: 'bg-transparent text-success-800 border-success-700 hover:bg-success-50 active:bg-success-100',
  warning: 'bg-transparent text-warning-800 border-warning-700 hover:bg-warning-50 active:bg-warning-100',
  info: 'bg-transparent text-info-800 border-info-700 hover:bg-info-50 active:bg-info-100',
  transparent: TRANSPARENT
};

/** Transparent with a hover/active background tint. */
const GHOST: Record<TailwindColor, string> = {
  primary: 'bg-transparent text-primary-600 border-transparent hover:bg-primary-50 active:bg-primary-100',
  secondary: 'bg-transparent text-neutral-700 border-transparent hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-transparent text-danger-800 border-transparent hover:bg-danger-50 active:bg-danger-100',
  success: 'bg-transparent text-success-800 border-transparent hover:bg-success-50 active:bg-success-100',
  warning: 'bg-transparent text-warning-800 border-transparent hover:bg-warning-50 active:bg-warning-100',
  info: 'bg-transparent text-info-800 border-transparent hover:bg-info-50 active:bg-info-100',
  transparent: TRANSPARENT
};

/** Semantic text color only; the background stays transparent on hover/active. */
const TEXT: Record<TailwindColor, string> = {
  primary: 'bg-transparent text-primary-600 border-transparent',
  secondary: 'bg-transparent text-neutral-700 border-transparent',
  danger: 'bg-transparent text-danger-800 border-transparent',
  success: 'bg-transparent text-success-800 border-transparent',
  warning: 'bg-transparent text-warning-800 border-transparent',
  info: 'bg-transparent text-info-800 border-transparent',
  transparent: TRANSPARENT
};

export const STYLE: Record<TailwindButtonKind, Record<TailwindColor, string>> = {
  solid: SOLID,
  soft: SOFT,
  flat: FLAT,
  outlined: OUTLINED,
  ghost: GHOST,
  text: TEXT
};

/**
 * Square footprint when `icon` is set and the projected label is empty.
 * The height already comes from `CONTROL_SIZE`; only width and horizontal padding need correcting.
 */
export const ICON_ONLY_SIZE: Record<TailwindSize, string> = {
  xs: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.xs}`,
  sm: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.sm}`,
  md: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.md}`,
  lg: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.lg}`,
  xl: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.xl}`
};
