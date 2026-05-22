export interface Pagination {
  readonly totalItems: number;
  readonly pageSize: number;
  readonly currentPage: number;
  readonly ariaLabel: string;
  readonly summary: string;
  readonly lengthOptions?: readonly number[];
}
