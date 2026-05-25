import {
  makeEnvironmentProviders,
  type EnvironmentProviders,
  type Provider
} from '@angular/core';
import { resolveTailwindTitleScale } from '../models';
import {
  TAILWIND_BUTTON_KIND,
  TAILWIND_COMPONENTS_SIZE,
  TAILWIND_DATETIME_LANGUAGE,
  TAILWIND_ICON_SIZE,
  TAILWIND_PAGINATION_SUMMARY,
  TAILWIND_PASSWORD_LABELS,
  TAILWIND_TITLE_SCALE
} from '../tokens';
import { TailwindComponentsConfig } from './interfaces/theme-config.interface';

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
  if (config.buttonKind !== undefined) {
    providers.push({ provide: TAILWIND_BUTTON_KIND, useValue: config.buttonKind });
  }
  if (config.paginationSummary !== undefined) {
    providers.push({ provide: TAILWIND_PAGINATION_SUMMARY, useValue: config.paginationSummary });
  }
  if (config.passwordLabels !== undefined) {
    providers.push({ provide: TAILWIND_PASSWORD_LABELS, useValue: config.passwordLabels });
  }
  if (config.titleScale !== undefined) {
    providers.push({ provide: TAILWIND_TITLE_SCALE, useValue: resolveTailwindTitleScale(config.titleScale) });
  }

  return providers;
}

/**
 * Registers environment-scoped providers for library injection tokens only.
 * Prefer {@link defineTheme}, which registers the same tokens when set.
 *
 * @deprecated Use {@link defineTheme} with the same fields (`iconSize`, `datetimeLanguage`, `titleScale`, etc.).
 */
export function provideTailwindComponents(config: TailwindComponentsConfig): EnvironmentProviders {
  return makeEnvironmentProviders(providersFromTailwindComponentsConfig(config));
}

/**
 * Registers environment-scoped library defaults (injection tokens only).
 * Add as a single entry in `providers` (no spread).
 *
 * Component colors use Tailwind palette names via each component's `color` input (default `neutral`).
 */
export function defineTheme(config: TailwindComponentsConfig): EnvironmentProviders {
  return makeEnvironmentProviders(providersFromTailwindComponentsConfig(config));
}
