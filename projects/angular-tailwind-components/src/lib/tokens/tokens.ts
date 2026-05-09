import { InjectionToken } from '@angular/core';
import { TailwindSize } from '../models';

export const TAILWIND_MODAL_DATA = new InjectionToken<unknown>('TAILWIND_MODAL_DATA');

/** Default pixel size for `tailwind-icon` when `size` is omitted (typically 16–64). */
export const TAILWIND_ICON_SIZE = new InjectionToken<number>('TAILWIND_ICON_SIZE');

export const TAILWIND_DATETIME_LANGUAGE = new InjectionToken<'it' | 'en'>('TAILWIND_DATETIME_LANGUAGE');

export const TAILWIND_COMPONENTS_SIZE = new InjectionToken<TailwindSize>('TAILWIND_COMPONENTS_SIZE');
