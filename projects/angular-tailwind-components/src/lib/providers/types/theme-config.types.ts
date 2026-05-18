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

/**
 * Values for each `colors` entry in {@link TailwindDefineThemeConfig} (exported type name).
 *
 * - **String:** Tailwind palette family name (lowercase), e.g. `'indigo'` for utilities like `bg-indigo-600`.
 *   See the [Tailwind color reference](https://tailwindcss.com/docs/colors) for all built-in names and previews.
 *   Each semantic shade is mapped to `var(--color-<name>-<shade>)`.
 * - **Object:** `Partial<Record<shade, string>>` with explicit CSS colors per shade (`'50'` … `'950'`).
 */
export type TailwindThemeSeverityColor = string | Partial<Record<TailwindThemeColorShade, string>>;
