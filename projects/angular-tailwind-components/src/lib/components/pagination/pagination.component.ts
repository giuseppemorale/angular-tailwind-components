import { Component, computed, inject, input, model, output } from '@angular/core';
import { TailwindOption } from '../../models';
import { TAILWIND_PAGINATION_SUMMARY } from '../../tokens';
import { TailwindSelect } from '../select/select.component';
import { TailwindComponent } from '../tailwind.component';
import { Pagination } from './interfaces/pagination.interface';
export type { Pagination };

export const DEFAULT_PAGINATION_LENGTH_OPTIONS = [5, 10, 25, 50] as const;

@Component({
  selector: 'tailwind-pagination',
  imports: [TailwindSelect],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class TailwindPagination extends TailwindComponent {
  private readonly tailwindPaginationSummary = inject(TAILWIND_PAGINATION_SUMMARY, { optional: true });

  readonly totalItems = input.required<Pagination['totalItems']>();
  readonly pageSize = model<Pagination['pageSize']>(10);
  readonly lengthOptions = input<readonly number[]>([...DEFAULT_PAGINATION_LENGTH_OPTIONS]);
  readonly currentPage = model<Pagination['currentPage']>(1);
  readonly ariaLabel = input<Pagination['ariaLabel']>('Pagination');
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

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
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
