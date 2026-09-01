import type { TailwindSize } from '../../../models';

/** Shell of the whole widget: the buttons column plus the list panel. */
export const SHELL_BASE = 'flex items-stretch gap-3';

/** List panel: the scrollable surface holding the options. No frame — the rows carry their own rules. */
export const PANEL_BASE = 'flex min-w-0 flex-1 flex-col bg-surface';

/** One option row. */
export const OPTION_BASE = [
  'flex w-full items-center gap-2 border-b border-border/60 text-left transition-colors duration-150 ease-in-out',
  'focus:outline-none'
].join(' ');

/** Padding and text size of an option row, per control size. */
export const OPTION_SIZE: Readonly<Record<TailwindSize, string>> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-sm',
  lg: 'px-3.5 py-2.5 text-base',
  xl: 'px-4 py-3 text-base'
};

/** Drop indicator drawn on the row the pointer is currently over. */
export const DROP_TARGET = 'ring-2 ring-inset ring-primary-400';
