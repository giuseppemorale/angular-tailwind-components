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
import { TailwindThemeColorShade, TailwindThemeSemantic, TailwindThemeSeverityColor } from './types/theme-config.types';

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

function isShadeRecord(value: TailwindThemeSeverityColor): value is Partial<Record<TailwindThemeColorShade, string>> {
  return typeof value === 'object' && value !== null;
}

/**
 * Builds `[CSS custom property name, value]` pairs for {@link defineTheme}.
 * Exported for unit tests.
 */
function buildTailwindThemeVariableEntries(config: TailwindDefineThemeConfig): Array<[string, string]> {
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
