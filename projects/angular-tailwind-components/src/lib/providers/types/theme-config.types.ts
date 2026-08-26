/** Semantic color groups used by library components (maps to `--color-<name>-<shade>`). */
export type TailwindThemeSemantic = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Shade keys aligned with Tailwind default scales and this library’s `@theme` tokens. */
export type TailwindThemeColorShade =
  '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

/** Explicit semantic palette shades only (legacy flat object form for `provideTailwindConfig` colors). */
export type TailwindThemeSemanticShades = Partial<Record<TailwindThemeColorShade, string>>;

/**
 * Structured palette: background `shades` plus optional foreground `on` per shade.
 * Emitted as `--color-<semantic>-<shade>` and `--color-on-<semantic>-<shade>`.
 */
export type TailwindThemeSemanticPaletteObject = {
  shades: TailwindThemeSemanticShades;
  on?: TailwindThemeSemanticShades;
};

/**
 * Values for each semantic key in {@link TailwindDefineThemeConfig} `COLORS` (exported type name).
 *
 * - **String:** Tailwind palette family name (lowercase), e.g. `'indigo'` for utilities like `bg-indigo-600`.
 *   See the [Tailwind color reference](https://tailwindcss.com/docs/colors) for all built-in names and previews.
 *   Each semantic shade is mapped to `var(--color-<name>-<shade>)`.
 * - **Flat object:** `Partial<Record<shade, string>>` — explicit CSS colors per shade (`'50'` … `'950'`); same as `{ shades: { … } }`.
 * - **Structured object:** `{ shades, on? }` — optional `on` defines foreground (contrast) per shade; written as `--color-on-<semantic>-<shade>`.
 */
export type TailwindThemeSeverityColor = string | TailwindThemeSemanticPaletteObject | TailwindThemeSemanticShades;

/**
 * How rounded the whole library looks, in one word.
 *
 * Radius is the single token that changes a design system's personality the most, so it is exposed
 * as a preset instead of forcing an app to override three variables by hand:
 *
 * - `sharp` — square corners; technical, dense, "terminal" products.
 * - `compact` — 4px controls; the classic enterprise look.
 * - `default` — 8px controls; the library default.
 * - `round` — 12px controls; friendly, consumer-facing products.
 */
export type TailwindRadiusPreset = 'sharp' | 'compact' | 'default' | 'round';

/**
 * Explicit radius values, in any CSS length unit, for apps that need something between the presets.
 * Omitted roles keep the preset (or library default) value.
 *
 * - `control` — button, input, select, chip and every other interactive control.
 * - `surface` — card, table, alert and other in-page panels.
 * - `overlay` — menu, popover, modal, drawer and other floating panels.
 */
export interface TailwindRadiusScale {
  control?: string;
  surface?: string;
  overlay?: string;
}

/** Value accepted by {@link provideTailwindRadius}: a preset name or explicit per-role lengths. */
export type TailwindRadiusConfig = TailwindRadiusPreset | TailwindRadiusScale;
