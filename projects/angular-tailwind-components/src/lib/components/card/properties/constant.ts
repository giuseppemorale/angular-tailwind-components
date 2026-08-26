import type { TailwindCardDensity } from '../interfaces/card-density.type';

/** Structural classes of the card shell. */
export const SHELL_BASE =
  'bg-surface rounded-surface border border-border overflow-visible transition-shadow duration-200 ease-in-out flex flex-col min-h-0';

/** Padding per slot and density. */
export const DENSITY_PADDING: Record<TailwindCardDensity, { header: string; body: string; footer: string }> = {
  comfortable: { header: 'px-6 pt-4 pb-3', body: 'p-6', footer: 'px-6 py-4' },
  compact: { header: 'px-4 pt-3 pb-2', body: 'p-4', footer: 'px-4 py-3' }
};
