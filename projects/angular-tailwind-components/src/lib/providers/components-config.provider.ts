import { makeEnvironmentProviders, type EnvironmentProviders, type Provider } from '@angular/core';
import type { TailwindSize } from '../models';
import {
  TAILWIND_COMPONENTS_SIZE,
  TAILWIND_DATETIME_LANGUAGE,
  TAILWIND_ICON_SIZE,
  TAILWIND_MODAL_DATA,
  TAILWIND_PAGINATION_SUMMARY
} from '../tokens';

/**
 * Optional app-wide values for library `InjectionToken`s.
 * Pass only the keys you need; {@link provideTailwindComponents} registers matching `Provider`s.
 */
export interface TailwindComponentsConfig {
  /** Maps to {@link TAILWIND_ICON_SIZE} (default icon pixel size when omitted). */
  iconSize?: number;
  /** Maps to {@link TAILWIND_DATETIME_LANGUAGE}. */
  datetimeLanguage?: 'it' | 'en';
  /** Maps to {@link TAILWIND_COMPONENTS_SIZE}. */
  componentsSize?: TailwindSize;
  /** Maps to {@link TAILWIND_PAGINATION_SUMMARY}. */
  paginationSummary?: string;
  /**
   * Maps to {@link TAILWIND_MODAL_DATA}.
   * Normally each `ModalService.open()` supplies this per dialog; use at app scope only if you need a global fallback (modal `open` still overrides in the dialog injector when data is passed).
   */
  modalData?: unknown;
}

/**
 * Registers environment-scoped providers for the tokens corresponding to each set field on `config`.
 * Add the result to `bootstrapApplication(..., { providers: [...] })` or `ApplicationConfig.providers` without spreading.
 */
export function provideTailwindComponents(config: TailwindComponentsConfig): EnvironmentProviders {
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
  if (config.modalData !== undefined) {
    providers.push({ provide: TAILWIND_MODAL_DATA, useValue: config.modalData });
  }

  return makeEnvironmentProviders(providers);
}
