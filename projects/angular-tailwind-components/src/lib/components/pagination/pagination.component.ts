import { Component, computed, input, model, output } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import { Pagination } from './interfaces/pagination.interface';
export type { Pagination };

@Component({
  selector: 'tailwind-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class TailwindPagination extends TailwindComponent {
  readonly totalItems = input.required<Pagination['totalItems']>();
  readonly pageSize = input<Pagination['pageSize']>(10);
  readonly currentPage = model<Pagination['currentPage']>(1);
  readonly ariaLabel = input<Pagination['ariaLabel']>('Pagination');
  readonly summary = input<Pagination['summary']>('Showing {start}-{end} of {total}');

  readonly onPageChange = output<number>();

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
}
