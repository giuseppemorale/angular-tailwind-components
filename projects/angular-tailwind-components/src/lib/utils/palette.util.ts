import { TailwindPalette } from '../models';

/** Default shade for filled accents (buttons, checked controls, progress fill). */
export const PALETTE_ACCENT_SHADE = 600;

/** Default shade for focus rings and lighter tints. */
export const PALETTE_FOCUS_SHADE = 500;

/** Default shade for soft/ghost hover backgrounds. */
export const PALETTE_SOFT_SHADE = 50;

/** Default shade for soft text on light backgrounds. */
export const PALETTE_SOFT_TEXT_SHADE = 700;

/** Darker shade for hover on filled surfaces. */
export const PALETTE_HOVER_SHADE = 700;

/** Darker shade for active on filled surfaces. */
export const PALETTE_ACTIVE_SHADE = 800;

export type TailwindPaletteShade =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

/** CSS variable reference for a palette shade, e.g. `var(--color-blue-600)`. */
export function paletteVar(palette: TailwindPalette, shade: TailwindPaletteShade): string {
  return `var(--color-${palette}-${shade})`;
}

/** Palettes that need dark foreground on mid shades (filled surfaces). */
const LIGHT_FOREGROUND_PALETTES: ReadonlySet<TailwindPalette> = new Set([
  'amber',
  'yellow',
  'lime',
  'cyan',
  'sky'
]);

/** Tailwind text class for icons/labels on a filled background at the given shade. */
export function contrastTextClass(palette: TailwindPalette, shade: TailwindPaletteShade = PALETTE_ACCENT_SHADE): string {
  if (shade <= 400 || LIGHT_FOREGROUND_PALETTES.has(palette)) {
    return 'text-neutral-900';
  }
  return 'text-white';
}

/** Inline style map for accent fill/border using CSS variables. */
export function accentStyleVars(
  palette: TailwindPalette,
  shade: TailwindPaletteShade = PALETTE_ACCENT_SHADE
): Record<string, string> {
  const v = paletteVar(palette, shade);
  return {
    '--tw-accent': v,
    '--tw-accent-border': v,
    '--tw-accent-bg': v
  };
}

/** Focus ring color variable for peer-focus / focus-visible. */
export function focusRingStyleVar(
  palette: TailwindPalette,
  shade: TailwindPaletteShade = PALETTE_FOCUS_SHADE
): Record<string, string> {
  return { '--tw-focus-ring': paletteVar(palette, shade) };
}

/** Soft feedback surface (alerts, messages) — complete class strings for Tailwind JIT. */
export function feedbackSurfaceClasses(palette: TailwindPalette): string {
  return `bg-${palette}-50 text-${palette}-800 border-${palette}-200`;
}

/** Soft badge/tag surface */
export function softBadgeClasses(palette: TailwindPalette): string {
  return `bg-${palette}-100 text-${palette}-700`;
}

/** Filled progress/meter bar */
export function filledBarClasses(palette: TailwindPalette, shade: TailwindPaletteShade = PALETTE_ACCENT_SHADE): string {
  return `bg-${palette}-${shade}`;
}

/** Text/icon accent */
export function textAccentClasses(palette: TailwindPalette, shade: TailwindPaletteShade = PALETTE_ACCENT_SHADE): string {
  return `text-${palette}-${shade}`;
}
