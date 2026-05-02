import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'atc-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class AtcPagination {
  totalPages = input.required<number>();
  currentPage = model<number>(1);
  maxVisible = input<number>(7);
  ariaLabel = input<string>('Pagination');
  pageChanged = output<number>();

  visiblePages = computed(() => {
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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.pageChanged.emit(page);
    }
  }
}
