/**
 * App-wide UI strings used by components that render text or accessible names on their own
 * (close buttons, pagination controls, table empty state, …).
 *
 * Override any subset through `provideTailwindConfig(() => ({ LABELS: { close: 'Chiudi' } }))`;
 * omitted keys fall back to {@link DEFAULT_TAILWIND_LABELS}.
 *
 * Component inputs (e.g. `closeLabel` on `tailwind-modal`) still win over these defaults.
 */
export interface TailwindLabels {
  // ── Overlays ───────────────────────────────────────────────────────────────
  /** Accessible name of the close button in modal and drawer. */
  close: string;
  /** Accessible name of the dismiss button in alert and toast. */
  dismiss: string;

  // ── Navigation ─────────────────────────────────────────────────────────────
  /** Accessible name of the "previous" control (calendar month, stepper, …). */
  previous: string;
  /** Accessible name of the "next" control. */
  next: string;
  /** Accessible name of the previous-page button in pagination. */
  previousPage: string;
  /** Accessible name of the next-page button in pagination. */
  nextPage: string;
  /** Accessible name of the page-size selector in pagination. */
  rowsPerPage: string;
  /** Accessible name of a page button, `{page}` replaced with the page number. */
  page: string;
  /** Appended to the current page button's accessible name. */
  currentPage: string;
  /** Accessible name of the pagination landmark. */
  pagination: string;
  /** Accessible name of the "scroll tabs left" affordance. */
  scrollTabsLeft: string;
  /** Accessible name of the "scroll tabs right" affordance. */
  scrollTabsRight: string;
  /** Accessible name of the toolbar navigation toggle. */
  openNavigationMenu: string;

  // ── Table ──────────────────────────────────────────────────────────────────
  /** Visible label of the table search field. */
  search: string;
  /** Placeholder of the table search field. */
  searchPlaceholder: string;
  /** Message shown when a table has no rows. */
  noData: string;
  /** Text shown next to the loading spinner. */
  loading: string;
  /** Accessible name of a sortable column, `{column}` replaced with the sort key. */
  sortBy: string;
  /** Accessible name of a column sorted ascending. */
  sortedAscending: string;
  /** Accessible name of a column sorted descending. */
  sortedDescending: string;
  /** Accessible name of the "select all rows" checkbox. */
  selectAll: string;

  // ── Generic ────────────────────────────────────────────────────────────────
  /** Message shown in an autocomplete panel that matched nothing. */
  noResults: string;
  /** Label of the "clear" affordance (upload, filters, …). */
  clear: string;
  /** Label of the "today" shortcut in date pickers. */
  today: string;
}

export const DEFAULT_TAILWIND_LABELS: TailwindLabels = {
  close: 'Close',
  dismiss: 'Dismiss',

  previous: 'Previous',
  next: 'Next',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  rowsPerPage: 'Rows per page',
  page: 'Page {page}',
  currentPage: 'current page',
  pagination: 'Pagination',
  scrollTabsLeft: 'Scroll tabs left',
  scrollTabsRight: 'Scroll tabs right',
  openNavigationMenu: 'Open navigation menu',

  search: 'Search',
  searchPlaceholder: 'Search…',
  noData: 'No data available',
  loading: 'Loading…',
  sortBy: 'Sort by {column}',
  sortedAscending: 'Sorted ascending, activate to reverse',
  sortedDescending: 'Sorted descending, activate to reverse',
  selectAll: 'Select all rows',

  noResults: 'No results',
  clear: 'Clear',
  today: 'Today'
};

/** Merges consumer overrides onto {@link DEFAULT_TAILWIND_LABELS}. */
export function resolveTailwindLabels(overrides?: Partial<TailwindLabels>): TailwindLabels {
  return { ...DEFAULT_TAILWIND_LABELS, ...overrides };
}
