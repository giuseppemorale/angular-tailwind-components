import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
  type EnvironmentProviders,
  type Provider
} from '@angular/core';
import { resolveTailwindEditorLabels, resolveTailwindTitleScale } from '../models';
import {
  TAILWIND_BUTTON_KIND,
  TAILWIND_COMPONENTS_SIZE,
  TAILWIND_DATETIME_LANGUAGE,
  TAILWIND_ICON_SIZE,
  TAILWIND_PAGINATION_SUMMARY,
  TAILWIND_EDITOR_LABELS,
  TAILWIND_PASSWORD_LABELS,
  TAILWIND_TITLE_SCALE
} from '../tokens';
import {
  TailwindComponentsConfig,
  TailwindDefineThemeColors,
  TailwindDefineThemeConfig
} from './interfaces/theme-config.interface';
import {
  TailwindThemeColorShade,
  TailwindThemeSemantic,
  TailwindThemeSemanticPaletteObject,
  TailwindThemeSemanticShades,
  TailwindThemeSeverityColor
} from './types/theme-config.types';

function providersFromConfigFactory(config: () => TailwindComponentsConfig): Provider[] {
  const fromConfig = <T>(
    token: InjectionToken<T>,
    select: (c: TailwindComponentsConfig) => T | undefined,
    map?: (value: NonNullable<T>) => T
  ): Provider => ({
    provide: token,
    useFactory: () => {
      const value = select(config());
      if (value === undefined) {
        return undefined;
      }
      return map ? map(value as NonNullable<T>) : value;
    }
  });

  return [
    fromConfig(TAILWIND_ICON_SIZE, c => c.ICON_SIZE),
    fromConfig(TAILWIND_DATETIME_LANGUAGE, c => c.DATETIME_LANGUAGE),
    fromConfig(TAILWIND_COMPONENTS_SIZE, c => c.COMPONENTS_SIZE),
    fromConfig(TAILWIND_BUTTON_KIND, c => c.BUTTON_KIND),
    fromConfig(TAILWIND_PAGINATION_SUMMARY, c => c.PAGINATION_SUMMARY),
    fromConfig(TAILWIND_PASSWORD_LABELS, c => c.PASSWORD_LABELS),
    fromConfig(
      TAILWIND_EDITOR_LABELS,
      c => c.EDITOR_LABELS,
      v => resolveTailwindEditorLabels(v)
    ),
    fromConfig(
      TAILWIND_TITLE_SCALE,
      c => c.TITLE_SCALE,
      v => resolveTailwindTitleScale(v)
    )
  ];
}

/**
 * @deprecated Use {@link provideTailwindConfig}(() => config) instead.
 */
export function provideTailwindComponents(config: TailwindComponentsConfig): EnvironmentProviders {
  return provideTailwindConfig(() => config);
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

function normalizeSemanticColorObject(value: Exclude<TailwindThemeSeverityColor, string>): {
  shades: TailwindThemeSemanticShades;
  on?: TailwindThemeSemanticShades;
} {
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
 * Builds `[CSS custom property name, value]` pairs for semantic `COLORS`.
 * Exported for unit tests.
 */
export function buildTailwindThemeVariableEntries(config: TailwindDefineThemeConfig): Array<[string, string]> {
  const colors = config.COLORS;
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

function applyTailwindThemeToElement(element: HTMLElement, colors: TailwindDefineThemeColors): void {
  for (const [prop, val] of buildTailwindThemeVariableEntries({ COLORS: colors })) {
    element.style.setProperty(prop, val);
  }
}

/**
 * Overrides library injection tokens (`ICON_SIZE`, `DATETIME_LANGUAGE`, `EDITOR_LABELS`, …).
 * Pass a factory so you can use `inject()` (e.g. for translated labels).
 *
 * Token values are resolved on first injection (after your app initializers run).
 * For runtime semantic **`COLORS`**, use {@link provideTailwindThemeColors} separately.
 */
export function provideTailwindConfig(config: () => TailwindComponentsConfig): EnvironmentProviders {
  return makeEnvironmentProviders(providersFromConfigFactory(config));
}

/**
 * Applies semantic `COLORS` on `document.documentElement` at startup (browser only).
 * Register after i18n (or other) initializers if the factory uses `inject()`.
 */
export function provideTailwindThemeColors(colors: () => TailwindDefineThemeColors): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      if (!isPlatformBrowser(platformId)) {
        return;
      }
      applyTailwindThemeToElement(inject(DOCUMENT).documentElement, colors());
    })
  ]);
}
