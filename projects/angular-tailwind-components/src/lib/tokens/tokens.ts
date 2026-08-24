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

/**
 * App-wide UI strings for the accessible names and built-in text the library renders itself
 * (close, dismiss, pagination controls, table empty state, …).
 * Defaults to {@link DEFAULT_TAILWIND_LABELS}; override via {@link provideTailwindConfig} with `Partial` keys only.
 */
export const TAILWIND_LABELS = new InjectionToken<TailwindLabels>('TAILWIND_LABELS', {
  providedIn: 'root',
  factory: () => DEFAULT_TAILWIND_LABELS
});

/** Default pixel size for `tailwind-icon` when `size` is omitted (typically 16–64). */
export const TAILWIND_ICON_SIZE = new InjectionToken<number>('TAILWIND_ICON_SIZE');

/**
 * Directory the `tailwind-icon` SVG assets are served from, without a trailing slash.
 * Defaults to `/tailwind-icons`, which assumes the app is served from the domain root — set this
 * when the app is deployed under a sub-path (`<base href="/my-app/">`) or the assets are copied elsewhere.
 */
export const TAILWIND_ICON_BASE_PATH = new InjectionToken<string>('TAILWIND_ICON_BASE_PATH', {
  providedIn: 'root',
  factory: () => '/tailwind-icons'
});

export const TAILWIND_DATETIME_LANGUAGE = new InjectionToken<'it' | 'en'>('TAILWIND_DATETIME_LANGUAGE');

export const TAILWIND_COMPONENTS_SIZE = new InjectionToken<TailwindSize>('TAILWIND_COMPONENTS_SIZE');

/** Default `kind` for `tailwind-button` when the `kind` input is omitted. */
export const TAILWIND_BUTTON_KIND = new InjectionToken<TailwindButtonKind>('TAILWIND_BUTTON_KIND');

/**
 * Default template for `tailwind-pagination` **summary** when the `summary` input is omitted.
 * Use placeholders `{start}`, `{end}`, `{total}` (same rules as the `summary` input).
 */
export const TAILWIND_PAGINATION_SUMMARY = new InjectionToken<string>('TAILWIND_PAGINATION_SUMMARY');

/**
 * Default labels for `tailwind-input-password` strength feedback when component inputs are omitted.
 */
export const TAILWIND_PASSWORD_LABELS = new InjectionToken<TailwindPasswordLabels>('TAILWIND_PASSWORD_LABELS');

/**
 * Labels for `tailwind-editor` (modals, code view, toolbar).
 * Defaults to {@link DEFAULT_TAILWIND_EDITOR_LABELS}; override via {@link provideTailwindConfig} with `Partial` keys only.
 */
export const TAILWIND_EDITOR_LABELS = new InjectionToken<TailwindEditorLabels>('TAILWIND_EDITOR_LABELS');

/**
 * Per-tag typography and icon size for `tailwind-title` when `titleTag` is set.
 * Defaults to {@link DEFAULT_TAILWIND_TITLE_SCALE}; override via {@link provideTailwindConfig} or a `Provider`.
 */
export const TAILWIND_TITLE_SCALE = new InjectionToken<TailwindTitleScale>('TAILWIND_TITLE_SCALE');
