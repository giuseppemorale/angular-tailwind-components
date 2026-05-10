import type { Signal } from '@angular/core';

/** Implemented by `TailwindTable`; used for typing when calling `sort()` from TypeScript. */
export interface TailwindTableSortHost {
  sort(key: string): void;
  readonly sortKey: Signal<string>;
  readonly sortDir: Signal<'asc' | 'desc'>;
}
