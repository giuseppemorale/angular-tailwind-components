import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'tailwind-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class TailwindPagination {
  readonly totalItems = input.required<number>();
  readonly pageSize = input<number>(10);
  readonly currentPage = model<number>(1);
  readonly maxVisible = input<number>(7);
  readonly ariaLabel = input<string>('Pagination');
  readonly showSummary = input<boolean>(false);
  readonly summaryTemplate = input<string>('Showing {start}-{end} of {total}');

  readonly pageChanged = output<number>();

  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisible();
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    const half = Math.floor((max - 4) / 2);
    let start = Math.max(2, current - half);
    let end = Math.min(total - 1, current + half);
    if (current <= half + 2) { end = max - 2; }
    if (current >= total - half - 1) { start = total - max + 3; }
    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push(-1);
    pages.push(total);
    return pages;
  });

  readonly summaryText = computed(() => {
    const total = this.totalItems();
    if (total === 0) return this.summaryTemplate().replace('{start}', '0').replace('{end}', '0').replace('{total}', '0');
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), total);
    return this.summaryTemplate()
      .replace('{start}', start.toString())
      .replace('{end}', end.toString())
      .replace('{total}', total.toString());
  });

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChanged.emit(page);
    }
  }
}
