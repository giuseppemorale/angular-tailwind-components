import { InjectionToken } from '@angular/core';
import {
  DEFAULT_TAILWIND_LABELS,
  TailwindButtonKind,
  TailwindEditorLabels,
  TailwindLabels,
  TailwindPasswordLabels,
  TailwindSize,
  type TailwindTitleScale
} from '../models';

export const TAILWIND_MODAL_DATA = new InjectionToken<unknown>('TAILWIND_MODAL_DATA');

/** App-wide UI strings; defaults to {@link DEFAULT_TAILWIND_LABELS}, overridable with `Partial` keys. */
export const TAILWIND_LABELS = new InjectionToken<TailwindLabels>('TAILWIND_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_TAILWIND_LABELS
});

/** Directory the icon SVGs are served from when {@link TAILWIND_ICON_BASE_PATH} is not configured. */
export const DEFAULT_TAILWIND_ICON_BASE_PATH = '/tailwind-icons';

/** Default pixel size for `tailwind-icon` when `size` is omitted (typically 16–64). */
export const TAILWIND_ICON_SIZE = new InjectionToken<number>('TAILWIND_ICON_SIZE');

/**
 * Directory the `tailwind-icon` SVGs are served from, without a trailing slash.
 * Set it when the app is deployed under a sub-path or the assets are copied elsewhere.
 */
export const TAILWIND_ICON_BASE_PATH = new InjectionToken<string>('TAILWIND_ICON_BASE_PATH', {
  providedIn: 'root',
  factory: () => DEFAULT_TAILWIND_ICON_BASE_PATH
});

/** BCP 47 locale for calendars and time pickers; defaults to Angular's `LOCALE_ID`. */
export const TAILWIND_DATETIME_LANGUAGE = new InjectionToken<string>('TAILWIND_DATETIME_LANGUAGE');

export const TAILWIND_COMPONENTS_SIZE = new InjectionToken<TailwindSize>('TAILWIND_COMPONENTS_SIZE');

/** Default `kind` for `tailwind-button` when the `kind` input is omitted. */
export const TAILWIND_BUTTON_KIND = new InjectionToken<TailwindButtonKind>('TAILWIND_BUTTON_KIND');

/** Default `tailwind-pagination` summary template; placeholders `{start}`, `{end}`, `{total}`. */
export const TAILWIND_PAGINATION_SUMMARY = new InjectionToken<string>('TAILWIND_PAGINATION_SUMMARY');

/** Default labels for `tailwind-input-password` strength feedback. */
export const TAILWIND_PASSWORD_LABELS = new InjectionToken<TailwindPasswordLabels>('TAILWIND_PASSWORD_LABELS');

/** Labels for `tailwind-editor`; defaults to {@link DEFAULT_TAILWIND_EDITOR_LABELS}. */
export const TAILWIND_EDITOR_LABELS = new InjectionToken<TailwindEditorLabels>('TAILWIND_EDITOR_LABELS');

/** Per-tag typography and icon size for `tailwind-title`; defaults to {@link DEFAULT_TAILWIND_TITLE_SCALE}. */
export const TAILWIND_TITLE_SCALE = new InjectionToken<TailwindTitleScale>('TAILWIND_TITLE_SCALE');
