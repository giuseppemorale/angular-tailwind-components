import { ChangeDetectionStrategy, Component, computed, inject, input, model, output } from '@angular/core';
import { TailwindOption } from '../../models';
import { TAILWIND_PAGINATION_SUMMARY, TAILWIND_LABELS } from '../../tokens';
import { TailwindSelect } from '../select/select.component';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';
import { Pagination } from './interfaces/pagination.interface';
export type { Pagination };

export const DEFAULT_PAGINATION_LENGTH_OPTIONS = [5, 10, 25, 50] as const;

@Component({
  selector: 'tailwind-pagination',
  imports: [TailwindSelect, TailwindButton],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindPagination extends TailwindComponent {
  private readonly labels = inject(TAILWIND_LABELS);

  /** Accessible name override; defaults to `TAILWIND_LABELS.rowsPerPage`. */
  readonly rowsPerPageAriaLabel = input<string>('');
  protected readonly rowsPerPageLabel = computed(() => this.rowsPerPageAriaLabel() || this.labels.rowsPerPage);

  /** Accessible name override; defaults to `TAILWIND_LABELS.previousPage`. */
  readonly previousPageAriaLabel = input<string>('');
  protected readonly previousPageLabel = computed(() => this.previousPageAriaLabel() || this.labels.previousPage);

  /** Accessible name override; defaults to `TAILWIND_LABELS.nextPage`. */
  readonly nextPageAriaLabel = input<string>('');
  protected readonly nextPageLabel = computed(() => this.nextPageAriaLabel() || this.labels.nextPage);

  private readonly tailwindPaginationSummary = inject(TAILWIND_PAGINATION_SUMMARY, { optional: true });

  readonly totalItems = input.required<Pagination['totalItems']>();
  readonly pageSize = model<Pagination['pageSize']>(10);
  readonly lengthOptions = input<readonly number[]>([...DEFAULT_PAGINATION_LENGTH_OPTIONS]);
  readonly currentPage = model<Pagination['currentPage']>(1);
  readonly ariaLabel = input<Pagination['ariaLabel']>('');
  protected readonly navAriaLabel = computed(() => this.ariaLabel() || this.labels.pagination);
  /** Placeholders `{start}`, `{end}`, `{total}`; default from `TAILWIND_PAGINATION_SUMMARY` or English copy. */
  readonly summary = input<Pagination['summary']>(this.tailwindPaginationSummary ?? 'Showing {start}-{end} of {total}');

  readonly onPageChange = output<number>();
  readonly onPageSizeChange = output<number>();

  readonly pageSizeOptions = computed(() => {
    const options = [...this.lengthOptions()];
    const current = this.pageSize();
    if (!options.includes(current)) {
      options.push(current);
      options.sort((a, b) => a - b);
    }
    return options;
  });

  readonly pageSizeSelectOptions = computed((): TailwindOption<number>[] =>
    this.pageSizeOptions().map(size => ({ value: size, label: String(size) }))
  );

  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  /**
   * How many page buttons to render around the current one. The full list is only rendered while it
   * fits: without a window, a 10.000-row table at 10 per page renders 1.000 buttons.
   */
  readonly maxVisiblePages = input<number>(7);

  /**
   * Page buttons to render: the first page, the last page, a window around the current one, and
   * `null` where a gap was collapsed (rendered as an ellipsis).
   */
  readonly visiblePages = computed<(number | null)[]>(() => {
    const total = this.totalPages();
    const max = Math.max(5, this.maxVisiblePages());
    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const current = this.currentPage();
    // Reserve two slots for the first/last page and two for the ellipses.
    const windowSize = max - 4;
    let start = Math.max(2, current - Math.floor(windowSize / 2));
    const end = Math.min(total - 1, start + windowSize - 1);
    start = Math.max(2, end - windowSize + 1);

    const pages: (number | null)[] = [1];
    if (start > 2) pages.push(null);
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push(null);
    pages.push(total);
    return pages;
  });

  readonly summaryText = computed(() => {
    const total = this.totalItems();
    if (total === 0) return this.summary().replace('{start}', '0').replace('{end}', '0').replace('{total}', '0');
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    return this.summary()
      .replace('{start}', start.toString())
      .replace('{end}', end.toString())
      .replace('{total}', total.toString());
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.onPageChange.emit(page);
    }
  }

  pageButtonAriaLabel(page: number): string {
    const label = this.labels.page.replace('{page}', String(page));
    return page === this.currentPage() ? `${label}, ${this.labels.currentPage}` : label;
  }

  onPageSizeValueChange(value: number | number[] | null): void {
    if (typeof value !== 'number') return;
    this.setPageSize(value);
  }

  setPageSize(size: number): void {
    if (!Number.isFinite(size) || size <= 0 || size === this.pageSize()) return;
    this.pageSize.set(size);
    this.onPageSizeChange.emit(size);
    if (this.currentPage() !== 1) {
      this.currentPage.set(1);
      this.onPageChange.emit(1);
    }
  }
}
