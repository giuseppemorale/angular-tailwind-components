import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
  type EnvironmentProviders,
  type Provider
} from '@angular/core';
import {
  TAILWIND_COMPONENTS_SIZE,
  TAILWIND_DATETIME_LANGUAGE,
  TAILWIND_ICON_SIZE,
  TAILWIND_PAGINATION_SUMMARY
} from '../tokens';
import { TailwindComponentsConfig, TailwindDefineThemeConfig } from './interfaces/theme-config.interface';
import {
  TailwindThemeColorShade,
  TailwindThemeSemantic,
  TailwindThemeSemanticPaletteObject,
  TailwindThemeSemanticShades,
  TailwindThemeSeverityColor
} from './types/theme-config.types';

/**
 * Builds `Provider` entries for each set field on `config`.
 * Used by {@link defineTheme} and {@link provideTailwindComponents}.
 */
function providersFromTailwindComponentsConfig(config: TailwindComponentsConfig): Provider[] {
  const providers: Provider[] = [];

  if (config.iconSize !== undefined) {
    providers.push({ provide: TAILWIND_ICON_SIZE, useValue: config.iconSize });
  }
  if (config.datetimeLanguage !== undefined) {
    providers.push({ provide: TAILWIND_DATETIME_LANGUAGE, useValue: config.datetimeLanguage });
  }
  if (config.componentsSize !== undefined) {
    providers.push({ provide: TAILWIND_COMPONENTS_SIZE, useValue: config.componentsSize });
  }
  if (config.paginationSummary !== undefined) {
    providers.push({ provide: TAILWIND_PAGINATION_SUMMARY, useValue: config.paginationSummary });
  }

  return providers;
}

/**
 * Registers environment-scoped providers for library injection tokens only (no theme `colors`).
 * Prefer {@link defineTheme}, which registers the same tokens when set plus optional CSS variables.
 *
 * @deprecated Use {@link defineTheme} with the same fields (`iconSize`, `datetimeLanguage`, etc.).
 */
export function provideTailwindComponents(config: TailwindComponentsConfig): EnvironmentProviders {
  return makeEnvironmentProviders(providersFromTailwindComponentsConfig(config));
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

function isValidShadeKey(key: string): key is TailwindThemeColorShade {
  return (
    key === '50' ||
    key === '100' ||
    key === '200' ||
    key === '300' ||
    key === '400' ||
    key === '500' ||
    key === '600' ||
    key === '700' ||
    key === '800' ||
    key === '900' ||
    key === '950'
  );
}

function isSemanticPaletteObject(value: object): value is TailwindThemeSemanticPaletteObject {
  return (
    'shades' in value &&
    typeof (value as TailwindThemeSemanticPaletteObject).shades === 'object' &&
    (value as TailwindThemeSemanticPaletteObject).shades !== null
  );
}

/**
 * Normalizes object `colors` values: legacy flat shade map vs `{ shades, on? }`.
 */
function normalizeSemanticColorObject(
  value: Exclude<TailwindThemeSeverityColor, string>
): { shades: TailwindThemeSemanticShades; on?: TailwindThemeSemanticShades } {
  if (isSemanticPaletteObject(value)) {
    return { shades: value.shades, on: value.on };
  }
  return { shades: value as TailwindThemeSemanticShades };
}

function pushShadeVariables(
  semantic: TailwindThemeSemantic,
  shades: TailwindThemeSemanticShades,
  entries: Array<[string, string]>
): void {
  for (const [shade, color] of Object.entries(shades)) {
    if (!isValidShadeKey(shade) || color === undefined || color === '') {
      continue;
    }
    entries.push([`--color-${semantic}-${shade}`, color]);
  }
}

function pushOnShadeVariables(
  semantic: TailwindThemeSemantic,
  on: TailwindThemeSemanticShades | undefined,
  entries: Array<[string, string]>
): void {
  if (!on) {
    return;
  }
  for (const [shade, color] of Object.entries(on)) {
    if (!isValidShadeKey(shade) || color === undefined || color === '') {
      continue;
    }
    entries.push([`--color-on-${semantic}-${shade}`, color]);
  }
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
    } else {
      const { shades, on } = normalizeSemanticColorObject(value);
      pushShadeVariables(semantic, shades, entries);
      pushOnShadeVariables(semantic, on, entries);
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
 * Registers environment-scoped library defaults: optional **injection tokens** from {@link TailwindComponentsConfig}
 * plus an app initializer that applies optional **`colors`** on
 * `document.documentElement` in the browser. Add as a single entry in `providers` (no spread).
 *
 * Palette **strings** (e.g. `'indigo'`) rely on `--color-indigo-*` existing in the CSS bundle; the
 * library stylesheet safelists Tailwind’s default palette names for that reason.
 */
export function defineTheme(config: TailwindDefineThemeConfig): EnvironmentProviders {
  const tokenProviders: Provider[] = providersFromTailwindComponentsConfig(config);

  return makeEnvironmentProviders([
    ...tokenProviders,
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
