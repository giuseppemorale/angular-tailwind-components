/** Semantic color groups used by library components (maps to `--color-<name>-<shade>`). */
export type TailwindThemeSemantic = 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** Shade keys aligned with Tailwind default scales and this library’s `@theme` tokens. */
export type TailwindThemeColorShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

/** Explicit semantic palette shades only (legacy flat object form for `defineTheme` colors). */
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
 * Values for each `colors` entry in {@link TailwindDefineThemeConfig} (exported type name).
 *
 * - **String:** Tailwind palette family name (lowercase), e.g. `'indigo'` for utilities like `bg-indigo-600`.
 *   See the [Tailwind color reference](https://tailwindcss.com/docs/colors) for all built-in names and previews.
 *   Each semantic shade is mapped to `var(--color-<name>-<shade>)`.
 * - **Flat object:** `Partial<Record<shade, string>>` — explicit CSS colors per shade (`'50'` … `'950'`); same as `{ shades: { … } }`.
 * - **Structured object:** `{ shades, on? }` — optional `on` defines foreground (contrast) per shade; written as `--color-on-<semantic>-<shade>`.
 */
export type TailwindThemeSeverityColor =
  | string
  | TailwindThemeSemanticPaletteObject
  | TailwindThemeSemanticShades;
