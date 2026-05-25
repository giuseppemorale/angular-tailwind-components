import {
  TailwindButtonKind,
  TailwindPasswordLabels,
  TailwindSize,
  TailwindTitleTag,
  TailwindTitleTagScale
} from '../../models';
import { TailwindThemeSeverityColor } from '../types/theme-config.types';

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

export interface TailwindDefineThemeColors {
  primary?: TailwindThemeSeverityColor;
  neutral?: TailwindThemeSeverityColor;
  success?: TailwindThemeSeverityColor;
  warning?: TailwindThemeSeverityColor;
  danger?: TailwindThemeSeverityColor;
  /**
   * Alias for {@link TailwindDefineThemeColors.danger}; writes the same `--color-danger-*` variables.
   * Ignored when `danger` is set.
   */
  error?: TailwindThemeSeverityColor;
  info?: TailwindThemeSeverityColor;
}

export interface TailwindDefineThemeConfig extends TailwindComponentsConfig {
  /** Overrides semantic colors on `:root` at startup (browser only). */
  colors?: TailwindDefineThemeColors;
}
