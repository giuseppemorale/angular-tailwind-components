import { TailwindButtonKind, TailwindPalette } from '../models';
import {
  contrastTextClass,
  PALETTE_ACCENT_SHADE,
  PALETTE_ACTIVE_SHADE,
  PALETTE_FOCUS_SHADE,
  PALETTE_HOVER_SHADE,
  PALETTE_SOFT_SHADE,
  PALETTE_SOFT_TEXT_SHADE,
  paletteVar
} from './palette.util';

/** CSS custom properties for {@link TailwindButton} surface styles. */
export function buttonPaletteStyleVars(palette: TailwindPalette): Record<string, string> {
  if (palette === 'neutral') {
    return {
      '--tw-btn-bg': paletteVar('neutral', 100),
      '--tw-btn-bg-hover': paletteVar('neutral', 200),
      '--tw-btn-bg-active': paletteVar('neutral', 300),
      '--tw-btn-fg': paletteVar('neutral', 800),
      '--tw-btn-border': paletteVar('neutral', 300),
      '--tw-btn-outline': paletteVar('neutral', 500),
      '--tw-btn-soft-bg': paletteVar('neutral', 50),
      '--tw-btn-soft-bg-active': paletteVar('neutral', 100),
      '--tw-btn-accent-fg': paletteVar('neutral', 700),
      '--tw-btn-accent-border': paletteVar('neutral', 600)
    };
  }

  const accent = PALETTE_ACCENT_SHADE;
  const hover = PALETTE_HOVER_SHADE;
  const active = PALETTE_ACTIVE_SHADE;
  const soft = PALETTE_SOFT_SHADE;
  const softText = PALETTE_SOFT_TEXT_SHADE;

  return {
    '--tw-btn-bg': paletteVar(palette, accent),
    '--tw-btn-bg-hover': paletteVar(palette, hover),
    '--tw-btn-bg-active': paletteVar(palette, active),
    '--tw-btn-fg': contrastTextClass(palette, accent) === 'text-white' ? '#ffffff' : paletteVar('neutral', 900),
    '--tw-btn-border': paletteVar(palette, accent),
    '--tw-btn-outline': paletteVar(palette, PALETTE_FOCUS_SHADE),
    '--tw-btn-soft-bg': paletteVar(palette, soft),
    '--tw-btn-soft-bg-active': paletteVar(palette, 100),
    '--tw-btn-accent-fg': paletteVar(palette, softText),
    '--tw-btn-accent-border': paletteVar(palette, hover)
  };
}

const BASE =
  'inline-flex items-center justify-center font-medium transition-all duration-150 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer border';

const KIND_CLASS: Record<TailwindButtonKind, string> = {
  solid: 'tw-btn-solid border-transparent shadow-sm focus-visible:outline-[color:var(--tw-btn-outline)]',
  flat: 'tw-btn-solid border-0 shadow-none focus-visible:outline-[color:var(--tw-btn-outline)]',
  outlined:
    'tw-btn-outlined bg-transparent focus-visible:outline-[color:var(--tw-btn-outline)]',
  ghost: 'tw-btn-ghost bg-transparent border-transparent focus-visible:outline-[color:var(--tw-btn-outline)]',
  text: 'tw-btn-text bg-transparent border-transparent focus-visible:outline-[color:var(--tw-btn-outline)]'
};

export function buttonKindClasses(kind: TailwindButtonKind): string {
  return `${BASE} ${KIND_CLASS[kind]}`;
}
