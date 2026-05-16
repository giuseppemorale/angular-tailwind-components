import { InjectionToken } from '@angular/core';
import { TailwindSize } from '../models';

export const TAILWIND_MODAL_DATA = new InjectionToken<unknown>('TAILWIND_MODAL_DATA');

/** Default pixel size for `tailwind-icon` when `size` is omitted (typically 16–64). */
export const TAILWIND_ICON_SIZE = new InjectionToken<number>('TAILWIND_ICON_SIZE');

export const TAILWIND_DATETIME_LANGUAGE = new InjectionToken<'it' | 'en'>('TAILWIND_DATETIME_LANGUAGE');

export const TAILWIND_COMPONENTS_SIZE = new InjectionToken<TailwindSize>('TAILWIND_COMPONENTS_SIZE');

/**
 * Default template for `tailwind-pagination` **summary** when the `summary` input is omitted.
 * Use placeholders `{start}`, `{end}`, `{total}` (same rules as the `summary` input).
 */
export const TAILWIND_PAGINATION_SUMMARY = new InjectionToken<string>('TAILWIND_PAGINATION_SUMMARY');
