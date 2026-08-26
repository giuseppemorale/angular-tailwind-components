import type { TailwindColor } from '../../../models';

/** Dot colour per semantic status. */
export const DOT_COLOR: Record<TailwindColor, string> = {
  primary: 'bg-primary-600 text-on-primary-600',
  secondary: 'bg-neutral-200 text-neutral-700',
  success: 'bg-success-600 text-on-success-600',
  warning: 'bg-warning-500 text-on-warning-500',
  danger: 'bg-danger-600 text-on-danger-600',
  info: 'bg-info-600 text-on-info-600',
  transparent: 'bg-surface text-neutral-600 border border-border-strong'
};
