import { InjectionToken, type Signal } from '@angular/core';

/** Implemented by `TailwindTable`; used for typing when calling `sort()` from TypeScript. */
export interface TailwindTableSortHost {
  sort(key: string): void;
  readonly sortKey: Signal<string>;
  readonly sortDir: Signal<'asc' | 'desc'>;
}

/**
 * Lets `[tailwindSortHeader]` reach its owning table through DI.
 *
 * The `<thead>` is written in the consumer's template but declared inside `<tailwind-table>`, and
 * the element injector follows the declaration tree — so a `<th>` inside the projected header
 * resolves the table that projects it, with no DOM traversal or observers involved.
 */
export const TAILWIND_TABLE_SORT_HOST = new InjectionToken<TailwindTableSortHost>('TAILWIND_TABLE_SORT_HOST');

/** Selection surface a header cell needs to drive a "select all" checkbox. */
export interface TailwindTableSelectionHost {
  readonly allFilteredSelected: Signal<boolean>;
  readonly someFilteredSelected: Signal<boolean>;
  toggleAllFiltered(): void;
}

/** Same DI channel as {@link TAILWIND_TABLE_SORT_HOST}, for `[tailwindSelectAllHeader]`. */
export const TAILWIND_TABLE_SELECTION_HOST = new InjectionToken<TailwindTableSelectionHost>(
  'TAILWIND_TABLE_SELECTION_HOST'
);
