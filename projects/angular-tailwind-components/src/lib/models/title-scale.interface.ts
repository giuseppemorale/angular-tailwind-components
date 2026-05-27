import type { TailwindTitleTag } from './types';

/** Typography and icon size for one heading level in `tailwind-title`. */
export interface TailwindTitleTagScale {
  /** Tailwind utility classes for the heading element (typography and text color). */
  classes: string;
  /** Pixel size passed to `tailwind-icon` when an icon is shown. */
  iconSize: number;
}

/** Per-tag scale used by `tailwind-title` and {@link TAILWIND_TITLE_SCALE}. */
export type TailwindTitleScale = Record<TailwindTitleTag, TailwindTitleTagScale>;

/** Default heading scale (library as-shipped typography). */
export const DEFAULT_TAILWIND_TITLE_SCALE: TailwindTitleScale = {
  h1: { classes: 'text-3xl font-bold tracking-tight text-neutral-900', iconSize: 32 },
  h2: { classes: 'text-2xl font-semibold tracking-tight text-neutral-900', iconSize: 24 },
  h3: { classes: 'text-xl font-semibold tracking-tight text-neutral-900', iconSize: 20 },
  h4: { classes: 'text-lg font-normal text-neutral-900', iconSize: 18 },
  h5: { classes: 'text-base font-normal text-neutral-900', iconSize: 16 },
  h6: { classes: 'text-sm font-normal text-neutral-800 uppercase tracking-wide', iconSize: 14 }
};

/**
 * Merges optional partial overrides onto {@link DEFAULT_TAILWIND_TITLE_SCALE}.
 * Used by {@link provideTailwindConfig} and when providing {@link TAILWIND_TITLE_SCALE} directly.
 */
export function resolveTailwindTitleScale(
  partial?: Partial<Record<TailwindTitleTag, Partial<TailwindTitleTagScale>>>
): TailwindTitleScale {
  if (!partial) {
    return DEFAULT_TAILWIND_TITLE_SCALE;
  }

  const scale = { ...DEFAULT_TAILWIND_TITLE_SCALE };
  for (const tag of Object.keys(partial) as TailwindTitleTag[]) {
    const override = partial[tag];
    if (override) {
      scale[tag] = { ...scale[tag], ...override };
    }
  }
  return scale;
}
