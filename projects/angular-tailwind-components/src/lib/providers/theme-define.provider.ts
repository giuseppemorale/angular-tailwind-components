import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
  type EnvironmentProviders
} from '@angular/core';

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

export interface TailwindDefineThemeColors {
  primary?: TailwindThemeSeverityColor;
  neutral?: TailwindThemeSeverityColor;
  success?: TailwindThemeSeverityColor;
  warning?: TailwindThemeSeverityColor;
  danger?: TailwindThemeSeverityColor;
  /**
   * Alias for {@link TailwindDefineThemeColors.danger}; writes the same `--color-danger-*` variables.
   * Ignored when `danger` is set.
   */
  error?: TailwindThemeSeverityColor;
  info?: TailwindThemeSeverityColor;
}

export interface TailwindDefineThemeConfig {
  /** Overrides semantic colors on `:root` at startup (browser only). */
  colors?: TailwindDefineThemeColors;
}

const SHADES_WITH_950 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
const SHADES_TO_900 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

function shadesForSemantic(semantic: TailwindThemeSemantic): readonly number[] {
  switch (semantic) {
    case 'success':
    case 'warning':
    case 'danger':
    case 'info':
      return SHADES_TO_900;
    default:
      return SHADES_WITH_950;
  }
}

function isShadeRecord(value: TailwindThemeSeverityColor): value is Partial<Record<TailwindThemeColorShade, string>> {
  return typeof value === 'object' && value !== null;
}

/**
 * Builds `[CSS custom property name, value]` pairs for {@link defineTheme}.
 * Exported for unit tests.
 */
export function buildTailwindThemeVariableEntries(config: TailwindDefineThemeConfig): Array<[string, string]> {
  const colors = config.colors;
  if (!colors) {
    return [];
  }

  const entries: Array<[string, string]> = [];
  const dangerOrError = colors.danger ?? colors.error;

  const pairs: Array<[TailwindThemeSemantic, TailwindThemeSeverityColor | undefined]> = [
    ['primary', colors.primary],
    ['neutral', colors.neutral],
    ['success', colors.success],
    ['warning', colors.warning],
    ['danger', dangerOrError],
    ['info', colors.info]
  ];

  for (const [semantic, value] of pairs) {
    if (value === undefined) {
      continue;
    }
    if (typeof value === 'string') {
      const palette = value.trim();
      if (!palette) {
        continue;
      }
      for (const shade of shadesForSemantic(semantic)) {
        entries.push([`--color-${semantic}-${shade}`, `var(--color-${palette}-${shade})`]);
      }
    } else if (isShadeRecord(value)) {
      for (const [shade, color] of Object.entries(value) as Array<[TailwindThemeColorShade, string | undefined]>) {
        if (color !== undefined && color !== '') {
          entries.push([`--color-${semantic}-${shade}`, color]);
        }
      }
    }
  }

  return entries;
}

function applyTailwindThemeToElement(element: HTMLElement, config: TailwindDefineThemeConfig): void {
  for (const [prop, val] of buildTailwindThemeVariableEntries(config)) {
    element.style.setProperty(prop, val);
  }
}

/**
 * Registers an app initializer that applies semantic color overrides on `document.documentElement`.
 * Uses the same `--color-*` names as [`tailwind.css`](../styles/tailwind.css) `@theme`, so utilities
 * like `bg-primary-600` pick up the new values. No-op on the server.
 *
 * Palette **strings** (e.g. `'indigo'`) rely on `--color-indigo-*` existing in the CSS bundle; the
 * library stylesheet safelists Tailwind’s default palette names for that reason.
 */
export function defineTheme(config: TailwindDefineThemeConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      if (!isPlatformBrowser(platformId)) {
        return;
      }
      const doc = inject(DOCUMENT);
      applyTailwindThemeToElement(doc.documentElement, config);
    })
  ]);
}
