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
import {
  DEFAULT_TAILWIND_LABELS,
  resolveTailwindEditorLabels,
  resolveTailwindLabels,
  resolveTailwindTitleScale
} from '../models';
import {
  DEFAULT_TAILWIND_ICON_BASE_PATH,
  TAILWIND_BUTTON_KIND,
  TAILWIND_COMPONENTS_SIZE,
  TAILWIND_DATETIME_LANGUAGE,
  TAILWIND_ICON_BASE_PATH,
  TAILWIND_ICON_SIZE,
  TAILWIND_PAGINATION_SUMMARY,
  TAILWIND_EDITOR_LABELS,
  TAILWIND_LABELS,
  TAILWIND_PASSWORD_LABELS,
  TAILWIND_TITLE_SCALE
} from '../tokens';
import {
  TailwindComponentsConfig,
  TailwindDefineThemeColors,
  TailwindDefineThemeConfig
} from './interfaces/theme-config.interface';
import {
  TailwindRadiusConfig,
  TailwindRadiusPreset,
  TailwindRadiusScale,
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
    map?: (value: NonNullable<T>) => T,
    // Tokens that declare their own `providedIn: 'root'` default must repeat it here: this provider
    // shadows that factory, so returning `undefined` would leave consumers such as
    // `tailwind-toolbar` (labels) or `tailwind-icon` (base path) without a value at all.
    fallback?: () => T
  ): Provider => ({
    provide: token,
    useFactory: () => {
      const value = select(config());
      if (value === undefined) {
        return fallback ? fallback() : undefined;
      }
      return map ? map(value as NonNullable<T>) : value;
    }
  });

  return [
    fromConfig(TAILWIND_ICON_SIZE, c => c.ICON_SIZE),
    fromConfig(
      TAILWIND_ICON_BASE_PATH,
      c => c.ICON_BASE_PATH,
      undefined,
      () => DEFAULT_TAILWIND_ICON_BASE_PATH
    ),
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
    ),
    fromConfig(
      TAILWIND_LABELS,
      c => c.LABELS,
      v => resolveTailwindLabels(v),
      () => DEFAULT_TAILWIND_LABELS
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

/** Default `--color-on-<semantic>-<shade>` values aligned with `tailwind.css` `@theme`. */
function defaultOnColorForShade(semantic: TailwindThemeSemantic, shade: TailwindThemeColorShade): string {
  const shadeNum = Number(shade);
  switch (semantic) {
    case 'warning':
      return shadeNum >= 700 ? '#ffffff' : 'var(--color-neutral-900)';
    case 'neutral':
      return shadeNum >= 600 ? '#ffffff' : 'var(--color-neutral-900)';
    default:
      return shadeNum >= 500 ? '#ffffff' : 'var(--color-neutral-900)';
  }
}

function resolveOnShadesForCustomPalette(
  semantic: TailwindThemeSemantic,
  shades: TailwindThemeSemanticShades,
  on: TailwindThemeSemanticShades | undefined
): TailwindThemeSemanticShades {
  const resolved: TailwindThemeSemanticShades = { ...on };
  for (const shade of Object.keys(shades)) {
    if (!isValidShadeKey(shade) || shades[shade] === undefined || shades[shade] === '') {
      continue;
    }
    if (resolved[shade] === undefined || resolved[shade] === '') {
      resolved[shade] = defaultOnColorForShade(semantic, shade);
    }
  }
  return resolved;
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
      pushOnShadeVariables(semantic, resolveOnShadesForCustomPalette(semantic, shades, on), entries);
    }
  }

  return entries;
}

/** `id` of the injected `<style>` that holds semantic theme variables on `:root`. */
export const TAILWIND_THEME_STYLE_ID = 'tailwind-theme-colors';

/** `data-*` attribute on `<html>` while a runtime theme override is active. */
export const TAILWIND_THEME_HTML_ATTR = 'data-tailwind-theme';

/**
 * Builds an `@layer theme` stylesheet from semantic `COLORS`. Exported for unit tests.
 *
 * Tailwind v4 registers semantic tokens in `@layer theme` on `:root`/`:host`; overrides must
 * live in the same layer (and beat defaults via attribute selector + source order).
 */
export function buildTailwindThemeCss(colors: TailwindDefineThemeColors): string {
  const entries = buildTailwindThemeVariableEntries({ COLORS: colors });
  if (entries.length === 0) {
    return '';
  }
  const declarations = entries.map(([prop, val]) => `  ${prop}: ${val};`).join('\n');
  return `@layer theme {\n  :root[${TAILWIND_THEME_HTML_ATTR}],\n  :host {\n${declarations}\n  }\n}`;
}

/** Angular production build sets global `ngDevMode` to `false`. */
declare const ngDevMode: boolean | undefined;

function stylesheetHasPrimaryUtility(document: Document): boolean {
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (let i = 0; i < rules.length; i++) {
      const text = rules[i]?.cssText ?? '';
      if (text.includes('.bg-primary-600') || text.includes('.bg-primary-600:')) {
        return true;
      }
    }
  }
  return false;
}

function warnIfSemanticUtilitiesMissing(document: Document): void {
  if (typeof ngDevMode !== 'undefined' && ngDevMode === false) {
    return;
  }
  if (stylesheetHasPrimaryUtility(document)) {
    return;
  }
  console.warn(
    '[angular-tailwind-components] Semantic utilities such as `.bg-primary-600` were not found in the compiled CSS. ' +
      'Add `angular-tailwind-components/styles/tailwind.css` to your global styles (it already includes `@import "tailwindcss"`). ' +
      'Using only `@import "tailwindcss"` in your app does not register `primary` / `on-primary` tokens — buttons may look gray.'
  );
}

