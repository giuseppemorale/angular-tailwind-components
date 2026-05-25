import {
  TailwindButtonKind,
  TailwindPasswordLabels,
  TailwindSize,
  TailwindTitleTag,
  TailwindTitleTagScale
} from '../../models';

/**
 * Optional app-wide values for library `InjectionToken`s.
 * Pass only the keys you need; {@link defineTheme} registers matching `Provider`s.
 */
export interface TailwindComponentsConfig {
  /** Maps to {@link TAILWIND_ICON_SIZE} (default icon pixel size when omitted). */
  iconSize?: number;
  /** Maps to {@link TAILWIND_DATETIME_LANGUAGE}. */
  datetimeLanguage?: 'it' | 'en';
  /** Maps to {@link TAILWIND_COMPONENTS_SIZE}. */
  componentsSize?: TailwindSize;
  /** Maps to {@link TAILWIND_BUTTON_KIND} (default `kind` on `tailwind-button`). */
  buttonKind?: TailwindButtonKind;
  /** Maps to {@link TAILWIND_PAGINATION_SUMMARY}. */
  paginationSummary?: string;
  /** Maps to {@link TAILWIND_PASSWORD_LABELS}. */
  passwordLabels?: TailwindPasswordLabels;
  /**
   * Maps to {@link TAILWIND_TITLE_SCALE} (merged onto {@link DEFAULT_TAILWIND_TITLE_SCALE}).
   * Overrides typography classes and icon pixel size per `h1`–`h6`.
   */
  titleScale?: Partial<Record<TailwindTitleTag, Partial<TailwindTitleTagScale>>>;
}

/** @deprecated Use {@link TailwindComponentsConfig} — `colors` removed; use per-component `color` palette inputs. */
export type TailwindDefineThemeConfig = TailwindComponentsConfig;
