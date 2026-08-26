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
import type { TailwindComponentsConfig, TailwindDefineThemeColors } from './interfaces/theme-config.interface';
import { TAILWIND_RESOLVED_CONFIG } from './properties/constant';
import type { TailwindConfigInput, TailwindRadiusConfig } from './types/theme-config.types';
import { applyTailwindThemeColors } from './util/theme-colors';
import { applyTailwindRadius } from './util/theme-radius';

/** Unwraps a value that may be given directly or through a factory. */
function resolveConfigInput<T>(input: TailwindConfigInput<T>): T {
  return typeof input === 'function' ? (input as () => T)() : input;
}

function tokenProviders(): Provider[] {
  const fromConfig = <T>(
    token: InjectionToken<T>,
    select: (c: TailwindComponentsConfig) => T | undefined,
    map?: (value: NonNullable<T>) => T,
    // These providers shadow the tokens' own `providedIn: 'root'` factory, so a config that omits
    // the key must repeat the default instead of handing consumers `undefined`.
    fallback?: () => T
  ): Provider => ({
    provide: token,
    useFactory: () => {
      const value = select(inject(TAILWIND_RESOLVED_CONFIG));
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

/** Writes `COLORS` into `<style id="tailwind-theme-colors">`, then again once late CSS has loaded. */
function applyColors(document: Document, colors: TailwindDefineThemeColors): void {
  const apply = (): void => applyTailwindThemeColors(document, colors);
  apply();
  // Re-apply after async stylesheets load (Angular may defer bundled CSS behind JS).
  globalThis.addEventListener?.('load', apply, { once: true });
}

/**
 * Applies the startup half of a config — the parts that write CSS instead of feeding a token.
 *
 * The config is resolved here rather than read from {@link TAILWIND_RESOLVED_CONFIG} on purpose:
 * app initializers run before their async siblings settle, so injecting the cached value would
 * freeze a translated `LABELS` factory to its pre-load result.
 */
function themeInitializer(input: TailwindConfigInput<TailwindComponentsConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) {
        return;
      }
      const document = inject(DOCUMENT);
      const { RADIUS, COLORS } = resolveConfigInput(input);
      if (RADIUS !== undefined) {
        applyTailwindRadius(document, RADIUS);
      }
      if (COLORS !== undefined) {
        applyColors(document, COLORS);
      }
    })
  ]);
}

/** Whether a config can carry `RADIUS` / `COLORS`; a factory has to be assumed to. */
function mayCarryTheme(input: TailwindConfigInput<TailwindComponentsConfig>): boolean {
  return typeof input === 'function' || input.RADIUS !== undefined || input.COLORS !== undefined;
}

/**
 * Configures the library app-wide: injection token defaults (`ICON_SIZE`, `DATETIME_LANGUAGE`,
 * `LABELS`, …) plus the `RADIUS` and `COLORS` themes, which are written to the document at startup
 * and are a no-op during SSR.
 *
 * Pass the config object directly; pass a factory only when the values need `inject()`.
 *
 * ```ts
 * provideTailwindConfig({ BUTTON_KIND: 'flat', RADIUS: 'round', COLORS: { primary: 'indigo' } })
 * provideTailwindConfig(() => ({ LABELS: inject(TranslocoService).translateObject('ui') }))
 * ```
 *
 * Token values resolve on first injection, after the app initializers; `RADIUS` and `COLORS` are
 * read during them, so a factory that computes those from async state should set them statically.
 */
export function provideTailwindConfig(config: TailwindConfigInput<TailwindComponentsConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TAILWIND_RESOLVED_CONFIG, useFactory: () => resolveConfigInput(config) },
    ...tokenProviders(),
    ...(mayCarryTheme(config) ? [themeInitializer(config)] : [])
  ]);
}

/**
 * @deprecated Use {@link provideTailwindConfig} — it now accepts the config object directly.
 */
export function provideTailwindComponents(config: TailwindComponentsConfig): EnvironmentProviders {
  return provideTailwindConfig(config);
}

/**
 * Re-maps the role-based radius tokens (`--radius-control`, `--radius-surface`, `--radius-overlay`)
 * app-wide at startup (browser only).
 *
 * @deprecated Use `provideTailwindConfig({ RADIUS: … })`.
 */
export function provideTailwindRadius(config: TailwindConfigInput<TailwindRadiusConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) {
        return;
      }
      applyTailwindRadius(inject(DOCUMENT), resolveConfigInput(config));
    })
  ]);
}

/**
 * Applies semantic `COLORS` through `<style id="tailwind-theme-colors">` at startup (browser only).
 *
 * @deprecated Use `provideTailwindConfig({ COLORS: … })`.
 */
export function provideTailwindThemeColors(
  colors: TailwindConfigInput<TailwindDefineThemeColors>
): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) {
        return;
      }
      applyColors(inject(DOCUMENT), resolveConfigInput(colors));
    })
  ]);
}
