import { InjectionToken } from '@angular/core';
import type { TailwindComponentsConfig } from '../interfaces/theme-config.interface';
import type { TailwindRadiusPreset, TailwindRadiusScale } from '../types/theme-config.types';

/**
 * The config handed to `provideTailwindConfig`, resolved once per injector.
 * Internal: it exists so a factory config is not re-run by every token provider.
 */
export const TAILWIND_RESOLVED_CONFIG = new InjectionToken<TailwindComponentsConfig>('TAILWIND_RESOLVED_CONFIG');

/** Shade scale for `primary` / `neutral`. */
export const SHADES_WITH_950 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** Shade scale for the severity semantics (`success`, `warning`, `danger`, `info`). */
export const SHADES_TO_900 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

/** `id` of the injected `<style>` that holds semantic theme variables on `:root`. */
export const TAILWIND_THEME_STYLE_ID = 'tailwind-theme-colors';

/** `data-*` attribute on `<html>` while a runtime theme override is active. */
export const TAILWIND_THEME_HTML_ATTR = 'data-tailwind-theme';

/** `id` of the injected `<style>` that holds the radius scale on `:root`. */
export const TAILWIND_RADIUS_STYLE_ID = 'tailwind-theme-radius';

/** `data-*` attribute on `<html>` while a runtime radius override is active. */
export const TAILWIND_RADIUS_HTML_ATTR = 'data-tailwind-radius';

/** Per-role radius behind each {@link TailwindRadiusPreset}. */
export const RADIUS_PRESETS: Readonly<Record<TailwindRadiusPreset, Required<TailwindRadiusScale>>> = {
  sharp: { control: '0px', surface: '0px', overlay: '0px' },
  compact: { control: '0.25rem', surface: '0.375rem', overlay: '0.5rem' },
  default: { control: '0.5rem', surface: '0.75rem', overlay: '0.875rem' },
  round: { control: '0.75rem', surface: '1rem', overlay: '1.25rem' }
};
