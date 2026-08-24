export interface Pagination {
  readonly totalItems: number;
  readonly pageSize: number;
  readonly currentPage: number;
  /** Optional: falls back to `TAILWIND_LABELS.pagination`. */
  readonly ariaLabel?: string;
  /** Optional: falls back to `TAILWIND_PAGINATION_SUMMARY` or the built-in English template. */
  readonly summary?: string;
  readonly lengthOptions?: readonly number[];
}