/**
 * Injects or updates `#tailwind-theme-colors` in `document.head` (browser only).
 * Exported for unit tests.
 *
 * Sets `data-tailwind-theme` on `<html>` and applies variables via `@layer theme` in the injected
 * stylesheet (`:root[data-tailwind-theme]` and `:host` for shadow roots). Does not use inline
 * `style` on `<html>`.
 */
export function applyTailwindThemeColors(document: Document, colors: TailwindDefineThemeColors): void {
  const entries = buildTailwindThemeVariableEntries({ COLORS: colors });
  const existing = document.getElementById(TAILWIND_THEME_STYLE_ID);
  const root = document.documentElement;

  if (entries.length === 0) {
    existing?.remove();
    root.removeAttribute(TAILWIND_THEME_HTML_ATTR);
    return;
  }

  root.setAttribute(TAILWIND_THEME_HTML_ATTR, '');

  const css = buildTailwindThemeCss(colors);
  const style = existing ?? document.createElement('style');
  style.id = TAILWIND_THEME_STYLE_ID;
  style.dataset['tailwindTheme'] = '';
  style.textContent = css;

  if (!existing) {
    document.head.appendChild(style);
  }
  warnIfSemanticUtilitiesMissing(document);
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

/** Per-role radius behind each {@link TailwindRadiusPreset}, in the order `control, surface, overlay`. */
const RADIUS_PRESETS: Readonly<Record<TailwindRadiusPreset, Required<TailwindRadiusScale>>> = {
  sharp: { control: '0px', surface: '0px', overlay: '0px' },
  compact: { control: '0.25rem', surface: '0.375rem', overlay: '0.5rem' },
  default: { control: '0.5rem', surface: '0.75rem', overlay: '0.875rem' },
  round: { control: '0.75rem', surface: '1rem', overlay: '1.25rem' }
};

/** `id` of the injected `<style>` that holds the radius scale on `:root`. */
export const TAILWIND_RADIUS_STYLE_ID = 'tailwind-theme-radius';

/** `data-*` attribute on `<html>` while a runtime radius override is active. */
export const TAILWIND_RADIUS_HTML_ATTR = 'data-tailwind-radius';

/** Resolves a preset name or a partial scale into explicit per-role lengths. Exported for unit tests. */
export function resolveTailwindRadiusScale(config: TailwindRadiusConfig): Required<TailwindRadiusScale> {
  if (typeof config === 'string') {
    return { ...(RADIUS_PRESETS[config] ?? RADIUS_PRESETS.default) };
  }
  return {
    control: config.control ?? RADIUS_PRESETS.default.control,
    surface: config.surface ?? RADIUS_PRESETS.default.surface,
    overlay: config.overlay ?? RADIUS_PRESETS.default.overlay
  };
}

/**
 * Builds the `@layer theme` stylesheet for a radius scale. Exported for unit tests.
 *
 * The `*-inner` tokens are written as `calc()` over the role they belong to rather than as fixed
 * lengths, so a nested element (a segmented-control thumb, a tab inside its track) keeps a
 * concentric curve at every preset — including `sharp`, where `calc(0px - 2px)` clamps to square.
 */
export function buildTailwindRadiusCss(config: TailwindRadiusConfig): string {
  const { control, surface, overlay } = resolveTailwindRadiusScale(config);
  return [
    '@layer theme {',
    `  :root[${TAILWIND_RADIUS_HTML_ATTR}],`,
    '  :host {',
    `    --radius-control: ${control};`,
    '    --radius-control-inner: max(0px, calc(var(--radius-control) - 0.125rem));',
    `    --radius-surface: ${surface};`,
    '    --radius-surface-inner: max(0px, calc(var(--radius-surface) - 0.25rem));',
    `    --radius-overlay: ${overlay};`,
    '  }',
    '}'
  ].join('\n');
}

/**
 * Injects or updates `#tailwind-theme-radius` in `document.head` (browser only). Exported for unit tests.
 */
export function applyTailwindRadius(document: Document, config: TailwindRadiusConfig): void {
  const root = document.documentElement;
  root.setAttribute(TAILWIND_RADIUS_HTML_ATTR, '');

  const existing = document.getElementById(TAILWIND_RADIUS_STYLE_ID);
  const style = existing ?? document.createElement('style');
  style.id = TAILWIND_RADIUS_STYLE_ID;
  style.textContent = buildTailwindRadiusCss(config);

  if (!existing) {
    document.head.appendChild(style);
  }
}

/**
 * Re-maps the role-based radius tokens (`--radius-control`, `--radius-surface`, `--radius-overlay`)
 * app-wide at startup (browser only).
 *
 * Every component names those three tokens instead of a literal `rounded-md`, so this one call is
 * enough to take the whole library from square to fully rounded:
 *
 * ```ts
 * provideTailwindRadius(() => 'round')
 * provideTailwindRadius(() => ({ control: '0.375rem', overlay: '1rem' }))
 * ```
 */
export function provideTailwindRadius(config: () => TailwindRadiusConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      if (!isPlatformBrowser(platformId)) {
        return;
      }
      applyTailwindRadius(inject(DOCUMENT), config());
    })
  ]);
}

/**
 * Applies semantic `COLORS` via `<style id="tailwind-theme-colors">` in `@layer theme` at startup (browser only).
 * Register after i18n (or other) initializers if the factory uses `inject()`.
 */
export function provideTailwindThemeColors(colors: () => TailwindDefineThemeColors): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      if (!isPlatformBrowser(platformId)) {
        return;
      }
      const document = inject(DOCUMENT);
      const resolved = colors();
      const apply = (): void => applyTailwindThemeColors(document, resolved);
      apply();
      // Re-apply after async stylesheets load (Angular may defer bundled CSS behind JS).
      globalThis.addEventListener?.('load', apply, { once: true });
    })
  ]);
}
