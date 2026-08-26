/** Semantic color groups used by library components (maps to `--color-<name>-<shade>`). */
export type TailwindThemeSemantic = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Shade keys aligned with the library `@theme` tokens. */
export type TailwindThemeColorShade =
  '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

/** Explicit semantic palette shades (flat object form). */
export type TailwindThemeSemanticShades = Partial<Record<TailwindThemeColorShade, string>>;

/** Background `shades` plus optional foreground `on`, emitted as `--color-[on-]<semantic>-<shade>`. */
export type TailwindThemeSemanticPaletteObject = {
  shades: TailwindThemeSemanticShades;
  on?: TailwindThemeSemanticShades;
};

/**
 * Value of a semantic key in `COLORS`: a Tailwind palette name (`'indigo'`), a flat map of explicit
 * shades, or `{ shades, on? }` where `on` sets the foreground per shade.
 */
export type TailwindThemeSeverityColor = string | TailwindThemeSemanticPaletteObject | TailwindThemeSemanticShades;

/** How rounded the library looks: `sharp` 0px, `compact` 4px, `default` 8px, `round` 12px controls. */
export type TailwindRadiusPreset = 'sharp' | 'compact' | 'default' | 'round';

/** Explicit radius per role, in any CSS length unit; omitted roles keep the library default. */
export interface TailwindRadiusScale {
  /** Button, input, select, chip and every other interactive control. */
  control?: string;
  /** Card, table, alert and other in-page panels. */
  surface?: string;
  /** Menu, popover, modal, drawer and other floating panels. */
  overlay?: string;
}

/** Value accepted by {@link provideTailwindRadius}: a preset name or explicit per-role lengths. */
export type TailwindRadiusConfig = TailwindRadiusPreset | TailwindRadiusScale;

/** A config value passed directly, or through a factory when it needs `inject()`. */
export type TailwindConfigInput<T> = T | (() => T);
